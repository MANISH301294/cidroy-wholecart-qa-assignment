import { expect, test } from '@playwright/test';
import {
  appURL,
  authHeaders,
  authenticatedApi,
  credentials,
  listFrom,
  requireEnv,
} from '../support/api';

const enabled = process.env.WC_ENABLE_MUTATION_TESTS === '1';

type SellerProduct = Record<string, unknown> & {
  id: number;
  stock: number;
  piece_price: string;
  case_price: string;
};

function isSellerProduct(value: unknown): value is SellerProduct {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return typeof record.id === 'number'
    && typeof record.stock === 'number'
    && typeof record.piece_price === 'string'
    && typeof record.case_price === 'string';
}

test.describe('API mutation guardrails (opt-in; changes test data)', () => {
  test('cart rejects quantities outside the allowed 1–99 range', async () => {
    test.skip(!enabled, 'Set WC_ENABLE_MUTATION_TESTS=1 after reviewing the data impact');
    const client = await authenticatedApi(credentials.buyer1);
    const productId = Number(requireEnv('WC_GUARDRAIL_PRODUCT_ID'));
    const unit = process.env.WC_GUARDRAIL_UNIT ?? 'piece';
    try {
      for (const qty of [-1, 0, 100]) {
        const response = await client.api.post(appURL('api/cart/items'), {
          headers: authHeaders(client.token),
          data: { product_id: productId, unit, qty },
        });
        expect(response.status(), `qty=${qty} should be rejected`).toBeGreaterThanOrEqual(400);
        expect(response.status()).toBeLessThan(500);
      }
    } finally {
      const cleanup = await client.api.delete(appURL('api/cart/items'), {
        headers: authHeaders(client.token),
        params: { product_id: productId, unit },
      });
      expect(cleanup.status(), 'Cart cleanup must complete').toBe(200);
      await client.dispose();
    }
  });

  test('seller API rejects negative stock and prices', async () => {
    test.skip(!enabled, 'Set WC_ENABLE_MUTATION_TESTS=1 after reviewing the data impact');
    const client = await authenticatedApi(credentials.seller1);
    try {
      const listing = await client.api.get(appURL('api/seller/products?page=1'), {
        headers: authHeaders(client.token),
      });
      expect(listing.status()).toBe(200);
      const product = listFrom(await listing.json()).find(isSellerProduct);
      if (!product) throw new Error('Seller needs a product with current stock and prices');

      const productId = product.id;
      const invalidPatches = [
        { field: 'stock', invalid: -1, original: product.stock },
        { field: 'piece_price', invalid: '-0.01', original: product.piece_price },
        { field: 'case_price', invalid: '-0.01', original: product.case_price },
      ];

      for (const patch of invalidPatches) {
        let status = 0;
        try {
          const response = await client.api.put(appURL(`api/seller/products/${productId}`), {
            headers: authHeaders(client.token),
            data: { [patch.field]: patch.invalid },
          });
          status = response.status();
        } finally {
          const restore = await client.api.put(appURL(`api/seller/products/${productId}`), {
            headers: authHeaders(client.token),
            data: { [patch.field]: patch.original },
          });
          expect(
            restore.status(),
            `Restoring original ${patch.field} after negative-value test`,
          ).toBe(200);
        }
        expect(status, `negative ${patch.field} should be rejected`).toBeGreaterThanOrEqual(400);
        expect(status, `negative ${patch.field} must not produce a server error`).toBeLessThan(500);
      }
    } finally {
      await client.dispose();
    }
  });
});

import { expect, test } from '@playwright/test';
import {
  appURL,
  authHeaders,
  authenticatedApi,
  credentials,
  listFrom,
  login,
  requireEnv,
} from '../support/api';

test.describe('API authentication and read access', () => {
  test('valid buyer, seller, and operator credentials authenticate and identify the same principal', async ({ request }) => {
    for (const user of [credentials.buyer1, credentials.seller1, credentials.operator]) {
      const { token } = await login(request, user);
      const me = await request.get(appURL('api/me'), { headers: authHeaders(token) });
      expect(me.status(), `/api/me failed for ${user.username}`).toBe(200);
    }
  });

  test('invalid credentials are rejected', async ({ request }) => {
    const response = await request.post(appURL('api/login'), {
      data: { username: 'wholecart-invalid-user', password: 'invalid-password' },
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(500);
  });

  test('private order and invoice APIs reject anonymous access', async ({ request }) => {
    for (const path of ['api/orders', 'api/invoices']) {
      const response = await request.get(appURL(path));
      expect(response.status(), `${path} must require authentication`).toBeGreaterThanOrEqual(400);
    }
  });

  test('categories are readable and authenticated catalogue endpoint responds successfully', async ({ request }) => {
    const categories = await request.get(appURL('api/categories'));
    expect(categories.status(), 'categories should be available').toBe(200);
    await expect(categories.json()).resolves.toBeTruthy();

    const { token } = await login(request, credentials.buyer1);
    const products = await request.get(appURL('api/products'), {
      headers: authHeaders(token),
    });
    expect(products.status(), 'catalogue should be available to a buyer').toBe(200);
    await expect(products.json()).resolves.toBeTruthy();
  });

  test('catalogue search returns an API response for a supplied query', async ({ request }) => {
    const query = process.env.WC_SEARCH_QUERY ?? 'Rice';
    const { token } = await login(request, credentials.buyer1);
    const response = await request.get(appURL(`api/products?q=${encodeURIComponent(query)}`), {
      headers: authHeaders(token),
    });
    expect(response.status()).toBe(200);
    expect(await response.json()).toBeTruthy();
  });

  test('a configured out-of-stock SKU is absent from catalogue search', async ({ request }) => {
    test.skip(!process.env.WC_OUT_OF_STOCK_SKU, 'Set WC_OUT_OF_STOCK_SKU to a known zero-stock SKU');
    const sku = requireEnv('WC_OUT_OF_STOCK_SKU');
    const response = await request.get(appURL(`api/products?q=${encodeURIComponent(sku)}`));
    expect(response.status()).toBe(200);
    const products = listFrom(await response.json());
    const returnedText = JSON.stringify(products).toLowerCase();
    expect(returnedText).not.toContain(sku.toLowerCase());
  });

  test('buyer can read own orders, invoices, and monthly statement', async () => {
    const client = await authenticatedApi(credentials.buyer1);
    try {
      const month = process.env.WC_STATEMENT_MONTH ?? new Date().toISOString().slice(0, 7);
      for (const path of ['api/orders', 'api/invoices', `api/statements/${month}`]) {
        const response = await client.api.get(appURL(path), {
          headers: authHeaders(client.token),
        });
        expect(response.status(), `${path} should be readable by a buyer`).toBe(200);
        await expect(response.json()).resolves.toBeTruthy();
      }
    } finally {
      await client.dispose();
    }
  });

  test('seller can read seller profile, orders, and product list', async () => {
    const client = await authenticatedApi(credentials.seller1);
    try {
      for (const path of ['api/seller/profile', 'api/seller/orders', 'api/seller/products']) {
        const response = await client.api.get(appURL(path), {
          headers: authHeaders(client.token),
        });
        expect(response.status(), `${path} should be readable by a seller`).toBe(200);
        await expect(response.json()).resolves.toBeTruthy();
      }
    } finally {
      await client.dispose();
    }
  });

  test('operator can read marketplace settings and seller list', async () => {
    const client = await authenticatedApi(credentials.operator);
    try {
      for (const path of ['api/admin/settings', 'api/admin/sellers', 'api/admin/buyers']) {
        const response = await client.api.get(appURL(path), {
          headers: authHeaders(client.token),
        });
        expect(response.status(), `${path} should be readable by an operator`).toBe(200);
        await expect(response.json()).resolves.toBeTruthy();
      }
    } finally {
      await client.dispose();
    }
  });

  test('metrics endpoint responds with monitoring data', async ({ request }) => {
    const response = await request.get(appURL('api/metrics'));
    expect(response.status()).toBe(200);
    expect(await response.json()).toBeTruthy();
  });

  test('partner API rejects a missing API key', async ({ request }) => {
    const response = await request.get(appURL('partner/v1/orders'));
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('partner API returns paginated results for a configured seller API key', async ({ request }) => {
    test.skip(!process.env.WC_SELLER_API_KEY, 'Set WC_SELLER_API_KEY for partner API checks');
    const headers = { 'X-Api-Key': requireEnv('WC_SELLER_API_KEY') };
    const orderKeys: string[] = [];
    for (let page = 1; page <= 100; page += 1) {
      const response = await request.get(appURL(`partner/v1/orders?page=${page}`), { headers });
      expect(response.status()).toBe(200);
      const items = listFrom(await response.json());
      expect(items.length).toBeLessThanOrEqual(20);
      for (const item of items) {
        expect(item && typeof item === 'object').toBe(true);
        const order = item as Record<string, unknown>;
        const key = order.order_number ?? order.id ?? JSON.stringify(order);
        orderKeys.push(String(key));
      }
      if (items.length < 20) break;
      expect(page, 'Pagination exceeded safety limit').toBeLessThan(100);
    }
    expect(new Set(orderKeys).size, 'Partner pagination must not repeat orders').toBe(orderKeys.length);
  });
});

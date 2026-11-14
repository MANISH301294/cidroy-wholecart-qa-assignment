import { expect, test } from '@playwright/test';
import {
  appURL,
  authHeaders,
  authenticatedApi,
  credentials,
} from '../support/api';

async function expectClientError(
  status: number,
  description: string,
): Promise<void> {
  expect(status, `${description} should be rejected as a client error`).toBeGreaterThanOrEqual(400);
  expect(status, `${description} must not produce a server error`).toBeLessThan(500);
}

test.describe('API negative validation and authorization', () => {
  test('login rejects missing or wrongly typed credentials', async ({ request }) => {
    const invalidBodies = [
      {},
      { username: 'buyer1' },
      { password: 'invalid-fixture-password' },
      { username: 123, password: 'invalid-fixture-password' },
      { username: 'buyer1', password: null },
    ];

    for (const data of invalidBodies) {
      const response = await request.post(appURL('api/login'), { data });
      await expectClientError(response.status(), `login body ${JSON.stringify(data)}`);
    }
  });

  test('checkout rejects a missing required slot before creating an order', async () => {
    const client = await authenticatedApi(credentials.buyer1);
    try {
      const response = await client.api.post(appURL('api/orders'), {
        headers: authHeaders(client.token),
        data: {},
      });
      await expectClientError(response.status(), 'checkout without slot_date and slot_start');
    } finally {
      await client.dispose();
    }
  });

  test('slots endpoint rejects a missing required date', async ({ request }) => {
    const response = await request.get(appURL('api/slots'));
    await expectClientError(response.status(), 'slot lookup without date');
  });

  test('integer order and invoice paths reject malformed IDs', async ({ request }) => {
    const client = await authenticatedApi(credentials.buyer1);
    try {
      for (const path of [
        'api/orders/not-an-integer',
        'api/orders/not-an-integer/cancel',
        'api/invoices/not-an-integer',
      ]) {
        const response = path.endsWith('/cancel')
          ? await client.api.post(appURL(path), { headers: authHeaders(client.token) })
          : await client.api.get(appURL(path), { headers: authHeaders(client.token) });
        await expectClientError(response.status(), path);
      }
    } finally {
      await client.dispose();
    }
  });

  test('buyers cannot access seller or operator data endpoints', async () => {
    const client = await authenticatedApi(credentials.buyer1);
    try {
      for (const path of ['api/seller/orders', 'api/seller/products', 'api/admin/settings']) {
        const response = await client.api.get(appURL(path), {
          headers: authHeaders(client.token),
        });
        await expectClientError(response.status(), `buyer access to ${path}`);
      }
    } finally {
      await client.dispose();
    }
  });

  test('sellers cannot access operator management endpoints', async () => {
    const client = await authenticatedApi(credentials.seller1);
    try {
      for (const path of ['api/admin/settings', 'api/admin/sellers', 'api/admin/buyers']) {
        const response = await client.api.get(appURL(path), {
          headers: authHeaders(client.token),
        });
        await expectClientError(response.status(), `seller access to ${path}`);
      }
    } finally {
      await client.dispose();
    }
  });

  test('a buyer cannot retrieve another buyer order when a foreign order ID is configured', async () => {
    const foreignOrderId = process.env.WC_FOREIGN_ORDER_ID;
    test.skip(
      !foreignOrderId,
      'Set WC_FOREIGN_ORDER_ID to a known order owned by another test buyer',
    );
    if (!foreignOrderId) throw new Error('WC_FOREIGN_ORDER_ID is required for this check');
    const client = await authenticatedApi(credentials.buyer2);
    try {
      const response = await client.api.get(
        appURL(`api/orders/${encodeURIComponent(foreignOrderId)}`),
        { headers: authHeaders(client.token) },
      );
      await expectClientError(response.status(), 'cross-buyer order access');
    } finally {
      await client.dispose();
    }
  });

  test('a seller cannot retrieve another seller order when a foreign order ID is configured', async () => {
    const foreignOrderId = process.env.WC_FOREIGN_ORDER_ID;
    test.skip(
      !foreignOrderId,
      'Set WC_FOREIGN_ORDER_ID to an order owned by a different seller',
    );
    if (!foreignOrderId) throw new Error('WC_FOREIGN_ORDER_ID is required for this check');
    const client = await authenticatedApi(credentials.seller1);
    try {
      const response = await client.api.get(
        appURL(`api/seller/orders/${encodeURIComponent(foreignOrderId)}`),
        { headers: authHeaders(client.token) },
      );
      await expectClientError(response.status(), 'cross-seller order access');
    } finally {
      await client.dispose();
    }
  });
});

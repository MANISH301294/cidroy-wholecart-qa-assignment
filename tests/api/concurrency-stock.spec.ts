import { expect, test } from '@playwright/test';
import {
  appURL,
  authHeaders,
  authenticatedApi,
  credentials,
  listFrom,
  requireEnv,
} from '../support/api';

type StockProduct = Record<string, unknown> & {
  id: number;
  stock: number;
  case_size: number;
};

type OrderLine = {
  product_id: number;
  pieces: number;
};

type TestOrder = {
  id: number;
  number: string;
  status: string;
  lines: OrderLine[];
};

function isStockProduct(value: unknown): value is StockProduct {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return typeof record.id === 'number'
    && typeof record.stock === 'number'
    && typeof record.case_size === 'number';
}

function parseOrder(value: unknown): TestOrder {
  if (!value || typeof value !== 'object') throw new Error('Order endpoint did not return an object');
  const order = value as Record<string, unknown>;
  if (
    typeof order.id !== 'number'
    || typeof order.number !== 'string'
    || typeof order.status !== 'string'
  ) throw new Error('Order response omitted its ID, number, or status');
  const lines = Array.isArray(order.lines)
    ? order.lines.flatMap((line): OrderLine[] => {
      if (!line || typeof line !== 'object') return [];
      const record = line as Record<string, unknown>;
      if (typeof record.product_id !== 'number' || typeof record.pieces !== 'number') return [];
      return [{ product_id: record.product_id, pieces: record.pieces }];
    })
    : [];
  return { id: order.id, number: order.number, status: order.status, lines };
}

test.describe('Stock concurrency, idempotency, and cancellation', () => {
  test('concurrent checkouts never oversell and cancellation returns stock', async () => {
    test.skip(
      process.env.WC_ENABLE_STOCK_CONCURRENCY !== '1',
      'Set WC_ENABLE_STOCK_CONCURRENCY=1 to run this controlled stock-changing test',
    );
    test.setTimeout(90_000);

    const productId = Number(requireEnv('WC_STOCK_TEST_PRODUCT_ID'));
    if (!Number.isInteger(productId) || productId <= 0) {
      throw new Error('WC_STOCK_TEST_PRODUCT_ID must be a positive integer');
    }

    const seller = await authenticatedApi(credentials.seller1);
    const buyers = await Promise.all([
      authenticatedApi(credentials.buyer1),
      authenticatedApi(credentials.buyer2),
      authenticatedApi(credentials.buyer3),
    ]);
    const buyerNames = ['buyer1', 'buyer2', 'buyer3'];
    const knownOrders = new Map<number, number>();
    const violations: string[] = [];
    let originalStock: number | undefined;
    let caseSize: number | undefined;

    const readSellerProduct = async (): Promise<StockProduct> => {
      const response = await seller.api.get(appURL('api/seller/products?page=1'), {
        headers: authHeaders(seller.token),
      });
      expect(response.status()).toBe(200);
      const product = listFrom(await response.json()).find(
        (item): item is StockProduct => isStockProduct(item) && item.id === productId,
      );
      if (!product) throw new Error(`Seller product ${productId} was not found on page 1`);
      return product;
    };

    const setStock = async (stock: number): Promise<void> => {
      const response = await seller.api.put(appURL(`api/seller/products/${productId}`), {
        headers: authHeaders(seller.token),
        data: { stock },
      });
      expect(response.status(), `Setting stock to ${stock} should succeed`).toBe(200);
    };

    const addCartLine = async (
      buyerIndex: number,
      qty: number,
      unit: 'piece' | 'case' = 'piece',
    ): Promise<void> => {
      const response = await buyers[buyerIndex].api.post(appURL('api/cart/items'), {
        headers: authHeaders(buyers[buyerIndex].token),
        data: { product_id: productId, unit, qty },
      });
      const body = await response.text();
      expect(
        response.status(),
        `${buyerNames[buyerIndex]} ${unit} cart setup for qty=${qty}: ${body}`,
      ).toBe(200);
    };

    const addCartPieces = async (buyerIndex: number, pieces: number): Promise<void> => {
      if (pieces <= 99) {
        await addCartLine(buyerIndex, pieces);
        return;
      }
      if (!caseSize) throw new Error('Product case_size is required to split quantity across units');
      const cases = Math.floor(pieces / caseSize);
      const remainingPieces = pieces % caseSize;
      if (cases > 0) await addCartLine(buyerIndex, cases, 'case');
      if (remainingPieces > 0) await addCartLine(buyerIndex, remainingPieces);
    };

    const clearTestCarts = async (): Promise<void> => {
      for (const buyer of buyers) {
        for (const unit of ['case', 'piece']) {
          const response = await buyer.api.delete(appURL('api/cart/items'), {
            headers: authHeaders(buyer.token),
            params: { product_id: productId, unit },
          });
          expect(response.status(), `${unit} cart cleanup must complete`).toBe(200);
        }
      }
    };

    const checkout = async (
      buyerIndex: number,
      date: string,
      start: string,
    ): Promise<{ status: number; body: string; orderIds: number[] }> => {
      const response = await buyers[buyerIndex].api.post(appURL('api/orders'), {
        headers: authHeaders(buyers[buyerIndex].token),
        data: { slot_date: date, slot_start: start },
      });
      const body = await response.text();
      const orderIds: number[] = [];
      if (response.status() === 200) {
        const payload: unknown = JSON.parse(body);
        if (!payload || typeof payload !== 'object') {
          throw new Error(`Checkout response for ${buyerNames[buyerIndex]} was not an object`);
        }
        const ids = (payload as Record<string, unknown>).order_ids;
        if (!Array.isArray(ids) || !ids.every((id) => typeof id === 'number')) {
          throw new Error(`Checkout response for ${buyerNames[buyerIndex]} omitted numeric order_ids`);
        }
        orderIds.push(...ids);
        for (const id of orderIds) knownOrders.set(id, buyerIndex);
      }
      return { status: response.status(), body, orderIds };
    };

    const readTestOrder = async (id: number, owner: number): Promise<TestOrder> => {
      const read = () => buyers[owner].api.get(appURL(`api/orders/${id}`), {
        headers: authHeaders(buyers[owner].token),
      });
      let response = await read();
      if (response.status() >= 500) {
        violations.push(`GET /api/orders/${id} returned HTTP ${response.status()}`);
        await new Promise((resolve) => setTimeout(resolve, 100));
        response = await read();
      }
      const body = await response.text();
      if (response.status() !== 200) {
        throw new Error(`Reading test order ${id} returned HTTP ${response.status()}: ${body}`);
      }
      return parseOrder(JSON.parse(body));
    };

    const readTestOrders = async (ids: number[]): Promise<TestOrder[]> => {
      const orders: TestOrder[] = [];
      for (const id of ids) {
        const owner = knownOrders.get(id);
        if (owner === undefined) throw new Error(`Test order ${id} has no recorded owner`);
        orders.push(await readTestOrder(id, owner));
      }
      return orders;
    };

    const cancelKnownOrders = async (): Promise<void> => {
      for (const [id, owner] of knownOrders) {
        const [order] = await readTestOrders([id]);
        if (order.status === 'cancelled') continue;
        const buyer = buyers[owner];
        const response = await buyer.api.post(appURL(`api/orders/${id}/cancel`), {
          headers: authHeaders(buyer.token),
        });
        const body = await response.text();
        expect(
          response.status(),
          `Cancel test order ${id}: ${body}`,
        ).toBe(200);
        const [cancelledOrder] = await readTestOrders([id]);
        expect(cancelledOrder.status, `Test order ${id} should be cancelled`).toBe('cancelled');
      }
    };

    const startDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const slotStart = process.env.WC_STOCK_TEST_SLOT ?? '17:00';

    try {
      const product = await readSellerProduct();
      originalStock = product.stock;
      caseSize = product.case_size;

      for (const [index, buyer] of buyers.entries()) {
        const response = await buyer.api.get(appURL('api/cart'), {
          headers: authHeaders(buyer.token),
        });
        expect(response.status()).toBe(200);
        const cart: unknown = await response.json();
        if (!cart || typeof cart !== 'object' || !Array.isArray((cart as Record<string, unknown>).lines)) {
          throw new Error(`${buyerNames[index]} cart response did not contain a lines array`);
        }
        const lines = (cart as Record<string, unknown>).lines as unknown[];
        expect(
          lines.length,
          `${buyerNames[index]} must start with an empty cart for safe cleanup`,
        ).toBe(0);
      }

      const slotsResponse = await buyers[0].api.get(
        appURL(`api/slots?date=${encodeURIComponent(startDate)}`),
        { headers: authHeaders(buyers[0].token) },
      );
      expect(slotsResponse.status()).toBe(200);
      const slotsPayload: unknown = await slotsResponse.json();
      if (!Array.isArray(slotsPayload)) throw new Error('Slot API did not return a list');
      const slots = slotsPayload.filter((slot): slot is { start: string; available: boolean } => {
        if (!slot || typeof slot !== 'object') return false;
        const record = slot as Record<string, unknown>;
        return typeof record.start === 'string' && typeof record.available === 'boolean';
      });
      expect(
        slots.some((slot) => slot.start === slotStart && slot.available),
        `${startDate} ${slotStart} must have capacity before the run`,
      ).toBe(true);

      const cases: Array<{ name: string; quantities: number[] }> = [
        { name: '80/20/30', quantities: [80, 20, 30] },
        { name: '100/20/30', quantities: [100, 20, 30] },
      ];

      for (const scenario of cases) {
        await setStock(100);
        for (const [index, qty] of scenario.quantities.entries()) {
          await addCartPieces(index, qty);
        }
        const responses = await Promise.all(
          buyers.map((_, index) => checkout(index, startDate, slotStart)),
        );
        for (const response of responses) {
          if (response.status < 200 || response.status >= 500) {
            violations.push(`${scenario.name} returned unexpected HTTP ${response.status}: ${response.body}`);
          }
        }
        const orderIds = [...new Set(responses.flatMap((response) => response.orderIds))];
        const created = await readTestOrders(orderIds);
        const piecesReserved = created.reduce(
          (sum, order) => sum + order.lines
            .filter((line) => line.product_id === productId)
            .reduce((lineSum, line) => lineSum + line.pieces, 0),
          0,
        );
        const afterProduct = await readSellerProduct();
        const historyStatuses = await Promise.all(buyers.map(async (buyer) => {
          const response = await buyer.api.get(appURL('api/orders'), {
            headers: authHeaders(buyer.token),
          });
          return response.status();
        }));
        console.log(JSON.stringify({
          scenario: scenario.name,
          requested: scenario.quantities,
          responses,
          historyStatuses,
          orders: created.map(({ number, status, lines }) => ({
            number,
            status,
            pieces: lines.filter((line) => line.product_id === productId)
              .reduce((sum, line) => sum + line.pieces, 0),
          })),
          piecesReserved,
          remainingStock: afterProduct.stock,
        }));
        if (created.length === 0) violations.push(`${scenario.name} placed no valid orders`);
        if (piecesReserved > 100) {
          violations.push(`${scenario.name} reserved ${piecesReserved} pieces with stock limited to 100`);
        }
        if (afterProduct.stock < 0) {
          violations.push(`${scenario.name} left inventory at ${afterProduct.stock}`);
        }
        if (historyStatuses.some((status) => status >= 500)) {
          violations.push(`${scenario.name} caused order history to return HTTP 5xx: ${historyStatuses}`);
        }
        await cancelKnownOrders();
        await clearTestCarts();
        const restoredScenarioStock = (await readSellerProduct()).stock;
        if (restoredScenarioStock !== 100) {
          violations.push(`${scenario.name} cancellation restored stock to ${restoredScenarioStock}, expected 100`);
          await setStock(100);
        }
      }

      await setStock(100);
      await addCartPieces(0, 20);
      const duplicateResponses = await Promise.all([
        checkout(0, startDate, slotStart),
        checkout(0, startDate, slotStart),
      ]);
      for (const response of duplicateResponses) {
        if (response.status < 200 || response.status >= 500) {
          violations.push(`Duplicate checkout returned unexpected HTTP ${response.status}: ${response.body}`);
        }
      }
      const duplicateOrders = await readTestOrders([
        ...new Set(duplicateResponses.flatMap((response) => response.orderIds)),
      ]);
      console.log(JSON.stringify({
        scenario: 'same checkout twice',
        responses: duplicateResponses,
        orderNumbers: duplicateOrders.map((order) => order.number),
      }));
      if (duplicateOrders.length !== 1) {
        violations.push(`Double submit created ${duplicateOrders.length} orders instead of exactly one`);
      }
      await cancelKnownOrders();
      await clearTestCarts();
      const duplicateRestoredStock = (await readSellerProduct()).stock;
      if (duplicateRestoredStock !== 100) {
        violations.push(`Duplicate checkout cancellation restored stock to ${duplicateRestoredStock}, expected 100`);
        await setStock(100);
      }

      await setStock(100);
      await addCartPieces(0, 100);
      const buyer1Response = await checkout(0, startDate, slotStart);
      if (buyer1Response.status !== 200) {
        violations.push(`Buyer1's 100-piece purchase returned HTTP ${buyer1Response.status}`);
      }
      const buyer1Orders = await readTestOrders(buyer1Response.orderIds);
      const buyer1Order = buyer1Orders.find((order) => order.status === 'placed');
      if (!buyer1Order) violations.push('Buyer1 100-piece purchase did not create a placed order');
      await cancelKnownOrders();
      await clearTestCarts();
      const buyer1RestoredStock = (await readSellerProduct()).stock;
      console.log(JSON.stringify({
        scenario: 'buyer1 buys 100, cancels, then buyer2 buys',
        buyer1: buyer1Orders.map(({ number, status, lines }) => ({
          number,
          status,
          pieces: lines.filter((line) => line.product_id === productId)
            .reduce((sum, line) => sum + line.pieces, 0),
        })),
        stockAfterBuyer1Cancellation: buyer1RestoredStock,
      }));
      if (buyer1RestoredStock !== 100) {
        violations.push(`Buyer1 cancellation restored stock to ${buyer1RestoredStock}, expected 100`);
        await setStock(100);
      }

      await addCartPieces(1, 100);
      const buyer2Response = await checkout(1, startDate, slotStart);
      if (buyer2Response.status !== 200) {
        violations.push(`Buyer2's 100-piece purchase after cancellation returned HTTP ${buyer2Response.status}`);
      }
      const buyer2Orders = await readTestOrders(buyer2Response.orderIds);
      const buyer2Order = buyer2Orders.find((order) => order.status === 'placed');
      if (!buyer2Order) violations.push('Buyer2 could not buy 100 pieces after buyer1 cancelled');
      await cancelKnownOrders();
      await clearTestCarts();
      const buyer2RestoredStock = (await readSellerProduct()).stock;
      console.log(JSON.stringify({
        scenario: 'buyer2 purchase after buyer1 cancellation',
        buyer2: buyer2Orders.map(({ number, status, lines }) => ({
          number,
          status,
          pieces: lines.filter((line) => line.product_id === productId)
            .reduce((sum, line) => sum + line.pieces, 0),
        })),
        stockAfterBuyer2Cancellation: buyer2RestoredStock,
      }));
      if (buyer2RestoredStock !== 100) {
        violations.push(`Buyer2 cancellation restored stock to ${buyer2RestoredStock}, expected 100`);
        await setStock(100);
      }

    } finally {
      try {
        await cancelKnownOrders();
        await clearTestCarts();
        if (originalStock !== undefined) await setStock(originalStock);
      } finally {
        await Promise.all([...buyers.map((buyer) => buyer.dispose()), seller.dispose()]);
      }
    }

    expect(violations, 'Functional stock/idempotency violations').toEqual([]);
  });
});

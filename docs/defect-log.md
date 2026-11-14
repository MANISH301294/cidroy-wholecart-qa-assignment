# Defect log

Seven defects are verified. Broader marketplace workflows remain partially untested, so this is not a complete defect inventory.

## Release-note checks executed

- **CR-07 — Passed.** With the operator minimum at ₹2,000, a ₹1,999.99 net cart was rejected; ₹2,000.00 and ₹2,000.01 carts were accepted. Changing the setting to ₹2,000.01 immediately rejected a ₹2,000.00 cart; changing it to ₹1,999.99 immediately accepted that same net amount. Accepted orders WC-01067-1, WC-01068-1 and WC-01069-1 were cancelled. Original settings, product prices, and stock (161 pieces) were restored. Evidence: [CR-07 run log](../evidence/api-logs/CR-07-minimum-order-boundary.log).
- **CR-09 — Failed.** Six invoices visible to buyer2 and buyer3 were checked through the API; all six omitted supply-type and place-of-supply fields. On the cross-state invoice INV-00005 / WC-01005-1, the buyer and seller GSTINs have different state prefixes. The change request requires supply type B2B and the place-of-supply state name and code derived from the buyer GSTIN. Neither line appears on the invoice screen or in the invoice API response. The screen also omits the seller GSTIN required by BR-19. Evidence: [invoice screenshot](../evidence/screenshots/CR-09-invoice-missing-supply-details.png), [invoice API response](../evidence/api-logs/CR-09-invoice-api-response.json), and [six-invoice API audit](../evidence/api-logs/CR-09-invoice-audit.json).

## Reproducing the API findings

Run these steps only against the assigned demo copy, not a production marketplace. The application base URL is `the assigned demo URL`; use the supplied test accounts. The inventory test uses seller1's product ID `1`, three buyers, and stock temporarily set to 100. It requires all three carts to start empty and an available slot for tomorrow at 17:00. It captures the current stock, cancels the orders it creates, clears its test carts, and restores the captured stock in cleanup. Cancelled test orders remain in order history.

From the project directory, install dependencies if needed and run:

```sh
npm ci
WC_ENABLE_STOCK_CONCURRENCY=1 \
WC_STOCK_TEST_PRODUCT_ID=1 \
WC_STOCK_TEST_SLOT=17:00 \
npm run test:api -- --grep 'concurrent checkouts never oversell' --workers=1
```

The test is expected to exit non-zero while WC-004, WC-005, or WC-006 reproduce. The latest captured run is [WC-004-WC-006-stock-idempotency-history.log](../evidence/api-logs/WC-004-WC-006-stock-idempotency-history.log). It contains HTTP responses, order numbers, per-scenario reserved pieces and stock, order-history status codes, and the final failed assertions. After this run, a separate history read returned HTTP 200 for all three buyers; product stock was 161 and all ten test orders were cancelled. The endpoint URL defaults to the assigned copy; override `WC_BASE_URL` only when explicitly testing another authorized copy.

| ID | Severity | Requirement | Summary | Preconditions / data | Reproduction | Expected | Actual | Evidence | Status |
|---|---|---|---|---|---|---|---|---|---|
| WC-001 | S4 Minor | General UI quality | Application requests a missing root favicon | Open WholeCart login page in Chromium; no login required | 1. Navigate to `the assigned demo URLlogin`. 2. Inspect browser console/network. | Favicon request should succeed or app should not request a missing resource. | `GET the demo host/favicon.ico` returns HTTP 404 and logs a browser error. | [Captured console log](../evidence/api-logs/console-2026-11-14T08-04-01-114Z.log) | Open |
| WC-002 | S4 Minor | §5.2 Checkout | Checkout success message omits required wording and order number | Buyer1; product 478; 11 cases; delivery 2026-11-15 08:00–11:00 | 1. Add 11 cases of SKU-0478 (net ₹2,023.78). 2. Place the order. 3. Observe order-history success message. | Show “Your order has been placed. Order number: {numbers}”. | Shows only “Order placed!”; order number is present in the history table, not in the success message. | [Success-message screenshot](../evidence/screenshots/WC-002-order-success-message.png) | Open |
| WC-003 | S4 Minor | BR-13, BR-14, BR-17 | Invalid actions remain enabled on a cancelled order | Buyer1; order WC-01011-1, subsequently cancelled | 1. Open order WC-01011-1. 2. Cancel it. 3. Re-open/inspect the order detail. | Cancelled order should not offer cancellation, slot change/redelivery, or refund/exchange actions; reorder remains valid. | “Cancel order”, “Change slot”, “Request redelivery”, and “Send request” remain enabled for the cancelled order. Backend acceptance of these actions was not tested. | [Cancelled-order screenshot](../evidence/screenshots/WC-003-cancelled-order-actions.png) | Open |
| WC-004 | S1 Blocker | BR-01 | Concurrent checkout oversells seller inventory | Seller1 product 1; stock set to 100; three buyers; same future 17:00 slot | 1. Set stock to 100. 2. Prepare buyer carts for 80, 20 and 30 pieces. 3. Submit the three `POST /api/orders` requests concurrently. 4. Read the resulting orders and seller stock. Repeat with quantities 100, 20 and 30 (100 represented as 8 cases plus 4 pieces due BR-03). | Checkout must atomically reserve no more than 100 pieces; later/losing orders must be rejected and stock must never go negative. | In the captured run, all checkouts returned HTTP 200. WC-01057-1 (80), WC-01059-1 (20), WC-01058-1 (30) reserved 130 and left stock `-30`. WC-01060-1 (100), WC-01062-1 (20), WC-01061-1 (30) reserved 150 and left stock `-50`. Reproduced in repeated runs. | [Captured API run](../evidence/api-logs/WC-004-WC-006-stock-idempotency-history.log); test cancellations returned inventory to 100 between scenarios and cleanup restored the original stock. | Open |
| WC-005 | S1 Blocker | BR-10 | Concurrent duplicate checkout creates duplicate orders | Buyer1 cart with 20 pieces; same delivery date/slot; stock 100 | 1. Add 20 pieces to the cart. 2. Send two `POST /api/orders` requests concurrently with the same buyer, cart and slot. 3. Compare returned order IDs/numbers and buyer history. | A double-submit must create one order, not two. | Both requests returned HTTP 200 and created distinct orders WC-01063-1 and WC-01064-1 (order IDs 64 and 65). Both were subsequently cancelled during test cleanup. | [Captured API run](../evidence/api-logs/WC-004-WC-006-stock-idempotency-history.log) contains both `order_ids` and order numbers; cleanup restores stock. | Open |
| WC-006 | S3 Major | BR-21 / API reliability | Buyer order-history endpoint intermittently returns HTTP 500 after concurrent checkouts | Same three-buyer stock scenarios as WC-004; immediately query each buyer's `GET /api/orders` after checkout | 1. Run the controlled three-buyer checkout race. 2. Immediately request `/api/orders` concurrently for buyer1, buyer2 and buyer3. 3. Repeat with the second quantity mix. | Each buyer should receive HTTP 200 and their own order history; transient checkout load must not produce server errors. | In the captured run, the 80/20/30 scenario returned history statuses `[500, 200, 200]`; the 100/20/30 scenario returned `[200, 500, 200]`. These correspond to buyer1 and buyer2 respectively. Recheck on subsequent runs because the failure is intermittent. | [Captured API run](../evidence/api-logs/WC-004-WC-006-stock-idempotency-history.log), `historyStatuses` fields. | Open |
| WC-007 | S1 Blocker | CR-09, BR-19 | Tax invoice omits mandatory supply information and seller GSTIN on screen | Buyer2; delivered invoice INV-00005 / order WC-01005-1; buyer and seller GSTINs with different state prefixes | 1. Sign in as buyer2. 2. Open Invoices and view INV-00005. 3. Compare the rendered invoice and `GET /api/invoices/5` with CR-09 and BR-19. 4. Check the API detail for all six invoices visible to buyer2/buyer3. | Invoice must show Supply type: B2B; place of supply with the state name and code derived from the buyer GSTIN; and the seller's GSTIN. | UI invoice shows neither CR-09 line nor seller GSTIN. API response includes seller GSTIN in its seller object but has no supply-type or place-of-supply fields. All six audited invoice API responses omit both supply fields. CR-09 states invoices without its two required lines are not valid for input tax credit. | [Invoice screenshot](../evidence/screenshots/CR-09-invoice-missing-supply-details.png); [invoice API response](../evidence/api-logs/CR-09-invoice-api-response.json); [six-invoice API audit](../evidence/api-logs/CR-09-invoice-audit.json). | Open |

## Severity guide

- **S1 Blocker:** data exposure, materially incorrect order/payment/tax, overselling, or broad outage.
- **S2 Critical:** major core flow unavailable or incorrect with no practical workaround.
- **S3 Major:** important feature/rule broken with workaround.
- **S4 Minor:** limited UI, content, or low-impact behavior issue.

For each finding attach role/account (never credentials), UTC timestamp and store-clock time, request/response or screenshot, test data/order numbers, environment, exact steps, expected/actual result, severity rationale and reproducibility.

## Integration findings

- **WC-019 · S3 Major** · CSV import reports malformed rows as imported and omits row errors. [Mixed file](../defect-reports/triage/CSV-04.md) · [Invalid fields](../defect-reports/triage/CSV-05.md)
- **WC-020 · S3 Major** · Logistics CSV reverses the accepted order’s delivery slot times. [Reproduction and evidence](../defect-reports/triage/LOG-SLOT.md)

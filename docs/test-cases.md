# WholeCart test specification and coverage matrix

**Status:** mixed. The executed API smoke, negative-value, concurrency/idempotency and selected refund checks are recorded below; all other scenarios remain designed-only unless explicitly reported.

## Coverage matrix

| Area | Scenarios | Requirements | Automation in this package |
|---|---|---|---|
| Authentication and roles | Buyer/seller/operator login; anonymous access; cross-account data isolation | BR-21 | Login and unauthenticated reads automated; ownership assertions require seeded IDs |
| Catalogue/search | Search and category; sold-out filtering; seller-scoped same SKU | BR-02, IF-01 | Read smoke automated; stock/SKU assertions require known products |
| Cart | 1–99 line quantity, remove/update, piece/case prices, stock validation | BR-01, BR-03, §5.1 | Invalid quantity guardrail is opt-in; remaining cases require UI/data fixtures |
| Checkout/pricing | Per-seller min ₹2,000 net; tax rounding; low-value delivery fee; grand total | CR-07, BR-07, BR-08, BR-22 | CR-07 thresholds ₹1,999.99/₹2,000/₹2,000.01 passed; operator threshold changes took effect immediately. Other pricing cases remain untested. |
| Slots/order | Dates 0–7 days; time slots; capacity 5; same-day cutoff; order split/number; idempotency | BR-05–10 | Duplicate-submit test created two orders; order-history reads intermittently returned 500 after concurrent checkout. See WC-005/WC-006. Other checks need clock controls and stable fixtures. |
| Lifecycle | Buyer/seller cancellation; 5-minute boundary; allowed transitions; return stock | BR-11–15 | Sequential 100-piece cancel/rebuy passed and stock was restored; other lifecycle checks require reserved order IDs and clock control |
| Reorder/refund/exchange | Repeat reorder; delivered-only; full/partial quantities; tax-inclusive refund; no cash for exchange | BR-16–18 | Negative/zero/fractional/over-ordered partial quantities rejected; one valid partial amount checked and request rejected; full/exchange/approval behavior remains untested |
| Invoice/statement | Delivery issue; supply details; tax and total reconciliation; delivered month minus approved refunds | CR-09, BR-19–20 | CR-09 failed on all 6 buyer2/buyer3 invoice API records; INV-00005 UI omits B2B, Goa (30), and seller GSTIN. Statement reconciliation remains untested. |
| Seller/operator | Seller screens, product/stock, seller approval, settings, export columns/status scope | IF-02, BR-23, §5.5 | Read-only role smoke automated; mutation/export assertions require setup |
| CSV/partner API | Valid/invalid row reporting; SKU upsert; pagination exactly once; offer updates | IF-01, IF-03 | Missing partner key skips relevant test; import/updates are specified but not executed |
| Nonfunctional | 30-buyer checkout p95 ≤3s; search p95 ≤2s; >50 RPS returns 429 | NF-01–03 | Checkout load runner included; search and over-limit tests are intentionally not generated |

## Detailed scenarios

| ID | Priority | Test data / steps | Expected result | Reqs |
|---|---|---|---|---|
| AUTH-01 | P1 | Log in as buyer1, seller1 and operator; call `/api/me`. | All valid accounts authenticate; each returns its own principal. | Overview |
| AUTH-02 | P1 | Submit invalid username/password. | 4xx, no token; never 5xx. | Auth |
| AUTH-03 | P1 | Call `/api/orders` and `/api/invoices` without a bearer token. | Access denied; no buyer data in response. | BR-21 |
| AUTH-04 | P1 | Buyer A requests buyer B's order/invoice IDs; seller A requests seller B's order ID. | Denied or non-disclosing not-found; no foreign details. | BR-21 |
| CAT-01 | P1 | Set a product's stock to zero, then browse category and search by its name/SKU. | Product absent in both results. | BR-02 |
| CAT-02 | P2 | Search exact and partial names/SKUs, empty query, unknown term, page boundaries. | Relevant matches only; empty/unknown query behaves consistently; stable pagination. | API description |
| CAT-03 | P1 | Two sellers create the same SKU. | Both products coexist and each seller can update only its own SKU. | IF-01 |
| CART-01 | P1 | Add quantity 1; update to 99; try 0 and 100; use product page for >20. | 1 and 99 accepted, 0/100 rejected; cart dropdown only 1–20; greater quantities possible from product page. | BR-03, §5.1 |
| CART-02 | P1 | Set seller stock to 100 and concurrently check out 80/20/30, then 100/20/30, from three buyers. | Combined accepted quantity never exceeds stock; losing request sees a clear availability error. | BR-01 |
| CART-03 | P2 | Add a case-size product as piece and case; compare unit/case price, line total and cart net. | Correct unit and price; line total = quantity × unit price; net excludes tax. | BR-01, §5.1 |
| CHK-01 | P1 | One seller net ₹1,999.99; then ₹2,000.00; then ₹2,000.01. | First blocked; latter two accepted. CR-07 overrides BR-04. | CR-07 |
| CHK-02 | P1 | Checkout mixed products with two sellers; each seller net separately below/at threshold. | Minimum assessed independently per seller; one sub-order per seller. | CR-07, BR-09 |
| CHK-03 | P1 | Build taxable lines at each rate; test fractional-paisa edge values and multiple lines at same rate. | Sum net by rate, round half-up once per rate, then reconcile total. | BR-07 |
| CHK-04 | P1 | Seller net ₹2,899.99 versus ₹2,900.00; calculate delivery line. | Below ₹3,000, ₹100 plus ₹18 tax; at/above, no fee; fee shown separately. | BR-08, BR-22 |
| CHK-05 | P1 | Double-submit the same buyer cart concurrently. | Exactly one checkout and each expected seller sub-order; same order numbers or replay response. | BR-10 |
| SLOT-01 | P1 | Request slots for today and today + 7; attempt yesterday and today + 8. | Only today through +7 are bookable. | BR-05 |
| SLOT-02 | P1 | For today, test both afternoon slots immediately before, exactly at, and after configured cutoff; check morning slots. | Same-day only 14:00–17:00/17:00–20:00 and only before cutoff; UI disables unavailable slots with reason. | BR-05, BR-06, §5.2 |
| SLOT-03 | P1 | Fill a slot with 5 accepted orders; attempt a sixth, then cancel one and retry. | Sixth is unavailable while full; capacity updates immediately after cancellation. | BR-05, BR-23 |
| ORD-01 | P1 | Checkout from two sellers. | Order numbers use WC-checkout-suborder-index; sub-orders are indexed consistently. | BR-09 |
| ORD-02 | P1 | Cancel buyer order at 4:59.999, 5:00, and 5:00.001 after placement; repeat after shipment. | Cancel at or before 5:00 only while unshipped; stock returned once; shipped order cannot cancel. | BR-11 |
| ORD-03 | P1 | Seller cancels a placed/accepted order. | Buyer sees Cancelled immediately; order remains in history. | BR-12, BR-13 |
| ORD-04 | P1 | Exercise placed→accepted→shipped→delivered and shipped→delivery failed→redelivery requested→shipped. Try invalid transitions. | Only documented valid transitions; controls shown only when valid. | BR-13, §5.5 |
| ORD-05 | P1 | Change slot before shipment, after shipment; test date/cutoff/capacity; request redelivery after failed delivery. | Slot change only before ship; redelivery only after failure; BR-05/06 constraints apply. | BR-14, BR-15 |
| ORD-06 | P2 | Reorder same historical order twice; remove one product from catalogue or stock first. | Every original line added on every use; availability behavior is explicit and safe. | BR-16 |
| REF-01 | P1 | Request refund/exchange for placed, shipped and delivered order. | Only delivered order accepts request. | BR-17 |
| REF-02 | P1 | Full refund, partial quantities and over-ordered quantity on same line; approve/reject each. | Full includes all lines; partial is chosen lines/qty; aggregate refund/exchange qty never exceeds ordered qty. | BR-17, BR-18 |
| REF-03 | P1 | Refund quantities at 5% and 18%; exchange same quantities. | Refund includes paid tax; exchange replaces goods and returns no money. | BR-18 |
| INV-01 | P1 | Deliver an order with both rates and fee; compare invoice to checkout. | Issued on delivery; seller/buyer GSTIN/address, all lines, fee line, per-rate taxes, total = order total. | BR-07–08, BR-19 |
| INV-02 | P1 | Inspect all buyer2/buyer3 invoices via API and delivered invoice INV-00005 (buyer GSTIN prefix 30, seller prefix 27) in UI. | “B2B” and “Goa (30)” from buyer GSTIN must be shown; seller GSTIN must appear per BR-19. | CR-09, BR-19 |
| STMT-01 | P1 | Query statement for a month with delivered, cancelled, and approved-refund orders. | Delivered orders in month less approved refunds; cancelled excluded; amount reconciles. | BR-20 |
| SELL-01 | P1 | As each seller, list/read another seller's order and mutate its product/order. | Other seller data/action inaccessible. | BR-21 |
| CSV-01 | P1 | Import valid UTF-8 sample; then update existing SKU and import duplicate SKU across sellers. | Valid rows imported/updated by seller-scoped SKU; other seller not overwritten. | IF-01 |
| CSV-02 | P1 | Import mixed valid/invalid rows: missing columns, malformed number, invalid tax, duplicate seller SKU, bad UTF-8. | Valid rows handled; each invalid row reports line and reason; no row silently dropped. | IF-01 |
| PARTNER-01 | P1 | Read all partner order pages for one seller. | 20 per page; concatenated IDs contain every seller order exactly once and no foreign seller order. | IF-03, BR-21 |
| PARTNER-02 | P1 | PUT offer with valid/invalid price and stock; try foreign seller offer ID. | Own offer updates price/stock; invalid values rejected; foreign offer inaccessible. | IF-03 |
| LOG-01 | P1 | Export logistics CSV with placed, accepted, shipped, redelivery-requested, delivered and cancelled orders. | UTF-8; exact column order; only accepted/shipped/redelivery-requested; pieces count correct. | IF-02 |
| SET-01 | P1 | Change one operator setting and immediately repeat dependent action. | New value takes effect immediately; restore previous setting. | BR-23 |
| NFR-01 | P1 | With 30 unique buyers and prepared carts, submit 30 checkout requests concurrently; measure request latency. | p95 ≤3 seconds; no oversell, duplicates or invalid totals. | NF-01, BR-01, BR-10 |
| NFR-02 | P1 | Run representative search queries and measure p95. | p95 ≤2 seconds. | NF-02 |
| NFR-03 | P1 | Increase offered rate gradually, never exceed 50 RPS during this test. | Confirm no 429 at/below ceiling and monitor metrics; verify >50 RPS policy only in a separately approved isolated run. | NF-03 |
| UI-01 | P1 | Inspect empty/nonempty cart, checkout summaries and disabled slots. | Screen contents, hidden Proceed button, labels and reasons match §5.1–5.2. | §5.1–5.2 |
| UI-02 | P1 | Inspect buyer history ordering, cancellation, view and reorder. | Newest first; cancelled retained; actions/labels match requirements. | §5.3 |
| UI-03 | P1 | Inspect invoice, seller order list/action buttons. | Invoice fields match CR-09; seller list newest-first and requested delivery date/actions valid. | §5.4–5.5 |

## Negative-test coverage added

The runnable API suite includes malformed/missing login payloads, missing checkout slot fields, missing slot date, malformed integer resource IDs, buyer access attempts against seller/operator endpoints, seller attempts against operator endpoints, and an optional cross-buyer order-read check. UI checks verify invalid and empty login submissions do not navigate into the app. Negative cart quantities and seller stock/prices were rejected. Refund quantities `-1`, `0`, `3` for an ordered quantity of `2`, `1.5`, and `"-1"` all returned HTTP 400 without creating refund records. A valid partial refund for one of two line units was calculated at ₹2,063.38 including 5% tax, then rejected to preserve the seeded delivered order.

## Run status

The latest API smoke run passed 16 tests and skipped 7 fixture-dependent/opt-in checks; the UI login run passed 5 tests. Separate opt-in negative-value tests passed for cart quantities `-1`, `0`, `100` and seller stock/prices. CR-07 boundary and immediate-setting checks passed with original data restored. CR-09 checks on all six buyer-visible invoice API records failed as recorded in WC-007. The controlled inventory test reproduces WC-004/WC-005 and intermittent WC-006, then cancels test orders and restores stock. Seven defects are recorded in `defect-log.md`. Most lifecycle, invoice/statement, import/export and load cases remain unexecuted.

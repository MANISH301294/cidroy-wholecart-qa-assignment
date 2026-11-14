# WholeCart UI Requirement Coverage Matrix

**Specification:** WC-FDD-1.0-ce97  
**Approved changes:** WC-RN-1.0-ce97 (CR-07 and CR-09 override conflicting design text)  
**Environment:** Assigned `manish-dba39f` demo copy  
**Execution date:** 2026-11-14  
**Case sheet:** [UI test cases](ui-test-cases.csv)

## Status definitions

- **PASS:** The tested visible behavior matched the expected result for the observed data.
- **FAIL:** The tested visible behavior did not match the requirement.
- **PARTIAL:** Some UI behavior was observed, but the complete rule or boundary was not verified.
- **SKIPPED:** A blocker prevented the planned UI check; it is not a pass.
- **NOT RUN:** No UI execution evidence is recorded.
- **SUPERSEDED:** An approved release note replaces the original rule.
- **OUT OF SCOPE:** The requirement requires API/load testing rather than UI testing.

The UI case sheet contains **115 cases: 38 PASS, 23 FAIL, 21 PARTIAL, 5 SKIPPED, 27 NOT RUN, and 1 SUPERSEDED**. Eighty-two cases have execution evidence (PASS, FAIL, or PARTIAL). Five cases compare the actual UI with the five `docs/design` wireframes. API-only, metrics, rate-limit, and load-test cases are excluded. Do not infer backend behavior from UI controls or screenshots.

## Business rules

| Requirement | UI status | UI cases / evidence | UI coverage gap |
|---|---|---|---|
| BR-01 — Piece-based stock and no overselling | FAIL | CART-09/ORD-13; [overstock order](../evidence/screenshots/CART-09-overstock-order-placed.png) | Checkout accepted 201 pieces while the product page showed 161 in stock; the test order was canceled |
| BR-02 — Zero-stock products hidden | FAIL | CAT-02; [SKU-0073 search result](../evidence/screenshots/CAT-02-search-includes-SKU-0073.png) | SKU-0064 and SKU-0073 each showed zero stock on their product pages but remained in buyer search |
| BR-03 — Quantity per line 1–99 | PARTIAL | CART-03, CART-05, CART-06; [quantity 99](../evidence/screenshots/CART-03-quantity-99-valid.png) | 1 and 99 were accepted, 100 rejected, and 21 was added from the product page; the cart control is still a textbox rather than the specified 1–20 dropdown |
| BR-04 — ₹1,500 minimum | SUPERSEDED; CR-07 minimum FAIL | CHK-01, CHK-02; [checkout totals](../evidence/screenshots/CHK-02-two-seller-total-above-min-one-below.png); [release notes](../evidence/screenshots/OPS-14-release-notes-no-approved-extension.png) | CR-07 approves ₹2,000 net per seller. Checkout placed FreshFarm at ₹993.60 net while the combined seller net was ₹3,643.20; the sub-order was canceled. Exact threshold behavior remains untested. |
| BR-05 — Four slots, today through +7, capacity 5 | PARTIAL | SLOT-01, SLOT-02; [checkout date screenshot](../evidence/screenshots/UI-CHECKOUT-DATE-PLUS-7-SLOTS.png); settings snapshot | Today +7 was enabled, +8 disabled, and all four slot labels appeared; today/past boundaries and capacity-full behavior were not tested |
| BR-06 — Same-day afternoon slots before cutoff | FAIL | SLOT-03 through SLOT-05; [at-cutoff order](../evidence/screenshots/SLOT-04-order-accepted-at-cutoff.png) | Before-cutoff slots were available and after-cutoff slots were disabled; at exactly 10:00 an afternoon order was accepted |
| BR-07 — Tax aggregated by rate, rounded half-up once | PARTIAL | CHK-05/CHK-06, INV-03; [invoice calculations](../evidence/screenshots/) | Single-line 5% and 18% arithmetic was observed; multi-line rate aggregation was unavailable |
| BR-08 — Delivery fee below ₹3,000, separate invoice line | FAIL | CHK-03, INV-04/INV-05; [checkout and expired pilot banner](../evidence/screenshots/CHK-02-two-seller-total-above-min-one-below.png); [release notes](../evidence/screenshots/OPS-14-release-notes-no-approved-extension.png) | On 2026-11-14, a ₹2,649.60 Coastal sub-order showed ₹0 delivery although the checkout banner ended the OPS-14 pilot on 2026-10-31 and no extension was listed. The invoice also lacks the required separate fee line. |
| BR-09 — Checkout/sub-order number format | PASS | CHK-08; [multi-seller checkout](../evidence/screenshots/CHK-07-multi-seller-checkout-split.png) | `WC-01076-1` and `WC-01076-2` matched the expected two-seller suffix pattern; a three-seller sequence was not tested. |
| BR-10 — Duplicate checkout creates one order | PARTIAL | CHK-09; [double-click result](../evidence/screenshots/CHK-09-double-click-one-order.png) | A double-click created one observed order, WC-01075-1; the stock deduction count was not separately measured. |
| BR-11 — Buyer cancellation through 5:00 before shipment; retain order and return stock | PARTIAL | ORD-04, ORD-05 through ORD-11; [stock restored after cancellation](../evidence/screenshots/ORD-11-stock-restored-after-cancel.png) | Stock was visibly restored after one cancellation; timing boundaries and shipped-order behavior were not verified in UI |
| BR-12 — Seller cancellation immediately visible to buyer | NOT RUN | ORD-09 | No UI seller-cancel-to-buyer observation |
| BR-13 — Valid lifecycle transitions and cancellation before shipment | PARTIAL | ORD-03/ORD-04; seller order list | A placed seller row exposed Accept/Cancel; cancelled-order details still showed invalid actions; full lifecycle not run |
| BR-14 — Redelivery after failed delivery with a valid slot | PARTIAL | RED-01 through RED-06; cancelled-order screenshot | Redelivery action appeared on a cancelled order, but no failed-delivery/redelivery flow was executed |
| BR-15 — Slot change until shipment | PARTIAL | SLOT-10/SLOT-11; cancelled-order screenshot | Change slot was visible on a cancelled order; valid/invalid state transitions were not submitted |
| BR-16 — Reorder adds every past-order line on every use | PASS | ORD-12; [repeat reorder](../evidence/screenshots/ORD-12-repeat-reorder-doubles-quantity.png) | Two reorder actions for a 16-piece line resulted in 32 pieces; other historical multi-line cases were not tested. |
| BR-17 — Delivered-only refunds/exchanges and per-line quantity cap | PARTIAL | REF-01 through REF-10; [excess quantity rejected](../evidence/screenshots/REF-03-excess-quantity-rejected.png) | The UI rejected refund quantity 3 for a 2-piece order line; valid refund/exchange requests and seller decisions were not exercised |
| BR-18 — Tax-inclusive refunds; exchange returns no money; seller decision | NOT RUN | REF-01 through REF-10 | No refund/exchange UI approval, rejection, replacement, or payment flow verified |
| BR-19 — Invoice identity, lines, taxes, fee, total | FAIL | INV-02 through INV-05 and INV-CR09-STATE; [defect log](../defect-reports/defect-log.md) | Arithmetic and total reconciliation passed for two invoices; B2B, Goa (30), seller GSTIN, and separate fee line are missing |
| BR-20 — Monthly delivered-order statement less approved refunds | FAIL | INV-06 through INV-09; [November statement](../evidence/screenshots/INV-06-statement-includes-canceled-orders.png) | November statement included canceled orders and their amounts; refund deduction and month-boundary behavior remain unverified |
| BR-21 — Buyers/sellers see only their own records | FAIL | INV-10; AUTH-05 PARTIAL | Buyer1 opened another buyer’s invoice by direct URL. See [WC-021](../defect-reports/triage/INV-10.md). |
| BR-22 — Catalogue prices exclude tax; checkout shows per-seller tax/fee | PARTIAL | CAT-04/CAT-06, CART-10, CHK-02/CHK-03; [two-seller checkout](../evidence/screenshots/CHK-02-two-seller-total-above-min-one-below.png) | The two-seller summary showed net, tax, delivery, and totals; it incorrectly waived fee after OPS-14 expiry. Catalogue product detail price-before-tax behavior was not independently checked. CAT-06 found two distinct seller products sharing a SKU; CART-10 showed distinct piece/case cart lines. |
| BR-23 — Operator settings take effect immediately | PASS | OPS-01/SLOT-08; UI follow-up log | Capacity changed from 5 to 1 and disabled two same-day slots; restoring 5 made them selectable. Original value restored; no order submitted. |
| BR-24 — Fixed store clock available; real time is default | PASS | SLOT-03 through SLOT-05, SLOT-09; settings screenshot | Fixed times exercised same-day slot behavior, then real time was restored and saved |

## Integration requirements visible from UI

| Requirement | UI status | UI cases / evidence | UI coverage gap |
|---|---|---|---|
| IF-01 — Seller CSV import and row-level reporting | PARTIAL; CSV-04/05 FAIL | CSV-01 through CSV-07; [seller products screenshot](../evidence/screenshots/UI-SELLER-PRODUCTS-STOCK-AND-CSV.png); [CSV import run evidence](../evidence/api-logs/CSV-import-ui-observation.txt); WC-019 | CSV-01/02/03/06/07 passed; CSV-04/05 failed due misleading import counts and missing row-level errors |
| IF-02 — Logistics export schema and eligible rows | PARTIAL | LOG-01 through LOG-05; [downloaded CSV](../evidence/downloads/IF02-logistics-export-header-only.csv); [hourly run observation](../evidence/ui-observations/UI-regression-2026-11-15.txt) | Manual export decoded as UTF-8 and its header matched required order; the one row was not buyer3. Hourly run history was visible, but scheduled output schema and eligibility remain unverified |
| IF-03 — Partner API pagination and offer update | OUT OF SCOPE | API-01 through API-05 excluded from the UI sheet | Partner API is not a browser UI workflow |

## Non-functional requirements

| Requirement | UI status | UI cases / evidence | UI coverage gap |
|---|---|---|---|
| NF-01 — 30 simultaneous checkouts, 95% within 3 seconds | OUT OF SCOPE | CHK-12 excluded | Requires controlled load testing, not UI-only execution |
| NF-02 — Search p95 within 2 seconds | OUT OF SCOPE | NF-02 metrics/API case excluded | Requires performance measurement; UI search itself fails to filter (CAT-03) |
| NF-03 — Responsive layout | PARTIAL | NF-03; [buyer statement at 320px](../evidence/screenshots/NF-03-buyer-statement-320px.png) | The buyer statement had no horizontal overflow at 320px; seller and operator layouts and other breakpoints remain untested. |

## Screen requirements

The visual reference for screens 5.1–5.5 is the [captured `docs/design` wireframes](../evidence/screenshots/DOC-DESIGN-WIREFRAMES.png). Each screen has a dedicated comparison case in the UI CSV.

| Screen | UI status | UI cases / evidence | UI coverage gap |
|---|---|---|---|
| 5.1 Cart | Visual conformance FAIL; functional PARTIAL / FAIL | CART-01 through CART-09, DESIGN-51 | Quantity is a textbox rather than a 1–20 dropdown; net total and Proceed placement differ from the wireframe; checkout accepted a quantity above stock |
| 5.2 Checkout | Visual conformance PASS; functional PARTIAL / FAIL | CHK-02, CHK-03, CHK-07, CHK-08, CHK-10, SLOT-01, DESIGN-52 | Compared summary fields, date picker, slot radios, and button match; per-seller minimum was bypassed, expired-pilot delivery remained free, and confirmation wording fails. Two-seller totals were observed; three-seller checkout and all slot reasons were not tested. |
| 5.3 Order history | Visual conformance PASS; functional PARTIAL / FAIL | ORD-04, ORD-10, ORD-12, DESIGN-53; [order-history screenshot](../evidence/screenshots/UI-ORDER-HISTORY-DESIGN-CONFORMANCE.png) | Columns, actions, newest-first order, and cancelled rows match in the inspected view; invalid actions remain available on cancelled-order detail; repeat reorder was verified for one 16-piece line only. |
| 5.4 Invoice | FAIL | INV-02 through INV-05, INV-CR09-STATE, DESIGN-54 | Required CR-09 details and fee line are missing; total text is very low contrast; arithmetic totals matched for inspected invoices |
| 5.5 Seller order list | Visual conformance PASS for observed statuses; other behavior PARTIAL | DESIGN-55; [seller order-list screenshot](../evidence/screenshots/UI-SELLER-ORDERS-DESIGN-CONFORMANCE.png) | Columns and newest-first ordering match; placed rows show Accept/Cancel, while cancelled and delivered rows show no such actions; remaining status transitions and seller isolation not tested |

## Other UI features

The buyer inquiry entry point did not open a form (INQ-01 FAIL); inquiry validation/ownership, seller approval, full seller product editing, CSV Unicode/header validation, and end-to-end refund/exchange workflows remain unverified. In the two-seller checkout, one sub-order per seller was created; both orders (WC-01076-1 and WC-01076-2) were canceled after the observations ([order history](../evidence/screenshots/CHK-07-WC-01076-both-canceled.png)). The case sheet records remaining gaps individually.

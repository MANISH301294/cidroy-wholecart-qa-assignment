# WholeCart UI Execution Summary

**Environment:** Assigned `manish-dba39f` demo copy  
**Execution date:** 2026-11-14; follow-up run 2026-11-15
**Scope:** Browser UI only  
**Result:** UI defects were reproduced. This is not a release sign-off.

## Overall result

The UI case sheet contains **115 cases**:

- 36 PASS
- 22 FAIL
- 21 PARTIAL
- 4 SKIPPED
- 31 NOT RUN
- 1 SUPERSEDED by CR-07

Seventy-nine cases have execution evidence (PASS, FAIL, or PARTIAL). Five additional cases compare the live cart, checkout, buyer order history, invoice, and seller order list with the `docs/design` wireframes. Skipped and not-run cases are not passes. API-only and load-testing results are excluded from this UI report.

## Reproduced UI defects

- Login with both fields blank, username blank, or password blank shows raw validation JSON instead of clear required-field messages.
- Checkout accepted an order for 201 pieces when the product page showed 161 pieces in stock.
- Multi-seller checkout placed the FreshFarm sub-order at ₹993.60 net despite the approved CR-07 minimum of ₹2,000 per seller; the combined net was ₹3,643.20.
- Checkout still showed the OPS-14 free-delivery banner after its stated 2026-10-31 expiry and charged ₹0 on the Coastal sub-order at ₹2,649.60 net. The release notes list no approved OPS-14 extension.
- A same-day order was accepted at exactly the 10:00 cutoff, although the requirement says before 10:00.
- Zero-stock SKUs 0064 and 0073 remained visible in buyer search and product pages.
- The November 2026 monthly statement included canceled orders and their amounts.
- The buyer inquiry entry point did not open a form; `/inquiries` returned 404.
- Cart quantity is a textbox rather than the specified 1–20 dropdown.
- Cart net total and Proceed button placement differ from the cart wireframe.
- Checkout success text omits the required wording and order number.
- Cancelled-order details show actions that should not be available for that status.
- Invoice UI omits B2B/place-of-supply details, seller GSTIN, and the separate delivery-fee line.
- Invoice total text has very low contrast and is difficult to read.

See the [defect log](../defect-reports/defect-log.md) for reproduction steps, expected/actual results, severity, and screenshots.
The earlier Catalogue Search defect (WC-009) was not reproduced in the latest run: exact SKU search returned one result and partial search filtered the catalogue.

## UI checks that passed

- Invalid credentials were rejected without opening a protected role landing page (AUTH-02).
- Logout redirected protected-page access to login; buyer role pages were inaccessible; buyer2 could not view buyer1's order (AUTH-03, AUTH-04, AUTH-06).
- The Unicode buyer display name rendered correctly (AUTH-07).
- Exact SKU and partial-name search returned filtered results (CAT-03).
- CSV-01 valid import, CSV-02 same-seller SKU update, CSV-03 duplicate SKU across sellers, and CAT-06 catalogue distinction passed with dedicated SKU `SKU-QA-20261115`; the buyer catalogue showed two separate products. [CSV UI evidence](../evidence/api-logs/CSV-import-ui-observation.txt).
- The UI blocked same-day slots at 10:00:01 and later (SLOT-05).
- Reordering the same 16-piece line twice added 32 pieces total (ORD-12).
- A one-case plus 21-piece order reduced visible stock by 33 pieces; canceling restored the original stock (CAT-05, ORD-11).
- The invoice list contained only delivered orders, but the monthly statement included canceled orders (INV-01, INV-06).
- Invoice totals matched order totals for the two inspected invoices (INV-05).
- The UI-triggered logistics CSV download decoded as UTF-8 and used the required header order (LOG-01). It contained no data rows.
- Checkout, buyer order-history, and seller order-list structures matched their wireframes for the compared elements and observed rows.
- The two-seller checkout produced WC-01076-1 and WC-01076-2, one sub-order per observed seller. Both were canceled after the observations ([order history](../evidence/screenshots/CHK-07-WC-01076-both-canceled.png)).
- The release-notes UI listed CR-07 and CR-09 as approved and CR-11 as deferred; it contained no OPS-14 extension.

## 2026-11-15 follow-up

- CHK-04, CART-10, CSV-01/02/03/06/07 and CAT-06 passed with dedicated cross-seller test SKU `SKU-QA-20261115`; buyer search showed two separate products.
- CSV-04/05 failed: invalid rows were counted as imported with zero errors and no line-level reasons (WC-019).
- OPS-01 was PARTIAL: capacity 5→6 persisted after reopening; it was restored to 5, but buyer-side immediate effect was not verified.
- OPS-02 was SKIPPED: the operator list contained only approved sellers and no approval controls or pending fixture.
- The 32-case regression command completed with 16 API passes, 4 fixture-dependent skips, and 12 UI tests unable to start because Chromium was blocked by macOS sandbox permissions before assertions ran.

- The 2026-11-15 follow-up verified that capacity changes affect buyer checkout slot availability (SLOT-08); the original value 5 was restored. Existing split order WC-01070 confirmed seller-scoped sub-orders (ORD-02).

## Partial UI observations

- Buyer, seller, and operator login paths were observed, but only three of the seven checklist accounts were checked.
- Cart accepted quantities 1 and 99, rejected 100, showed separate case and piece lines, and accepted 21 pieces from the product page.
- One checkout stock-change sample was checked; competing simultaneous buyers were not tested.
- Checkout allowed today + 7 and disabled today + 8; same-day morning slots were unavailable before cutoff and afternoon slots were available at 09:59:59. The exact cutoff was accepted; see WC-013.
- Invoice line arithmetic matched for the inspected 18% and 5% examples; multi-line rate aggregation was unavailable.
- The two-seller split was observed, but a three-seller checkout and the exact ₹2,000 minimum and ₹3,000 delivery-fee boundaries remain untested. CART-10 verified separate seller/unit cart lines at ₹25 net with cleanup.
- The buyer statement had no horizontal overflow at 320px; seller/operator responsive layouts and other breakpoints were not tested.

## Gaps and exclusions

Multi-rate invoice aggregation and logistics row filtering were skipped because suitable data rows were unavailable. Most workflow scenarios remain NOT RUN, including slot-capacity-five boundary, cancellation-timing, seller status transitions, redelivery, refund/exchange approval, seller approval, and inquiry ownership checks. SLOT-08 verified immediate effect with cleanup; AUTH-05 remains PARTIAL because the target order URL did not survive login. LOG-05 remains PARTIAL because scheduled output contents were not exposed. CSV-01 through CSV-07 were run; CSV-04/05 failed and the other CSV cases passed. The two WC-01076 sub-orders used for checkout observations are both canceled.

API partner cases, the metrics endpoint, rate limiting, and the 30-buyer load case are outside this UI-only scope. The [requirement coverage matrix](../test-scenarios/requirement-coverage.md) records each requirement's status.

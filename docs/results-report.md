# WholeCart release test report

**Release:** WholeCart 1.0 marketplace · **Spec:** WC-FDD-1.0-ce97 · **Environment:** `manish-dba39f` demo copy · **Run date:** 2026-11-14

## Executive result

**Recommendation: Do not release until stock reservation, checkout idempotency, and invoice compliance are fixed and retested.** Controlled API tests reproduced inventory overselling, duplicate orders, intermittent order-history 500 responses, and missing mandatory tax-invoice details. CR-07 threshold boundaries and immediate setting behavior passed. Many other marketplace workflows remain untested; this is not release approval.

## Coverage

| Measure | Result |
|---|---|
| Scenarios designed | See `test-cases.md` |
| API smoke/negative | 16 passed, 7 skipped in latest run; 2 additional opt-in mutation tests passed separately |
| UI login | 5 passed |
| Manual checkout | One checkout created then cancelled; displayed net, tax, fee and total matched the expected calculation; cart empty and product stock unchanged afterward |
| Concurrent inventory | 80/20/30 reserved 130 of 100 pieces (stock `-30`); 100/20/30 reserved 150 of 100 (stock `-50`); reproduced in repeated runs |
| Duplicate checkout | Two concurrent submissions of one buyer cart each returned 200 and created distinct orders |
| Order history under concurrency | Immediately after the three-buyer checkout races, buyer order-history calls returned 500 for buyer1 in one mix and buyer2 in the other; separate follow-up reads returned 200 for all three |
| Cancel and rebuy | Buyer1 purchased 100, cancelled, and stock returned to 100; buyer2 then purchased 100; both test orders were cancelled and final stock restored to 161 |
| Refund | Negative, zero, fractional and over-ordered quantities returned 400; valid partial request for one of two units calculated ₹2,063.38 (including tax), then was rejected to preserve the delivered fixture |
| CR-07 minimum | ₹1,999.99 rejected; ₹2,000.00 and ₹2,000.01 accepted. Changing the operator threshold immediately changed acceptance as expected; settings/prices restored |
| CR-09 invoice | Failed: all 6 buyer2/buyer3 invoice API records lack B2B/place-of-supply fields; representative cross-state INV-00005 also omits those lines and seller GSTIN on screen |
| Load | Not run |
| Requirements with evidence | Login/auth, basic API role restrictions, malformed request validation, negative cart quantity and seller stock/prices, checkout totals, cancellation, concurrent stock reservation, duplicate submission, cancellation/rebuy, and refund quantity/amount checks |

## Defects by severity

| S1 | S2 | S3 | S4 |
|---:|---:|---:|---:|
| 3 verified | 0 verified | 1 verified | 3 verified |

WC-001: missing favicon (S4); WC-002: checkout success message missing required order number (S4); WC-003: invalid actions shown for cancelled order (S4); WC-004: concurrent overselling (S1); WC-005: duplicate orders on concurrent double-submit (S1); WC-006: intermittent order-history HTTP 500 after concurrent checkouts (S3); WC-007: mandatory invoice fields omitted (S1). Passing checks apply only to the listed tests and do not imply broader areas are defect-free.

## Open risks

- Seller API key and optional test fixtures were not provided, so partner pagination and several fixture-dependent checks were skipped.
- Operator clock/settings, data reset policy and API response schema need confirmation.
- One seeded delivered order was used for refund testing. Invalid requests created no refund records; a valid partial request was rejected after its amount was checked, so no refund was approved or paid.
- In the latest concurrency run, the immediate history calls failed intermittently; all three buyer history reads succeeded on follow-up and all created orders were confirmed cancelled.
- CR-07 used seller1 product 1 with temporary one-piece prices; orders were cancelled and the original prices, operator settings, and stock were verified restored.
- CR-09 was checked against all 6 invoices available to buyer2 and buyer3 (including both cross-state cases); the API fields are absent in every record. The INV-00005 UI screenshot confirms the missing rendered details.
- 30 distinct buyer accounts and prepared carts are required for an NF-01 result; load testing was not run.
- CR-07/CR-09 override the conflicting/incomplete FDD text; CR-11 attachments are deferred.

## Release recommendation

Do not release until WC-004, WC-005, and WC-007 are fixed and retested; investigate and retest WC-006. CR-07 passed the tested cases. This project contains QA tests and reports, not the marketplace application source, so no product-code fix was made here.

# WholeCart marketplace QA plan

## Objective and scope

Assess release 1.0 against WC-FDD-1.0-ce97 and approved release notes. The minimum-order rule is ₹2,000 net per seller (CR-07), not BR-04's superseded ₹1,500. Tax invoices must also show supply type B2B and place of supply as state name plus code derived from buyer GSTIN (CR-09). Inquiry attachments (CR-11) are deferred and out of scope.

In scope: buyer catalogue/cart/checkout/order lifecycle; seller order, product, CSV and refund operations; operator settings, seller approval and logistics export; partner API; privacy; invoice/statement; concurrency, latency and request-rate boundaries. Out of scope: infrastructure penetration testing, external seller systems, and deferred attachments.

## Approach

1. Review CR-07 and CR-09 as authoritative over conflicting or incomplete design text.
2. Verify API behavior first for deterministic business rules and role separation; cover login and critical navigation in Chromium with Playwright.
3. Use dedicated accounts and controlled stock, time, order and slot fixtures. Mark all tests that create orders, change settings, inventory or statuses as mutating.
4. Capture request/response, order number, timestamp and screenshot/trace for failures. Do not report unexecuted tests as passed.
5. Run the 30-buyer checkout load check only with 30 distinct accounts, prepared carts and no more than five fixtures per slot. Never exceed 50 requests/second.

## Entry criteria

- Product owner questions and assumptions are recorded.
- Test copy is available; credentials, seller API key, stable product IDs, controllable store clock and operator-setting values are verified.
- 30 distinct buyers and valid preloaded carts are available for the checkout load run.
- Mutation and load-test owners approve the planned data impact; initial data and metrics are captured.

## Exit criteria

- All critical/high scenarios are executed or explicitly blocked with an owner and reason.
- No open Severity 1 or 2 defects; all lower severity exceptions have an owner and accepted risk.
- No confidentiality/authorization breach; checkout and search latency goals and 50-RPS ceiling are assessed.
- Coverage, defects, deferred tests, assumptions and release recommendation are reported with evidence.

## Risks

- State is not resettable through the documented API; destructive tests need reserved fixtures and cleanup.
- Only three buyer accounts are documented; they cannot represent 30 independent simultaneous buyers.
- API response schemas are largely unspecified, so response assertions must be aligned with observed API payloads.
- Store-clock controls and operator setting field names are not documented.
- The same-day cutoff is strict (“before” 10:00); timezone and exact cutoff behavior need confirmation.
- Tax rounding, cancellation timing, double-submit idempotency and refunds require boundary tests.
- CI must not execute against the shared/live test copy without explicit approval.

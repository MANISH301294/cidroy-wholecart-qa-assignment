# WholeCart release report

**Decision · Hold release.** Fix stock reservation, duplicate checkout, per-seller minimum enforcement and invoice compliance. Retest the affected paths and verify the expired free-delivery pilot no longer waives fees.

## Coverage

- UI case sheet · 115 cases, with 40 passed, 23 failed, 21 partial, 5 skipped, 25 not run and 1 superseded.
- Recorded automation · The 32-test `npm run test:regression` run had 16 API passes, 4 fixture-dependent skips, and 12 UI tests unable to start because Chromium launch was blocked by the local macOS sandbox. The in-app browser manually verified CHK-04, CART-10, CAT-06 and CSV-01 through CSV-07; CSV-04/05 failed under WC-019. OPS-01 was partial and OPS-02 skipped. Their empty-login check covered navigation only. The manual cases also checked user-facing validation and failed.
- The automated API race reproduced overselling and duplicate orders. The UI double-click check placed one order in its tested interaction. Single-seller API minimum boundaries passed, while a multi-seller UI checkout accepted a ₹993.60 sub-order below ₹2,000.
- See the [execution matrix](../test-scenarios/execution-matrix.csv) and [API results](../docs/results-report.md) for fixture details and gaps.

## Defects by severity

- **S1 Blocker · 5** — WC-004, WC-005, WC-007, WC-012, WC-021.
- **S2 Critical · 2** — WC-017, WC-018.
- **S3 Major · 8** — WC-006, WC-011, WC-013, WC-014, WC-015, WC-016, WC-019, WC-020.
- **S4 Minor · 5** — WC-001, WC-002, WC-003, WC-008, WC-010.

The counts cover 20 distinct open findings. The UI and API observations for WC-007 count as one defect.

## Open risks

Slot capacity, seller lifecycle, export row selection, refund and exchange approval, partner authorization coverage and multi-rate invoice aggregation remain incomplete. The 30-buyer performance goal is unverified because the required fixtures were unavailable. The above-50 RPS HTTP 429 behavior also remains unverified because generated traffic must stay within the assignment's 50 RPS limit.

The [integration follow-up](integration-nonfunctional-run.md) records the CSV import and delivery slot export failures. The repeatable UI/API regression subset runs with `npm run test:regression`; 25 manual UI cases remain NOT RUN.

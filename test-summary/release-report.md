# WholeCart release report

**Decision · Hold release.** Fix stock reservation, duplicate checkout, per-seller minimum enforcement and invoice compliance. Retest the affected paths and verify the expired free-delivery pilot no longer waives fees.

## Coverage

- UI case sheet · 115 cases, with 26 passed, 19 failed, 18 partial, 3 skipped, 48 not run and 1 superseded.
- Recorded automation · 16 API smoke/negative checks passed and 7 skipped. Two opt-in guardrail checks passed separately. Five UI login checks passed. Their empty-login check covered navigation only. The manual cases also checked user-facing validation and failed.
- The automated API race reproduced overselling and duplicate orders. The UI double-click check placed one order in its tested interaction. Single-seller API minimum boundaries passed, while a multi-seller UI checkout accepted a ₹993.60 sub-order below ₹2,000.
- See the [execution matrix](../test-scenarios/execution-matrix.csv) and [API results](../docs/results-report.md) for fixture details and gaps.

## Defects by severity

- **S1 Blocker · 4** — WC-004, WC-005, WC-007, WC-012.
- **S2 Critical · 2** — WC-017, WC-018.
- **S3 Major · 8** — WC-006, WC-011, WC-013, WC-014, WC-015, WC-016, WC-019, WC-020.
- **S4 Minor · 5** — WC-001, WC-002, WC-003, WC-008, WC-010.

The counts cover 19 distinct open findings. The UI and API observations for WC-007 count as one defect.

## Open risks

Slot capacity, seller lifecycle, export row selection, refund and exchange approval, partner authorization coverage and multi-rate invoice aggregation remain incomplete. The 30-buyer performance goal is unverified because the required fixtures were unavailable.

The [integration follow-up](integration-nonfunctional-run.md) records CSV import and delivery slot export failures.

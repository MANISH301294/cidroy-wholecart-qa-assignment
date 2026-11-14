# UI Test Scenarios and Coverage

The [UI case sheet](ui-test-cases.csv) is based on the user's checklist. It contains the scenario, UI-only steps, expected and actual results, failure reason, status, defect ID, severity, and evidence reference. The [requirement coverage matrix](requirement-coverage.md) maps each requirement to observed UI evidence or an explicit gap.

## Scope

This package covers browser-visible behavior only. API-only cases (`API-01`–`API-05`), the 30-buyer load case (`CHK-12`), rate-limit testing (`NF-01`), and the metrics endpoint (`NF-02`) are excluded. The UI sheet includes seller CSV import and operator logistics export scenarios only where they are launched from the UI; unexecuted cases remain clearly marked.

The original checklist had 114 cases. Eight non-UI cases were excluded, and four UI cases were added for the three blank-login combinations and CR-09 place-of-supply state name/code, resulting in 110 UI cases. Five further UI cases compare each screen wireframe (5.1–5.5) with the actual UI, bringing the sheet to 115 cases.

The design comparison uses the [captured `docs/design` wireframes](../evidence/screenshots/DOC-DESIGN-WIREFRAMES.png) plus actual UI screenshots linked in cases DESIGN-51 through DESIGN-55.

## Execution and traceability

The [execution matrix](execution-matrix.csv) connects each case ID to its result, requirement, defect and individual triage file. The [execution summary](../test-summary/execution-summary.md) records the latest UI run, including the catalogue search retest.

## End-to-end scenarios

- **Buyer to seller** · Search for an in-stock item, add piece and case lines, select a slot, and place an order. Verify the seller sees its sub-order, can advance valid statuses, and the buyer sees the tracking updates. Cross-reference CAT, CART, CHK, SLOT, ORD and SEL cases in the matrix.
- **Buyer to multiple sellers** · Place a two-seller cart and check each seller’s minimum, delivery fee, order numbering and visibility. Cancel eligible orders and verify inventory returns. See CHK-02, CHK-03, CHK-07 and ORD-11.
- **Seller to operator** · Advance an order to an exportable status and verify that the operator logistics CSV includes only eligible statuses with the correct pieces. See the seller lifecycle and LOG cases.
- **Delivered order to finance** · Verify invoices show supply details and separately itemized fees, then reconcile delivered orders and approved refunds to the monthly buyer statement. See the INV and refund cases.

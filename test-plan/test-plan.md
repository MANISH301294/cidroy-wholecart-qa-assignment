# WholeCart test plan

**Target** · Assigned WholeCart demo, 14 November 2026  
**Requirements** · WC-FDD-1.0-ce97 and approved release notes WC-RN-1.0-ce97

## Scope

Buyer authentication, catalogue, cart, checkout, slots, orders, refunds, invoices and statements. Seller fulfilment, stock and offer controls. Operator settings, seller approval and logistics export. Include role isolation, inventory concurrency, idempotency and checkout performance.

## Approach

- Trace cases to the functional design and apply approved change requests where they override it.
- Exercise buyer, seller and operator workflows in Chromium. Use Playwright for API and UI smoke, authorization and negative checks. Use controlled fixtures for stock races, monetary thresholds, time boundaries and role isolation.
- Capture inputs, expected and actual results, screenshots or HTTP responses. Record cleanup and link failures to defects. Use the 30-buyer load run with metrics snapshots once independent prepared carts and delivery slots are available.

## Entry criteria

The assigned demo is reachable, role accounts and test data are available, and the design and release notes are accessible. Prepare fixture ownership, original values and cleanup steps before testing state changes.

## Exit criteria

Account for every case and record evidence for all reproduced defects. Restore changed stock, prices and operator settings. Retest blockers and critical fixes, verify order isolation and invoice accuracy, and record the load result before recommending release.

## Risks

Shared carts and stock can interfere with concurrent tests. Checkout, cancellation and refunds can leave permanent history. Missing seller API keys, representative export rows, multi-rate invoices and independent load accounts limit coverage. Record skipped and partial checks in the execution matrix.

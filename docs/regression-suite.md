# Repeatable regression suite

Run the stable regression set from the project root:

```sh
npm run test:regression
```

This one command runs the API read-only and negative-validation checks plus login and CSV UI checks for AUTH-01/02 and CSV-01 through CSV-07, plus CAT-06. It does not mutate catalogue stock, order lifecycle, operator settings, or refunds. The suite uses the assigned WholeCart copy by default; override `WC_BASE_URL` only for an approved copy.

## Included checks

| Automated case | Regression coverage |
|---|---|
| `tests/api/read-only.spec.ts` | Role authentication and readable API surfaces; anonymous/private endpoint access; catalogue categories/search; buyer orders, invoices, monthly statement; seller products/orders/profile; operator settings/sellers/buyers; metrics; partner API missing-key rejection. Optional known zero-stock SKU and partner-key pagination checks run when configured. |
| `tests/api/negative.spec.ts` | Malformed login, missing checkout slot, missing slot date, malformed order/invoice IDs, buyer-to-seller/operator API denial, seller-to-operator API denial. Optional cross-buyer and cross-seller order access checks run when a known foreign order ID is configured. |
| `tests/ui/login.spec.ts` | Invalid and blank login attempts remain on login; buyer, seller and operator can sign in (AUTH-01/02). |
| `tests/ui/csv-import.spec.ts` | CSV-04 mixed valid/invalid row handling and CSV-05 invalid tax, stock, case size and price reporting. Uses the repeatable seller2 SKU `SKU-QA-20261115`; invalid fixtures use dedicated `SKU-QA-*` identifiers. |

The API and login checks are read-only apart from authentication attempts. CSV regression tests use persistent dedicated seller SKUs; seller1 and seller2 fixture products may be updated on each run. Invalid test rows should never create products. Keep this SKU restricted to the designated QA copy. Optional cases that require fixture variables are skipped when those fixtures are absent; skipped is not a pass.

## Separate controlled regression candidates

These cases are kept out of the default command until a dedicated fixture and reliable reset are available:

- Stock concurrency and checkout idempotency (`WC_ENABLE_STOCK_CONCURRENCY=1`) create and cancel test orders and temporarily alter product stock.
- Cart and seller API mutation guardrails (`WC_ENABLE_MUTATION_TESTS=1`) change carts and product values during checks; seller values are restored in `finally`.
- Slot-capacity and cutoff cases need deterministic operator clock/capacity configuration.
- Cancellation, redelivery, refund, exchange, and statement-adjustment cases need uniquely tagged lifecycle fixtures and cleanup.
- Valid CSV import/update and cross-seller SKU cases need a designated persistent QA SKU; cleanup is not exposed in the seller UI. The default CSV-04/05 checks use that dedicated SKU and invalid rows.
- Load testing requires 30 prepared buyers and creates orders; it is separate and capped at 50 requests/second.

These exclusions mean the default regression command is a stable smoke/authorization suite, not full coverage of the 115-case manual specification. Each excluded case stays in the UI case sheet with its setup data, expected result, and actual run status.

## Runner note

On 2026-11-15, the 32-test regression command produced 16 API passes, 4 fixture-dependent API skips, and 12 UI launch failures before assertions. The in-app browser manually ran CSV-01 through CSV-07 and CAT-06; CSV-04/05 failed as described in WC-019 and the other cases passed; the automated UI assertions have not run in the headless runner because Chromium could not start. The standalone Playwright UI runner could not launch Chromium in this macOS sandbox (`MachPortRendezvousServer` permission denied) before test assertions ran. Browser-based manual checks can still be performed in the Codex in-app browser. A normal developer or CI host with a working Playwright Chromium runtime is needed for the automated UI portion.

Manual follow-up on 2026-11-15 also verified CART-10, CAT-06, CSV-01 through CSV-07 with designated regression SKUs; OPS-01 persistence was partial and OPS-02 was skipped because no pending seller or approval action was present.

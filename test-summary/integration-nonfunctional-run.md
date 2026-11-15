# Integration and non-functional execution

[API execution evidence](../evidence/api-logs/integration-follow-up.txt) · [Search latency samples](requirements-follow-up.md)

- **CSV-01 through CSV-03 · Pass.** The seller import accepted a valid row and updates to the same SKU. The same SKU also imported for a second seller. Readback showed one row per seller with distinct prices. Both test products were deactivated after the run.
- **CSV-04 and CSV-05 · Fail.** A mixed file reported both rows imported, including the nonnumeric piece price. A separate file with invalid tax, stock, case size and price reported all four imported. Both returned an empty errors array. [WC-019 triage](../defect-reports/triage/CSV-04.md)
- **CSV-06 and CSV-07 · Pass for the tested files.** The Unicode name survived readback, the missing stock column returned HTTP 400, and a file with the SKU and name columns reordered imported successfully.
- **LOG-01 through LOG-04 · Partial and one failure.** The header matched. A placed test order was excluded, its accepted state was included, and its cancelled state was excluded. The two 12-piece cases exported as 24 pieces. The UTF-8 CSV decoded successfully. The start and end values were reversed for the accepted order. Shipped, redelivery-requested, delivered and Unicode field values remain unverified. [WC-020 triage](../defect-reports/triage/LOG-SLOT.md)
- **LOG-05 · Pending.** The run triggered manual exports. Hourly generation remains unverified.
- **IF-03 · Partial.** Partner orders returned HTTP 401 with a missing or invalid key. Authenticated pagination and offer updates require a valid seller key.
- **NF-01 · Blocked.** The operator API listed three buyers. The workload requires 30 distinct buyers with prepared carts.
- **NF-02 · Pass for the sampled API workload.** All 40 sequential search calls succeeded, with p95 394.4 ms. Browser p95 remains unmeasured.
- **NF-03 · Partial.** A 135-request `/api/metrics` sample returned HTTP 200 for every call, with a measured peak of 49 client starts per rolling second, p95 29.5 ms and max 58.2 ms. The metrics snapshots reported zero 5xx errors and zero in-flight orders. The above-50 RPS HTTP 429 behavior remains unverified; generated load stayed below the 50 RPS cap. [Captured run](../evidence/api-logs/NF-03-metrics-safe-rate-2026-11-15.json).

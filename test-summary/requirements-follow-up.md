# Requirements follow-up · 15 November 2026

Checks ran against the assigned WholeCart demo. [Recorded API output](../evidence/api-logs/requirements-follow-up-2026-11-15.txt)

- **BR-05 · Date boundaries passed.** Yesterday and today +8 returned four unavailable slots each. Tomorrow and today +7 returned four available slots each. This run did not fill a slot to its five-order capacity.
- **BR-06 · Same-day slot sample passed.** The two morning slots were unavailable and the two afternoon slots were available before cutoff. The previously reported exact-cutoff failure remains open.
- **IF-02 · Partial.** The operator's latest export returned HTTP 200 with the expected UTF-8 CSV header in the required order. It contained zero data rows. Status filtering, pieces counts, and hourly generation remain unverified.
- **IF-03 · Partial.** Partner orders returned HTTP 401 without a key. Authenticated pagination and offer updates still require a seller API key.
- **NF-02 · Passed for the sampled API workload.** One buyer sent 40 sequential catalogue requests with a 100 ms pause after each response, rotating Rice, Hill, SKU-0001 and Cookies. All returned HTTP 200. The nearest-rank p95 from request start through response body was 394.4 ms and the maximum was 410.1 ms. Browser rendering time and search under concurrent load were outside this measurement.
- **NF-03 · Partial.** A paced sample of 135 `/api/metrics` calls returned HTTP 200 throughout and measured a peak of 49 client starts per rolling second; client p95 was 29.5 ms and max 58.2 ms. Before/after metrics showed zero 5xx errors and zero in-flight orders. Behavior above 50 RPS was not tested because the assignment caps generated traffic at 50. [Captured run](../evidence/api-logs/NF-03-metrics-safe-rate-2026-11-15.json).

IF-01 CSV import and the remaining order lifecycle tests still need execution with test products and orders. NF-01 needs 30 distinct buyers with prepared carts.

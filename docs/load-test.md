# Checkout load test

## Goal and constraints

Measure 30 simultaneous checkout requests and compare p95 to NF-01's 3-second goal. Capture `/api/metrics` before and after. The script emits 30 response status/latency records and metrics snapshots.

The script refuses to run unless `WC_ENABLE_LOAD_TEST=1` is set. It requires exactly 30 unique buyer accounts, pre-populated carts, and no more than five orders assigned to the same date/slot. Preload carts before the run. Setup sends sequential requests with at least 50 ms between starts. After setup, the script waits one second before sending a burst of 30 checkout requests. Run one instance at a time to stay within the 50-RPS ceiling. The script does not reset or cancel created orders.

Do not treat this as a complete sustained-throughput test: it is a single 30-request burst. Run search latency separately. Do not probe above 50 RPS on this copy; an above-ceiling 429 test needs explicit product-owner approval and an isolated environment.

## Fixture format

Provide a local JSON file (do not commit credentials) and point `WC_LOAD_FIXTURES` to it:

```json
[
  {
    "username": "load-buyer-01",
    "password": "test-only-password",
    "slot_date": "2026-11-15",
    "slot_start": "14:00",
    "items": [{"product_id": 123, "unit": "case", "qty": 1}]
  }
]
```

Provide exactly 30 objects with distinct usernames. `items` records the prepared cart state for audit only; the script does not modify carts. Each slot can occur at most five times. Ensure product availability and per-seller minimums before starting.

## Execute

```sh
WC_BASE_URL="$WHOLECART_DEMO_URL" \
WC_LOAD_FIXTURES='/secure/path/load-fixtures.json' \
WC_ENABLE_LOAD_TEST=1 npm run load:checkout
```

Record the output, environment/build, store clock, fixture IDs, time and resulting order numbers (from API response/logs). A p95 over 3000 ms or any non-2xx checkout fails this check. Also inspect metrics for errors, rate-limit events, and resource saturation. Protect the fixture file and output; remove credentials from evidence before sharing.

## Known limitation

Only three buyer accounts are documented in the design. Create/approve 30 dedicated accounts before this test; reusing the three accounts would invalidate independence and could race on shared carts.

## Results and conclusion

**Checkout load · Not run.** The available records identify three buyer accounts. No 30-buyer fixtures, checkout latency measurements, or before/after checkout metrics snapshots were available. NF-01 performance remains unverified. The separate three-buyer race is functional evidence of overselling and does not establish a 30-buyer p95.

**Related non-functional measurements (15 November 2026; not a substitute for checkout load):**

- NF-02 search sample: 40 sequential catalogue requests, with a 100 ms pause after each response. All returned HTTP 200; p95 was 394.4 ms and maximum was 410.1 ms. This is a single-buyer sequential sample, not concurrent-load browser latency. See [search measurements](requirements-follow-up.md) and [raw samples](../evidence/api-logs/requirements-follow-up-2026-11-15.txt).
- NF-03 metrics/rate sample: `/api/metrics` returned HTTP 200 with request, 5xx error, p50/p95 latency, in-flight order, and version fields. Across 120 metrics requests, all returned HTTP 200 and peak observed client request starts were 36 in a rolling second, below the 50 RPS ceiling. The exact 50 RPS boundary and behavior above it were not measured. See [integration and non-functional run](../test-summary/integration-nonfunctional-run.md).

**Conclusion:** The available search sample met its p95 target and the recorded metrics sampling stayed under the assignment's rate cap, but the 30-buyer checkout performance requirement has no result. Keep NF-01 open until 30 independent buyers with prepared carts are available and the guarded checkout script records response latencies plus `/api/metrics` snapshots.

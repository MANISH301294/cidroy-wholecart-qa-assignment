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

**Status · Not run.** The available records identify three buyer accounts. No 30-buyer fixtures, latency measurements or metrics snapshots were available for the load scenario. NF-01 performance remains unverified. The three-buyer race is functional evidence of overselling and does not establish a p95.

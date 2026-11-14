# API-STOCK-RACE · Concurrent checkout oversells stock

**Status** · Fail  
**Requirement** · BR-01  
**Defect** · WC-004  
**Severity** · S1 Blocker  
**Environment** · Assigned WholeCart demo, 14 November 2026

## Reproduce

**Data and setup** · Seller1 product 1 at 100 pieces and three buyers with prepared carts.

Submit three overlapping checkout requests with quantities 80/20/30, then repeat at 100/20/30. Read inventory after each run.

## Expected

Accept at most 100 pieces and keep stock at zero or above.

## Observed

All six requests returned 200 across two runs. Stock fell to −30 and −50.



## Evidence

- [WC-004-WC-006-stock-idempotency-history.log](../../evidence/api-logs/WC-004-WC-006-stock-idempotency-history.log)

[Defect details](../../docs/defect-log.md)

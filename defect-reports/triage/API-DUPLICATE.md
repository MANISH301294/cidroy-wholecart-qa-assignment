# API-DUPLICATE · Concurrent duplicate checkout creates distinct orders

**Status** · Fail  
**Requirement** · BR-10  
**Defect** · WC-005  
**Severity** · S1 Blocker  
**Environment** · Assigned WholeCart demo, 14 November 2026

## Reproduce

**Data and setup** · Buyer1 with 20 pieces and one delivery slot.

Send two simultaneous POST requests to /api/orders from the same cart. Compare the IDs.

## Expected

Create one order.

## Observed

Both requests returned HTTP 200 and created WC-01063-1 and WC-01064-1.



## Evidence

- [WC-004-WC-006-stock-idempotency-history.log](../../evidence/api-logs/WC-004-WC-006-stock-idempotency-history.log)

[Defect details](../../docs/defect-log.md)

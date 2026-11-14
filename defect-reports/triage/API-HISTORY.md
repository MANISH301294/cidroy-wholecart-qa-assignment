# API-HISTORY · Order history intermittently returns HTTP 500

**Status** · Fail  
**Requirement** · BR-21  
**Defect** · WC-006  
**Severity** · S3 Major  
**Environment** · Assigned WholeCart demo, 14 November 2026

## Reproduce

**Data and setup** · Three buyers immediately after the stock-race scenarios.

Call GET /api/orders for each buyer in parallel after each race.

## Expected

Return HTTP 200 and the authenticated buyer’s own order history.

## Observed

Statuses were 500/200/200 and 200/500/200. Follow-up reads returned 200.



## Evidence

- [WC-004-WC-006-stock-idempotency-history.log](../../evidence/api-logs/WC-004-WC-006-stock-idempotency-history.log)

[Defect details](../../docs/defect-log.md)

# SLOT-04 · Same-day exactly at cutoff

**Status** · Fail  
**Requirement** · BR-05/BR-06/BR-14/BR-15/BR-23/BR-24  
**Defect** · WC-013  
**Severity** · S3 Major  
**Environment** · Assigned WholeCart demo, 14 November 2026

## Reproduce

**Data and setup** · See UI test steps; prepare the specified fixture before execution.

Fix clock to 10:00; attempt same-day checkout.

## Expected

Same-day slots unavailable because order must be before cutoff.

## Observed

At 10:00:00 the afternoon slot remained enabled and checkout placed same-day order WC-01073-1; the order was then canceled.

The UI accepted an order at the cutoff although the rule requires an order before 10:00.

## Evidence

- [SLOT-04-at-cutoff-100000.png](../../evidence/screenshots/SLOT-04-at-cutoff-100000.png)
- [SLOT-04-order-accepted-at-cutoff.png](../../evidence/screenshots/SLOT-04-order-accepted-at-cutoff.png)

[Defect details](../defect-log.md)

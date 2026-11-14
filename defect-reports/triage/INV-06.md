# INV-06 · Statement delivered orders only

**Status** · Fail  
**Requirement** · BR-07/BR-08/BR-19/BR-20/BR-21/CR-09  
**Defect** · WC-015  
**Severity** · S3 Major  
**Environment** · Assigned WholeCart demo, 14 November 2026

## Reproduce

**Data and setup** · See UI test steps; prepare the specified fixture before execution.

Create delivered, shipped and cancelled orders in same month.

## Expected

Only delivered orders included.

## Observed

November 2026 statement listed multiple canceled orders, including WC-01072-1, WC-01073-1 and WC-01074-1.

Canceled orders are included in the monthly statement contrary to BR-20.

## Evidence

- [INV-06-statement-includes-canceled-orders.png](../../evidence/screenshots/INV-06-statement-includes-canceled-orders.png)

[Defect details](../defect-log.md)

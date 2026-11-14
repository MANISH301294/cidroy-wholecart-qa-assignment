# ORD-04 · Invalid status transition

**Status** · Fail  
**Requirement** · BR-09–BR-16/BR-21  
**Defect** · WC-003  
**Severity** · S4 Minor  
**Environment** · Assigned WholeCart demo, 14 November 2026

## Reproduce

**Data and setup** · See UI test steps; prepare the specified fixture before execution.

Attempt seller actions not valid for current order status.

## Expected

Only valid actions offered; invalid transitions rejected.

## Observed

A cancelled order still displayed Cancel, Change slot, Request redelivery, and Send request actions.

The order UI offers actions invalid for the cancelled status; backend action results were not checked.

## Evidence

- [WC-003-cancelled-order-actions.png](../../evidence/screenshots/WC-003-cancelled-order-actions.png)

[Defect details](../defect-log.md)

# CHK-10 · Checkout confirmation message

**Status** · Fail  
**Requirement** · CR-07/BR-07/BR-08/BR-09/BR-10/Screen 5.2  
**Defect** · WC-002  
**Severity** · S4 Minor  
**Environment** · Assigned WholeCart demo, 14 November 2026

## Reproduce

**Data and setup** · See UI test steps; prepare the specified fixture before execution.

Place valid order and inspect confirmation.

## Expected

Shows 'Your order has been placed. Order number: {numbers}' and opens history.

## Observed

The success screen showed only “Order placed!” and omitted the required full confirmation wording/order number.

Checkout success message does not satisfy the screen requirement.

## Evidence

- [WC-002-order-success-message.png](../../evidence/screenshots/WC-002-order-success-message.png)

[Defect details](../defect-log.md)

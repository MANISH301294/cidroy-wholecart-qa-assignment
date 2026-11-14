# INV-04 · Delivery fee line

**Status** · Fail  
**Requirement** · BR-07/BR-08/BR-19/BR-20/BR-21/CR-09  
**Defect** · WC-007  
**Severity** · S1 Blocker  
**Environment** · Assigned WholeCart demo, 14 November 2026

## Reproduce

**Data and setup** · See UI test steps; prepare the specified fixture before execution.

Inspect invoice for order below ₹3,000 net.

## Expected

Fee and its tax represented correctly.

## Observed

Invoices for two below-threshold orders did not show a separate delivery-fee line.

Required delivery fee line is absent from the invoice UI.

## Evidence

- [INV-00071-invoice-ui-calculation.png](../../evidence/screenshots/INV-00071-invoice-ui-calculation.png)
- [INV-00073-invoice-ui-calculation.png](../../evidence/screenshots/INV-00073-invoice-ui-calculation.png)

[Defect details](../defect-log.md)

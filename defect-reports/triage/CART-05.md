# CART-05 · Cart dropdown 1–20

**Status** · Fail  
**Requirement** · BR-01/BR-03/Screen 5.1  
**Defect** · WC-010  
**Severity** · S4 Minor  
**Environment** · Assigned WholeCart demo, 14 November 2026

## Reproduce

**Data and setup** · See UI test steps; prepare the specified fixture before execution.

Open cart, inspect dropdown and change quantity from 1 to 20.

## Expected

Dropdown supports 1–20; line totals update.

## Observed

The populated cart quantity control was a textbox, not a dropdown.

Cart quantity control does not match the specified dropdown UI.

## Evidence

- [Cart §5.1 requirement and wireframe](../../evidence/screenshots/DESIGN-51-cart-wireframe.png)
- [Actual cart screenshot](../../evidence/screenshots/UI-CART-QTY-CONTROL.png)

[Defect details](../defect-log.md)

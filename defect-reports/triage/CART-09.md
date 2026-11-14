# CART-09 · Insufficient stock

**Status** · Fail  
**Requirement** · BR-01/BR-03/Screen 5.1  
**Defect** · WC-012  
**Severity** · S1 Blocker  
**Environment** · Assigned WholeCart demo, 14 November 2026

## Reproduce

**Data and setup** · See UI test steps; prepare the specified fixture before execution.

Try adding or ordering more pieces than available stock.

## Expected

System prevents overselling.

## Observed

With 161 pieces shown in stock, checkout accepted 15 cases of 12 plus 21 pieces (201 pieces); order WC-01072-1 was placed and then canceled.

Checkout allowed 40 pieces above the displayed stock.

## Evidence

- [CART-09-overstock-cart-before-checkout.png](../../evidence/screenshots/CART-09-overstock-cart-before-checkout.png)
- [CART-09-overstock-order-placed.png](../../evidence/screenshots/CART-09-overstock-order-placed.png)

[Defect details](../defect-log.md)


## Reorder follow-up · 15 November 2026

Delivered order WC-01081-1 contained 25 cases of Chef's Cardamom. The buyer product page showed stock at −545 pieces. Reorder placed 25 cases into the cart; checkout showed no stock warning and kept Place order enabled. No second order was submitted. The cart was cleared. This is additional UI evidence for WC-012; it does not create a duplicate defect.

[Execution note](../../evidence/ui-observations/UI-regression-2026-11-15.txt)

# DESIGN-54 · Invoice details, line items, fee, and total conform to wireframe

**Status** · Fail  
**Requirement** · Screen 5.4 Invoice/BR-19/CR-09  
**Defect** · WC-007; WC-011  
**Severity** · S1 Blocker / S3 Major  
**Environment** · Assigned WholeCart demo, 14 November 2026

## Reproduce

**Data and setup** · Delivered invoice INV-00073

Open INV-00073 and compare seller/buyer details, invoice metadata, line items, delivery-fee line, and total with the screen 5.4 wireframe.

## Expected

Show seller GSTIN, buyer details, invoice date/order number, all lines including a separate delivery-fee line, and a clearly readable total.

## Observed

Seller name, buyer details, invoice date/order number, and product line are present. Seller GSTIN, B2B/place-of-supply details, and separate delivery-fee line are absent; the total is extremely low contrast.

Invoice content omits required fields and the total is difficult to read; see WC-007 and WC-011.

## Evidence

- [DOC-DESIGN-WIREFRAMES.png](../../evidence/screenshots/DOC-DESIGN-WIREFRAMES.png)
- [INV-00073-invoice-ui-calculation.png](../../evidence/screenshots/INV-00073-invoice-ui-calculation.png)

[Defect details](../defect-log.md)

# INV-CR09-STATE · Place of supply shows state name and code

**Status** · Fail  
**Requirement** · CR-09/BR-19  
**Defect** · WC-007  
**Severity** · S1 Blocker  
**Environment** · Assigned WholeCart demo, 14 November 2026

## Reproduce

**Data and setup** · Delivered invoice INV-00073; buyer GSTIN prefix 30; buyer address in Goa

Open invoice INV-00073 and compare the displayed place of supply with the buyer GSTIN prefix.

## Expected

Show Place of supply: Goa (30), derived from GSTIN state code 30.

## Observed

Buyer GSTIN prefix 30 and Goa address were visible, but the invoice did not show Place of supply: Goa (30).

Required supply state name and code are absent from the invoice UI.

## Evidence

- [INV-00073-invoice-ui-calculation.png](../../evidence/screenshots/INV-00073-invoice-ui-calculation.png)

[Defect details](../defect-log.md)

# INV-02 · Seller and buyer details

**Status** · Fail  
**Requirement** · BR-07/BR-08/BR-19/BR-20/BR-21/CR-09  
**Defect** · WC-007  
**Severity** · S1 Blocker  
**Environment** · Assigned WholeCart demo, 14 November 2026

## Reproduce

**Data and setup** · See UI test steps; prepare the specified fixture before execution.

Open delivered-order invoice.

## Expected

Seller name/GSTIN and buyer name/GSTIN/address correct.

## Observed

The invoice UI omitted seller GSTIN and mandatory B2B supply type; buyer details were visible.

Invoice UI is missing mandatory seller/supply details; see WC-007.

## Evidence

- [CR-09-invoice-missing-supply-details.png](../../evidence/screenshots/CR-09-invoice-missing-supply-details.png)
- [INV-00073-CR09-invoice-missing-fields.png](../../evidence/screenshots/INV-00073-CR09-invoice-missing-fields.png)

[Defect details](../defect-log.md)

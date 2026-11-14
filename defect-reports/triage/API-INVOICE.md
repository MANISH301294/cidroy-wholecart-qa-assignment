# API-INVOICE · Invoices omit supply details

**Status** · Fail  
**Requirement** · CR-09  
**Defect** · WC-007  
**Severity** · S1 Blocker  
**Environment** · Assigned WholeCart demo, 14 November 2026

## Reproduce

**Data and setup** · Six invoice records visible to buyer2 and buyer3, including INV-00005.

Read each invoice through the API and inspect the supply type and place of supply.

## Expected

Return B2B and the GSTIN-derived state name and code.

## Observed

All six omitted both fields.



## Evidence

- [CR-09-invoice-audit.json](../../evidence/api-logs/CR-09-invoice-audit.json)

[Defect details](../../docs/defect-log.md)

# CAT-01 · Browse in-stock products

**Status** · Fail  
**Requirement** · BR-02/BR-22  
**Defect** · WC-014  
**Severity** · S3 Major  
**Environment** · Assigned WholeCart demo, 14 November 2026

## Reproduce

**Data and setup** · See UI test steps; prepare the specified fixture before execution.

Log in as buyer1, open catalogue and inspect available products.

## Expected

Only products with stock greater than zero appear.

## Observed

The catalogue exposed SKU-0064 and SKU-0073; both buyer product pages displayed 0 pieces in stock.

Zero-stock products were visible to buyers, contrary to BR-02.

## Evidence

- [CAT-02-search-includes-SKU-0073.png](../../evidence/screenshots/CAT-02-search-includes-SKU-0073.png)
- [CAT-02-zero-stock-SKU-0064-visible.png](../../evidence/screenshots/CAT-02-zero-stock-SKU-0064-visible.png)

[Defect details](../defect-log.md)

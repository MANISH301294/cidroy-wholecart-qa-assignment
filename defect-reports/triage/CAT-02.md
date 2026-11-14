# CAT-02 · Out-of-stock product hidden

**Status** · Fail  
**Requirement** · BR-02/BR-22  
**Defect** · WC-014  
**Severity** · S3 Major  
**Environment** · Assigned WholeCart demo, 14 November 2026

## Reproduce

**Data and setup** · See UI test steps; prepare the specified fixture before execution.

As seller, set a test product's stock to zero; return to buyer catalogue and search.

## Expected

Product is absent from catalogue and search.

## Observed

Buyer search returned SKU-0064 and SKU-0073; each product page displayed In stock: 0 pieces.

Zero-stock products remain visible in search results and product pages.

## Evidence

- [CAT-02-search-includes-SKU-0073.png](../../evidence/screenshots/CAT-02-search-includes-SKU-0073.png)
- [CAT-02-zero-stock-SKU-0064-visible.png](../../evidence/screenshots/CAT-02-zero-stock-SKU-0064-visible.png)
- [CAT-02-zero-stock-SKU-0073-visible.png](../../evidence/screenshots/CAT-02-zero-stock-SKU-0073-visible.png)

[Defect details](../defect-log.md)

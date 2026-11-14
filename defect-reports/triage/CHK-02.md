# CHK-02 · Minimum applies per seller

**Status** · Fail  
**Requirement** · CR-07/BR-07/BR-08/BR-09/BR-10/Screen 5.2  
**Defect** · WC-017  
**Severity** · S2 Critical  
**Environment** · Assigned WholeCart demo, 14 November 2026

## Reproduce

**Data and setup** · See UI test steps; prepare the specified fixture before execution.

Place checkout with FreshFarm at ₹993.60 net and Coastal at ₹2,649.60 net; combined net is ₹3,643.20.

## Expected

Checkout blocks the FreshFarm sub-order below CR-07's ₹2,000 per-seller minimum even though combined net exceeds ₹2,000.

## Observed

Checkout created WC-01076-1 for FreshFarm at ₹993.60 net (₹1,043.28 total) and WC-01076-2 for Coastal at ₹2,649.60 net (₹3,126.53 total); combined net was ₹3,643.20.

The checkout accepted a FreshFarm sub-order below the approved ₹2,000 per-seller minimum.

## Evidence

- [CHK-02-two-seller-total-above-min-one-below.png](../../evidence/screenshots/CHK-02-two-seller-total-above-min-one-below.png)
- [CHK-07-multi-seller-checkout-split.png](../../evidence/screenshots/CHK-07-multi-seller-checkout-split.png)
- [CHK-07-WC-01076-both-canceled.png](../../evidence/screenshots/CHK-07-WC-01076-both-canceled.png)

[Defect details](../defect-log.md)

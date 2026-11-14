# CHK-03 · Delivery fee below ₹3,000

**Status** · Fail  
**Requirement** · CR-07/BR-07/BR-08/BR-09/BR-10/Screen 5.2  
**Defect** · WC-018  
**Severity** · S2 Critical  
**Environment** · Assigned WholeCart demo, 14 November 2026

## Reproduce

**Data and setup** · See UI test steps; prepare the specified fixture before execution.

Create an eligible seller sub-order below ₹3,000 net after the pilot expiry.

## Expected

₹100 delivery fee plus ₹18 fee tax applied under the configured rate; no approved OPS-14 extension overrides BR-08.

## Observed

On 2026-11-14, the Coastal sub-order at ₹2,649.60 net showed ₹0 delivery. Checkout displayed “Pilot OPS-14: free delivery on all your orders until 31 Oct 2026.” The UI release notes list approved CR-07 and CR-09 and deferred CR-11, with no OPS-14 extension.

The expired OPS-14 free-delivery pilot remained active in checkout after 31 Oct 2026; no approved extension was listed, so the expected BR-08 fee was omitted.

## Evidence

- [CHK-02-two-seller-total-above-min-one-below.png](../../evidence/screenshots/CHK-02-two-seller-total-above-min-one-below.png)
- [OPS-14-release-notes-no-approved-extension.png](../../evidence/screenshots/OPS-14-release-notes-no-approved-extension.png)

[Defect details](../defect-log.md)

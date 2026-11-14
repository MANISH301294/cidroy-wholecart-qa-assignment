# LOGIN-EMPTY-02 · Username blank; password supplied

**Status** · Fail  
**Requirement** · Login UI validation  
**Defect** · WC-008  
**Severity** · S4 Minor  
**Environment** · Assigned WholeCart demo, 14 November 2026

## Reproduce

**Data and setup** · Logged out; login page; username empty

Open Login; leave username blank, enter a test password, and submit.

## Expected

Remain on Login and show a clear username-required message; do not show raw server output.

## Observed

Submitting with username blank rendered raw HTTP 422 JSON instead of a clear username-required message.

Blank username does not provide user-friendly field validation.

## Evidence

- [UI-LOGIN-BLANK-USERNAME-422.png](../../evidence/screenshots/UI-LOGIN-BLANK-USERNAME-422.png)

[Defect details](../defect-log.md)

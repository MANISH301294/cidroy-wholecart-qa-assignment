# LOGIN-EMPTY-03 · Password blank; username supplied

**Status** · Fail  
**Requirement** · Login UI validation  
**Defect** · WC-008  
**Severity** · S4 Minor  
**Environment** · Assigned WholeCart demo, 14 November 2026

## Reproduce

**Data and setup** · Logged out; login page; password empty

Open Login; enter a test username, leave password blank, and submit.

## Expected

Remain on Login and show a clear password-required message; do not show raw server output.

## Observed

Submitting with password blank rendered raw HTTP 422 JSON instead of a clear password-required message.

Blank password does not provide user-friendly field validation.

## Evidence

- [UI-LOGIN-BLANK-PASSWORD-422.png](../../evidence/screenshots/UI-LOGIN-BLANK-PASSWORD-422.png)

[Defect details](../defect-log.md)

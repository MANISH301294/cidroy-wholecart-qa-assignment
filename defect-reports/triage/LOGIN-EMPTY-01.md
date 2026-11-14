# LOGIN-EMPTY-01 · Both username and password blank

**Status** · Fail  
**Requirement** · Login UI validation  
**Defect** · WC-008  
**Severity** · S4 Minor  
**Environment** · Assigned WholeCart demo, 14 November 2026

## Reproduce

**Data and setup** · Logged out; login page; both fields empty

Open Login; leave username and password empty; submit.

## Expected

Remain on Login and show clear required-field messages for both fields; do not show raw server output.

## Observed

Submitting with both fields blank rendered raw HTTP 422 JSON instead of clear required-field messages.

Blank form does not provide user-friendly field validation.

## Evidence

- [UI-LOGIN-BOTH-BLANK-422.png](../../evidence/screenshots/UI-LOGIN-BOTH-BLANK-422.png)

[Defect details](../defect-log.md)

# INQ-01 · Buyer inquiry workflow

**Status** · Fail  
**Requirement** · Buyer inquiry UI/CR-11  
**Defect** · WC-016  
**Severity** · S3 Major  
**Environment** · Assigned WholeCart demo, 14 November 2026

## Reproduce

**Data and setup** · See UI test steps; prepare the specified fixture before execution.

Open inquiry feature, create a valid inquiry and review its details.

## Expected

Inquiry saved with correct buyer and content.

## Observed

Message seller on a delivered order only changed the URL fragment; no form opened. Direct /inquiries returned 404.

The buyer inquiry workflow was not reachable through the UI.

## Evidence

- [INQ-01-message-seller-no-form.png](../../evidence/screenshots/INQ-01-message-seller-no-form.png)

[Defect details](../defect-log.md)

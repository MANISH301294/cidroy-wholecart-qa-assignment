# UI-FAVICON · Favicon request returns HTTP 404

**Status** · Fail  
**Requirement** · UI quality  
**Defect** · WC-001  
**Severity** · S4 Minor  
**Environment** · Assigned WholeCart demo, 14 November 2026

## Reproduce

**Data and setup** · Chromium on the demo login page.

Open the login page and inspect the network or console.

## Expected

A requested favicon loads successfully.

## Observed

The request for /favicon.ico returned HTTP 404.



## Evidence

- [console-2026-11-14T08-04-01-114Z.log](../../evidence/api-logs/console-2026-11-14T08-04-01-114Z.log)

[Defect details](../../docs/defect-log.md)

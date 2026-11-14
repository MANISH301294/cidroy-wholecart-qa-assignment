# WC-021 · Buyer can open another buyer’s invoice

**Severity** · S1 Blocker

**Requirement** · BR-21

**Case** · INV-10

**Environment** · Assigned WholeCart demo, 15 November 2026

1. Sign in as buyer1 (Spice Route Kitchen).
2. Open the invoice route `/invoices/5` directly.

**Expected** · The app denies access and displays no foreign invoice details.

**Actual** · The page renders invoice INV-00005 for Café Dosa Corner and shows order WC-01005-1 while the navigation identifies the signed-in buyer as Spice Route Kitchen. Statement access was outside this retest.

[Browser observation](../../evidence/api-logs/INV-10-browser-observation.txt)

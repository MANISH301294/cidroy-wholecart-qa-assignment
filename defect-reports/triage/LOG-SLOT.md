# WC-020 · Logistics CSV reverses delivery slot times

**Case** · LOG-SLOT

**Environment** · Assigned WholeCart demo

**Requirement** · IF-02

Place order WC-01082-1 in an 08:00–11:00 slot for two 12-piece cases. As the seller, accept the order. As the operator, generate a logistics export and inspect the row.

**Expected** · `slot_start=08:00`, `slot_end=11:00`, `pieces=24`.

**Actual** · `slot_start=11:00`, `slot_end=08:00`, `pieces=24`. The fixture order was cancelled and excluded from a subsequent export.

[API execution evidence](../../evidence/api-logs/integration-follow-up.txt#L31)

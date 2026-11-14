# WC-019 · CSV import omits row-level validation errors

**Case** · CSV-05

**Environment** · Assigned WholeCart demo, seller1

**Requirement** · IF-01

Submit four test rows containing tax rate 7, stock −1, case size 0, and piece price −1 respectively. Use separate test SKUs for each row.

**Expected** · Report the line number and reason for each invalid row.

**Actual** · HTTP 200 with `{"imported":4,"errors":[]}`. The response reports success for each submitted row.

[API execution evidence](../../evidence/api-logs/integration-follow-up.txt#L8)

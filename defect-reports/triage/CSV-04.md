# WC-019 · CSV import reports an invalid row as imported

**Case** · CSV-04

**Environment** · Assigned WholeCart demo, seller1

**Requirement** · IF-01

Upload a UTF-8 product CSV with the required header, one valid existing test SKU row, and a second row with piece price `bad`.

**Expected** · Import the valid row and report line 3 with the reason the piece price is invalid.

**Actual** · HTTP 200 with `{"imported":2,"errors":[]}`.

[API execution evidence](../../evidence/api-logs/integration-follow-up.txt#L7)


## Browser UI retest — 2026-11-15

Seller2 uploaded one valid update and one row with tax rate 55. The UI displayed `Import complete: 2 rows, 0 errors`; the valid SKU updated, the invalid SKU was absent from the seller list, and no line-level reason was shown. [UI evidence](../../evidence/ui-observations/CSV-import-2026-11-15.txt).

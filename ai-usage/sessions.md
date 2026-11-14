# AI Usage Notes

AI assistance was used to help:

- Turn the supplied functional design and release notes into test scenarios and negative cases.
- Organize execution records and defect reports.
- Exercise the authorized demo UI and summarize the observed behavior.
- Prepare the executed-test CSV and this assignment package.

The reported outcomes are tied to captured browser evidence. AI-generated test ideas or documentation are not evidence that a case passed. Skipped and not-run areas are called out separately. This package reports UI testing only; no production system was tested, and credentials were not included.

## Correction during packaging

The assistant-prepared scenario summary still reported 12 failures and described catalogue search as broken. The latest case sheet recorded 19 failures overall and marked CAT-03 as passing after exact-SKU and partial-name retests. I reconciled the counts. See [CAT-03 in the case sheet](../test-scenarios/ui-test-cases.csv) and the [execution summary](../test-summary/execution-summary.md).

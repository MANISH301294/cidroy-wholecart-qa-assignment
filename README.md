# WholeCart QA assignment

**Release recommendation · Hold.** Checkout can oversell inventory and create duplicate orders. The buyer UI accepted a seller subtotal below the approved minimum, invoices omit required supply information, and CSV import reports invalid rows as successful imports.

Testing was recorded on 14–15 November 2026. Of 115 UI cases, 40 passed, 23 failed, 21 were partial, 5 were skipped, 25 remain not run, and 1 was superseded. The release report records regression results and environment limitations.

## Submission

- [Questions and assumptions](assumptions.md)
- [Test plan](test-plan/test-plan.md)
- [End-to-end scenarios](test-scenarios/test-scenarios.md), [requirement coverage](test-scenarios/requirement-coverage.md), and [execution matrix](test-scenarios/execution-matrix.csv)
- [UI test specification and results](test-scenarios/ui-test-cases.csv) and [API test specification](docs/test-cases.md)
- [UI defect log](defect-reports/defect-log.md), [API and focused defect log](docs/defect-log.md), and [individual failed-case triage](defect-reports/triage/)
- [Release report](test-summary/release-report.md), [UI execution summary](test-summary/execution-summary.md), and [recorded API results](docs/results-report.md)
- [Repeatable regression suite and test-to-case mapping](docs/regression-suite.md)
- [Load test plan and runners](docs/load-test.md) · Safe metrics-rate sample recorded; 30-buyer checkout run pending dedicated fixtures
- [Five-minute voice walkthrough outline](evidence/recordings/README.md) · Recording pending
- [AI usage and verification](ai-usage/sessions.md)

## Run API and UI regression

Use Node.js 22 or newer. Install dependencies and Chromium once:

```sh
npm ci
npx playwright install chromium
```

Run the API and UI regression set against the assigned demo with one command:

```sh
WC_TEST_PASSWORD="$WHOLECART_TEST_PASSWORD" npm run test:regression
```

Set `WHOLECART_TEST_PASSWORD` in your shell from the approved demo credentials; do not commit credentials. Both API and UI tests default to the assigned WholeCart demo URL. For another approved QA copy, set `WC_BASE_URL` before invoking the same command. Role-specific usernames or passwords can be overridden with the `WC_BUYER1`, `WC_SELLER1`, `WC_OPERATOR` and corresponding `*_PASSWORD` variables.

The default command covers API authentication/role validation and UI login plus CSV-01 through CSV-07, including CAT-06. CSV-04/05 currently fail under WC-019. Fixture-dependent API checks skip when their required variables are absent. The dedicated CSV regression SKUs persist in the assigned demo because the seller UI has no product delete control. See [regression suite](docs/regression-suite.md) before targeting another environment.

The regression command intentionally checks the known CSV-04/05 validation defect, so it will report those assertions as failures until WC-019 is fixed. The full `npm test` command also includes opt-in mutation and concurrency checks. See [API test specification](docs/test-cases.md), [load test instructions](docs/load-test.md), and [defect reproduction instructions](docs/defect-log.md) for their data effects. The GitHub Actions workflow is manual and reads the target from `WC_BASE_URL` and password from a repository secret.

[Integration and non-functional execution results](test-summary/integration-nonfunctional-run.md)

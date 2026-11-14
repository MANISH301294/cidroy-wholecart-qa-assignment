# WholeCart QA assignment

**Release recommendation · Hold.** Checkout can oversell inventory and create duplicate orders. The buyer UI accepted a seller subtotal below the approved minimum, invoices omit required supply information, and CSV import reports invalid rows as successful imports.

Testing was recorded on 14–15 November 2026. Of 115 UI cases, 34 passed, 22 failed, 19 were partial, 4 were skipped, 35 remain not run, and 1 was superseded. The release report records regression results and environment limitations.

## Submission

- [Questions and assumptions](assumptions.md)
- [Test plan](test-plan/test-plan.md)
- [End-to-end scenarios](test-scenarios/test-scenarios.md), [requirement coverage](test-scenarios/requirement-coverage.md), and [execution matrix](test-scenarios/execution-matrix.csv)
- [UI test specification and results](test-scenarios/ui-test-cases.csv) and [API test specification](docs/test-cases.md)
- [UI defect log](defect-reports/defect-log.md), [API and focused defect log](docs/defect-log.md), and [individual failed-case triage](defect-reports/triage/)
- [Release report](test-summary/release-report.md), [UI execution summary](test-summary/execution-summary.md), and [recorded API results](docs/results-report.md)
- [Repeatable regression suite and test-to-case mapping](docs/regression-suite.md)
- [Load test plan and runner](docs/load-test.md) · Run pending 30 independent buyer fixtures
- [Five-minute voice walkthrough outline](evidence/recordings/README.md) · Recording pending
- [AI usage and verification](ai-usage/sessions.md)

## Run API and UI regression

Use Node.js 22 or newer. Install dependencies and Chromium once:

```sh
npm ci
npx playwright install chromium
```

Run the regression set with the approved demo URL and test-fixture password supplied separately:

```sh
WC_BASE_URL="$WHOLECART_DEMO_URL" WC_TEST_PASSWORD="$WHOLECART_TEST_PASSWORD" npm run test:regression
```

The default command covers API authentication/role validation and UI login plus CSV-01 through CSV-07, including CAT-06. CSV-04/05 currently fail under WC-019. Fixture-dependent API checks skip when their required variables are absent. The dedicated CSV regression SKUs persist in the assigned demo because the seller UI has no product delete control. See [regression suite](docs/regression-suite.md) before targeting another environment.

The full `npm test` command also includes opt-in mutation and concurrency checks. See [API test specification](docs/test-cases.md), [load test instructions](docs/load-test.md), and [defect reproduction instructions](docs/defect-log.md) for their data effects. The GitHub Actions workflow is manual and reads the target from `WC_BASE_URL` and password from a repository secret.

[Integration and non-functional execution results](test-summary/integration-nonfunctional-run.md)

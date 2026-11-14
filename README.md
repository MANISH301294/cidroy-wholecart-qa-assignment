# WholeCart QA assignment

**Release recommendation · Hold.** Checkout can oversell inventory and create duplicate orders. The buyer UI also accepted a seller subtotal below the approved minimum, and invoices omit required supply information.

Testing was recorded on the assigned WholeCart demo on 14 November 2026. Of 115 UI cases, 26 passed, 20 failed, 18 were partial, 3 were skipped, 47 were not run, and 1 was superseded. The focused API results and historical findings are documented in the release report.

## Submission

- [Questions and assumptions](assumptions.md)
- [Test plan](test-plan/test-plan.md)
- [End-to-end scenarios](test-scenarios/test-scenarios.md), [requirement coverage](test-scenarios/requirement-coverage.md), and [execution matrix](test-scenarios/execution-matrix.csv)
- [UI test specification and results](test-scenarios/ui-test-cases.csv) and [API test specification](docs/test-cases.md)
- [UI defect log](defect-reports/defect-log.md), [API and focused defect log](docs/defect-log.md), and [individual failed-case triage](defect-reports/triage/)
- [Release report](test-summary/release-report.md), [UI execution summary](test-summary/execution-summary.md), and [recorded API results](docs/results-report.md)
- [Load test plan and runner](docs/load-test.md) · Run pending 30 independent buyer fixtures
- [Five-minute voice walkthrough outline](evidence/recordings/README.md) · Recording pending
- [AI usage and verification](ai-usage/sessions.md)

## Run API and UI regression

Use Node.js 22 or newer. Install dependencies and Chromium once.

```sh
npm ci
npx playwright install chromium
```

Run both suites together with the demo URL and test-fixture password supplied separately to reviewers.

```sh
WC_BASE_URL="$WHOLECART_DEMO_URL" WC_TEST_PASSWORD="$WHOLECART_TEST_PASSWORD" npm test
```

Set the two shell variables from the assignment credentials before running. Account names and per-account password overrides are defined in [test fixtures](tests/support/api.ts). The default run exercises login, role access, catalogue and API validation. Fixture-dependent checks skip when their required variables are absent. See [API test specification](docs/test-cases.md) and [defect reproduction instructions](docs/defect-log.md) for the opt-in stock race and other mutation checks. The GitHub Actions workflow is manual and reads the target from `WC_BASE_URL` and the password from a repository secret.

[Integration and non-functional execution results](test-summary/integration-nonfunctional-run.md)

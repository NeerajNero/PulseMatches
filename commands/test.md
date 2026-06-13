# `/test`

## Usage

```text
/test <path-to-implementation-report.md>
```

If no path is provided, ask which implementation report or approved feature should be tested.

## Purpose

Run or add targeted tests for an implemented and API-integrated feature.

Boundary:

- Use `/test` for business behavior and user-facing scenarios.
- Use `/verify` for readiness checks.
- Use `/api-integrate` for SDK/client wiring.

## Inputs

- Implementation report, approval file, or approved plan.
- Test commands listed in the plan/report.
- Existing test structure.

## Allowed Actions

- Run targeted unit, integration, e2e, contract, web, or mobile tests.
- Add narrow tests when the approved scope requires tests or when a small test is needed to prove the feature.
- Update the implementation report test section.

## Forbidden Actions

- Do not add broad unrelated test refactors.
- Do not mark tested when no meaningful test or documented manual check was run.
- Do not use `/test` to implement feature scope that belongs in `/implement`.

## Output

- Updated implementation report with status `tested` or `blocked`.
- Commands run, tests added, pass/fail result, and gaps.

## Prompt

```text
Run /test for the provided implementation report or approved feature.

Read the approved plan and implementation report. Run the targeted test commands. Add narrow tests only when they are in scope or necessary to prove the feature. Update docs/features/reports/<feature-slug>.implementation.md with results and gaps.

If the user did not provide a file path, ask which feature should be tested.
```

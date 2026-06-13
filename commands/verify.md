# `/verify`

## Usage

```text
/verify <path-to-implementation-report.md>
```

If no path is provided, ask which implementation report or approved feature should be verified.

## Purpose

Verify that an implemented feature matches the approved plan and project standards before API integration.

Boundary:

- Use `/verify` for implementation readiness: migration status, boot/build/typecheck/lint, API docs availability, mobile app startup, and contract readiness.
- Use `/api-integrate` for OpenAPI/SDK/client wiring.
- Use `/test` for business scenarios and test suites.

## Inputs

- Implementation report, approval file, or approved plan.
- Verification commands listed in the plan/report.
- Changed files.

## Allowed Actions

- Run verification commands.
- Inspect changed files.
- Check migration, backend contract, SDK, web, mobile, queue, SQL, observability, and provider requirements.
- Update the implementation report verification section.

## Forbidden Actions

- Do not broaden feature scope.
- Do not make large implementation changes; use `/implement` or `/revise-plan` for that.
- Do not mark verified when required checks are blocked without documenting the gap.

## Output

- Updated implementation report with status `verified` or `blocked`.
- Clear list of commands run and gaps.

## Prompt

```text
Run /verify for the provided implementation report or approved feature.

Read the approved plan and implementation report. Run the verification commands that are available and relevant. Inspect changed files for obvious contract, migration, SDK, web, mobile, queue, SQL, observability, or provider gaps.

Update docs/features/reports/<feature-slug>.implementation.md with verification results.

If the user did not provide a file path, ask which feature should be verified.
```

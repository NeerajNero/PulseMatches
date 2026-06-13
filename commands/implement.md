# `/implement`

## Usage

```text
/implement <path-to-approval-approved-plan-or-classified-tiny-task.md>
```

If no path is provided, ask which approved feature file or classified tiny task should be implemented.

## Purpose

Generate code for one approved feature, or one clearly classified tiny task, as a scoped vertical slice using the existing skills and agents.

## Inputs

- An approval file, or a feature plan with explicit approved status.
- A tiny classification file when the change is explicitly classified as tiny.
- Project docs and command map.
- Project context docs under `docs/context` when present.
- Relevant codebase.
- Existing skills and agent prompts.

## Allowed Actions

- Modify application code.
- Add or update migrations.
- Update backend DTOs, Swagger/OpenAPI, services, repositories, transforms, queues, SQL, observability, and integrations as required by the plan.
- Prepare backend contract changes for later OpenAPI/SDK generation.
- Implement web and/or mobile frontend scope from the plan.
- Update relevant docs.
- Create or update `docs/features/reports/<feature-slug>.implementation.md` using [templates/feature-implementation-report.md](../templates/feature-implementation-report.md).

## Forbidden Actions

- Do not implement an unapproved normal or risky plan.
- Do not silently broaden scope.
- Do not implement multiple features unless the input file explicitly describes a batch and the user confirms it.
- Do not skip migration-first or backend contract steps when required.
- Do not do final API/client integration if the flow separates it into `/api-integrate`; prepare contracts and implementation, then leave API integration for that command.

## Stop Conditions

Pause and ask for plan revision when:

- The plan is not approved.
- The classification says normal or risky but no approval exists.
- The requested file is ambiguous.
- Implementation requires a materially different data model, API contract, native capability, external provider, or UX than the approved plan.
- Required secrets, credentials, or destructive operations are needed.

## Output

- Code changes scoped to the approved feature.
- Updated implementation report with changed files, commands, status, and gaps.

## Prompt

```text
Run /implement for the provided approved feature.

First confirm the file is an approval file, approved feature plan, or clearly classified tiny task. If the work is normal or risky and not approved, stop and ask the user to run /approve.

Read compact project context before broad codebase scanning.

Implement only the approved scope using the existing starter-pack skills and agent prompts.

Follow Docker-first, migration-first, contract-first, generated SDK, web/mobile frontend, queue, SQL, observability, and provider patterns as applicable.

Create or update docs/features/reports/<feature-slug>.implementation.md with changed files, commands run, implementation notes, verification status, API integration status, test status, and gaps.

If the user did not provide a file path, ask which approved feature file or classified tiny task should be implemented.
```

# `/plan`

## Usage

```text
/plan <path-to-user-stories.md>
```

If no path is provided, ask which user-story file to plan from.

## Purpose

Turn user stories and feature lists into one or more implementation-ready feature plans.

## Inputs

- A markdown user-story file.
- Classification artifact when one already exists.
- Existing project docs, especially project brief, architecture, command map, patterns, and anti-patterns.
- Existing project context docs under `docs/context` when present.
- Relevant codebase structure.

## Allowed Actions

- Read docs and code.
- Identify features, dependencies, risks, and missing decisions.
- Create or update `docs/features/feature-index.md`.
- Create or update `docs/features/plans/<feature-slug>.plan.md` using [templates/feature-plan.md](../templates/feature-plan.md).
- Record the selected lane from classification when available.

## Forbidden Actions

- Do not edit application code.
- Do not create migrations.
- Do not install packages.
- Do not regenerate SDKs.
- Do not mark anything approved.

## Output

- One or more feature plan files with status `needs-approval`.
- A short summary of created/updated plan files and open questions.

## Prompt

```text
Run /plan for the provided user-story file.

Read the file, inspect the project docs and compact context docs first, then inspect the codebase enough to understand the current architecture. If a classification exists, carry its lane and risk triggers into the plan. Create implementation-ready feature plans under docs/features/plans.

Do not change application code. Do not create migrations. Do not install dependencies.

Each plan must include source story IDs, scope, non-goals, surfaces, implementation sequence, data/API/SDK/frontend/mobile impact, acceptance criteria, verification commands, test commands, risks, open questions, and approval status.

If the user did not provide a file path, ask which user-story file to use.
```

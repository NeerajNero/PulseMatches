# `/context-update`

## Usage

```text
/context-update <path-to-final-or-implementation-report.md>
```

If no file is provided, ask which finalized feature should update project context.

## Purpose

Compress a completed feature into durable project context so future agents can find the right files, decisions, APIs, and constraints without scanning the whole codebase first.

## Inputs

- Final feature handoff file or implementation report.
- Approved plan.
- Changed files.
- Existing `docs/context` files.

## Allowed Actions

- Create or update `docs/context/project-map.md`.
- Create or update `docs/context/feature-memory.md`.
- Create or update focused context maps when relevant:
  - `docs/context/decisions.md`
  - `docs/context/api-map.md`
  - `docs/context/data-model-map.md`
  - `docs/context/frontend-map.md`
  - `docs/context/mobile-map.md`
  - `docs/context/operations-map.md`
- Keep entries compact, factual, and link-oriented.

## Forbidden Actions

- Do not edit application code.
- Do not create long narrative summaries.
- Do not duplicate generated code or large source snippets.
- Do not mark unresolved gaps as completed.

## Output

- Updated context docs.
- A short note listing what context changed.

## Prompt

```text
Run /context-update for the provided final feature handoff or implementation report.

Extract only durable facts: what was built, why, main files, routes, migrations, SDK/API wiring, web/mobile surfaces, queues, providers, tests, known gaps, and where future agents should look first.

Update docs/context/project-map.md, docs/context/feature-memory.md, and any focused maps that apply. Keep entries compact and factual.

Do not change application code.
```

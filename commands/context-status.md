# `/context-status`

## Usage

```text
/context-status [docs/context]
```

If no path is provided, use `docs/context`.

## Purpose

Check whether the project context docs are present, current, and useful for future planning or implementation.

## Inputs

- `docs/context` files.
- Feature final files.
- Feature implementation reports.
- Feature index.

## Allowed Actions

- Read context and feature artifacts.
- Report missing or stale context entries.
- Suggest `/context-update` targets.
- Update context index links only when clearly stale.

## Forbidden Actions

- Do not edit application code.
- Do not summarize the whole codebase.
- Do not mark context current when finalized features are missing from memory.

## Output

- Context health summary.
- Missing feature memory entries.
- Suggested next `/context-update` commands.

## Prompt

```text
Run /context-status.

Inspect docs/context and finalized feature artifacts. Report whether project-map, feature-memory, decisions, API, data model, frontend, mobile, and operations maps are present and current. Suggest exact /context-update commands for missing entries.

Do not change application code.
```

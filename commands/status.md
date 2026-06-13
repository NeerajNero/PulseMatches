# `/status`

## Usage

```text
/status [docs/features]
```

If no path is provided, use `docs/features`.

## Purpose

Show the current state of all classified, planned, approved, implemented, verified, API-integrated, tested, reviewed, blocked, and deferred features.

## Inputs

- `docs/features/feature-index.md`
- `docs/features/classifications/*.classification.md`
- `docs/features/plans/*.plan.md`
- `docs/features/approvals/*.approval.md`
- `docs/features/reports/*.implementation.md`
- `docs/features/current.md` when present.

## Allowed Actions

- Read feature artifacts.
- Summarize feature statuses.
- Summarize each feature lane when classification exists.
- Identify missing artifact links.
- Update `docs/features/feature-index.md` if it is stale.

## Forbidden Actions

- Do not edit application code.
- Do not change feature scope.
- Do not approve, implement, verify, or test anything.

## Output

- Feature status table.
- Current selected feature.
- Blockers.
- Next suggested command per feature.

## Prompt

```text
Run /status for the feature workspace.

Read docs/features/feature-index.md plus classifications, plans, approvals, reports, blocks, and current feature pointer when present. Summarize all features by lane, status, and next command. Update the feature index only if artifact links or statuses are stale.

Do not change application code.
```

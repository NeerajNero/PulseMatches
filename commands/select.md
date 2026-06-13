# `/select`

## Usage

```text
/select <feature-slug-or-artifact-file>
```

If no feature is provided, ask which feature should become current.

## Purpose

Set the current active feature so later commands can default to it when the target file is unambiguous.

## Inputs

- Feature slug, plan file, approval file, or implementation report.
- Existing feature artifacts.

## Allowed Actions

- Read feature artifacts.
- Create or update `docs/features/current.md` using [templates/current-feature.md](../templates/current-feature.md).
- Update `docs/features/feature-index.md` current marker when useful.

## Forbidden Actions

- Do not edit application code.
- Do not approve or implement anything.
- Do not guess when multiple features match.

## Output

- Updated current feature pointer.
- Suggested next command.

## Prompt

```text
Run /select for the provided feature.

Resolve the feature slug or artifact file to one feature. If multiple features match, ask the user to choose. Create or update docs/features/current.md with the selected feature, artifact paths, status, and next recommended command.

Do not change application code.
```

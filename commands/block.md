# `/block`

## Usage

```text
/block <feature-artifact-file>
```

If no file is provided, ask which feature should be marked blocked.

## Purpose

Record why a feature cannot proceed and what must happen next.

## Inputs

- Plan, approval, implementation report, or current feature pointer.
- Blocker details from the user or from a failed command.

## Allowed Actions

- Create or update `docs/features/blocks/<feature-slug>.block.md` using [templates/feature-block.md](../templates/feature-block.md).
- Update feature index status to `blocked`.
- Add blocker summary to the plan or implementation report.

## Forbidden Actions

- Do not edit application code.
- Do not silently change scope.
- Do not mark blocked without a clear reason and owner.

## Output

- Block file.
- Required unblock action.
- Suggested next command, usually `/revise-plan`, `/verify`, `/api-integrate`, or `/test`.

## Prompt

```text
Run /block for the provided feature artifact.

Record the blocker, failed command if any, owner, unblock condition, and recommended next command under docs/features/blocks/<feature-slug>.block.md. Update feature index status to blocked.

Do not change application code.
```

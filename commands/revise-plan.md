# `/revise-plan`

## Usage

```text
/revise-plan <path-to-feature-plan.md>
```

If no path is provided, ask which feature plan should be revised.

## Purpose

Update a feature plan before approval or after implementation reveals a material scope change.

## Inputs

- Feature plan.
- User clarification or new requirements.
- Any blocking notes from `/implement`, `/verify`, `/api-integrate`, `/test`, or `/review`.

## Allowed Actions

- Update the feature plan.
- Add decisions, risks, open questions, or changed implementation sequence.
- Return status to `needs-approval`.

## Forbidden Actions

- Do not edit application code.
- Do not keep approval valid if scope materially changed.

## Output

- Updated feature plan requiring approval again.
- Summary of what changed and why.

## Prompt

```text
Run /revise-plan for the provided feature plan.

Incorporate the user's clarification or blocker notes. Update scope, non-goals, implementation sequence, acceptance criteria, verification, tests, risks, and open questions. Set status back to needs-approval.

Do not change application code.

If the user did not provide a file path, ask which feature plan should be revised.
```

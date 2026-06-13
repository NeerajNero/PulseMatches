# `/approve`

## Usage

```text
/approve <path-to-feature-plan.md>
```

If no path is provided, ask which feature plan should be approved.

## Purpose

Record explicit human approval for one feature plan.

## Inputs

- A feature plan with status `needs-approval`.

## Allowed Actions

- Read and validate the plan.
- Ask for answers to blocking open questions.
- Create `docs/features/approvals/<feature-slug>.approval.md` using [templates/feature-approval.md](../templates/feature-approval.md).
- Mark the approval status as `approved`.

## Forbidden Actions

- Do not edit application code.
- Do not approve plans with unresolved blocking questions.
- Do not approve multiple unrelated features unless the user explicitly provides a batch approval file.

## Output

- One approval file.
- A short summary of approved scope and any conditions.

## Prompt

```text
Run /approve for the provided feature plan.

Validate that the plan is specific enough to implement safely. If there are unresolved blocking questions, ask for answers and do not create approval.

If approval can proceed, create docs/features/approvals/<feature-slug>.approval.md. Do not change application code.

If the user did not provide a file path, ask which feature plan should be approved.
```

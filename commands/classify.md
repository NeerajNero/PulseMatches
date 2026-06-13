# `/classify`

## Usage

```text
/classify <task-or-story-file>
```

If no file is provided, ask which task or user-story file should be classified.

## Purpose

Choose the right workflow lane before planning or implementation.

## Inputs

- Task file, user-story file, feature plan, or direct task description.
- [docs/flow-policy.md](../docs/flow-policy.md)
- [docs/feature-command-flow.md](../docs/feature-command-flow.md)
- Existing project context when useful.

## Allowed Actions

- Read task/story artifacts.
- Inspect project context docs when useful.
- Create or update `docs/features/classifications/<feature-slug>.classification.md` using [templates/feature-classification.md](../templates/feature-classification.md).
- Recommend required and optional commands.

## Forbidden Actions

- Do not edit application code.
- Do not approve or implement anything.
- Do not silently downgrade risky work to tiny.

## Output

- Lane: tiny, normal, or risky.
- Confidence: high, medium, or low.
- Reason.
- Required commands.
- Optional commands.
- Approval requirement.
- Context update requirement.
- API integration requirement.
- Risk triggers and open questions.

## Prompt

```text
Run /classify for the provided task or story file.

Read docs/flow-policy.md, inspect the task/story, and choose the highest-risk matching lane: tiny, normal, or risky. If ambiguous, choose the stricter lane and record why confidence is not high.

Create docs/features/classifications/<feature-slug>.classification.md with the decision, confidence, reason, required commands, optional commands, approval requirement, API integration requirement, context update requirement, risks, and open questions.

Do not change application code.
```

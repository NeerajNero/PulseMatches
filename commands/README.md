# Command Index

These command specs define the feature-wise agent flow.

Use them as slash-command prompts or copy the command body into your agent message.

## Core Commands

- [`/classify`](classify.md): choose tiny, normal, or risky flow before planning or implementation.
- [`/plan`](plan.md): turn user stories into feature plans. No code changes.
- [`/approve`](approve.md): record human approval for one feature plan. No code changes.
- [`/implement`](implement.md): generate code for one approved feature using existing skills and agents.
- [`/verify`](verify.md): verify an implemented feature against the plan.
- [`/api-integrate`](api-integrate.md): wire verified code to OpenAPI/SDK wrappers and web/mobile API callers.
- [`/test`](test.md): run or add targeted tests for the implemented feature.
- [`/review`](review.md): review the implemented feature for correctness.
- [`/finalize`](finalize.md): prepare final handoff after review.
- [`/context-update`](context-update.md): update compact project context from a completed feature.
- [`/revise-plan`](revise-plan.md): update a plan and return it to approval.

## Support Commands

- [`/status`](status.md): show all feature statuses and next commands.
- [`/select`](select.md): set the current active feature.
- [`/block`](block.md): record a blocker and unblock condition.
- [`/context-status`](context-status.md): check whether project context is current.

## Required Behavior

- If a command requires a file path and none is provided, ask which file to use.
- Use [docs/flow-policy.md](../docs/flow-policy.md) to choose the smallest safe lane.
- Tiny changes may skip `/plan` and `/approve` only when classified as tiny and scoped clearly.
- `/plan` and `/approve` do not edit application code.
- `/implement` requires an approved plan or approval file, except for explicitly classified tiny changes.
- `/api-integrate` requires a verified implementation report.
- `/finalize` requires no blocking review findings.
- `/context-update` should run after `/finalize` for normal and risky features.
- Each command updates durable markdown artifacts under `docs/features`.
- Commands should stay small and composable.

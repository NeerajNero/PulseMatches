# Feature Command Flow

Use this flow when features are described as user stories in markdown and implemented step by step with an agent.

The core rule:

```text
Stories -> /classify -> lane decision -> plan when needed -> approve when needed -> implement -> verify -> API integrate when needed -> test/review/finalize/context update by lane
```

No application code is changed before `/implement`.

Use [docs/flow-policy.md](flow-policy.md) to choose the lane:

- Tiny change: `/implement`, `/verify`, and optional `/test` or `/review`.
- Normal feature: full command flow with approval and context update.
- Risky feature: full command flow with stricter verification, testing, and review.

## Artifacts

Each feature should produce durable files in the target project:

```text
docs/features/
  user-stories.md
  feature-index.md
  classifications/
    <feature-slug>.classification.md
  plans/
    <feature-slug>.plan.md
  approvals/
    <feature-slug>.approval.md
  reports/
    <feature-slug>.implementation.md
  blocks/
    <feature-slug>.block.md
  final/
    <feature-slug>.final.md
  current.md
docs/context/
  project-map.md
  feature-memory.md
  decisions.md
  api-map.md
  data-model-map.md
  frontend-map.md
  mobile-map.md
  operations-map.md
```

Use the templates:

- [templates/user-stories.md](../templates/user-stories.md)
- [templates/feature-classification.md](../templates/feature-classification.md)
- [templates/feature-plan.md](../templates/feature-plan.md)
- [templates/feature-approval.md](../templates/feature-approval.md)
- [templates/feature-implementation-report.md](../templates/feature-implementation-report.md)
- [templates/current-feature.md](../templates/current-feature.md)
- [templates/feature-block.md](../templates/feature-block.md)
- [templates/feature-final.md](../templates/feature-final.md)
- [templates/context-project-map.md](../templates/context-project-map.md)
- [templates/context-feature-memory.md](../templates/context-feature-memory.md)
- [templates/command-spec.md](../templates/command-spec.md)

## Feature Statuses

Use these status values:

```text
story-draft
classified
planned
needs-approval
approved
implementing
implemented
verified
api-integrated
tested
reviewed
finalized
context-updated
blocked
deferred
```

Status should be visible in the plan, approval, and implementation report.

## Command Contract

Every slash command should follow this shape:

```text
/command <artifact-file>
```

If the file path is missing, the agent must ask which file to use before doing work.

Commands should read the relevant artifact, inspect the codebase as needed, and write the next artifact. A command should not skip lifecycle stages unless the user explicitly asks to revise the flow itself.

The exception is a classified tiny change. Tiny changes may skip `/plan`, `/approve`, `/api-integrate`, `/review`, `/finalize`, and `/context-update` when the classification explains why those gates are unnecessary.

## Command Summary

### `/classify <task-or-user-stories.md>`

Reads a task, user-story file, or feature note and chooses a workflow lane.

Allowed actions:

- Read flow policy, task/story artifacts, and compact project context.
- Inspect only enough code to understand blast radius.
- Create `docs/features/classifications/<feature-slug>.classification.md`.
- Recommend required commands, optional commands, and gate decisions.

Not allowed:

- Application code changes.
- Approval.
- Implementation.

### `/plan <user-stories.md>`

Reads a markdown file containing user stories and feature notes.

Allowed actions:

- Inspect repo docs and codebase.
- Identify features, dependencies, risks, and open questions.
- Create or update `docs/features/feature-index.md`.
- Create one or more files under `docs/features/plans/`.
- Mark each plan as `needs-approval`.

Not allowed:

- Application code changes.
- Migrations.
- Package installs.
- SDK generation.

### `/approve <feature-plan.md>`

Records human approval for a specific plan.

Allowed actions:

- Validate that the plan has enough detail to implement.
- Ask for missing decisions if the plan is ambiguous.
- Create `docs/features/approvals/<feature-slug>.approval.md`.
- Mark status as `approved`.

Not allowed:

- Application code changes.
- Silent approval without the user running `/approve`.

### `/implement <approved-plan-or-approval.md>`

Generates code for the approved feature using existing skills and agents.

Allowed actions:

- Modify application code.
- Create migrations.
- Update backend contracts.
- Prepare OpenAPI/SDK generation points.
- Implement backend, web, and/or mobile code in the approved scope.
- Update docs affected by the feature.
- Create or update `docs/features/reports/<feature-slug>.implementation.md`.

Required behavior:

- If the file path is missing, ask which approved plan, approval file, or classified tiny task to implement.
- Refuse or stop if the plan is not approved, except for clearly classified tiny changes.
- Keep changes scoped to the approved plan.
- Use the existing starter-pack skills and agent prompts that match the approved surfaces.
- If implementation reveals a material scope change, pause and ask for plan revision.

### `/verify <implementation-report.md>`

Runs verification for the implemented feature before API integration.

Purpose boundary:

- Verify that generated code matches the approved plan.
- Verify migration status, backend boot/API docs, typecheck/build, lint, app startup, and obvious contract readiness.
- Do not prove all business scenarios; that belongs in `/test`.
- Do not wire SDK/client calls; that belongs in `/api-integrate`.

Allowed actions:

- Run the verification commands listed in the plan/report.
- Inspect changed files and contracts.
- Update verification results in the implementation report.
- Record known gaps.

Verification is not a substitute for tests; it checks that the feature was implemented according to the plan and is ready for API integration.

### `/api-integrate <implementation-report.md>`

Wires the verified implementation into generated SDKs, API wrappers, hooks/services, and web/mobile callers.

Purpose boundary:

- Regenerate or refresh API contracts and generated SDKs.
- Wire backend routes to generated clients and frontend/mobile API services.
- Run narrow API smoke checks.
- Do not add broad feature code that belongs in `/implement`.
- Do not run the full test matrix; that belongs in `/test`.

Allowed actions:

- Regenerate OpenAPI and SDK.
- Update SDK wrapper/client registrations.
- Wire web hooks/services to SDK clients.
- Wire mobile hooks/services to SDK clients.
- Run narrow API smoke checks.
- Update API integration results in the implementation report.

Required behavior:

- If the file path is missing, ask which implementation report should receive API integration.
- Stop if the feature has not been verified.
- Do not hand-edit generated SDK files.
- Do not use raw backend URLs where SDK support exists.

### `/test <implementation-report.md>`

Runs automated or manual test commands after implementation and API integration.

Purpose boundary:

- Prove business behavior and user-facing scenarios.
- Run unit, integration, contract, e2e, mobile-device, or manual scenario tests listed in the plan.
- Add narrow tests when they are required to prove the approved feature.
- Do not use `/test` to do missing implementation work.

Allowed actions:

- Run targeted unit, integration, contract, e2e, web, or mobile tests.
- Add missing narrow tests when the approved scope includes test work or when needed to prove the feature.
- Update test results in the implementation report.

If broad test suites are too expensive or blocked, run the narrowest meaningful checks and document the gap.

### `/review <implementation-report.md>`

Reviews the implemented and API-integrated feature against starter-pack standards.

Allowed actions:

- Produce findings first, ordered by severity.
- Reference files and lines.
- Identify missing tests, SDK drift, migration risk, auth gaps, mobile config gaps, queue risks, SQL risks, and observability gaps.
- Update report status to `reviewed` only when there are no blocking findings.

### `/finalize <implementation-report.md>`

Prepares the final feature handoff.

Allowed actions:

- Create or update `docs/features/final/<feature-slug>.final.md`.
- Summarize shipped scope, changed files, commands, verification, API integration, tests, review result, gaps, and follow-ups.
- Mark status as `finalized` only when no blocking review findings remain.

### `/context-update <final-or-implementation-report.md>`

Compresses the completed feature into durable project context.

Allowed actions:

- Update `docs/context/project-map.md`.
- Update `docs/context/feature-memory.md`.
- Update focused maps for decisions, API, data model, web, mobile, and operations when relevant.
- Keep entries compact, factual, and link-oriented.

Not allowed:

- Application code changes.
- Long narrative summaries.
- Large copied source snippets.

### `/context-status [docs/context]`

Checks whether the project context docs are current.

Allowed actions:

- Compare finalized feature artifacts to context memory.
- Report missing or stale context entries.
- Suggest exact `/context-update` commands.

### `/status [docs/features]`

Shows every feature and its current state.

Allowed actions:

- Read plans, approvals, implementation reports, block files, final files, and current feature pointer.
- Update `docs/features/feature-index.md` if artifact links or statuses are stale.
- Suggest the next command per feature.

Not allowed:

- Application code changes.
- Approval, implementation, verification, testing, or review.

### `/select <feature-slug-or-artifact-file>`

Sets the current active feature.

Allowed actions:

- Create or update `docs/features/current.md`.
- Resolve artifact paths for the selected feature.
- Suggest the next command.

If multiple features match, ask the user to choose.

### `/block <feature-artifact-file>`

Records why a feature is blocked.

Allowed actions:

- Create or update `docs/features/blocks/<feature-slug>.block.md`.
- Update feature index status to `blocked`.
- Add blocker notes to the implementation report when relevant.

Every block must include a reason, owner, unblock condition, and recommended next command.

### `/revise-plan <feature-plan.md>`

Updates a plan before approval or after blocked implementation, verification, API integration, testing, review, or finalization.

Allowed actions:

- Incorporate new requirements or open-question answers.
- Change scope, risks, sequence, and verification plan.
- Return status to `needs-approval`.

Not allowed:

- Application code changes.

## Planning Rules

The `/plan` command should create plans that are small enough to implement as vertical slices.

Each plan must include:

- Source story IDs.
- User-visible outcome.
- Scope and non-goals.
- Surfaces: backend, web, mobile, docs, infra, integrations.
- Data model and migration impact.
- API contract and SDK impact.
- UI/screen impact.
- Background jobs, SQL, observability, and provider impact.
- Acceptance criteria.
- Verification and test commands.
- Open questions.
- Approval status.

## Approval Rules

Approval is explicit. A feature is approved only when the user runs:

```text
/approve docs/features/plans/<feature-slug>.plan.md
```

The approval file should record:

- Approved plan path.
- Approved scope.
- Approver.
- Date.
- Any conditions.

If a plan has unresolved blocking questions, `/approve` must ask for answers instead of creating approval.

## Implementation Rules

Implementation is explicit. The user must run:

```text
/implement docs/features/approvals/<feature-slug>.approval.md
```

The agent must not implement every planned feature automatically. It implements one approved feature file unless the user explicitly passes a batch file.

## API Integration Rules

API integration is explicit and happens after verification:

```text
/api-integrate docs/features/reports/<feature-slug>.implementation.md
```

This command owns OpenAPI/SDK regeneration and client wrapper/hook wiring. Keep it separate so generated code and API usage are verified after implementation compiles at the feature boundary.

## Context Rules

Context docs are a compact memory layer for future agents. They do not replace code inspection; they point agents to the right places first.

Rules:

- Run `/context-update` after `/finalize`.
- Keep feature memory entries short, usually 20-40 lines.
- Link files and artifacts instead of copying code.
- Record durable decisions in `docs/context/decisions.md`.
- Record where future agents should look first.
- If context becomes stale, use `/context-status` to identify missing updates.

## Extending The Flow

New commands can be added without changing the whole system.

To add a command:

1. Create `commands/<name>.md` using [templates/command-spec.md](../templates/command-spec.md).
2. Add the command to [commands/README.md](../commands/README.md).
3. Add required artifacts or templates.
4. Define allowed actions and forbidden actions.
5. Define which status values it can read and write.
6. Add verification rules.

Keep commands narrow. A command that can plan, approve, implement, verify, integrate APIs, and update context at once is too broad.

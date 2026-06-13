# Flow README

Use this file as the day-to-day guide for working with this starter pack.

The goal is to avoid two failures:

- Moving too fast and skipping plans, migrations, API contracts, or verification.
- Making every small change go through a heavy process.

The flow solves this by classifying work first, then using the lightest safe lane.

## Quick Start

For a new project:

```text
1. Read README.md and START_HERE.md.
2. Fill docs/project-brief.md from templates/project-brief.md.
3. Decide project shape: backend, frontend, web, mobile, or both.
4. Scaffold Docker and migrations before feature work.
5. Write user stories in docs/features/user-stories.md.
6. Run /classify before planning or implementation when scope is unclear.
```

For feature work:

```text
/classify docs/features/user-stories.md
```

Then follow the selected lane.

## The Three Lanes

### Tiny Change

Use for low-risk work:

- Copy or docs updates.
- Small styling change.
- Isolated local bug.
- Component-only fix with no API, auth, schema, SDK, provider, queue, or infra change.

Flow:

```text
/classify <task-file>
/implement <classified-task>
/verify docs/features/reports/<feature>.implementation.md
```

Optional:

```text
/test
/review
```

Tiny changes do not need `/plan`, `/approve`, `/api-integrate`, `/finalize`, or `/context-update` unless the classification says they do.

### Normal Feature

Use for normal product work:

- New screen or page.
- New backend endpoint using existing auth and data patterns.
- CRUD flow.
- Reusable component plus product usage.
- SDK/client integration that follows existing conventions.

Flow:

```text
/classify docs/features/user-stories.md
/plan docs/features/user-stories.md
/approve docs/features/plans/<feature>.plan.md
/implement docs/features/approvals/<feature>.approval.md
/verify docs/features/reports/<feature>.implementation.md
/api-integrate docs/features/reports/<feature>.implementation.md
/test docs/features/reports/<feature>.implementation.md
/review docs/features/reports/<feature>.implementation.md
/finalize docs/features/reports/<feature>.implementation.md
/context-update docs/features/final/<feature>.final.md
```

### Risky Feature

Use for anything with higher blast radius:

- Database schema, migrations, raw SQL, triggers, functions, materialized views.
- Auth, roles, permissions, sessions, cookies, tokens.
- Payments, subscriptions, billing, refunds.
- Background jobs, queues, cron, retries, DLQ.
- External providers, webhooks, storage, email, SMS, push notifications.
- Mobile native config, permissions, EAS, app config, camera, notifications.
- Docker, deployment, secrets, observability, infrastructure.
- Large cross-cutting refactors.

Flow is the same as normal, but verification and review are stricter. Use `/block` for missing secrets or infrastructure. Use `/revise-plan` when scope changes.

## Efficient Usage Rules

- Start with `/classify` when you are unsure how much process is needed.
- Use the full flow only for normal and risky features.
- Keep user stories small enough to become vertical slices.
- Do not implement normal or risky work before `/approve`.
- Do not combine `/implement` and `/api-integrate` when the flow requires verification between them.
- Update context only when the feature creates durable knowledge future agents should reuse.
- If implementation discovers a larger scope, stop and run `/revise-plan`.
- Prefer links to source files in artifacts instead of copying large code blocks into docs.
- Use `/status` when several features are active.
- Use `/select` to make one feature the active working context.

## Artifact Map

Typical target project files:

```text
docs/project-brief.md
docs/command-map.md
docs/env-checklist.md
docs/architecture.md
docs/features/user-stories.md
docs/features/feature-index.md
docs/features/current.md
docs/features/classifications/<feature>.classification.md
docs/features/plans/<feature>.plan.md
docs/features/approvals/<feature>.approval.md
docs/features/reports/<feature>.implementation.md
docs/features/blocks/<feature>.block.md
docs/features/final/<feature>.final.md
docs/context/project-map.md
docs/context/feature-memory.md
docs/context/decisions.md
docs/context/api-map.md
docs/context/data-model-map.md
docs/context/frontend-map.md
docs/context/mobile-map.md
docs/context/operations-map.md
```

## Commands

Commands are workflow gates. They decide what work is allowed at each stage.

| Command | Use When | What It Does | Must Not Do |
| --- | --- | --- | --- |
| `/classify` | Before planning or implementation when scope is unclear | Chooses tiny, normal, or risky lane and records required gates | Change app code or approve work |
| `/plan` | User stories are ready | Creates implementation-ready feature plans | Change app code, migrations, packages, or SDK |
| `/approve` | User has reviewed a plan | Records human approval | Silently approve unclear plans or change app code |
| `/implement` | Work is approved, or classified tiny | Generates scoped code using skills and agents | Broaden scope or perform final API integration |
| `/verify` | Implementation exists | Checks implementation against plan and readiness | Replace business tests or wire SDK clients |
| `/api-integrate` | Verified backend/API changes need clients | Regenerates OpenAPI/SDK and wires wrappers/hooks/callers | Hand-edit generated SDK files |
| `/test` | Behavior must be proved | Runs or adds targeted tests | Finish missing implementation work |
| `/review` | Feature is implemented and tested enough to inspect | Finds bugs, regressions, missing tests, SDK drift, migration risks | Rewrite the feature without a finding |
| `/finalize` | Review has no blocking findings | Creates final handoff and status | Hide gaps or skip unresolved blockers |
| `/context-update` | Normal/risky feature is finalized | Compresses durable feature knowledge into docs/context | Duplicate source code or write long summaries |
| `/status` | Multiple features exist | Shows lane, status, blockers, and next command | Change scope or implement |
| `/select` | One feature should be active | Updates current feature pointer | Change implementation |
| `/block` | A feature cannot continue | Records blocker and unblock condition | Treat blocked work as complete |
| `/revise-plan` | Scope changes or plan is wrong | Updates plan and returns to approval | Implement revised scope before approval |
| `/context-status` | Before planning in a mature project | Checks whether context docs are current | Implement or approve |

## Agents

Agents are role prompts. Use them when work has a clear owner or when parallel work is useful.

| Agent | Use For | Owns |
| --- | --- | --- |
| Fullstack Agent | One vertical feature slice | Migration, backend, SDK, web/mobile implementation, verification notes |
| Backend Agent | Backend-only work | NestJS modules, Prisma, DB services, repositories, DTOs, Swagger, auth, queues, observability |
| Frontend Agent | Web or mobile UI/client work | Routes, screens, hooks, SDK wrappers, reusable components, loading/empty/error states |
| Infra Agent | Local services and operations | Docker, env examples, startup/reset commands, metrics/logging services, runbooks |
| Review Agent | Independent correctness review | Bugs, regressions, migrations, auth, SDK drift, tests, verification gaps |

Agent selection rule:

- Use Fullstack Agent for a normal vertical slice.
- Use Backend Agent when the frontend does not change.
- Use Frontend Agent when API contracts already exist.
- Use Infra Agent before app work if Docker/env/local services are not stable.
- Use Review Agent after implementation and tests, or before merging risky work.

## Skills

Skills are reusable operating instructions. Use them inside commands or agent tasks.

| Skill | Use When |
| --- | --- |
| `project-bootstrap` | Starting a backend-only, web, mobile, or web+mobile project |
| `docker-first` | Creating or fixing local infrastructure before app work |
| `migration-first` | Any schema, Prisma, index, constraint, seed, or persistence change |
| `sql-migration-patterns` | Handwritten SQL, triggers, functions, materialized views, full-text search, advanced indexes |
| `nestjs-prisma-backend` | NestJS backend feature work with Prisma, DTOs, Swagger, auth, logging, queues |
| `api-contract-sdk` | `/api-integrate` for OpenAPI and generated TypeScript SDK updates |
| `nextjs-generated-sdk-frontend` | Next.js App Router frontend using generated SDK clients and React Query |
| `expo-mobile-frontend` | Expo or React Native apps, app targets, EAS, permissions, push, camera/media, mobile SDK wrappers |
| `bullmq-background-jobs` | Queues, processors, cron, retry/backoff, Bull Board, DLQ, queue observability |
| `external-integration-patterns` | Storage, email, SMS, webhooks, third-party APIs, provider retry/cleanup/status mapping |
| `observability-patterns` | Health, metrics, request instrumentation, logs, Prometheus, Grafana, Loki, Bull Board |

Skill selection rule:

- Use only the skills relevant to the selected lane and touched surfaces.
- For risky work, load the specific risk skill before editing.
- Prefer existing project patterns over adding a new abstraction.

## Common Scenarios

### New Project

```text
Use prompts/start-prompt.md.
Fill docs/project-brief.md.
Create docs/command-map.md.
Apply project-bootstrap, docker-first, and migration-first.
Only then start feature stories.
```

### Backend Endpoint Plus Web UI

```text
/classify docs/features/user-stories.md
/plan docs/features/user-stories.md
/approve docs/features/plans/<feature>.plan.md
/implement docs/features/approvals/<feature>.approval.md
/verify docs/features/reports/<feature>.implementation.md
/api-integrate docs/features/reports/<feature>.implementation.md
/test docs/features/reports/<feature>.implementation.md
/review docs/features/reports/<feature>.implementation.md
/finalize docs/features/reports/<feature>.implementation.md
/context-update docs/features/final/<feature>.final.md
```

Use these skills:

- `migration-first` if data changes.
- `nestjs-prisma-backend` for backend.
- `api-contract-sdk` for SDK generation.
- `nextjs-generated-sdk-frontend` for web.

### Backend Endpoint Plus Mobile UI

Use the normal or risky lane depending on native capability.

Use these skills:

- `migration-first` if data changes.
- `nestjs-prisma-backend` for backend.
- `api-contract-sdk` for SDK generation.
- `expo-mobile-frontend` for app screens, providers, permissions, device checks.

### Queue Or Cron Feature

Use risky lane.

Use these skills:

- `bullmq-background-jobs`
- `observability-patterns`
- `migration-first` if job state is stored

### External Provider Or Webhook

Use risky lane.

Use these skills:

- `external-integration-patterns`
- `observability-patterns`
- `bullmq-background-jobs` if retryable async work is needed

### Tiny UI Fix

```text
/classify docs/features/tasks/<task>.md
/implement docs/features/classifications/<task>.classification.md
/verify docs/features/reports/<task>.implementation.md
```

Skip plan and approval only if classification says it is tiny.

## Decision Checklist

Before `/implement`, confirm:

- Lane is known.
- Normal/risky work is approved.
- Docker and env expectations are documented.
- Migration plan exists if data changes.
- API contract impact is known.
- Web/mobile target is known.
- Required skills are identified.
- Verification and test commands are listed.

Before `/finalize`, confirm:

- Verification ran or gap is documented.
- API integration ran when needed.
- Tests ran or gap is documented.
- Review has no blocking findings.
- Context update is planned for normal/risky features.

## When To Stop

Stop and ask for user input or use `/block` when:

- Required file path is missing and cannot be inferred.
- The plan is not approved for normal/risky work.
- Secrets, credentials, or accounts are needed.
- A destructive operation is required.
- A migration or API contract must change beyond the approved plan.
- Native mobile capability changes were not planned.
- Provider behavior, retry behavior, or data retention is unclear.

## Best Use Pattern

The most efficient way to use this starter pack is:

```text
Keep stories small.
Classify early.
Plan only when the lane needs it.
Approve before code for normal/risky work.
Implement with the right skills.
Verify before API integration.
Test behavior after integration.
Review for regressions.
Finalize with gaps.
Update context when future agents need the knowledge.
```

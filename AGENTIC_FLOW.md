# Agentic Flow

This document explains how to use the starter pack with Codex or any coding agent.

The goal is simple: every project should follow the same reliable flow from idea to implementation:

```text
Shape Decision -> Brief -> Stories -> Plan -> Approve -> Implement -> Verify -> API Integrate -> Test -> Review -> Finalize -> Context Update
```

For feature work, classify first when scope is unclear. The full flow is required for normal and risky features, but tiny changes can use a shorter lane.

## Mental Model

The starter pack has six layers:

1. **Docs** define the engineering standard.
2. **Templates** turn a vague idea into structured project context.
3. **Commands** define gated feature workflow steps.
4. **Prompts** tell an agent how to start or execute work.
5. **Agents** define focused roles for implementation or review.
6. **Skills** encode repeatable behavior that Codex can reuse across projects.

Use them together. Do not treat this as only a documentation folder.

## First-Time Project Flow

### 1. Decide Project Shape

Every first prompt must ask and record:

- Does this project need a backend?
- Does this project need a frontend?
- If frontend is needed, is it web, mobile, or both?
- If mobile is needed, which platforms and native capabilities are required?

This choice controls which docs, skills, and agents apply. Do not default every project to web.

### 2. Read The Operating Docs

Start with:

- [README.md](README.md)
- [FLOW_README.md](FLOW_README.md)
- [START_HERE.md](START_HERE.md)
- [docs/patterns-to-follow.md](docs/patterns-to-follow.md)
- [docs/anti-patterns.md](docs/anti-patterns.md)

Then read the area-specific docs:

- [docs/feature-command-flow.md](docs/feature-command-flow.md)
- [docs/flow-policy.md](docs/flow-policy.md)
- [docs/backend-patterns.md](docs/backend-patterns.md)
- [docs/frontend-patterns.md](docs/frontend-patterns.md)
- [docs/mobile-app-patterns.md](docs/mobile-app-patterns.md)
- [docs/docker-first.md](docs/docker-first.md)
- [docs/migration-first.md](docs/migration-first.md)
- [docs/api-contract-sdk.md](docs/api-contract-sdk.md)
- [docs/background-jobs-bullmq.md](docs/background-jobs-bullmq.md)
- [docs/database-sql-patterns.md](docs/database-sql-patterns.md)
- [docs/observability-patterns.md](docs/observability-patterns.md)
- [docs/external-integration-patterns.md](docs/external-integration-patterns.md)
- [docs/testing-contract-patterns.md](docs/testing-contract-patterns.md)
- [docs/deep-codebase-audit.md](docs/deep-codebase-audit.md)
- [docs/mobile-backend-pattern-analysis.md](docs/mobile-backend-pattern-analysis.md)

### 3. Create Project Context

Create these files in the target project:

```text
docs/project-brief.md
docs/command-map.md
docs/env-checklist.md
docs/architecture.md
```

Use templates from:

- [templates/project-brief.md](templates/project-brief.md)
- [templates/command-map.md](templates/command-map.md)
- [templates/env-checklist.md](templates/env-checklist.md)

The project brief is the anchor. An agent should not invent core product rules when the brief can answer them.

### 4. Start With The Start Prompt

Use:

- [prompts/start-prompt.md](prompts/start-prompt.md)

This prompt tells the agent to scaffold in the correct order:

```text
Project shape -> Monorepo -> Docker -> Prisma migration -> Backend health/OpenAPI -> SDK -> Web and/or mobile shell
```

## Feature Flow

For each feature, use command-gated execution. The full command contract lives in:

- [docs/feature-command-flow.md](docs/feature-command-flow.md)
- [docs/flow-policy.md](docs/flow-policy.md)
- [commands/README.md](commands/README.md)

Start by choosing the lane:

```text
/classify docs/features/user-stories.md
```

The normal and risky feature lifecycle is:

```text
docs/features/user-stories.md
  -> /classify
  -> docs/features/classifications/<feature>.classification.md
  -> /plan
  -> docs/features/plans/<feature>.plan.md
  -> /approve
  -> docs/features/approvals/<feature>.approval.md
  -> /implement
  -> docs/features/reports/<feature>.implementation.md
  -> /verify
  -> /api-integrate
  -> /test
  -> /review
  -> /finalize
  -> /context-update
```

The tiny-change lifecycle is:

```text
task or story
  -> /classify when scope is unclear
  -> /implement
  -> /verify
  -> optional /test or /review
```

Important rules:

- `/classify` chooses tiny, normal, or risky flow and records approval/API/context requirements.
- `/plan` reads user stories and creates plan files. It does not change application code.
- `/approve` records human approval. It does not change application code.
- `/implement` is the first command allowed to modify application code.
- `/implement`, `/verify`, `/api-integrate`, `/test`, and `/review` must ask which file to use when no artifact file is provided.
- `/status`, `/select`, `/block`, `/revise-plan`, and `/context-status` are support commands for multi-feature work.
- `/context-update` keeps project memory current after normal and risky finalization.
- Unapproved plans must not be implemented unless the task is explicitly classified as tiny.
- Material scope changes go through `/revise-plan` and then `/approve` again.

### 1. User Stories

Create or update:

- [templates/user-stories.md](templates/user-stories.md)

Recommended target path:

```text
docs/features/user-stories.md
```

The user-story file should list story IDs, feature names, priorities, surfaces, acceptance criteria, dependencies, non-goals, and open questions.

### 2. Plan

When the feature is not already classified, run:

```text
/classify docs/features/user-stories.md
```

Run:

```text
/plan docs/features/user-stories.md
```

This creates one or more feature plans from:

- [templates/feature-plan.md](templates/feature-plan.md)

Plans should identify:

- Data changes.
- Backend routes.
- Permissions.
- SDK impact.
- Frontend screens/hooks/components.
- Mobile screens/native config when needed.
- Background jobs, SQL, observability, and provider impact.
- Verification plan.
- Test plan.
- Open questions.

Plans should be small vertical slices and should end in `needs-approval`.

### 3. Approve

The user reviews the plan file. Only after review, run:

```text
/approve docs/features/plans/<feature>.plan.md
```

This creates:

```text
docs/features/approvals/<feature>.approval.md
```

If the plan has blocking open questions, approval should stop and ask for answers.

### 4. Implement

Run:

```text
/implement docs/features/approvals/<feature>.approval.md
```

Implementation follows the approved plan only and uses the existing skills and agents that match the approved surfaces. If the command is missing a file path, the agent must ask which approved plan or approval file to implement.

The implementation report uses:

- [templates/feature-implementation-report.md](templates/feature-implementation-report.md)

### 5. Migration First

If the feature touches data:

1. Update Prisma schema.
2. Create a migration.
3. Apply the migration.
4. Generate Prisma client.
5. Only then implement backend logic.

Use:

- [docs/migration-first.md](docs/migration-first.md)
- [skills/migration-first/SKILL.md](skills/migration-first/SKILL.md)

### 6. Backend Contract

Backend implementation follows this dependency flow:

```text
Controller -> ApiService -> FeatureDbService -> Repository -> Prisma
```

Pattern:

- Repository owns Prisma queries.
- Feature DB service exposes repository operations.
- API service owns business rules.
- Transform maps DB shape to response DTO.
- Controller stays thin.
- Swagger decorator documents the route.
- `ResponseUtil.success()` returns the response envelope.

Use:

- [docs/backend-patterns.md](docs/backend-patterns.md)
- [skills/nestjs-prisma-backend/SKILL.md](skills/nestjs-prisma-backend/SKILL.md)

### 7. Contract Preparation

During `/implement`, backend DTOs/routes should be prepared but final SDK/client wiring waits for `/api-integrate`.

Implementation should:

1. Add or update backend DTOs, Swagger decorators, and route contracts.
2. Keep generated SDK files untouched.
3. Record expected SDK impact in the implementation report.
4. Leave OpenAPI/SDK regeneration for `/api-integrate`.

Use:

- [docs/api-contract-sdk.md](docs/api-contract-sdk.md)
- [skills/api-contract-sdk/SKILL.md](skills/api-contract-sdk/SKILL.md)

### 8. Frontend Implementation

Web frontend implementation prepares UI, state, and seams for API wiring:

```text
Page/Component -> Feature Hook/Service -> API seam
```

Pattern:

- SDK clients live in `lib/apis/api.ts` after `/api-integrate`.
- Custom fetch owns auth/cookies/errors after `/api-integrate`.
- Hooks own React Query.
- Pages/components consume hooks.
- Reusable primitives go in `components/ui`.
- Reusable app composites go in `components/custom`.
- Routes, query keys, cookie names, and constants are centralized.

Use:

- [docs/frontend-patterns.md](docs/frontend-patterns.md)
- [skills/nextjs-generated-sdk-frontend/SKILL.md](skills/nextjs-generated-sdk-frontend/SKILL.md)

Mobile frontend flow:

```text
Expo Screen -> Feature Hook/Service -> API seam
```

Pattern:

- App targets live under `apps/frontend/apps/<name>-expo`.
- Shared assets/components/modules live under `apps/frontend/packages`.
- Generated SDK wiring happens in `/api-integrate`.
- `app.config.js`, `eas.json`, and `metro.config.js` are part of feature readiness when native capabilities change.
- Root layout owns app-level providers for auth, notifications, network status, Sentry, gestures, keyboard, UI theme, state, and navigation.
- Device-only features are verified on physical devices.

Use:

- [docs/mobile-app-patterns.md](docs/mobile-app-patterns.md)
- [skills/expo-mobile-frontend/SKILL.md](skills/expo-mobile-frontend/SKILL.md)

### 9. Verify

Run:

```text
/verify docs/features/reports/<feature>.implementation.md
```

Verification checks the implementation against the approved plan and updates the report.

### 10. API Integration

Run:

```text
/api-integrate docs/features/reports/<feature>.implementation.md
```

API integration happens after verification. This command owns OpenAPI/SDK regeneration, generated client wrappers, and web/mobile API caller wiring.

### 11. Test

Run:

```text
/test docs/features/reports/<feature>.implementation.md
```

Testing runs targeted automated or manual checks and updates the report.

Use:

- [docs/verification.md](docs/verification.md)
- [templates/pr-checklist.md](templates/pr-checklist.md)

### 12. Review

Run:

```text
/review docs/features/reports/<feature>.implementation.md
```

Review findings lead. Blocking findings keep the feature from being marked reviewed.

### 13. Finalize

Run:

```text
/finalize docs/features/reports/<feature>.implementation.md
```

Finalization creates the handoff summary only after blocking review findings are resolved.

### 14. Context Update

Run:

```text
/context-update docs/features/final/<feature>.final.md
```

Context update writes compact project memory under `docs/context`. Future `/plan` and `/implement` should read these context docs before broad codebase scanning.

### 15. Support Commands

Use these anytime:

```text
/status docs/features
/select <feature-slug-or-artifact-file>
/block <feature-artifact-file>
/context-status docs/context
```

### 16. Background, SQL, Observability, And Integrations

If the feature includes async work, handwritten SQL, provider calls, or operational visibility, use the relevant doc before coding:

- [docs/background-jobs-bullmq.md](docs/background-jobs-bullmq.md)
- [docs/database-sql-patterns.md](docs/database-sql-patterns.md)
- [docs/observability-patterns.md](docs/observability-patterns.md)
- [docs/external-integration-patterns.md](docs/external-integration-patterns.md)
- [docs/testing-contract-patterns.md](docs/testing-contract-patterns.md)

## Choosing An Agent Role

Use [AGENTS.md](AGENTS.md) as the index.

## Fullstack Agent

Use when one agent owns the whole vertical slice.

Best for:

- New feature implementation.
- Backend plus frontend changes.
- Migration plus SDK plus UI.

Prompt:

- [agents/fullstack-agent.md](agents/fullstack-agent.md)

## Backend Agent

Use when the task is backend-only.

Best for:

- Migrations.
- NestJS modules.
- Auth and permissions.
- Swagger and response contracts.
- Queue/background behavior.

Prompt:

- [agents/backend-agent.md](agents/backend-agent.md)

## Frontend Agent

Use when the task is frontend-only.

Best for:

- Next.js routes and components.
- Expo routes, app targets, and mobile components.
- React Query hooks.
- Generated SDK consumption.
- UI states and reusable component work.

Prompt:

- [agents/frontend-agent.md](agents/frontend-agent.md)

## Infra Agent

Use when the task is local setup or infrastructure.

Best for:

- Docker compose.
- `.env.example`.
- Startup/reset commands.
- Observability services.

Prompt:

- [agents/infra-agent.md](agents/infra-agent.md)

## Review Agent

Use after implementation or before a PR.

Best for checking:

- Migration safety.
- Backend layering.
- Auth and permissions.
- OpenAPI/SDK drift.
- Frontend generated SDK usage.
- Reusable component boundaries.
- Missing verification.

Prompt:

- [agents/review-agent.md](agents/review-agent.md)

## When To Use Skills

Skills are reusable behavior packages for Codex. Copy the relevant folders from [skills](skills) into your Codex skills location when you want these workflows to trigger automatically.

Available skills:

- `project-bootstrap`: starting a new project.
- `docker-first`: local infrastructure setup.
- `migration-first`: database schema work.
- `sql-migration-patterns`: handwritten SQL, functions, triggers, materialized views, and seed data.
- `nestjs-prisma-backend`: backend feature work.
- `bullmq-background-jobs`: queues, processors, cron jobs, Bull Board, and DLQ.
- `api-contract-sdk`: OpenAPI and SDK sync.
- `nextjs-generated-sdk-frontend`: frontend work with generated SDK.
- `observability-patterns`: health, metrics, logs, dashboards, and queue visibility.
- `external-integration-patterns`: providers, webhooks, retries, cleanup, and status mapping.

Use a skill when the task matches its name. For example:

```text
Use the migration-first and nestjs-prisma-backend skills to add organizations.
```

## Pattern Compliance Checklist

Before finishing a task, ask:

- Did Docker/local service assumptions stay intact?
- Did every schema change get a migration?
- Does backend follow controller -> service -> DB service -> repository?
- Are repositories kept out of controllers?
- Are DTOs, Swagger, response envelopes, and transforms updated?
- Was OpenAPI regenerated after backend contract changes?
- Was the SDK regenerated and left unedited?
- Does frontend use hooks and SDK wrappers instead of direct backend calls?
- Are reusable UI pieces placed in `components/ui` or `components/custom` correctly?
- Are route paths, query keys, cookie names, and constants centralized?
- Are loading, empty, error, and success states handled?
- If a queue was added, are job names, payload types, retries, events, Bull Board, and DLQ handled?
- If SQL functions/triggers/views were added, are refresh strategy, indexes, idempotency, and docs covered?
- If provider/webhook work was added, are config validation, status mapping, retries, and fallback covered?
- If observability changed, are health, metrics, logs, and dashboards/runbooks covered?
- Did the final answer include changed files, verification, and gaps?

## Review Flow

A review should not start with summaries. It should start with findings.

Review order:

1. Data loss or migration risk.
2. Auth, permissions, validation, and response contract bugs.
3. Docker/local setup breakage.
4. OpenAPI/SDK drift.
5. Backend layering violations.
6. Frontend layering violations.
7. Reusable component and constants drift.
8. Missing tests or verification.

Use:

- [prompts/review-prompt.md](prompts/review-prompt.md)

## What Good Looks Like

A completed feature should have:

- Migration applied and ORM generated.
- Backend route documented in Swagger.
- SDK regenerated.
- Frontend consuming generated types.
- Reusable components placed in the right layer.
- Constants centralized.
- Verification commands run.
- Known gaps documented.

If any of these are skipped, the final note must say why.

# Start Here

Use this flow for any new project: backend only, web, mobile, or full-stack.

## Phase 0: Project Brief

Create `docs/project-brief.md` from [templates/project-brief.md](templates/project-brief.md). Do not code before the first brief exists.

Minimum decisions:

- Whether the project needs a backend.
- Whether the project needs a frontend.
- Whether frontend is web, mobile, or both.
- Product goal and primary users.
- Core entities and relationships.
- Auth model and roles.
- External services.
- Local service ports.
- Deployment target.
- First vertical slice.

## Phase 1: Repository Shape

Default shape:

```text
apps/
  backend/
  frontend/
  documentation/
libs/
  client_sdk/
packages/
docs/
```

For mobile or web+mobile projects, the frontend can be shaped like:

```text
apps/frontend/
  apps/
    web/
    mobile-expo/
  packages/
    assets/
    components/
    modules/
  services/
    sdk/
```

Use Nx, Turborepo, or package manager workspaces. Pick one and document commands in `docs/command-map.md`.

Before scaffolding feature code, read:

- [docs/flow-policy.md](docs/flow-policy.md)
- [docs/feature-command-flow.md](docs/feature-command-flow.md)
- [docs/patterns-to-follow.md](docs/patterns-to-follow.md)
- [docs/backend-patterns.md](docs/backend-patterns.md)
- [docs/frontend-patterns.md](docs/frontend-patterns.md)
- [docs/mobile-app-patterns.md](docs/mobile-app-patterns.md) when frontend target includes mobile
- [docs/background-jobs-bullmq.md](docs/background-jobs-bullmq.md)
- [docs/database-sql-patterns.md](docs/database-sql-patterns.md)
- [docs/observability-patterns.md](docs/observability-patterns.md)
- [docs/external-integration-patterns.md](docs/external-integration-patterns.md)
- [docs/anti-patterns.md](docs/anti-patterns.md)

## Phase 2: Docker First

Before building app features, create local infrastructure:

- `docker-compose.yml` for Postgres and Redis.
- Optional observability services: Prometheus, Grafana, Loki, Promtail.
- `.env.example` with every required variable.
- Named volumes for persisted data unless the project intentionally wants disposable state.
- Health checks where possible.

Run Docker services and verify connectivity before migrations.

## Phase 3: Migration First

Create the schema and first migration before building API routes.

Default:

- Prisma schema in `apps/backend/src/db/prisma/schema.prisma`.
- Migrations in `apps/backend/src/db/prisma/migrations`.
- Commands for create, apply, reset, db pull, generate, and studio.

No feature is complete until its schema change has a migration and the generated client is updated.

## Phase 4: Backend Contract

Backend defaults:

- NestJS modules under `apps/backend/src/api/<feature>`.
- `controller`, `service`, `module`, `transform`, `dto`, and `swagger` files.
- `src/db/<feature>` with repository and DB service.
- Global response envelope.
- Global exception filter.
- Global validation pipe with whitelist and forbidden unknown fields.
- Swagger available outside production.
- BullMQ background module with queue constants, queue facades, processors, events, Bull Board, and DLQ when async work is needed.
- Observability endpoints for health and metrics.

## Phase 5: SDK And Frontend

Web frontend defaults:

- Generate `libs/client_sdk` from backend OpenAPI.
- Wrap SDK clients in `apps/frontend/lib/apis/api.ts`.
- Use a custom fetch wrapper for credentials, cookie forwarding, refresh handling, and error normalization.
- Use React Query hooks for server state.
- Use app routes and route groups for auth, admin, contributor, viewer, or project-specific roles.

Mobile frontend defaults:

- Use Expo Router unless the project explicitly chooses another React Native navigation stack.
- Keep each app target under `apps/frontend/apps/<name>-expo`.
- Put shared assets, components, modules, and SDK clients under `apps/frontend/packages` and `apps/frontend/services`.
- Configure `app.config.js`, `eas.json`, `metro.config.js`, and native permissions before building mobile features.
- Wrap generated SDK clients in a mobile API client that owns tokens, refresh, base URL, and normalized errors.
- Add root providers for auth, notifications, network status, Sentry, gestures, keyboard, UI theme, and app state only when the feature set needs them.

## Phase 6: Verification

Before calling work done:

- Docker services are running.
- Migrations apply cleanly from an empty database.
- Backend starts and exposes health plus API docs.
- SDK generation succeeds after backend changes.
- Frontend builds or at least typechecks.
- Mobile app starts in Expo dev client/simulator, and device-only capabilities are checked on a physical device when touched.
- Targeted tests pass.
- Known gaps are written down.

## Feature Commands

After project bootstrap, use feature-wise commands:

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

Use [commands/README.md](commands/README.md) and [docs/feature-command-flow.md](docs/feature-command-flow.md) as the command contract.

Support commands:

```text
/status docs/features
/select <feature-slug-or-artifact-file>
/block <feature-artifact-file>
/revise-plan docs/features/plans/<feature>.plan.md
/context-status docs/context
```

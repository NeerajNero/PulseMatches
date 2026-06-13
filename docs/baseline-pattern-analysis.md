# Baseline Pattern Analysis

This starter pack was derived from mature backend, web frontend, and mobile frontend codebases.

See [mobile-backend-pattern-analysis.md](mobile-backend-pattern-analysis.md) for the mobile and backend comparison notes.

## Observed Project Shape

The baseline web/backend project shape is a workspace-style monorepo:

```text
apps/backend
apps/frontend
apps/documentation
libs/client_sdk
```

Important source files inspected:

- `package.json`
- `apps/backend/package.json`
- `apps/backend/docker-compose.yml`
- `apps/backend/src/main.ts`
- `apps/backend/src/app.module.ts`
- `apps/backend/src/config/env-config.module.ts`
- `apps/backend/src/config/env.config.ts`
- `apps/backend/src/db/db.module.ts`
- `apps/backend/src/db/db.service.ts`
- `apps/backend/src/db/prisma/schema.prisma`
- `apps/backend/src/db/prisma/migrations`
- `apps/backend/src/interceptors/transform.interceptor.ts`
- `apps/backend/src/common/filters/http-exception.filter.ts`
- `apps/backend/src/logger/logger.service.ts`
- `apps/backend/src/background`
- `apps/backend/src/api/health`
- `apps/backend/src/api/metrics`
- `apps/backend/src/redis`
- `apps/backend/src/api/webhook`
- `apps/backend/src/api/media-upload`
- `apps/backend/prometheus.yml`
- `apps/backend/promtail-config.yml`
- `apps/backend/dredd.yml`
- `apps/backend/dredd-hooks.js`
- `apps/frontend/package.json`
- `apps/frontend/app/layout.tsx`
- `apps/frontend/lib/apis/api.ts`
- `apps/frontend/lib/apis/sdk-custom-fetch.ts`
- `apps/frontend/lib/query-client.ts`
- `apps/frontend/components/providers/Providers.tsx`
- `apps/frontend/components/ui/button.tsx`
- `apps/frontend/tailwind.config.js`
- `apps/frontend/components.json`
- `apps/frontend/.storybook/main.ts`
- `playwright.config.js`
- Backend recommendation notes.

## Practices Extracted

### Monorepo

- Apps and libs are separated.
- Generated client SDK lives in `libs/client_sdk`.
- Documentation is a first-class app.
- Root scripts delegate to workspace app scripts.

### Docker

- Backend owns the local service compose file.
- Compose includes Postgres, Redis, Prometheus, Grafana, Loki, Promtail, and node exporter.
- Ports and credentials are environment-driven.
- Local startup scripts bring infrastructure up before app startup.

### Database

- Prisma is the active migration path.
- Prisma schema and migrations live under backend source.
- Commands cover migrate, create-only migration, reset, pull, generate, studio, deploy, and setup.
- Repository and DB service files isolate persistence per feature.

### Backend

- NestJS is organized around feature modules.
- Feature modules commonly include controller, service, module, transform, DTOs, Swagger helpers, and enums.
- Persistence commonly flows through `DBService -> Repository -> FeatureDbService -> ApiService`, with the feature DB service as the public dependency.
- Repositories are registered as providers, but DB services are the intended exported boundary for other modules.
- Global validation strips unknown input and rejects non-whitelisted properties.
- Helmet, CORS, URI versioning, cookies, and body limits are configured in bootstrap.
- Swagger is exposed outside production.
- Global interceptors handle logging, JWT, tracing, and response transforms.
- Global filters normalize HTTP errors.
- DTOs use centralized `FIELD_DESCRIPTIONS` and `REGEX_PATTERNS`.
- Response DTOs extend a generic `ApiResponse<T>` class for Swagger and SDK typing.
- Controllers use per-module Swagger decorators instead of large inline Swagger blocks.
- Redis powers cache and BullMQ queues.
- Health, metrics, logging, and observability are built in early.
- Background jobs use queue constants, typed payload interfaces, queue facades, processors, queue services, event listeners, Bull Board, and a dead-letter queue.
- Cron schedules enqueue BullMQ jobs rather than running heavy work inline.
- Handwritten SQL migrations implement triggers, functions, materialized search views, full-text/trigram search, idempotent seed data, and DB-level invariants.
- External integrations use provider/config/service separation for webhooks, Bunny storage, media upload, Slack alerts, and cleanup.
- Contract testing uses Dredd against generated OpenAPI.

### API Contract

- Backend exposes Swagger/OpenAPI.
- TypeScript fetch SDK is generated from the running backend.
- Frontend imports SDK API classes and models from `libs/client_sdk`.
- Custom fetch behavior is kept outside generated code.

### Frontend

- Next.js App Router uses route groups for auth, admin, contributor, and viewer surfaces.
- React Query is the server-state layer.
- SDK clients are centralized in `lib/apis/api.ts`.
- Custom fetch handles SSR cookie forwarding, credentials, token refresh, and normalized errors.
- UI uses Tailwind plus Radix/shadcn-style primitives.
- Shared UI, hooks, layout, API helpers, and utilities are separated clearly.
- Reusable primitives live in `components/ui`; reusable composites live in `components/custom`.
- Feature data access lives in `hooks/use<Feature>.ts`.
- Routes, cookie names, headers, static options, and query keys are centralized under `utils`.
- Storybook exists for component documentation and interaction/coverage add-ons.
- Playwright is configured for multi-browser e2e verification.

## Starter Pack Biases

This pack intentionally favors:

- Repeatable local setup over one-off machine setup.
- Migration records over implicit schema changes.
- Generated contracts over duplicated frontend types.
- Thin controllers and explicit service/repository boundaries.
- Early docs for commands, env, and verification.
- Async jobs with visible retries, events, Bull Board, and DLQ.
- SQL-heavy database behavior documented alongside migrations.
- Provider integrations isolated behind services and interfaces.

## What Was Not Copied

The pack does not copy product-specific behavior:

- Video search business logic.
- Media provider integrations.
- Project-specific roles and pages.
- Production secrets or environment values.
- Generated SDK model files.

The goal is to preserve the operating model and engineering practices, not any product-specific behavior.

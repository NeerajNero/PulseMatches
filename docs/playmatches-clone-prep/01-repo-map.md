# Repository Map

## Root

| Path | Purpose |
| --- | --- |
| `package.json` | Root workspace scripts and package manager declaration. |
| `pnpm-workspace.yaml` | Workspace package globs: `apps/*`, `libs/*`. |
| `pnpm-lock.yaml` | pnpm lockfile. |
| `tsconfig.base.json` | Shared TypeScript compiler defaults. |
| `Dockerfile` | Multi-stage backend/frontend image build. |
| `docker-compose.yml` | Local Postgres, Redis, backend, and frontend runtime. |
| `.env.example` | Root compose and runtime environment defaults. |
| `openapi.json` | Generated/checked-in OpenAPI contract used for SDK generation. |
| `openapitools.json` | OpenAPI generator configuration. |
| `scripts/export-openapi.mjs` | Fetches backend Swagger JSON into `openapi.json`. |
| `AGENTS.md` | Agent role index for fullstack/backend/frontend/infra/review work. |
| `docs/` | Project docs, standards, feature plans, reports, and this prep output. |
| `commands/`, `skills/`, `templates/`, `prompts/` | Agent workflow assets and reusable implementation guidance. |

`git status` failed with `fatal: not a git repository`, so this inspection treats the folder as a plain project workspace.

## Apps

| Path | Purpose |
| --- | --- |
| `apps/backend` | NestJS API application. |
| `apps/backend/src` | Backend source code. |
| `apps/backend/prisma` | Prisma schema, migrations, and idempotent seed. |
| `apps/backend/dist` | Generated build output. Not source of truth. |
| `apps/frontend` | Next.js web application. |
| `apps/frontend/app` | Next.js App Router routes. |
| `apps/frontend/components` | UI and custom reusable components. |
| `apps/frontend/hooks` | React Query hooks for SDK-backed data access. |
| `apps/frontend/lib` | API client wrapper and auth token storage. |
| `apps/frontend/styles` | Global CSS. |
| `apps/frontend/utils` | Route and query-key constants. |
| `apps/frontend/.next` | Generated Next.js build output. Not source of truth. |
| `apps/documentation` | Empty/reserved app directory. |

## Backend Source Structure

| Path | Purpose |
| --- | --- |
| `apps/backend/src/main.ts` | Nest bootstrap, CORS, helmet, validation, filters, response envelope, Swagger. |
| `apps/backend/src/app.module.ts` | Root module imports health, auth, organizer, discovery. |
| `apps/backend/src/health` | `GET /health` endpoint and DTO. |
| `apps/backend/src/api/auth` | Signup/login/refresh/logout/me, guards, role decorators, transforms, DTOs. |
| `apps/backend/src/api/organizer` | Current organizer profile API. |
| `apps/backend/src/api/discovery` | Public sports, cities, tournaments listing/detail API. |
| `apps/backend/src/db/prisma` | Prisma module and service. |
| `apps/backend/src/db/auth` | Auth repository and DB service. |
| `apps/backend/src/db/organizer-profiles` | Organizer profile repository and DB service. |
| `apps/backend/src/db/discovery` | Discovery repository and DB service. |
| `apps/backend/src/common` | Shared response DTO, exception filter, response envelope interceptor, response utility. |
| `apps/backend/src/config/env.validation.ts` | Backend env validation. |

The backend convention is controller -> service -> DB service -> repository, with transform classes for API response shape.

## Frontend Source Structure

| Path | Purpose |
| --- | --- |
| `apps/frontend/app/layout.tsx` | Root layout and React Query provider composition. |
| `apps/frontend/app/(public)/page.tsx` | Home page shell. |
| `apps/frontend/app/tournaments/page.tsx` | Public tournament listing with filters. |
| `apps/frontend/app/tournaments/[slug]/page.tsx` | Public tournament detail page. |
| `apps/frontend/app/login/page.tsx` | Login form. |
| `apps/frontend/app/signup/page.tsx` | Signup form with player/organizer role choice. |
| `apps/frontend/app/me/page.tsx` | Authenticated user profile shell. |
| `apps/frontend/app/organizer/page.tsx` | Organizer workspace shell. |
| `apps/frontend/components/providers/app-providers.tsx` | React Query provider. |
| `apps/frontend/components/custom/auth/auth-shell.tsx` | Reusable auth page shell. |
| `apps/frontend/components/ui/status-pill.tsx` | Small status badge primitive. |
| `apps/frontend/hooks/use-auth.ts` | Auth mutations and current-user query. |
| `apps/frontend/hooks/use-discovery.ts` | Sports/cities/tournaments queries. |
| `apps/frontend/hooks/use-organizer-profile.ts` | Organizer profile query. |
| `apps/frontend/lib/apis/api.ts` | Generated SDK API client instances. |
| `apps/frontend/lib/apis/sdk-custom-fetch.ts` | Shared fetch wrapper for SDK. |
| `apps/frontend/lib/auth-token-store.ts` | Browser `localStorage` access and refresh token storage. |
| `apps/frontend/utils/route.ts` | Central route constants. |
| `apps/frontend/utils/query-constants.ts` | React Query key constants. |

## Libraries

| Path | Purpose |
| --- | --- |
| `libs/client_sdk` | Generated OpenAPI `typescript-fetch` SDK. Do not hand-edit. |
| `libs/client_sdk/apis` | Generated API classes: Auth, Discovery, Health, Organizer. |
| `libs/client_sdk/models` | Generated DTO models. |
| `libs/client_sdk/docs` | Generated SDK markdown docs. |

## Documentation Already Present

Useful existing docs for implementation:

- `docs/architecture.md`
- `docs/project-brief.md`
- `docs/command-map.md`
- `docs/env-checklist.md`
- `docs/features/feature-index.md`
- `docs/features/discovery/playmatches-feature-audit.md`
- `docs/features/plans/003-organizer-tournament-management.plan.md`
- `docs/features/plans/004-registration-booking.plan.md`
- `docs/features/plans/005-fixtures-scoring.plan.md`


# MatchFlow Arena Architecture

## Architecture Summary

MatchFlow Arena is a pnpm workspace with a NestJS API, a Next.js App Router web frontend, local PostgreSQL and Redis services, and generated SDK contracts for frontend API access.

```text
apps/
  backend/        NestJS API, Swagger/OpenAPI, health checks, Prisma planned
  frontend/       Next.js App Router web app
  documentation/  Reserved for generated or published docs
libs/
  client_sdk/     Generated TypeScript SDK output
docs/             Product, architecture, feature flow, context, and reports
```

## Backend

- NestJS app under `apps/backend`.
- Global validation pipe uses whitelist, transform, and unknown-field rejection.
- Global response envelope uses `status_code`, `status`, `message`, `data`, and `error`.
- Global exception filter normalizes errors into the same envelope style.
- Swagger is available outside production at `/docs`; raw OpenAPI JSON is served by Swagger at `/docs-json`.
- Health endpoint is `GET /health`.
- Feature modules will follow `controller -> service -> db service -> repository`.
- Prisma and migrations are active as of Slice 002a.
- Auth foundation includes `users`, `user_roles`, `refresh_tokens`, `organizer_profiles`, and `audit_logs`.
- JWT access tokens and hashed refresh tokens support the MVP session flow.
- Public discovery includes read-only `DiscoveryModule` APIs for sports, cities, tournament listing, and tournament detail.
- Discovery data access follows `DiscoveryController -> DiscoveryService -> DiscoveryDbService -> DiscoveryRepository`.

## Frontend

- Next.js App Router app under `apps/frontend`.
- Public shell lives in `app/(public)`.
- Future route groups: `app/(auth)`, `app/(organizer)`, and `app/(admin)`.
- API access must go through generated SDK wrapper modules in `apps/frontend/lib/apis`.
- React Query provider is established at the app root for future server state.
- UI primitives live under `components/ui`; reusable business components go under `components/custom`.
- Public discovery routes are `/tournaments` and `/tournaments/[slug]`.
- Discovery frontend calls use `apps/frontend/hooks/use-discovery.ts` and the generated `DiscoveryApi` client registered in `apps/frontend/lib/apis/api.ts`.

## Data Model Direction

The first data-backed implementation should preserve these requirements:

- UUID primary keys.
- Lifecycle status fields instead of hard deletes for business entities.
- `created_at` and `updated_at` columns on business tables.
- Unique slugs for public URLs.
- Listing indexes on `city_id`, `sport_id`, `status`, and `starts_at`.
- Audit logs for publish/unpublish, verification, registration status changes, fixture generation, and score updates.
- JSONB only for provider payloads, flexible metadata, or detailed scoring event payloads.

Auth foundation implements the first data-backed slice. Public tournament discovery adds `sports`, `cities`, `venues`, `tournaments`, `tournament_categories`, and `tournament_media`.

Public tournament discovery rules:

- Public listing and detail expose only `PUBLISHED` tournaments with `PUBLIC` visibility.
- Tournament detail lookup is slug-first with UUID fallback.
- Unverified organizer tournaments can appear publicly when the tournament is published and public; organizer verification status is returned as response data.
- Registration availability is computed from the registration window and category capacity only. Registration records are not part of this slice.

## Infrastructure

- Docker compose owns Postgres, Redis, backend, and frontend for full-stack local startup.
- `pnpm local:up` starts the full Docker stack.
- `pnpm local:infra:up` starts only Postgres and Redis for host-based application development.
- Backend and frontend containers are built from the root `Dockerfile`.
- The backend container runs Prisma migration deploy and the idempotent development seed before starting the API.
- Redis is included from the start so queue-backed notifications, scoring events, or analytics jobs can be introduced without reshaping local infrastructure.
- BullMQ is deferred until a feature actually needs background processing.

## API Contract

- Backend DTOs and Swagger define the contract.
- Generated SDK output path is `libs/client_sdk`.
- The frontend must import SDK clients through `apps/frontend/lib/apis/api.ts`.
- Generated SDK files must not be hand-edited.

## Legal/Product Boundary

Playmatches is used only as a public feature-reference source. MatchFlow Arena must not copy Playmatches branding, logo, exact UI, images, copywriting, screenshots, or proprietary assets.

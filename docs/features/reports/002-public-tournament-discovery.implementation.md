# 002 Public Tournament Discovery Implementation Report

## Summary

Slice `002-public-tournament-discovery` is implemented and verified. The slice adds read-only public catalog and tournament discovery support for MatchFlow Arena without implementing organizer tournament management, registrations, payments, fixtures, scoring, notifications, analytics, or admin catalog UI.

## Files Changed

- `docs/features/plans/002-public-tournament-discovery.plan.md`
- `docs/features/reports/002-public-tournament-discovery.implementation.md`
- `docs/features/feature-index.md`
- `docs/context/feature-memory.md`
- `docs/context/decisions.md`
- `docs/architecture.md`
- `apps/backend/prisma/schema.prisma`
- `apps/backend/prisma/migrations/20260525194342_002_public_tournament_discovery/migration.sql`
- `apps/backend/prisma/seed.ts`
- `apps/backend/src/app.module.ts`
- `apps/backend/src/api/discovery/discovery.controller.ts`
- `apps/backend/src/api/discovery/discovery.module.ts`
- `apps/backend/src/api/discovery/discovery.service.ts`
- `apps/backend/src/api/discovery/discovery.transform.ts`
- `apps/backend/src/api/discovery/dto/discovery-query.dto.ts`
- `apps/backend/src/api/discovery/dto/discovery-response.dto.ts`
- `apps/backend/src/db/discovery/discovery-db.module.ts`
- `apps/backend/src/db/discovery/discovery-db.service.ts`
- `apps/backend/src/db/discovery/discovery.repository.ts`
- `apps/frontend/app/tournaments/page.tsx`
- `apps/frontend/app/tournaments/[slug]/page.tsx`
- `apps/frontend/hooks/use-discovery.ts`
- `apps/frontend/lib/apis/api.ts`
- `apps/frontend/utils/query-constants.ts`
- `apps/frontend/utils/route.ts`
- `apps/frontend/styles/globals.css`
- `openapi.json`
- `libs/client_sdk/**`

## Tables Added or Changed

Added:

- `sports`
- `cities`
- `venues`
- `tournaments`
- `tournament_categories`
- `tournament_media`

Changed:

- `organizer_profiles` now relates to `tournaments`.

The migration uses UUID primary keys, lifecycle status fields, timestamps, unique slugs, and public listing indexes for city, sport, status, visibility, starts-at, categories, and media lookup.

## API Routes Added

- `GET /sports`
- `GET /cities`
- `GET /tournaments`
- `GET /tournaments/:slugOrId`

Listing filters:

- `city`
- `sport`
- `status`
- `upcoming_only`
- `starts_from`
- `starts_to`
- `search`
- `page`
- `limit`

Public listing and detail return only `PUBLISHED` tournaments with `PUBLIC` visibility. Detail lookup is slug-first with UUID fallback.

## Frontend Routes Added

- `/tournaments`
- `/tournaments/[slug]`

The pages use React Query hooks in `apps/frontend/hooks/use-discovery.ts` and the generated SDK-backed `DiscoveryApi` client from `apps/frontend/lib/apis/api.ts`.

## Seed Data Added

The idempotent dev seed now creates:

- Sports: Badminton, Cricket, Football, Swimming, Tennis
- Cities: Bengaluru, Hyderabad, Chennai, Mumbai, Delhi
- Five venues
- Five published public sample tournaments
- Three non-public control tournaments: draft, archived, blocked
- Sample categories and media for tournament detail pages

Sample tournaments are linked to the local/dev organizer profile created by the auth seed.

## SDK and OpenAPI Changes

- Added Discovery API operations and DTOs to `openapi.json`.
- Regenerated `libs/client_sdk`.
- Registered `DiscoveryApi` in the frontend API client wrapper.

## Verification Commands

| Command | Status | Notes |
| --- | --- | --- |
| `pnpm install --frozen-lockfile` | passed | Lockfile was up to date. |
| `pnpm local:config` | passed | Docker Compose config rendered successfully. |
| `pnpm local:up` | passed | Postgres and Redis were running. |
| `pnpm --filter @matchflow/backend prisma:migrate` | passed | Schema already in sync after migration creation. |
| `pnpm --filter @matchflow/backend prisma:generate` | passed | Prisma Client generated. |
| `pnpm --filter @matchflow/backend db:seed` | passed | Seeded 3 users, 5 sports, 5 cities, 5 venues, and 8 tournaments. |
| `pnpm generate:openapi` | passed | `openapi.json` regenerated. |
| `pnpm generate:sdk` | passed | `libs/client_sdk` regenerated. |
| `pnpm typecheck` | passed | Backend and frontend typecheck passed. |
| `pnpm lint` | passed | Backend ESLint and frontend Next lint passed. |
| `pnpm build` | passed | Backend and frontend production builds passed. |

## Smoke Test Results

Backend smoke tests were run against `http://127.0.0.1:3010`.

| Request | Result |
| --- | --- |
| `GET /sports` | `200`, 5 items |
| `GET /cities` | `200`, 5 items |
| `GET /tournaments` | `200`, 5 items, total 5 |
| `GET /tournaments?city=bengaluru` | `200`, 1 item, total 1 |
| `GET /tournaments?sport=badminton` | `200`, 1 item, total 1 |
| `GET /tournaments?status=published` | `200`, 5 items, total 5 |
| `GET /tournaments/bengaluru-shuttle-open` | `200`, detail returned |
| `GET /tournaments?status=draft` | `200`, 0 items |
| `GET /tournaments?status=archived` | `200`, 0 items |
| `GET /tournaments?status=blocked` | `200`, 0 items |
| `GET /tournaments/hidden-draft-badminton-event` | `404` |
| `GET /tournaments/archived-cricket-trial` | `404` |
| `GET /tournaments/blocked-football-test` | `404` |

## Known Limitations

- Discovery is read-only. Organizer tournament create/edit starts in Slice 003.
- Registration records, bookings, payments, fixtures, scoring, notifications, and analytics are not implemented.
- Registration availability is computed from tournament registration dates and category capacity only.
- The optional `/cities/[citySlug]/tournaments` route was deferred because `/tournaments?city=...` covers the MVP path.
- No full admin catalog management UI exists yet.

## Next Recommended Slice

Implement Slice `003-organizer-tournament-management`: organizer dashboard tournament drafts, category management, and publish/unpublish workflows, using the auth roles and discovery data model added in earlier slices.

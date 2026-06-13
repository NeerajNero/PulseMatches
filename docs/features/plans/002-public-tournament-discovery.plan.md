# 002 Public Tournament Discovery Plan

## Status

- Status: verified
- Feature slug: 002-public-tournament-discovery
- Source stories: P-001, P-002
- Classification: risky because it introduces business schema, migrations, public API contracts, SDK generation, and user-facing pages
- Lane: risky
- Created: 2026-05-26
- Last updated: 2026-05-26

## Scope

In scope:

- Sports, cities, venues, organizers, tournaments, media, and tournament categories.
- Public tournament listing with filters for city, sport, status, and date.
- Public tournament detail page with categories, venue, organizer, and registration availability state.
- Seed or migration-backed starter sports/cities if approved.

Out of scope:

- Auth.
- Player registrations/bookings.
- Organizer create/edit flows.
- Payments, fixtures, scoring, notifications, analytics.

## Data Model Impact

- Add tables: `sports`, `cities`, `venues`, `organizer_profiles`, `tournaments`, `tournament_categories`, `tournament_media`, and `audit_logs` if not already present.
- Use UUID primary keys.
- Add lifecycle status fields.
- Add unique slugs for sports, cities, organizers, and tournaments.
- Add indexes on `tournaments.city_id`, `tournaments.sport_id`, `tournaments.status`, and `tournaments.starts_at`.

## API Routes

- `GET /sports`
- `GET /cities`
- `GET /tournaments`
- `GET /tournaments/:slugOrId`

## Frontend Routes/Screens

- `/tournaments`
- `/tournaments/[slug]`
- Optional city route: `/cities/[citySlug]/tournaments`

## Permissions

- Public read-only access.
- Hidden, draft, blocked, or archived tournaments must be excluded by default.

## OpenAPI/SDK Impact

- Add list/detail DTOs and query DTOs.
- Regenerate `libs/client_sdk`.
- Add frontend API wrapper registrations and React Query hooks.

## Background Jobs Impact

- None in this slice.

## Verification Commands

- `pnpm local:up`
- `pnpm --filter @matchflow/backend prisma:migrate`
- `pnpm --filter @matchflow/backend build`
- `pnpm generate:sdk`
- `pnpm --filter @matchflow/frontend build`

## Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Public filters need correct indexes early. | Slow listing pages. | Add indexes in the first migration. |
| Slug uniqueness may collide. | Broken public URLs. | Use unique constraints and deterministic collision handling. |
| Organizer profile depends on auth slice. | Discovery may need placeholder organizer records. | Implement after Slice 2 or explicitly allow seed organizers. |

## Open Questions

| ID | Question | Blocking |
| --- | --- | --- |
| DISC-001 | Should public tournament detail URLs include UUID plus slug, or slug only? Answer: slug-first lookup with UUID fallback. | no |
| DISC-002 | Should unverified tournaments be visible with a warning or hidden? Answer: visible when tournament is published and public; organizer verification status is returned. | no |

## Implementation Order

1. Finalize discovery data model.
2. Add migration and seed data.
3. Add repositories, services, controllers, DTOs, transforms, and Swagger.
4. Verify OpenAPI.
5. Regenerate SDK.
6. Add frontend hooks and pages.
7. Verify listing/detail behavior.

## Approval

- Approved: yes.
- Approval file: prompt-approved.
- Conditions: do not implement organizer tournament creation/editing, registrations/bookings, payments, fixtures/scoring, notifications, analytics, or a full admin dashboard/catalog UI.

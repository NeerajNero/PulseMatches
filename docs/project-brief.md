# MatchFlow Arena Project Brief

## Product

- Name: MatchFlow Arena
- One-sentence purpose: A full-stack sports tournament management platform for players, organizers, and admins.
- Primary users: Players and tournament organizers.
- Admin users: Platform operators who verify organizers, manage sports/cities, and moderate published tournaments.

## Scope

- First vertical slice: 001 Project Foundation.
- Must-have features: Docker-first local services, NestJS backend health and Swagger, Next.js App Router shell, env validation, command map, and durable feature docs.
- Explicit non-goals for the first pass: auth, registrations, payments, fixture generation, live scoring, notifications, advanced analytics, and copied Playmatches branding/assets/UI/copy.

## Feature Workflow

- Default flow policy: classify first when scope is unclear.
- User-story file: `docs/features/user-stories.md`
- Feature index: `docs/features/feature-index.md`
- Classification directory: `docs/features/classifications`
- Plan directory: `docs/features/plans`
- Approval directory: `docs/features/approvals`
- Implementation report directory: `docs/features/reports`
- Block directory: `docs/features/blocks`
- Final directory: `docs/features/final`
- Current feature pointer: `docs/features/current.md`
- Context directory: `docs/context`
- Tiny change lane allowed: yes, only for isolated low-risk changes.
- Context update required after finalize: yes for normal/risky.
- Required approval before implementation: yes for normal/risky. The user prompt explicitly approves only `001-project-foundation`.

## Project Shape

- Backend required: yes.
- Frontend required: yes.
- Frontend target: web.
- If web: Next.js App Router required.
- If mobile: Expo app required: no for MVP.
- If mobile: target platforms: none in MVP.
- If mobile: app targets/store listings: not applicable.
- Shared package strategy: generated web SDK under `libs/client_sdk`; frontend consumes it through wrapper modules.

## Stack

- Package manager: pnpm.
- Monorepo tool: pnpm workspaces.
- Backend: NestJS, Prisma planned, Swagger/OpenAPI.
- Web frontend: Next.js App Router, React Query planned, Tailwind CSS.
- Mobile frontend: out of scope for MVP.
- Database: PostgreSQL.
- Cache/queue: Redis; BullMQ only when background jobs are introduced.
- Docs: markdown under `docs/`.
- Deployment target: not selected yet; local development is Docker-first.

## Domain Model

Initial scalable entities are planned before feature implementation.

| Entity | Purpose | Important Fields | Relationships |
| --- | --- | --- | --- |
| users | Account identity | id, email, display_name, status | user_roles, organizer_profiles, registrations |
| user_roles | Multi-role access | user_id, role | users |
| organizer_profiles | Club/organizer identity | user_id, organization_name, slug, verification_status | tournaments |
| sports | Sport catalog | name, slug, status | tournaments, tournament_categories |
| cities | City catalog | name, slug, country_code, status | venues, tournaments |
| venues | Play locations | name, address, city_id, geo fields | tournaments |
| tournaments | Public event shell | organizer_id, sport_id, city_id, venue_id, slug, status, starts_at | categories, media, fixtures, matches |
| tournament_categories | Bookable divisions | format, age_group, gender_type, entry_fee, capacity | registrations, fixtures |
| tournament_media | Tournament media references | type, url, sort_order | tournaments |
| registrations | Player/team booking | status, fee_snapshot, payment_status | users, teams, categories |
| teams | Team or individual participant container | name, registration_id | team_members |
| team_members | Members in a team | team_id, user_id, display_name | teams, users |
| fixtures | Generated draw/round container | category_id, format, status | matches |
| matches | Scheduled or scored match | fixture_id, round, status, scheduled_at | match_scores, match_events |
| match_scores | Score snapshots | match_id, side, points/sets JSON | matches |
| match_events | Detailed scoring log | match_id, event_type, metadata | matches |
| registration_payment_intents | Future payment placeholder | registration_id, provider, status, amount | registrations |
| audit_logs | Immutable business actions | actor_id, entity_type, action, metadata | users and business entities |

## Auth And Roles

| Role | Permissions |
| --- | --- |
| player | Browse tournaments, view details, register/book categories, view personal registrations and scores. |
| organizer | Manage organization profile, create tournaments, manage categories, registrations, fixtures, scores, and analytics for owned tournaments. |
| admin | Verify organizers/tournaments, manage sports/cities, moderate published content, and view platform overview. |

## Local Services

| Service | Port | Notes |
| --- | --- | --- |
| Backend | 3010 | NestJS API and Swagger. |
| Frontend | 3002 | Next.js web app. |
| Postgres | 55432 | Docker service mapped to container port 5432. |
| Redis | 56379 | Docker service mapped to container port 6379. |

## External Services

| Service | Environment Variables | Local Stub |
| --- | --- | --- |
| Payment gateway | TBD in later slice | Payment placeholder only in MVP. |
| Email/SMS/push | TBD in later slice | Not implemented in Slice 1. |

## Mobile Capabilities

Not in MVP scope.

## Verification Target

The first project pass is done when:

- Docker compose configuration validates for Postgres and Redis.
- Backend builds and exposes `/health` and Swagger/OpenAPI.
- Frontend builds with a usable shell.
- Env examples list all required variables.
- Feature plans and context docs exist.

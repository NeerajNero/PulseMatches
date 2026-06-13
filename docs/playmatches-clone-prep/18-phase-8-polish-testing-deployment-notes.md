# Phase 8 Polish, Testing, and Deployment Notes

## Summary

Phase 8 focused on hardening and regression coverage rather than adding product features. No notifications, real payments, admin moderation, sport-specific scoring, or new product modules were added.

Implemented work:

- Added an API-level MVP smoke regression script for public discovery, auth, player registration, organizer setup, roster management, fixtures, scoring, and public result publishing.
- Hardened unsafe knockout match reopen validation after the smoke test exposed a gap.
- Added a focused frontend confirmation before category deactivation.
- Updated command documentation with the new smoke workflow and local development expectations.
- Re-ran backend, frontend, workspace, build, lint, typecheck, Prisma generate, seed, and smoke validation.

## Tests Added Or Updated

Added:

- `scripts/mvp-smoke.mjs`

Updated:

- Root `package.json` now exposes `pnpm smoke:mvp`.
- `docs/command-map.md` documents the smoke command, default users, environment overrides, and safety assumptions.

The smoke script uses only application HTTP APIs against a running backend. It does not run migrations, reset data, or directly edit the database. It creates isolated timestamped records and expects the idempotent local seed users to exist:

- Organizer: `organizer@matchflow.local`
- Player: `player@matchflow.local`

Optional smoke environment variables:

- `API_URL`
- `MVP_SMOKE_ORGANIZER_EMAIL`
- `MVP_SMOKE_ORGANIZER_PASSWORD`
- `MVP_SMOKE_PLAYER_EMAIL`
- `MVP_SMOKE_PLAYER_PASSWORD`
- `MVP_SMOKE_RUN_ID`

Coverage included in the smoke:

- Public discovery hides draft and archived tournaments.
- Public tournament detail loads for published tournaments.
- Protected organizer endpoints reject unauthenticated and player users.
- Organizer draft creation, editing, and publish guard behavior.
- Player registration, duplicate prevention, invalid category validation, own registration listing, cross-user access protection, and cancellation.
- Organizer registration approval and rejection.
- Manual participant, team, and team member create/update/delete flows.
- Knockout and round-robin fixture generation.
- Duplicate unsafe fixture generation guard.
- Match scheduling.
- Score validation, knockout draw rejection, winner completion, winner advancement, unsafe reopen guard, and round-robin standings.
- Public result publishing and unpublishing.
- Public fixture/result payload privacy marker checks.
- Archived fixture guards for scheduling, scoring, and publishing.

No Jest, Vitest, Playwright, or package `test` script was found in the repository, so no separate unit or browser test suite was added.

## Backend Hardening Changes

Changed files:

- `apps/backend/src/db/organizer-fixtures/organizer-fixtures.repository.ts`
- `apps/backend/src/db/organizer-fixtures/organizer-fixtures-db.service.ts`
- `apps/backend/src/api/organizer-fixtures/organizer-fixtures.service.ts`

The smoke run exposed that reopening a completed knockout match could miss a downstream advancement case. The reopen guard now:

- Uses the canonical `Match.winnerParticipantId` or `Match.winnerTeamId` first.
- Falls back to stored score winner fields only if needed.
- Counts downstream match entrants in later rounds for the same fixture set.
- Blocks reopening when the completed match winner has already advanced to a later round.

No API contract changed. The existing reopen endpoint now returns the expected conflict behavior for unsafe knockout reopen attempts.

## Frontend Polish Changes

Changed file:

- `apps/frontend/components/custom/organizer/organizer-category-manager-view.tsx`

Added a browser confirmation before category deactivation. This keeps destructive organizer setup actions aligned with the existing lightweight confirmation pattern and reduces accidental category deactivation.

No broad redesign was performed.

## Deployment Readiness Notes

Root commands:

- `pnpm install`
- `pnpm local:up`
- `pnpm local:infra:up`
- `pnpm local:down`
- `pnpm local:config`
- `pnpm local:logs`
- `pnpm backend:dev`
- `pnpm frontend:dev`
- `pnpm build`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm generate:openapi`
- `pnpm generate:sdk`
- `pnpm smoke:mvp`

Backend commands:

- `pnpm --filter @matchflow/backend dev`
- `pnpm --filter @matchflow/backend build`
- `pnpm --filter @matchflow/backend start`
- `pnpm --filter @matchflow/backend lint`
- `pnpm --filter @matchflow/backend typecheck`
- `pnpm --filter @matchflow/backend prisma:generate`
- `pnpm --filter @matchflow/backend prisma:migrate`
- `pnpm --filter @matchflow/backend prisma:deploy`
- `pnpm --filter @matchflow/backend prisma:studio`
- `pnpm --filter @matchflow/backend db:seed`

Frontend commands:

- `pnpm --filter @matchflow/frontend dev`
- `pnpm --filter @matchflow/frontend build`
- `pnpm --filter @matchflow/frontend lint`
- `pnpm --filter @matchflow/frontend typecheck`

Docker Compose:

- `pnpm local:up` starts Postgres, Redis, backend, and frontend.
- `pnpm local:infra:up` starts only Postgres and Redis for host-based development.
- The backend container runs Prisma migration deploy and the idempotent dev seed before starting the API.

SDK/OpenAPI:

- `pnpm generate:openapi` fetches the running backend OpenAPI document.
- `pnpm generate:sdk` regenerates the committed `libs/client_sdk` TypeScript fetch SDK from `openapi.json`.
- Phase 8 did not change endpoint DTOs or contracts, so SDK regeneration was not needed.

Build output and generated files:

- `.next/`, `dist/`, `coverage/`, logs, `.env`, `.env.local`, `.env.*.local`, and `openapi.json` are ignored.
- `libs/client_sdk` is intentionally committed and used by the frontend.

## Environment Variables Checked

Important backend environment areas:

- `DATABASE_URL`
- `REDIS_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CORS_ORIGIN`
- Frontend URL / app URL settings used by auth and local runtime

Important frontend environment areas:

- API base URL used by client-side SDK/API wrappers
- Public frontend URL assumptions for local Docker and host development

The backend has local-development defaults in env validation, but production deployments must override secrets and connection strings.

## Commands Run And Results

Passed:

- `node --check scripts/mvp-smoke.mjs`
- `pnpm --filter @matchflow/backend prisma:generate`
- `pnpm --filter @matchflow/backend typecheck`
- `pnpm --filter @matchflow/backend lint`
- `pnpm --filter @matchflow/backend build`
- `pnpm --filter @matchflow/frontend typecheck`
- `pnpm --filter @matchflow/frontend lint`
- `pnpm --filter @matchflow/frontend build`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- `pnpm --filter @matchflow/backend db:seed`
- `pnpm smoke:mvp`

Intermediate failures:

- The first smoke run inside the sandbox failed with `fetch failed`; it was rerun with the required execution permission against the local backend.
- A smoke run then exposed the unsafe knockout reopen issue described above. The backend guard was fixed and the final smoke passed.

Final smoke result:

```text
mvp-smoke: public discovery visibility checks passed
mvp-smoke: auth and role checks passed
mvp-smoke: organizer CRUD and draft visibility checks passed
mvp-smoke: player registration checks passed
mvp-smoke: organizer registration review checks passed
mvp-smoke: roster, participant, team, and member checks passed
mvp-smoke: fixture generation duplicate guard passed
mvp-smoke: knockout scoring and advancement checks passed
mvp-smoke: round-robin standings checks passed
mvp-smoke: public result publishing and archive guards passed
{"status":"mvp_smoke_ok","run_id":"1780912866856","tournament_id":"ce34b32f-5e13-41f5-ab1f-0b4d8277efa3","draft_tournament_id":"a427bef7-88de-46d5-8835-35c6cda47ce8","knockout_fixture_id":"7a823be9-5bfe-430f-87d1-4b9b3667bfe1","round_robin_fixture_id":"1ca591c0-0469-4f37-929f-1cf26253edf2","public_privacy_markers_checked":7}
```

Not run:

- `pnpm test`, because no root or package test script is configured.
- `pnpm generate:openapi` and `pnpm generate:sdk`, because Phase 8 did not change API contracts.

## Smoke Checks Run

The final smoke validated:

- Public homepage-adjacent API health and discovery visibility.
- Draft and archived tournament privacy.
- Organizer role protection.
- Player registration ownership protection.
- Organizer ownership-sensitive flows.
- Roster management.
- Fixture generation and duplicate guards.
- Match scheduling.
- Generic scoring, knockout advancement, standings, and archived fixture protections.
- Public result publishing and privacy.

The local backend process used during validation was stopped after the smoke run.

## Schema And SDK

Schema changes:

- None.

Migration:

- None.

Prisma:

- `pnpm --filter @matchflow/backend prisma:generate` passed.

SDK:

- Not regenerated because endpoint contracts did not change.

## Security And Privacy Checklist

Checked or covered by smoke/hardening:

- Public discovery returns only published public tournaments.
- Draft and archived tournaments stay hidden publicly.
- Public fixtures/results are hidden until organizer publishing.
- Public fixture payloads avoid private markers such as `email`, `phone`, `notes`, `result_notes`, `payment`, `audit`, and `user_id`.
- Organizer endpoints require JWT and organizer role.
- Player users cannot access organizer endpoints.
- Player registration detail/cancel operations are scoped to the owning user.
- Organizer tournament, roster, fixture, scoring, and publishing operations are scoped to owned tournaments.
- Unsafe knockout reopen after advancement is blocked.
- Archived fixture sets reject schedule, score, and publish operations.
- Offline/manual payment remains the only payment mode.
- Real notification delivery is still deferred.

Known concurrency limitations:

- Duplicate registration prevention is primarily service-level plus available database constraints.
- Category capacity enforcement is service-level.
- Duplicate fixture generation prevention is service-level.
- These should be revisited before high-concurrency production launch.

## Known Limitations

- There is no dedicated unit/integration test suite configured yet.
- The smoke script requires a running backend and seeded local users.
- The smoke script is API-level only; it does not exercise browser rendering or responsive UI.
- Real notification delivery, payment provider integration, admin moderation, sport-specific scoring, live scoring, and public result pages beyond the tournament detail display remain deferred.
- Production deployment still needs environment-specific secrets, URLs, and infrastructure configuration outside this repository.

## Recommended Future Phases

1. Add a proper backend integration test suite using the existing NestJS and Prisma conventions.
2. Add browser smoke coverage for the main public, player, and organizer routes once a frontend test runner is selected.
3. Add CI steps for Prisma generate, lint, typecheck, build, and the API smoke against a disposable database.
4. Add notification outbox processing and provider integration in a separate phase.
5. Add real payment provider support only after offline/manual payment workflows are stable.
6. Add sport-specific scoring only after generic scoring and public result publishing have enough production feedback.

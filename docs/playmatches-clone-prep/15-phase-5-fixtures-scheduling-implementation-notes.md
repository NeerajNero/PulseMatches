# Phase 5 Fixtures And Scheduling Implementation Notes

## Summary

Phase 5 adds organizer fixture generation and match scheduling for owned tournaments.

Implemented:

- Fixture generation per tournament category/event.
- Supported formats:
  - `KNOCKOUT`
  - `ROUND_ROBIN`
- Supported entrant sources:
  - active `Participant` records for singles categories
  - active `Team` records for doubles/team categories
- Fixture set list and detail APIs.
- Generated rounds, matches, and match entrants.
- BYE slots for knockout brackets with non-power-of-two entrant counts.
- Schedule-only match editing:
  - scheduled date/time
  - venue/ground name
  - court/field name
  - notes
  - match status
- Fixture set archiving.
- Organizer frontend pages for generating fixtures, viewing rounds/matches, and editing schedules.

Not implemented:

- scoring
- live results
- public results or fixture pages
- standings/tiebreakers
- notifications
- real payments
- admin moderation
- sport-specific bracket rules

## Schema And Model Changes

Updated `apps/backend/prisma/schema.prisma`.

New enums:

- `FixtureFormat`
  - `KNOCKOUT`
  - `ROUND_ROBIN`
- `FixtureEntrantType`
  - `PARTICIPANT`
  - `TEAM`
- `FixtureSetStatus`
  - `DRAFT`
  - `GENERATED`
  - `SCHEDULED`
  - `ARCHIVED`
- `FixtureRoundStage`
  - `ROUND_ROBIN`
  - `ROUND_OF_32`
  - `ROUND_OF_16`
  - `QUARTER_FINAL`
  - `SEMI_FINAL`
  - `FINAL`
  - `THIRD_PLACE`
- `MatchStatus`
  - `UNSCHEDULED`
  - `SCHEDULED`
  - `POSTPONED`
  - `CANCELLED`

New models:

- `FixtureSet`
- `FixtureRound`
- `Match`
- `MatchEntrant`

Relationships added:

- `Tournament.fixtureSets`
- `Tournament.matches`
- `TournamentCategory.fixtureSets`
- `TournamentCategory.matches`
- `Participant.matchEntrants`
- `Team.matchEntrants`

Important constraints and indexes:

- `FixtureSet` indexes on tournament, category, tournament/category, and status.
- `FixtureRound` unique `(fixtureSetId, roundNumber)`.
- `Match` unique `(fixtureSetId, matchNumber)`.
- `MatchEntrant` unique `(matchId, slotNumber)`.
- `MatchEntrant` has indexes for match, participant, and team lookups.
- SQL migration adds a check constraint so each match entrant is either a BYE, a participant entrant, or a team entrant.

## Migration

Migration created and applied locally:

- `apps/backend/prisma/migrations/20260608150000_008_fixture_generation/migration.sql`

Command result:

- `pnpm --filter @matchflow/backend prisma:migrate` passed.

No destructive migration or database reset was run.

## Backend Endpoints Added

All endpoints require JWT auth, organizer role, organizer profile, and ownership of the tournament.

Fixture list:

- `GET /organizer/tournaments/:id/fixtures`

Fixture generation:

- `POST /organizer/tournaments/:id/categories/:categoryId/fixtures/generate`

Fixture detail:

- `GET /organizer/tournaments/:id/fixtures/:fixtureSetId`

Match scheduling:

- `PATCH /organizer/tournaments/:id/fixtures/:fixtureSetId/matches/:matchId`

Fixture archive:

- `PATCH /organizer/tournaments/:id/fixtures/:fixtureSetId/archive`

Backend files added:

- `apps/backend/src/api/organizer-fixtures/dto/organizer-fixture.dto.ts`
- `apps/backend/src/api/organizer-fixtures/organizer-fixtures.controller.ts`
- `apps/backend/src/api/organizer-fixtures/organizer-fixtures.module.ts`
- `apps/backend/src/api/organizer-fixtures/organizer-fixtures.service.ts`
- `apps/backend/src/api/organizer-fixtures/organizer-fixtures.transform.ts`
- `apps/backend/src/db/organizer-fixtures/organizer-fixtures-db.module.ts`
- `apps/backend/src/db/organizer-fixtures/organizer-fixtures-db.service.ts`
- `apps/backend/src/db/organizer-fixtures/organizer-fixtures.repository.ts`

Backend files changed:

- `apps/backend/src/app.module.ts`
- `apps/backend/prisma/schema.prisma`

## Fixture Generation Rules

Shared validation:

- Category must belong to the owned tournament.
- Category must be active.
- Entrants must be active.
- At least two entrants are required.
- Duplicate non-archived fixture sets for the same tournament/category/format/entrant type are blocked.
- `replace_existing=true` archives existing matching fixture sets before creating the replacement.
- Player users receive `403` on organizer fixture endpoints.

Entrant type rules:

- `PARTICIPANT` fixture generation is allowed for `SINGLES` categories only.
- `TEAM` fixture generation is allowed for `DOUBLES` and `TEAM` categories.

Knockout:

- Deterministic entrant order is used.
- Team entrants sort by seed, then creation date, then name.
- Participant entrants sort by creation date, then display name.
- Next power-of-two bracket size is calculated.
- BYE slots are added where needed.
- First-round matches are persisted.
- Future rounds are not auto-created because winners/scoring are deferred.
- Current maximum is 32 entrants.

Round robin:

- Uses a simple circle method.
- Each entrant plays every other entrant once.
- For odd entrant counts, a rotation BYE is used internally and no BYE match is persisted.
- Standings and tiebreakers are deferred.

Scheduling:

- Match schedule updates accept only schedule/status fields.
- Score fields are rejected by the global whitelist validation pipe.
- `SCHEDULED` matches require `scheduled_at`.
- `UNSCHEDULED` matches cannot keep a scheduled date.
- Fixture set status becomes `SCHEDULED` when every match is scheduled, otherwise remains/generated as `GENERATED`.

## Frontend Routes Added

New organizer routes:

- `/organizer/tournaments/[id]/fixtures`
- `/organizer/tournaments/[id]/fixtures/[fixtureSetId]`

Existing routes remain preserved:

- `/organizer`
- `/organizer/dashboard`
- `/organizer/tournaments`
- `/organizer/tournaments/new`
- `/organizer/tournaments/[id]/edit`
- `/organizer/tournaments/[id]/categories`
- `/organizer/tournaments/[id]/registrations`
- `/organizer/tournaments/[id]/participants`
- `/organizer/tournaments/[id]/teams`
- `/organizer/tournaments/[id]/teams/[teamId]`

## Frontend Components And Hooks Added

New hooks:

- `useOrganizerFixtures`
- `useOrganizerFixtureSet`
- `useGenerateFixtureSet`
- `useUpdateMatchSchedule`
- `useArchiveFixtureSet`

New component files:

- `apps/frontend/components/custom/organizer/organizer-fixture-management-view.tsx`
- `apps/frontend/components/custom/organizer/organizer-fixture-detail-view.tsx`

New page files:

- `apps/frontend/app/organizer/tournaments/[id]/fixtures/page.tsx`
- `apps/frontend/app/organizer/tournaments/[id]/fixtures/[fixtureSetId]/page.tsx`

Frontend files changed:

- `apps/frontend/lib/apis/api.ts`
- `apps/frontend/utils/query-constants.ts`
- `apps/frontend/utils/route.ts`
- `apps/frontend/styles/globals.css`
- `apps/frontend/components/custom/organizer/organizer-tournament-management-nav.tsx`
- `apps/frontend/components/custom/organizer/organizer-tournament-list-view.tsx`

## SDK Generation

OpenAPI and SDK generation succeeded.

Commands:

- `pnpm generate:openapi`
- `pnpm generate:sdk`

Generated SDK now includes:

- `OrganizerFixturesApi`
- `GenerateFixtureSetRequestDto`
- `UpdateMatchScheduleRequestDto`
- `FixtureSetDto`
- `FixtureSetDetailDto`
- `FixtureRoundDto`
- `FixtureMatchDto`
- `FixtureEntrantDto`

## Validation Commands

Passed:

- `pnpm --filter @matchflow/backend prisma:generate`
- `pnpm --filter @matchflow/backend prisma:migrate`
- `pnpm --filter @matchflow/backend typecheck`
- `pnpm --filter @matchflow/backend lint`
- `pnpm --filter @matchflow/backend build`
- `pnpm --filter @matchflow/frontend typecheck`
- `pnpm --filter @matchflow/frontend lint`
- `pnpm --filter @matchflow/frontend build`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- `pnpm generate:openapi`
- `pnpm generate:sdk`

Tests were not run as a separate test suite because this repo does not currently define a dedicated root test script. Validation used Prisma generation/migration, typecheck, lint, build, OpenAPI/SDK generation, and API smoke checks.

## Smoke Test Results

Smoke checks were run against the local backend on `http://127.0.0.1:3010`.

The first sandboxed smoke attempt failed with `connect EPERM 127.0.0.1:3010`, so the same localhost API-only smoke script was rerun with escalation and passed.

Validated:

- Organizer login.
- Owned tournament lookup.
- Team category creation.
- Two team creation calls.
- Knockout fixture generation for teams.
- Fixture detail retrieval.
- Match schedule update.
- Fixture set archive.
- Round-robin fixture generation for teams.
- Player access to organizer fixture endpoint returns `403`.
- Public tournament discovery still returns data.
- Organizer roster teams endpoint still returns the created teams.

The smoke check created temporary local development category, team, and fixture rows through normal API calls only. No direct database edits were used.

## Known Limitations

- Knockout generation creates first-round matches only. Future rounds/winner advancement are deferred until scoring exists.
- Knockout generation currently supports up to 32 entrants.
- No random shuffle is used. Ordering is deterministic and simple.
- Round-robin generation creates pairings only; standings and tiebreakers are deferred.
- Duplicate fixture prevention is service-level for non-archived matching fixture sets, not a partial database unique index.
- Regeneration archives matching fixture sets when `replace_existing=true`; it does not hard-delete prior matches.
- No public fixture display was added.
- No score, winner, result, live update, notification, payment, or admin behavior was added.

## Deferred Items

Later phases should add:

- Score/result entry.
- Winner advancement for knockout brackets.
- Standings for round robin.
- Public fixture/result display after fixture publication rules are approved.
- More robust regeneration protections once completed matches exist.
- Optional public/internal fixture publish semantics.
- Sport-specific rules only when explicitly scoped.

## Recommended Next Phase

Phase 6 should implement generic manual scoring and results on top of the `Match` and `MatchEntrant` models.

Recommended scope:

- Add score/result models or fields without changing Phase 5 scheduling behavior.
- Allow organizers to mark match results and winners.
- Advance knockout winners only after a clear result workflow exists.
- Add public results display only if explicitly approved for Phase 6.

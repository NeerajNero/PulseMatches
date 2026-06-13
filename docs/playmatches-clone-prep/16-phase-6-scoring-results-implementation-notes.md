# Phase 6 Scoring and Results Implementation Notes

## Summary

Phase 6 adds generic manual scoring for generated fixture matches. Organizers can enter numeric scores, select a winner, complete matches, reopen safe completed matches, view result summaries, and review round-robin standings. Knockout winners are advanced into the next round when the bracket can be advanced safely.

This phase intentionally does not add sport-specific scoring, live scoring, notifications, real payments, admin moderation, public results pages, referee assignment, player check-in, or live commentary.

## Schema and Model Changes

Migration created:

- `20260608160000_009_scoring_results`

Prisma changes:

- Extended `MatchStatus` with:
  - `IN_PROGRESS`
  - `COMPLETED`
- Added `Match.roundPosition` to identify deterministic bracket position within a round.
- Added nullable match result fields:
  - `completedAt`
  - `winnerParticipantId`
  - `winnerTeamId`
  - `resultNotes`
- Added `MatchScore`:
  - `id`
  - `matchId`
  - `matchEntrantId`
  - `score`
  - `isWinner`
  - `createdAt`
  - `updatedAt`
- Added indexes for match completion, winner references, scores, and round position.
- Added uniqueness for one score row per match entrant.
- Existing matches are backfilled with `round_position` using `ROW_NUMBER()` by round.

## Backend Endpoints Added

Organizer-only, JWT-protected, `ORGANIZER` role:

- `GET /organizer/tournaments/:id/fixtures/:fixtureSetId/results`
- `PATCH /organizer/tournaments/:id/fixtures/:fixtureSetId/matches/:matchId/score`
- `PATCH /organizer/tournaments/:id/fixtures/:fixtureSetId/matches/:matchId/complete`
- `PATCH /organizer/tournaments/:id/fixtures/:fixtureSetId/matches/:matchId/reopen`

Existing fixture detail and schedule responses now include result fields:

- entrant `score`
- entrant `is_winner`
- match `round_position`
- match `completed_at`
- match `winner_match_entrant_id`
- match `result_notes`
- fixture detail `standings`

## Scoring Rules and Limitations

- Scores are generic non-negative integers.
- Completion requires at least one real entrant.
- Completion requires scores for all real entrants.
- Winner must belong to the match and cannot be a BYE entrant.
- Cancelled matches cannot receive scores.
- Archived fixture sets cannot receive score updates.
- Draws are supported only for round-robin matches through `allow_draw`.
- Knockout draws are rejected.
- BYE matches can be completed when exactly one real entrant is present.

## Knockout Advancement Behavior

- Completing a knockout match advances the winner into the next round when the current round is not the final.
- Next-round placement is deterministic:
  - next match position is `ceil(current roundPosition / 2)`
  - odd source positions fill slot 1
  - even source positions fill slot 2
- Next rounds and next matches are created as needed.
- Reopening a knockout match is blocked if its winner has already advanced into a later round.
- Third-place matches, double elimination, and complex bracket correction are deferred.

## Round-Robin Standings Behavior

Standings are calculated on read from completed round-robin matches and are not persisted.

Columns:

- played
- wins
- draws
- losses
- points
- scoreFor
- scoreAgainst
- scoreDifference

Default points:

- win: 3
- draw: 1
- loss: 0

Sort order:

1. points descending
2. wins descending
3. score difference descending
4. score for descending
5. entrant name ascending

Head-to-head and sport-specific tiebreakers are deferred.

## Frontend Routes, Components, and Hooks

Route added:

- `/organizer/tournaments/[id]/fixtures/[fixtureSetId]/scoring`

Frontend additions:

- `OrganizerFixtureScoringView`
- scoring link and result summaries on existing fixture detail page
- standings table for round-robin fixture sets
- generic score form per match

Hooks added:

- `useOrganizerFixtureResults`
- `useUpdateMatchScore`
- `useCompleteMatch`
- `useReopenMatch`

Route/query helpers added:

- `organizerTournamentFixtureScoringRoute`
- `ORGANIZER_TOURNAMENT_QUERY_KEYS.FIXTURE_RESULTS`

## Public Result Display

Public fixture/result display was deferred. Phase 6 keeps result management organizer-only and does not expose public results pages or player-facing fixture result APIs.

## SDK Generation Result

OpenAPI and SDK generation succeeded:

- `pnpm generate:openapi`
- `pnpm generate:sdk`

The generated SDK now includes:

- `UpdateMatchScoreRequestDto`
- `MatchScoreInputDto`
- `RoundRobinStandingDto`
- scoring/result operations on `OrganizerFixturesApi`
- updated fixture match/detail models with score/result fields

## Validation Commands and Results

- `pnpm --filter @matchflow/backend prisma:generate` - passed.
- `pnpm --filter @matchflow/backend prisma:migrate` - passed and applied `20260608160000_009_scoring_results`.
- `pnpm --filter @matchflow/backend typecheck` - passed.
- `pnpm --filter @matchflow/backend lint` - passed.
- `pnpm --filter @matchflow/backend build` - passed.
- `pnpm generate:openapi` - passed after starting the built backend.
- `pnpm generate:sdk` - passed.
- `pnpm --filter @matchflow/frontend typecheck` - passed.
- `pnpm --filter @matchflow/frontend lint` - passed.
- `pnpm --filter @matchflow/frontend build` - passed.
- `pnpm typecheck` - passed.
- `pnpm lint` - passed.
- `pnpm build` - passed.

The first smoke attempt failed with sandbox `EPERM` connecting to `127.0.0.1:3010`; the same script passed when rerun with approved local backend access.

## Smoke Test Results

API smoke script used only application APIs and local generated test data.

Passed checks:

- signed up a local organizer and player
- created organizer tournament and team category
- created four teams
- generated knockout fixture
- completed a knockout match
- verified knockout winner advanced into the final
- verified knockout draw completion is rejected
- generated round-robin fixture
- completed two round-robin matches
- verified standings are calculated and sorted
- reopened a completed round-robin match
- archived a fixture set
- verified archived fixture scoring is rejected
- verified player access to organizer fixture results returns `403`
- verified public tournament discovery still responds

Smoke result:

```text
phase6_smoke_ok {"tournament_id":"b53a1b21-577b-4c39-be96-e553ecb3e8a2","knockout_fixture_id":"96210839-c0d3-4156-b20a-5fb9213a1ce5","round_robin_fixture_id":"a9e3b603-732a-482b-8682-4ed3e8bcc4c4","standings_count":4,"archived_score_status":400,"player_access_status":403}
```

## Files Changed

Backend:

- `apps/backend/prisma/schema.prisma`
- `apps/backend/prisma/migrations/20260608160000_009_scoring_results/migration.sql`
- `apps/backend/src/api/organizer-fixtures/dto/organizer-fixture.dto.ts`
- `apps/backend/src/api/organizer-fixtures/organizer-fixtures.controller.ts`
- `apps/backend/src/api/organizer-fixtures/organizer-fixtures.service.ts`
- `apps/backend/src/api/organizer-fixtures/organizer-fixtures.transform.ts`
- `apps/backend/src/db/organizer-fixtures/organizer-fixtures-db.service.ts`
- `apps/backend/src/db/organizer-fixtures/organizer-fixtures.repository.ts`

Frontend:

- `apps/frontend/app/privacy/page.tsx`
- `apps/frontend/app/terms/page.tsx`
- `apps/frontend/app/organizer/tournaments/[id]/fixtures/[fixtureSetId]/scoring/page.tsx`
- `apps/frontend/components/custom/organizer/organizer-category-manager-view.tsx`
- `apps/frontend/components/custom/organizer/organizer-fixture-detail-view.tsx`
- `apps/frontend/components/custom/organizer/organizer-fixture-scoring-view.tsx`
- `apps/frontend/components/custom/tournaments/tournament-detail-view.tsx`
- `apps/frontend/hooks/use-organizer-fixtures.ts`
- `apps/frontend/styles/globals.css`
- `apps/frontend/utils/query-constants.ts`
- `apps/frontend/utils/route.ts`

Generated contract:

- `openapi.json`
- `libs/client_sdk/**`

Documentation:

- `docs/playmatches-clone-prep/16-phase-6-scoring-results-implementation-notes.md`

## Known Limitations

- Public fixture/result display is not implemented.
- Scores are single numeric values per entrant, not sport-specific set/game/period scoring.
- Round-robin standings use basic tiebreakers only.
- Knockout advancement is simple single-elimination advancement.
- Reopening knockout matches is blocked once the winner has advanced.
- No live scoring, commentary, referee workflows, notifications, or public result publishing.

## Deferred Items for Later Phases

- Public read-only fixtures/results.
- Result publishing controls.
- Notifications for schedule/result changes.
- Sport-specific score models if required.
- More advanced standings and tiebreakers.
- Admin moderation and audit review workflows.

## Recommended Next Phase

Phase 7 should focus on notifications and public result presentation, while keeping payments offline/manual unless explicit real payment infrastructure is added later.

# Phase 7 Public Results Publishing Implementation Notes

## Summary

Phase 7 adds public read-only fixture/result visibility for published tournaments and organizer-controlled result publishing. Fixture sets remain private by default. Organizers can publish or hide a fixture set from public tournament pages without changing schedules, scores, standings, or registrations.

No notification provider was added. Publishing records an audit/event point that is ready for a future notification outbox or provider integration.

## Schema And Model Changes

No Prisma schema migration was required.

The implementation reuses the existing `FixtureSet.publishedAt` field as the public visibility marker:

- `publishedAt = null`: fixture set is hidden from public result endpoints.
- `publishedAt != null`: fixture set is public if the tournament is also published/public and the fixture set is not archived.

Archived fixture sets now clear `publishedAt` during archive so archived results cannot remain public.

Migration name: none.

## Backend Endpoints Added

- `GET /tournaments/:slugOrId/fixtures`
  - Public, no auth.
  - Returns only fixture sets with `publishedAt != null`.
  - Requires tournament `status = PUBLISHED` and `visibility = PUBLIC`.
  - Excludes archived fixture sets.

- `PATCH /organizer/tournaments/:id/fixtures/:fixtureSetId/publish-results`
  - Organizer-only.
  - Requires ownership and a published/public tournament.
  - Rejects archived fixture sets.
  - Sets `FixtureSet.publishedAt`.

- `PATCH /organizer/tournaments/:id/fixtures/:fixtureSetId/unpublish-results`
  - Organizer-only.
  - Requires ownership.
  - Clears `FixtureSet.publishedAt`.

## Public Response Privacy Rules

The public fixture response includes:

- fixture set summary
- category summary
- format and entrant type
- rounds and matches
- match status
- scheduled time
- public venue/court names
- entrant display names
- BYE indicators
- generic scores
- winner marker
- completed time
- round-robin standings

The public fixture response intentionally excludes:

- participant email
- participant phone
- user IDs
- registration/payment internals
- organizer-only schedule notes
- result notes
- audit records
- draft/unpublished/archived fixture sets

## Organizer Publish And Unpublish Behavior

Organizer fixture list, detail, and scoring pages now show public visibility state and actions:

- `Visible publicly`
- `Hidden from public`
- `Publish results`
- `Hide results`

Publishing is idempotent. Hiding is idempotent. Archiving hides the fixture set automatically.

Publishing can expose scheduled fixtures before every match is completed, which keeps schedules and results under one read-only public section.

## Notification-Ready Decision

No notification table, queue, worker, provider, template, or background job was added in this phase.

Publishing and unpublishing write audit records through the existing audit-log pattern:

- `fixture_set.results_published`
- `fixture_set.results_unpublished`

The audit metadata marks the event as notification-ready and delivery as deferred. This creates a clean future integration point without adding delivery behavior now.

## Frontend Routes And Components

Enhanced existing routes:

- `/tournaments/[slug]`
  - Adds read-only `Fixtures and results` section.
  - Shows published fixture sets, schedules, completed scores, winners, BYEs, and round-robin standings.
  - Shows loading, error, and empty states.

- `/organizer/tournaments/[id]/fixtures`
  - Adds public visibility badge and publish/hide actions.

- `/organizer/tournaments/[id]/fixtures/[fixtureSetId]`
  - Adds public visibility summary and publish/hide actions.

- `/organizer/tournaments/[id]/fixtures/[fixtureSetId]/scoring`
  - Adds public visibility summary and publish/hide actions.

- `/account/registrations`
  - Adds a link from each registration to the tournament fixtures/results section.

Frontend hooks added:

- `usePublicTournamentFixtures`
- `usePublishFixtureResults`
- `useUnpublishFixtureResults`

## Files Changed

Backend source:

- `apps/backend/src/api/discovery/discovery.controller.ts`
- `apps/backend/src/api/discovery/discovery.service.ts`
- `apps/backend/src/api/discovery/discovery.transform.ts`
- `apps/backend/src/api/discovery/dto/discovery-response.dto.ts`
- `apps/backend/src/api/organizer-fixtures/organizer-fixtures.controller.ts`
- `apps/backend/src/api/organizer-fixtures/organizer-fixtures.service.ts`
- `apps/backend/src/db/discovery/discovery-db.service.ts`
- `apps/backend/src/db/discovery/discovery.repository.ts`

Frontend source:

- `apps/frontend/components/custom/registrations/registration-list.tsx`
- `apps/frontend/components/custom/organizer/organizer-fixture-detail-view.tsx`
- `apps/frontend/components/custom/organizer/organizer-fixture-management-view.tsx`
- `apps/frontend/components/custom/organizer/organizer-fixture-scoring-view.tsx`
- `apps/frontend/components/custom/tournaments/tournament-detail-view.tsx`
- `apps/frontend/hooks/use-discovery.ts`
- `apps/frontend/hooks/use-organizer-fixtures.ts`
- `apps/frontend/styles/globals.css`
- `apps/frontend/utils/query-constants.ts`

Generated contract/client:

- `openapi.json`
- `libs/client_sdk/apis/DiscoveryApi.ts`
- `libs/client_sdk/apis/OrganizerFixturesApi.ts`
- `libs/client_sdk/models/PublicFixtureEntrantDto.ts`
- `libs/client_sdk/models/PublicFixtureMatchDto.ts`
- `libs/client_sdk/models/PublicFixtureRoundDto.ts`
- `libs/client_sdk/models/PublicFixtureSetDto.ts`
- `libs/client_sdk/models/PublicFixtureSetListApiResponseDto.ts`
- `libs/client_sdk/models/PublicFixtureStandingDto.ts`
- `libs/client_sdk/models/index.ts`
- matching generated `libs/client_sdk/docs/PublicFixture*.md` files

Documentation:

- `docs/playmatches-clone-prep/17-phase-7-public-results-publishing-implementation-notes.md`

## SDK Generation Result

Commands run:

- `pnpm generate:openapi`: passed, wrote `openapi.json`.
- `pnpm generate:sdk`: passed, generated public fixture DTOs and organizer publish/unpublish SDK methods.

Generated method names used:

- `discoveryControllerFindTournamentFixtures`
- `organizerFixturesControllerPublishFixtureResults`
- `organizerFixturesControllerUnpublishFixtureResults`

## Validation Commands And Results

- `pnpm --filter @matchflow/backend prisma:generate`: passed.
- `pnpm --filter @matchflow/backend typecheck`: passed.
- `pnpm --filter @matchflow/backend lint`: passed.
- `pnpm --filter @matchflow/backend build`: passed.
- `pnpm --filter @matchflow/frontend lint`: passed.
- `pnpm --filter @matchflow/frontend build`: passed.
- `pnpm --filter @matchflow/frontend typecheck`: initially failed before `.next/types` existed, then passed after `next build` generated route types.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm build`: passed.

## Smoke Test Results

Smoke was run against the local backend on `http://127.0.0.1:3010` using seeded users:

- `organizer@matchflow.local` / `OrganizerPass123!`
- `player@matchflow.local` / `PlayerPass123!`

The smoke script used organizer APIs only and did not perform direct database edits.

Passed checks:

- logged in as seeded organizer and player
- found a seeded published organizer tournament
- confirmed draft tournament fixtures return `404` publicly
- created an isolated category and manual participants
- generated a knockout fixture set
- updated match schedule
- completed a match with generic scores
- confirmed fixture set is hidden from public endpoint before publishing
- published fixture/results
- confirmed public endpoint returns the fixture set
- confirmed public payload excludes `email`, `phone`, `notes`, `result_notes`, `payment`, and `audit` markers
- confirmed player cannot call organizer publish endpoint (`403`)
- confirmed player registration list still returns successfully
- unpublished fixture/results
- confirmed fixture set is hidden again publicly
- archived fixture set
- confirmed archived fixture set cannot be published (`400`)
- confirmed public tournament discovery still responds

## Known Limitations

- Public fixtures/results are embedded on `/tournaments/[slug]`; there is no dedicated public fixture-set detail page yet.
- Result notes remain private. There is no public result note field.
- Publishing does not send notifications.
- Audit records are the notification-ready integration point; no outbox table exists yet.
- Public standings use the generic Phase 6 scoring model and simple tiebreakers only.
- Public display is read-only and does not support live updates or polling beyond React Query refresh behavior.

## Deferred Items

- Real notification delivery and templates.
- Notification outbox/worker if needed.
- Dedicated public fixtures/results route if the detail page becomes too dense.
- Public-facing sport-specific score formatting.
- Admin moderation and organizer verification workflows.
- Public result SEO metadata beyond the existing tournament detail metadata.

## Recommended Next Phase

Phase 8 should focus on polish, testing, deployment readiness, and hardening:

- expand E2E coverage for public discovery, registration, organizer CRUD, roster, fixture, scoring, and result publishing
- add regression tests around public privacy rules
- improve responsive polish for dense fixture/standings tables
- add production readiness notes for migrations, seed behavior, environment variables, and Docker Compose
- decide whether notifications need an outbox model before implementing providers

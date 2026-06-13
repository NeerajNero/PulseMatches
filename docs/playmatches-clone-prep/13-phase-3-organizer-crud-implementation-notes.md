# Phase 3 Organizer CRUD Implementation Notes

## Summary

Phase 3 adds organizer-owned tournament setup without expanding into teams, fixtures, scoring, notifications, real payments, admin moderation, or registration approval workflows.

Implemented:

- Authenticated organizer dashboard summary.
- Organizer-owned tournament list, create, edit, publish, and unpublish APIs.
- Draft-first tournament creation.
- Verified-organizer-only publish enforcement.
- Category/event management for tournament setup.
- Next.js organizer dashboard and tournament management pages.
- React Query hooks backed by the regenerated `typescript-fetch` SDK.

Preserved:

- Public discovery remains limited to published public tournaments.
- Player registration APIs and account registration pages remain unchanged.
- Payments remain offline/manual only.

## Schema And Migration

No Prisma schema changes were required.

The existing schema already had the Phase 3 primitives:

- `Tournament.status` with `DRAFT`, `PUBLISHED`, `ARCHIVED`, `BLOCKED`.
- `Tournament.visibility`.
- `Tournament.publishedAt`.
- `Tournament.organizerProfileId`.
- `OrganizerProfile.verificationStatus`.
- `TournamentCategory`.
- `Registration` relations for registration counts and category delete safety checks.

Migration created: none.

Commands run:

- `pnpm --filter @matchflow/backend prisma:generate` - passed.

## Backend Changes

Added organizer tournament DB layer:

- `apps/backend/src/db/organizer-tournaments/organizer-tournaments.repository.ts`
- `apps/backend/src/db/organizer-tournaments/organizer-tournaments-db.service.ts`
- `apps/backend/src/db/organizer-tournaments/organizer-tournaments-db.module.ts`

Added organizer tournament API layer:

- `apps/backend/src/api/organizer-tournaments/dto/organizer-tournament.dto.ts`
- `apps/backend/src/api/organizer-tournaments/organizer-tournaments.transform.ts`
- `apps/backend/src/api/organizer-tournaments/organizer-tournaments.service.ts`
- `apps/backend/src/api/organizer-tournaments/organizer-tournaments.controller.ts`
- `apps/backend/src/api/organizer-tournaments/organizer-tournaments.module.ts`

Updated:

- `apps/backend/src/app.module.ts`

Behavior:

- All organizer management endpoints require JWT auth and the existing `ORGANIZER` role.
- Endpoints require an existing `OrganizerProfile`.
- Organizers can manage only tournaments owned by their organizer profile.
- Tournament create always creates `DRAFT` tournaments.
- Slugs are generated from the title and kept stable on edit.
- Publishing requires `OrganizerProfile.verificationStatus === VERIFIED`.
- Publishing also requires valid tournament dates and at least one active category.
- Unpublishing is blocked when the tournament has active `PENDING` or `CONFIRMED` registrations.
- Category delete is implemented as soft deactivation to `INACTIVE`.
- Category deletion/deactivation is blocked when the category has active registrations.
- Audit logs are written for tournament create/update/publish/unpublish and category create/update/delete actions.

## Backend Endpoints Added

- `GET /organizer/dashboard`
- `GET /organizer/tournaments`
- `POST /organizer/tournaments`
- `GET /organizer/tournaments/:id`
- `PATCH /organizer/tournaments/:id`
- `PATCH /organizer/tournaments/:id/publish`
- `PATCH /organizer/tournaments/:id/unpublish`
- `GET /organizer/tournaments/:id/categories`
- `POST /organizer/tournaments/:id/categories`
- `PATCH /organizer/tournaments/:id/categories/:categoryId`
- `DELETE /organizer/tournaments/:id/categories/:categoryId`

No public write endpoints were added.

## Frontend Changes

Added organizer routes:

- `apps/frontend/app/organizer/page.tsx`
- `apps/frontend/app/organizer/dashboard/page.tsx`
- `apps/frontend/app/organizer/tournaments/page.tsx`
- `apps/frontend/app/organizer/tournaments/new/page.tsx`
- `apps/frontend/app/organizer/tournaments/[id]/edit/page.tsx`
- `apps/frontend/app/organizer/tournaments/[id]/categories/page.tsx`

Added organizer UI components:

- `apps/frontend/components/custom/organizer/organizer-shell.tsx`
- `apps/frontend/components/custom/organizer/organizer-dashboard-view.tsx`
- `apps/frontend/components/custom/organizer/organizer-tournament-list-view.tsx`
- `apps/frontend/components/custom/organizer/organizer-tournament-form.tsx`
- `apps/frontend/components/custom/organizer/organizer-tournament-create-view.tsx`
- `apps/frontend/components/custom/organizer/organizer-tournament-editor-view.tsx`
- `apps/frontend/components/custom/organizer/organizer-category-manager-view.tsx`
- `apps/frontend/components/custom/organizer/organizer-format.ts`

Added organizer hooks:

- `apps/frontend/hooks/use-organizer-tournaments.ts`

Updated shared frontend wiring:

- `apps/frontend/lib/apis/api.ts`
- `apps/frontend/lib/apis/api-error.ts`
- `apps/frontend/hooks/use-registrations.ts`
- `apps/frontend/utils/query-constants.ts`
- `apps/frontend/utils/routes.ts`
- `apps/frontend/styles/globals.css`

Frontend behavior:

- `/organizer` and `/organizer/dashboard` show summary cards and recent owned tournaments.
- `/organizer/tournaments` lists owned tournaments with status, sport, city, dates, registration counts, and actions.
- `/organizer/tournaments/new` creates a draft tournament.
- `/organizer/tournaments/[id]/edit` edits tournament setup and exposes publish/unpublish actions.
- `/organizer/tournaments/[id]/categories` manages categories/events for one owned tournament.
- Organizer pages use the existing auth profile pattern and show clear unauthenticated, unauthorized, loading, empty, error, and success states.

## SDK Generation

Commands run:

- `pnpm generate:openapi` - passed.
- `pnpm generate:sdk` - passed.

Generated SDK additions include:

- `libs/client_sdk/apis/OrganizerTournamentsApi.ts`
- `libs/client_sdk/models/CreateOrganizerTournamentRequestDto.ts`
- `libs/client_sdk/models/UpdateOrganizerTournamentRequestDto.ts`
- `libs/client_sdk/models/CreateTournamentCategoryRequestDto.ts`
- `libs/client_sdk/models/UpdateTournamentCategoryRequestDto.ts`
- `libs/client_sdk/models/OrganizerDashboardDto.ts`
- `libs/client_sdk/models/OrganizerTournamentDto.ts`
- `libs/client_sdk/models/OrganizerTournamentListResponseDto.ts`
- related response DTOs and docs under `libs/client_sdk/docs/`.

## Validation Commands

Passed:

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
- `pnpm generate:openapi`
- `pnpm generate:sdk`

## Smoke Checks

Smoke checks were run against a local backend on `http://127.0.0.1:3010` with seeded users:

- `organizer@matchflow.local` / `OrganizerPass123!`
- `player@matchflow.local` / `PlayerPass123!`

Results:

- Organizer login returned `201`.
- `GET /organizer/dashboard` returned `200`.
- `POST /organizer/tournaments` created a draft tournament.
- `PATCH /organizer/tournaments/:id` updated the draft title.
- `POST /organizer/tournaments/:id/categories` created an active category.
- `PATCH /organizer/tournaments/:id/categories/:categoryId` updated category capacity.
- `PATCH /organizer/tournaments/:id/publish` returned `403` for the seeded unverified organizer, as expected.
- Public search for the draft returned zero results, confirming drafts stay out of discovery.
- `DELETE /organizer/tournaments/:id/categories/:categoryId` deactivated the category.
- Player access to an organizer tournament endpoint returned `403`.
- Existing public detail route `/tournaments/bengaluru-shuttle-open` returned `200`.

Publish success was not smoke-tested because the seeded organizer is intentionally `PENDING`, and no direct local database mutation was used to mark the organizer verified.

## Known Limitations

- Organizer verification management is not implemented. Only existing verification status is enforced.
- Organizer approval or rejection of player registrations is deferred.
- Tournament delete/archive is not exposed in Phase 3.
- Category delete is soft deactivation, not hard deletion.
- Published tournament unpublish is blocked only when active registrations exist. Broader operational rules can be added in later phases.
- Venue selection is not deeply managed on the frontend beyond existing catalog support.
- Image upload and cover media management are deferred.
- No team, roster, fixture, bracket, schedule, score, notification, or real payment behavior was added.

## Deferred To Later Phases

- Phase 4: teams, players, event roster management, and organizer registration review if selected.
- Phase 5: fixture generation and match scheduling.
- Phase 6: scoring and results.
- Phase 7: notifications and payment-provider integrations, if still required.

## Recommended Next Phase

Phase 4 should implement teams and player/event participant management on top of the organizer-owned tournament and category setup created here. It should reuse the ownership checks and current organizer route structure.

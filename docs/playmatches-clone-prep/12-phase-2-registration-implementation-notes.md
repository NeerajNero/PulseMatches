# Phase 2 Registration Implementation Notes

## Summary

Implemented authenticated player tournament registration for the MatchFlow Arena tournament discovery experience.

This phase stays within the requested Phase 2 scope:

- authenticated player-only registration
- tournament category registration when categories exist
- tournament-level registration when no categories exist
- offline/manual payment status only
- current-player registration listing
- pending registration cancellation

No real payment provider, teams, fixtures, scoring, notifications, admin moderation, or organizer tournament CRUD was added.

## Schema And Migration

Updated `apps/backend/prisma/schema.prisma` with:

- `RegistrationStatus`
  - `PENDING`
  - `CONFIRMED`
  - `REJECTED`
  - `CANCELLED`
- `RegistrationPaymentMode`
  - `OFFLINE`
  - `FREE`
- `RegistrationPaymentStatus`
  - `NOT_REQUIRED`
  - `PENDING_OFFLINE`
  - `PAID`
  - `FAILED`
  - `REFUNDED`
- `Registration`
  - `id`
  - `userId`
  - `tournamentId`
  - `tournamentCategoryId`
  - `status`
  - `paymentMode`
  - `paymentStatus`
  - `feeAmount`
  - `feeCurrency`
  - `playerName`
  - `phone`
  - `notes`
  - `registeredAt`
  - `cancelledAt`
  - `createdAt`
  - `updatedAt`

Relationships added:

- `User.registrations`
- `Tournament.registrations`
- `TournamentCategory.registrations`

Migration created:

- `apps/backend/prisma/migrations/20260608120000_006_player_registrations/migration.sql`

Indexes added:

- `user_id`
- `user_id, status`
- `tournament_id`
- `tournament_id, status`
- `tournament_category_id`
- `tournament_category_id, status`
- `status`

Duplicate active registration prevention is enforced in service logic for `PENDING` and `CONFIRMED` records. A DB-level partial unique index was not added because this repo’s Prisma schema style does not cleanly represent active-only uniqueness.

## Backend Endpoints

Added `apps/backend/src/api/registrations/`:

- `POST /tournaments/:slugOrId/registrations`
  - requires JWT auth
  - requires `PLAYER` role
  - creates a `PENDING` registration
  - requires category selection when active categories exist
  - validates category belongs to the tournament
  - validates registration open/closed windows
  - prevents duplicate active registrations
  - snapshots fee/payment mode as `FREE/NOT_REQUIRED` or `OFFLINE/PENDING_OFFLINE`
- `GET /me/registrations`
  - requires JWT auth
  - requires `PLAYER` role
  - returns the current player’s registrations with tournament/category summaries
- `GET /registrations/:id`
  - requires JWT auth
  - requires `PLAYER` role
  - returns only the current player’s registration
- `PATCH /registrations/:id/cancel`
  - requires JWT auth
  - requires `PLAYER` role
  - cancels only the current player’s own `PENDING` registration

Added backend DB layer:

- `apps/backend/src/db/registrations/registrations.repository.ts`
- `apps/backend/src/db/registrations/registrations-db.service.ts`
- `apps/backend/src/db/registrations/registrations-db.module.ts`

Wired `RegistrationsModule` into `apps/backend/src/app.module.ts`.

## Frontend Changes

Added generated-SDK-backed registration hooks:

- `apps/frontend/hooks/use-registrations.ts`
  - `useMyRegistrations`
  - `useCreateRegistration`
  - `useCancelRegistration`
  - `getApiErrorMessage`

Updated API client:

- `apps/frontend/lib/apis/api.ts`
  - added `RegistrationsApi`

Updated query/route constants:

- `apps/frontend/utils/query-constants.ts`
- `apps/frontend/utils/route.ts`

Added UI components:

- `apps/frontend/components/custom/registrations/registration-panel.tsx`
- `apps/frontend/components/custom/registrations/registration-list.tsx`

Updated tournament detail page UI:

- `apps/frontend/components/custom/tournaments/tournament-detail-view.tsx`
  - hero CTA now links to the registration section
  - categories section reflects active registration availability
  - detail page renders the authenticated registration panel

Added player account routes:

- `apps/frontend/app/account/page.tsx`
- `apps/frontend/app/account/registrations/page.tsx`

Updated global styles:

- `apps/frontend/styles/globals.css`
  - registration panel
  - registration form
  - registration list
  - success state
  - responsive layout

## Routes Now Available

Existing public Phase 1 routes remain available:

- `/`
- `/tournaments`
- `/tournaments/[slug]`
- `/sports/[sport]`
- `/locations/[city]`
- `/about`
- `/contact`
- `/privacy`
- `/terms`

Phase 2 account routes:

- `/account`
- `/account/registrations`

## SDK Generation

OpenAPI and SDK were regenerated with existing repo commands:

- `pnpm generate:openapi`
- `pnpm generate:sdk`

Generated SDK additions include:

- `libs/client_sdk/apis/RegistrationsApi.ts`
- `libs/client_sdk/models/CreateRegistrationRequestDto.ts`
- `libs/client_sdk/models/RegistrationDto.ts`
- `libs/client_sdk/models/RegistrationApiResponseDto.ts`
- `libs/client_sdk/models/RegistrationListApiResponseDto.ts`
- `libs/client_sdk/models/RegistrationCategorySummaryDto.ts`
- `libs/client_sdk/models/RegistrationTournamentSummaryDto.ts`
- corresponding generated docs under `libs/client_sdk/docs/`

`openapi.json` was refreshed locally. It remains ignored by `.gitignore`.

## Validation Commands

Successful:

- `pnpm --filter @matchflow/backend prisma:generate`
- `pnpm local:infra:up`
- `pnpm --filter @matchflow/backend prisma:migrate`
- `pnpm --filter @matchflow/backend build`
- `pnpm generate:openapi`
- `pnpm generate:sdk`
- `pnpm --filter @matchflow/backend typecheck`
- `pnpm --filter @matchflow/backend lint`
- `pnpm --filter @matchflow/frontend typecheck`
- `pnpm --filter @matchflow/frontend lint`
- `pnpm --filter @matchflow/frontend build`
- `pnpm typecheck`
- `pnpm lint`

Backend smoke results against local seed data:

- `GET /tournaments?limit=20`: `200`, found 5 tournaments
- `POST /auth/signup`: `201`
- `POST /tournaments/:slug/registrations`: `201`, returned `pending` with `pending_offline`
- `GET /me/registrations`: `200`, returned 1 registration
- `PATCH /registrations/:id/cancel`: `200`, returned `cancelled`

Failures and environment notes:

- First `pnpm local:infra:up` attempt failed because sandboxed Docker socket access was blocked. Reran with escalation and it succeeded.
- First localhost API smoke attempt failed with `connect EPERM 127.0.0.1:3010` from sandboxed localhost networking. Reran with escalation and it succeeded.
- `git status` and `git diff --stat` failed because this directory is not currently a Git worktree.

## Known Limitations

- Duplicate active registration prevention is service-level, not DB-level. Concurrent duplicate requests could still race until a future partial unique index strategy is adopted.
- Capacity checks are service-level counts and are not locked transactionally.
- Payment is offline/manual only. No payment instructions workflow, receipts, refunds, or gateway integration exists.
- Registration approval/rejection remains deferred to a later organizer/admin phase.
- Cancellation is limited to `PENDING` registrations and does not handle refunds or organizer review.
- Account route auth uses client-side redirect, consistent with the existing `/me` page pattern.
- The registration panel only supports player-role users; organizer/admin access to registrations is intentionally not implemented.

## Deferred Items

- Organizer approval/rejection workflow
- Organizer registration roster view
- Registration export
- Team/player roster management
- Fixture generation
- Match scheduling
- Manual scoring/result entry
- Notifications/email
- Real payment provider integration
- Admin moderation

## Recommended Next Phase

Proceed to Phase 3: organizer dashboard and tournament CRUD.

Recommended focus:

- organizer tournament list/create/edit flow
- draft/publish permissions
- organizer-owned tournament access control
- public publishing guard for unverified organizers
- category management UI/API that builds on the existing `TournamentCategory` model

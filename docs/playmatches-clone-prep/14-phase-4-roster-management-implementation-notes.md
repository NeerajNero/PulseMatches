# Phase 4 Roster Management Implementation Notes

## Summary

Phase 4 adds organizer-managed tournament rosters without adding fixtures, brackets, scoring, notifications, real payments, or admin moderation.

Implemented capabilities:

- Organizer registration review for owned tournaments.
- Organizer approve, reject, and cancel actions for player registrations.
- Automatic participant creation when a registration is approved.
- Manual participant creation and management.
- Team creation and management for team-style categories.
- Team member management using existing participants or manual member details.
- Roster summary counts and capacity usage for organizer setup workflows.

Public discovery, player self-registration, and organizer tournament/category CRUD remain preserved.

## Schema And Model Changes

Updated `apps/backend/prisma/schema.prisma`.

New enums:

- `ParticipantSource`
  - `REGISTRATION`
  - `MANUAL`
- `RosterParticipantStatus`
  - `ACTIVE`
  - `WITHDRAWN`
  - `DISQUALIFIED`
- `TeamStatus`
  - `ACTIVE`
  - `WITHDRAWN`
  - `DISQUALIFIED`
- `TeamMemberRole`
  - `CAPTAIN`
  - `PLAYER`
  - `SUBSTITUTE`

New models:

- `Participant`
  - Links tournament rosters to a registration, user, category, or manual participant record.
  - Supports registration-backed and manual participants.
  - Soft removal is represented by `WITHDRAWN`.
- `Team`
  - Represents a team in a tournament/category.
  - Supports optional `seed` for later fixture generation.
  - Soft removal is represented by `WITHDRAWN`.
- `TeamMember`
  - Represents a member inside a team.
  - Can reference an existing participant or store manual member details.
  - Supports `CAPTAIN`, `PLAYER`, and `SUBSTITUTE` roles.

Relationships added:

- `Tournament.participants`
- `Tournament.teams`
- `TournamentCategory.participants`
- `TournamentCategory.teams`
- `Registration.participant`
- `User.participants`
- `User.teamMembers`

Important constraints and indexes:

- `Participant.registrationId` is unique to prevent duplicate participant rows for one registration.
- `Team` has a uniqueness constraint on tournament, category, and name.
- `TeamMember` has a uniqueness constraint on team and participant.
- Indexes were added for tournament, category, registration, user, team, and roster status lookups.

## Migration

Migration created and applied locally:

- `apps/backend/prisma/migrations/20260608140000_007_roster_management/migration.sql`

Command result:

- `pnpm --filter @matchflow/backend prisma:migrate` passed.

No destructive migration or database reset was run.

## Backend Endpoints Added

All endpoints require JWT auth, organizer role, an organizer profile, and ownership of the tournament.

Roster summary:

- `GET /organizer/tournaments/:id/roster-summary`

Registration management:

- `GET /organizer/tournaments/:id/registrations`
- `PATCH /organizer/tournaments/:id/registrations/:registrationId/approve`
- `PATCH /organizer/tournaments/:id/registrations/:registrationId/reject`
- `PATCH /organizer/tournaments/:id/registrations/:registrationId/cancel`

Participant management:

- `GET /organizer/tournaments/:id/participants`
- `POST /organizer/tournaments/:id/participants`
- `PATCH /organizer/tournaments/:id/participants/:participantId`
- `DELETE /organizer/tournaments/:id/participants/:participantId`

Team management:

- `GET /organizer/tournaments/:id/teams`
- `POST /organizer/tournaments/:id/teams`
- `GET /organizer/tournaments/:id/teams/:teamId`
- `PATCH /organizer/tournaments/:id/teams/:teamId`
- `DELETE /organizer/tournaments/:id/teams/:teamId`

Team member management:

- `POST /organizer/tournaments/:id/teams/:teamId/members`
- `PATCH /organizer/tournaments/:id/teams/:teamId/members/:memberId`
- `DELETE /organizer/tournaments/:id/teams/:teamId/members/:memberId`

Backend files added:

- `apps/backend/src/api/organizer-rosters/dto/organizer-roster.dto.ts`
- `apps/backend/src/api/organizer-rosters/organizer-rosters.controller.ts`
- `apps/backend/src/api/organizer-rosters/organizer-rosters.module.ts`
- `apps/backend/src/api/organizer-rosters/organizer-rosters.service.ts`
- `apps/backend/src/api/organizer-rosters/organizer-rosters.transform.ts`
- `apps/backend/src/db/organizer-rosters/organizer-rosters-db.module.ts`
- `apps/backend/src/db/organizer-rosters/organizer-rosters-db.service.ts`
- `apps/backend/src/db/organizer-rosters/organizer-rosters.repository.ts`

Backend files changed:

- `apps/backend/src/app.module.ts`
- `apps/backend/prisma/schema.prisma`

## Backend Behavior

Registration approval:

- Approves only pending registrations unless the registration is already confirmed with a participant.
- Updates registration status to `CONFIRMED`.
- Creates or reactivates a linked `Participant`.
- Enforces category capacity where the current category schema provides capacity.

Registration rejection:

- Rejects pending registrations.
- Leaves the registration record in place.
- Records optional rejection reason in audit log only.

Organizer cancellation:

- Cancels pending or confirmed registrations.
- Sets `cancelledAt`.
- Withdraws linked participant, if present.
- Does not implement refunds or payment changes.

Manual participants:

- Created with `source=MANUAL` and `status=ACTIVE`.
- Can be edited and soft-withdrawn.
- Registration-backed participant identity fields are protected from unsafe edits.

Teams:

- Can be created for tournament-level rosters or team-style categories.
- Singles categories are blocked for team creation.
- Active duplicate team names are blocked within the same tournament/category.
- Team deletion soft-withdraws the team.

Team members:

- Can be added from an existing active participant.
- Can also be added as manual member details.
- Participant-backed member identity is protected from unsafe edits.
- Removing a team member removes the membership only, not the participant.

## Frontend Routes Added

New organizer routes:

- `/organizer/tournaments/[id]/registrations`
- `/organizer/tournaments/[id]/participants`
- `/organizer/tournaments/[id]/teams`
- `/organizer/tournaments/[id]/teams/[teamId]`

Existing organizer setup routes remain available:

- `/organizer`
- `/organizer/dashboard`
- `/organizer/tournaments`
- `/organizer/tournaments/new`
- `/organizer/tournaments/[id]/edit`
- `/organizer/tournaments/[id]/categories`

## Frontend Components And Hooks Added

New hooks:

- `useOrganizerRosterSummary`
- `useOrganizerRegistrations`
- `useApproveRegistration`
- `useRejectRegistration`
- `useCancelOrganizerRegistration`
- `useOrganizerParticipants`
- `useCreateParticipant`
- `useUpdateParticipant`
- `useDeleteParticipant`
- `useOrganizerTeams`
- `useOrganizerTeam`
- `useCreateTeam`
- `useUpdateTeam`
- `useDeleteTeam`
- `useCreateTeamMember`
- `useUpdateTeamMember`
- `useDeleteTeamMember`

New component files:

- `apps/frontend/components/custom/organizer/organizer-tournament-management-nav.tsx`
- `apps/frontend/components/custom/organizer/organizer-registration-management-view.tsx`
- `apps/frontend/components/custom/organizer/organizer-participant-management-view.tsx`
- `apps/frontend/components/custom/organizer/organizer-team-management-view.tsx`
- `apps/frontend/components/custom/organizer/organizer-team-detail-view.tsx`

New page files:

- `apps/frontend/app/organizer/tournaments/[id]/registrations/page.tsx`
- `apps/frontend/app/organizer/tournaments/[id]/participants/page.tsx`
- `apps/frontend/app/organizer/tournaments/[id]/teams/page.tsx`
- `apps/frontend/app/organizer/tournaments/[id]/teams/[teamId]/page.tsx`

Frontend files changed:

- `apps/frontend/lib/apis/api.ts`
- `apps/frontend/utils/query-constants.ts`
- `apps/frontend/utils/route.ts`
- `apps/frontend/styles/globals.css`
- `apps/frontend/hooks/use-organizer-rosters.ts`
- `apps/frontend/components/custom/organizer/organizer-tournament-list-view.tsx`
- `apps/frontend/components/custom/organizer/organizer-tournament-editor-view.tsx`
- `apps/frontend/components/custom/organizer/organizer-category-manager-view.tsx`

## SDK Generation

OpenAPI and SDK generation succeeded after starting the backend with the Phase 4 code.

Commands:

- `pnpm generate:openapi`
- `pnpm generate:sdk`

Generated SDK now includes `OrganizerRostersApi` and roster DTO models.

Earlier in the process, `pnpm generate:openapi` failed with `ECONNREFUSED 127.0.0.1:3010` because the backend was not running. That was corrected by rebuilding and starting the backend, then regenerating OpenAPI and SDK successfully.

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

Tests were not run as a separate suite because the validation path for this repo centered on package typecheck, lint, build, Prisma generation/migration, OpenAPI generation, SDK generation, and API smoke checks.

## Smoke Test Results

Local API smoke checks were run through the running backend and passed after using an open-registration seeded tournament.

Validated:

- Organizer login.
- Public tournament detail still returns successfully.
- Temporary player signup.
- Player registration creation.
- Organizer registration list.
- Approval of pending registration.
- Participant creation from approval.
- Manual participant creation.
- Manual participant update.
- Team creation.
- Adding approved participant as team captain.
- Adding manual team member.
- Updating team member role/details.
- Removing a team member.
- Team detail retrieval.
- Soft-withdrawing a team.
- Player access to organizer participant endpoint returns `403`.
- Rejecting a second pending registration.
- Public tournament discovery still returns published tournament data.

The smoke check created temporary local development users and roster rows via public/backend APIs. No direct unsafe database edits were used.

## Known Limitations

- Capacity checks are service-level checks. They are suitable for this MVP but are not full concurrent row-lock capacity enforcement.
- Waitlists are deferred.
- Registration rejection reason is written to audit logs only; no dedicated rejection reason field was added.
- Public roster display is deferred.
- Team delete and participant delete are soft-withdraw actions.
- Team member removal deletes only the membership row.
- No fixture, bracket, scheduling, scoring, live result, notification, real payment, or admin moderation behavior was added.
- Team name duplicate prevention exists through schema constraints and service checks, but case-insensitive uniqueness is enforced in service logic rather than a dedicated database expression index.

## Deferred Items

Later phases should add:

- Fixture generation from active participants and active teams.
- Match scheduling.
- Generic manual scoring/result entry.
- Optional notification jobs after status changes.
- Optional waitlist policy.
- Stronger transactional capacity locking if the app needs high-volume approvals.
- Public roster/result display only after fixture/result design is finalized.

## Recommended Next Phase

Phase 5 should implement fixture generation and match scheduling using the active `Participant` and `Team` records created in Phase 4.

Recommended scope:

- Generate knockout and round-robin fixture structures.
- Keep scoring/results out of scope until Phase 6.
- Use active participants/teams only.
- Prevent fixture generation for withdrawn/disqualified roster entries.
- Preserve organizer ownership and role checks for all fixture operations.

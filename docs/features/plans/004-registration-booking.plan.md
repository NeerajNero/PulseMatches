# 004 Registration Booking Plan

## Status

- Status: needs-approval
- Feature slug: 004-registration-booking
- Source stories: P-003, O-003
- Classification: risky because it changes transactional business data and future payment boundaries
- Lane: risky
- Created: 2026-05-26
- Last updated: 2026-05-26

## Scope

In scope:

- Player registration for tournament categories.
- Team container for singles/doubles/team sports.
- Registration statuses: pending, confirmed, cancelled.
- Organizer manual player/team additions.
- Payment placeholder fields only.
- Audit logs for registration status changes.

Out of scope:

- Real payment gateway.
- Refunds.
- Waiting lists.
- Team invitations.
- Notifications.

## Data Model Impact

- Add `registrations`, `teams`, `team_members`, and `registration_payment_intents` placeholder if approved.
- Store category fee snapshot.
- Enforce category capacity in service logic, with DB constraints where practical.
- Add indexes for user registration history and organizer/category registration views.

## API Routes

- `POST /registrations`
- `GET /me/registrations`
- `GET /organizer/tournaments/:id/registrations`
- `POST /organizer/tournament-categories/:id/registrations`
- `PATCH /organizer/registrations/:id/status`

## Frontend Routes/Screens

- Tournament detail registration panel.
- `/me/registrations`
- `/organizer/tournaments/[id]/registrations`

## Permissions

- Player role required for self-registration.
- Organizer role required for owned tournament registration management.
- Admin may read registrations for moderation/support in later admin scope.

## OpenAPI/SDK Impact

- Add registration request/response DTOs.
- Regenerate SDK.
- Add hooks for player and organizer registration flows.

## Background Jobs Impact

- None in MVP.
- Later notifications should use queues.

## Verification Commands

- `pnpm local:up`
- `pnpm --filter @matchflow/backend prisma:migrate`
- `pnpm --filter @matchflow/backend build`
- `pnpm generate:sdk`
- `pnpm --filter @matchflow/frontend build`

## Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Capacity race conditions. | Overbooking. | Use transactions and row locks where needed. |
| Payment placeholder confused with real payment. | Incorrect user expectations. | Label clearly and avoid provider behavior until approved. |

## Open Questions

| ID | Question | Blocking |
| --- | --- | --- |
| REG-001 | Should registration default to pending or confirmed when no payment is required? | yes |
| REG-002 | Should guests register, or must every participant have an account? | yes |

## Implementation Order

1. Confirm auth, discovery, and organizer tournament slices are complete.
2. Add migration for registrations and teams.
3. Add transactional backend services.
4. Regenerate SDK.
5. Add player and organizer screens.
6. Verify status changes and capacity behavior.

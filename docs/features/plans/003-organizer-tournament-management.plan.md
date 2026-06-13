# 003 Organizer Tournament Management Plan

## Status

- Status: needs-approval
- Feature slug: 003-organizer-tournament-management
- Source stories: O-001, O-002, A-001
- Classification: risky because it depends on auth, permissions, schema, SDK, and organizer workflows
- Lane: risky
- Created: 2026-05-26
- Last updated: 2026-05-26

## Scope

In scope:

- Organizer profile creation and update.
- Organizer dashboard shell.
- Tournament draft create/edit.
- Category create/edit.
- Venue and schedule assignment.
- Publish/unpublish lifecycle with audit logs.

Out of scope:

- Player registration.
- Fixture generation.
- Scoring.
- Payment collection.
- Bulk upload/import.
- Advanced verification automation.

## Data Model Impact

- Requires `users`, `user_roles`, `organizer_profiles`, `venues`, `tournaments`, `tournament_categories`, and `audit_logs`.
- Add publish fields: `status`, `published_at`, `unpublished_at`.
- Add verification status fields for organizer/tournament trust indicators.

## API Routes

- `GET /organizer/profile`
- `POST /organizer/profile`
- `PATCH /organizer/profile`
- `GET /organizer/tournaments`
- `POST /organizer/tournaments`
- `PATCH /organizer/tournaments/:id`
- `POST /organizer/tournaments/:id/publish`
- `POST /organizer/tournaments/:id/unpublish`
- `POST /organizer/tournaments/:id/categories`
- `PATCH /organizer/tournament-categories/:id`

## Frontend Routes/Screens

- `/organizer`
- `/organizer/profile`
- `/organizer/tournaments`
- `/organizer/tournaments/new`
- `/organizer/tournaments/[id]/edit`

## Permissions

- Organizer role required for organizer routes.
- Organizers can only manage their own tournaments.
- Admin can verify but should not silently impersonate organizer operations.

## OpenAPI/SDK Impact

- Add organizer profile, tournament draft, publish, and category DTOs.
- Regenerate SDK.
- Add organizer API wrappers and hooks.

## Background Jobs Impact

- None for MVP, unless publish notifications are explicitly approved later.

## Verification Commands

- `pnpm local:up`
- `pnpm --filter @matchflow/backend prisma:migrate`
- `pnpm --filter @matchflow/backend build`
- `pnpm generate:sdk`
- `pnpm --filter @matchflow/frontend build`

## Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Auth/roles missing. | Organizer routes cannot be protected. | Implement only after Slice 2. |
| Publish rules unclear. | Invalid public tournaments. | Add validation for required venue, dates, categories, and status. |

## Open Questions

| ID | Question | Blocking |
| --- | --- | --- |
| ORG-001 | Can unverified organizers publish public tournaments? | yes |
| ORG-002 | What minimum fields are required before publish? | yes |

## Implementation Order

1. Confirm auth slice is complete.
2. Add/extend schema and migration.
3. Add backend organizer modules.
4. Regenerate SDK.
5. Add organizer dashboard screens and hooks.
6. Verify permission boundaries and publish lifecycle.

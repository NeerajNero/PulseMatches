# Feature Memory

## Durable Product Decisions

- Temporary product name: MatchFlow Arena.
- Public reference source: Playmatches public pages, used only for feature discovery.
- MVP users: player, organizer, admin.
- First implementation scope: Slice 1 foundation only.
- Auth foundation uses multi-role users through `user_roles`; player and organizer are selectable during MVP signup, while admin is seeded for local/dev use.
- Payment gateway, live scoring, notifications, and advanced analytics are deferred.

## Feature Flow State

- Discovery completed from public Playmatches pages and starter-pack docs.
- Plans created for five MVP slices.
- `001-project-foundation` has been implemented and verified.
- `002a-auth-and-roles` has been implemented and verified.
- `002-public-tournament-discovery` has been implemented and verified.
- Later slices remain unimplemented and require explicit approval.

## Future Agent Notes

- Slice 3 data model planning is captured in docs but should not be implemented until approved.
- Generated SDK wrappers should exist before any frontend feature calls backend routes.
- Auth and roles must land before organizer/admin protected routes.
- Public tournament discovery now has read-only public APIs and frontend routes. Organizer tournament create/edit remains unimplemented until Slice 003.

## Auth Foundation

- Auth tables: `users`, `user_roles`, `organizer_profiles`, `refresh_tokens`, and `audit_logs`.
- MVP selectable signup roles: `player` and `organizer`.
- Local/dev seed users are created by `pnpm --filter @matchflow/backend db:seed`.
- Protected backend routes use `JwtAuthGuard`; organizer routes also use `RolesGuard` with `RoleType.ORGANIZER`.
- Frontend auth routes are `/login`, `/signup`, `/me`, and `/organizer`.

## Public Tournament Discovery

- Discovery tables: `sports`, `cities`, `venues`, `tournaments`, `tournament_categories`, and `tournament_media`.
- Public APIs: `GET /sports`, `GET /cities`, `GET /tournaments`, and `GET /tournaments/:slugOrId`.
- Tournament detail lookup is slug-first with UUID fallback.
- Public listing and detail expose only `PUBLISHED` tournaments with `PUBLIC` visibility.
- Draft, archived, blocked, private, and unlisted tournaments are excluded from public discovery.
- Unverified organizer tournaments can appear when published/public; `verification_status` is returned for future trust UI.
- Frontend discovery routes are `/tournaments` and `/tournaments/[slug]`, backed by generated SDK calls and React Query hooks.
- Seed data includes 5 sports, 5 cities, 5 venues, 5 published tournaments, and 3 excluded non-public tournament states for smoke tests.

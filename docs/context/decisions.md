# Decisions

| ID | Date | Decision | Rationale | Status |
| --- | --- | --- | --- | --- |
| D-001 | 2026-05-26 | Use MatchFlow Arena as temporary product name. | Satisfies legal/product rule to avoid Playmatches branding. | accepted |
| D-002 | 2026-05-26 | Use pnpm workspaces instead of Nx/Turborepo for the initial foundation. | Keeps Slice 1 lean while preserving monorepo boundaries. | accepted |
| D-003 | 2026-05-26 | Use `apps/backend`, `apps/frontend`, `apps/documentation`, and `libs/client_sdk`. | Matches starter-pack default shape for web-first full-stack apps. | accepted |
| D-004 | 2026-05-26 | Include Redis in Docker from day one, but defer BullMQ modules. | Future notifications, scoring events, and analytics jobs will need Redis, but no queue is required in Slice 1. | accepted |
| D-005 | 2026-05-26 | Plan the tournament data model now, but do not implement tournament feature code in Slice 1. | Avoids rework while respecting the approved implementation boundary. | accepted |
| D-006 | 2026-05-26 | Defer real payments to a later explicitly approved slice. | MVP registration can use a placeholder payment state without gateway risk. | accepted |
| D-007 | 2026-05-26 | Model roles in a `user_roles` table instead of a single role column. | Users may need multiple roles, such as player plus organizer, without reshaping auth later. | accepted |
| D-008 | 2026-05-26 | Use JWT access tokens plus hashed refresh tokens for the MVP auth foundation. | This keeps auth simple, verifiable, and compatible with generated SDKs while avoiding plain refresh token storage. | accepted |
| D-009 | 2026-05-26 | Seed local/dev admin, player, and organizer users through an idempotent seed script, not migration data. | Seeds are environment convenience data and should not be mixed into schema history. | accepted |
| D-010 | 2026-05-26 | Public tournament detail lookup supports slug-first lookup and UUID fallback. | Human-readable URLs are preferred while UUID links remain stable for debugging and integrations. | accepted |
| D-011 | 2026-05-26 | Public discovery exposes only `PUBLISHED` tournaments with `PUBLIC` visibility. | Draft, archived, blocked, private, and unlisted tournaments must not leak through public APIs. | accepted |
| D-012 | 2026-05-26 | Unverified organizer tournaments may appear publicly when the tournament itself is published and public. | MVP keeps organizer verification as a trust signal in API responses rather than a hard visibility gate. | accepted |

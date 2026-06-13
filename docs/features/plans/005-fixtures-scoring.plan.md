# 005 Fixtures Scoring Plan

## Status

- Status: needs-approval
- Feature slug: 005-fixtures-scoring
- Source stories: P-004, O-004, O-005
- Classification: risky because it creates match-generation logic, scoring state, and public live/result views
- Lane: risky
- Created: 2026-05-26
- Last updated: 2026-05-26

## Scope

In scope:

- Fixture generation for knockout and round-robin categories.
- Persist fixture generation runs and matches.
- Organizer match scheduling with court/ground and time.
- Organizer score/result update.
- Public fixture and result display.
- Basic round-robin standings from completed results.

Out of scope:

- Real-time multi-device scoring.
- Sport-specific scoring engines beyond generic score snapshots.
- Ball-by-ball cricket scoring.
- Swimming/athletics heat timing.
- Live TV mode.
- Notifications.

## Data Model Impact

- Add `fixtures`, `matches`, `match_scores`, and `match_events`.
- Add lifecycle status fields for fixtures and matches.
- Store detailed event metadata in JSONB only where event schemas are sport-specific or evolving.
- Add audit logs for generation and score updates.

## API Routes

- `POST /organizer/tournament-categories/:id/fixtures/generate`
- `GET /tournaments/:id/fixtures`
- `PATCH /organizer/matches/:id/schedule`
- `PATCH /organizer/matches/:id/score`
- `GET /matches/:id`
- `GET /tournament-categories/:id/standings`

## Frontend Routes/Screens

- Public tournament detail fixtures/results tab.
- `/organizer/tournaments/[id]/fixtures`
- `/organizer/matches/[id]`

## Permissions

- Public read access for published fixtures/results.
- Organizer write access only for owned tournament matches.
- Admin moderation read access later.

## OpenAPI/SDK Impact

- Add fixture, match, score, and standings DTOs.
- Regenerate SDK.
- Add hooks and query keys for fixtures/results.

## Background Jobs Impact

- None for synchronous MVP generation.
- Later large generation, notifications, or live fan-out may use BullMQ.

## Verification Commands

- `pnpm local:up`
- `pnpm --filter @matchflow/backend prisma:migrate`
- `pnpm --filter @matchflow/backend build`
- `pnpm generate:sdk`
- `pnpm --filter @matchflow/frontend build`

## Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Fixture generation rules can become sport-specific quickly. | Rework. | Keep generator interfaces format-based and avoid hardcoding one sport. |
| Score updates need winner/standing consistency. | Incorrect public results. | Use transactions and derive standings from completed matches where possible. |

## Open Questions

| ID | Question | Blocking |
| --- | --- | --- |
| FIX-001 | Should fixtures be regeneratable after registrations are confirmed? | yes |
| FIX-002 | What score schema should be used for the first supported sport? | yes |

## Implementation Order

1. Confirm registrations slice is complete.
2. Design generator interfaces.
3. Add migration for fixtures and matches.
4. Implement backend generation and scoring services.
5. Regenerate SDK.
6. Add organizer and public fixture/result screens.
7. Verify knockout and round-robin sample categories.

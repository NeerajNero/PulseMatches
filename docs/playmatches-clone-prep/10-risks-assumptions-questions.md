# Risks, Assumptions, And Questions

## Assumptions

- MatchFlow Arena remains the product identity; Playmatches is only inspiration.
- The implementation should preserve the current monorepo, NestJS, Prisma, Next.js, React Query, and generated SDK stack.
- Backend routes should continue to use the current response envelope and Swagger DTO contract.
- Frontend API access should continue through generated SDK wrappers and hooks.
- Tournament categories are the registration/bookable event unit.
- Teams can represent singles, doubles, and team-sport participants.
- Payments should start as offline/manual or placeholder status until a real provider is explicitly approved.
- Redis is available for future queues but is not currently used by app code.
- Native mobile apps are out of scope for this repository unless explicitly added later.

## Blockers Before Coding

- Confirm whether generated build artifacts should stay in the repo:
  - `apps/backend/dist`
  - `apps/frontend/.next`
- Confirm whether route groups should be introduced before adding many pages.
- Confirm whether `/me` should remain the account route or redirect to `/account`.
- Confirm whether unverified organizers can publish public tournaments.
- Confirm minimum fields required before tournament publish.
- Confirm whether registration defaults to `PENDING` or `CONFIRMED` when no payment is required.
- Confirm whether guest registration is allowed or every participant must have an account.
- Confirm first supported scoring format/sport.
- Confirm whether online payments are in MVP or offline/manual only.

## Technical Risks

### Auth Security

Current frontend auth stores access and refresh tokens in `localStorage`. This is simple and works for the foundation, but production may require hardened token handling, refresh behavior, CSRF/XSS review, and session/device management.

### Permission Boundaries

Organizer tournament, registration, fixture, and scoring APIs must enforce ownership in backend services/repositories. Client-side redirects are not sufficient.

### Capacity Race Conditions

Registration capacity checks need transactions and, where needed, row locks or serializable logic. Simple count-before-insert can overbook.

### Fixture Complexity

Knockout and round-robin are manageable. Heats, groups, seeding, same-academy avoidance, and regeneration rules can increase complexity quickly. Keep generator interfaces small and format-based.

### Scoring Complexity

Generic score snapshots are appropriate first. Cricket ball-by-ball, tennis sets/tiebreaks, swimming heat timing, and live multi-device scoring should be later explicit scopes.

### Payments

Real payments introduce provider credentials, webhooks, refunds, reconciliation, legal pages, and audit requirements. Do not add a provider casually.

### Notifications

Email/SMS/push should use provider abstractions and queues with retry/failure handling. Avoid sending external notifications directly from controllers.

### Testing Gap

There is no dedicated automated test framework in source. Risk rises sharply for registrations, payments, fixtures, and scoring unless tests are added.

### Generated SDK Drift

Backend DTO/route changes must be followed by OpenAPI export and SDK generation. Do not hand-edit `libs/client_sdk`.

### Responsive UX

Current CSS has a mobile breakpoint, but future dashboard tables, forms, bracket views, and score editors need explicit responsive design.

## Product Questions

1. Should the platform prioritize India-style city browsing first, or be geography-neutral from the start?
2. What sports are required for MVP beyond badminton/cricket/football/swimming/tennis seed data?
3. Should tournament pages show organizer verification, tournament verification, or both?
4. Should organizers self-publish immediately or require admin approval?
5. Should players register as individuals first, or should team registration be first-class from the first registration slice?
6. Are entry fees always category-level, or can there be tournament-level passes/tickets?
7. Should bookings produce printable/downloadable tickets?
8. What is the first scoring ruleset to support?
9. Is email enough for notifications, or are SMS/push expected?
10. What deployment target should Docker/runtime decisions optimize for?


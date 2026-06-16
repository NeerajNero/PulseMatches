# 34 UX Role, Dashboard, and Scoring App Plan

## Scope

This note audits the current frontend UX and maps the correction work needed to make the app feel like a real sports platform. It is planning only. No code changes, route changes, migrations, SDK regeneration, or package changes are included here.

## Current UX Problems Found

1. Login and signup do not route by role beyond a simple organizer check.
2. `/me` is only a thin profile page, so most users land in a dead end after auth.
3. Organizer and admin workspaces exist, but the overall information hierarchy is still utilitarian and basic.
4. Public pages have the structure of a functioning app, but the visual system reads more like an internal tool than a sports product.
5. There is no dedicated mobile-first scoring experience, even though match scoring exists inside organizer tournament pages.
6. Public, player, organizer, and admin surfaces are all present, but the navigation structure is not yet shaped around distinct user jobs.

## Login Redirect Audit

### Current behavior

Files:
- `apps/frontend/app/login/page.tsx`
- `apps/frontend/app/signup/page.tsx`
- `apps/frontend/app/me/page.tsx`
- `apps/frontend/components/custom/organizer/organizer-shell.tsx`
- `apps/frontend/components/custom/admin/admin-shell.tsx`
- `apps/frontend/utils/route.ts`
- `apps/frontend/hooks/use-auth.ts`

Observed behavior:
- Login redirects to `/organizer` if the returned roles include `ORGANIZER`, otherwise to `/me`.
- Signup uses the same logic as login.
- `/me` only shows name, email, roles, and status.
- `OrganizerShell` and `AdminShell` both bounce non-matching authenticated users back to `/me`.
- `Admin` role is not considered in login/signup redirect logic.
- No redirect query param is preserved on login or signup.

### Where each role currently lands

- PLAYER: `/me`
- ORGANIZER: `/organizer`
- ADMIN: `/me` unless the user also has `ORGANIZER`
- Multi-role user with ORGANIZER: `/organizer`

### Recommended target behavior

- PLAYER should land on `/account` or `/account/dashboard`.
- ORGANIZER should land on `/organizer/dashboard`.
- ADMIN should land on `/admin/dashboard`.
- `/me` should either redirect by role or become a useful role-aware hub.
- Signup should use the same role-aware logic as login.
- If a safe redirect query param exists, preserve it and use it after successful auth.

### Weaknesses to fix

- The current redirect path treats `/me` as a catch-all instead of a product surface.
- Admin users are not first-class in post-auth routing.
- A redirect query exists nowhere in the auth flow, so users lose their intended destination.
- Role resolution is client-side only, which is acceptable for now but should be centralized in one helper.

## Player Experience Plan

Current player surfaces:
- `/account`
- `/account/registrations`
- `/me`

Current state:
- `/account` is a simple two-tile landing page.
- `/account/registrations` is useful, but it is still a list view rather than a dashboard.
- There is no dedicated player summary page with next actions.

### Recommended player dashboard

Target route:
- `/account/dashboard`

Content:
- Upcoming registered tournaments.
- Payment status for each registration.
- Registration status.
- Upcoming fixtures and published results for registered tournaments.
- Quick actions:
  - Browse tournaments
  - View registrations
  - Continue payment if pending
  - View public results
- Empty states for new users:
  - No registrations yet
  - No payments yet
  - No results yet

Suggested supporting routes:
- `/account/registrations`
- `/account/payments` only if it adds real value
- `/account/results` only if it adds real value

Design note:
- This should be a concise, task-oriented dashboard, not a profile page with a few stats.

## Organizer Experience Plan

Current organizer surfaces:
- `/organizer`
- `/organizer/dashboard`
- `/organizer/tournaments`
- `/organizer/tournaments/new`
- `/organizer/tournaments/[id]/edit`
- `/organizer/tournaments/[id]/categories`
- `/organizer/tournaments/[id]/registrations`
- `/organizer/tournaments/[id]/payments`
- `/organizer/tournaments/[id]/participants`
- `/organizer/tournaments/[id]/teams`
- `/organizer/tournaments/[id]/fixtures`
- `/organizer/tournaments/[id]/fixtures/[fixtureSetId]`
- `/organizer/tournaments/[id]/fixtures/[fixtureSetId]/scoring`

Current state:
- The organizer workspace is the strongest role surface in the app.
- It already has KPI cards, tournament lists, and management subroutes.
- The current dashboard is still narrow: it emphasizes tournament setup more than match-day operations.

### Recommended organizer dashboard

Target route:
- `/organizer/dashboard`

Content:
- Tournament summary.
- Draft and published counts.
- Pending registrations.
- Pending payments.
- Upcoming scheduled matches.
- Recent results.
- Notification or payment warnings.
- Quick actions:
  - Create tournament
  - Manage registrations
  - Manage payments
  - Open scoring app
  - View reports

Design note:
- Keep the organizer workspace operational and dense. This is a command center, not a marketing surface.

## Admin Experience Plan

Current admin surfaces:
- `/admin`
- `/admin/dashboard`
- `/admin/users`
- `/admin/organizers`
- `/admin/tournaments`
- `/admin/registrations`
- `/admin/payments`
- `/admin/notifications`
- `/admin/reconciliation`
- `/admin/operations`
- `/admin/audit`

Current state:
- Admin is already operationally focused.
- The dashboard has useful counts and health information.
- This area is close to adequate, but the visual polish still matches the rest of the app’s basic system.

### Recommendation

- Keep the admin dashboard as an operations/support workspace.
- Do not turn admin into a consumer-style dashboard.
- Add polish only where it improves scanning, alert triage, and support work.

### Admin dashboard should emphasize

- Operations alerts.
- Payment warnings.
- Failed notifications.
- Pending organizer verification.
- Recent support items.
- Smoke and health status.

## Sports Web App Visual Direction

Why it feels basic today:
- The palette is functional but restrained in a way that reads generic.
- Cards, panels, and badges are mostly box-and-border compositions with limited visual hierarchy.
- Public pages lack a stronger sports identity.
- The homepage has content, but not a memorable first-viewport signal.
- Many screens rely on plain tiles and lists rather than match-day structure.

### Visual direction

- Use a clearer sports and tournament theme.
- Keep the design simple, but make it feel purpose-built.
- Strengthen the homepage hero.
- Add sport/category cards with stronger hierarchy.
- Show city discovery more prominently.
- Make tournament cards carry:
  - status
  - date
  - venue
  - sport
  - entry fee
- Make match and fixture views visually prioritize:
  - round
  - match number
  - status
  - scores
  - winner
- Give each role a clearly different information density, not a different visual language.
- Improve mobile layout, CTA polish, badges, spacing, and typography.
- Prefer expanding the current CSS system and reusable components instead of introducing a new UI framework.

### Components that likely need visual refinement

- `apps/frontend/styles/globals.css`
- `apps/frontend/components/custom/public/home-page.tsx`
- `apps/frontend/components/custom/public/public-header.tsx`
- `apps/frontend/components/custom/public/public-footer.tsx`
- `apps/frontend/components/custom/tournaments/tournament-card.tsx`
- `apps/frontend/components/custom/tournaments/tournament-collection-view.tsx`
- `apps/frontend/components/custom/tournaments/tournament-detail-view.tsx`
- `apps/frontend/components/custom/registrations/registration-panel.tsx`
- `apps/frontend/components/custom/registrations/registration-list.tsx`
- `apps/frontend/components/custom/organizer/*`
- `apps/frontend/components/custom/admin/*`

## Dedicated Scoring App Recommendation

Current state:
- Scoring exists only as a nested organizer tournament page.
- That is fine for a feature, but not enough for courtside or groundside match-day use.

### Recommendation

Add a dedicated scoring app experience that is mobile-first, fast, and focused on one match or fixture set at a time.

### Best route structure

Recommended:
- `/scoring`
- `/scoring/tournaments`
- `/scoring/tournaments/[tournamentId]`
- `/scoring/fixtures/[fixtureSetId]`
- `/scoring/matches/[matchId]`

Why this fits best:
- It separates match-day usage from the heavier organizer management flows.
- It lets the scoring UX stay narrow and fast.
- It scales cleanly if a future scorer or referee role is added.

Alternative:
- `/organizer/scoring`
- `/organizer/scoring/matches/[matchId]`

Why this is weaker:
- It keeps the scoring experience inside the management workspace.
- That makes the mobile-first flow harder to keep uncluttered.

### MVP role recommendation

- Reuse `ORGANIZER` for the first scoring MVP.
- Plan a future `SCORER` role later if actual staffing or permissions require it.
- Do not add the role yet unless the product needs a permission split that organizer cannot safely cover.

### Scoring app features to plan

- Scorer landing page.
- List of tournaments needing scoring.
- Today’s scheduled matches.
- Match search and filtering.
- Match detail.
- Large score controls.
- Save score.
- Complete match.
- Reopen match if allowed.
- Winner selector.
- Round-robin standings preview.
- Knockout advancement preview.
- Poor-network tolerance notes, but no offline mode yet.
- Clear permissions:
  - organizer can score owned matches
  - admin read-only or support view
  - future scorer/referee role reserved for later

## Navigation Structure Plan

### Public nav

- Home
- Tournaments
- Sports
- Locations
- About
- Login/Signup or Dashboard

### Player nav

- Dashboard
- Registrations
- Payments or Results if useful
- Browse tournaments

### Organizer nav

- Dashboard
- Tournaments
- Registrations
- Payments
- Fixtures
- Scoring
- Reports

### Admin nav

- Dashboard
- Operations
- Users
- Organizers
- Tournaments
- Payments
- Notifications
- Reports/Audit

## Route Plan

### Keep or add

- `/`
- `/tournaments`
- `/tournaments/[slug]`
- `/sports/[sport]`
- `/locations/[city]`
- `/login`
- `/signup`
- `/account`
- `/account/dashboard`
- `/account/registrations`
- `/organizer`
- `/organizer/dashboard`
- `/organizer/tournaments`
- `/organizer/tournaments/new`
- `/organizer/tournaments/[id]/edit`
- `/organizer/tournaments/[id]/categories`
- `/organizer/tournaments/[id]/registrations`
- `/organizer/tournaments/[id]/payments`
- `/organizer/tournaments/[id]/participants`
- `/organizer/tournaments/[id]/teams`
- `/organizer/tournaments/[id]/fixtures`
- `/organizer/tournaments/[id]/fixtures/[fixtureSetId]`
- `/organizer/tournaments/[id]/fixtures/[fixtureSetId]/scoring`
- `/admin`
- `/admin/dashboard`
- `/admin/users`
- `/admin/organizers`
- `/admin/tournaments`
- `/admin/registrations`
- `/admin/payments`
- `/admin/notifications`
- `/admin/reconciliation`
- `/admin/operations`
- `/admin/audit`

### Scoring route options

Preferred:
- `/scoring`
- `/scoring/tournaments`
- `/scoring/tournaments/[tournamentId]`
- `/scoring/fixtures/[fixtureSetId]`
- `/scoring/matches/[matchId]`

Fallback:
- keep the organizer-scoped routes and layer a scoring entry point later

## Component Plan

### Shared components that need to become more reusable

- Status pills.
- Primary and secondary actions.
- Empty states.
- Loading states.
- Tournament cards.
- Match cards.
- Dashboard statistic tiles.
- Role shell navigation.

### Likely new shared components

- Role-aware dashboard shell.
- Role-aware landing redirect helper.
- Player dashboard summary cards.
- Organizer dashboard action rail.
- Scoring app shell.
- Scoring match control panel.
- Stronger sports tournament card variant.

## Phased Implementation Roadmap

### UX Phase 1

Role redirect and useful dashboards.

Goals:
- Fix login redirect.
- Improve or replace `/me`.
- Add player dashboard.
- Confirm organizer and admin redirects.

Likely files:
- `apps/frontend/app/login/page.tsx`
- `apps/frontend/app/signup/page.tsx`
- `apps/frontend/app/me/page.tsx`
- `apps/frontend/app/account/page.tsx`
- `apps/frontend/app/account/registrations/page.tsx`
- `apps/frontend/components/custom/auth/*`
- `apps/frontend/hooks/use-auth.ts`
- `apps/frontend/utils/route.ts`

### UX Phase 2

Sports visual polish.

Goals:
- Redesign public homepage sections.
- Polish tournament cards.
- Polish listing and detail pages.
- Standardize status badges.
- Improve responsive layout.

Likely files:
- `apps/frontend/styles/globals.css`
- `apps/frontend/components/custom/public/*`
- `apps/frontend/components/custom/tournaments/*`
- `apps/frontend/app/tournaments/*`
- `apps/frontend/app/sports/*`
- `apps/frontend/app/locations/*`

### UX Phase 3

Player account polish.

Goals:
- Dashboard.
- Registrations.
- Payment status.
- Results links.
- Empty states.

Likely files:
- `apps/frontend/app/account/*`
- `apps/frontend/components/custom/registrations/*`
- `apps/frontend/hooks/use-registrations.ts`

### UX Phase 4

Organizer dashboard polish.

Goals:
- Summary cards.
- Pending actions.
- Match-day shortcuts.
- Report and payment warnings.

Likely files:
- `apps/frontend/app/organizer/*`
- `apps/frontend/components/custom/organizer/*`
- `apps/frontend/hooks/use-organizer-tournaments.ts`
- `apps/frontend/hooks/use-organizer-fixtures.ts`

### UX Phase 5

Dedicated scoring app.

Goals:
- Mobile-first scoring routes.
- Today’s matches.
- Match scoring screen.
- Completion flow.
- Scoring-specific navigation.

Likely files:
- `apps/frontend/app/organizer/tournaments/[id]/fixtures/[fixtureSetId]/scoring/page.tsx`
- `apps/frontend/components/custom/organizer/organizer-fixture-scoring-view.tsx`
- `apps/frontend/hooks/use-organizer-fixtures.ts`
- `apps/frontend/utils/route.ts`
- future scoring route files if the route structure is split out

### UX Phase 6

Final UI consistency pass.

Goals:
- CSS cleanup.
- Spacing and typography normalization.
- Badge/button/form consistency.
- Loading, empty, and error state polish.
- Mobile pass.

Likely files:
- `apps/frontend/styles/globals.css`
- shared UI and shell components across public, player, organizer, and admin areas

## Risks And Questions

### Risks

- If role redirects are changed without a safe redirect helper, users can be bounced to the wrong place.
- Splitting scoring into its own route family will touch navigation and route helpers even if backend scoring stays unchanged.
- A visual refresh can become too broad unless the CSS scope is kept disciplined.
- Player dashboard data may be limited unless the account surface is shaped around existing registration and payment data first.

### Questions

1. Should `/me` become a pure redirect, or remain a profile hub for all signed-in users?
2. Should the scoring app be a true separate route family now, or be introduced as a new organizer subtree first?
3. Should player payments be a first-class `/account/payments` route, or only an action inside registrations?
4. Do we want organizer and admin dashboards to keep separate shells, or eventually share a common operations shell?

## Files Inspected

- `apps/frontend/app/login/page.tsx`
- `apps/frontend/app/signup/page.tsx`
- `apps/frontend/app/me/page.tsx`
- `apps/frontend/app/account/page.tsx`
- `apps/frontend/app/account/registrations/page.tsx`
- `apps/frontend/app/organizer/page.tsx`
- `apps/frontend/app/organizer/dashboard/page.tsx`
- `apps/frontend/app/admin/page.tsx`
- `apps/frontend/app/admin/dashboard/page.tsx`
- `apps/frontend/app/admin/operations/page.tsx`
- `apps/frontend/app/admin/notifications/page.tsx`
- `apps/frontend/app/admin/reconciliation/page.tsx`
- `apps/frontend/app/admin/audit/page.tsx`
- `apps/frontend/components/custom/auth/auth-shell.tsx`
- `apps/frontend/components/custom/public/home-page.tsx`
- `apps/frontend/components/custom/public/public-header.tsx`
- `apps/frontend/components/custom/public/public-footer.tsx`
- `apps/frontend/components/custom/public/page-header.tsx`
- `apps/frontend/components/custom/tournaments/tournament-card.tsx`
- `apps/frontend/components/custom/tournaments/tournament-collection-view.tsx`
- `apps/frontend/components/custom/tournaments/tournament-detail-view.tsx`
- `apps/frontend/components/custom/registrations/registration-panel.tsx`
- `apps/frontend/components/custom/registrations/registration-list.tsx`
- `apps/frontend/components/custom/organizer/organizer-shell.tsx`
- `apps/frontend/components/custom/organizer/organizer-dashboard-view.tsx`
- `apps/frontend/components/custom/organizer/organizer-tournament-list-view.tsx`
- `apps/frontend/components/custom/organizer/organizer-fixture-management-view.tsx`
- `apps/frontend/components/custom/organizer/organizer-fixture-detail-view.tsx`
- `apps/frontend/components/custom/organizer/organizer-fixture-scoring-view.tsx`
- `apps/frontend/components/custom/organizer/organizer-tournament-management-nav.tsx`
- `apps/frontend/components/custom/admin/admin-shell.tsx`
- `apps/frontend/components/custom/admin/admin-dashboard-view.tsx`
- `apps/frontend/components/custom/admin/admin-operations-view.tsx`
- `apps/frontend/components/custom/admin/admin-collection-view.tsx`
- `apps/frontend/hooks/use-auth.ts`
- `apps/frontend/hooks/use-discovery.ts`
- `apps/frontend/hooks/use-registrations.ts`
- `apps/frontend/hooks/use-organizer-tournaments.ts`
- `apps/frontend/hooks/use-organizer-fixtures.ts`
- `apps/frontend/hooks/use-admin.ts`
- `apps/frontend/utils/route.ts`
- `apps/frontend/utils/query-constants.ts`
- `apps/frontend/styles/globals.css`
- `apps/frontend/app/layout.tsx`
- `apps/backend/src/api/auth/auth.controller.ts`
- `apps/backend/src/api/auth/auth.service.ts`
- `apps/backend/src/api/auth/auth.transform.ts`
- `apps/backend/src/api/auth/auth.types.ts`
- `libs/client_sdk/docs/CurrentUserDto.md`
- `libs/client_sdk/docs/AuthResponseDto.md`
- `libs/client_sdk/docs/SignupRequestDto.md`
- `libs/client_sdk/docs/LoginRequestDto.md`
- `docs/features/plans/005-fixtures-scoring.plan.md`
- `docs/playmatches-clone-prep/07-route-page-plan.md`
- `docs/playmatches-clone-prep/05-gap-analysis.md`

## Documentation Created

- `docs/playmatches-clone-prep/34-ux-role-dashboard-scoring-app-plan.md`

## Recommended First Implementation Prompt

“Implement UX Phase 1 only: make auth redirects role-aware, decide whether `/me` should redirect or become a role-aware hub, and add a proper player dashboard entry point at `/account/dashboard` without touching backend behavior or introducing new packages.”

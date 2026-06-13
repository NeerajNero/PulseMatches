# Implementation Roadmap

Do not implement these phases without explicit approval. This roadmap is a staged plan only.

## Phase 0: Repo Cleanup And Prep

Goal:

- Make the repo easier to build on without changing product behavior.

Likely changed files:

- `docs/`
- Possibly `.gitignore` if generated artifacts policy is clarified.
- Possibly route organization if moving files into route groups is approved.

Likely new files:

- Shared frontend components: `PublicHeader`, `PublicFooter`, `PageHeader`.

Dependencies:

- None.

Test plan:

- `pnpm typecheck`
- `pnpm lint`
- `pnpm --filter @matchflow/frontend build` if route organization changes.

Risks:

- Moving routes into groups can break imports or route paths if done carelessly.
- Current folder is not detected as a Git repo, so change tracking must be handled manually.

## Phase 1: Public Pages And Tournament Listing

Goal:

- Make public discovery feel like a real original tournament platform.

Likely changed files:

- `apps/frontend/app/(public)/page.tsx`
- `apps/frontend/app/tournaments/page.tsx`
- `apps/frontend/app/tournaments/[slug]/page.tsx`
- `apps/frontend/styles/globals.css`
- `apps/frontend/components/*`
- `apps/frontend/hooks/use-discovery.ts`

Likely new files:

- `apps/frontend/app/about/page.tsx`
- `apps/frontend/app/contact/page.tsx`
- `apps/frontend/app/privacy/page.tsx`
- `apps/frontend/app/terms/page.tsx`
- `apps/frontend/app/sports/[sport]/page.tsx`
- `apps/frontend/app/locations/[city]/page.tsx`
- `components/custom/tournaments/tournament-card.tsx`
- `components/custom/tournaments/tournament-filters.tsx`

Dependencies:

- Existing discovery API and seed data.

Test plan:

- `pnpm --filter @matchflow/frontend typecheck`
- `pnpm --filter @matchflow/frontend lint`
- `pnpm --filter @matchflow/frontend build`
- Manual browser smoke for homepage, listing, sport, city, detail.

Risks:

- Need original copy and assets.
- Listing UX may require backend sort/filter additions.

## Phase 2: Tournament Details And Registration

Goal:

- Let authenticated players register for tournament categories with payment placeholder/offline status.

Likely changed files:

- `apps/backend/prisma/schema.prisma`
- New Prisma migration.
- `apps/backend/src/api/*`
- `apps/backend/src/db/*`
- `apps/frontend/app/tournaments/[slug]/page.tsx`
- `apps/frontend/app/me/page.tsx` or new account routes.
- `libs/client_sdk` after regeneration.

Likely new files:

- `apps/backend/src/api/registrations/*`
- `apps/backend/src/db/registrations/*`
- `apps/frontend/app/account/registrations/page.tsx`
- `apps/frontend/hooks/use-registrations.ts`
- `components/custom/registrations/*`

Dependencies:

- Auth and discovery.
- Clear answer on whether no-payment registrations default to pending or confirmed.

Test plan:

- Backend typecheck/build.
- Prisma migrate against local DB.
- SDK regeneration.
- Frontend typecheck/build.
- Manual smoke for auth-gated registration and capacity behavior.

Risks:

- Capacity race conditions.
- Payment placeholder can confuse users if UI is not clear.

## Phase 3: Organizer Dashboard And Tournament CRUD

Goal:

- Let organizers create, edit, and publish their own tournament drafts.

Likely changed files:

- `apps/backend/prisma/schema.prisma`
- `apps/backend/src/api/organizer/*`
- `apps/backend/src/db/*`
- `apps/frontend/app/organizer/*`
- `apps/frontend/hooks/*`
- `libs/client_sdk`

Likely new files:

- `apps/backend/src/api/organizer-tournaments/*`
- `apps/backend/src/db/organizer-tournaments/*`
- `apps/frontend/app/organizer/dashboard/page.tsx`
- `apps/frontend/app/organizer/tournaments/page.tsx`
- `apps/frontend/app/organizer/tournaments/new/page.tsx`
- `apps/frontend/app/organizer/tournaments/[id]/edit/page.tsx`
- `components/custom/organizer/*`

Dependencies:

- Existing organizer auth/profile.
- Publish rule decisions.

Test plan:

- Permission checks for owned vs non-owned tournaments.
- Publish validation checks.
- SDK regeneration.
- Frontend smoke for create/edit/publish.

Risks:

- Ownership checks must be strict.
- Public listing must not show drafts/private/blocked tournaments.

## Phase 4: Teams, Players, And Events Management

Goal:

- Let organizers manage categories/events, registrations, teams, and manual participant entries.

Likely changed files:

- Registration/team backend modules.
- Organizer tournament screens.
- Tournament detail category display.

Likely new files:

- Team and team member models/migration.
- Organizer registration/team pages.
- Team management components.

Dependencies:

- Phase 2 registrations.
- Phase 3 organizer tournament CRUD.

Test plan:

- Capacity checks.
- Singles/doubles/team participant cases.
- Organizer manual entry smoke.

Risks:

- Team model must represent singles and multi-player teams without special-case sprawl.

## Phase 5: Fixture Generation And Match Scheduling

Goal:

- Generate and persist knockout and round-robin fixtures, then schedule matches.

Likely changed files:

- `apps/backend/prisma/schema.prisma`
- Backend fixture/match modules.
- Public tournament detail tabs.
- Organizer fixture/match pages.
- SDK and hooks.

Likely new files:

- `apps/backend/src/api/fixtures/*`
- `apps/backend/src/db/fixtures/*`
- `apps/backend/src/domain/fixtures/*`
- `apps/frontend/app/organizer/tournaments/[id]/fixtures/page.tsx`
- `apps/frontend/app/organizer/tournaments/[id]/matches/page.tsx`
- `components/custom/fixtures/*`

Dependencies:

- Confirmed registrations/teams.
- Fixture regeneration policy.

Test plan:

- Unit-level checks for generator functions if test framework is added.
- Manual fixtures for knockout and round robin sample categories.
- Verify public display.

Risks:

- Fixture generation is business-critical and easy to get subtly wrong.
- Regeneration after schedule/results exist needs strict rules.

## Phase 6: Scoring And Results

Goal:

- Let organizers update scores/results and show public results/standings.

Likely changed files:

- Match models and APIs.
- Public detail pages.
- Organizer scoring page.
- SDK/hooks.

Likely new files:

- `apps/backend/src/api/scoring/*`
- `apps/backend/src/db/scoring/*`
- `components/custom/scoring/*`

Dependencies:

- Phase 5 matches.
- Chosen first score schema/sport.

Test plan:

- Score update transactions.
- Winner consistency.
- Round-robin standings from completed matches.

Risks:

- Sport-specific scoring can overcomplicate MVP.
- Public result accuracy depends on transaction consistency.

## Phase 7: Notifications And Payments

Goal:

- Add communication and payment capabilities only after provider decisions.

Likely changed files:

- Backend config/env validation.
- Docker/runtime if workers are introduced.
- Prisma schema/migrations.
- Organizer/player UI.

Likely new files:

- `apps/backend/src/api/notifications/*`
- `apps/backend/src/db/notifications/*`
- `apps/backend/src/queues/*`
- `apps/backend/src/providers/email/*`
- `apps/backend/src/providers/payments/*`

Dependencies:

- Registrations, matches, scheduling.
- Provider selection and env vars.

Test plan:

- Provider sandbox tests.
- Webhook verification if payments are added.
- Queue retry/failure behavior.

Risks:

- High compliance and user trust risk.
- Email/payment/webhook behavior needs strong tests and audit logs.

## Phase 8: Polish, Testing, Deployment

Goal:

- Harden app quality, responsive behavior, accessibility, observability, and deployment readiness.

Likely changed files:

- All feature areas as needed.
- CI/deployment config once target is selected.
- `docs/env-checklist.md`
- `docs/verification.md`

Likely new files:

- Automated tests.
- Deployment manifests/config.
- Observability provider wrappers.

Dependencies:

- Core product flows.
- Deployment target decision.

Test plan:

- Full `pnpm build`, `pnpm typecheck`, `pnpm lint`.
- Backend integration tests if test stack is added.
- Frontend smoke/e2e if Playwright or equivalent is approved.
- Manual responsive verification.

Risks:

- Current project lacks test framework; adding one is a scoped architecture choice.
- Production auth/token storage needs security review.


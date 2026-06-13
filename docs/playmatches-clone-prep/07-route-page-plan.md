# Route And Page Plan

Use the current Next.js App Router convention under `apps/frontend/app`. The repo currently uses simple top-level routes, but future work should introduce route groups for organization:

- `app/(public)`
- `app/(auth)`
- `app/(player)`
- `app/(organizer)`
- `app/(admin)`

Route groups do not affect URLs and will keep the app maintainable as screens grow.

## Current Routes

| URL | File |
| --- | --- |
| `/` | `apps/frontend/app/(public)/page.tsx` |
| `/tournaments` | `apps/frontend/app/tournaments/page.tsx` |
| `/tournaments/[slug]` | `apps/frontend/app/tournaments/[slug]/page.tsx` |
| `/login` | `apps/frontend/app/login/page.tsx` |
| `/signup` | `apps/frontend/app/signup/page.tsx` |
| `/me` | `apps/frontend/app/me/page.tsx` |
| `/organizer` | `apps/frontend/app/organizer/page.tsx` |

## Proposed Public Routes

| URL | Suggested file | Purpose | API dependency |
| --- | --- | --- | --- |
| `/` | `app/(public)/page.tsx` | Original homepage with discovery and organizer CTAs. | `GET /sports`, `GET /cities`, `GET /tournaments` optional |
| `/tournaments` | `app/(public)/tournaments/page.tsx` or keep current path | Listing with filters/search/pagination. | `GET /tournaments` |
| `/tournaments/[slug]` | `app/(public)/tournaments/[slug]/page.tsx` or keep current path | Tournament detail. | `GET /tournaments/:slugOrId` |
| `/sports/[sport]` | `app/(public)/sports/[sport]/page.tsx` | Sport-specific landing/listing. | `GET /sports`, `GET /tournaments?sport=` |
| `/locations/[city]` | `app/(public)/locations/[city]/page.tsx` | City/location listing. | `GET /cities`, `GET /tournaments?city=` |
| `/about` | `app/(public)/about/page.tsx` | Original about page. | None |
| `/contact` | `app/(public)/contact/page.tsx` | Contact page. | Optional contact endpoint later |
| `/privacy` | `app/(public)/privacy/page.tsx` | Privacy policy. | None |
| `/terms` | `app/(public)/terms/page.tsx` | Terms and conditions. | None |
| `/refund-policy` | `app/(public)/refund-policy/page.tsx` | Add only when payments/bookings exist. | None |

If current top-level files are moved into route groups, keep URLs stable and update imports only.

## Proposed Auth Routes

| URL | Suggested file | Purpose |
| --- | --- | --- |
| `/login` | `app/(auth)/login/page.tsx` | Login. |
| `/signup` | `app/(auth)/signup/page.tsx` | Signup. |
| `/forgot-password` | `app/(auth)/forgot-password/page.tsx` | Later, if email provider exists. |
| `/reset-password` | `app/(auth)/reset-password/page.tsx` | Later, if email provider exists. |

## Proposed Player Routes

Current `/me` can stay, but `/account` reads better for a product route. Pick one convention and redirect the other.

| URL | Suggested file | Purpose | API dependency |
| --- | --- | --- | --- |
| `/account` | `app/(player)/account/page.tsx` | Player account overview. | `GET /auth/me` |
| `/account/registrations` | `app/(player)/account/registrations/page.tsx` | Registration history. | `GET /me/registrations` |
| `/account/bookings` | `app/(player)/account/bookings/page.tsx` | Booking/payment history if booking model exists. | `GET /me/bookings` |
| `/account/profile` | `app/(player)/account/profile/page.tsx` | Profile edit. | `GET/PATCH /me/profile` |

## Proposed Organizer Routes

Keep `/organizer` as the organizer root because it already exists.

| URL | Suggested file | Purpose | API dependency |
| --- | --- | --- | --- |
| `/organizer` | `app/(organizer)/organizer/page.tsx` | Workspace landing or redirect to dashboard. | `GET /auth/me`, `GET /organizer/profile` |
| `/organizer/dashboard` | `app/(organizer)/organizer/dashboard/page.tsx` | KPIs and tasks. | `GET /organizer/dashboard` |
| `/organizer/profile` | `app/(organizer)/organizer/profile/page.tsx` | Profile edit. | Existing profile endpoints |
| `/organizer/tournaments` | `app/(organizer)/organizer/tournaments/page.tsx` | Owned tournament list. | `GET /organizer/tournaments` |
| `/organizer/tournaments/new` | `app/(organizer)/organizer/tournaments/new/page.tsx` | Create tournament. | `POST /organizer/tournaments` |
| `/organizer/tournaments/[id]/edit` | `app/(organizer)/organizer/tournaments/[id]/edit/page.tsx` | Edit tournament. | `GET/PATCH /organizer/tournaments/:id` |
| `/organizer/tournaments/[id]/events` | `app/(organizer)/organizer/tournaments/[id]/events/page.tsx` | Category/event management. | Category endpoints |
| `/organizer/tournaments/[id]/teams` | `app/(organizer)/organizer/tournaments/[id]/teams/page.tsx` | Teams/players/registrations. | Registration/team endpoints |
| `/organizer/tournaments/[id]/fixtures` | `app/(organizer)/organizer/tournaments/[id]/fixtures/page.tsx` | Fixture generation and bracket view. | Fixture endpoints |
| `/organizer/tournaments/[id]/matches` | `app/(organizer)/organizer/tournaments/[id]/matches/page.tsx` | Match schedule list. | Match endpoints |
| `/organizer/tournaments/[id]/scoring` | `app/(organizer)/organizer/tournaments/[id]/scoring/page.tsx` | Score editor. | Score endpoints |
| `/organizer/tournaments/[id]/notifications` | `app/(organizer)/organizer/tournaments/[id]/notifications/page.tsx` | Announcements/notifications later. | Notification endpoints |

## Proposed Admin Routes

No admin UI exists today. Add only after admin moderation scope is approved.

| URL | Purpose |
| --- | --- |
| `/admin` | Admin dashboard. |
| `/admin/organizers` | Organizer verification. |
| `/admin/tournaments` | Tournament moderation and status changes. |
| `/admin/catalog/sports` | Sport catalog management. |
| `/admin/catalog/cities` | City catalog management. |
| `/admin/audit-logs` | Audit log browser. |

## Backend Route Plan

Follow current Nest module boundaries and route style.

Public:

- `GET /sports`
- `GET /cities`
- `GET /tournaments`
- `GET /tournaments/:slugOrId`
- `GET /tournaments/:slugOrId/fixtures`
- `GET /matches/:id`
- `GET /tournament-categories/:id/standings`

Player:

- `GET /me/profile`
- `PATCH /me/profile`
- `POST /registrations`
- `GET /me/registrations`
- `GET /me/bookings`

Organizer:

- Existing profile endpoints.
- `GET /organizer/dashboard`
- `GET /organizer/tournaments`
- `POST /organizer/tournaments`
- `GET /organizer/tournaments/:id`
- `PATCH /organizer/tournaments/:id`
- `POST /organizer/tournaments/:id/publish`
- `POST /organizer/tournaments/:id/unpublish`
- `POST /organizer/tournaments/:id/categories`
- `PATCH /organizer/tournament-categories/:id`
- `GET /organizer/tournaments/:id/registrations`
- `POST /organizer/tournament-categories/:id/registrations`
- `PATCH /organizer/registrations/:id/status`
- `POST /organizer/tournament-categories/:id/fixtures/generate`
- `PATCH /organizer/matches/:id/schedule`
- `PATCH /organizer/matches/:id/score`

Admin:

- `GET /admin/dashboard`
- `GET/PATCH /admin/organizers/:id/verification`
- `GET/PATCH /admin/tournaments/:id/moderation`
- `GET/POST/PATCH /admin/sports`
- `GET/POST/PATCH /admin/cities`
- `GET /admin/audit-logs`


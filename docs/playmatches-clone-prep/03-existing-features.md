# Existing Features

## Current Pages And Routes

| Route | File | Behavior |
| --- | --- | --- |
| `/` | `apps/frontend/app/(public)/page.tsx` | Original MatchFlow Arena homepage/foundation shell with stack/status content. |
| `/tournaments` | `apps/frontend/app/tournaments/page.tsx` | Public tournament listing with search, city, sport, and upcoming filters. |
| `/tournaments/[slug]` | `apps/frontend/app/tournaments/[slug]/page.tsx` | Public tournament detail with schedule, venue, organizer, and category list. |
| `/login` | `apps/frontend/app/login/page.tsx` | Login form using SDK auth mutation. |
| `/signup` | `apps/frontend/app/signup/page.tsx` | Signup form for player or organizer role. |
| `/me` | `apps/frontend/app/me/page.tsx` | Client-guarded user profile shell. |
| `/organizer` | `apps/frontend/app/organizer/page.tsx` | Client-guarded organizer workspace shell. |

No routes currently exist for `/about`, `/contact`, `/privacy`, `/terms`, `/sports/[sport]`, `/locations/[city]`, player registration history, organizer tournament CRUD, fixtures, matches, scoring, or admin moderation.

## Current Backend APIs

| Module | Endpoints | Source |
| --- | --- | --- |
| Health | `GET /health` | `apps/backend/src/health/health.controller.ts` |
| Auth | `POST /auth/signup`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `GET /auth/me` | `apps/backend/src/api/auth/auth.controller.ts` |
| Organizer | `GET /organizer/profile`, `POST /organizer/profile`, `PATCH /organizer/profile` | `apps/backend/src/api/organizer/organizer.controller.ts` |
| Discovery | `GET /sports`, `GET /cities`, `GET /tournaments`, `GET /tournaments/:slugOrId` | `apps/backend/src/api/discovery/discovery.controller.ts` |

## Current Database Models

| Model | Purpose |
| --- | --- |
| `User` | Account identity with email, password hash, display name, status. |
| `UserRole` | Multi-role access for player, organizer, admin. |
| `OrganizerProfile` | Organizer organization identity, slug, contact fields, verification status. |
| `Sport` | Public sport catalog. |
| `City` | Public city/location catalog. |
| `Venue` | Tournament venue with city, address, optional geo coordinates. |
| `Tournament` | Public event shell with organizer, sport, city, venue, dates, visibility, status. |
| `TournamentCategory` | Bookable/event division concept with format, participant type, gender, age, fee, capacity. |
| `TournamentMedia` | Tournament media references. |
| `RefreshToken` | Hashed refresh token records. |
| `AuditLog` | Generic audit trail for business and auth events. |

## Reusable UI Components And Patterns

| Component or class | Source | Reuse |
| --- | --- | --- |
| `AuthShell` | `components/custom/auth/auth-shell.tsx` | Login/signup and future auth-related screens. |
| `StatusPill` | `components/ui/status-pill.tsx` | Small status labels; extend tones for tournament statuses. |
| `AppProviders` | `components/providers/app-providers.tsx` | React Query root provider. |
| `.topbar`, `.brand`, `.nav-links` | `styles/globals.css` | Public and dashboard navigation. |
| `.filter-bar` | `styles/globals.css` | Tournament discovery filters. |
| `.tournament-card` | `styles/globals.css` | Tournament card pattern. |
| `.detail-panel`, `.detail-grid` | `styles/globals.css` | Tournament detail sections. |
| `.feature-tile`, `.dashboard-grid` | `styles/globals.css` | Dashboard cards and compact summaries. |
| `.auth-form` | `styles/globals.css` | Current form styling. |
| `.state-text` | `styles/globals.css` | Loading/error/empty messaging. |

## Layout, Navigation, Guards, Middleware

- Root layout wraps all routes with `AppProviders`.
- Public pages use ad hoc header markup.
- Authenticated pages use client-side checks in `useEffect`.
- Organizer page checks for `ORGANIZER` role client-side.
- Backend organizer endpoints are properly protected with `JwtAuthGuard` and `RolesGuard`.
- No Next middleware exists.
- No reusable app shell for organizer navigation exists yet.

## Existing Forms

| Form | File | Notes |
| --- | --- | --- |
| Login | `apps/frontend/app/login/page.tsx` | Email/password, redirects organizer to `/organizer`, others to `/me`. |
| Signup | `apps/frontend/app/signup/page.tsx` | Player/organizer role select, organization fields for organizers. |
| Tournament filters | `apps/frontend/app/tournaments/page.tsx` | Search, city, sport, upcoming checkbox. |

Backend validation exists for auth, organizer profile, and discovery query DTOs.

## Uploads, Payments, Email, Notifications

No implemented upload logic, payment provider, ticket booking, email provider, notification provider, queues, or background jobs were found in source. Redis is present in Docker but not used by app code yet.

## Admin/Dashboard Logic

- Seed includes an admin user.
- `RoleType.ADMIN` exists.
- No admin endpoints or admin UI exist.
- Organizer dashboard is only a shell showing profile and next-slice text.

## Reusable Features For Tournament Platform

Strong reusable pieces:

- Auth and role foundation.
- Organizer profile foundation.
- Sports/cities/venues/tournaments/categories/media schema.
- Public tournament listing/detail API.
- Public tournament listing/detail pages.
- React Query SDK wrapper pattern.
- Response envelope, exception filter, validation pipe.
- Audit log model and repository write pattern.
- Idempotent seed data for local development.


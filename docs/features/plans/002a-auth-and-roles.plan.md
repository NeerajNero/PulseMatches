# 002a Auth And Roles Plan

## Status

- Status: approved
- Feature slug: 002a-auth-and-roles
- Source stories: Player/organizer/admin foundation from kickoff prompt
- Classification: risky because it introduces authentication, password hashing, JWTs, protected routes, roles, database schema, migrations, SDK regeneration, and frontend auth flows
- Lane: risky
- Created: 2026-05-26
- Last updated: 2026-05-26

## Summary

- User-visible outcome: players and organizers can sign up, log in, view their profile, and reach role-aware placeholder screens.
- Business value: establishes identity, roles, and organizer profile foundation required by discovery, organizer management, registration, and admin slices.
- Surfaces: backend, database, web, SDK, docs.

## Scope

In scope:

- `users`, `user_roles`, `organizer_profiles`, `refresh_tokens`, and `audit_logs`.
- Role model with `player`, `organizer`, and `admin`.
- Signup, login, refresh, logout, and current-user endpoints.
- Password hashing.
- JWT access tokens and hashed refresh tokens.
- Auth and role guards/decorators.
- Minimal organizer profile create/read/update endpoints.
- Dev seed script for admin, sample player, and sample organizer.
- Generated OpenAPI/SDK update.
- Frontend login, signup, `/me`, and `/organizer` placeholder shell.

Out of scope:

- Public tournament discovery.
- Tournament create/edit.
- Registration/booking.
- Payments.
- Fixture generation.
- Scoring.
- Notifications and email sending.
- OAuth/social login.
- Forgot-password email flow.
- Real admin dashboard.

## Data Model Impact

- Schema changes: add auth and organizer foundation tables.
- Migration name: `002a_auth_and_roles`.
- Indexes/constraints: unique user email, unique `(user_id, role)`, unique organizer slug, refresh-token lookup index, audit actor/entity indexes.
- Seed data: idempotent local/dev seed script for admin, sample player, and sample organizer.
- Rollback considerations: local reset can drop the initial auth migration; production rollback would require preserving user data and is not automated.

## Backend Plan

- Routes:
  - `POST /auth/signup`
  - `POST /auth/login`
  - `POST /auth/refresh`
  - `POST /auth/logout`
  - `GET /auth/me`
  - `GET /organizer/profile`
  - `POST /organizer/profile`
  - `PATCH /organizer/profile`
- DTOs: signup, login, refresh, logout, auth response, me response, organizer profile create/update/response.
- Services: auth service, token service, organizer profile service.
- Repositories/DB services: users/auth repository, organizer profile repository, audit repository behind DB services.
- Auth/permissions: JWT guard and role guard; organizer routes require auth plus organizer role.
- Swagger/OpenAPI: DTO classes and endpoint decorators emit SDK-compatible schemas.
- Background jobs: none.
- SQL functions/triggers/materialized views: none.
- Observability: no new metrics in this slice.
- External providers: none.

## SDK Plan

- OpenAPI impact: auth and organizer endpoints added.
- SDK output path: `libs/client_sdk`.
- Generated models expected: auth requests/responses, current user, organizer profile DTOs.
- Compatibility concerns: all backend responses must document the global response envelope, not raw DTOs.

## Web Frontend Plan

- Routes/pages:
  - `/login`
  - `/signup`
  - `/me`
  - `/organizer`
- Components: auth form primitives local to pages, protected shell.
- Hooks: `useAuth` with React Query and generated SDK clients.
- Query keys: centralized auth keys.
- Loading/empty/error states: explicit form pending/error states and profile loading state.

## Mobile Frontend Plan

- App target: none.
- Screens/routes: none.
- Shared packages/native config/permissions: none.

## Implementation Sequence

1. Add approved plan and update context docs.
2. Add auth dependencies and Prisma schema.
3. Create/apply migration and generate Prisma client.
4. Implement DB services/repositories.
5. Implement auth services, guards, DTOs, controllers, and Swagger response envelopes.
6. Implement organizer profile API foundation.
7. Add idempotent dev seed.
8. Regenerate OpenAPI and SDK.
9. Add frontend auth wrapper, hooks, and pages.
10. Run verification and write implementation report.

## Acceptance Criteria

- Signup creates a user with selected player/organizer role.
- Organizer signup creates a minimal organizer profile or allows one to be created.
- Login returns tokens and current user without password hash.
- Refresh rotates or validates refresh token without exposing token internals.
- Logout revokes refresh token.
- `/auth/me` requires auth.
- `/organizer/profile` routes require organizer role.
- Frontend auth routes use generated SDK wrappers.
- SDK is regenerated from OpenAPI.

## Verification Plan

- Docker: `pnpm local:config`, `pnpm local:up`, `docker-compose ps`.
- Migration: `pnpm --filter @matchflow/backend prisma:migrate`, `pnpm --filter @matchflow/backend prisma:generate`.
- Backend: `pnpm --filter @matchflow/backend build`, auth smoke tests with curl.
- SDK: `pnpm generate:openapi`, `pnpm generate:sdk`.
- Web: `pnpm --filter @matchflow/frontend build`.
- Full: `pnpm typecheck`, `pnpm lint`, `pnpm build`.

## Test Plan

- Unit: deferred unless implementation risk demands it.
- API integration: curl smoke tests for signup/login/me/organizer/profile/logout.
- Contract: OpenAPI export and SDK generation.
- E2E: not added in this slice.
- Manual: frontend build and page route validation through Next build.

## Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Token handling can become overbuilt. | Slows MVP. | Use JWT access plus hashed refresh token table, leave rate limiting/email verification as TODO. |
| Envelope mismatch can break generated SDK. | Frontend type drift. | Use explicit envelope response DTO classes. |
| Role checks can be bypassed if guards are inconsistent. | Organizer data exposure. | Centralize `@CurrentUser`, JWT guard, `@Roles`, and roles guard. |

## Open Questions

| ID | Question | Blocking |
| --- | --- | --- |
| AUTH-001 | Should production auth use HttpOnly cookies instead of token storage? | no |
| AUTH-002 | Which email provider will support verification/reset later? | no |

## Approval

- Approved: yes.
- Approval file: this prompt explicitly approves this plan.
- Conditions: do not implement tournament discovery, tournament management, registrations, payments, fixtures, scoring, notifications, or analytics.

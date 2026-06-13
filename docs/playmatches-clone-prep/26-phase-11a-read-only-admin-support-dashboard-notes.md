# Phase 11A: Read-Only Admin Support Dashboard

## Summary

Phase 11A adds a read-only platform support/admin surface for operational inspection. It is intentionally visibility-only: no moderation, payment mutation, notification retry, user status changes, tournament controls, or refund execution were added.

## Backend Endpoints Added

All admin endpoints require JWT auth and `ADMIN` role:

- `GET /admin/dashboard`
- `GET /admin/users`
- `GET /admin/organizers`
- `GET /admin/tournaments`
- `GET /admin/registrations`
- `GET /admin/payments`
- `GET /admin/payments/:paymentRecordId`
- `GET /admin/notifications`
- `GET /admin/reconciliation-runs`
- `GET /admin/audit-events`

The backend implementation lives in:

- `apps/backend/src/api/admin/*`
- `apps/backend/src/db/admin/*`

`AdminModule` is registered in `apps/backend/src/app.module.ts`.

## Auth And Role Behavior

- Admin endpoints use `JwtAuthGuard` and `RolesGuard`.
- Required role is `RoleType.ADMIN`.
- `PLAYER` and `ORGANIZER` users receive `403`.
- Unauthenticated requests receive `401`.
- The existing seed already includes `admin@matchflow.local` / `AdminPass123!`.

## Privacy And Sanitization

Admin APIs use explicit Prisma selects/includes and safe transforms.

Rules enforced by this phase:

- User lists do not return password hashes, refresh token hashes, or auth secrets.
- Payment diagnostics do not expose raw provider payloads.
- Payment/audit payloads return allowlisted `payload_summary` / `metadata_summary` fields only.
- Notification list masks recipient email addresses.
- Player-facing private fields remain unchanged and protected by existing APIs.
- No Razorpay key secret, webhook secret, SMTP password, or raw webhook body is exposed.

## Frontend Routes Added

- `/admin`
- `/admin/dashboard`
- `/admin/users`
- `/admin/organizers`
- `/admin/tournaments`
- `/admin/registrations`
- `/admin/payments`
- `/admin/payments/[paymentRecordId]`
- `/admin/notifications`
- `/admin/reconciliation`
- `/admin/audit`

Frontend files added:

- `apps/frontend/components/custom/admin/admin-shell.tsx`
- `apps/frontend/components/custom/admin/admin-dashboard-view.tsx`
- `apps/frontend/components/custom/admin/admin-collection-view.tsx`
- `apps/frontend/components/custom/admin/admin-payment-detail-view.tsx`
- `apps/frontend/components/custom/admin/admin-format.ts`
- `apps/frontend/hooks/use-admin.ts`
- `apps/frontend/app/admin/**`

The UI uses existing global CSS and read-only cards/tables. No edit forms or destructive controls were added.

## SDK Generation

OpenAPI and SDK were regenerated because backend HTTP contracts changed:

- `pnpm generate:openapi`
- `pnpm generate:sdk`

Generated SDK additions include `AdminApi` and admin DTO models under `libs/client_sdk`.

## Smoke And CI

`scripts/mvp-smoke.mjs` now verifies:

- admin seed login works
- `PLAYER` cannot access `/admin/dashboard`
- `ORGANIZER` cannot access `/admin/dashboard`
- `ADMIN` can access `/admin/dashboard`
- admin user list does not expose password/token hash fields
- admin payment diagnostics do not expose internal manual payment/refund notes
- admin notification list masks recipient email addresses when present

No CI workflow changes were required beyond the existing smoke script behavior.

## Database And Migrations

No schema changes were made. No migration was created.

## Known Limitations

- Admin support pages are read-only by design.
- Admin notification retry/send actions are deferred.
- Admin payment/refund execution actions are deferred.
- No platform-wide CSV exports or reporting dashboards were added.
- Search and filtering are intentionally basic.

## Recommended Next Phase

Phase 11B: platform moderation and support actions with audit trails, such as organizer verification review, tournament blocking/unblocking, notification retry, and carefully permissioned support actions.

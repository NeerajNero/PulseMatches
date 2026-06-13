# Phase 11C: CSV Exports And Lightweight Reporting Notes

## Summary

Phase 11C adds safe CSV exports for organizer-owned tournament operations and ADMIN support workflows. The phase is reporting-only: no moderation, payment mutation, refund execution, notification sending/editing, or destructive controls were added.

Implemented:

- Organizer CSV exports for registrations, participants, teams/members, payments, and fixture results.
- Admin CSV exports for users, organizers, tournaments, registrations, payments, notifications, and audit events.
- Export buttons on existing organizer and admin pages.
- Shared CSV escaping and formula-injection protection.
- Configurable export row limit.
- Audit logging for export actions.

## Schema And Migration

No database schema changes were required and no migration was created.

Existing `AuditLog` records are reused for export audit trails.

## Backend Endpoints Added

Organizer-owned exports:

- `GET /organizer/tournaments/:id/registrations/export.csv`
- `GET /organizer/tournaments/:id/participants/export.csv`
- `GET /organizer/tournaments/:id/teams/export.csv`
- `GET /organizer/tournaments/:id/payments/export.csv`
- `GET /organizer/tournaments/:id/fixtures/:fixtureSetId/results/export.csv`

Admin support exports:

- `GET /admin/users/export.csv`
- `GET /admin/organizers/export.csv`
- `GET /admin/tournaments/export.csv`
- `GET /admin/registrations/export.csv`
- `GET /admin/payments/export.csv`
- `GET /admin/notifications/export.csv`
- `GET /admin/audit-events/export.csv`

All exports require the same JWT role checks as their corresponding pages.

## CSV Safety Rules

- CSV cells are quoted and embedded quotes are escaped.
- Values beginning with `=`, `+`, `-`, or `@` after leading whitespace are prefixed to reduce spreadsheet formula-injection risk.
- Responses use `text/csv; charset=utf-8`.
- Responses set `Content-Disposition` attachment filenames.
- Header rows are included even when no data rows match.

## Export Row Limit

`EXPORT_MAX_ROWS` defaults to `5000`.

If an export would exceed the configured limit, the API returns `400` and asks the user to refine filters. Exports are generated on demand and are not stored.

## Audit Behavior

Export actions write `AuditLog` rows with safe metadata only:

- actor user id
- actor role
- export type
- tournament id or fixture set id where applicable
- filters used
- row count
- export timestamp

The audit event never stores exported row data.

Organizer audit actions:

- `organizer.export_registrations`
- `organizer.export_participants`
- `organizer.export_teams`
- `organizer.export_payments`
- `organizer.export_results`

Admin audit actions:

- `admin.export_users`
- `admin.export_organizers`
- `admin.export_tournaments`
- `admin.export_registrations`
- `admin.export_payments`
- `admin.export_notifications`
- `admin.export_audit_events`

## Privacy And Sanitization

Exports do not include password hashes, refresh token hashes, JWT secrets, SMTP secrets, Razorpay secrets, webhook secrets, raw provider payloads, or raw notification content.

Admin notification exports use the same masked recipient email summary as the admin notification list. Payment exports exclude internal payment/refund notes. Organizer exports are scoped to organizer-owned tournaments only.

## Frontend Changes

Added:

- `ExportCsvButton`
- authenticated CSV download helper

Enhanced organizer pages:

- `/organizer/tournaments/[id]/registrations`
- `/organizer/tournaments/[id]/participants`
- `/organizer/tournaments/[id]/teams`
- `/organizer/tournaments/[id]/payments`
- `/organizer/tournaments/[id]/fixtures/[fixtureSetId]`

Enhanced admin pages:

- `/admin/users`
- `/admin/organizers`
- `/admin/tournaments`
- `/admin/registrations`
- `/admin/payments`
- `/admin/notifications`
- `/admin/audit`

No export button was added for reconciliation runs because Phase 11C did not add a reconciliation CSV endpoint.

## SDK Generation

Backend HTTP contracts changed, so OpenAPI and SDK were regenerated:

- `pnpm generate:openapi`
- `pnpm generate:sdk`

The frontend uses a small authenticated download helper for CSV files because generated JSON SDK methods are awkward for browser file downloads. Generated SDK remains the source for JSON APIs.

## Smoke And CI

`scripts/mvp-smoke.mjs` was updated to verify:

- PLAYER cannot access admin CSV exports.
- ADMIN can export users and payments.
- Organizer can export owned registrations and payments.
- Organizer cannot export another organizer's tournament data.
- Admin notification exports keep recipient emails masked.
- CSV exports include header rows.
- CSV exports avoid forbidden markers such as password, token, secret, webhook, raw payload, and key secret.
- Export audit events are created.

The smoke script now creates a fresh published paid tournament/category for registration, payment, and export checks so those checks do not depend on date-sensitive seed registration windows.

CI does not need real payment or notification provider credentials.

## Known Limitations

- Exports are synchronous and capped by `EXPORT_MAX_ROWS`.
- No background export jobs or scheduled reports exist.
- No stored export files exist.
- No reconciliation CSV export was added.
- Date range filters are deferred.
- Export UX is intentionally simple and uses browser downloads.

## Recommended Next Phase

Phase 11D: add focused operational reporting refinements such as date-range filters, reconciliation-run export, or support-safe aggregate reports. Keep moderation/payment mutation controls out of scope unless explicitly planned.

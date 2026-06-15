# Phase 11D: Reporting Refinements And Export Improvements

## Summary

Phase 11D keeps reporting read-only while adding date-range filtering, support-safe aggregate summaries, and reconciliation-run CSV export.

Implemented:

- Organizer tournament report summary endpoint.
- Organizer registration and payment report CSV exports with date-range filters.
- Admin platform report summary endpoint.
- Admin payment, registration, and reconciliation-run report CSV exports.
- Date-range filters on report-capable list/export views.
- Frontend summary cards and export controls on existing organizer/admin pages.
- Smoke coverage for report authorization, invalid date validation, CSV headers, and export privacy.

## Backend Endpoints Added

Organizer:

- `GET /organizer/tournaments/:id/reports/summary`
- `GET /organizer/tournaments/:id/reports/payments/export.csv`
- `GET /organizer/tournaments/:id/reports/registrations/export.csv`

Admin:

- `GET /admin/reports/summary`
- `GET /admin/reports/payments/export.csv`
- `GET /admin/reports/registrations/export.csv`
- `GET /admin/reconciliation-runs/export.csv`

Existing admin and organizer payment/registration list endpoints now accept optional `from` and `to` query params where applicable.

## Date-Range Behavior

Supported query params:

- `from`
- `to`

Both accept ISO date strings or ISO date-time strings.

Date-only values are interpreted in UTC:

- `from=2026-06-01` means `2026-06-01T00:00:00.000Z`.
- `to=2026-06-30` means `2026-06-30T23:59:59.999Z`.

If only `from` is provided, records are filtered from that timestamp onward. If only `to` is provided, records are filtered up to that timestamp. Invalid dates return `400`. If `from` is after `to`, the API returns `400`.

The range applies to model creation timestamps for report consistency:

- registrations: `Registration.createdAt`
- payments: `PaymentRecord.createdAt`
- reconciliation runs: `PaymentReconciliationRun.startedAt`
- summaries: each aggregate uses the relevant model creation timestamp

## CSV And Export Behavior

Phase 11D reuses the Phase 11C CSV utility:

- UTF-8 CSV with header rows.
- Formula-injection protection for cells beginning with `=`, `+`, `-`, or `@`.
- `text/csv; charset=utf-8` responses.
- `Content-Disposition` attachment filenames.
- `EXPORT_MAX_ROWS` cap with `400` when exceeded.
- Synchronous generation only.
- No stored export files.

## Audit Behavior

New export audit actions:

- `organizer.export_payment_report`
- `organizer.export_registration_report`
- `admin.export_reconciliation_runs`
- `admin.export_payment_report`
- `admin.export_registration_report`

Audit metadata includes actor, role, export type, filters, row count, and timestamp. It does not include exported row data.

Report summary views are not audit-logged to avoid noisy read-audit volume.

## Privacy And Sanitization

Reports and exports do not expose:

- password hashes
- token/JWT fields
- SMTP secrets
- Razorpay secrets
- webhook secrets
- raw webhook payloads
- raw provider payloads
- internal payment/refund notes

Organizer reports remain tournament ownership-scoped. Admin report exports use support-safe fields only.

## Frontend Changes

Enhanced organizer pages:

- `/organizer/tournaments/[id]/registrations`
- `/organizer/tournaments/[id]/payments`

Added:

- date-range filters
- report summary cards
- report CSV export buttons

Enhanced admin pages:

- `/admin/dashboard`
- `/admin/registrations`
- `/admin/payments`
- `/admin/reconciliation`

Added:

- platform report summary cards on dashboard
- date-range filters for report-capable admin lists
- payment/registration report export buttons
- reconciliation-run CSV export button

No new routes were added.

## SDK Generation

Backend HTTP contracts changed, so SDK regeneration is required:

- `pnpm generate:openapi`
- `pnpm generate:sdk`

In this environment, `pnpm generate:openapi` initially failed because no backend was listening on `127.0.0.1:3010`. The frontend report summary hooks use the existing authenticated fetch pattern until regenerated SDK methods are available.

## Smoke And CI

`scripts/mvp-smoke.mjs` now checks:

- admin report summary returns data for ADMIN.
- player cannot access admin report summary.
- invalid admin report date returns `400`.
- organizer report summary returns data for owned tournament.
- player cannot access organizer report summary.
- invalid organizer report date returns `400`.
- admin payment report CSV exports safely.
- organizer payment report CSV exports safely.
- admin reconciliation-run CSV export includes headers and avoids forbidden markers.

No CI environment changes were required. Docker workflow is unchanged.

## Known Limitations

- Reports are synchronous and capped by `EXPORT_MAX_ROWS`.
- No background report jobs.
- No saved report files.
- No scheduled report delivery.
- Date-range filtering is creation-time based; paid-at and completed-at reporting can be added later if product needs require it.
- Report summary views are not audited.

## Recommended Next Phase

Phase 12A: focused production-hardening and observability, such as structured request logging, error-rate visibility, health/readiness detail, and operational runbooks. Keep moderation/payment mutation expansion separate unless explicitly planned.

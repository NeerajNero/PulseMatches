# Phase 11B: Admin Actions And Audit Notes

## Summary

Phase 11B adds two narrow ADMIN-only support action areas:

- Organizer verification review.
- Notification outbox retry/skip controls.

No broad moderation, user suspension/deletion, tournament takedown, payment mutation, refund execution, notification content editing, provider reconciliation controls, or Razorpay refund execution was added.

## Schema And Migration

No schema changes were required and no migration was created.

Existing schema reused:

- `OrganizerProfile.verificationStatus`
- `OrganizerVerificationStatus`: `PENDING`, `VERIFIED`, `REJECTED`
- `NotificationOutbox.status`
- `NotificationStatus`: `PENDING`, `PROCESSING`, `SENT`, `FAILED`, `SKIPPED`
- `AuditLog`

Verification reasons and transition metadata are stored in sanitized audit metadata rather than new organizer columns.

## Backend Endpoints Added

All endpoints require JWT auth and `ADMIN` role:

- `GET /admin/organizers/:organizerId`
- `PATCH /admin/organizers/:organizerId/verify`
- `PATCH /admin/organizers/:organizerId/reject`
- `PATCH /admin/organizers/:organizerId/reset-verification`
- `PATCH /admin/notifications/:notificationId/retry`
- `PATCH /admin/notifications/:notificationId/skip`

Existing read-only admin list endpoints remain unchanged.

## Organizer Verification Behavior

- New organizers still start as `PENDING`.
- `verify` marks an organizer `VERIFIED`.
- Verifying an already verified organizer is idempotent.
- `reject` marks a pending organizer `REJECTED`.
- Rejecting an already rejected organizer is idempotent.
- Rejecting an already verified organizer is blocked; support must reset to pending first.
- `reset-verification` moves verified or rejected organizers back to `PENDING`.
- Existing organizer publish behavior is preserved: only verified organizers can publish tournaments.

## Notification Retry And Skip Behavior

- `retry` is allowed only for `FAILED` or `SKIPPED` notifications.
- Retry moves the row back to `PENDING`, clears delivery error fields, resets attempts to `0`, and lets the existing one-shot processor handle delivery later.
- `skip` is allowed only for `PENDING` or `FAILED` notifications.
- Skip marks the row `SKIPPED`, stores a safe reason in `lastError`, and does not edit notification content.
- `SENT` notifications cannot be retried or skipped.
- `PROCESSING` notifications cannot be skipped because stale processing detection is not implemented.
- No send-now endpoint was added; processing remains CLI-driven through `pnpm notifications:process`.

## Audit Behavior

Admin actions write `AuditLog` rows:

- `admin.organizer_verified`
- `admin.organizer_rejected`
- `admin.organizer_verification_reset`
- `admin.notification_retry_requested`
- `admin.notification_skipped`

Audit metadata includes safe IDs and transition fields:

- `admin_user_id`
- `organizer_profile_id`
- `organizer_user_id`
- `notification_id`
- `previous_status`
- `next_status`
- `reason`, when provided

Admin audit APIs continue to expose only allowlisted metadata summaries.

## Frontend Changes

Added:

- `/admin/organizers/[organizerId]`
- `AdminOrganizerDetailView`
- organizer verification controls on `/admin/organizers`
- organizer detail, recent tournaments, and verification audit view
- notification retry/skip controls on `/admin/notifications`
- React Query hooks for organizer detail/actions and notification actions

All actions use confirmation prompts. No edit forms, destructive controls, payment controls, or broad moderation controls were added.

## SDK Generation

OpenAPI and SDK were regenerated:

- `pnpm generate:openapi`
- `pnpm generate:sdk`

Generated SDK now includes organizer verification request/response DTOs and notification action methods on `AdminApi`.

## Smoke And CI

`scripts/mvp-smoke.mjs` now verifies:

- PLAYER cannot verify organizers.
- ORGANIZER cannot verify themselves through admin endpoints.
- ADMIN can verify an isolated organizer.
- A verified isolated organizer can publish a valid tournament.
- ADMIN can reject and reset an isolated organizer.
- Organizer verification audit is written.
- PLAYER cannot skip notifications through admin endpoints.
- ORGANIZER cannot retry notifications through admin endpoints.
- ADMIN can skip a pending notification and retry it back to pending.
- Notification retry audit is written.

CI workflow did not require changes. It remains mock-payment and noop-notification safe.

## Known Limitations

- There is no dedicated verification notes table; decision reasons live in audit metadata.
- There are no organizer verification notification emails in this phase.
- Notification retry only returns records to pending; it does not invoke delivery immediately.
- Stale `PROCESSING` notification recovery is deferred.
- No bulk actions were added.

## Recommended Next Phase

Phase 11C: add production-safe support workflows around verification review history and stale notification recovery, or add narrowly scoped organizer verification notification events through the existing outbox.

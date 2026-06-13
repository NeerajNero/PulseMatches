# Phase 10A Manual Payment Tracking Implementation Notes

## Summary

Phase 10A adds an internal manual/offline payment foundation for tournament registrations. It does not integrate a real payment gateway, create checkout sessions, collect card/UPI/bank credentials, or add webhooks.

The implementation keeps the existing `Registration.paymentMode`, `Registration.paymentStatus`, `feeAmount`, and `feeCurrency` fields as the user-facing summary source, and adds `PaymentRecord` as the current auditable manual payment row for each registration.

## Schema And Migration

Migration: `20260608190000_011_manual_payment_tracking`

Changes:

- Added `RegistrationPaymentStatus.WAIVED`.
- Added `PaymentProvider` enum:
  - `MANUAL`
  - `FUTURE_PROVIDER`
- Added notification types:
  - `PAYMENT_MARKED_PAID`
  - `PAYMENT_MARKED_FAILED`
  - `PAYMENT_WAIVED`
- Added `PaymentRecord` with:
  - registration/tournament/category/user references
  - provider, mode, status
  - amount and currency
  - manual reference
  - organizer-only internal notes
  - paid timestamp
  - verifier user reference
  - timestamps

Constraints and indexes:

- One `PaymentRecord` per registration via unique `registration_id`.
- Non-negative payment amount check constraint.
- Indexes on registration, tournament, category, user, status, and provider.

Existing registrations without payment records are still readable through registration fields; payment rows are created for new registrations and lazily created when an organizer updates a registration payment.

## Backend Endpoints Added

- `GET /organizer/tournaments/:id/payments`
  - Lists registration payment rows for an organizer-owned tournament.
  - Supports `category_id`, `status`, and `search` filters.

- `PATCH /organizer/tournaments/:id/registrations/:registrationId/payment`
  - Updates manual payment status for an owned tournament registration.
  - Allowed statuses: `pending_offline`, `paid`, `failed`, `refunded`, `waived`.
  - Accepts optional `reference`, `internal_notes`, and `paid_at`.
  - Updates both `Registration.paymentStatus` and the current `PaymentRecord`.
  - Blocks free registrations from manual payment updates.

Existing player endpoint enhancement:

- `GET /me/registrations`
  - Now includes a safe `payment` summary with mode, status, amount, currency, offline instructions, and paid date.
  - Does not expose organizer internal notes.

## Payment Status Rules

- Paid categories create registrations with:
  - `paymentMode = OFFLINE`
  - `paymentStatus = PENDING_OFFLINE`
  - a `PaymentRecord` with provider `MANUAL`

- Free categories create registrations with:
  - `paymentMode = FREE`
  - `paymentStatus = NOT_REQUIRED`
  - a `PaymentRecord` with provider `MANUAL`

- Organizers can mark paid-category registrations as:
  - `PENDING_OFFLINE`
  - `PAID`
  - `FAILED`
  - `REFUNDED`
  - `WAIVED`

- Players cannot update payment status.
- Payment status does not approve a registration or create a participant. Roster approval remains separate.

## Notification Changes

The existing notification outbox is used for payment outcome notifications:

- `PAYMENT_MARKED_PAID`
- `PAYMENT_MARKED_FAILED`
- `PAYMENT_WAIVED`

These are enqueued only when an organizer changes a payment to `PAID`, `FAILED`, or `WAIVED`. No real email delivery behavior changed; noop/log/smtp providers remain controlled by Phase 9B configuration.

## Frontend Changes

Added route:

- `/organizer/tournaments/[id]/payments`

Added organizer UI:

- Payment list with filters by status, category, and search.
- Payment status badge, amount/currency, player, category, registration status, reference, and paid date.
- Manual update form for status, reference, paid date, and internal notes.
- Free registrations are displayed but cannot be manually updated.

Updated player UI:

- `/account/registrations` now shows payment amount/status and offline instructions.
- Tournament detail registration panel “already registered” state shows amount/status.

## SDK Result

OpenAPI and SDK were regenerated after backend changes:

- `pnpm generate:openapi`
- `pnpm generate:sdk`

New generated SDK models include:

- `OrganizerPaymentDto`
- `OrganizerPaymentListApiResponseDto`
- `OrganizerPaymentApiResponseDto`
- `RegistrationPaymentSummaryDto`
- `UpdateRegistrationPaymentRequestDto`

## Smoke And CI Updates

`scripts/mvp-smoke.mjs` now verifies:

- paid category registration defaults to `pending_offline`
- payment summary amount matches category fee
- player cannot call organizer payment update endpoint
- organizer can mark payment as paid
- organizer payment list includes the updated registration
- player registration list reflects paid status
- organizer internal payment notes are not exposed to player payloads

No real payment provider is required. CI continues to use local/disposable infrastructure and noop notifications.

## Security And Privacy Notes

- No sensitive payment credentials are collected or stored.
- No checkout sessions, payment webhooks, or gateway tokens exist.
- Organizer internal notes are protected by organizer-only endpoints.
- Player registration payloads expose only safe payment summary fields.
- Organizer ownership checks are reused from organizer roster management.
- Payment status does not imply registration approval.

## Known Limitations

- Existing registrations created before this migration may not have a `PaymentRecord` until updated; they still display from registration payment fields.
- There is one current payment record per registration, not a full immutable payment event ledger.
- Refunds are manual status tracking only; no money movement is performed.
- Currency is stored on category/registration/payment rows and defaults to INR where existing data does.
- No real provider integration, checkout, or webhook handling is implemented.

## Future Real-Provider Plan

Recommended next payment phase:

1. Add provider-neutral payment intent/order model separate from manual `PaymentRecord`.
2. Add provider enum values only when an actual provider is selected.
3. Add checkout session creation and webhook verification behind provider-specific services.
4. Keep manual payment as a fallback path.
5. Add immutable payment event history before real money movement.

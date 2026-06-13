# Phase 10D Payment Ops Hardening Notes

## Summary

Phase 10D adds payment operations visibility and refund/reconciliation scaffolding without adding another payment provider or executing real refunds. Manual/offline, mock, and Razorpay payment flows remain intact.

Implemented:

- Organizer-safe payment diagnostics for owned tournament registrations.
- Immutable `PaymentRefund` records for manual refund tracking and Razorpay refund requests.
- `PaymentReconciliationRun` records for one-shot reconciliation visibility.
- One-shot reconciliation command: `pnpm payments:reconcile`.
- Player-safe refund summaries on registration/payment responses.
- Organizer payment UI diagnostics and refund form.
- MVP smoke coverage for manual refund safety.

## Schema And Migration

Migration:

- `20260608220000_014_payment_ops_hardening`

Added enums:

- `PaymentRefundStatus`: `REQUESTED`, `APPROVED`, `PROCESSING`, `SUCCEEDED`, `FAILED`, `CANCELLED`, `MANUAL_RECORDED`
- `PaymentReconciliationStatus`: `STARTED`, `COMPLETED`, `FAILED`

Added models:

- `PaymentRefund`
- `PaymentReconciliationRun`

No destructive schema changes were made. Existing `PaymentRecord`, `PaymentIntent`, `PaymentAttempt`, and `PaymentEvent` remain the payment lifecycle foundation.

## Backend APIs

Added organizer-owned endpoints:

- `GET /organizer/tournaments/:id/payments/:registrationId`
- `POST /organizer/tournaments/:id/registrations/:registrationId/refunds`

Enhanced existing responses:

- `GET /me/registrations`
- `GET /me/registrations/:registrationId/payment`
- `GET /organizer/tournaments/:id/payments`

## Refund Behavior

Manual/offline and mock payments:

- Organizers can record manual refunds for owned tournament registrations.
- Refund amount must be positive.
- Cumulative recorded refund amount cannot exceed the paid amount.
- Full manual refund updates `PaymentRecord.status` and `Registration.paymentStatus` to `REFUNDED`.
- Partial manual refunds remain tracked as refund records while the payment summary remains `PAID`.

Razorpay payments:

- Organizers can create refund request records.
- The application does not call the Razorpay refund API in Phase 10D.
- Real provider refund execution is deferred.

Players:

- Can view safe refund status, count, amount, and processed date.
- Cannot create refunds.
- Never receive organizer internal notes.

## Reconciliation Behavior

Commands:

- `pnpm payments:reconcile`
- `pnpm --filter @matchflow/backend payments:reconcile`

Environment:

- `PAYMENT_RECONCILIATION_PROVIDER=manual|mock|razorpay`
- `PAYMENT_RECONCILIATION_LIMIT=25`

Manual/mock:

- Runs deterministic internal checks and records a reconciliation run.
- Does not call external services.

Razorpay:

- Requires Razorpay credentials.
- Fetches recent non-final Razorpay order statuses.
- Records `reconciliation.checked` payment events for successful provider checks.
- Does not mark payments paid unless existing verified checkout/webhook paths do so.
- Does not execute refunds.

## Razorpay Hardening

Phase 10D keeps the Phase 10C verified paths intact:

- Checkout success still requires server-side signature verification.
- Webhooks still require signed raw-body verification.
- Duplicate success/failure processing remains idempotent through existing event and status guards.
- Failed provider events do not overwrite already-paid payments.

## Frontend Changes

Enhanced:

- `/organizer/tournaments/[id]/payments`
- `/account/registrations`

Organizer payment rows now support:

- Diagnostics expansion.
- Intent summaries.
- Event summaries with sanitized payload data only.
- Refund summaries.
- Manual refund/request form.

Player registrations now show:

- Safe refund status.
- Refunded amount.
- Latest processed date where available.

## Security And Privacy

- No card, UPI, bank, CVV, OTP, or other sensitive payment credentials are collected or stored.
- Organizer diagnostics never expose Razorpay secrets or webhook secrets.
- Organizer diagnostics do not expose raw webhook payloads.
- Player responses do not expose organizer internal payment/refund notes.
- Refund operations are organizer-owned and role-protected.
- Reconciliation is one-shot and idempotent-oriented.

## SDK And CI

SDK regenerated because backend HTTP contracts changed:

- `pnpm generate:openapi`
- `pnpm generate:sdk`

CI remains mock/manual-safe and does not require Razorpay credentials.

## Validation Results

Commands run:

- `pnpm --filter @matchflow/backend prisma:generate` - passed
- `pnpm --filter @matchflow/backend prisma:deploy` - passed against local Docker PostgreSQL; applied `20260608220000_014_payment_ops_hardening`
- `pnpm --filter @matchflow/backend typecheck` - passed
- `pnpm --filter @matchflow/backend lint` - passed
- `pnpm --filter @matchflow/backend build` - passed
- `pnpm --filter @matchflow/frontend typecheck` - passed
- `pnpm --filter @matchflow/frontend lint` - passed
- `pnpm --filter @matchflow/frontend build` - passed
- `pnpm typecheck` - passed
- `pnpm lint` - passed
- `pnpm build` - passed
- `node --check scripts/mvp-smoke.mjs` - passed
- `node --check apps/backend/src/scripts/reconcile-payments.ts` - passed
- `pnpm generate:openapi` - passed after starting the local backend
- `pnpm generate:sdk` - passed
- `pnpm smoke:mvp` - passed with `PAYMENT_PROVIDER=mock`
- `PAYMENT_PROVIDER=mock PAYMENT_RECONCILIATION_PROVIDER=mock pnpm payments:reconcile` - passed
- `pnpm verify:mvp` - passed

Real Razorpay reconciliation/refund tests were not run because no Razorpay credentials were provided and Phase 10D does not execute real provider refunds.

## Smoke Coverage

Updated `scripts/mvp-smoke.mjs` to verify:

- Manual payment mark-paid still works.
- Organizer payment diagnostics load.
- Over-refund is rejected.
- Player cannot create refund through organizer endpoint.
- Organizer can record full manual refund.
- Player sees safe refund summary.
- Internal refund notes are not exposed to player payloads.

## Known Limitations

- Real Razorpay refund API execution is not implemented.
- Razorpay reconciliation records order-status checks but does not infer missing payment IDs.
- No platform-wide admin payment dashboard exists.
- No dispute, chargeback, settlement, payout, subscription, or split-payment workflows exist.

## Recommended Next Phase

Phase 10E or Phase 11 should select one of:

- Razorpay refund execution with explicit sandbox-first safeguards.
- Admin/support payment operations dashboard.
- Production observability and payment alerting.
- Payment concurrency tests around webhook/checkout races.

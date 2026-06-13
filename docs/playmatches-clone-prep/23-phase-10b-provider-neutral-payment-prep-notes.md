# Phase 10B Provider-Neutral Payment Prep Notes

## Summary

Phase 10B prepares the MVP for a future real payment gateway without integrating a gateway or moving money. Manual/offline payments remain supported and unchanged for organizers. Paid player registrations can now start a provider-neutral online payment intent when the backend is configured with the local `mock` provider.

No card, UPI, bank, checkout-session, real webhook, or provider SDK integration was added.

## Schema And Migration

Migration: `20260608200000_012_provider_neutral_payment_prep`

Schema changes:

- Extended `RegistrationPaymentMode` with `ONLINE_PROVIDER`.
- Extended `PaymentProvider` with `MOCK`.
- Added `PaymentIntentMode`: `ONLINE`, `OFFLINE`, `FREE`.
- Added `PaymentIntentStatus`: `CREATED`, `REQUIRES_ACTION`, `PROCESSING`, `SUCCEEDED`, `FAILED`, `CANCELLED`, `EXPIRED`.
- Added `PaymentAttemptStatus`: `STARTED`, `REDIRECTED`, `SUCCEEDED`, `FAILED`, `CANCELLED`, `EXPIRED`.
- Added `PaymentIntent`.
- Added `PaymentAttempt`.
- Added immutable `PaymentEvent`.

`PaymentRecord` remains the current registration payment summary. `PaymentIntent`, `PaymentAttempt`, and `PaymentEvent` track future-provider lifecycle data around that summary.

## Backend Changes

Added:

- `apps/backend/src/api/payments/*`
- `apps/backend/src/db/payments/*`
- `apps/backend/src/payments/payment-provider.service.ts`

New API endpoints:

- `POST /me/registrations/:registrationId/payment-intent`
- `GET /me/registrations/:registrationId/payment`
- `POST /payments/mock/complete`
- `POST /payments/webhooks/:provider` (`mock` only in this phase)

Player payment-intent rules:

- Requires authenticated `PLAYER`.
- Player can only create/view payment intents for their own registration.
- Free/not-required registrations are rejected.
- Cancelled/rejected registrations are rejected.
- Settled registrations (`PAID`, `WAIVED`) are rejected.
- Existing active intent is reused.
- Payment status becomes `PAID` only through the mock provider completion path, not client-reported success.

Organizer manual payment rules:

- Existing manual organizer payment endpoints remain supported.
- Organizer manual updates keep using `PaymentProvider.MANUAL`.
- Manual organizer updates do not delete or rewrite provider event history.

## Mock Provider

`PAYMENT_PROVIDER=mock` enables local/CI provider-neutral behavior:

- Creates fake provider intent ids.
- Creates fake checkout URLs under `PAYMENT_MOCK_CHECKOUT_BASE_URL` or `FE_APP_URL`.
- Records a `PaymentAttempt`.
- Records `PaymentEvent` rows for intent creation and success.
- Supports `POST /payments/mock/complete` for the owning player in non-production.
- Supports `POST /payments/webhooks/:provider` as a future webhook shape in non-production, with `mock` as the only accepted provider in this phase.

`PAYMENT_PROVIDER=manual` keeps online intent creation disabled.

## Frontend Changes

Updated:

- `apps/frontend/lib/apis/api.ts`
- `apps/frontend/hooks/use-registrations.ts`
- `apps/frontend/components/custom/registrations/registration-list.tsx`
- `apps/frontend/components/custom/organizer/organizer-payment-management-view.tsx`

Player account registrations now show:

- payment provider/mode/status
- latest mock intent status
- mock checkout link when present
- dev-safe mock completion action when available

Organizer payment management now shows:

- current payment provider
- latest intent provider/status
- provider reference
- payment event count

No payment credentials are collected. No real checkout UI was added.

## SDK

Regenerated:

- `openapi.json`
- `libs/client_sdk`

New SDK API:

- `PaymentsApi`

## Environment

Added env variables:

- `PAYMENT_PROVIDER=manual | mock`
- `PAYMENT_DEFAULT_CURRENCY=INR`
- `PAYMENT_MOCK_CHECKOUT_BASE_URL=http://localhost:3002`
- `PAYMENT_INTENT_EXPIRY_MINUTES=30`
- `PAYMENT_WEBHOOK_SECRET=`

CI uses `PAYMENT_PROVIDER=mock` so the smoke script can exercise provider-neutral online payment behavior without real credentials.

## Smoke And CI

Updated `scripts/mvp-smoke.mjs` to cover:

- paid registration defaulting to pending offline payment
- mock payment intent creation when `PAYMENT_PROVIDER=mock`
- ownership rejection for another player's registration
- free registration rejecting online payment intent creation
- mock completion marking the payment paid
- `PaymentEvent` count being recorded
- organizer payment list showing mock provider and succeeded intent
- existing manual payment flow still passing

No real provider credentials are required.

## Security And Privacy

- Players cannot create or complete intents for another user's registration.
- Public endpoints do not expose payment internals.
- Organizer internal notes stay organizer-only.
- Mock completion is disabled in production.
- No sensitive payment credentials are collected or stored.
- Provider events are append-only records in normal application flow.

## Known Limitations

- No real provider is integrated.
- No real checkout session is created.
- The mock webhook endpoint is non-production only and intended for integration-shape validation.
- Duplicate active intent prevention is service-level, not a partial unique database constraint.
- Payment status transitions are basic and will need provider-specific hardening in a real gateway phase.

## Recommended Next Phase

Select one real payment provider and implement it behind the existing provider abstraction. The next phase should add provider-specific intent creation, webhook signature verification, provider sandbox smoke coverage, and production-ready failure handling without changing the public payment UI shape.

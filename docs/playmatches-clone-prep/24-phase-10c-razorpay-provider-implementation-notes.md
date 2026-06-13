# Phase 10C: Razorpay Provider Implementation Notes

## Summary

Phase 10C adds Razorpay as the first real online payment provider behind the provider-neutral payment architecture from Phase 10B. Manual/offline payments and the mock provider remain supported, and local/CI defaults still avoid real provider credentials.

No refunds, subscriptions, split payments, admin moderation, sensitive payment collection, or additional providers were added.

## Backend Changes

- Added `PaymentProvider.RAZORPAY` to Prisma.
- Added Razorpay configuration validation in `apps/backend/src/config/env.validation.ts`.
- Enabled Nest raw body support in `apps/backend/src/main.ts` with `rawBody: true` so webhook signatures can be verified without changing normal JSON route behavior.
- Extended `apps/backend/src/payments/payment-provider.service.ts` with:
  - Razorpay order creation using direct HTTPS `fetch`.
  - Checkout signature verification with HMAC SHA256 over `razorpay_order_id|razorpay_payment_id`.
  - Webhook signature verification with HMAC SHA256 over the raw body.
  - Checkout metadata helpers for key id, name, description, and provider amount conversion.
- Extended payment persistence in `apps/backend/src/db/payments/*` with:
  - Razorpay intent creation.
  - Razorpay success reconciliation.
  - Razorpay failed-payment reconciliation.
  - immutable `PaymentEvent` records for Razorpay order, checkout, and webhook events.
- Extended `apps/backend/src/api/payments/*` with:
  - Razorpay payment intent creation when `PAYMENT_PROVIDER=razorpay`.
  - authenticated checkout verification.
  - signed Razorpay webhook handling.
  - idempotent duplicate webhook handling by provider event id.
  - payment-paid and payment-failed notification enqueueing through the existing notification service.

## Database / Migration

Migration created and applied locally:

- `20260608210000_013_razorpay_payment_provider`

Migration contents:

- Adds `RAZORPAY` to the existing `PaymentProvider` enum.

No payment credential fields were added. Existing `PaymentIntent`, `PaymentAttempt`, `PaymentEvent`, `PaymentRecord`, and `Registration.paymentStatus` state are reused.

## Environment Variables

Documented in `.env.example`, `apps/backend/.env.example`, `docker-compose.yml`, and `docs/command-map.md`:

- `PAYMENT_PROVIDER=manual | mock | razorpay`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `RAZORPAY_CHECKOUT_NAME`
- `RAZORPAY_CHECKOUT_DESCRIPTION`
- existing `PAYMENT_DEFAULT_CURRENCY`
- existing `PAYMENT_INTENT_EXPIRY_MINUTES`

Razorpay secrets are required only when `PAYMENT_PROVIDER=razorpay`. CI remains `PAYMENT_PROVIDER=mock`.

## Checkout Behavior

1. Player calls `POST /me/registrations/:registrationId/payment-intent`.
2. If `PAYMENT_PROVIDER=razorpay`, the backend creates a Razorpay Order server-side.
3. Backend stores the order id on `PaymentIntent.providerIntentId`.
4. Backend returns Checkout-ready data:
   - public key id
   - order id
   - amount
   - currency
   - checkout name/description
   - safe player prefill data
5. Frontend loads Razorpay Checkout on demand.
6. Checkout success payload is sent to the backend verify endpoint.
7. Backend verifies the signature before marking payment as paid.

## Webhook Behavior

Endpoint:

- `POST /payments/webhooks/razorpay`

Handled events:

- `order.paid`
- `payment.captured`
- `payment.failed`

Behavior:

- Validates `x-razorpay-signature` using the raw request body and `RAZORPAY_WEBHOOK_SECRET`.
- Records immutable `PaymentEvent` rows.
- Reconciles success/failure idempotently.
- Does not expose secrets or raw webhook data through public APIs.

## Frontend Changes

- `apps/frontend/hooks/use-registrations.ts`
  - Added `useVerifyRazorpayPayment`.
- `apps/frontend/components/custom/registrations/registration-list.tsx`
  - Loads Razorpay Checkout only after the player starts payment.
  - Opens Checkout with backend-returned order data.
  - Verifies checkout success through the backend.
  - Keeps mock payment simulation behavior intact.

No payment credentials are collected by the app UI.

## API / SDK

OpenAPI and SDK were regenerated.

New endpoint:

- `POST /me/registrations/:registrationId/payment/verify`

Enhanced endpoints:

- `POST /me/registrations/:registrationId/payment-intent`
- `POST /payments/webhooks/:provider`

Generated SDK now includes:

- `VerifyRazorpayPaymentRequestDto`
- `paymentsControllerVerifyRazorpayPayment`
- Razorpay checkout fields on `PaymentIntentSummaryDto`

## CI / Smoke

CI remains mock-provider based:

- `PAYMENT_PROVIDER=mock`
- empty Razorpay env placeholders

`scripts/mvp-smoke.mjs` was not changed because real Razorpay credentials must not be required for CI. Existing mock/manual payment smoke coverage remains the deterministic validation path.

## Security Notes

- `RAZORPAY_KEY_SECRET` and `RAZORPAY_WEBHOOK_SECRET` are backend-only.
- Frontend receives only `RAZORPAY_KEY_ID`.
- Payment is marked paid only after backend signature verification or a signed webhook.
- Public APIs do not expose payment internals.
- Player verification is limited to the current user's registration.
- Webhook duplicate handling is provider-event-id based.
- The mock completion endpoint remains non-production only.

## Manual Razorpay Sandbox Test Steps

1. Set `PAYMENT_PROVIDER=razorpay`.
2. Set `RAZORPAY_KEY_ID`.
3. Set `RAZORPAY_KEY_SECRET`.
4. Set `RAZORPAY_WEBHOOK_SECRET`.
5. Start backend and frontend.
6. Create or use a paid registration.
7. Open `/account/registrations`.
8. Click `Start payment`.
9. Complete Razorpay Checkout with test-mode details.
10. Confirm the backend verify endpoint marks the payment as paid.
11. Configure Razorpay Dashboard webhook delivery to `/payments/webhooks/razorpay`.
12. Confirm duplicate webhook delivery does not create duplicate paid transitions.

Real Razorpay sandbox testing was not run in this pass because no credentials were provided.

## Known Limitations

- Refunds are not implemented.
- Provider-specific order lookup/capture APIs are not implemented beyond order creation and signature/webhook reconciliation.
- Webhook events without a matching local order are rejected after recording only limited orphan event data when possible.
- Razorpay Checkout script is loaded from Razorpay at runtime and requires browser network access.
- The app does not collect or store card, UPI, bank, CVV, OTP, or similar sensitive payment data.

## Recommended Next Phase

Phase 10D or Phase 11 should focus on payment operations hardening:

- refund modeling and manual refund tracking
- provider reconciliation jobs
- payment admin/support audit views
- more automated tests around provider event idempotency
- optional Razorpay sandbox smoke that runs only when credentials are explicitly supplied

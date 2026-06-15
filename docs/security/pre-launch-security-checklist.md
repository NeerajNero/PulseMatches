# Pre-Launch Security Checklist

Use this checklist before exposing the MVP beyond a controlled test environment.

## Auth And Token Storage

- Confirm `JWT_ACCESS_TOKEN_SECRET` and `JWT_REFRESH_TOKEN_SECRET` are strong, unique production secrets.
- Confirm access-token expiry remains short.
- Confirm refresh tokens are hashed at rest.
- Current frontend token storage is `localStorage` in `apps/frontend/lib/auth-token-store.ts`.
- Risk: XSS can read localStorage tokens.
- Required mitigation before broad launch: review all XSS surfaces, keep dependencies current, avoid rendering untrusted HTML, and plan migration to an httpOnly, secure, sameSite refresh cookie flow.
- Confirm logout clears frontend tokens and revokes provided refresh token.
- Confirm logs never include access tokens, refresh tokens, passwords, or authorization headers.

## Rate Limiting

The backend has in-process rate limits for:

- auth signup/login/refresh
- player registration creation
- payment intent creation
- mock payment completion
- Razorpay checkout verification
- payment webhooks
- admin organizer verification actions
- admin notification retry/skip actions
- admin and organizer CSV exports

Config:

- `RATE_LIMIT_TTL_SECONDS`
- `RATE_LIMIT_MAX_REQUESTS`
- `AUTH_RATE_LIMIT_MAX_REQUESTS`
- `PAYMENT_RATE_LIMIT_MAX_REQUESTS`
- `EXPORT_RATE_LIMIT_MAX_REQUESTS`

Production note: in-process limits are per backend instance and reset on restart. Add reverse-proxy, load-balancer, WAF, or platform edge rate limiting for multi-instance deployments.

## CORS And Headers

- `CORS_ORIGINS` must list exact production frontend origins.
- Wildcard/default local CORS is rejected by production config validation.
- Backend uses Helmet and disables `X-Powered-By`.
- Backend sets `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
- Frontend sets:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- Strict CSP is not enforced yet. Define and test a deployment-specific CSP that accounts for Next.js runtime behavior and Razorpay Checkout before enforcing.

## Role Boundaries

- ADMIN endpoints must require ADMIN role.
- ORGANIZER endpoints must require ORGANIZER role and tournament ownership.
- PLAYER endpoints must require PLAYER role and user ownership.
- Public endpoints must not expose draft/private data.
- Admin/support mutation scope is intentionally narrow: organizer verification and notification retry/skip only.
- Payment/refund mutation remains scoped to organizer-owned tournament registrations or trusted provider callbacks.

## Razorpay

- Never expose `RAZORPAY_KEY_SECRET` or `RAZORPAY_WEBHOOK_SECRET`.
- Frontend may receive only `RAZORPAY_KEY_ID`, order id, amount/currency, and safe display metadata.
- Checkout success must be verified server-side before payment state changes.
- Webhook verification must use the raw request body and Razorpay signature header.
- Duplicate webhook events must be idempotent.
- Mock completion endpoint must remain unavailable in production.
- Real refund execution is still deferred.

## SMTP And Notifications

- Never log `SMTP_PASS`.
- Use `NOTIFICATION_PROVIDER=smtp` only after sender/domain setup is complete.
- Store SMTP credentials in a secret manager.
- Verify SPF, DKIM, and DMARC.
- Admin notification retry/skip controls must remain ADMIN-only.
- Admin notification views should show sanitized summaries, not provider secrets.

## CSV Exports

- CSV utilities must quote values, escape quotes, and protect formula-like cells.
- Exports must enforce row caps through `EXPORT_MAX_ROWS`.
- Organizer exports must enforce tournament ownership.
- Admin exports must require ADMIN role.
- Exports must not include passwords, token hashes, SMTP secrets, Razorpay secrets, raw provider payloads, or raw webhook payloads.
- Export audit events must include actor/export metadata, not row contents.

## Public And Static Exposure

- Do not place secrets in `public/`, `.next/`, Docker build args, or browser-visible `NEXT_PUBLIC_*` vars.
- `NEXT_PUBLIC_BACKEND_URL` and `NEXT_PUBLIC_APP_NAME` are browser-visible by design.
- Review generated frontend bundles for accidental secret references before production launch.
- Keep `.env` files out of source control.

## Docker And Production Secrets

- Local Docker Compose is for development and smoke validation.
- Production should use managed or secured Postgres/Redis with backups.
- Run migrations explicitly.
- Do not run seed in production unless reviewed.
- Keep real SMTP/Razorpay/JWT/database secrets in the deployment secret manager.

## Backup And Restore

- Verify Postgres backups by restoring to a disposable database.
- Never test restore directly against production.
- Run health and smoke checks after restore validation.

## Dependency Audit

Run:

```bash
pnpm audit:deps
```

Also review:

- `pnpm outdated` manually when planning upgrades
- Docker image scan from the deployment platform or registry
- critical/high CVEs before launch

Do not bulk-upgrade dependencies without typecheck, lint, build, smoke, and provider callback verification.

## Manual Penetration-Test Checklist

- Attempt player access to admin endpoints.
- Attempt player access to organizer endpoints.
- Attempt organizer access to another organizer's tournament/payment/export endpoints.
- Attempt public access to protected endpoints.
- Attempt payment intent creation for another user's registration.
- Attempt Razorpay verify with invalid signature.
- Attempt mock payment completion in production config.
- Attempt CSV formula injection in names/notes and confirm exports neutralize formulas.
- Attempt export over row cap.
- Confirm health/readiness/operations responses contain no secrets.
- Confirm admin pages do not display raw provider payloads or secrets.

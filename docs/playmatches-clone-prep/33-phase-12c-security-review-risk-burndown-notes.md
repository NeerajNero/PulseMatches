# Phase 12C Security Review And Risk Burn-Down Notes

## Summary

Phase 12C added targeted security hardening and pre-launch documentation without changing product workflows. The primary code changes are scoped rate limiting and safe security headers. The rest of the phase documents the current risk posture and launch checks.

## Code Changes

Added backend rate-limit primitives:

- `apps/backend/src/common/rate-limit/rate-limit.decorator.ts`
- `apps/backend/src/common/rate-limit/rate-limit.guard.ts`

Registered the guard globally in `AppModule`, but it only acts on routes annotated with `@RateLimit`.

Added safe security header hardening:

- backend disables Express `X-Powered-By`
- backend keeps Helmet enabled
- backend adds `Permissions-Policy`
- frontend adds `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and `Permissions-Policy`

Added dependency audit command:

```bash
pnpm audit:deps
```

## Rate Limiting Status

Configured env vars:

- `RATE_LIMIT_TTL_SECONDS=60`
- `RATE_LIMIT_MAX_REQUESTS=120`
- `AUTH_RATE_LIMIT_MAX_REQUESTS=20`
- `PAYMENT_RATE_LIMIT_MAX_REQUESTS=30`
- `EXPORT_RATE_LIMIT_MAX_REQUESTS=20`

Rate-limited route classes:

- auth signup/login/refresh
- player registration creation
- payment intent creation
- mock payment completion
- Razorpay checkout verification
- payment webhooks
- admin organizer verification actions
- admin notification retry/skip actions
- admin CSV exports
- organizer CSV exports
- organizer payment/refund tracking mutations
- fixture generation and result publish/archive actions

Limitations:

- limits are in-process per backend instance
- limits reset on process restart
- multi-instance production deployments need edge/load-balancer/WAF rate limiting
- Redis-backed distributed throttling is deferred

## Security Headers Status

Backend:

- Helmet remains enabled.
- Express `X-Powered-By` is disabled.
- `Permissions-Policy: camera=(), microphone=(), geolocation=()` is added.

Frontend:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

Strict CSP was documented but not enforced in code because Razorpay Checkout, Next.js runtime behavior, and deployment domains need explicit testing before enforcement.

## Auth And Token Storage Review

Current state:

- backend uses bearer JWT access tokens
- refresh tokens are random values stored hashed in the database
- frontend stores access and refresh tokens in `localStorage`
- logout clears local tokens and revokes the submitted refresh token

Risk:

- XSS can read localStorage tokens.

Mitigation plan:

- keep XSS surface low and avoid rendering untrusted HTML
- continue checking that tokens are not logged
- migrate refresh tokens to httpOnly, secure, sameSite cookies in a future auth hardening phase
- define cookie/proxy trust behavior when that migration happens

## Auth And Role Boundary Review

Reviewed controller guard patterns:

- Admin controllers use `JwtAuthGuard`, `RolesGuard`, and `RoleType.ADMIN`.
- Organizer controllers use `JwtAuthGuard`, `RolesGuard`, and `RoleType.ORGANIZER`.
- Player registration/payment controllers use `JwtAuthGuard`, `RolesGuard`, and `RoleType.PLAYER`.
- Public discovery and health endpoints remain unauthenticated.
- Organizer ownership checks remain in services/repositories.
- Admin operations are read-only except previously scoped organizer verification and notification retry/skip actions.

No missing guard was found during this pass.

## Razorpay Webhook Review

Current state:

- Nest app is created with `rawBody: true`.
- Razorpay webhook verifies the raw body with `RAZORPAY_WEBHOOK_SECRET`.
- Checkout verification validates `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature` server-side.
- Payment state changes only after trusted verification or webhook.
- Duplicate provider events are handled idempotently through provider event id checks.
- Mock completion is disabled when `NODE_ENV=production`.

No Razorpay secret exposure was found in public/client payload paths.

## CSV And Export Review

Current state:

- CSV cells are quoted.
- Quotes are escaped.
- UTF-8 BOM is emitted.
- formula-like values beginning with `=`, `+`, `-`, or `@` are prefixed.
- export filenames are sanitized.
- export row caps are enforced through `EXPORT_MAX_ROWS`.
- organizer exports are ownership-scoped.
- admin exports require ADMIN role.
- export audit records include metadata and row counts, not exported row contents.

No schema changes were required.

## Notification And SMTP Review

Current state:

- noop/log providers remain safe for local/CI.
- SMTP provider requires config only when selected.
- SMTP password is passed to Nodemailer but not logged by app code.
- Admin notification retry/skip endpoints require ADMIN role and audit actions.
- Admin notification list/export surfaces sanitized summaries.

Known caution:

- log provider logs recipient email and subject by design for local debugging; avoid `NOTIFICATION_PROVIDER=log` in production if email addresses are considered sensitive in logs.

## File And Static Exposure Review

Reviewed frontend env usage:

- browser-visible vars are limited to `NEXT_PUBLIC_APP_NAME` and `NEXT_PUBLIC_BACKEND_URL`.
- no secret envs should be placed in `NEXT_PUBLIC_*`.

Production checklist now calls out avoiding secrets in public/static files, `.next`, Docker build args, and browser-visible env vars.

## Dependency Audit

Added:

```bash
pnpm audit:deps
```

The command is intentionally not part of CI because it may require registry access and can produce advisory churn. Run manually during release readiness and triage results before upgrading dependencies.

Audit result from this phase:

- `pnpm audit:deps` initially failed in the sandbox due DNS/network restrictions.
- The escalated retry reached the npm advisory endpoint and reported 36 vulnerabilities:
  - 1 critical
  - 13 high
  - 17 moderate
  - 5 low
- Notable advisories include transitive `shell-quote`, `glob`, `multer`, `picomatch`, `next`, `qs`, `lodash`, `tmp`, and `webpack` paths.
- No dependency was upgraded in this phase because fixes involve framework/toolchain transitive paths and likely require planned compatibility testing.

## Smoke And CI Updates

CI env now includes rate-limit defaults with enough headroom for smoke.

Smoke already covers high-value security boundaries:

- player/organizer denial for admin endpoints
- player denial for admin operations
- organizer/player role boundaries
- payment intent ownership
- public/privacy payload forbidden markers
- admin list privacy checks
- export privacy marker checks
- health/readiness and operations privacy checks

Rate-limit behavior was not added to smoke because aggressive repeated requests would make smoke timing-dependent and flaky.

## Known Risks

- localStorage token storage remains the largest auth risk.
- rate limiting is per-process, not distributed.
- strict CSP is not enforced yet.
- no external WAF/bot protection is integrated.
- no automated dependency audit gate is in CI.
- no external security scanner or container image scanner is integrated.
- real Razorpay refund execution remains deferred.

## Recommended Next Phase

Phase 12D should focus on launch rehearsals and production release controls: staging deployment rehearsal, smoke against staging, real SMTP sandbox test, Razorpay test-mode checkout/webhook test, backup restore drill, rollback drill, and final go/no-go checklist.

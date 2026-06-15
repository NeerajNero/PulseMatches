# Phase 12A: Production Hardening And Observability Notes

## Summary

Phase 12A adds production-readiness visibility without adding product features or write actions.

Implemented:

- lightweight liveness remains at `GET /health`
- readiness checks at `GET /health/ready`
- ADMIN-only operations status at `GET /admin/operations/status`
- ADMIN operations page at `/admin/operations`
- alert-ready threshold configuration for stale notifications, stale payment intents, failed notifications, and failed payment intents
- CI readiness curl for `/health/ready`
- smoke coverage for health/readiness/admin operations authorization and privacy

No payment, notification, moderation, refund execution, or provider behavior was changed.

## Health Endpoints

### `GET /health`

Fast liveness endpoint.

Returns:

- status
- service name
- app version
- checked timestamp

It does not check dependencies and remains suitable for inexpensive container health probes.

### `GET /health/ready`

Readiness endpoint.

Checks:

- database connectivity through a safe `SELECT 1`
- Redis TCP reachability
- required runtime configuration presence using safe labels only
- service name and app version

The response never includes database URLs, Redis URLs, JWT secrets, SMTP secrets, Razorpay secrets, or webhook secrets.

Docker healthchecks continue to use `/health` to avoid making startup fragile.

## Admin Operations

### `GET /admin/operations/status`

ADMIN-only endpoint returning alert-ready operational status.

Includes:

- app version and service name
- database and Redis status
- payment provider mode
- notification provider mode
- export max rows
- pending notification count
- failed notification count
- stale processing notification count
- stale payment intent count
- failed payment intent count
- failed payment event count
- latest reconciliation run summary
- configured alert thresholds

Excludes:

- SMTP credentials
- Razorpay secrets
- database URL
- Redis URL
- JWT secrets
- raw webhook payloads
- raw provider payloads

### `/admin/operations`

Read-only ADMIN page showing:

- service status cards
- dependency status
- notification and payment warning counts
- latest reconciliation status
- alert thresholds
- troubleshooting hints

The page has no mutation controls.

## Warning Thresholds

Defaults:

- `OPS_STALE_NOTIFICATION_MINUTES=30`
- `OPS_STALE_PAYMENT_INTENT_MINUTES=60`
- `OPS_FAILED_NOTIFICATION_ALERT_THRESHOLD=10`
- `OPS_FAILED_PAYMENT_ALERT_THRESHOLD=5`

Status classification:

- `critical`: database/Redis unavailable, failed notifications at/above threshold, or failed payment intents at/above threshold
- `warning`: stale processing notifications, stale payment intents, failed payment events, any failed notifications/payments below threshold, or latest reconciliation failed
- `ok`: no warning or critical condition found

These are alert-ready checks only. No email, SMS, webhook, Slack, PagerDuty, Sentry, Datadog, Prometheus, or external alert delivery was added.

## Logging And Sanitization

Phase 12A avoids adding a heavy logging provider. The new status/readiness surfaces return summarized counters and safe labels only.

Sensitive values are not returned:

- passwords
- JWT tokens/secrets
- SMTP password
- Razorpay key secret
- webhook secrets
- raw payment provider payloads
- raw webhook payloads

## Docker And CI

Docker Compose behavior is unchanged:

- backend healthcheck remains `/health`
- migrations and seed remain explicit one-shot commands
- smoke remains explicit
- Docker-first scripts remain unchanged
- Docker smoke now uses `DOCKER_SMOKE_API_URL` for the container-to-backend URL so host `API_URL` overrides do not break Compose-network smoke

CI now checks `/health/ready` after backend liveness and before `pnpm smoke:mvp`.

CI still uses:

- `NOTIFICATION_PROVIDER=noop`
- `PAYMENT_PROVIDER=mock`
- no real SMTP credentials
- no real Razorpay credentials

## Smoke Coverage

`scripts/mvp-smoke.mjs` now verifies:

- `/health` returns `ok`
- `/health/ready` returns `ok` with database and Redis dependency entries
- ADMIN can access `/admin/operations/status`
- PLAYER and ORGANIZER cannot access `/admin/operations/status`
- operations payload does not contain forbidden secret markers
- existing MVP smoke flow still passes

## Runbook

### Backend unhealthy

1. Check `GET /health`.
2. Inspect backend logs.
3. Confirm process is listening on the configured `PORT`.
4. In Docker, run `pnpm docker:ps` and `pnpm docker:logs`.

### Database unavailable

1. Check `GET /health/ready`.
2. Confirm Postgres is healthy.
3. Verify `DATABASE_URL` points to the right host for the runtime context.
4. Run migrations only through explicit commands such as `pnpm docker:migrate` or backend `prisma:deploy`.

### Redis unavailable

1. Check readiness dependency status.
2. Confirm Redis container/service is running.
3. Verify `REDIS_HOST` and `REDIS_PORT`.
4. Restart Redis only through normal infrastructure operations.

### Notification backlog

1. Open `/admin/operations`.
2. Inspect `/admin/notifications`.
3. Use existing retry/skip controls only for reviewed rows.
4. Run `pnpm notifications:process` or `pnpm docker:notifications:process`.

### Failed notification spike

1. Check provider mode on `/admin/operations`.
2. Inspect failed rows and sanitized errors in `/admin/notifications`.
3. If SMTP is enabled, verify provider credentials outside the app without exposing them in logs.
4. Retry only reviewed rows.

### Stale payment intents

1. Open `/admin/operations`.
2. Inspect payment diagnostics in `/admin/payments`.
3. Run `pnpm payments:reconcile` or `pnpm docker:payments:reconcile` for provider-safe reconciliation.
4. Do not mark payments paid from client-side claims.

### Razorpay webhook failures

1. Check failed payment event count.
2. Confirm `RAZORPAY_WEBHOOK_SECRET` outside the app.
3. Verify Razorpay dashboard webhook delivery.
4. Do not expose webhook payloads in support tickets.

### Reconciliation failures

1. Open `/admin/reconciliation`.
2. Review latest run status and sanitized error.
3. Confirm provider mode and credentials for the selected environment.
4. Re-run the one-shot reconciliation command after fixing configuration.

### Smoke failure

1. Check backend `/health` and `/health/ready`.
2. Confirm migrations and seed were run against the intended database.
3. Re-run `pnpm smoke:mvp` with explicit `API_URL`.
4. In Docker, use `pnpm docker:smoke:full` for the deterministic local flow.

## Known Limitations

- No external metrics system was added.
- No alert delivery was added.
- No Prometheus format endpoint was added.
- Operations status is snapshot-based, not a historical time-series.
- Latest smoke timestamp is not persisted, so it is not shown in operations status.

## Recommended Next Phase

Phase 12B: deployment checklist and production configuration hardening, including reverse proxy assumptions, secure cookie/CORS review, backup/restore drills, and production environment validation.

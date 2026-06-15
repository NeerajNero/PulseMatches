# Phase 12B Production Deployment And Configuration Hardening Notes

## Summary

Phase 12B added production-focused configuration validation and deployment runbooks without changing product behavior. The work keeps local, Docker, CI, noop notification, mock payment, and manual payment flows intact.

## Config Validation Behavior

Added a safe config check command:

```bash
pnpm config:check
pnpm --filter @matchflow/backend config:check
```

The command reuses backend startup env validation and prints only non-secret summary fields:

- `node_env`
- `service_name`
- `app_version`
- CORS origin count
- notification provider mode
- payment provider mode
- reconciliation provider mode
- export row cap
- operations thresholds

When `NODE_ENV=production`, startup/config validation rejects:

- placeholder or empty `DATABASE_URL`
- weak/default `JWT_ACCESS_TOKEN_SECRET`
- weak/default `JWT_REFRESH_TOKEN_SECRET`
- wildcard/default `CORS_ORIGINS`
- default or localhost `FE_APP_URL`
- missing `SERVICE_NAME`
- missing `APP_VERSION`
- missing SMTP config when `NOTIFICATION_PROVIDER=smtp`
- missing Razorpay config when `PAYMENT_PROVIDER=razorpay`

SMTP variables are still required only in SMTP mode. Razorpay variables are still required only in Razorpay mode. Local and CI can continue using noop/log notifications and manual/mock payments without real provider credentials.

## Production Env Checklist

Production operators must configure:

- `DATABASE_URL`
- `REDIS_HOST`
- `REDIS_PORT`
- `JWT_ACCESS_TOKEN_SECRET`
- `JWT_REFRESH_TOKEN_SECRET`
- `CORS_ORIGINS`
- `FE_APP_URL`
- `NEXT_PUBLIC_BACKEND_URL`
- `NOTIFICATION_PROVIDER`
- `PAYMENT_PROVIDER`
- `EXPORT_MAX_ROWS`
- `OPS_STALE_NOTIFICATION_MINUTES`
- `OPS_STALE_PAYMENT_INTENT_MINUTES`
- `OPS_FAILED_NOTIFICATION_ALERT_THRESHOLD`
- `OPS_FAILED_PAYMENT_ALERT_THRESHOLD`

Provider-specific production variables:

- SMTP mode: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `NOTIFICATION_FROM_EMAIL`, and sender identity settings.
- Razorpay mode: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, checkout display settings, and webhook URL configuration.

## Auth, Cookie, And CORS Review

The current app uses bearer access tokens and database-backed refresh tokens returned to the frontend. It does not currently use auth cookies. The frontend stores tokens client-side and sends `Authorization: Bearer ...` to protected API routes.

Hardening decisions:

- No auth flow changes were made.
- Production CORS must use explicit origins; wildcard/default local CORS is rejected in production validation.
- Cookie `secure`, `sameSite`, and `httpOnly` settings are not currently applicable because the app does not issue auth cookies.
- If a future phase moves refresh tokens to cookies, production cookie settings and proxy trust should be implemented at that time.

## Reverse Proxy Notes

Production should terminate TLS at a reverse proxy, load balancer, or platform edge. Expected routing:

- frontend domain to the Next.js service
- API domain to the NestJS service
- `/health` and `/health/ready` exposed for health checks
- Razorpay webhook path exposed at `/payments/webhooks/razorpay`

The proxy should forward `X-Forwarded-Proto`, `X-Forwarded-Host`, and `X-Forwarded-For`. The app does not currently rely on forwarded headers for cookie security.

## Docker Production Notes

The existing Docker Compose setup remains local-development and smoke-test oriented. Production can use Docker images, but:

- production migrations should be explicit
- production seed should not run unless deliberately reviewed
- Postgres and Redis should be secured and backed up
- managed Postgres/Redis are preferred where available
- frontend Docker public env values such as `NEXT_PUBLIC_BACKEND_URL` are build-time values and require image rebuilds when changed

## Backup And Restore Runbook

Local Docker backup example:

```bash
docker-compose exec -T postgres pg_dump -U matchflow -d matchflow_arena > matchflow_arena.sql
```

Restore only to a disposable database:

```bash
createdb matchflow_restore_check
psql matchflow_restore_check < matchflow_arena.sql
```

Managed production databases should use platform backups with periodic restore verification. Never test restore directly on production.

## Migration And Deploy Runbook

Recommended deploy sequence:

1. Install with lockfile.
2. Run `pnpm config:check`.
3. Run `pnpm --filter @matchflow/backend prisma:generate`.
4. Build backend and frontend.
5. Run `pnpm --filter @matchflow/backend prisma:deploy`.
6. Start services.
7. Check `/health` and `/health/ready`.
8. Run `API_URL=<deployed-api-url> pnpm smoke:mvp` against an appropriate disposable/test-safe environment.
9. Verify `pnpm notifications:process` and `pnpm payments:reconcile` schedules or manual runbooks.

Rollback should prefer previous service images before migrations, and forward fixes after migrations unless a reviewed reversible migration and verified backup exist.

## Razorpay Production Checklist

- Store live credentials only in the deployment secret manager.
- Configure `PAYMENT_PROVIDER=razorpay`.
- Configure `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET`.
- Configure the webhook URL to the production API `/payments/webhooks/razorpay`.
- Confirm frontend receives only key id, order id, amount, currency, and safe display metadata.
- Test order creation and webhook delivery in Razorpay test mode before live.
- Monitor stuck intents and failed payment events in `/admin/operations`.
- Run `pnpm payments:reconcile` manually or on a schedule.
- Real provider refund execution remains deferred.

## SMTP Production Checklist

- Store SMTP credentials in the deployment secret manager.
- Configure verified sender/domain.
- Configure SPF, DKIM, and DMARC.
- Set `NOTIFICATION_PROVIDER=smtp` only after SMTP is ready.
- Schedule or manually run `pnpm notifications:process`.
- Monitor failed/stale notifications through `/admin/operations`.
- Use admin notification retry/skip controls for support remediation.

## Smoke And Health Verification

Useful commands:

```bash
pnpm verify:mvp
pnpm config:check
pnpm smoke:mvp
pnpm docker:smoke:full
curl -fsS http://127.0.0.1:3010/health
curl -fsS http://127.0.0.1:3010/health/ready
```

The Docker-first workflow and explicit migration/seed/smoke commands are unchanged.

## CI And Script Changes

CI now runs `pnpm config:check` with safe CI defaults. CI still uses:

- `NODE_ENV=test`
- `NOTIFICATION_PROVIDER=noop`
- `PAYMENT_PROVIDER=mock`
- no real SMTP credentials
- no real Razorpay credentials

## Documentation Updates

Updated:

- `docs/command-map.md`
- `docs/env-checklist.md`
- `.env.example`
- `.github/workflows/mvp-ci.yml`

Created:

- `docs/deployment/production-checklist.md`
- `docs/playmatches-clone-prep/32-phase-12b-production-deployment-config-hardening-notes.md`

## Known Limitations

- No external observability provider is integrated.
- No production reverse proxy configuration is generated.
- No automated backup job is added.
- No production alert delivery is added.
- No real Razorpay refund execution is implemented.
- Auth still uses frontend-stored bearer/refresh tokens rather than httpOnly cookie refresh tokens.

## Recommended Next Phase

Phase 12C should focus on security review and pre-launch risk burn-down: rate limiting, abuse controls, CSP review, token storage strategy review, dependency audit, and penetration-test checklist.

# Production Deployment Checklist

This checklist covers the current MatchFlow Arena MVP deployment posture. It is operational documentation only; it does not replace provider-specific security reviews.

## Required Configuration

Run this before deploying:

```bash
NODE_ENV=production pnpm config:check
```

Production configuration must use real deployment values for:

- `DATABASE_URL`
- `REDIS_HOST` and `REDIS_PORT`, or deployment-platform equivalents mapped into those vars
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
- `RATE_LIMIT_TTL_SECONDS`
- `RATE_LIMIT_MAX_REQUESTS`
- `AUTH_RATE_LIMIT_MAX_REQUESTS`
- `PAYMENT_RATE_LIMIT_MAX_REQUESTS`
- `EXPORT_RATE_LIMIT_MAX_REQUESTS`

Do not deploy with local placeholder JWT secrets, wildcard CORS, or localhost frontend URLs.

## Auth, CORS, And Proxy

- The API uses bearer access tokens and database-backed refresh tokens returned to the frontend; it does not currently use auth cookies.
- The frontend stores tokens client-side and sends `Authorization: Bearer ...` to protected API routes.
- Frontend token storage is currently `localStorage`; review XSS exposure and plan httpOnly secure refresh cookies before broad public launch.
- `CORS_ORIGINS` must list the exact production frontend origin or origins, comma-separated.
- Sensitive auth, payment, export, and admin support-action routes have in-process rate limits. Add edge/load-balancer rate limiting for multi-instance production.
- TLS should terminate at the platform load balancer or reverse proxy.
- Forward `X-Forwarded-Proto`, `X-Forwarded-Host`, and `X-Forwarded-For` from the proxy. The app currently does not depend on those headers for auth cookies.
- Keep `/health` and `/health/ready` available to the platform health checker.

Example reverse proxy shape:

```text
https://app.example.com     -> frontend container/service
https://api.example.com     -> backend container/service
https://api.example.com/health
https://api.example.com/health/ready
```

## Build And Deploy Order

1. Install dependencies with the lockfile.
2. Validate configuration:

   ```bash
   pnpm config:check
   ```

3. Generate Prisma client:

   ```bash
   pnpm --filter @matchflow/backend prisma:generate
   ```

4. Build backend and frontend:

   ```bash
   pnpm --filter @matchflow/backend build
   pnpm --filter @matchflow/frontend build
   ```

5. Deploy migrations explicitly:

   ```bash
   pnpm --filter @matchflow/backend prisma:deploy
   ```

6. Start services.
7. Verify health:

   ```bash
   curl -fsS https://api.example.com/health
   curl -fsS https://api.example.com/health/ready
   ```

8. Run a post-deploy smoke against the deployed API with test-safe accounts/data only:

   ```bash
   API_URL=https://api.example.com pnpm smoke:mvp
   ```

Do not run seed in production unless the seed content has been reviewed for that environment.

## Docker Notes

- The included `docker-compose.yml` is local-development and smoke-test oriented.
- Production can use Docker images, but stateful Postgres/Redis should be secured and backed up. Managed services are preferred.
- Migrations are intentionally explicit through one-shot commands. Normal service startup should not silently migrate or seed.
- Next.js public env vars such as `NEXT_PUBLIC_BACKEND_URL` are build-time values in the current Docker image. Rebuild the frontend image when those values change.

## Backup And Restore

Managed database backups are recommended. For local Docker backup:

```bash
docker-compose exec -T postgres pg_dump -U matchflow -d matchflow_arena > matchflow_arena.sql
```

Restore only into a disposable database first:

```bash
createdb matchflow_restore_check
psql matchflow_restore_check < matchflow_arena.sql
```

For custom-format backups:

```bash
pg_dump -Fc "$DATABASE_URL" > matchflow_arena.dump
pg_restore --dbname "$RESTORE_DATABASE_URL" --clean --if-exists matchflow_arena.dump
```

Never test restore directly against production. Validate restore on a disposable database, run migrations if needed, and run smoke checks before trusting the backup.

## Notifications And SMTP

- Keep `NOTIFICATION_PROVIDER=noop` or `log` until the sender/domain is ready.
- Use `NOTIFICATION_PROVIDER=smtp` only with secrets from the deployment secret manager.
- Required SMTP vars in SMTP mode: `SMTP_HOST`, `SMTP_PORT`, `NOTIFICATION_FROM_EMAIL`, and `SMTP_USER`/`SMTP_PASS` unless `SMTP_ALLOW_UNAUTH=true`.
- Configure SPF, DKIM, and DMARC for the sending domain.
- Schedule or manually run:

  ```bash
  pnpm notifications:process
  ```

- Monitor `GET /admin/operations/status` for pending, failed, and stale notifications.
- Use the admin notification retry/skip controls for support remediation.

## Razorpay

- Use Razorpay live credentials only through the production secret manager.
- Required Razorpay vars in Razorpay mode: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET`.
- Configure the Razorpay webhook URL:

  ```text
  https://api.example.com/payments/webhooks/razorpay
  ```

- The frontend receives only the key id, order id, amount, and safe display metadata.
- The backend verifies Checkout signatures and webhook signatures before marking payments paid.
- Refund execution is still deferred. Use payment diagnostics and manual support procedures for refund tracking.
- Run payment reconciliation manually or on a schedule:

  ```bash
  pnpm payments:reconcile
  ```

## Operational Verification

Useful checks:

```bash
pnpm verify:mvp
pnpm smoke:mvp
pnpm docker:smoke:full
pnpm config:check
pnpm audit:deps
curl -fsS https://api.example.com/health
curl -fsS https://api.example.com/health/ready
```

Admin operational visibility:

- `/admin/operations`
- `GET /admin/operations/status`

The operations payload intentionally excludes database URLs, SMTP credentials, Razorpay secrets, JWT secrets, webhook secrets, and raw provider payloads.

Pre-launch security checklist:

```text
docs/security/pre-launch-security-checklist.md
```

## Rollback Notes

- Keep the previous backend and frontend images available.
- Database migrations are forward-only Prisma migrations. Review each migration before deploy and prepare a data-safe rollback plan manually.
- If a deploy fails before migrations, roll back the service image.
- If a deploy fails after migrations, prefer a forward fix unless the migration is confirmed reversible and the database has been backed up.

## Troubleshooting

- Backend unhealthy: check `DATABASE_URL`, Redis host/port, logs, and `/health/ready`.
- Database unavailable: verify network access, credentials, SSL/TLS requirements, and migration status.
- Redis unavailable: verify host/port/password/TLS settings.
- Frontend cannot reach API: verify `NEXT_PUBLIC_BACKEND_URL`, CORS, TLS, and reverse proxy routing.
- Razorpay webhook failures: verify webhook URL, raw-body support, webhook secret, and provider event logs.
- SMTP failures: verify sender domain, provider credentials, TLS options, and notification outbox errors.
- Smoke failure: check seed/test accounts, API URL, backend logs, and whether the target environment is disposable enough for smoke-created records.

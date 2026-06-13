# Phase 9B Email Provider Implementation Notes

## Summary

Phase 9B adds real email delivery support behind the existing Phase 9A notification provider abstraction. The default provider remains `noop`, CI remains provider-safe, and no notification UI, payment code, admin moderation, SMS, WhatsApp, or push delivery was added.

Implemented:

- SMTP provider using `nodemailer`.
- SMTP-only environment validation.
- Manual real-email test command.
- Documentation for SMTP setup and safe local/CI behavior.

## Provider Implemented

Provider added:

- `smtp`

Providers preserved:

- `noop`
- `log`

`NOTIFICATION_PROVIDER=smtp` sends outbox email through SMTP. `noop` and `log` behavior remains unchanged and does not require SMTP configuration.

## Dependency Added

Backend package dependencies:

- `nodemailer`

Backend package dev dependencies:

- `@types/nodemailer`

No mail template framework, queue framework, long-running worker, or provider-specific API SDK was added.

## Environment Variables

Provider selection:

- `NOTIFICATION_PROVIDER=noop | log | smtp`

Notification sender:

- `NOTIFICATION_FROM_EMAIL`
- `NOTIFICATION_FROM_NAME`

SMTP configuration:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_REQUIRE_TLS`
- `SMTP_REJECT_UNAUTHORIZED`
- `SMTP_ALLOW_UNAUTH`

Processing:

- `NOTIFICATION_PROCESS_LIMIT`
- `NOTIFICATION_PROCESS_REQUIRE_WORK`

Manual test email:

- `NOTIFICATION_TEST_TO`
- `TEST_NOTIFICATION_EMAIL`

SMTP validation only applies when `NOTIFICATION_PROVIDER=smtp`. If the provider is `noop` or `log`, missing SMTP values do not block application startup or notification processing.

When `NOTIFICATION_PROVIDER=smtp`:

- `SMTP_HOST` is required.
- `SMTP_PORT` must be a positive integer.
- `NOTIFICATION_FROM_EMAIL` is required.
- `SMTP_USER` and `SMTP_PASS` are required unless `SMTP_ALLOW_UNAUTH=true`.

## SMTP Behavior

SMTP delivery uses:

- outbox recipient email and name
- outbox subject
- text body from notification payload
- HTML body from notification payload
- configured sender name/email

Successful SMTP delivery stores:

- `provider=smtp`
- `providerMessageId` from the SMTP response when available

Failures are handled by the existing outbox processor:

- retry while attempts remain
- mark failed after max attempts
- store a safe `lastError`

Secrets are not logged or written to notification payloads.

## Commands

Process queued notifications once:

```bash
pnpm notifications:process
pnpm --filter @matchflow/backend notifications:process
```

Send a manual real-email test:

```bash
NOTIFICATION_PROVIDER=smtp \
NOTIFICATION_TEST_TO=you@example.com \
SMTP_HOST=smtp.example.com \
SMTP_PORT=587 \
SMTP_USER=... \
SMTP_PASS=... \
pnpm notifications:test-email
```

The test email command sends real email and should not be run in CI.

## CI Behavior

CI remains on:

- `NOTIFICATION_PROVIDER=noop`

The CI workflow includes SMTP env placeholders but does not require real SMTP credentials and does not send real email.

CI still runs:

- Prisma generate/deploy
- seed
- backend/frontend typecheck, lint, build
- workspace typecheck, lint, build
- `pnpm smoke:mvp`
- notification processing with the `noop` provider

## Security Notes

- No real SMTP credentials were committed.
- SMTP passwords are not logged.
- SMTP config errors do not include secret values.
- Email HTML is rendered with escaped user-facing text.
- Email copy does not include phone numbers, payment internals, audit data, or private notes.
- Public APIs still do not expose notification internals.

## Database And SDK

Database/schema changes:

- None.

SDK generation:

- Not required. No HTTP API contracts changed.

## Validation Results

Passed:

- `pnpm --filter @matchflow/backend prisma:generate`
- `pnpm --filter @matchflow/backend typecheck`
- `pnpm --filter @matchflow/backend lint`
- `pnpm --filter @matchflow/backend build`
- `pnpm --filter @matchflow/frontend typecheck`
- `pnpm --filter @matchflow/frontend lint`
- `pnpm --filter @matchflow/frontend build`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- `node --check scripts/mvp-smoke.mjs`
- `pnpm verify:mvp`
- `pnpm smoke:mvp`
- `NOTIFICATION_PROVIDER=noop NOTIFICATION_PROCESS_REQUIRE_WORK=true pnpm --filter @matchflow/backend notifications:process`
- package JSON parse check
- GitHub Actions workflow YAML parse check

Dependency installation:

- `pnpm --filter @matchflow/backend add nodemailer`
- `pnpm --filter @matchflow/backend add -D @types/nodemailer`
- `pnpm install --frozen-lockfile`

The first dependency install attempt failed in the sandbox due npm registry DNS restrictions. The same package-manager commands were rerun with network access and succeeded.

The first frontend lint/build attempt after dependency installation found a stale local `node_modules` state missing `eslint-plugin-import`. `pnpm install --frozen-lockfile` restored the workspace install from the updated lockfile, and the frontend lint/build checks passed afterward.

Smoke result:

```text
mvp-smoke: public discovery visibility checks passed
mvp-smoke: auth and role checks passed
mvp-smoke: organizer CRUD and draft visibility checks passed
mvp-smoke: player registration checks passed
mvp-smoke: organizer registration review checks passed
mvp-smoke: roster, participant, team, and member checks passed
mvp-smoke: fixture generation duplicate guard passed
mvp-smoke: knockout scoring and advancement checks passed
mvp-smoke: round-robin standings checks passed
mvp-smoke: public result publishing and archive guards passed
{"status":"mvp_smoke_ok","run_id":"1780916835949","tournament_id":"ce34b32f-5e13-41f5-ab1f-0b4d8277efa3","draft_tournament_id":"8f0ba510-4dc1-40e0-b53c-c440e05021fd","knockout_fixture_id":"fd6a9f88-8cdc-4492-aa20-a29ea4fd6e55","round_robin_fixture_id":"913ddd4f-f57c-412a-9541-1664b4f90cbb","public_privacy_markers_checked":7}
```

Notification processing with `noop` after smoke:

```text
{"status":"notifications_processed","selected":6,"processed":6,"sent":6,"skipped":0,"failed":0,"retried":0}
```

Real SMTP send:

- Not run. No SMTP credentials or explicit test recipient were provided.

## Known Limitations

- SMTP is the only real provider.
- No Postmark API provider was added.
- No notification preferences UI exists.
- No notification inbox UI exists.
- No long-running worker exists.
- Manual test email requires real SMTP credentials supplied through local environment variables.
- Provider retry behavior remains the Phase 9A fixed-delay processor behavior.

## Next Recommended Phase

Recommended next phase: payment-provider planning or implementation as a separate focused slice. Do not combine payments with additional notification delivery channels.

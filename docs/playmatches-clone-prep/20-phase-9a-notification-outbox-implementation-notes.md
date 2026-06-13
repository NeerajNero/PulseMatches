# Phase 9A Notification Outbox Implementation Notes

## Summary

Phase 9A adds a durable notification outbox and email-ready provider foundation. It does not send real email by default and does not add payments, admin moderation, sport-specific scoring, SMS, WhatsApp, push notifications, or notification UI.

Implemented:

- Prisma notification outbox model and enums.
- NestJS notification DB module and service module.
- Simple text/HTML template renderer.
- Email provider abstraction with `noop` and `log` providers.
- One-shot notification processor command.
- Notification enqueue integration for registration and result publishing events.
- CI update so MVP smoke-generated notifications are processed with the NOOP provider.

## Schema And Model Changes

Migration:

- `20260608170000_010_notification_outbox`

Added enums:

- `NotificationType`
- `NotificationChannel`
- `NotificationStatus`

Added model/table:

- `NotificationOutbox` mapped to `notification_outbox`

Important fields:

- `type`
- `channel`
- `status`
- `recipientUserId`
- `recipientEmail`
- `recipientName`
- `tournamentId`
- `tournamentCategoryId`
- `registrationId`
- `fixtureSetId`
- `matchId`
- `subject`
- `payload`
- `provider`
- `providerMessageId`
- `attempts`
- `maxAttempts`
- `lastError`
- `scheduledAt`
- `processedAt`
- `idempotencyKey`
- timestamps

Indexes:

- `status, scheduledAt`
- `type`
- `recipientUserId`
- `tournamentId`
- `registrationId`
- `fixtureSetId`
- `matchId`
- unique `idempotencyKey`

The migration was applied locally with:

```bash
pnpm --filter @matchflow/backend prisma:deploy
```

The first attempt could not reach local Postgres from the sandbox. The same non-destructive deploy command was rerun with local DB access and succeeded.

## Notification Events Supported

Supported in Phase 9A:

- `REGISTRATION_CREATED`
- `REGISTRATION_APPROVED`
- `REGISTRATION_REJECTED`
- `REGISTRATION_CANCELLED`
- `RESULTS_PUBLISHED`

Defined but not currently enqueued:

- `MATCH_SCHEDULE_UPDATED`

Schedule update notifications were deferred to avoid noisy delivery for frequent schedule edits.

## Provider Behavior

Default provider:

- `NOTIFICATION_PROVIDER=noop`

Supported providers:

- `noop`: records notifications as sent during processing without real delivery.
- `log`: logs the email delivery intent through NestJS logger and records notifications as sent.

Unsupported provider values fail environment validation. No SMTP, Postmark, SMS, WhatsApp, or push provider was added.

No real credentials are required for local development or CI.

## Processing Command

Added root command:

```bash
pnpm notifications:process
```

Added backend command:

```bash
pnpm --filter @matchflow/backend notifications:process
```

Behavior:

- Selects due `PENDING` notification outbox records.
- Marks each claimed record `PROCESSING`.
- Skips records with missing recipient email.
- Calls the configured provider.
- Marks successful sends as `SENT`.
- Retries failed sends while attempts remain.
- Marks exhausted failures as `FAILED`.
- Runs once and exits.

Useful env:

- `NOTIFICATION_PROCESS_LIMIT`
- `NOTIFICATION_PROCESS_REQUIRE_WORK=true`

CI uses `NOTIFICATION_PROCESS_REQUIRE_WORK=true` after MVP smoke to ensure at least one notification was queued and processed.

## Environment Variables

Added to root and backend env examples:

- `NOTIFICATION_PROVIDER=noop`
- `NOTIFICATION_FROM_EMAIL=notifications@matchflow.local`
- `NOTIFICATION_FROM_NAME=MatchFlow Arena`
- `NOTIFICATION_PROCESS_LIMIT=20`

Also added to Docker Compose and CI env.

`FE_APP_URL` is reused for links in generated notification payloads.

## Backend Integration Points

Registration flow:

- Player registration creation enqueues `REGISTRATION_CREATED`.
- Player cancellation enqueues `REGISTRATION_CANCELLED`.

Organizer roster flow:

- Organizer approval enqueues `REGISTRATION_APPROVED`.
- Organizer rejection enqueues `REGISTRATION_REJECTED`.
- Organizer cancellation enqueues `REGISTRATION_CANCELLED`.

Fixture/result publishing:

- Organizer result publishing enqueues `RESULTS_PUBLISHED` for confirmed registrations in that fixture set's tournament category.
- Repeated publish/unpublish cycles are deduped by `RESULTS_PUBLISHED:{fixtureSetId}:{registrationId}` idempotency keys.

No notification enqueue call was added for unpublish.

## Files Added Or Changed

Added:

- `apps/backend/src/db/notifications/notifications.repository.ts`
- `apps/backend/src/db/notifications/notifications-db.service.ts`
- `apps/backend/src/db/notifications/notifications-db.module.ts`
- `apps/backend/src/notifications/notification.types.ts`
- `apps/backend/src/notifications/notification-template.service.ts`
- `apps/backend/src/notifications/notification-email.provider.ts`
- `apps/backend/src/notifications/notifications.service.ts`
- `apps/backend/src/notifications/notifications.module.ts`
- `apps/backend/src/scripts/process-notifications.ts`
- `apps/backend/prisma/migrations/20260608170000_010_notification_outbox/migration.sql`

Changed:

- `apps/backend/prisma/schema.prisma`
- `apps/backend/src/app.module.ts`
- `apps/backend/src/api/registrations/registrations.module.ts`
- `apps/backend/src/api/registrations/registrations.service.ts`
- `apps/backend/src/api/organizer-rosters/organizer-rosters.module.ts`
- `apps/backend/src/api/organizer-rosters/organizer-rosters.service.ts`
- `apps/backend/src/api/organizer-fixtures/organizer-fixtures.module.ts`
- `apps/backend/src/api/organizer-fixtures/organizer-fixtures.service.ts`
- `apps/backend/src/db/organizer-fixtures/organizer-fixtures.repository.ts`
- `apps/backend/src/db/organizer-fixtures/organizer-fixtures-db.service.ts`
- `apps/backend/src/config/env.validation.ts`
- `apps/backend/package.json`
- `package.json`
- `.env.example`
- `apps/backend/.env.example`
- `docker-compose.yml`
- `.github/workflows/mvp-ci.yml`
- `docs/command-map.md`

## Smoke Coverage

`scripts/mvp-smoke.mjs` was not given database inspection behavior or notification-only API calls because this phase intentionally avoided adding notification inspection endpoints.

Instead, CI now runs:

```bash
pnpm smoke:mvp
pnpm --filter @matchflow/backend notifications:process
```

The processor step uses `NOTIFICATION_PROCESS_REQUIRE_WORK=true`, so CI fails if the smoke-created product events do not enqueue any processable notifications.

Local smoke result:

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
{"status":"mvp_smoke_ok","run_id":"1780914566567","tournament_id":"ce34b32f-5e13-41f5-ab1f-0b4d8277efa3","draft_tournament_id":"c5daf7b5-a1e9-4564-b63d-494d1de0880b","knockout_fixture_id":"1adf663b-e71e-4ccd-b7dc-f9a6bdf07a6f","round_robin_fixture_id":"fdc1c15e-cc25-4975-953e-51a99b1a6394","public_privacy_markers_checked":7}
```

Local notification processing after smoke:

```text
{"status":"notifications_processed","selected":6,"processed":6,"sent":6,"skipped":0,"failed":0,"retried":0}
```

## CI Changes

Updated:

- `.github/workflows/mvp-ci.yml`

CI now sets:

- `NOTIFICATION_PROVIDER=noop`
- `NOTIFICATION_FROM_EMAIL=notifications@matchflow.local`
- `NOTIFICATION_FROM_NAME=MatchFlow Arena`
- `NOTIFICATION_PROCESS_LIMIT=50`

After `pnpm smoke:mvp`, CI runs notification processing once.

## SDK Generation

No SDK generation was required because no new public or authenticated HTTP API contracts were added.

## Validation Commands

Passed:

- `pnpm --filter @matchflow/backend prisma:generate`
- `pnpm --filter @matchflow/backend prisma:deploy`
- `node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); JSON.parse(require('fs').readFileSync('apps/backend/package.json','utf8')); console.log('package_json_ok')"`
- `ruby -e "require 'yaml'; YAML.load_file('.github/workflows/mvp-ci.yml'); puts 'yaml_ok'"`
- `node --check scripts/mvp-smoke.mjs`
- `pnpm --filter @matchflow/backend typecheck`
- `pnpm --filter @matchflow/backend lint`
- `pnpm --filter @matchflow/backend build`
- `pnpm --filter @matchflow/frontend typecheck`
- `pnpm --filter @matchflow/frontend lint`
- `pnpm --filter @matchflow/frontend build`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- `pnpm verify:mvp`
- `pnpm --filter @matchflow/backend db:seed`
- `pnpm smoke:mvp`
- `NOTIFICATION_PROCESS_REQUIRE_WORK=true pnpm --filter @matchflow/backend notifications:process`

The first `prisma:deploy` and first notification processor attempts could not reach local Postgres through the sandbox. The same non-destructive commands were rerun with local DB access and passed.

## Known Limitations

- No real email provider is implemented.
- No SMTP/Postmark credentials or delivery setup exists.
- No notification preferences UI exists.
- No notification center/inbox exists.
- No admin/internal notification inspection API exists.
- Processing is a one-shot command, not a long-running worker.
- Retry scheduling is simple fixed-delay retry.
- `MATCH_SCHEDULE_UPDATED` exists in the enum but is not enqueued yet.
- Outbox processing is suitable for local/CI and simple scheduled jobs, but high-throughput production use should add a proper worker and stronger concurrency controls.

## Next Recommended Phase

Recommended next product slice: either real email provider integration behind the existing provider abstraction or payment-provider discovery/planning. Do not combine payments and real notification delivery in one implementation pass.

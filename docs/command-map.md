# MatchFlow Arena Command Map

## Root

```bash
pnpm install
pnpm local:up
pnpm local:infra:up
pnpm local:down
pnpm docker:up
pnpm docker:down
pnpm docker:restart
pnpm docker:build
pnpm docker:ps
pnpm docker:logs
pnpm docker:migrate
pnpm docker:seed
pnpm docker:smoke
pnpm docker:smoke:full
pnpm docker:notifications:process
pnpm docker:payments:reconcile
pnpm docker:backend:shell
pnpm docker:frontend:shell
pnpm local:config
pnpm local:logs
pnpm build
pnpm typecheck
pnpm lint
pnpm backend:dev
pnpm frontend:dev
pnpm generate:openapi
pnpm generate:sdk
pnpm config:check
pnpm smoke:mvp
pnpm notifications:process
pnpm notifications:test-email
pnpm payments:reconcile
pnpm audit:deps
pnpm verify:mvp
```

## Feature Flow

These are agent workflow gates, not package scripts:

```text
/classify docs/features/user-stories.md
/plan docs/features/user-stories.md
/approve docs/features/plans/<feature>.plan.md
/implement docs/features/approvals/<feature>.approval.md
/verify docs/features/reports/<feature>.implementation.md
/api-integrate docs/features/reports/<feature>.implementation.md
/test docs/features/reports/<feature>.implementation.md
/review docs/features/reports/<feature>.implementation.md
/finalize docs/features/reports/<feature>.implementation.md
/context-update docs/features/final/<feature>.final.md
/revise-plan docs/features/plans/<feature>.plan.md
/status docs/features
/select <feature-slug-or-artifact-file>
/block <feature-artifact-file>
/context-status docs/context
```

## Backend

```bash
pnpm --filter @matchflow/backend dev
pnpm --filter @matchflow/backend build
pnpm --filter @matchflow/backend start
pnpm --filter @matchflow/backend lint
pnpm --filter @matchflow/backend typecheck
pnpm --filter @matchflow/backend prisma:generate
pnpm --filter @matchflow/backend prisma:migrate
pnpm --filter @matchflow/backend prisma:deploy
pnpm --filter @matchflow/backend prisma:studio
pnpm --filter @matchflow/backend db:seed
pnpm --filter @matchflow/backend config:check
pnpm --filter @matchflow/backend payments:reconcile
```

## Frontend

```bash
pnpm --filter @matchflow/frontend dev
pnpm --filter @matchflow/frontend build
pnpm --filter @matchflow/frontend lint
pnpm --filter @matchflow/frontend typecheck
```

## SDK

```bash
pnpm generate:openapi
pnpm generate:sdk
```

SDK generation is wired as a project command but may be blocked until backend dependencies are installed and the API is running. The default local backend URL is `http://localhost:3010`.

## Smoke Checks

```bash
pnpm smoke:mvp
```

`pnpm smoke:mvp` runs an API-level regression smoke against a running backend. It expects the idempotent local seed users to exist and defaults to `API_URL=http://127.0.0.1:3010`.

Optional overrides:

```bash
API_URL=http://127.0.0.1:3010 \
MVP_SMOKE_ORGANIZER_EMAIL=organizer@matchflow.local \
MVP_SMOKE_ORGANIZER_PASSWORD=OrganizerPass123! \
MVP_SMOKE_PLAYER_EMAIL=player@matchflow.local \
MVP_SMOKE_PLAYER_PASSWORD=PlayerPass123! \
MVP_SMOKE_ADMIN_EMAIL=admin@matchflow.local \
MVP_SMOKE_ADMIN_PASSWORD=AdminPass123! \
pnpm smoke:mvp
```

The smoke creates isolated timestamped data through application APIs only. It does not run migrations, reset data, or edit the database directly.

Phase 12A smoke coverage also checks:

- `GET /health`
- `GET /health/ready`
- ADMIN-only `GET /admin/operations/status`
- PLAYER/ORGANIZER denial for admin operations status
- operations payload privacy markers

Docker-first local workflow:

```bash
cp .env.docker.example .env
pnpm docker:build
pnpm docker:up
pnpm docker:migrate
pnpm docker:seed
pnpm docker:smoke
pnpm docker:smoke:full
```

One-shot utility tasks:

```bash
pnpm docker:notifications:process
pnpm docker:payments:reconcile
```

`pnpm docker:migrate` and `pnpm docker:seed` are explicit one-shot containers and do not run as part of `pnpm docker:up`.

Docker smoke uses `DOCKER_SMOKE_API_URL=http://backend:3010` by default so the smoke container targets the backend service on the Compose network. Host-based smoke continues to use `API_URL`, defaulting to `http://127.0.0.1:3010`.

For provider-neutral payment readiness coverage, run the backend with `PAYMENT_PROVIDER=mock`. With `PAYMENT_PROVIDER=manual`, the smoke keeps the online-provider branch skipped and still verifies the manual/offline flow.

Admin/support smoke coverage uses the seed admin account to verify:

- read-only admin access and privacy checks
- organizer verification, rejection, reset, and audited publish eligibility
- notification skip/retry controls and audit records

These checks create isolated organizer accounts and outbox transitions through application APIs only.

## Notifications

```bash
pnpm notifications:process
pnpm --filter @matchflow/backend notifications:process
pnpm notifications:test-email
pnpm --filter @matchflow/backend notifications:test-email
```

`notifications:process` processes due `PENDING` notification outbox records once and exits. The default provider is `NOTIFICATION_PROVIDER=noop`, so local and CI runs do not send real email.

Useful environment variables:

- `NOTIFICATION_PROVIDER=noop`, `log`, or `smtp`
- `NOTIFICATION_FROM_EMAIL=notifications@matchflow.local`
- `NOTIFICATION_FROM_NAME=MatchFlow Arena`
- `NOTIFICATION_PROCESS_LIMIT=20`
- `NOTIFICATION_PROCESS_REQUIRE_WORK=true` for CI-style checks that should fail when no pending notifications were processed.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_REQUIRE_TLS`, `SMTP_REJECT_UNAUTHORIZED`, and `SMTP_ALLOW_UNAUTH` when `NOTIFICATION_PROVIDER=smtp`.

`notifications:test-email` is manual-only and sends a real email. It requires:

```bash
NOTIFICATION_PROVIDER=smtp \
NOTIFICATION_TEST_TO=you@example.com \
SMTP_HOST=smtp.example.com \
SMTP_PORT=587 \
SMTP_USER=... \
SMTP_PASS=... \
pnpm notifications:test-email
```

Do not run the test email command in CI or with placeholder credentials.

## Operations And Health

```bash
pnpm config:check
curl http://127.0.0.1:3010/health
curl http://127.0.0.1:3010/health/ready
```

- `pnpm config:check` validates the same backend runtime configuration used at app startup and prints a safe summary without secret values.
- In `NODE_ENV=production`, the config check rejects placeholder JWT secrets, default local CORS/frontend URLs, and missing real-provider configuration when `NOTIFICATION_PROVIDER=smtp` or `PAYMENT_PROVIDER=razorpay`.
- `/health` is lightweight liveness.
- `/health/ready` checks database connectivity, Redis reachability, app identity, and required runtime configuration presence without returning secret values.
- ADMIN users can inspect alert-ready operational status at `/admin/operations` or `GET /admin/operations/status`.

Useful environment variables:

- `OPS_STALE_NOTIFICATION_MINUTES=30`
- `OPS_STALE_PAYMENT_INTENT_MINUTES=60`
- `OPS_FAILED_NOTIFICATION_ALERT_THRESHOLD=10`
- `OPS_FAILED_PAYMENT_ALERT_THRESHOLD=5`
- `RATE_LIMIT_TTL_SECONDS=60`
- `RATE_LIMIT_MAX_REQUESTS=120`
- `AUTH_RATE_LIMIT_MAX_REQUESTS=20`
- `PAYMENT_RATE_LIMIT_MAX_REQUESTS=30`
- `EXPORT_RATE_LIMIT_MAX_REQUESTS=20`

These thresholds classify operations status as `ok`, `warning`, or `critical`; they do not send alerts.

Sensitive route rate limits are enforced in-process per backend instance for auth, payment, export, and admin support-action endpoints. Multi-instance production deployments should add edge or load-balancer rate limiting as well.

## Security Checks

```bash
pnpm audit:deps
pnpm config:check
pnpm smoke:mvp
```

`pnpm audit:deps` runs `pnpm audit` and may require registry/network access. Review findings before upgrading dependencies; do not bulk-upgrade in a release branch without compatibility testing.

Production deployment references:

- Deployment checklist: `docs/deployment/production-checklist.md`
- Phase 12B notes: `docs/playmatches-clone-prep/32-phase-12b-production-deployment-config-hardening-notes.md`
- Pre-launch security checklist: `docs/security/pre-launch-security-checklist.md`

## Payments

Phase 10D keeps manual/offline, mock, and Razorpay payments available while adding payment operations diagnostics, manual refund tracking, and one-shot reconciliation scaffolding.

Useful environment variables:

- `PAYMENT_PROVIDER=manual`, `mock`, or `razorpay`
- `PAYMENT_DEFAULT_CURRENCY=INR`
- `PAYMENT_MOCK_CHECKOUT_BASE_URL=http://localhost:3002`
- `PAYMENT_INTENT_EXPIRY_MINUTES=30`
- `PAYMENT_WEBHOOK_SECRET`, optional for mock webhook signature checks
- `PAYMENT_RECONCILIATION_PROVIDER=manual`, `mock`, or `razorpay`; defaults to the configured payment provider
- `PAYMENT_RECONCILIATION_LIMIT=25`
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET` when `PAYMENT_PROVIDER=razorpay`
- `RAZORPAY_CHECKOUT_NAME=MatchFlow Arena`
- `RAZORPAY_CHECKOUT_DESCRIPTION=Tournament registration fee`

`PAYMENT_PROVIDER=mock` never calls an external gateway. It creates fake payment intents, attempts, checkout references, and immutable payment events for local/CI validation. Do not collect card, UPI, bank, or other sensitive payment credentials.

`PAYMENT_PROVIDER=razorpay` creates real Razorpay test/live orders server-side and requires Razorpay credentials. Checkout success must be verified by the backend through `POST /me/registrations/:registrationId/payment/verify`; webhooks are accepted at `POST /payments/webhooks/razorpay` and require a valid Razorpay signature. Do not run Razorpay mode in CI or with placeholder credentials.

```bash
pnpm payments:reconcile
pnpm --filter @matchflow/backend payments:reconcile
```

`payments:reconcile` runs once and exits. In `manual` or `mock` mode it performs deterministic internal checks only. In `razorpay` mode it requires Razorpay credentials and records provider order-status checks as immutable payment events; it does not execute real refunds or invent missing payment IDs. Do not run Razorpay reconciliation in CI without explicit test credentials.

## CSV Exports

Phase 11C adds authenticated CSV exports for organizer-owned tournament data and ADMIN support views. Phase 11D adds date-filtered report exports and reconciliation-run CSV export.

Useful environment variables:

- `EXPORT_MAX_ROWS=5000` controls the maximum rows returned by one CSV export.

Exports are HTTP endpoints rather than CLI commands. They require the same JWT role checks as the pages they support:

- Organizer exports require `ORGANIZER` and tournament ownership.
- Admin exports require `ADMIN`.
- Exports write audit rows with safe metadata such as export type, filters, and row count.
- CSV responses include formula-injection protection and do not include secrets, raw provider payloads, password hashes, or token fields.

Report endpoints accept optional ISO `from` and `to` query params. Date-only values are interpreted as full UTC calendar days: `from` starts at `00:00:00.000Z`, and `to` ends at `23:59:59.999Z`.

## MVP Verification

```bash
pnpm verify:mvp
```

`pnpm verify:mvp` runs the local non-mutating readiness checks:

- backend Prisma client generation
- backend typecheck, lint, and build
- frontend typecheck, lint, and build
- workspace typecheck, lint, and build

It intentionally does not run migrations, seed data, or `pnpm smoke:mvp`. Run `pnpm smoke:mvp` separately after starting a backend against a database you are comfortable mutating with isolated smoke-test records.

## Docker

```bash
docker-compose config
docker-compose up -d postgres redis
docker-compose up -d postgres redis backend frontend
docker-compose build backend frontend
docker-compose logs -f backend frontend
docker-compose down
docker-compose down --volumes
```

`pnpm local:up` starts the full Docker stack: Postgres, Redis, backend, and frontend.

`pnpm local:infra:up` starts only Postgres and Redis for host-based backend/frontend development with `pnpm backend:dev` and `pnpm frontend:dev`.

`pnpm docker:up` starts postgres, redis, backend, and frontend only; it does not run migrations or seed automatically.

`pnpm local:up` follows the same startup model.

Use `pnpm docker:migrate` and `pnpm docker:seed` explicitly when you need database setup.

`pnpm docker:smoke:full` runs a deterministic local Docker validation flow without resetting data:

1. validate compose config
2. build backend/frontend images
3. start postgres and redis
4. run backend migrations (`backend-migrate`)
5. run backend seed (`backend-seed`)
6. start backend and frontend
7. wait for backend health
8. run MVP smoke (`smoke`)
9. run notifications processor
10. run payment reconciliation
11. print status and recent backend/frontend logs

`docker:smoke:full` intentionally does not run `docker-compose down` so services remain up for inspection.

The reset command removes local data volumes and should only be used intentionally.

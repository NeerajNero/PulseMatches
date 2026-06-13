# Phase 29: Docker Readiness Notes

## Summary

Docker readiness for local development and validation was hardened to support Docker-first operation for the whole project stack without changing MVP business logic. The stack now includes explicit one-shot utility containers for migration, seeding, smoke, notification processing, and payment reconciliation while keeping runtime containers focused on service execution.

## Current Docker state (before/after)

### Existing components
- `docker-compose.yml` with services for:
  - `postgres`
  - `redis`
  - `backend`
  - `frontend`
- root `Dockerfile` with `backend` and `frontend` multi-stage targets
- `.dockerignore`, `.env.example`, `apps/backend/.env.example`
- Root scripts for `local:up`, `local:infra:up`, `local:down`, and verification tools

### Changes made for readiness
- `backend` container startup no longer runs migrations and seed automatically.
- Added explicit one-shot utility services:
  - `backend-migrate`
  - `backend-seed`
  - `smoke`
  - `notifications-process`
  - `payments-reconcile`
- Added Docker helper scripts in `package.json`:
  - `docker:up`, `docker:down`, `docker:restart`, `docker:build`, `docker:ps`, `docker:logs`
  - `docker:migrate`, `docker:seed`, `docker:smoke`
  - `docker:notifications:process`, `docker:payments:reconcile`
  - `docker:backend:shell`, `docker:frontend:shell`
- Added `.env.docker.example` containing safe local defaults.
- Updated `docs/command-map.md` with Docker command flow.

## Services now available

### Core services
- **postgres**
  - Image: `postgres:16-alpine`
  - Named volume: `postgres_data`
  - Healthcheck: `pg_isready`
  - Exposed host port default: `55432`
- **redis**
  - Image: `redis:7-alpine`
  - Named volume: `redis_data`
  - Healthcheck: `redis-cli ping`
  - Exposed host port default: `56379`
- **backend**
  - Built from `Dockerfile` target `backend`
  - Depends on `postgres` and `redis` health
  - Exposes `BACKEND_PORT` host mapping (default `3010`)
  - Healthcheck: `/health`
- **frontend**
  - Built from `Dockerfile` target `frontend`
  - Exposes `FRONTEND_PORT` host mapping (default `3002`)
  - Depends on healthy `backend`
  - Healthcheck: root URL (`/`)

### One-shot utility services
- **backend-migrate**
  - Runs `pnpm --filter @matchflow/backend prisma:deploy`
  - Depends on healthy `postgres`
  - No restart
- **backend-seed**
  - Runs `pnpm --filter @matchflow/backend db:seed`
  - Depends on healthy `postgres`
  - No restart
- **smoke**
  - Runs `pnpm smoke:mvp`
  - Depends on healthy `backend`
  - Uses `API_URL` (defaults to `http://backend:3010`)
- **notifications-process**
  - Runs `pnpm --filter @matchflow/backend notifications:process`
  - Depends on healthy `backend`
  - No restart
- **payments-reconcile**
  - Runs `pnpm --filter @matchflow/backend payments:reconcile`
  - Depends on healthy `backend`
  - No restart

### Ports and networks
- Network: `matchflow`
- Host-facing ports (defaults):
  - Backend: `3010`
  - Frontend: `3002`
  - Postgres: `55432`
  - Redis: `56379`

## Environment setup

Use `.env.docker.example` for Docker defaults:

1. `cp .env.docker.example .env`

Key variables covered:
- database: `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_PORT`
- redis: `REDIS_PASSWORD`, `REDIS_PORT`, `REDIS_TLS_ENABLED`
- backend runtime: `PORT`, `BACKEND_PORT`, `BACKEND_CONTAINER_PORT`, `NODE_ENV`, `CORS_ORIGINS`, `FE_APP_URL`, `JWT_*`, `APP_VERSION`, `SERVICE_NAME`
- frontend runtime: `NEXT_PUBLIC_BACKEND_URL`, `NEXT_PUBLIC_APP_NAME`, `FRONTEND_PORT`
- notifications: `NOTIFICATION_PROVIDER`, sender email/name, process settings
- smtp placeholders: `SMTP_*`
- payments: `PAYMENT_PROVIDER`, `PAYMENT_DEFAULT_CURRENCY`, mock/razorpay settings, reconciliation settings
- exports/reports: `EXPORT_MAX_ROWS`

### Safety defaults
- `NOTIFICATION_PROVIDER=noop`
- `PAYMENT_PROVIDER=mock`
- all credential fields are placeholders/empty

## Local Docker workflows

### Recommended full local startup (Docker-first)

```bash
cp .env.docker.example .env
pnpm docker:build
pnpm docker:up
pnpm docker:migrate
pnpm docker:seed
pnpm docker:smoke
```

### Useful operational commands

- Start core services: `pnpm docker:up`
- Stop: `pnpm docker:down`
- Rebuild images: `pnpm docker:build`
- Show status/logs:
  - `pnpm docker:ps`
  - `pnpm docker:logs`
- Utility runs:
  - `pnpm docker:migrate`
  - `pnpm docker:seed`
  - `pnpm docker:smoke`
  - `pnpm docker:notifications:process`
  - `pnpm docker:payments:reconcile`
- Shell access:
  - `pnpm docker:backend:shell`
  - `pnpm docker:frontend:shell`

## Migration/seed/smoke behavior in Docker

- Migrations and seed are **not** run automatically when starting `pnpm docker:up`.
- They must be explicitly invoked via `pnpm docker:migrate` and `pnpm docker:seed`.
- Smoke assumes backend API is up and uses `API_URL` to target Docker service URL by default (`http://backend:3010`).
- `PAYMENT_PROVIDER` and `NOTIFICATION_PROVIDER` defaults ensure smoke stays deterministic with no external dependencies.

## Compose validation

- Run:
  - `docker-compose config`
  - `docker-compose build`

## Known limitations and notes

- `generate-openapi` / `generate-sdk` remain outside compose orchestration; run using normal workspace scripts when required.
- CI remains on direct service execution and is unaffected by docker lifecycle script changes.
- Root compose defaults are tuned for local development, not production container optimization.
- Utility one-shot containers are intended for manual operations and smoke validation only.

## Troubleshooting

- **Port already in use**: update `BACKEND_PORT`, `FRONTEND_PORT`, `POSTGRES_PORT`, `REDIS_PORT` in `.env`.
- **Database not ready**: check `docker-compose logs postgres` and wait for `healthy` status.
- **Prisma migration errors**:
  - ensure `DATABASE_URL` points to service host `postgres`
  - run `pnpm docker:migrate` after `backend` is healthy
- **Backend healthcheck failing**:
  - check startup logs (`pnpm docker:logs`)
  - verify required JWT vars and `DATABASE_URL`
- **Frontend cannot reach backend**:
  - verify `NEXT_PUBLIC_BACKEND_URL` and backend healthy
  - verify `backend` service exposes mapped and internal port
- **Smoke cannot connect**:
  - ensure `API_URL` points to `http://backend:3010` in Docker flow or `http://127.0.0.1:3010` for host backend mode
- **Stale node_modules/cache**:
  - rebuild images with `pnpm docker:build`
  - optionally `docker-compose down --volumes` only when you intentionally want data reset
- **Permission issues**:
  - prefer running in repo-owned workspace directories
  - avoid binding host paths for node cache directories in compose

## Production vs local notes

- This pass is focused on local-readiness and CI-safe deterministic validation.
- For production, prefer a deployment-specific compose profile/build stage split and immutable image tags.

# MatchFlow Arena Environment Checklist

## Root `.env.example`

- `COMPOSE_PROJECT_NAME`
- `SERVICE_NAME`
- `NODE_ENV`
- `FRONTEND_NODE_ENV`
- `APP_VERSION`
- `BACKEND_PORT`
- `BACKEND_CONTAINER_PORT`
- `FRONTEND_PORT`
- `CORS_ORIGINS`
- `FE_APP_URL`
- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_BACKEND_URL`
- `API_URL`
- `DOCKER_SMOKE_API_URL`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_PORT`
- `REDIS_PORT`
- `REDIS_PASSWORD`
- `REDIS_TLS_ENABLED`
- `JWT_ACCESS_TOKEN_SECRET`
- `JWT_ACCESS_TOKEN_EXPIRY`
- `JWT_REFRESH_TOKEN_SECRET`
- `JWT_REFRESH_TOKEN_EXPIRY`
- `RATE_LIMIT_TTL_SECONDS`
- `RATE_LIMIT_MAX_REQUESTS`
- `AUTH_RATE_LIMIT_MAX_REQUESTS`
- `PAYMENT_RATE_LIMIT_MAX_REQUESTS`
- `EXPORT_RATE_LIMIT_MAX_REQUESTS`

## Backend `apps/backend/.env.example`

- `SERVICE_NAME`
- `PORT`
- `NODE_ENV`
- `APP_VERSION`
- `CORS_ORIGINS`
- `DATABASE_URL`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `REDIS_HOST`
- `REDIS_PORT`
- `REDIS_PASSWORD`
- `REDIS_TLS_ENABLED`
- `JWT_ACCESS_TOKEN_SECRET`
- `JWT_ACCESS_TOKEN_EXPIRY`
- `JWT_REFRESH_TOKEN_SECRET`
- `JWT_REFRESH_TOKEN_EXPIRY`
- `FE_APP_URL`
- `RATE_LIMIT_TTL_SECONDS`
- `RATE_LIMIT_MAX_REQUESTS`
- `AUTH_RATE_LIMIT_MAX_REQUESTS`
- `PAYMENT_RATE_LIMIT_MAX_REQUESTS`
- `EXPORT_RATE_LIMIT_MAX_REQUESTS`

## Frontend `apps/frontend/.env.example`

- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_BACKEND_URL`

## Rules

- Real secrets must not be committed.
- Every required backend variable must be validated at startup.
- Public frontend variables must be safe to ship to browsers.
- New env vars require updates here and in the relevant `.env.example`.
- Compose backend uses service DNS names inside Docker: `postgres:5432` and `redis:6379`.
- Host-based backend commands default to `localhost:55432` for Postgres unless `DATABASE_URL` is overridden.
- `pnpm config:check` validates startup configuration. In production it rejects placeholder JWT secrets, default local frontend/CORS values, missing SMTP config when `NOTIFICATION_PROVIDER=smtp`, and missing Razorpay config when `PAYMENT_PROVIDER=razorpay`.
- Rate limit env vars are per backend process. Production should also configure edge/load-balancer rate limiting for multi-instance deployments.

# Environment Checklist

## Backend `.env.example`

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
- Observability ports and flags when used.
- External service keys as empty placeholders.

## Web Frontend `.env.example`

- `NEXT_PUBLIC_BACKEND_URL`
- Public feature flags.
- Public analytics keys if needed.

## Mobile Frontend Env

Use Expo app config and EAS secrets deliberately.

- `EXPO_PUBLIC_API_URL`
- `EXPO_PUBLIC_ENVIRONMENT`
- `EXPO_PUBLIC_SENTRY_DSN`
- `SENTRY_AUTH_TOKEN`
- `GOOGLE_SERVICES_JSON`
- `EXPO_ACCESS_TOKEN`
- Provider keys for chat, subscriptions, CMS, analytics, or maps.

Only expose values with `EXPO_PUBLIC_*` when they are safe to ship inside the app bundle.

## Rules

- Every required environment variable must be validated at startup.
- `.env.example` must include every required variable.
- Secrets must never be committed with real values.
- Mobile secrets should be stored in EAS/environment secret storage for build-time use.

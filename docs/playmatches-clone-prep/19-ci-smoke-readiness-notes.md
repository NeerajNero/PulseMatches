# CI And Smoke Readiness Notes

## Summary

This pass added CI/readiness automation only. No product features, notifications, payment providers, admin moderation, sport-specific scoring, or new routes were added.

Added:

- GitHub Actions workflow for MVP readiness validation.
- Local `pnpm verify:mvp` command for safe non-mutating validation.
- Command documentation for the new verification command.

## CI Workflow

Added:

- `.github/workflows/mvp-ci.yml`

No existing CI configuration was present in the repository, so a GitHub Actions workflow was added.

Workflow trigger:

- `push` to `main`
- `pull_request`

Runtime:

- Ubuntu latest
- Node `20`
- pnpm `9.15.4`
- PostgreSQL `16-alpine` service
- Redis `7-alpine` service

## CI Commands

The workflow runs:

- `pnpm install --frozen-lockfile`
- `node --check scripts/mvp-smoke.mjs`
- `pnpm --filter @matchflow/backend prisma:generate`
- `pnpm --filter @matchflow/backend prisma:deploy`
- `pnpm --filter @matchflow/backend db:seed`
- `pnpm --filter @matchflow/backend typecheck`
- `pnpm --filter @matchflow/backend lint`
- `pnpm --filter @matchflow/backend build`
- `pnpm --filter @matchflow/frontend typecheck`
- `pnpm --filter @matchflow/frontend lint`
- `pnpm --filter @matchflow/frontend build`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- backend start from compiled output
- `/health` readiness wait
- `pnpm smoke:mvp`

The workspace-level commands are intentionally retained even though they overlap with package-specific commands because they protect the root command contract used by local development.

## Database And Redis Setup

CI starts disposable services through GitHub Actions service containers:

- Postgres on host port `55432`
- Redis on host port `56379`

The workflow runs Prisma migration deploy against the disposable Postgres database, then runs the idempotent backend seed. The smoke script depends on those seed users and creates timestamped records through application APIs only.

CI database URL:

```text
postgresql://matchflow:matchflow_dev_password@127.0.0.1:55432/matchflow_arena
```

## Environment Variables

CI uses local-only placeholder values, not real secrets:

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
- `CORS_ORIGINS`
- `FE_APP_URL`
- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_BACKEND_URL`
- `API_URL`
- `PORT`
- `NODE_ENV`
- `APP_VERSION`
- `SERVICE_NAME`

The checked-in values are safe CI/local placeholders. Production deployments must provide real secrets and environment-specific database, Redis, CORS, and frontend URLs.

## Smoke Test CI Status

`pnpm smoke:mvp` is included in CI.

CI smoke behavior:

1. Build the backend.
2. Start the compiled backend in the background with CI env values.
3. Wait for `http://127.0.0.1:3010/health`.
4. Run `pnpm smoke:mvp` against `API_URL=http://127.0.0.1:3010`.
5. Stop the backend and print the tail of the backend log.

The smoke creates isolated timestamped MVP data and does not run migrations, reset the DB, or perform direct database edits.

## Local Validation

Safe local validation:

```bash
pnpm verify:mvp
```

This runs Prisma generate, package-level validation, and workspace-level validation. It intentionally does not run migrations, seed, or smoke.

Full local smoke validation:

```bash
pnpm local:infra:up
pnpm --filter @matchflow/backend prisma:deploy
pnpm --filter @matchflow/backend db:seed
pnpm --filter @matchflow/backend build
pnpm --filter @matchflow/backend start
pnpm smoke:mvp
```

Use a disposable/local database for smoke validation because it creates timestamped records through the API.

## Validation Results

Passed locally:

- `ruby -e "require 'yaml'; YAML.load_file('.github/workflows/mvp-ci.yml'); puts 'yaml_ok'"`
- `node --check scripts/mvp-smoke.mjs`
- `node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); console.log('package_json_ok')"`
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
- `pnpm verify:mvp`

The workflow file was syntax-checked locally with Ruby YAML parsing. Local execution of GitHub Actions itself was not available.

`pnpm smoke:mvp` was not run locally during this pass because no MatchFlow backend was listening on port `3010`, and running smoke against the developer database would create isolated API records. The GitHub Actions workflow starts a backend and disposable Postgres/Redis services before running smoke.

## Known Limitations

- CI assumes GitHub Actions because no other CI configuration was present.
- Smoke validation is API-level only; it does not run browser UI checks.
- The smoke test mutates the configured database by creating isolated records, so it should run only against disposable CI/local databases.
- `pnpm verify:mvp` is intentionally non-mutating and does not replace the smoke test.
- OpenAPI/SDK generation is not part of this CI workflow because this pass did not change backend contracts and SDK generation requires a running backend OpenAPI export path.

## Next Recommended Product Phase

The MVP is now ready for CI-backed hardening. The next product phase should be chosen independently, with notification delivery or real payment integration handled as separate focused slices.

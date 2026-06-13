# Testing And Contract Patterns

The starter pack includes backend contract testing, frontend Playwright, and Storybook conventions.

## Backend Contract Testing

The backend has Dredd config:

```text
apps/backend/dredd.yml
apps/backend/dredd-hooks.js
```

Flow:

1. Start backend.
2. Generate OpenAPI spec from `/api-json`.
3. Run Dredd against the running backend.
4. Use hooks only for small protocol adjustments.

Pattern:

- OpenAPI is not only for SDK generation; it can be tested against real responses.
- Contract tests catch docs/implementation drift.
- Keep hooks small and explicit.

## SDK Contract Flow

Backend contract changes should run this chain:

```text
DTO/Swagger change -> OpenAPI JSON -> Dredd or smoke check -> SDK generation -> frontend typecheck/build
```

Do not stop at "backend compiles" when frontend depends on generated types.

## Frontend Playwright Pattern

Playwright config uses:

- Multi-browser projects.
- CI retries.
- `forbidOnly` in CI.
- HTML reporter.
- Trace on first retry.
- Dedicated output directory.

Rules:

- Use Playwright for critical user flows, auth flows, and regressions that unit tests miss.
- Keep tests deterministic with explicit setup data.
- Use traces for debugging CI failures.

## Storybook Pattern

Storybook is configured for Next.js components:

- Stories under `components`.
- Essentials, docs, interactions, coverage.
- Static assets from `public`.
- Telemetry disabled.

Use Storybook for:

- Reusable UI primitives.
- App-level composites.
- Empty/loading/error visual states.
- Complex form or modal components.

Do not require Storybook for every one-off page section.

## Verification Matrix

Use this matrix to choose checks:

| Change Type | Checks |
| --- | --- |
| Docker/env | Compose up, health checks, env docs |
| Migration | Apply from empty DB, apply to current DB, generate ORM |
| Backend route | Unit/e2e or curl smoke, Swagger/OpenAPI |
| API contract | OpenAPI JSON, Dredd where practical, SDK generation |
| Frontend API | Typecheck/build, affected hook smoke |
| Reusable UI | Storybook or targeted render test |
| Critical flow | Playwright |
| Queue job | Enqueue job, processor path, failed-job behavior |

## Anti-Patterns

- Updating Swagger but not running SDK generation.
- Relying only on generated SDK to prove backend behavior.
- Running broad UI tests when a focused hook/typecheck would catch the issue faster.
- Skipping queue failure-path verification.
- Leaving `test.only` or Playwright focused tests in CI.

# Anti-Patterns To Avoid

These are the failure modes this starter pack is designed to prevent.

## Project Anti-Patterns

- Starting application feature work before Docker services are runnable.
- Starting scaffolding before deciding backend, frontend, and whether frontend is web, mobile, or both.
- Forcing the full feature flow for a clearly tiny change when `/classify` shows a lighter lane is safe.
- Downgrading risky work to tiny to avoid planning or approval.
- Implementing a normal or risky feature directly from user stories without a plan artifact.
- Implementing a normal or risky feature before the user runs `/approve`.
- Letting `/plan` or `/approve` modify application code.
- Running `/implement` without asking which approved file to implement when no file is provided.
- Mixing code generation and API integration in one command when the flow requires verification between them.
- Finalizing a feature with blocking review findings.
- Losing feature state in chat instead of updating feature artifacts.
- Letting context docs become stale after finalized features.
- Writing long context summaries that duplicate source code instead of linking to files.
- Changing schema without a migration.
- Running frontend work against guessed backend response shapes.
- Skipping SDK generation after backend contract changes.
- Keeping setup instructions only in chat history or memory.
- Adding required environment variables without updating `.env.example`.
- Mixing unrelated refactors into feature work.

## Backend Anti-Patterns

- Injecting repositories directly into controllers.
- Exporting repositories as the normal public API of `DBModule`.
- Putting Prisma queries in controllers.
- Returning raw Prisma rows from public API endpoints when they include internal fields.
- Duplicating route strings instead of using `RouteNames`.
- Duplicating regexes and Swagger examples inside DTOs.
- Writing large inline Swagger blocks in controllers.
- Hand-building response envelopes in every controller.
- Throwing generic `Error` for expected domain failures.
- Swallowing Prisma errors and returning vague 500 responses.
- Adding auth route exceptions with ad hoc conditionals instead of declarative decorators.
- Letting cookie names drift between cookie writer, middleware, frontend constants, and docs.
- Registering one global JWT secret when the project needs access, refresh, and temp token separation.
- Adding a queue job without retry/backoff/failure behavior.
- Adding background jobs without event logging, Bull Board visibility, or DLQ consideration.
- Logging secrets, raw cookies, JWTs, passwords, or full authorization headers.

## Database Anti-Patterns

- Using `db push` as the collaborative schema workflow.
- Editing old shared migration files silently.
- Letting generated Prisma client drift from schema.
- Adding indexes only after performance breaks in obvious list/search endpoints.
- Using raw SQL without typed return shapes.
- Doing pagination math differently in each service.
- Exposing deleted, hidden, blocked, or internal rows by default because repository filters were skipped.
- Adding SQL triggers/functions/materialized views without documenting behavior outside Prisma schema.

## API Contract Anti-Patterns

- Hand-writing frontend TypeScript interfaces for backend responses that are already in OpenAPI.
- Editing generated SDK files.
- Hiding contract changes in implementation PRs without regenerating SDK.
- Using interfaces for response DTOs that Swagger needs to emit as schemas.
- Returning inconsistent envelope keys across endpoints.
- Using different naming conventions in different modules without an explicit compatibility reason.

## Frontend Anti-Patterns

- Assuming Next.js when the project needs Expo/mobile.
- Calling backend endpoints directly from components instead of using SDK wrappers and hooks.
- Copying route strings into buttons and redirects instead of using `ROUTES`.
- Copying query key strings into components instead of using query constants.
- Creating one-off inputs, dialogs, tables, and empty states instead of reusing primitives/composites.
- Putting product-specific behavior into `components/ui` primitives.
- Putting API calls inside low-level reusable UI components.
- Duplicating server state in React local state when React Query owns it.
- Invalidating every query after a mutation when a targeted update or targeted invalidation is obvious.
- Ignoring loading, empty, and error states.
- Building a page with a marketing layout when the feature is an operational workflow.
- Letting text overflow buttons, table cells, cards, or modals.
- Adding new global providers for state that only one feature needs.

## Mobile Anti-Patterns

- Putting secrets or private API keys in public Expo config.
- Adding native modules without updating app config, plugins, permissions, EAS profiles, and verification notes.
- Copying one Expo app target into another without changing bundle id, package name, icons, EAS project id, and store submit config.
- Treating Expo Go as verification for a dev-client/native-module app.
- Testing push notifications only in simulators.
- Forgetting to unregister notification, chat, call, or native event listeners.
- Storing all push tokens on the user row instead of user-device rows.
- Sending push notifications inline from controllers instead of queueing retryable fan-out.
- Letting mobile screens call raw backend URLs instead of SDK wrappers.
- Duplicating notification category route maps across apps without a shared constant or documented per-app difference.

## Background Job Anti-Patterns

- Running heavy scheduled work directly inside `@Cron` methods instead of enqueueing a job.
- Adding raw `queue.add("string", data)` calls across services.
- Passing huge objects or file buffers through Redis without a clear reason.
- Retrying non-idempotent jobs without safeguards.
- Dropping failed jobs after retries instead of preserving them in DLQ.

## Observability Anti-Patterns

- Adding health checks that depend on slow or non-critical third parties.
- Returning JSON envelopes from `/metrics` when Prometheus expects plain text.
- Hard-coding local IPs in reusable Prometheus config.
- Adding logs with no retention, rotation, or scraping plan.
- Exposing Bull Board or Grafana publicly without access control.

## Documentation Anti-Patterns

- Adding commands without updating `docs/command-map.md`.
- Adding patterns without listing when not to use them.
- Keeping architecture decisions implicit.
- Writing docs that say what to do but not how to verify it.
- Failing to document known gaps at the end of implementation.

# Patterns To Follow

This is the high-level pattern index for future projects. Use the backend and frontend detail docs for implementation guidance.

## Project Patterns

- Keep the monorepo shape predictable: `apps/backend`, `apps/frontend`, `apps/documentation`, `libs/client_sdk`.
- Begin every new project by deciding whether it has a backend, a frontend, and whether the frontend is web, mobile, or both.
- For mobile projects, allow an Expo workspace shape with `apps/frontend/apps`, `apps/frontend/packages`, and `apps/frontend/services/sdk`.
- Classify feature work before choosing process: tiny, normal, or risky.
- Plan normal and risky features from a user-story markdown file before implementation.
- Use command-gated execution: `/classify`, `/plan`, `/approve`, `/implement`, `/verify`, `/api-integrate`, `/test`, `/review`, `/finalize`.
- Use the tiny-change lane for clearly scoped copy, docs, styling, or isolated local fixes.
- Keep `/plan` and `/approve` read-only for application code.
- Use `/implement` to generate code with existing skills and agents after approval, except for clearly classified tiny changes.
- Use `/api-integrate` after verification for SDK/client API wiring.
- Use `/status`, `/select`, and `/block` to manage multiple features cleanly.
- Run `/context-update` after `/finalize` for normal and risky features so future agents can read compact project memory before scanning the whole codebase.
- Integrate only one approved feature artifact at a time unless the user explicitly provides a batch approval.
- Document commands in `docs/command-map.md` as soon as scripts exist.
- Use Docker for local infrastructure before application work.
- Use migrations as the database source of truth.
- Treat OpenAPI and generated SDK as the backend/frontend contract.
- Keep `.env.example` complete and startup validation strict.
- Work in vertical slices: migration, backend, SDK, frontend, verification.

## Backend Patterns

- API modules own controllers, services, transforms, DTOs, Swagger docs, and module wiring.
- DB modules own Prisma access through repositories and feature DB services.
- Export DB services, not repositories, from shared DB modules.
- Controllers stay thin and return `ResponseUtil.success(...)`.
- Services enforce business rules and map known errors.
- Repositories do query construction and Prisma calls.
- Transform classes map database rows to response DTOs.
- DTOs use centralized validation and Swagger constants.
- Swagger docs live in per-module Swagger objects and decorators.
- Auth and roles use a declarative decorator such as `@Secure([AuthType.JWT], [RoleType.ADMIN])`.
- Route names, app strings, regexes, field descriptions, and query defaults are centralized.
- Async work uses BullMQ queue modules with queue facades, processors, queue services, events, Bull Board, and DLQ.
- Scheduled work enqueues cron jobs instead of doing heavy work directly in `@Cron` methods.
- Handwritten SQL migrations for functions, triggers, materialized views, and seed data are documented and reviewed.
- External providers are isolated behind provider services or interfaces.
- Mobile push notifications use user-device tables, provider abstractions, and queue-based fan-out.
- Heavy report/PDF generation uses template services, PDF services, storage providers, and background queues.
- Health, metrics, logs, and queue visibility are part of the backend baseline.

## Frontend Patterns

- Choose the frontend lane first: web, mobile, or both.
- Generated SDK clients are centralized in `lib/apis/api.ts`.
- Custom fetch owns credentials, server cookie forwarding, refresh behavior, and normalized errors.
- Feature hooks own React Query calls.
- Components import hooks, not raw API clients, unless the component is itself a data adapter.
- `components/ui` contains primitive UI.
- `components/custom` contains reusable domain-agnostic composites.
- `components/layout` contains app shells and navigation.
- `utils/route.ts`, `utils/constants.ts`, and `utils/query-constants.ts` centralize strings.
- Route groups separate user journeys and roles.
- Loading, empty, error, and success states are explicit.

## Mobile Frontend Patterns

- Expo apps live under app-target folders such as `apps/frontend/apps/customer-expo`.
- Shared assets, components, and modules live under workspace packages.
- `app.config.js` owns app ids, permissions, plugins, runtime config, OTA updates, Sentry, and EAS project id.
- `eas.json` owns development, preview, production, and submit profiles.
- Metro is configured for workspace packages and generated SDK resolution.
- Mobile API calls go through a shared generated-SDK wrapper with auth token injection, refresh retry, and normalized errors.
- Root layout composes auth, notification, network, Sentry, gesture, keyboard, UI, state, splash, and router providers.
- Push notifications register device tokens, persist local unread counts when needed, and route by notification category.
- Camera/gallery/file flows use shared hooks with permission, type, and size validation.
- Native capabilities are verified in a dev client or device build, not only Expo Go.

## Verification Patterns

- Verify Docker services before backend verification.
- Verify migration apply and ORM generation before API work is considered complete.
- Verify backend health and OpenAPI before SDK generation.
- Verify implementation before SDK/client API integration.
- Run the narrowest meaningful tests first, then broader checks when shared contracts changed.
- Verify queue success and failure paths when background jobs change.
- Verify SQL-heavy migrations against empty and current databases when feasible.
- Verify Prometheus-compatible metrics, health checks, and log output when observability changes.
- Verify mobile permissions, push notifications, camera/media, and native SDK integrations on physical devices when touched.
- Verify context docs were updated for finalized features.

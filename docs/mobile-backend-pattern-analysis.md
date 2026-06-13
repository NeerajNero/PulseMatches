# Mobile Backend Pattern Analysis

This starter-pack update captures Expo mobile workspace patterns and compares their backend support patterns against the existing backend baseline.

## Observed Project Shape

```text
apps/
  backend/
  frontend/
  ai/
  cms/
documentation/
```

Frontend workspace:

```text
apps/frontend/
  apps/
    customer-expo/
    operator-expo/
    portal-web/
  packages/
    assets/
    components/
    modules/
  services/
    sdk/
    graphql/
```

Backend workspace:

```text
apps/backend/
  src/api/
    product-a/
    product-b/
    notification/
    media-upload/
    sms/
    email/
    metrics/
    health/
  src/db/
  src/background/
  src/templates/
  src/pdf/
  src/ai/
  src/speech/
```

## Mobile Practices Extracted

- Multiple Expo app targets share one frontend workspace.
- App-specific code lives under `apps/frontend/apps/<app>-expo`.
- Shared assets, reusable mobile components, shared auth/session/media modules, and generated SDKs are workspace packages.
- Expo app config owns permissions, plugins, Sentry config, EAS project id, OTA update URL, app identifiers, icons, and runtime env exposure.
- EAS build profiles split development, preview, and production.
- Metro is configured for monorepo watch folders and workspace package resolution.
- Expo Router is used for auth, app, tabs, onboarding, and nested role workflows.
- Root layout composes fonts, splash, Sentry, error boundary, network status, keyboard provider, auth, UI provider, gesture root, Redux, notifications, and router.
- API calls go through a shared SDK-backed Axios client with token injection, refresh retry, and normalized errors.
- Auth/session restoration is centralized through context plus token utilities.
- Push notification setup uses Expo notification APIs, EAS project id, device token state, local unread category counts, and route mapping on notification response.
- NetInfo powers a global network status surface.
- Camera/gallery logic is wrapped in a shared hook with file type and size validation.
- Sentry is configured for mobile crash reporting and navigation instrumentation.
- Third-party mobile SDKs such as chat/calls and subscription providers are isolated behind providers/contexts.
- Mobile deployment docs include Apple/Google credential needs, EAS secrets, build profiles, submit config, and store distribution steps.

## Backend Practices Worth Adding

The backend already follows most starter-pack patterns: NestJS, Prisma, DB service/repository boundaries, OpenAPI/SDK generation, global validation, filters, logging, Redis/BullMQ, health, metrics, Dredd, Docker, Loki/Promtail, and provider abstractions.

Patterns worth carrying forward:

- **Mobile notification backend**: user-device tables, unique token/user constraints, logout token deletion, notification DB records, queued push fan-out, Expo provider abstraction, and category-based payloads.
- **Provider tokens for external services**: email, SMS, push notifications, and storage are exposed as service-level abstractions instead of hard-coded vendor calls.
- **Storage provider factory**: media upload modules can select AWS, MinIO, or another provider from config while application services depend on `StorageProvider`.
- **Template and PDF pipeline**: templates generate HTML, PDF service renders with Puppeteer, queue processors run heavy generation, files are uploaded to storage, and users are notified by email/notification.
- **Database event triggers for async processors**: migrations can use `pg_notify` triggers for new notifications and subscription events.
- **Vector search setup**: migrations enable `vector`, create an embedding table with JSONB metadata, and add an HNSW cosine index for AI retrieval.
- **Multi-surface API modules**: separate product domains can share infrastructure while keeping product surfaces isolated.
- **AI as a separate service boundary**: model/runtime-specific code should live behind a separate service boundary instead of being mixed into normal API services.

## Patterns Not To Copy Blindly

- Do not put secrets in public Expo config. Only values safe for clients should use `EXPO_PUBLIC_*`.
- Use secure storage for sensitive mobile tokens when risk is high; `AsyncStorage` is acceptable only after an explicit product/security decision.
- Avoid writing temporary PDF files to disk in the hot path unless there is a clear platform need; prefer buffers/streams when practical.
- Keep generated SDK output in a predictable location per project. `libs/client_sdk` is preferred for web-first projects; `apps/frontend/services/sdk` is acceptable for Expo workspaces if documented.
- Avoid duplicating notification route maps across app targets; centralize by app when categories are shared.

## Starter Pack Changes From This Review

- Added [mobile app patterns](mobile-app-patterns.md).
- Updated kickoff flow to ask backend/frontend and web/mobile/both before scaffolding.
- Added a mobile frontend skill for Expo projects.
- Extended backend docs with mobile push, provider factory, PDF/report, `pg_notify`, and vector-search patterns.
- Extended SQL and BullMQ docs with the notification/subscription trigger and mobile push queue cases.

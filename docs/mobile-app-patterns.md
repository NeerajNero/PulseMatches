# Mobile App Patterns

These patterns are derived from mature Expo mobile app workspaces.

Use this doc when a new project has a mobile frontend, or both web and mobile frontends.

## First Decision

Before scaffolding, answer these questions in `docs/project-brief.md`:

- Is there a backend?
- Is there a frontend?
- If there is a frontend, is it web, mobile, or both?
- If mobile, is the target Expo managed workflow, bare React Native, or another stack?
- Which platforms are required: iOS, Android, mobile web preview, or all?
- Which mobile capabilities are required: push notifications, camera, gallery, files, QR, payments, subscriptions, chat, calls, offline handling, deep links, or OTA updates?

Do not assume a Next.js frontend when the project needs mobile.

## Recommended Mobile Workspace Shape

For Expo apps, use a workspace layout:

```text
apps/frontend/
  apps/
    customer-expo/
      app/
      components/
      context/
      hooks/
      store/
      app.config.js
      eas.json
      metro.config.js
      package.json
      tsconfig.json
    admin-expo/
  packages/
    assets/
    components/
    modules/
  services/
    sdk/
    graphql/
```

Use one Expo app folder per brand, user surface, or store listing. Put shared UI, assets, and modules in packages so apps do not copy infrastructure.

## Expo App Config Pattern

Each app target owns its `app.config.js`.

Include:

- App name, slug, owner, version, icon, and scheme.
- iOS bundle identifier, build number, tablet support, and `infoPlist` permission strings.
- Android package name, version code, adaptive icon, keyboard behavior, permissions, and Google services file.
- Expo plugins for router, splash screen, fonts, dev client, Sentry, build properties, notifications, camera, audio, media library, or native SDK config plugins.
- `extra` values for public runtime config, third-party IDs, Sentry DSN, environment name, and EAS project id.
- `updates.url` and `runtimeVersion` when OTA updates are used.

Use environment variables through Expo config. Do not hard-code API URLs, tokens, app secrets, provider IDs, or Sentry auth values.

## EAS Build Pattern

Each mobile app owns `eas.json`.

Use separate profiles:

- `development`: development client, internal distribution, APK for Android, simulator when useful for iOS.
- `preview`: internal distribution for QA.
- `production`: store distribution, Android app bundle, production channel.

Document:

- App store ids.
- Bundle identifiers/package names.
- Build channels.
- Whether version/build numbers auto-increment.
- Required Expo secrets.
- Manual credential setup for Apple and Google when the project cannot rely on EAS-managed credentials.

## Metro Monorepo Pattern

In Expo monorepos, configure Metro deliberately:

- Watch the workspace root plus shared `packages` and `services`.
- Resolve `node_modules` from both app and workspace roots.
- Add `extraNodeModules` only for packages Metro fails to resolve reliably.
- Use the Sentry Metro config wrapper when Sentry is enabled.

Do not let each mobile app invent its own shared-package resolution strategy.

## TypeScript Path Pattern

Each app should use strict TypeScript and path aliases:

```text
@/* -> app-local files
@components/* -> shared components
@assets/* -> shared assets
@modules/* -> shared modules
@sdk/* -> generated SDK
```

Keep aliases aligned with Metro. A path alias that TypeScript understands but Metro cannot resolve is a runtime bug waiting to happen.

## Generated SDK Pattern For Mobile

Mobile apps should consume backend APIs through a generated SDK, not handwritten endpoint strings.

Pattern:

```text
packages/modules/common/apiClient/index.ts
  -> shared axios/fetch instance
  -> auth header injection
  -> refresh token retry
  -> normalized API errors
  -> apiClient(ApiClass)

services/sdk/
  -> generated from backend OpenAPI
```

Rules:

- Generated SDK files are not manually edited.
- Shared API client owns auth, refresh, base URL, and error normalization.
- Feature screens call feature services/hooks that wrap SDK clients.
- Backend route changes regenerate SDK before mobile integration.

## Auth And Session Pattern

Mobile auth should be centralized:

- `AuthContext` or equivalent owns current session and loading state.
- Session utilities own reading, writing, and clearing access and refresh tokens.
- The API client injects `Authorization: Bearer <access_token>`.
- The API client performs one refresh-token retry on `401` and clears session on refresh failure.
- On app startup, restore tokens and decode/check expiration before showing protected routes.
- Store route/onboarding progress separately from auth tokens.

For sensitive products, prefer platform keychain/keystore storage such as `expo-secure-store` over plain `AsyncStorage` for long-lived secrets.

## Root Provider Pattern

The root layout should compose app-level providers once:

- URL polyfills.
- Reanimated import.
- Font loading and splash screen handling.
- Sentry initialization and navigation instrumentation.
- Error boundary.
- Network status overlay.
- Keyboard provider.
- Auth provider.
- UI provider/theme.
- Gesture root.
- Redux or app state provider when needed.
- Notification provider.
- Router stack/tabs.

Keep feature providers close to the feature unless they truly affect the whole app.

## Navigation Pattern

With Expo Router:

- Use route groups for auth, onboarding, app, tabs, admin, patient, profile, or role-specific flows.
- Keep stack options close to the layout that owns the journey.
- Route notification responses through a category-to-route map.
- Avoid scattering string routes across screens; centralize route maps when they are reused.

## Push Notification Pattern

Use Expo notifications when building Expo apps:

- Request permissions at startup or at the first moment the user expects notifications.
- On Android, create a notification channel.
- Read the EAS project id from app config when calling `getExpoPushTokenAsync`.
- Collect Expo push token and device push token where the backend needs both.
- Send the Expo push token to the backend and associate it with the signed-in user/device.
- Persist unread notification state locally by category when the UX needs badges.
- Map notification categories to app routes.
- Remove listeners on unmount.

Backend side:

- Store device tokens in user-device tables.
- Use unique constraints on `(expo_push_token, user_id)` so reinstall/login churn does not duplicate devices.
- Delete device tokens on logout.
- Send pushes through a `NotificationProvider` abstraction.
- Use a notification queue for retryable fan-out.

## Camera And Media Pattern

Use a shared media module for camera and gallery behavior:

- Wrap camera/gallery selection in a hook.
- Validate file type before upload.
- Enforce file size limits before upload.
- Normalize native picker results into `{ uri, name, type }` objects for multipart uploads.
- Support single and multi-image flows deliberately.
- Return user-friendly error types: file type, file size, permission, cancelled, processing, unknown.

Use `expo-camera` for live preview and scanning. Use a native picker/cropper package when Expo camera has platform regressions or when the workflow needs stable gallery/capture behavior across many devices.

## Network And Offline Pattern

Mobile apps need an explicit network state:

- Use NetInfo to detect connectivity.
- Show a global no-connection surface that matches the current app brand/shell.
- Do not fire retry loops while offline.
- Keep offline state separate from backend error state.

If offline write support is required, document queueing, conflict resolution, and sync retry before implementation.

## State Pattern

Use local component state for screen-only behavior.

Use Redux Toolkit or a similar store for:

- Multi-step flows.
- Cross-screen selections.
- Current user/profile summaries.
- Treatment/cart-style builders.
- Badge counts or UI state shared across tabs.

Do not duplicate server state in Redux when an SDK hook/query cache owns it.

## Mobile External Integration Pattern

Wrap native or third-party SDKs in providers or services:

- Sentry for crash reporting and navigation instrumentation.
- CometChat for chat/calls.
- RevenueCat for subscriptions and entitlements.
- Firebase/Google services where platform services require it.
- Strapi or CMS clients for content.

Each integration needs:

- One initialization point.
- Typed config from app config/env.
- Cleanup for listeners.
- Error handling routed to Sentry or logs.
- A local stub or disabled mode for development when possible.

## Performance Targets

Set practical performance goals early:

- Cold start under 2 seconds for normal production devices.
- Warm start under 1 second.
- Screen transition/render under 250 ms for common screens.
- Main interactions under 200 ms.
- Crash-free sessions target documented and monitored in Sentry.

Verify with device testing, Sentry performance, Expo/dev tools, or platform profilers when the mobile surface is important.

## Mobile Verification

Before calling mobile work done:

- `expo lint` or project lint passes.
- TypeScript check/build passes if configured.
- App starts in Expo dev client or simulator.
- At least one iOS and one Android path are checked when native permissions or plugins changed.
- Push notification token registration is tested on a physical device when notifications changed.
- Camera/gallery/file flows are tested on a real device when touched.
- EAS config changes are reviewed against app ids, package names, build channels, and secrets.

## Mobile Anti-Patterns

- Assuming web-only frontend defaults for a mobile product.
- Putting app secrets in `EXPO_PUBLIC_*` variables.
- Using `AsyncStorage` for highly sensitive long-lived tokens without an explicit security decision.
- Adding native modules without updating `app.config.js`, plugins, permissions, and EAS notes.
- Copying app config between app targets without changing bundle ids, package names, icons, and EAS project ids.
- Calling raw backend URLs directly from screens.
- Keeping notification category strings only inside one screen.
- Forgetting to unregister push/listener subscriptions.
- Testing push notifications only in simulators.
- Treating Expo Go as proof that a dev-client/native-module app works.

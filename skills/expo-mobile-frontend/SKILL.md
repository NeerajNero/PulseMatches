---
name: expo-mobile-frontend
description: Use when building Expo or React Native mobile frontend projects, app targets, screens, generated SDK integration, EAS config, push notifications, camera/media, auth/session providers, Sentry, or mobile verification.
---

# Expo Mobile Frontend

Use this skill for mobile frontend work. Do not apply Next.js-only structure to Expo apps.

## Workflow

1. Confirm frontend target: mobile only, or web and mobile.
2. Inspect existing Expo app targets under `apps/frontend/apps`.
3. Inspect shared packages under `apps/frontend/packages` and generated SDK location under `apps/frontend/services/sdk` or the documented SDK workspace.
4. Check `app.config.js`, `eas.json`, `metro.config.js`, `tsconfig.json`, and package scripts before adding native features.
5. Use generated SDK clients through a shared mobile API wrapper.
6. Put reusable mobile UI in shared component packages when it can be reused by more than one app target.
7. Keep app-specific screens, navigation, app config, store config, and brand-specific assets inside the app target.
8. Verify with Expo lint/typecheck/build scripts when available, plus dev-client/simulator/device checks for native features.

## App Shape

Preferred shape:

```text
apps/frontend/
  apps/
    app-name-expo/
      app/
      components/
      context/
      hooks/
      store/
      app.config.js
      eas.json
      metro.config.js
  packages/
    assets/
    components/
    modules/
  services/
    sdk/
```

## API Rules

- Screens do not call raw backend URLs.
- Shared API client owns base URL, auth token injection, refresh retry, and normalized errors.
- Generated SDK files are never hand-edited.
- Regenerate SDK after backend contract changes.
- Keep mobile runtime config in Expo config and environment variables.

## Native Config Rules

Update app config when adding:

- Camera, gallery, microphone, location, notifications, media library, or files.
- Sentry, RevenueCat, CometChat, Firebase, WebRTC, or other native SDKs.
- Deep links, URL schemes, OTA updates, icons, splash screens, bundle ids, package names, or build numbers.

Update EAS config when changing:

- Build profiles.
- Distribution type.
- Submit config.
- Channels.
- App version source.
- Platform-specific build settings.

## Provider Rules

Root layout can own app-wide providers:

- Auth/session.
- Notifications.
- Network status.
- Sentry navigation instrumentation.
- Gesture handler root.
- Keyboard provider.
- UI theme provider.
- Redux or equivalent app state.

Feature-only providers should stay near their feature.

## Push Notifications

- Request permissions deliberately.
- Configure Android notification channel.
- Use EAS project id for Expo push token registration.
- Send device tokens to backend and delete the current token on logout.
- Route notification responses through category-to-route maps.
- Persist unread category counts locally only when the UX needs it.
- Test push notifications on a physical device.

## Camera And Media

- Wrap camera/gallery behavior in shared hooks.
- Validate file type and file size before upload.
- Normalize native assets into multipart-compatible objects.
- Use `expo-camera` for live preview/scanning.
- Use a stable picker/cropper package when the app needs robust capture/gallery flows across devices.

## Done

- App target structure follows the workspace convention.
- API access uses the generated SDK wrapper.
- Native config, permissions, and EAS profiles are updated when needed.
- Loading, empty, error, offline, and permission-denied states are handled where relevant.
- Verification notes mention simulator/dev-client/device coverage and any untested platform.

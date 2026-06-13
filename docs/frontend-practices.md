# Frontend Practices

## Baseline

Choose the frontend target first:

- Web: use Next.js App Router with the practices below.
- Mobile: use [mobile-app-patterns.md](mobile-app-patterns.md).
- Both: keep API contracts and generated SDK usage consistent, but let web and mobile keep their own app structure.

For web, use Next.js App Router with:

- Route groups by user journey or role.
- React Query for server state.
- Generated SDK clients for API calls.
- A custom fetch wrapper for cookie forwarding, credentials, token refresh, and normalized errors.
- Tailwind and Radix/shadcn-style primitives.
- Storybook for reusable UI where the surface area justifies it.
- Playwright for critical flows.

## Recommended Shape

Web shape:

```text
apps/frontend/app
apps/frontend/components/ui
apps/frontend/components/custom
apps/frontend/components/layout
apps/frontend/components/providers
apps/frontend/hooks
apps/frontend/lib/apis
apps/frontend/lib
apps/frontend/utils
apps/frontend/styles
```

See [frontend-patterns.md](frontend-patterns.md) for the detailed route group, reusable component, hook, SDK, query key, and constants patterns.

Mobile shape:

```text
apps/frontend/apps/<name>-expo
apps/frontend/packages/assets
apps/frontend/packages/components
apps/frontend/packages/modules
apps/frontend/services/sdk
```

See [mobile-app-patterns.md](mobile-app-patterns.md) for Expo, EAS, Metro, auth/session, push notification, camera/media, and mobile verification patterns.

## API Rules

- Import generated SDK classes from `libs/client_sdk`.
- Instantiate SDK clients in `lib/apis/api.ts`.
- Use `customFetch` for auth, SSR cookie forwarding, refresh behavior, and consistent error throws.
- Create feature hooks in `hooks/use<Feature>.ts`.
- Keep cache keys centralized when the feature has more than one query.

## UI Rules

- Use existing `components/ui` primitives before adding custom components.
- Use icons in icon-sized controls.
- Keep operational apps dense, scannable, and predictable.
- Avoid landing-page composition for admin or workflow tools.
- Buttons, inputs, tables, dialogs, tabs, selects, checkboxes, and switches should use consistent primitives.
- Keep text inside buttons and cards responsive and non-overlapping.

## React Query Defaults

Default behavior:

- Do not refetch on window focus unless the workflow needs it.
- Retry network/server errors conservatively.
- Do not retry predictable 4xx errors.
- Use mutations for writes and invalidate affected queries explicitly.

## Server Components And Cookies

For SDK calls inside server components:

- Read cookies through `next/headers`.
- Forward the `Cookie` header to backend calls when the route is protected.
- Keep public route detection centralized.

For client calls:

- Use `credentials: "include"` for protected backend calls.
- Redirect to login only after refresh fails.

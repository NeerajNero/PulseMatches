# Frontend Patterns

These patterns are derived from mature Next.js web frontend projects. For Expo or React Native work, use [mobile-app-patterns.md](mobile-app-patterns.md) alongside this document.

## Frontend Target Decision

Before scaffolding frontend code, record whether the frontend is:

- Web only.
- Mobile only.
- Both web and mobile.

Use this file for web/Next.js. Use `mobile-app-patterns.md` for mobile/Expo. When both exist, keep shared generated SDK access and shared domain types consistent, but do not force web component structure onto mobile app folders.

## App Shape

For web, use this structure:

```text
apps/frontend/
  app/
  components/ui/
  components/custom/
  components/layout/
  components/providers/
  hooks/
  lib/apis/
  lib/
  utils/
  styles/
```

## Route Group Pattern

Use route groups to separate user journeys:

```text
app/(auth)
app/(admin)
app/(contributor)
app/(viewer)
```

Each group can own its own layout, loading states, and page-specific composition.

## API Client Pattern

Use generated SDK classes only through centralized wrappers:

```text
lib/apis/api.ts
lib/apis/sdk-custom-fetch.ts
lib/apis/api-helper.ts
```

Pattern:

- `api.ts` creates SDK API class instances with a shared `Configuration`.
- `sdk-custom-fetch.ts` owns cookies, credentials, token refresh, and normalized errors.
- Server component calls forward cookies through `next/headers`.
- Client calls include credentials for protected backend calls.
- Public route detection is centralized.

Do not call `fetch("/v1/...")` directly in pages and components for backend API routes that exist in the SDK.

## Hook Pattern

Use one feature hook file per backend feature:

```text
hooks/useTags.ts
hooks/useUsers.ts
hooks/usePackages.ts
hooks/useAlbums.ts
```

Hooks should:

- Import SDK clients from `lib/apis/api.ts`.
- Import generated request and response types from `libs/client_sdk`.
- Use React Query for server state.
- Use centralized query keys.
- Apply debounce, stale time, and cache time intentionally.
- Handle mutations, invalidations, and targeted cache updates.
- Surface domain-friendly data to components.

Components should usually consume hooks, not raw SDK clients.

## Query Key Pattern

Centralize query keys in `utils/query-constants.ts`.

For simple features:

```ts
export const QUERY_TAGS_LIST = "tagsList";
```

For larger features:

```ts
export const VIDEO_CONFIG = {
  QUERY_KEYS: {
    VIDEOS_LIST: "videos-list",
    VIDEO_BY_ID: "video-by-id",
  },
  LIMITS: {
    VIDEOS: 20,
  },
  CACHE: {
    TIME: 5 * 60 * 1000,
    STALE_TIME: 2 * 60 * 1000,
  },
};
```

Do not invent inline query keys in components.

## Component Layer Pattern

Use three layers:

- `components/ui`: primitive design-system components such as button, input, table, dialog, tabs, select, switch, checkbox.
- `components/custom`: reusable composites such as `CustomInput`, `DataTable`, `CustomModal`, `Pagination`, `NoData`, `SearchComponent`, `UploadComponent`.
- `components/layout`: app shells, headers, sidebars, role-specific navigation, and layout clients.

Create reusable components when:

- The UI appears in more than one place.
- It wraps a primitive with consistent app styling.
- It combines behavior and presentation that would otherwise be copied.
- It enforces app-wide interaction rules.

Avoid creating a custom component for a one-off page fragment unless it improves readability substantially.

## Primitive UI Pattern

`components/ui` should stay generic and low-level.

Good primitive examples:

- `button.tsx`
- `input.tsx`
- `table.tsx`
- `dialog.tsx`
- `select.tsx`
- `tabs.tsx`
- `checkbox.tsx`
- `switch.tsx`

Do not put product-specific copy, routes, API calls, or business logic in UI primitives.

## Composite Component Pattern

`components/custom` can combine app style and behavior.

Good composite examples:

- `CustomInput` wraps label, icon toggles, error text, disabled styling, and the primitive input.
- `DataTable` wraps TanStack Table, table primitives, and no-data state.
- `ProfileSettings` components group related account UI.
- `AlbumCreationModal` splits a complex modal into internal subcomponents.

Keep composites reusable and prop-driven.

## Constants Pattern

Centralize:

- Routes in `utils/route.ts`.
- Query keys in `utils/query-constants.ts`.
- Cookie names, header names, upload limits, static option lists, and shared labels in `utils/constants.ts`.
- URL helpers in `utils/url-utils.ts`.
- Password rules in password utility files.

Do not scatter string route paths or cookie names through components.

## Provider Pattern

Root layout should compose app-level providers:

- React Query provider.
- Devtools in development.
- Toast provider/container.
- User or auth provider when needed.
- App layout shell.

Keep providers small and predictable. Avoid creating new global providers for state that belongs to one route group or one feature.

## Form Pattern

Use:

- `react-hook-form` for non-trivial forms.
- Generated DTO types where possible.
- Shared input, label, select, checkbox, switch, and modal components.
- Server error messages from normalized SDK errors.

Avoid duplicating validation rules that already exist in backend DTOs unless the client needs early UX validation. When duplicating, centralize the rule in a frontend utility.

## Table/List Pattern

Use reusable table/list primitives:

- `DataTable` for generic tabular rendering.
- Feature-specific columns near the feature page or component.
- Shared empty states via `NoData` or `NoDataMessage`.
- Pagination as a reusable component.

Keep data transformation in hooks or helpers, not table cells, when the transformation is reused.

## Frontend Verification Pattern

For frontend changes, verify the most relevant layer:

- Typecheck or build for SDK type changes.
- Storybook for reusable UI components.
- Playwright for critical flows.
- Manual browser check for layout and auth/cookie behavior.

Always mention which one was run and what was not run.

For mobile verification, use [mobile-app-patterns.md](mobile-app-patterns.md).

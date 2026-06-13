---
name: nextjs-generated-sdk-frontend
description: Use when building Next.js App Router frontend features that consume a generated backend SDK with React Query, custom fetch auth handling, Tailwind, and Radix/shadcn-style UI primitives.
---

# Next.js Generated SDK Frontend

Use generated SDK types for backend integration.

## Workflow

1. Inspect existing route groups, components, hooks, and API wrappers.
2. Confirm SDK has the backend route/model needed.
3. Add or update SDK client instances in `lib/apis/api.ts` only when needed.
4. Add feature hooks with React Query.
5. Reuse `components/ui` primitives and `components/custom` composites before creating new UI.
6. Centralize new routes, query keys, cookie names, headers, and repeated options.
7. Cover loading, empty, error, and success states.
8. Verify in browser, typecheck, build, or tests as available.

## API Rules

- No hand-written backend endpoint strings in feature components.
- Use generated request and response types.
- Use a custom fetch wrapper for credentials, cookie forwarding, token refresh, and error normalization.
- Keep query keys stable and centralized for larger features.
- Feature components should consume hooks instead of raw SDK clients in most cases.

## UI Rules

- Use existing `components/ui` first.
- Put reusable app-level composites in `components/custom`.
- Prefer dense, operational layouts for admin/workflow tools.
- Keep text within containers at mobile and desktop sizes.
- Use icon buttons where a standard icon exists.

## Done

- UI calls backend through generated SDK wrapper.
- Server state uses React Query.
- Important states are handled.
- Verification result is documented.

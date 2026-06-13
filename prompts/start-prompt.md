# Start Prompt

Use this prompt when starting a new project from this starter pack.

```text
You are working in a new full-stack project. Use the starter-pack conventions in this repo as the operating standard.

Before scaffolding, ask and record these project-shape decisions:
- Does this project need a backend?
- Does this project need a frontend?
- If frontend is needed, is it web, mobile, or both?
- If mobile is needed, which platforms are required: iOS, Android, web preview, or all?
- If mobile is needed, which capabilities are required: push notifications, camera/gallery, files, QR, chat/calls, subscriptions, deep links, offline support, or OTA updates?

First, inspect the workspace and create or update these docs:
- docs/project-brief.md
- docs/command-map.md
- docs/architecture.md
- docs/env-checklist.md
- docs/patterns-to-follow.md
- docs/anti-patterns.md
- docs/features/user-stories.md when the user has feature ideas ready
- docs/features/feature-index.md when feature planning starts
- docs/context/project-map.md
- docs/context/feature-memory.md
- docs/context/decisions.md

Then scaffold the project with a Docker-first and migration-first approach:
- Monorepo with apps/backend when backend is needed, apps/frontend when frontend is needed, apps/documentation, libs/client_sdk for web-first SDKs, or apps/frontend/services/sdk for Expo workspaces.
- Backend with NestJS, Prisma, Postgres, Redis, validated env config, health endpoint, Swagger/OpenAPI, global validation, global errors, response envelope, and logging when backend is needed.
- Docker compose before app feature work.
- Prisma schema and first migration before API routes depend on database fields.
- SDK generation from backend OpenAPI during `/api-integrate`, after implementation verification.
- Web frontend with Next.js App Router, React Query, Tailwind, Radix/shadcn-style primitives, generated SDK wrapper, and route groups appropriate to the app.
- Mobile frontend with Expo Router, app.config.js, eas.json, monorepo Metro config, shared packages for assets/components/modules, generated SDK wrapper, auth/session provider, notification/media/network patterns, and app-target-specific config.

Work in vertical slices. For each feature, do plan, approval, implementation, verification, API integration, tests, and review in that order.

Use the command-gated feature flow:
- `/classify <task-or-user-stories.md>` chooses tiny, normal, or risky flow.
- `/plan <user-stories.md>` creates feature plans only.
- `/approve <feature-plan.md>` records human approval only.
- `/implement <approval-or-approved-plan.md>` is the first step allowed to change application code and should use existing skills and agents.
- `/verify <implementation-report.md>` verifies generated code before API integration.
- `/api-integrate <implementation-report.md>` wires OpenAPI/SDK wrappers and web/mobile API callers.
- `/test <implementation-report.md>` and `/review <implementation-report.md>` update the implementation report.
- `/finalize <implementation-report.md>` creates the final handoff.
- `/context-update <final-or-implementation-report.md>` updates compact project memory for future work.

Use the lane policy:
- Tiny changes can skip plan and approval when clearly classified and scoped.
- Normal features require plan, approval, implementation, verification, testing, review, finalization, and context update.
- Risky features require the full flow plus stricter migration, auth, provider, queue, native, infrastructure, and observability checks.

Follow the starter-pack backend and frontend patterns:
- Backend controllers stay thin; repositories are not injected into controllers; DB services are exported instead of repositories; DTOs use constants; Swagger is per-module; transforms own response mapping.
- Frontend API access goes through generated SDK wrappers and hooks; reusable primitives go in components/ui; reusable composites go in components/custom; routes, query keys, cookie names, and shared constants are centralized.
- Mobile API access goes through generated SDK wrappers; app-level providers own auth, notifications, network status, Sentry, gestures, keyboard, and navigation; native capabilities are declared in app config and verified on device.

Before finishing, run the most relevant checks available in the repo and summarize:
- selected lane
- changed files
- commands run
- verification result
- known gaps
```

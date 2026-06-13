---
name: project-bootstrap
description: Use when starting a new project from this starter pack, including backend-only, web frontend, mobile Expo frontend, or web+mobile projects that need Docker-first, migration-first, generated SDK contracts, and documentation.
---

# Project Bootstrap

Use this skill to turn a blank or partial repo into the starter-pack shape.

## Workflow

1. Inspect the repo before editing.
2. Ask or infer project shape: backend, frontend, and whether frontend is web, mobile, or both.
3. Create or update docs from `starter-pack/templates`.
4. Establish monorepo shape based on project shape:
   - backend: `apps/backend`
   - web frontend: `apps/frontend` or `apps/frontend/apps/web`
   - mobile frontend: `apps/frontend/apps/<name>-expo`, `apps/frontend/packages`, `apps/frontend/services/sdk`
   - docs: `apps/documentation`
   - SDK: `libs/client_sdk` or documented frontend `services/sdk`
5. Add Docker compose before feature work when backend/local services exist.
6. Add backend env validation and `.env.example` when backend exists.
7. Add Prisma schema and first migration before API routes when backend has data.
8. Add backend health and Swagger/OpenAPI when backend exists.
9. Add SDK generation command when backend and frontend both exist.
10. Add web SDK wrapper and React Query provider when web exists.
11. Add Expo app config, EAS config, Metro config, shared packages, and mobile SDK wrapper when mobile exists.
12. Add background job, observability, SQL migration, mobile native, and external integration docs when those surfaces exist.
13. Create `docs/features` workflow placeholders when the project is ready for feature planning.
14. Create `docs/context` placeholders for compact project memory when useful.
15. Verify and report commands run.

## Defaults

- Backend: NestJS, Prisma, Postgres, Redis, Swagger.
- Web frontend: Next.js App Router, React Query, Tailwind, Radix/shadcn-style primitives.
- Mobile frontend: Expo Router, EAS, monorepo Metro config, shared packages, generated SDK wrapper, auth/session, notifications, network status, camera/media patterns.
- Contract: backend OpenAPI generates `libs/client_sdk` for web-first projects or `apps/frontend/services/sdk` for Expo workspaces.
- Docs: command map, architecture, env checklist, project brief.
- Feature flow: user stories, plan, approve, implement, verify, API integrate, test, review, finalize.
- Context flow: project map, feature memory, decisions, and focused maps updated after finalized features.
- Async work: BullMQ queues, processors, events, Bull Board, and DLQ.
- Observability: health, metrics, logs, and queue visibility.
- Advanced DB: SQL functions, triggers, materialized views, indexes, and seed data documented alongside migrations.

## Completion Criteria

- Docker services run.
- Migration applies.
- Backend starts.
- OpenAPI endpoint responds.
- SDK generation works.
- Web frontend starts or builds when web exists.
- Mobile app starts in Expo dev client/simulator when mobile exists.
- Background, SQL, observability, and provider patterns are documented if used.
- Verification notes list gaps honestly.

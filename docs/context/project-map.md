# Project Map

## Current Shape

- Starter-pack operating docs live at the repo root and under `docs/`, `commands/`, `agents/`, `skills/`, and `templates/`.
- Application code is being introduced under:
  - `apps/backend`
  - `apps/frontend`
  - `apps/documentation`
  - `libs/client_sdk`

## Key Docs

- Product brief: `docs/project-brief.md`
- Architecture: `docs/architecture.md`
- Command map: `docs/command-map.md`
- Env checklist: `docs/env-checklist.md`
- Feature stories: `docs/features/user-stories.md`
- Feature index: `docs/features/feature-index.md`
- Discovery audit: `docs/features/discovery/playmatches-feature-audit.md`

## Operating Rules

- Follow starter-pack flow: docs first, plan before code, implementation only for approved slice.
- Keep generated SDK as the frontend API contract.
- Use Docker-first local infrastructure. `pnpm local:up` runs Postgres, Redis, backend, and frontend in containers; `pnpm local:infra:up` is available for host-based app development.
- Use migrations as the data source of truth once business schema is introduced.
- Do not copy Playmatches branding, UI, copy, images, screenshots, or proprietary assets.

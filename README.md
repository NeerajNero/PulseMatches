# Starter Pack

This folder is a reusable project starter pack for backend, web, and mobile projects.

It captures working defaults for productive projects:

- Docker-first local infrastructure.
- Migration-first database changes.
- NestJS backend with validated environment config, DTOs, Swagger, Prisma, repositories, transforms, guards, interceptors, logging, queues, and health checks.
- Next.js App Router frontend with React Query, generated SDK APIs, server/client cookie handling, Radix/shadcn-style primitives, Tailwind, Storybook, and Playwright.
- Expo mobile frontend patterns with app targets, EAS config, Metro monorepo setup, shared packages, mobile SDK wrappers, auth/session, push notifications, camera/media, network status, Sentry, and native verification.
- OpenAPI as the backend/frontend contract.
- Feature-wise command flow with lanes: classify first, then use tiny, normal, or risky flow based on scope.
- Documentation and operating notes as part of the repo, not an afterthought.

## How To Use

1. Read [FLOW_README.md](FLOW_README.md) for the practical daily workflow.
2. Read [AGENTIC_FLOW.md](AGENTIC_FLOW.md) to understand how the whole workflow operates.
3. Start with [START_HERE.md](START_HERE.md).
4. Read [docs/patterns-to-follow.md](docs/patterns-to-follow.md) and [docs/anti-patterns.md](docs/anti-patterns.md).
5. Fill [templates/project-brief.md](templates/project-brief.md).
6. Give [prompts/start-prompt.md](prompts/start-prompt.md) to Codex when starting a new project.
7. Copy the relevant agent prompt from [agents/](agents/) when delegating focused work.
8. Copy skill folders from [skills/](skills/) into your Codex skills location when you want reusable behavior.

## Folder Map

- [docs/](docs/) contains reusable engineering standards and workflow guides.
- [commands/](commands/) contains slash-command specs for feature-wise planning and implementation.
- [agents/](agents/) contains role-specific agent prompts.
- [prompts/](prompts/) contains kickoff and task prompts.
- [skills/](skills/) contains Codex `SKILL.md` folders.
- [templates/](templates/) contains fill-in project documents and checklists.

Deep-dive docs that are easy to miss:

- [docs/flow-policy.md](docs/flow-policy.md)
- [docs/feature-command-flow.md](docs/feature-command-flow.md)
- [docs/deep-codebase-audit.md](docs/deep-codebase-audit.md)
- [docs/mobile-app-patterns.md](docs/mobile-app-patterns.md)
- [docs/mobile-backend-pattern-analysis.md](docs/mobile-backend-pattern-analysis.md)
- [docs/background-jobs-bullmq.md](docs/background-jobs-bullmq.md)
- [docs/database-sql-patterns.md](docs/database-sql-patterns.md)
- [docs/observability-patterns.md](docs/observability-patterns.md)
- [docs/external-integration-patterns.md](docs/external-integration-patterns.md)
- [docs/testing-contract-patterns.md](docs/testing-contract-patterns.md)

## Non-Negotiables

- Docker services come up before app code is considered runnable.
- The first project prompt must decide backend, frontend, and whether frontend is web, mobile, or both.
- Feature work should start with `/classify` when scope is unclear.
- Normal and risky feature implementation must be command-gated: `/plan`, `/approve`, `/implement`, `/verify`, `/api-integrate`, `/test`, `/review`, `/finalize`.
- Classified tiny changes may use the shorter `/implement` then `/verify` lane.
- Completed normal and risky features should update compact project context with `/context-update`.
- `/plan` and `/approve` must not change application code.
- `/implement` must ask which approved file to implement when no file is provided.
- `/api-integrate` happens after verification and owns SDK/client API wiring.
- `/status`, `/select`, and `/block` help manage multi-feature work without changing application code.
- Context docs help future agents find the right files and decisions before scanning the whole codebase.
- Database migrations are the source of truth for schema changes.
- Backend API changes must update OpenAPI and regenerate the frontend SDK.
- Frontend calls backend through the generated SDK wrapper, not hand-written endpoint strings.
- Every feature ends with a verification note: commands run, checks passed, and gaps.
- New code should follow [backend patterns](docs/backend-patterns.md), [frontend patterns](docs/frontend-patterns.md), [mobile patterns](docs/mobile-app-patterns.md) when relevant, and avoid the listed [anti-patterns](docs/anti-patterns.md).

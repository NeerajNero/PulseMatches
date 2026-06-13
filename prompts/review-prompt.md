# Review Prompt

Use this when asking for a review.

```text
Review this change as a senior full-stack engineer using the starter-pack standards.

Prioritize:
- Migration correctness and data safety.
- Docker/local setup breakage.
- Backend validation, auth, permissions, and response contracts.
- Backend layering: controller -> service -> DB service -> repository.
- Per-module Swagger, DTO constants, response envelopes, and transform usage.
- OpenAPI/SDK drift.
- Frontend use of generated types and React Query behavior.
- Frontend layering: page/component -> hook -> SDK wrapper -> generated SDK.
- Mobile layering: Expo screen -> hook/service -> SDK wrapper -> generated SDK.
- Mobile native config: app.config.js, eas.json, Metro, permissions, plugins, and device verification.
- Reusable component usage under components/ui and components/custom.
- BullMQ queue correctness: typed payloads, retries, event logging, DLQ, and Bull Board.
- SQL migration correctness: functions, triggers, materialized views, indexes, and seed idempotency.
- Observability: health, metrics, logs, queue visibility, and runbook impact.
- External integrations: provider isolation, webhook validation, retries, fallback, cleanup.
- Missing verification or test gaps.

Return findings first, ordered by severity, with file and line references. Keep summaries brief.
```

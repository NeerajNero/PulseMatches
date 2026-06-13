# Feature Prompt

Use this only after a feature has an approved plan. For the normal gated flow, prefer the slash commands in [../commands](../commands).

```text
Implement this approved feature using the starter-pack workflow:

Approved plan or approval file:
<path>

Constraints:
- If no approved plan or approval file is provided, ask which file to implement.
- Do not implement unapproved plans.
- Docker-first assumptions must remain intact.
- Database changes must be migration-first.
- Backend must expose typed DTOs and Swagger/OpenAPI.
- Frontend target must be respected: web, mobile, or both.
- Frontend must consume the generated SDK, not hand-written endpoint strings.
- Mobile features must update app config, EAS config, permissions, providers, and device verification notes when native behavior changes.
- Background jobs must use the BullMQ queue module pattern with DLQ when failure matters.
- SQL-heavy migrations must document triggers/functions/views and refresh/index behavior.
- External integrations must isolate provider logic and document webhook/retry/cleanup behavior.
- Keep changes scoped to the feature.

Process:
1. Read the approved plan or approval file.
2. Inspect existing project structure and conventions.
3. Confirm whether the feature touches backend, web frontend, mobile frontend, or both frontends.
4. Identify schema changes and create/apply migration.
5. Implement backend repository, service, transform, DTOs, controller, and Swagger docs.
6. Prepare backend contract changes for `/api-integrate`.
7. Implement web UI/mobile screens/providers in the approved scope without final API wiring when that belongs to `/api-integrate`.
8. Add queue, SQL, observability, mobile native config, or integration docs when those surfaces change.
9. Create or update docs/features/reports/<feature>.implementation.md.
10. Report changed files, commands, results, and gaps.
```

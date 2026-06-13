---
name: nestjs-prisma-backend
description: Use when implementing or reviewing NestJS backend features with Prisma, DTO validation, Swagger/OpenAPI, repository layers, auth, logging, queues, and response envelopes.
---

# NestJS Prisma Backend

Use the backend style from the starter pack.

## Feature Shape

```text
src/api/<feature>/
  <feature>.controller.ts
  <feature>.service.ts
  <feature>.module.ts
  <feature>.transform.ts
  dto/
  decorators/
  swagger/

src/db/<feature>/
  <feature>.repository.ts
  <feature>-db.service.ts
```

## Workflow

1. Check whether the feature needs a migration.
2. Add DB repository methods first.
3. Expose repository operations through a feature DB service.
4. Inject the DB service into the API service; do not inject repositories into controllers.
5. Add DTOs for request and response shapes using centralized validation constants when present.
6. Add transform methods to avoid returning raw ORM objects.
7. Add service business logic and error mapping.
8. Add controller routes, guards, and per-module Swagger decorators.
9. Confirm global validation and response envelope behavior.
10. Regenerate OpenAPI/SDK after contract changes.

## Backend Defaults

- `ValidationPipe` with whitelist, forbidden unknown fields, and transform.
- Global exception filter.
- Global transform interceptor.
- Helmet and explicit CORS.
- URI API versioning.
- Swagger outside production.
- Structured logger.
- Health and metrics endpoints.
- Repositories are internal persistence providers; feature DB services are the exported persistence boundary.
- Route names, field descriptions, regexes, roles, auth types, and repeated response strings should be centralized.

## Done

- Route behavior is implemented.
- DTO validation covers inputs.
- Swagger documents changed routes.
- Permissions are explicit.
- Tests or manual API checks are recorded.

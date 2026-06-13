# Backend Agent

## Role

Own NestJS backend work, database access, migrations, API contracts, queues, auth, and observability.

## Operating Rules

- For feature work, require an approved plan or approval file before implementation.
- Check Docker and migration state first.
- Put persistence logic in `src/db/<feature>`.
- Keep the dependency flow as controller -> API service -> feature DB service -> repository -> Prisma.
- Register repositories as providers, but export feature DB services as the public DB boundary.
- Keep controllers thin.
- Validate all inputs with DTOs.
- Use centralized constants for route names, validation descriptions, regexes, and repeated messages.
- Add per-module Swagger decorators for changed routes.
- Map database errors to explicit HTTP exceptions.
- Preserve response envelope conventions.
- Regenerate OpenAPI/SDK after contract changes unless another agent owns SDK generation.
- Use BullMQ queue module, queue facade, processor, events, Bull Board, and DLQ patterns for async work.
- Document handwritten SQL functions, triggers, materialized views, indexes, and seed data.
- Keep health, metrics, logs, and external provider behavior observable.

## Default Task Prompt

```text
Implement the backend side of this feature using the starter-pack backend practices.

Use only the approved feature plan or approval file provided by the user. If no file is provided, ask which approved file to implement.

Include migration planning, Prisma changes, repository/DB service methods, service logic, DTOs, controller routes, Swagger docs, auth/permission decisions, and targeted tests or verification.
```

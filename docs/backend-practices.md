# Backend Practices

## Baseline

Use NestJS with:

- `ConfigModule` plus Joi validation.
- Typed `EnvConfig`.
- Global validation pipe with `whitelist`, `forbidNonWhitelisted`, and `transform`.
- Helmet and explicit CORS.
- URI versioning.
- Swagger in non-production.
- Global exception filter.
- Global response transform.
- Structured logger.
- Health and metrics endpoints.

Deep-dive backend topics:

- [background-jobs-bullmq.md](background-jobs-bullmq.md)
- [database-sql-patterns.md](database-sql-patterns.md)
- [observability-patterns.md](observability-patterns.md)
- [external-integration-patterns.md](external-integration-patterns.md)
- [testing-contract-patterns.md](testing-contract-patterns.md)

## Feature Module Shape

```text
src/api/<feature>/
  <feature>.controller.ts
  <feature>.service.ts
  <feature>.module.ts
  <feature>.transform.ts
  dto/
  decorators/
  swagger/
  enums/

src/db/<feature>/
  <feature>.repository.ts
  <feature>-db.service.ts
```

See [backend-patterns.md](backend-patterns.md) for the detailed repository, DB service, DTO, Swagger, auth, constants, and transform patterns.

## Controller Rules

- Controllers only parse inputs, apply guards/decorators, call services, and return response helpers.
- Controllers should not contain query logic.
- Use DTOs for body, query, and params.
- Use Swagger decorators so OpenAPI stays useful.
- Use route constants where the project already has them.

## Service Rules

- Services enforce business rules.
- Services map known database errors to domain-appropriate HTTP exceptions.
- Services call transform classes before returning DTOs.
- Services log important state changes and exceptional paths.

## Response Shape

Use a consistent API envelope:

```json
{
  "statusCode": 200,
  "status": "Success",
  "message": "Request successful",
  "data": {},
  "error": null
}
```

For errors:

```json
{
  "status_code": 400,
  "status": "Failure",
  "message": "Bad request",
  "error": "Bad Request",
  "data": null
}
```

Keep naming consistent within each project. If an existing project uses `status_code`, preserve it.

## Security Defaults

- Authentication is opt-out, not opt-in, once the project has protected routes.
- Use explicit public route decorators.
- Keep roles and permissions centralized.
- Store auth cookies with secure settings appropriate for the environment.
- Validate all input through DTOs.
- Avoid returning raw ORM objects from controllers.

## Background Work

Use Redis and BullMQ for:

- Email.
- Media processing.
- Audit processing.
- Webhook retries.
- Scheduled syncs.

Each queue should define job names, retry policy, backoff, event handling, and dead-letter behavior where needed.

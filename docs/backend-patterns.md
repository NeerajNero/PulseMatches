# Backend Patterns

These patterns are derived from mature NestJS backend projects and cross-checked with backend recommendations.

## Module Shape

Use one folder per API feature:

```text
src/api/tags/
  tags.controller.ts
  tags.service.ts
  tags.module.ts
  tags.transform.ts
  dtos/
    tag-request.dto.ts
    tag-response.dto.ts
  decorators/
    swagger.decorator.ts
  swagger/
    tags.swagger.ts
  enum/
```

Use one folder per persistence feature:

```text
src/db/tags/
  tags-db.service.ts
  tags.repository.ts
```

## Repository And DB Service Boundary

Pattern:

- Repository injects `DBService` and talks to Prisma.
- Feature DB service injects the repository and exposes persistence operations to API services.
- API services inject feature DB services, not repositories.
- `DBModule` can register repositories as providers, but should export DB services as the public API.

Example dependency flow:

```text
TagsController
  -> TagsService
    -> TagsDbService
      -> TagsRepository
        -> DBService / PrismaClient
```

Follow this because it keeps raw query construction out of business services and makes repository internals replaceable.

## Controller Pattern

Controllers should:

- Declare route prefix with `RouteNames`.
- Apply auth with `@Secure`.
- Apply one Swagger decorator per endpoint.
- Parse body, query, and params with DTOs and pipes.
- Call one service method.
- Return `ResponseUtil.success(data, message, statusCode)`.

Controllers should not:

- Build Prisma queries.
- Map database rows.
- Contain business branching beyond request orchestration.
- Inline large Swagger blocks.

## Service Pattern

Services should:

- Enforce business rules.
- Normalize input before persistence when it is business-level normalization.
- Call DB services.
- Call transform classes before returning data.
- Catch known Prisma errors and map them to clear NestJS exceptions.
- Log important state changes and exceptional paths.

Services should not:

- Return raw Prisma rows when the response shape is not identical.
- Know low-level SQL details.
- Swallow errors without preserving enough context.

## Repository Pattern

Repositories should:

- Own Prisma `where`, `select`, `include`, `orderBy`, and transaction construction.
- Use reusable select clauses for stable response fields.
- Keep raw SQL typed when raw SQL is required.
- Return persistence-shaped data to DB services.

Repositories should not:

- Be injected into controllers.
- Be exported as the normal public dependency of `DBModule`.
- Contain HTTP exceptions or controller response helpers.

## Transform Pattern

Use `<Feature>Transform` when database shape differs from API shape.

Good use cases:

- Strip sensitive fields.
- Flatten nested relations.
- Shape list/detail/summary responses differently.
- Add pagination metadata.
- Preserve response field naming consistently.

Register transform classes in the feature module providers.

## DTO Pattern

Request DTOs:

- Use `class-validator`.
- Use `class-transformer` for query coercion.
- Use `@ApiProperty` and `@ApiPropertyOptional`.
- Pull descriptions and examples from `FIELD_DESCRIPTIONS`.
- Pull regexes from `REGEX_PATTERNS`.

Response DTOs:

- Use classes, not only TypeScript interfaces.
- Decorate fields with Swagger metadata.
- Add API envelope classes, for example `TagApiResponse extends ApiResponse<TagDto>`.
- Use generated response DTOs as the SDK source of truth.

## Swagger Pattern

Use a per-module Swagger object:

```text
src/api/tags/swagger/tags.swagger.ts
src/api/tags/decorators/swagger.decorator.ts
```

Pattern:

- `TagsSwagger` owns `ApiTags`, `ApiBearerAuth`, operation summaries, descriptions, and response schemas.
- `TagsSwaggerDecorator(endpoint)` applies the endpoint operation and responses.
- Controllers call `@TagsSwaggerDecorator("findAll")`.

This keeps controllers readable and makes API docs reviewable in one place.

## Response Envelope Pattern

Use a shared envelope:

```json
{
  "status_code": 200,
  "status": "Success",
  "message": "Request successful",
  "data": {},
  "error": null
}
```

Pattern:

- `ApiResponse<T>` is a Swagger-decorated class.
- `ResponseUtil.success()` creates success responses.
- `ResponseUtil.error()` creates failure responses where explicit failure construction is needed.
- `HttpExceptionFilter` normalizes thrown exceptions into the same general shape.

Pick either `status_code` or `statusCode` per project. Preserve the existing project convention.

## Constants Pattern

Centralize these:

- `RouteNames` for backend route segments.
- `APP_STRINGS` for repeated success and error messages when the project has many modules.
- `FIELD_DESCRIPTIONS` for Swagger field descriptions and examples.
- `REGEX_PATTERNS` for shared DTO regex validation.
- `RoleType`, `AuthType`, `TokenPurposeEnum`, and other cross-module enums.
- Pagination helper defaults and utility functions.

Do not scatter route strings, regexes, repeated Swagger examples, or role strings through controllers and DTOs.

## Auth Pattern

Recommended primitives:

- `CookieService` owns cookie names, options, lifetimes, and deletion.
- Access, refresh, and temp tokens use separate secrets and expiries when multi-step auth flows exist.
- `CustomJwtService` owns token signing and verification primitives.
- `TokenFactoryService` turns JWT primitives into auth-flow operations.
- `@Secure([AuthType], [RoleType])` declares endpoint auth.
- `AuthenticationGuard` dispatches to JWT, refresh, temp, or none guards.
- `TokenPurposeGuard` protects temp-token flows.
- Cookie middleware can inject `Authorization: Bearer <sid>` from auth cookies.

For projects without OTP or multi-step auth, skip temp-token machinery until there is a real consumer.

## Module Export Pattern

API feature modules should export their service only when another module has a real need for it:

```ts
@Module({
  imports: [DBModule],
  controllers: [TagsController],
  providers: [TagsService, TagsTransform],
  exports: [TagsService],
})
export class TagsModule {}
```

DB modules should export DB services as the main public surface:

```text
exports: [DBService, TagsDbService, UsersDbService]
```

Avoid exporting repositories directly. If a repository must be exported, document why it bypasses the normal boundary.

## Background Job Pattern

Use queues for work that is slow, retryable, or external-service dependent:

- Email.
- Media processing.
- Webhooks.
- Audit logging.
- Scheduled syncs.
- Push notification fan-out.
- PDF/report generation.

Define job constants, queue service, processor, events, retry/backoff, and dead-letter handling when failure matters.

## Mobile Push Notification Pattern

For mobile projects, model push notifications explicitly:

- Store device tokens in user-device tables.
- Use a unique constraint on `(expo_push_token, user_id)` or the project equivalent.
- Register or update tokens during login/signup/profile update.
- Delete the current device token on logout.
- Keep notification content category-based so mobile apps can map categories to routes.
- Send push notifications through a `NotificationProvider` abstraction, not direct Expo/Twilio/Firebase calls in services.
- Fan out notifications through a queue with retry, provider rate limits, and worker event logs.
- Persist notification rows and status when the product needs list/unread state or auditability.

## Provider Factory Pattern

Use provider abstractions for replaceable external services:

- `EmailProvider` for SendGrid or another email service.
- `SmsProvider` for Twilio or another SMS service.
- `NotificationProvider` for Expo/Firebase/APNs adapters.
- `StorageProvider` for AWS S3, MinIO, Bunny, GCS, or Azure Blob.

Services should depend on the abstraction. Modules can choose the implementation with config:

```text
MediaUploadService -> StorageProvider
StorageProvider -> AwsProvider or MinioProvider selected by env
```

Do not scatter vendor SDK usage through feature services.

## Template And PDF Pattern

For generated reports, invoices, exports, treatment plans, certificates, or other heavy documents:

- Keep Handlebars or template views under a template module.
- Convert domain data to template DTOs before rendering.
- Render HTML in `TemplateService`.
- Generate PDF in a dedicated `PdfService`.
- Run heavy generation in a BullMQ queue.
- Upload the generated file through `MediaUploadService` or another storage abstraction.
- Notify the user by email, push notification, or both.

Prefer buffer/stream handling where practical. If temporary files are needed, clean them up and document why.

## AI And Vector Search Pattern

When a project needs AI retrieval:

- Keep AI orchestration in a separate module or service boundary.
- Keep Python/model-serving services outside normal Nest feature services when the runtime differs.
- Use migrations for extensions such as `vector`.
- Store embeddings with source content and JSONB metadata.
- Add HNSW or other vector indexes based on the query pattern.
- Document embedding dimension and model choice in the migration or architecture docs.

## Environment Pattern

Use both:

- Runtime env loader and Joi validation module.
- Typed `EnvConfig` class.

Every required variable must exist in `.env.example`.

Startup should fail quickly when required env is missing or malformed.

# External Integration Patterns

These patterns apply to provider integrations such as storage, email, Slack-style alerts, webhooks, push notifications, SMS, chat/calls, subscriptions, and Sentry. They generalize to most external providers.

## Provider Abstraction Pattern

Use an interface for provider operations:

```text
interface StorageProvider {
  uploadFile(...)
  deleteFiles(...)
  getMediaFiles(...)
}
```

Then inject a concrete provider using a token such as `"StorageProvider"`.

Rules:

- App services depend on the interface.
- Provider classes own provider-specific URLs, headers, auth, batching, and retry behavior.
- Provider config comes from validated env.
- Provider errors are normalized before leaving the provider layer.

Good provider abstractions:

- `StorageProvider` for S3, MinIO, Bunny, GCS, or Azure Blob.
- `EmailProvider` for SendGrid or SES.
- `SmsProvider` for Twilio or SNS.
- `NotificationProvider` for Expo, FCM, or APNs.

## Media Upload Pattern

Flow:

```text
Controller -> MediaService -> StorageProvider -> External Storage
                          -> MediaUploadDbService -> media_metadata
```

Rules:

- Validate file presence, MIME type, and size before upload.
- Sanitize file names.
- Add timestamp or unique suffix to stored names.
- Store metadata in database after upload succeeds.
- Keep cleanup job for orphaned storage/database records.
- Delete in batches to avoid overwhelming provider APIs.
- Retry deletes with backoff.

## Webhook Pattern

Webhook module shape:

```text
webhook.controller.ts
webhook.service.ts
webhook-config.service.ts
webhook-processor.service.ts
dtos/
types/
```

Pattern:

- Controller owns HTTP endpoints, health/config/status helpers, and payload normalization.
- Config service owns provider webhook URL and validation.
- Webhook service measures processing time and returns a normalized result.
- Processor service performs domain updates and real-time notifications.
- Request id is generated and included in logs and responses.
- Webhook failures are logged and should have a fallback path, often cron-based reconciliation.

## Webhook Endpoint Rules

- Keep webhook routes public only when provider authentication is handled another way.
- Validate signatures or shared secrets when the provider supports it.
- Accept provider payload variations only in one normalization method.
- Never log provider secrets.
- Return quickly when provider retries are sensitive to timeout.
- Store enough state to reconcile missed webhooks.

## External Status Mapping Pattern

Map provider statuses to internal statuses in one place.

Pattern:

```text
provider status code -> provider description -> internal status -> user-facing progress
```

Do not spread numeric status-code meaning throughout services and components.

## Mobile SDK Provider Pattern

Mobile SDKs should be isolated behind app providers or services:

- CometChat provider owns init, login/logout, listeners, incoming calls, active calls, and cleanup.
- RevenueCat provider owns configure, entitlement reads, paywall presentation, restore purchases, and user attributes.
- Sentry setup owns environment, DSN, native frame tracking, navigation instrumentation, and error boundaries.
- Notification provider owns permission, token registration, listeners, unread counts, and route mapping.

Do not initialize native SDKs independently in many screens.

## Circuit Breaker And Retry Pattern

Use retries and circuit breakers where provider failures are expected:

- Log shipping.
- Media delete batches.
- Search provider orchestration.
- Webhook processing fallback.
- Queue jobs for email and media.

Rules:

- Retry only idempotent operations or operations with idempotency keys.
- Use exponential backoff.
- Preserve final failures through DLQ or alerting.
- Avoid infinite retries.

## Cleanup Pattern

External storage cleanup should be two-sided:

- Find orphaned metadata in database.
- Delete corresponding provider files in batches.
- Delete metadata after provider deletion succeeds.
- Skip destructive cleanup in development unless explicitly requested.

## Anti-Patterns

- Calling external providers directly from controllers.
- Duplicating provider config in many services.
- Logging raw provider API keys or signed URLs.
- Treating webhook success as the only source of truth without reconciliation.
- Deleting external files one by one without batching.
- Updating database metadata before confirming provider upload success.
- Adding provider status-code mappings inline in multiple services.
- Initializing mobile provider SDKs from individual screens instead of app-level providers.

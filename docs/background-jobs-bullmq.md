# Background Jobs And BullMQ

A mature backend should have a real background subsystem under `apps/backend/src/background`. This is worth preserving as a starter-pack pattern.

## Folder Shape

```text
src/background/
  background.module.ts
  background-service-manager.ts
  constants/job.constant.ts
  interfaces/job.interface.ts
  cron/
    cron.module.ts
    cron.scheduler.ts
    cron.queue.ts
    cron.processor.ts
    cron.service.ts
    cron.events.ts
  queue/
    email/
    media-upload/
    audit/
    video-pagination/
    dead-letter/
```

Each queue normally has:

```text
<feature>-queue.module.ts
<feature>.queue.ts
<feature>.processor.ts
<feature>-queue.service.ts
<feature>-queue.events.ts
```

## Queue Constants Pattern

Centralize queue names, job names, cron names, and default options:

```text
src/background/constants/job.constant.ts
```

Pattern:

- `QueueName` enum for BullMQ queue names.
- `JobName` enum for normal jobs.
- `CronJobName` enum for scheduled jobs.
- `DEFAULT_JOB_OPTIONS` for attempts, exponential backoff, retention, and fail retention.
- `QUEUE_LIST` for automatic registration in `BackgroundModule`.

Do not scatter queue or job names as string literals.

## Background Module Pattern

`BackgroundModule` should:

- Register all queues from `QUEUE_LIST`.
- Import each queue module.
- Import `CronModule`.
- Import `DeadLetterQueueModule`.
- Configure Bull Board under a route such as `RouteNames.QUEUES_UI`.
- Export `BackgroundServiceManager` when app services need a single job-dispatch facade.

## Queue Module Pattern

Each queue module should expose two static config helpers:

- `getQueueConfig()` for `BullModule.registerQueue`.
- `getQueueUIConfig()` for Bull Board.

Default options should be explicit:

- Attempts.
- Backoff.
- `removeOnComplete`.
- `removeOnFail`.
- Event stream max length.
- Bull Board display name and read-only production mode.

## Queue Facade Pattern

Use a queue facade for job producers:

```text
EmailQueue.addOTPEmailJob(data)
MediaUploadQueue.uploadMedia(data)
CronQueue.addAnalyticsSyncJob(...)
```

App services should not call `queue.add(...)` with raw string names everywhere. The queue facade should know the job name and job payload type.

## Background Service Manager Pattern

Use `BackgroundServiceManager` when many app modules need a single facade for multiple queues.

Pattern:

- Inject queues by `@InjectQueue(QueueName.X)`.
- Expose descriptive methods such as `addAccountCreationEmailJob`.
- Call a generic `addJob(queue, jobName, data, options)` internally.
- Merge `DEFAULT_JOB_OPTIONS` with per-job options.
- Log job submission without exposing secrets.

## Processor Pattern

Processors should:

- Extend `WorkerHost`.
- Use `@Processor(QueueName.X, options)`.
- Set `concurrency`, `drainDelay`, `stalledInterval`, limiter, completion retention, and fail retention.
- Switch on typed `JobName`.
- Delegate actual business work to a queue service.
- Throw on unknown job names.
- Implement worker event handlers for active, progress, completed, failed, stalled, and error.

Keep heavy business logic out of the processor when possible. The processor dispatches; the queue service does work.

## Queue Service Pattern

Queue services should:

- Inject domain services.
- Execute the job behavior.
- Catch, log, and rethrow failures so BullMQ retry and DLQ behavior can work.
- Avoid returning huge payloads.

Examples:

- Email queue service sends templated emails.
- Media upload queue service handles storage and cart processing.
- Cron service performs scheduled cleanup, analytics sync, and webhook fallback work.
- Notification queue service reads notification rows, resolves user devices, validates payload content, sends through the push provider, and updates status.
- PDF queue service renders templates, generates PDFs, uploads files, and emits email/push notification jobs.

## Dead Letter Queue Pattern

Use a DLQ for jobs that exhaust retries.

Pattern:

- `DeadLetterQueueService.addFailedJobToDLQ(data)`.
- Failed processors call DLQ only after `attemptsMade >= maxAttempts`.
- DLQ payload includes original queue name, job id, job name, job data, attempts, failed reason, stacktrace, and timestamp.
- `DeadLetterProcessor` notifies Slack or another alerting channel.
- Bull Board links are included where possible.

Do not silently drop failed jobs after retries.

## Cron Pattern

Use two layers:

- `CronScheduler` owns `@Cron(...)` schedules.
- `CronQueue` enqueues scheduled work.
- `CronProcessor` runs jobs.
- `CronService` contains the actual scheduled behavior.

This keeps scheduling separate from execution and gives scheduled tasks retry/visibility through BullMQ.

## Mobile Push Queue Pattern

Use a queue for mobile push fan-out:

- Notification rows store category, status, recipient references, and JSON content.
- Queue payloads carry IDs, not full notification/device objects.
- Queue service reloads the notification with device relations.
- Provider validates Expo push tokens and chunks messages.
- Processor uses low concurrency and provider rate limits.
- Failures rethrow so BullMQ retry and DLQ behavior can work.

Do not send provider push requests inline from controllers.

## PDF/Report Queue Pattern

Generated reports should be queued when they use templates, browser rendering, external storage, or email/push follow-up.

Pattern:

```text
GeneratePdfQueue -> GeneratePdfProcessor -> GeneratePdfService
  -> TemplateService
  -> PdfService
  -> MediaUploadService
  -> EmailQueue/NotificationDbService
```

Queue payloads should identify the report type, input DTO, and notification/email metadata. Keep raw files out of Redis.

## Bull Board Pattern

Expose Bull Board for local and non-production operations.

Rules:

- Put the route in `RouteNames`.
- Use read-only mode in production.
- Give each queue a human-readable display name and description.
- Do not expose queue UI publicly without auth or network restrictions.

## Job Design Rules

- Job payloads should be serializable and typed.
- Prefer IDs and metadata over huge objects or raw files.
- Add idempotency where duplicate execution can cause harm.
- Use explicit attempts and backoff per queue or job.
- Add rate limiters for external APIs.
- Add batch sizes and delays for provider-heavy jobs.
- Log job ids, queue names, and safe identifiers.
- Do not log OTPs, tokens, secrets, raw cookies, or large file buffers.

## Anti-Patterns

- Calling `queue.add("some-string", data)` from random services.
- Adding a processor without event handlers.
- Retrying non-idempotent jobs without idempotency protection.
- Keeping failed jobs only in logs.
- Putting all queues in one processor.
- Running cron work directly in `@Cron` methods instead of enqueueing it.
- Passing raw uploaded file buffers through Redis unless the payload is small and intentional.

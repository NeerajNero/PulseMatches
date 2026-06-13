---
name: external-integration-patterns
description: Use when adding or reviewing external provider integrations such as storage providers, email, Slack notifications, webhooks, third-party APIs, retries, cleanup, or provider status mapping.
---

# External Integration Patterns

Use this workflow for third-party services.

## Workflow

1. Define provider interface before concrete provider details leak into app services.
2. Add env variables and validation.
3. Add provider implementation with timeouts, retries, safe logging, and normalized errors.
4. Add webhook config and status endpoints if the provider uses callbacks.
5. Normalize provider payloads and statuses in one place.
6. Add queue or cron fallback for retry/reconciliation.
7. Add cleanup jobs for external resources if the app creates files or remote objects.
8. Verify success, provider failure, and retry/fallback behavior.

## Rules

- Controllers do not call external providers directly.
- App services depend on interfaces or focused provider services.
- Do not log secrets, signed URLs, or full sensitive payloads.
- Webhook processing should be idempotent where possible.
- Provider status maps should be centralized.

## Done

- Config is validated.
- Provider calls are isolated.
- Webhook and cleanup paths are documented.
- Failure handling is explicit.

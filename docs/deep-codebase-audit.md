# Deep Codebase Audit

This file summarizes the deeper pass over mature backend and web patterns and what was added to the starter pack afterward.

## What Was Missing From The First Pass

The first starter-pack pass captured the main stack and module boundaries, but missed several mature operating patterns:

- BullMQ queue architecture.
- Dead-letter queue and Slack alert pattern.
- Cron scheduling through queues.
- Bull Board queue UI conventions.
- Redis provider and health indicator.
- Prometheus metrics middleware and custom metrics.
- Winston rotating-file logger and optional Loki push.
- Promtail log scraping.
- SQL functions, triggers, and materialized-view patterns.
- Full-text and trigram search in migrations.
- Idempotent seed-data conventions.
- Webhook configuration, validation, normalization, processing, and fallback.
- Storage provider abstraction and media cleanup.
- Dredd contract testing.
- Storybook and Playwright conventions.

## New Docs Added

- [background-jobs-bullmq.md](background-jobs-bullmq.md)
- [database-sql-patterns.md](database-sql-patterns.md)
- [observability-patterns.md](observability-patterns.md)
- [external-integration-patterns.md](external-integration-patterns.md)
- [testing-contract-patterns.md](testing-contract-patterns.md)

## New Skills Added

- [bullmq-background-jobs](../skills/bullmq-background-jobs/SKILL.md)
- [sql-migration-patterns](../skills/sql-migration-patterns/SKILL.md)
- [observability-patterns](../skills/observability-patterns/SKILL.md)
- [external-integration-patterns](../skills/external-integration-patterns/SKILL.md)

## BullMQ Findings

The audited backend has a structured background module:

```text
background.module.ts
background-service-manager.ts
constants/job.constant.ts
interfaces/job.interface.ts
cron/
queue/email
queue/media-upload
queue/audit
queue/video-pagination
queue/dead-letter
```

Key patterns:

- Queue names and job names are enums.
- Queue modules expose queue config and Bull Board config.
- Queue facades add jobs.
- Processors dispatch by job name.
- Queue services do the actual work.
- Events log queue lifecycle changes.
- Failed jobs are pushed to a dead-letter queue after retries are exhausted.
- DLQ processor sends Slack alerts and can link to Bull Board.
- Cron scheduler enqueues jobs; heavy scheduled work runs in processors/services.

## SQL Migration Findings

The audited backend uses Prisma migrations plus handwritten SQL for database-owned behavior.

Observed SQL patterns:

- `uuid-ossp` and `pg_trgm` extensions.
- Dynamic `updated_at` triggers for tables with an `updated_at` column.
- Audit-log delete prevention.
- Media relationship validation based on MIME/media type.
- Orphan media metadata cleanup.
- Slug generation triggers for videos, packages, and albums.
- Notification fan-out triggers on video status changes.
- Analytics summary SQL function.
- User derived-field propagation from video changes.
- Materialized views for video, album, and tag search.
- Full-text search vectors and trigram indexes.
- Concurrent materialized-view refresh with fallback.
- Idempotent seed data with roles, modules, permissions, and reserved tags.

These behaviors are not visible from Prisma schema alone, so future projects need explicit docs whenever similar SQL is introduced.

## Observability Findings

Observed operational patterns:

- Terminus health endpoint.
- Custom Redis health indicator.
- Metrics middleware for request count and duration.
- Custom Prometheus counters/gauges.
- Prometheus scrape config.
- Winston console and daily rotating file logs.
- Optional Loki push protected by circuit breaker behavior.
- Promtail scraping backend log files.
- Grafana in Docker compose.
- Bull Board for queue visibility.

Starter-pack docs now treat health, metrics, logs, queues, and dashboards as a backend baseline rather than optional extras.

## External Integration Findings

The project has provider-oriented integration patterns:

- `StorageProvider` interface.
- Bunny storage provider implementation.
- Media service validates upload inputs and delegates to provider.
- Storage cleanup deletes external files in batches and then removes metadata.
- Webhook controller exposes health/config/status helpers.
- Webhook config service validates provider configuration.
- Webhook service measures processing time and returns normalized status.
- Webhook processor normalizes provider statuses, updates domain state, and has cron fallback for missed/failed webhook work.

Future projects should avoid provider calls directly in controllers and should document retry, cleanup, and fallback behavior.

## Testing Findings

The audited project includes:

- Dredd config for OpenAPI contract testing.
- Dredd hook for small response/header adjustment.
- Playwright config with multiple browser projects, CI retries, and traces.
- Storybook config for Next.js components, docs, interactions, and coverage.

The starter pack now includes [testing-contract-patterns.md](testing-contract-patterns.md).

## Still Worth Documenting Later

The audited projects have additional product-specific areas that may deserve docs only if future projects need them:

- Socket.IO gateway and real-time notification patterns.
- Analytics sync internals.
- Search provider orchestration and circuit-breaker behavior.
- Media/video upload lifecycle.
- Cart/download ZIP generation.
- Fine-grained permission model and role-permission seed expansion.

These were not added as full docs because they are more product-specific than starter-pack baseline. They should become docs when a new project needs that behavior.

---
name: bullmq-background-jobs
description: Use when adding, reviewing, or fixing NestJS BullMQ queues, processors, cron jobs, Bull Board wiring, dead-letter queues, retries, and background job observability.
---

# BullMQ Background Jobs

Use this workflow for background work.

## Workflow

1. Decide whether the work should be async, scheduled, retryable, or provider-isolated.
2. Add queue and job names to central constants.
3. Add typed job payload interfaces.
4. Create queue module, queue facade, processor, queue service, and queue events.
5. Configure attempts, backoff, limiter, concurrency, retention, and Bull Board.
6. Add DLQ handling for exhausted retries.
7. Add logs and safe identifiers.
8. Verify enqueue, success, failure, and retry behavior.

## Rules

- Producers call queue facade methods, not raw `queue.add` with string names.
- Processors dispatch and queue services do the business work.
- Cron methods enqueue jobs instead of doing heavy work directly.
- Failed jobs that exhaust retries go to DLQ.
- Job payloads must be serializable and typed.
- Do not log secrets, OTPs, tokens, raw cookies, or huge buffers.

## Done

- Job constants exist.
- Payload types exist.
- Queue is visible in Bull Board.
- Processor handles known job names and rejects unknown names.
- Failure path is documented and tested or manually verified.

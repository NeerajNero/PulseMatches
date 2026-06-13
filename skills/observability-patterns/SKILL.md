---
name: observability-patterns
description: Use when adding or reviewing health checks, metrics, request instrumentation, logging, Prometheus, Grafana, Loki, Promtail, Bull Board, or operational dashboards.
---

# Observability Patterns

Use this workflow for operational visibility.

## Workflow

1. Identify what needs to be observed: HTTP, DB, Redis, queues, provider calls, or storage.
2. Add health checks for critical dependencies.
3. Add metrics for count, latency, failures, and queue state.
4. Add structured logs with safe context.
5. Wire Prometheus, Grafana, Loki, Promtail, or Bull Board as needed.
6. Verify endpoints and dashboards locally.
7. Document runbook links and reset/debug commands.

## Rules

- `/metrics` should be Prometheus-compatible when Prometheus scrapes it.
- Health checks should be fast and reflect critical dependencies.
- Do not log secrets or raw auth material.
- Use rotating file logs if Promtail scrapes log files.
- Protect queue UI and dashboards.

## Done

- Health endpoint responds.
- Metrics endpoint is scrapeable.
- Logs are written and discoverable.
- Queue failures are visible.
- Docs explain where to look during incidents.

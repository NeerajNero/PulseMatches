# Observability

## Baseline

Every backend should have:

- `/health` endpoint.
- Metrics endpoint.
- Structured logs.
- Request logging.
- Error logging with stack traces on server side.
- Correlation or trace context where practical.

## Local Stack

Recommended local stack:

- Prometheus.
- Grafana.
- Loki.
- Promtail.
- Node exporter.

This is a good default for projects where backend behavior needs inspection.

## Logging Rules

- Log state changes, queue failures, external service failures, and unexpected exceptions.
- Do not log secrets, access tokens, refresh tokens, raw passwords, or full cookies.
- Use contextual logger names.
- In production, reduce log level and retention appropriately.

## Metrics Rules

- Keep health endpoints unwrapped by response transforms if monitoring expects raw output.
- Track request count, request duration, queue depth, failed jobs, external provider failures, and cache health.
- Add dashboard notes to docs when a project depends on observability to debug local or staging issues.

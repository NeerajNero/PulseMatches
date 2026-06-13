# Observability Patterns

The observability baseline includes health checks, Prometheus metrics, Winston rotating logs, optional Loki integration, Promtail, Grafana, queue UI, and mobile Sentry instrumentation.

## Local Observability Stack

Docker services:

- Prometheus.
- Grafana.
- Loki.
- Promtail.
- Node exporter.

Backend files:

- `src/api/health`
- `src/api/metrics`
- `src/middlewares/metrics.middleware.ts`
- `src/logger/logger.service.ts`
- `prometheus.yml`
- `promtail-config.yml`
- `loki-config.dev.yml`
- `loki-config.prod.yml`

## Health Pattern

Use Terminus for health checks:

- HTTP ping check for an external baseline.
- Redis health indicator.
- Optional disk check.
- Optional memory check.

Rules:

- Health endpoints should be public.
- Health and metrics endpoints may bypass response transforms if monitoring expects raw formats.
- Add database health when the service cannot operate without the database.
- Keep health checks fast.

## Redis Health Pattern

Use a custom Redis health indicator when Redis is created through an app provider.

Pattern:

- Inject shared `Redis` client.
- Call `ping()`.
- Return `getStatus(key, true)` on success.
- Throw `HealthCheckError` on failure.

## Metrics Pattern

Use two levels:

- Middleware for automatic HTTP request count and duration.
- Service/controller for custom application metrics.

HTTP middleware labels:

- Method.
- Route.
- Status.

Useful metrics:

- `http_requests_total`
- `http_request_duration_seconds`
- Queue failed jobs.
- Queue retry exhaustion.
- External provider failure count.
- Upload duration.
- Cache hit/miss rates.
- Active users or active sessions.

## Prometheus Pattern

Prometheus should scrape:

- Backend `/metrics`.
- Node exporter.
- Optional queue or Redis exporters if added.

Rules:

- Avoid hard-coded private IPs in reusable templates.
- Prefer Docker service names for local compose.
- Keep scrape interval reasonable for local development.

## Logger Pattern

The source logger uses:

- Winston.
- Console transport.
- Daily rotate file transport.
- Environment-specific log level.
- Optional Loki push through a queue and circuit breaker.
- Graceful SIGTERM flush.

Rules:

- Use structured context labels.
- Rotate files and set retention.
- Do not log secrets.
- Do not push to Loki unless enabled by env.
- Use circuit breakers for log shipping to avoid cascading failures.

## Promtail And Loki Pattern

Promtail scrapes backend log files:

```text
logs/*.log -> Promtail -> Loki -> Grafana
```

Rules:

- Mount the log directory into Promtail.
- Keep positions file outside app logs.
- Use service names in compose.
- Do not rely only on direct app-to-Loki push; file scraping is often simpler locally.

## Queue Observability Pattern

Use Bull Board for queue visibility:

- Queue status.
- Job details.
- Retry state.
- Failure reasons.
- DLQ inspection.

Rules:

- Read-only mode in production.
- Protect the UI with auth or network controls.
- Link DLQ Slack alerts back to Bull Board when possible.

## Mobile Observability Pattern

For Expo/mobile apps:

- Initialize Sentry once in the root layout.
- Read DSN and environment from Expo config.
- Enable native frame tracking outside Expo Go/dev-only contexts.
- Register navigation instrumentation with the router/navigation container.
- Wrap the root app with Sentry and an error boundary.
- Keep a branded fallback UI for crashes.
- Track crash-free sessions and slow startup/screen transitions for production apps.

Do not log access tokens, refresh tokens, push tokens, payment receipt data, or private chat payloads.

## Observability Anti-Patterns

- Adding queues without failure metrics or DLQ visibility.
- Logging only in processors but not in queue events.
- Returning wrapped JSON from `/metrics` when Prometheus expects plain text.
- Letting monitoring config hard-code one developer's IP.
- Logging JWTs, cookies, API keys, OTPs, passwords, or full webhook payloads with secrets.
- Making health checks slow or dependent on non-critical third parties.
- Initializing Sentry or mobile analytics in multiple screens.

# Docker First

Docker is the first runnable dependency for a project.

## Required Local Services

Start with:

- Postgres for primary persistence.
- Redis for cache, sessions, queue workers, rate limiting, and background jobs.

Add when useful:

- Prometheus for metrics.
- Grafana for dashboards.
- Loki and Promtail for local log aggregation.
- Mailhog or similar for email-heavy projects.
- MinIO or localstack for storage-heavy projects.

## Compose Rules

- Keep service names stable: `postgres`, `redis`, `prometheus`, `grafana`, `loki`, `promtail`.
- Read ports and credentials from `.env`.
- Use named volumes or explicit `data/` mounts.
- Add restart policies for stateful local services.
- Put every service on a shared bridge network.
- Never require a developer to install Postgres or Redis directly on the host.

## Local Startup Order

1. Copy `.env.example` to `.env`.
2. Run Docker services.
3. Wait for Postgres and Redis to accept connections.
4. Apply migrations.
5. Generate ORM client.
6. Start backend.
7. Generate SDK.
8. Start frontend.

## Useful Scripts

Root package scripts should delegate into app scripts:

```json
{
  "local:up": "npm run local:up --workspace=backend",
  "local:down": "npm run db:dev:rm --workspace=backend",
  "backend:migration-run": "npm run migration:run --workspace=backend",
  "generate:sdk": "npm run generate:client --workspace=backend",
  "backend:dev": "npm run start:dev --workspace=backend",
  "frontend:dev": "npm run dev --workspace=frontend"
}
```

## Acceptance Check

Docker-first setup is done when:

- A new developer can run one documented command to start local infrastructure.
- Postgres and Redis are reachable using `.env` values.
- Data reset is documented and intentional.
- Migrations can run from an empty database.

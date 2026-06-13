---
name: docker-first
description: Use when setting up, fixing, or evaluating local infrastructure where Docker services must be created and verified before application feature work.
---

# Docker First

Use Docker as the source of local infrastructure.

## Workflow

1. Inspect existing compose files and env examples.
2. Identify required services: Postgres, Redis, and optional observability.
3. Ensure ports and credentials come from `.env`.
4. Add or update `.env.example`.
5. Add startup, shutdown, reset, and status commands to the command map.
6. Start services.
7. Verify Postgres and Redis connectivity.
8. Document reset behavior.

## Compose Defaults

- Stable service names.
- Shared bridge network.
- Named volumes or explicit `data/` mounts.
- Restart policy for stateful services.
- Health checks when available.

## Do Not

- Require host-installed Postgres or Redis.
- Hide required env vars.
- Start backend before database and Redis are reachable.

## Done

The setup is done when another developer can bring up infrastructure from a fresh checkout using documented commands.

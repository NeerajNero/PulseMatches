---
name: migration-first
description: Use for any feature or fix that changes database schema, persistence behavior, Prisma models, indexes, constraints, seeds, or database setup.
---

# Migration First

Make schema changes before feature code depends on them.

## Workflow

1. Inspect current Prisma schema and migrations.
2. Identify required data model, indexes, constraints, and seed data.
3. Update `schema.prisma`.
4. Create a named migration.
5. Apply migration locally.
6. Generate Prisma client.
7. Implement repository and service code.
8. Verify migration from empty or reset database when feasible.
9. If migration includes handwritten SQL, document functions, triggers, views, indexes, refresh strategy, and seed behavior.

## Rules

- Never rely on unversioned schema drift.
- Do not hand-edit old shared migrations without explicit approval.
- Keep query logic behind DB services or repositories.
- Map known database errors to explicit application exceptions.
- Use the sql-migration-patterns skill for PostgreSQL functions, triggers, materialized views, full-text search, or seed data.

## Done

- Migration exists.
- Migration applies.
- Client is generated.
- Feature code uses only migrated fields.
- Reset or rollback path is documented for local development.

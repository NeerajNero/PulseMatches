---
name: sql-migration-patterns
description: Use when creating or reviewing Prisma migrations that include handwritten SQL, PostgreSQL functions, triggers, materialized views, indexes, seed data, or full-text search.
---

# SQL Migration Patterns

Use this workflow for advanced database migrations.

## Workflow

1. Inspect current Prisma schema and previous SQL migrations.
2. Decide whether behavior belongs in app code, DB constraints, triggers, functions, views, or queues.
3. Write migration SQL idempotently where practical.
4. Add deterministic trigger/function/index names.
5. Add required indexes for new query patterns.
6. For materialized views, add refresh strategy and unique index for concurrent refresh if needed.
7. Keep seed data idempotent.
8. Apply migration from empty and current DB when feasible.
9. Document any behavior that Prisma schema does not reveal.

## Rules

- Do not hide business-critical trigger behavior.
- Use `DROP TRIGGER IF EXISTS` and `DROP FUNCTION IF EXISTS` before replacing.
- Use `CREATE OR REPLACE FUNCTION` for function updates.
- Use `ON CONFLICT DO NOTHING` for required seed data.
- Do not use concurrent materialized-view refresh without a unique index.
- Do not duplicate DB-owned slug generation with a different app algorithm.

## Done

- Migration applies.
- Prisma client is regenerated if schema changed.
- New database behavior is documented.
- Performance implications are considered.

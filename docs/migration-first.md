# Migration First

Schema changes are planned and versioned before feature code depends on them.

## Default Prisma Workflow

Use Prisma for application access and migrations:

```text
apps/backend/src/db/prisma/schema.prisma
apps/backend/src/db/prisma/migrations/
```

Recommended scripts:

```json
{
  "prisma:migrate": "npx prisma migrate dev --schema=./src/db/prisma/schema.prisma",
  "prisma:new-migration": "npx prisma migrate dev --schema=./src/db/prisma/schema.prisma --create-only",
  "prisma:reset": "npx prisma migrate reset --schema=./src/db/prisma/schema.prisma --force",
  "prisma:dbpull": "npx prisma db pull --schema=./src/db/prisma/schema.prisma",
  "prisma:studio": "npx dotenv-cli -e .env -- npx prisma studio --schema=./src/db/prisma/schema.prisma",
  "prisma:generate": "npx prisma generate --schema=./src/db/prisma/schema.prisma",
  "prisma:setup": "npm run prisma:migrate && npm run prisma:dbpull && npm run prisma:generate",
  "prisma:dev:deploy": "npx prisma migrate deploy --schema=./src/db/prisma/schema.prisma"
}
```

## Migration Rules

- Every schema change gets a migration.
- Never rely only on `db push` for collaborative projects.
- Use explicit names for migrations.
- Put indexes, unique constraints, and check constraints in the schema or migration SQL.
- Seed data that is required for the app to boot should be versioned or documented.
- Do not change generated migration files after they have been shared unless the team agrees to reset.
- Handwritten SQL for functions, triggers, materialized views, indexes, or seed data must be documented. See [database-sql-patterns.md](database-sql-patterns.md).

## Repository Layer

Keep Prisma calls in `src/db/<feature>` instead of scattering them through controllers.

Recommended shape:

```text
src/db/orders/orders.repository.ts
src/db/orders/orders-db.service.ts
src/api/orders/orders.service.ts
```

The API service handles business workflow. The DB service/repository handles query construction and persistence.

## Acceptance Check

A migration-first change is done when:

- Migration applies against an empty database.
- Migration applies against the current development database.
- Prisma client is regenerated.
- Feature code does not query fields that are absent from the migrated schema.
- Rollback or reset path is known for development.

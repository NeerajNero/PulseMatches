# Database SQL Patterns

Mature Prisma projects often use handwritten SQL for database-owned behavior. Future projects should document and review these patterns carefully.

## Migration Categories Observed

Observed migration categories include:

- Initial schema and indexes.
- Trigger and function migration.
- Seed-data migration.
- Materialized-view migrations.
- Full-text and trigram search migrations.
- Slug and constraint migrations.
- Refactor migrations for views and relationships.

## SQL Function And Trigger Patterns

### Audit Protection

Pattern:

- `prevent_audit_log_deletion()` raises an exception.
- `BEFORE DELETE ON audit_logs` trigger blocks deletion.

Use for immutable audit logs where delete should be impossible through normal app paths.

### Global `updated_at`

Pattern:

- `update_updated_at_column()` sets `NEW.updated_at = NOW()`.
- A `DO $$` block loops over tables with an `updated_at` column and creates triggers dynamically.

Useful for broad consistency, but document it clearly because Prisma schema alone will not explain the behavior.

### Media Type Enforcement

Pattern:

- Trigger validates that related `media_metadata` rows have expected media type or MIME type.
- Invalid relationships raise database exceptions.

Use database triggers when a relationship constraint depends on row content, not only foreign keys.

### Orphan Cleanup

Pattern:

- After video media references change or delete, a trigger checks whether old media rows are still referenced elsewhere.
- Unreferenced media metadata is deleted.

Use carefully. This is powerful but can surprise developers if not documented.

### Slug Generation

Pattern:

- Trigger creates base slug from title.
- Insert always adds timestamp plus random suffix.
- Update checks uniqueness and adds random suffix on collision.
- Later migrations can replace the function with stronger sanitization.

Keep slug rules in one place. If the database owns slug generation, do not duplicate a different slug algorithm in application code.

### Notification Fan-Out

Pattern:

- After video status or publish status changes, trigger inserts one notification row and fan-out user notification rows.
- Trigger catches notification errors so status update is not blocked.

Use only when notification creation must follow database state changes even outside the app service path. Otherwise prefer application or queue-based events for easier testing.

### Postgres Notify For Queue Wakeups

Some projects use trigger functions that call `pg_notify` when rows are inserted into tables such as notifications and subscription events.

Pattern:

- Insert row into an event/notification table.
- `AFTER INSERT` trigger calls `pg_notify(channel, row_to_json(NEW)::text)`.
- A backend listener or queue layer can react and enqueue work.

Use this when database-created events must be visible outside the request path. Document the channel name, listener owner, retry behavior, and whether lost notifications are recovered by polling.

### Mobile Device Token Tables

For push notifications, use explicit user-device tables:

- Foreign key to the user table with `ON DELETE CASCADE`.
- Expo push token or provider token.
- Created and updated timestamps.
- Unique constraint on `(token, user_id)`.

Do not store all device tokens in one comma-separated user column.

### Derived Field Propagation

Pattern:

- A trigger updates user-level fields when video-level fields change.

Use for cross-row invariants that must remain correct independent of the application path.

## Materialized View Patterns

Materialized views are useful for search:

- `mv_album_search`
- `mv_video_search`
- `mv_tag_search`

Patterns:

- Build read-optimized flattened data for expensive search/list operations.
- Add indexes on filter, sort, and join fields.
- Use GIN indexes for full-text search vectors.
- Use `pg_trgm` and trigram GIN indexes for partial/fuzzy search.
- Add a unique index before using `REFRESH MATERIALIZED VIEW CONCURRENTLY`.
- Provide a refresh function.
- Add statement-level triggers to refresh views when source tables change.

## Concurrent Refresh Pattern

Pattern:

```sql
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_tag_search;
EXCEPTION WHEN OTHERS THEN
  REFRESH MATERIALIZED VIEW mv_tag_search;
END;
ANALYZE mv_tag_search;
```

Rules:

- Concurrent refresh requires a unique index.
- Always document fallback behavior.
- Run `ANALYZE` after refresh when query planning matters.
- Consider queue or cron refresh for high-write tables; trigger refresh can be expensive.

## Search Function Pattern

`get_content_based_tag_suggestions` shows a useful search function pattern:

- Materialized view is the search source.
- Search combines exact match, prefix match, whole-word match, full-text search, and trigram match.
- Relevance score combines content relevance, tag-name relevance, and frequency.
- Function returns a typed table with `tag_name`, `frequency`, and `relevance_score`.

Use this when the app needs stable, database-side ranking that should not be duplicated across services.

## Vector Search Pattern

For AI retrieval or semantic search:

- Enable the `vector` extension in a migration.
- Store the text chunk/content, JSONB metadata, and embedding vector in one table unless scale requires split storage.
- Use the vector dimension that matches the embedding model.
- Add an HNSW or IVFFlat index with the correct operator class for cosine, L2, or inner product search.
- Document the embedding model, dimension, chunking strategy, and refresh/re-embedding process.

Do not add vector columns without an index and a re-embedding plan.

## Seed Data Pattern

Seed data is versioned in migrations for required application records:

- Roles.
- Initial admin user.
- Modules.
- Permissions.
- Role-permission mappings.
- Reserved tag.

Rules:

- Use stable IDs where downstream relationships need them.
- Use `ON CONFLICT DO NOTHING` for idempotency.
- Keep real secrets out of migrations.
- Document default credentials separately and rotate them outside production.

## Index Pattern

The initial migration includes indexes for:

- Login and active-user lookup.
- Role permission joins.
- Video status and publish status.
- Popularity fields such as downloads.
- Slugs and titles.
- Media references.
- Tag joins.
- Analytics date lookups.
- Partial index for pending sync.
- Case-insensitive tag uniqueness through `LOWER(name)`.

Index when a query pattern exists. Name indexes consistently.

## Migration Review Checklist

Before merging a SQL-heavy migration:

- Does it apply from an empty database?
- Does it apply to an existing development database?
- Are `DROP TRIGGER IF EXISTS` and `DROP FUNCTION IF EXISTS` used before replacement?
- Are trigger names deterministic?
- Are functions idempotent where practical?
- Are source tables indexed for new query patterns?
- Does concurrent materialized-view refresh have a unique index?
- Is trigger refresh too expensive for expected write volume?
- Are exceptions intentional and documented?
- Is seed data idempotent?
- Does Prisma schema still reflect the table/column model?

## Anti-Patterns

- Hiding business-critical trigger behavior from docs.
- Creating materialized views without refresh strategy.
- Using trigger refresh on high-write tables without measuring cost.
- Using concurrent refresh without a unique index.
- Writing seed migrations that fail on rerun.
- Generating slugs in both app and DB with different rules.
- Letting Prisma schema imply behavior that only exists in SQL functions.

# Verification

Use this checklist before calling a project task complete.

## Infrastructure

- Docker services start.
- Postgres is reachable.
- Redis is reachable.
- Volumes and reset commands are documented.

## Database

- Migrations apply from empty database.
- ORM client is generated.
- Seed data is documented or automated.
- Migration status is clean.

## Backend

- Backend starts.
- Health endpoint responds.
- API docs or OpenAPI JSON responds outside production.
- Targeted unit or e2e tests pass.
- New endpoints have DTO validation and Swagger docs.

## SDK

- OpenAPI generation works.
- SDK generation works.
- Generated files are not hand-edited.

## Web Frontend

- Web frontend starts.
- Typecheck/build passes when feasible.
- Affected UI flows are manually checked or covered by tests.
- Protected routes handle expired auth.

## Mobile Frontend

- Expo app starts in dev client or simulator.
- Lint/typecheck/build command passes when available.
- App config, EAS config, plugins, permissions, and env exposure are checked when native behavior changes.
- Push notification changes are tested on a physical device.
- Camera/gallery/file changes are tested on a physical device.
- Sentry/error boundary behavior is checked when observability changes.
- Any untested platform is listed as a gap.

## Final Note Format

End implementation work with:

```text
Changed:
- ...

Verified:
- ...

Gaps:
- ...
```

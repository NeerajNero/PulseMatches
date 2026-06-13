# Repo Standards

## Branches

Use:

```text
feat/<ticket>-<short-description>
fix/<ticket>-<short-description>
hotfix/<ticket>-<short-description>
chore/<ticket>-<short-description>
docs/<ticket>-<short-description>
refactor/<ticket>-<short-description>
test/<ticket>-<short-description>
```

Create feature branches from the integration branch used by the project, commonly `development`.

## Commits

Use Conventional Commits:

```text
feat: 1234 add login flow
fix: 5678 handle expired refresh token
chore: 2345 update lint config
docs: 3456 add setup guide
```

## Code Ownership Rules

- Keep generated files clearly marked.
- Do not mix unrelated refactors with feature changes.
- Do not edit migrations after they are shared unless resetting the database is intentional.
- Update docs when commands, ports, environment variables, or runbooks change.

## Environment

Each app should include `.env.example`.

Environment files should document:

- Local ports.
- Database credentials.
- Redis config.
- JWT secrets.
- Frontend/backend URLs.
- Feature flags.
- External service placeholders.

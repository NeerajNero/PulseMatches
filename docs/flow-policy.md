# Flow Policy

Use this policy to decide how much process a change needs.

The full command flow is powerful, but it should not be mandatory for every tiny edit. Pick the smallest lane that protects the project.

Default rule: classify first when scope is unclear. When evidence points to more than one lane, use the stricter lane until the plan or task is revised.

## Lanes

### Lane 1: Tiny Change

Use for low-risk changes that do not affect contracts, data, auth, external services, or architecture.

Examples:

- Copy/text changes.
- Small styling fixes.
- Minor component-only bug fixes.
- Non-contract UI polish.
- Small docs corrections.

Required commands:

```text
/classify <task-or-story-file>
/implement <approved-or-classified-task>
/verify <implementation-report>
```

Optional commands:

```text
/test
/review
/finalize
/context-update
```

Approval:

- Not required unless the user or team asks for it.

Context update:

- Not required unless the change teaches future agents where to look.

### Lane 2: Normal Feature

Use for normal product work that touches backend, frontend, mobile screens, SDK clients, or multiple files but is not high-risk.

Examples:

- CRUD feature.
- New page or mobile screen backed by existing patterns.
- New backend endpoint without sensitive auth or payment behavior.
- SDK/API hook wiring.
- Reusable component with product usage.

Required commands:

```text
/classify <user-stories.md>
/plan <user-stories.md>
/approve <feature-plan.md>
/implement <approval.md>
/verify <implementation-report.md>
/api-integrate <implementation-report.md>
/test <implementation-report.md>
/review <implementation-report.md>
/finalize <implementation-report.md>
/context-update <final.md>
```

Approval:

- Required before implementation.

Context update:

- Required after finalization.

### Lane 3: Risky Feature

Use for changes with data, security, money, native platform, background processing, external provider, or operational risk.

Examples:

- Auth, permissions, roles, session, token, or cookie changes.
- Payments, subscriptions, billing, invoices, refunds.
- Schema changes, migrations, raw SQL, triggers, functions, materialized views.
- Background jobs, queues, cron, DLQ behavior.
- Mobile native config, permissions, app config, EAS, push notifications, camera/media.
- External providers, webhooks, storage, email, SMS, chat/calls.
- Observability, deployment, Docker, infrastructure, secrets.
- Large refactors or cross-cutting behavior.

Required commands:

```text
/classify <user-stories.md>
/plan <user-stories.md>
/approve <feature-plan.md>
/implement <approval.md>
/verify <implementation-report.md>
/api-integrate <implementation-report.md>
/test <implementation-report.md>
/review <implementation-report.md>
/finalize <implementation-report.md>
/context-update <final.md>
```

Additional requirements:

- Use `/block` for missing secrets, credentials, infrastructure, unclear scope, or failed verification.
- Use `/revise-plan` for any material scope change.
- Run `/context-status` before planning if the project has many completed features.
- Review must check migration rollback/data safety, auth, provider failure modes, queue retries, mobile device verification, and observability.

Approval:

- Required before implementation.

Context update:

- Required after finalization.

## Classification Rules

Choose the highest-risk matching lane.

If a change matches both tiny and risky, it is risky.

If a change touches any of these, it is never tiny:

- Database schema or migrations.
- Backend route contract.
- Generated SDK.
- Auth or permissions.
- Payment or subscription behavior.
- External provider.
- Background job or cron.
- Mobile native permissions/config.
- Deployment, Docker, secrets, or infrastructure.

## Command Matrix

| Command | Tiny Change | Normal Feature | Risky Feature |
| --- | --- | --- | --- |
| `/classify` | recommended | required | required |
| `/plan` | optional | required | required |
| `/approve` | optional | required | required |
| `/implement` | required | required | required |
| `/verify` | required | required | required |
| `/api-integrate` | only if API changed | if API changed | if API changed |
| `/test` | optional or targeted | required | required |
| `/review` | optional | required | required |
| `/finalize` | optional | required | required |
| `/context-update` | only for durable knowledge | required | required |

## When To Skip Commands

Only skip commands when the lane allows it.

For tiny changes:

- `/plan` can be skipped.
- `/approve` can be skipped.
- `/api-integrate` can be skipped when no API contract/client wiring changed.
- `/context-update` can be skipped when the change does not affect future navigation.

For normal and risky features:

- Do not skip approval.
- Do not skip verification.
- Do not skip API integration if backend/frontend contracts changed.
- Do not skip context update after finalization.

## Agent Behavior

Before implementing, the agent should know the lane.

If the user has not declared a lane, run or simulate:

```text
/classify <task-or-story-file>
```

The agent should state:

- Lane.
- Required commands.
- Optional commands.
- Reason.
- Whether approval is required.
- Whether context update is required.

If any command discovers that the lane is too light for the real scope, stop implementation work and use `/revise-plan` or rerun `/classify` before continuing.

## Practical Default

Use this default when unsure:

- Small isolated UI/docs change: tiny.
- Product feature: normal.
- Data/auth/payment/mobile-native/provider/queue/infra change: risky.

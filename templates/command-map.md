# Command Map

Document the real commands for this project.

## Root

```bash
package-manager install
package-manager local:up
package-manager local:down
package-manager backend:dev
package-manager frontend:dev
package-manager generate:sdk
```

## Feature Flow

These are agent commands, not package scripts:

```text
/classify docs/features/user-stories.md
/plan docs/features/user-stories.md
/approve docs/features/plans/<feature>.plan.md
/implement docs/features/approvals/<feature>.approval.md
/verify docs/features/reports/<feature>.implementation.md
/api-integrate docs/features/reports/<feature>.implementation.md
/test docs/features/reports/<feature>.implementation.md
/review docs/features/reports/<feature>.implementation.md
/finalize docs/features/reports/<feature>.implementation.md
/context-update docs/features/final/<feature>.final.md
/revise-plan docs/features/plans/<feature>.plan.md
/status docs/features
/select <feature-slug-or-artifact-file>
/block <feature-artifact-file>
/context-status docs/context
```

Tiny changes may use:

```text
/classify <task-file>
/implement <classified-task-or-description>
/verify docs/features/reports/<feature>.implementation.md
```

## Backend

```bash
package-manager db:dev:up
package-manager db:dev:rm
package-manager prisma:migrate
package-manager prisma:new-migration
package-manager prisma:reset
package-manager prisma:dbpull
package-manager prisma:generate
package-manager prisma:studio
package-manager start:dev
package-manager test
```

## Frontend

Web:

```bash
package-manager dev
package-manager build
package-manager test
package-manager e2e:headless
package-manager storybook
```

Mobile:

```bash
package-manager mobile:start
package-manager mobile:ios
package-manager mobile:android
package-manager mobile:lint
package-manager mobile:test
package-manager mobile:eas:build:development
package-manager mobile:eas:build:preview
package-manager mobile:eas:build:production
```

## SDK

```bash
package-manager generate:openapi-spec
package-manager generate:client
```

---
name: api-contract-sdk
description: Use during /api-integrate when backend API changes must be reflected in OpenAPI and a generated TypeScript SDK consumed by web or mobile frontends.
---

# API Contract SDK

Keep backend and frontend in sync through OpenAPI. In the command flow, use this after `/verify` as part of `/api-integrate`.

## Workflow

1. Confirm backend starts.
2. Confirm changed DTOs and Swagger decorators are correct.
3. Fetch or inspect OpenAPI JSON.
4. Regenerate `libs/client_sdk`.
5. Do not hand-edit generated files.
6. Run contract checks such as Dredd when available.
7. Update frontend SDK wrapper usage if API classes changed.
8. Run frontend typecheck or build where feasible.

## Rules

- Backend DTOs define the contract.
- Swagger exposes the contract.
- SDK generation transfers the contract.
- Frontend imports generated models and API classes.
- Custom fetch/auth logic belongs outside generated code.

## Done

- OpenAPI includes the changed route or model.
- SDK regeneration succeeds.
- Frontend compiles against generated types.

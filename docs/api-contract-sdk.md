# API Contract And SDK

The backend contract drives the frontend client. In the feature command flow, final OpenAPI/SDK generation and client wiring happen in `/api-integrate` after `/verify`.

## Flow

1. `/implement` adds or updates backend DTOs and Swagger decorators.
2. `/verify` checks the implementation is ready for API integration.
3. `/api-integrate` confirms OpenAPI JSON, usually at `/api-json`.
4. `/api-integrate` generates `libs/client_sdk` for web-first projects or `apps/frontend/services/sdk` for Expo workspaces.
5. `/api-integrate` wires frontend SDK models and API classes through app-level helpers.

## Rules

- Do not hand-edit generated SDK files.
- Regenerate SDK after every backend route, DTO, or response change.
- Commit generated SDK changes when the project expects generated code in source control.
- Keep custom fetch logic outside the generated SDK.
- Keep model naming stable where possible; frontend churn is expensive.
- Document the SDK output path in `docs/command-map.md`.

## Recommended Backend Scripts

```json
{
  "generate:openapi-spec": "curl http://localhost:3000/api-json -o openapi.json",
  "generate:sdk": "openapi-generator-cli generate -i http://localhost:3000/api-json --generator-name typescript-fetch --additional-properties modelPropertyNaming=original -o ../../libs/client_sdk -c sdk-config.json",
  "generate:client": "rm -rf ../../libs/client_sdk && npm run generate:sdk"
}
```

If global installs are not allowed, install the generator as a dev dependency and call it through the package manager.

For Expo workspaces, the output can be:

```text
apps/frontend/services/sdk
```

In that case, make sure Metro and TypeScript aliases can resolve the generated package.

## Acceptance Check

SDK work is done when:

- Backend is running.
- OpenAPI endpoint returns the updated contract.
- SDK generation succeeds.
- Frontend imports compile.
- At least one affected frontend call has been checked.

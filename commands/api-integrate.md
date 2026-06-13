# `/api-integrate`

## Usage

```text
/api-integrate <path-to-implementation-report.md>
```

If no path is provided, ask which implementation report or approved feature should receive API integration.

## Purpose

Wire the verified implementation into generated SDKs, API wrappers, hooks/services, and web/mobile callers.

Boundary:

- Use `/api-integrate` for OpenAPI/SDK generation, API wrapper registration, hook/service wiring, and narrow API smoke checks.
- Use `/implement` for generating feature code.
- Use `/test` for full behavior tests.

## Inputs

- Implementation report, approval file, or approved plan.
- Backend OpenAPI/Swagger contract.
- SDK generation command.
- Existing web/mobile API wrapper patterns.

## Allowed Actions

- Start or inspect backend API docs when required.
- Regenerate OpenAPI and SDK.
- Update SDK wrapper/client registrations.
- Update web hooks/services to call generated SDK clients.
- Update mobile hooks/services to call generated SDK clients.
- Run a narrow API smoke check.
- Update the implementation report API integration section.

## Forbidden Actions

- Do not implement unapproved feature scope.
- Do not hand-edit generated SDK files.
- Do not call raw backend URLs from screens/components when SDK support exists.
- Do not perform broad UI rewrites unrelated to API wiring.

## Stop Conditions

- Implementation report is missing or feature is not verified.
- Backend contract is missing required DTOs/routes.
- SDK generation fails.
- API integration requires a scope change from the approved plan.

## Output

- Updated SDK/client integration.
- Updated implementation report with status `api-integrated` or `blocked`.

## Prompt

```text
Run /api-integrate for the provided implementation report or approved feature.

First confirm the feature has been implemented and verified. Then regenerate or inspect OpenAPI/SDK as needed, update generated-SDK wrappers, and wire web/mobile hooks or services to the SDK. Do not hand-edit generated SDK files.

Update docs/features/reports/<feature-slug>.implementation.md with API integration results, commands run, files changed, and gaps.

If the user did not provide a file path, ask which implementation report should receive API integration.
```

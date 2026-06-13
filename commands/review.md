# `/review`

## Usage

```text
/review <path-to-implementation-report.md>
```

If no path is provided, ask which implementation report or feature should be reviewed.

## Purpose

Review an implemented feature for correctness and starter-pack compliance.

## Inputs

- Implementation report.
- Approved plan and approval file.
- Changed files.

## Allowed Actions

- Inspect code and docs.
- Run read-only checks when useful.
- Produce findings first, ordered by severity.
- Update the implementation report review section.

## Forbidden Actions

- Do not silently fix issues during review unless the user asks for fixes.
- Do not mark reviewed if blocking findings remain.

## Output

- Findings with file and line references.
- Implementation report review status.

## Prompt

```text
Run /review for the provided implementation report or feature.

Review as a senior engineer. Lead with findings ordered by severity and include file/line references. Focus on bugs, regressions, missing migration/SDK steps, auth/permission gaps, frontend/mobile boundary violations, queue/SQL/provider risks, and missing verification.

Update the implementation report review section.

If the user did not provide a file path, ask which feature should be reviewed.
```

# `/finalize`

## Usage

```text
/finalize <path-to-implementation-report.md>
```

If no file is provided, ask which reviewed feature should be finalized.

## Purpose

Prepare the final handoff after implementation, verification, API integration, testing, and review.

## Inputs

- Implementation report.
- Review findings.
- PR checklist.
- Changed files.

## Allowed Actions

- Update implementation report final summary.
- Create or update `docs/features/final/<feature-slug>.final.md` using [templates/feature-final.md](../templates/feature-final.md).
- Prepare PR summary, verification summary, test summary, known gaps, and follow-ups.

## Forbidden Actions

- Do not finalize if blocking review findings remain.
- Do not hide failed or skipped checks.
- Do not make unrelated code changes.

## Output

- Final feature handoff file.
- Concise summary of what shipped, what was verified, and what remains.
- Recommended `/context-update` command.

## Prompt

```text
Run /finalize for the provided implementation report.

Confirm the feature is reviewed or has no blocking findings. Create docs/features/final/<feature-slug>.final.md with summary, changed files, commands, verification, API integration, tests, review result, known gaps, follow-ups, and the recommended /context-update command.

Do not hide skipped checks or unresolved risks.
```

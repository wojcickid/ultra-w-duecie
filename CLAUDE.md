# Claude Code Project Instructions

## Mission

This repository is developed by a coordinated team of Claude Code agents.
The repository is the source of truth for project state.

The Lead Agent coordinates work. Specialized agents implement focused tasks.
Do not rely on conversation history for project state.

## First-time project setup

Before implementation:
1. Read this file.
2. Read `docs/requirements.md`, `docs/architecture.md`, and `docs/ui.md`.
3. Inspect the repository and existing code.
4. Identify missing decisions or ambiguities.
5. Create a task breakdown under `tasks/backlog/`.
6. Move only executable tasks to `tasks/ready/`.
7. Ask the user when a decision materially affects architecture, scope, security, cost, or UX.

Do not start large-scale implementation before the plan is understood.

## Source of truth

Priority order:
1. Explicit user decisions in the current project.
2. `docs/requirements.md`
3. `docs/architecture.md`
4. `docs/ui.md`
5. `docs/decisions.md`
6. Existing code and tests.
7. Agent assumptions.

When sources conflict, stop and resolve the conflict rather than silently choosing.

## General engineering rules

- Make small, focused, reviewable changes.
- Do not modify unrelated files.
- Reuse existing patterns and components before introducing new ones.
- Do not introduce dependencies without a reason.
- Never commit secrets, tokens, passwords, private keys, or credentials.
- Validate inputs at system boundaries.
- Prefer explicit, maintainable code over clever code.
- Update documentation when an architectural or behavioral decision changes.
- Never mark a task complete without satisfying every acceptance criterion.

## Task workflow

Tasks move through:

`backlog -> ready -> in-progress -> review -> done`

A task may move to `blocked` when progress requires an unresolved dependency or user decision.

Every task must contain:
- ID
- title
- status
- owner
- description
- dependencies
- acceptance criteria

Before implementation, the agent must check dependencies.

Before `review`:
- implementation is complete,
- relevant tests have been run,
- acceptance criteria are checked,
- task notes describe important implementation details.

The Lead Agent is responsible for final task-state transitions.

## Git workflow

- Use a dedicated branch/worktree for implementation tasks.
- Keep commits focused and meaningful.
- Do not rewrite shared history.
- Do not force-push.
- Do not merge another agent's work blindly.
- Inspect diffs before integration.
- Never push directly to `main` unless explicitly instructed.

Suggested branch format:

`agent/<area>/<task-id>-<short-name>`

Examples:
- `agent/backend/TASK-014-customer-api`
- `agent/frontend/TASK-021-customer-list`

## Agent boundaries

### Lead
Coordinates, plans, delegates, reviews and integrates.
May modify any project file when necessary, but should prefer delegation.

### Backend
Backend/API/business logic and backend tests.
Avoid unrelated frontend changes.

### Frontend
UI/application frontend and frontend tests.
Follow `docs/ui.md`.

### Database
Schema, migrations, indexes, constraints and database-related tooling.
Do not redesign application architecture without documenting the decision.

### QA
Testing, validation, regression checks and defect reports.
QA should not silently change product requirements.

## Definition of Done

A task is done only when:
- acceptance criteria are satisfied,
- tests pass or known exceptions are documented,
- no obvious regression was introduced,
- code is formatted/linted according to project tooling,
- documentation is updated where appropriate,
- the change is committed,
- the task file records the outcome.

## Long-running work and context limits

The project must remain resumable after:
- context compaction,
- Claude Code restart,
- API/session interruption,
- usage-limit interruption.

Before stopping or handing work back:
1. Update the task status.
2. Record completed work and remaining work.
3. Record relevant test results.
4. Record blockers or decisions needed.
5. Commit safe, coherent progress.

A future agent must be able to continue from repository state alone.

## When to ask the user

Ask instead of guessing when the decision concerns:
- major architecture,
- security model,
- destructive data changes,
- production deployment,
- externally visible behavior,
- significant cost,
- ambiguous product requirements,
- conflicting requirements.

For routine implementation choices, use established project conventions and document important decisions.

## Completion report

At the end of a work session, report:
- tasks completed,
- tasks in progress,
- blocked tasks,
- tests run,
- important decisions,
- recommended next action.

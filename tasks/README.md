# Task System

The task directory is the persistent work queue for the agent team.

## States

```text
backlog -> ready -> in-progress -> review -> done
                         |
                         v
                      blocked
```

### backlog
Known work that is not yet ready to execute.

### ready
All prerequisites are satisfied and an agent can start.

### in-progress
An agent is actively working on it.

### review
Implementation is complete and requires review/verification.

### blocked
Work cannot continue without a dependency, decision, access, or fix.

### done
Acceptance criteria are satisfied and the Lead Agent has verified the result.

## Task IDs

Use monotonically increasing IDs:

`TASK-001`, `TASK-002`, ...

## Ownership

Use these owner names:
- `lead-agent`
- `backend-agent`
- `frontend-agent`
- `database-agent`
- `qa-agent`

## Task file template

See `tasks/_TEMPLATE.md`.

## Rules

One task should represent one coherent unit of work.
Prefer tasks that can be completed and reviewed independently.

If a task becomes too large, the Lead Agent should split it into smaller tasks and preserve dependencies.

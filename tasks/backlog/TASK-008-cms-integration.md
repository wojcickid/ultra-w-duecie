# TASK-008 — Integracja panelu CMS z kolekcjami treści

## Status

backlog

## Owner

frontend-agent

## Dependencies

- TASK-001
- TASK-003

## Description

Skonfigurować panel `/admin` (wybrany w TASK-001) dla kolekcji `wpisy` i `biegi`, w tym wgrywanie zdjęć, polskie etykiety pól i logowanie przez GitHub.

## Context

FR-5 z `docs/requirements.md`. Panel nie ma linku w publicznej nawigacji. Sekrety wyłącznie w ustawieniach Cloudflare.

## Acceptance criteria

- [ ] Zalogowany autor dodaje i edytuje wpis oraz zmienia status biegu przez panel.
- [ ] Zmiany zapisują się jako commity i po publikacji są widoczne na stronie.
- [ ] Pola w panelu zgodne ze schematem z TASK-003, z polskimi etykietami.
- [ ] Niezalogowany użytkownik nie może zapisać zmian.

## Implementation notes

Optional notes added during implementation.

## Validation

### Tests

- Not run

### Review

- Not reviewed

## Outcome

Complete this section before moving the task to `done`.

- Summary:
- Tests:
- Important files:
- Commit:
- Follow-up tasks:

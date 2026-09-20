# TASK-006 — Lista biegów i strona szczegółów biegu

## Status

backlog

## Owner

frontend-agent

## Dependencies

- TASK-003
- TASK-004

## Description

Strona z listą 10 biegów Korony oraz podstrona każdego biegu (dane, status, wynik, link do wyników, powiązane wpisy).

## Context

FR-1, FR-3 z `docs/requirements.md`. Podstrony generowane statycznie z kolekcji `biegi`.

## Acceptance criteria

- [ ] Daty formatowane z jawną strefą czasową (Europe/Warsaw), bo daty w kolekcjach są parsowane jako UTC.
- [ ] Lista pokazuje wszystkie biegi z kompletem danych i statusem.
- [ ] Każdy bieg ma własną podstronę z poprawnym adresem URL.
- [ ] Powiązane wpisy wyświetlane, gdy istnieją; poprawny stan pusty.
- [ ] Zgodność z `docs/ui.md`.

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

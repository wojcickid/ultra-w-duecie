# TASK-005 — Strona główna: postęp Korony i oś czasu

## Status

backlog

## Owner

frontend-agent

## Dependencies

- TASK-003
- TASK-004
- Użytkownik: decyzja o wolnym slocie po Biegu 7 Dolin, jeśli wpływa na licznik (DEC-008; pytanie otwarte 2)

## Description

Strona główna z krótkim opisem projektu, licznikiem biegów ukończonych wspólnie (X/10, DEC-007), osią czasu postępu (z wyróżnieniem biegu wycofanego) oraz ostatnimi wpisami bloga. Wyniki indywidualne pokazywane osobno poza licznikiem.

## Context

FR-1, FR-2 z `docs/requirements.md`. Dane z kolekcji `biegi` i `wpisy`. Status nie może być komunikowany wyłącznie kolorem.

## Acceptance criteria

- [ ] Daty formatowane z jawną strefą czasową (Europe/Warsaw), bo daty w kolekcjach są parsowane jako UTC.
- [ ] Licznik X/10 liczony automatycznie z danych.
- [ ] Oś czasu pokazuje biegi ze statusem i terminem, poprawnie na telefonie.
- [ ] Sekcja ostatnich wpisów (obsługuje brak wpisów).
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

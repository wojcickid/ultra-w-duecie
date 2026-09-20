# TASK-014 — Walidacja referencji między kolekcjami w buildzie

## Status

in-progress

## Owner

frontend-agent

## Dependencies

- TASK-003

## Description

Astro tylko loguje `[ERROR]` (kod wyjścia 0), gdy wpis odwołuje się do nieistniejącego autora lub biegu, więc build się nie przerywa. Dodać prostą walidację referencji (autor we wpisach i wynikach, bieg we wpisie), która przerywa build (`npm run build` i `npm run check`) z czytelnym komunikatem.

## Context

Wynik przeglądu TASK-003. Dotyczy kryterium „niepoprawny plik powoduje czytelny błąd budowy”. Rozwiązanie ma być minimalne (bez nowych zależności, jeśli to możliwe), np. mały skrypt uruchamiany przed buildem albo integracja Astro.

## Acceptance criteria

- [ ] Odwołanie do nieistniejącego autora (we wpisie lub wyniku) przerywa build z czytelnym komunikatem.
- [ ] Odwołanie do nieistniejącego biegu we wpisie przerywa build z czytelnym komunikatem.
- [ ] Poprawne dane budują się bez zmian.
- [ ] Działanie opisane w README lub docs/architecture.md.

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

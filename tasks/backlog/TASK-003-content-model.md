# TASK-003 — Model treści: kolekcje „biegi” i „wpisy”

## Status

backlog

## Owner

frontend-agent

## Dependencies

- TASK-002
- Użytkownik: potwierdzenie listy 10 biegów (pytanie otwarte 2 w `docs/requirements.md`)

## Description

Zdefiniować kolekcje treści Astro z walidacją schematu i wprowadzić 10 biegów Korony jako dane początkowe (wszystkie ze statusem „planowany/bez planu”, bez danych o ukończeniu — historię dodaje TASK-013).

## Context

Pola `biegi`: nazwa, dystans (km), miejsce, orientacyjny termin, status (ukończony / planowany / bez planu), data planowana, data ukończenia, wynik, link do wyników, notatki. Pola `wpisy`: tytuł, data, treść Markdown, zdjęcia, opcjonalne powiązanie z biegiem. Lista biegów z regulaminu Korony 4.0.

## Acceptance criteria

- [ ] Schematy walidują dane; niepoprawny plik powoduje czytelny błąd budowy.
- [ ] 10 biegów dodanych zgodnie z potwierdzoną listą.
- [ ] Przykładowy wpis testowy przechodzi walidację (do usunięcia przed publikacją).
- [ ] Schemat jest udokumentowany w `docs/architecture.md`.

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

# TASK-003 — Model treści: kolekcje „biegi” i „wpisy”

## Status

in-progress

## Owner

frontend-agent

## Dependencies

- TASK-002
- Brak zablokowań po stronie użytkownika (DEC-007, DEC-008)

## Description

Zdefiniować kolekcje treści Astro z walidacją schematu (nazwy w kodzie po angielsku, DEC-005) i wprowadzić 10 biegów Korony jako dane początkowe (wszystkie ze statusem „planowany/bez planu”, bez danych o ukończeniu — historię dodaje TASK-013).

## Context

Kolekcje: `runs` (biegi), `posts` (wpisy), `authors` (autorzy).
Pola `runs`: nazwa, dystans (km), miejsce, orientacyjny termin, status (ukończony / planowany / bez planu), data planowana, notatki oraz lista wyników per osoba (osoba, data ukończenia, czas, link do wyników). Pola `posts`: tytuł, data, treść Markdown, zdjęcia, autor/autorzy, opcjonalne powiązanie z biegiem. Pola `authors`: identyfikator, nazwa wyświetlana. Lista biegów z regulaminu Korony 4.0.

## Acceptance criteria

- [ ] Schematy walidują dane; niepoprawny plik powoduje czytelny błąd budowy.
- [ ] Wyniki można zapisać osobno dla każdej z dwóch osób; wpis ma pole autora.
- [ ] 10 biegów z regulaminu Korony 4.0 dodanych jako dane początkowe, plus Bieg 7 Dolin oznaczony jako wycofany (`retired`), bez danych o ukończeniu.
- [ ] Autorzy początkowi: Damian i Grzegorz.
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

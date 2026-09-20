# TASK-008 — Integracja panelu CMS z kolekcjami treści

## Status

in-progress

## Owner

frontend-agent

## Dependencies

- TASK-001 (kod i instrukcja gotowe; weryfikacja na żywo po wdrożeniu)
- TASK-003

## Description

Skonfigurować panel `/admin` (wybrany w TASK-001) dla kolekcji `wpisy` i `biegi`, w tym wgrywanie zdjęć, polskie etykiety pól i logowanie przez GitHub.

## Context

FR-5 z `docs/requirements.md`. Panel nie ma linku w publicznej nawigacji. Sekrety wyłącznie w ustawieniach Cloudflare.

## Acceptance criteria

- [ ] Wpisy zapisywane w układzie pakietu `src/content/posts/<slug>/index.md` z obrazami obok (ścieżki względne, zgodne z `image()` w schemacie `posts`; DEC-009).
- [ ] Pole autorów we wpisie to relacja do kolekcji `authors` (zamiast tymczasowego `select` z TASK-001), a wyniki biegów wskazują autora tak samo.
- [ ] Zalogowany autor dodaje i edytuje wpis oraz zmienia status biegu przez panel.
- [ ] Zmiany zapisują się jako commity i po publikacji są widoczne na stronie.
- [ ] Pola w panelu zgodne ze schematem z TASK-003, z polskimi etykietami, w tym wybór autora wpisu i wyniki per osoba.
- [ ] Autor wpisu jest niezależny od konta GitHub, które publikuje.
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

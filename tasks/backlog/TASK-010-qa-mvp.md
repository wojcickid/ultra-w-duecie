# TASK-010 — QA MVP: przepływy, dostępność, wydajność

## Status

backlog

## Owner

qa-agent

## Dependencies

- TASK-005
- TASK-006
- TASK-007
- TASK-008

## Description

Zweryfikować MVP: testy budowy i linków, responsywność (telefon/desktop), dostępność (WCAG 2.1 AA), wydajność (Lighthouse) oraz przepływ end-to-end: zalogowanie, dodanie wpisu, zmiana statusu biegu, publikacja.

## Context

Kryterium sukcesu MVP w `docs/requirements.md`. QA nie zmienia wymagań; wady zgłasza jako zadania.

## Acceptance criteria

- [ ] Strona pomocnicza `/styleguide` (TASK-004) i testowy wpis (`posts/testowy-wpis.md`, TASK-003) usunięte lub niedostępne w buildzie produkcyjnym.
- [ ] Budowa bez błędów i bez uszkodzonych linków wewnętrznych.
- [ ] Sprawdzono szerokości od 360 px do desktopu.
- [ ] Brak krytycznych problemów dostępności; wyniki udokumentowane.
- [ ] Wynik Lighthouse udokumentowany (cel: wysoki wynik wydajności i dostępności).
- [ ] Przepływ dodania wpisu i zmiany statusu przez panel działa end-to-end.
- [ ] Raport wad z priorytetami zapisany w zadaniu.

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

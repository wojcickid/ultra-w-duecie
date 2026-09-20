# TASK-018 — Weryfikacja danych 10 biegów Korony (propozycje do akceptacji)

## Status

in-progress

## Owner

qa-agent

## Dependencies

- TASK-003 (dane początkowe), TASK-017

## Description

Dane biegów (dystans, miejsce, orientacyjny termin, nazwa) pochodzą z opisu na kingrunner.com przetworzonego automatycznie i mają w notatkach placeholder „wymagają weryfikacji z regulaminem”, widoczny publicznie. Zweryfikować dane w źródłach pierwotnych (regulamin Korony 4.0, strony organizatorów) i przygotować propozycje zmian do akceptacji właściciela. NIE zmieniać danych w `src/content` — właściciel edytuje je równolegle przez panel.

## Context

Regulamin: https://www.kingrunner.com/artykul/regulamin---korona-polskich-ultramaratonow-40/1109 oraz opis https://www.kingrunner.com/artykul/korona-polskich-ultramaratonow-40/154. Właściciel potwierdził: Bieg 7 Dolin był w chwili ukończenia (2024) biegiem podstawowym Korony, od 2026 r. nie jest organizowany (DEC-008).

## Acceptance criteria

- [ ] Dla każdego z 10 biegów aktualnej listy Korony i dla Biegu 7 Dolin: oficjalna nazwa, dystans (km), miejsce (start/meta lub miejscowość), orientacyjny termin (miesiąc/okres), z linkiem do źródła i oceną pewności.
- [ ] Rozbieżności między źródłami (opis vs regulamin vs organizator) wypisane wprost.
- [ ] Weryfikacja: lista 10 biegów i zasady zaliczenia w regulaminie 4.0 (w tym status Biegu 7 Dolin).
- [ ] Dokument `docs/run-data-proposals.md` z tabelą: pole, wartość obecna, propozycja, źródło, pewność; oraz propozycja usunięcia placeholderów z `notes`.
- [ ] Żadne pliki w `src/content` nie zostały zmienione.

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

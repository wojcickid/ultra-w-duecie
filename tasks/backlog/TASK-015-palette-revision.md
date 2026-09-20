# TASK-015 — Rewizja palety kolorów

## Status

backlog

## Owner

frontend-agent

## Dependencies

- TASK-005
- TASK-006
- TASK-007
- Użytkownik: wskazówki dotyczące pożądanych kolorów/nastroju (lub przykłady stron, które mu się podobają)

## Description

Zmienić paletę kolorów (i ewentualnie krój pisma) tak, aby odpowiadała preferencjom właściciela, po zbudowaniu głównych stron z prawdziwą treścią. Zmiana ma dotyczyć wyłącznie tokenów w `src/styles/global.css` oraz opisu w `docs/ui.md`.

## Context

Właściciel zaakceptował TASK-004 z zastrzeżeniem, że obecna paleta (papier, leśna zieleń, rdzawy akcent) nie do końca mu odpowiada. Tokeny są zdefiniowane w jednym miejscu, więc zmiana jest tania. Oceniać najlepiej na stronach z realną treścią i zdjęciami.

## Acceptance criteria

- [ ] Nowa paleta zdefiniowana wyłącznie w blokach tokenów; komponenty i strony bez zmian poza koniecznymi.
- [ ] Kontrast tekstu min. 4,5:1 i fokusu min. 3:1 (tabela w `docs/ui.md` zaktualizowana).
- [ ] Statusy biegów nadal odróżnialne bez koloru (tekst i ikona).
- [ ] Użytkownik zaakceptował nową paletę.

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

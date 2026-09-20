# TASK-017 — Poprawki po teście: reguła „wspólnie”, spójne znaczniki, statusy DNF i DNS

## Status

in-progress

## Owner

frontend-agent

## Dependencies

- TASK-005, TASK-006, TASK-008 (zamknięte/scalone)

## Description

Trzy poprawki zgłoszone przez właściciela po teście panelu na produkcji:

1. **Reguła „ukończony wspólnie”:** obaj autorzy muszą mieć wynik z tą samą datą ukończenia (dziś sprawdzany jest tylko fakt posiadania wyniku).
2. **Spójne znaczniki:** bieg ukończony i jednocześnie wycofany (np. Bieg 7 Dolin) ma pokazywać oba znaczniki („Ukończony” i „Wycofany”) wszędzie: na stronie głównej (dziś tylko „Wycofany”), na liście biegów i na stronie biegu.
3. **Nowe statusy biegu `dnf` i `dns`:** bieg nieukończony (DNF) i bieg, na którym nie wystartowano (DNS).

## Context

DEC-007 (licznik tylko biegi ukończone wspólnie), DEC-008 (bieg wycofany). Dane rzeczywiste w `src/content` edytuje właściciel przez panel na produkcji — NIE zmieniaj ich (do testów używaj danych tymczasowych, których nie commitujesz).

## Acceptance criteria

- [ ] `isCompletedTogether` wymaga wyniku każdego autora i identycznej daty ukończenia; opisane w DEC-010 i w podpowiedzi w panelu.
- [ ] Dla biegu, gdzie obaj mają wyniki z różnymi datami, build wypisuje ostrzeżenie (bez przerywania).
- [ ] Jedno źródło prawdy dla znaczników (`getRunBadges`): strona główna, `/biegi` i `/biegi/<id>` pokazują dla ukończonego wycofanego oba znaczniki.
- [ ] Status `dnf` i `dns` w schemacie, panelu (w tym filtry), komponentach i dokumentacji; znaczniki mają tekst i ikonę, kontrast min. 4,5:1.
- [ ] Licznik postępu nie liczy DNF/DNS; istniejące dane nadal przechodzą walidację.
- [ ] `npm run build`, `lint`, `format:check`, `check` bez błędów.

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

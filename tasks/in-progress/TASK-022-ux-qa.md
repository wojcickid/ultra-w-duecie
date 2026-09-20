# TASK-022 — QA rundy UX

## Status

in-progress

## Owner

qa-agent

## Dependencies

- TASK-021

## Description

Sprawdzić wszystkie zmienione widoki (desktop, telefon 320–430 px) na buildzie lokalnym, na kopii danych testowych poza repo dla przypadków, których nie ma w realnych danych (termin orientacyjny z rokiem, brak terminu, ukończony wspólnie z miejscem, brak wpisu, kilka wpisów). Nie modyfikować repozytorium (poza raportem), nie dotykać produkcji poza GET/HEAD.

## Context

Runda dopracowania UX i struktury serwisu (zlecenie właściciela z 2026-09-20). Decyzje właściciela:
1. Nowe pola opcjonalne w modelu: `place` (miejsce, liczba całkowita) przy wyniku osoby, `resultsUrl` na poziomie biegu, `expectedYear` (rok terminu orientacyjnego). Bez migracji istniejących danych, bez wymyślania wartości.
2. Bieg 7 Dolin NIE jest ukrywany: osobna sekcja „Historia projektu” pod listą 10 biegów Korony 4.0, z wyraźnym znacznikiem „Ukończony wspólnie” i adnotacją, że nie jest jedną z 10 pozycji Korony 4.0. Licznik 2/10 zostaje (DEC-008); pod licznikiem wyjaśnienie z czego się składa (Rzeźnik + 7 Dolin).
3. Lista Korony 4.0 w kolejności sezonu (`order`); historia jako osobny blok pod nią.
4. „Najbliższy start” liczony przy budowie strony z danych + krótki skrypt ukrywający kartę po dacie startu.
Statusy: wartości w danych bez zmian (`completed/planned/unplanned`); etykiety: Ukończony / Zaplanowany / Do ustalenia.
Terminy: potwierdzona data („3 października 2026”), orientacyjny („październik 2026” z `expectedYear`, albo „październik” z dopiskiem „termin orientacyjny”), nieustalony („Termin do ustalenia”). Nie pokazywać „orientacyjnie: …” jako prefiksu.
ZAKAZ: nie tworzyć, nie edytować, nie usuwać wpisów bloga (`src/content/posts/`); nie zmieniać danych w `src/content/runs|authors` (poza dopisaniem pól tylko jeśli zadanie tego wprost wymaga i po uzgodnieniu). Wyjątek: dane testowe wyłącznie w tymczasowym katalogu poza repo. Styl wizualny bez zmian (bez gradientów, animacji, wykresów).

## Acceptance criteria

- [ ] Przypadki: ukończony, planowany, termin orientacyjny, brak terminu, DNF, DNS, bieg wycofany/historyczny, brak wpisu, wpis powiązany.
- [ ] 2/10, Bieg 7 Dolin, najbliższy start (także po dacie), daty dokładne/orientacyjne.
- [ ] Brak poziomego scrolla, obcinania nazw, nakładania się statusów.
- [ ] Wpisy bloga niezmienione (porównanie `src/content/posts/` z `main`).
- [ ] Raport w `docs/qa-report-ux-round.md` z listą wad.

## Implementation notes

Optional notes added during implementation.

## Validation

### Tests

- Not run

### Review

- Not reviewed

## Outcome

- Summary:
- Tests:
- Important files:
- Commit:
- Follow-up tasks:

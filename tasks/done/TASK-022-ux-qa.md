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

- [x] Przypadki: ukończony, planowany, termin orientacyjny, brak terminu, DNF, DNS, bieg wycofany/historyczny, brak wpisu, wpis powiązany.
- [x] 2/10, Bieg 7 Dolin, najbliższy start (także po dacie), daty dokładne/orientacyjne.
- [x] Brak poziomego scrolla, obcinania nazw, nakładania się statusów.
- [x] Wpisy bloga niezmienione (porównanie `src/content/posts/` z `main`).
- [x] Raport w `docs/qa-report-ux-round.md` z listą wad.

## Implementation notes

Testy wykonane 2026-09-20 (Edge/Chromium 153 + playwright-core, axe-core, Lighthouse w scratchpadzie poza repo). Dane testowe tylko w kopii projektu poza repozytorium. Pełny opis: [docs/qa-report-ux-round.md](../../docs/qa-report-ux-round.md).

Werdykt: GOTOWE Z UWAGAMI. Wady: P0 0, P1 0, P2 1, P3 6.
- D-01 (P2): `<caption>` tabeli wyników bez spacji („Wyniki w bieguBieg Rzeźnika:Damian i Grzegorz”), `src/components/RunResultsTable.astro`.
- D-02..D-07 (P3): niespójne słownictwo „wycofany” vs „Poza listą Korony 4.0” i brak literalnego „Ukończony wspólnie”; status biegu obok wyników z poprzedniego podejścia; „Termin: Termin do ustalenia” na osi czasu dla czytników; dopisek terminu 12 px; przewijanie poziome przy powiększeniu tekstu 200%; semantyka tabeli blokowej niepotwierdzona w WebKit.

## Validation

### Tests

- `npm ci`, `npm run build` (16 stron), `npm run lint`, `npm run format:check`, `npm run check` (0 errors, 0 warnings, 0 hints): OK.
- Responsywność 320/360/390/768/1280 px: 0 poziomych przewijań, 0 nakładań znaczników (16 stron danych realnych, 12 stron kopii testowej).
- axe-core (WCAG 2.x A/AA + best-practice, jasny i ciemny schemat): 0 naruszeń. Lighthouse lokalnie: 100/100/100/100.
- Skrypt „Najbliższy start” (zegar Playwright, 3 strefy czasowe): przed / w dniu / po dniu 2026-10-03: OK.
- 0 martwych linków wewnętrznych; `git diff main -- src/content` pusty; `/admin` dostępny.

### Review

- Wymaga przeglądu Leada (zatwierdzenie raportu, decyzja o naprawie D-01 i ewentualnie D-02/D-03).

## Outcome

- Summary: QA rundy UX zakończone; gotowe z uwagami, 1 wada P2 i 6 P3, brak P0/P1.
- Tests: patrz sekcja Validation i raport.
- Important files: `docs/qa-report-ux-round.md`, `tasks/review/TASK-022-ux-qa.md`.
- Commit: patrz `git log` gałęzi `agent/qa/TASK-022-ux-qa` (commit „TASK-022: raport QA rundy UX”).
- Follow-up tasks: naprawa D-01 (caption tabeli, P2); decyzje produktowe D-02, D-03; poprawki P3 D-04..D-07.

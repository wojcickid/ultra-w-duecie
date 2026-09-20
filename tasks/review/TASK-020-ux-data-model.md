# TASK-020 — Model danych i logika: pola, terminy, statusy

## Status

review

## Owner

database-agent

## Dependencies

- brak

## Description

Dodać do modelu opcjonalne pola `place` (wynik osoby), `resultsUrl` (bieg) i `expectedYear` (bieg); zmienić etykiety statusów (Ukończony/Zaplanowany/Do ustalenia, znacznik biegu wycofanego); przepisać `getRunTerm` (potwierdzona data / termin orientacyjny / do ustalenia, z polami do wyświetlenia bez prefiksu „orientacyjnie:”); dodać helper wyboru najbliższego startu (`getNextRun`), podziału na biegi Korony 4.0 i historię oraz komplet wyliczeń ‚razem’ dla widoków; ostrzeżenie w walidacji, gdy liczba biegów aktywnych != 10; aktualizacja panelu (`public/admin/config.yml`), `docs/decisions.md` (DEC-012), `docs/architecture.md`, `docs/authors-guide.md`, `docs/ui.md`.

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

- [x] Schemat zawiera opcjonalne `place`, `resultsUrl`, `expectedYear`; istniejące dane przechodzą bez zmian.
- [x] Panel (`config.yml`) ma nowe pola z podpowiedziami po polsku.
- [x] Etykiety statusów zmienione w jednym miejscu; wartości w danych bez zmian.
- [x] `getRunTerm` rozróżnia 3 rodzaje terminu; brak prefiksu „orientacyjnie:”.
- [x] Helpery: najbliższy start (z danych, nie z hardkodu), podział Korona 4.0 / historia.
- [x] Walidacja ostrzega, gdy aktywnych biegów != 10.
- [x] DEC-012 i dokumentacja zaktualizowane (po polsku).
- [x] build, lint, format:check, astro check, walidacja treści bez błędów; brak zmian w `src/content/`.

## Implementation notes

- Schemat (`src/content.config.ts`): `result.place` (int > 0), `run.resultsUrl` (url), `run.expectedYear` (int 2000-2100), wszystkie opcjonalne; dane w `src/content/` bez zmian.
- `src/lib/runs.ts`: `getRunTerm(run): RunTerm` zwraca zawsze obiekt `{ kind: 'confirmed' | 'approximate' | 'tbd', label, value, isoDate?, approximate, qualifier? }`. Pierwszeństwo: data z wyników > `plannedDate` > `typicalMonth` (+ `expectedYear`) > sam `expectedYear` > do ustalenia. Sam miesiąc dostaje `qualifier: 'termin orientacyjny'`, miesiąc z rokiem nie. Nowe: `formatRunTerm(term)` (jeden tekst z dopiskiem w nawiasie). `getRunFacts` zawsze dodaje termin („Termin: do ustalenia” dla `tbd`).
- `isoDate` liczone teraz przez `toDayKey` (Europe/Warsaw), wcześniej przez `toISOString()` (UTC); dla dat zapisanych jako YYYY-MM-DD wynik ten sam.
- `src/lib/progress.ts`: `splitCrownAndHistory(runs)` -> `{ crown, history }`; `getTogetherSummary(runs, authorIds)` -> `{ count, total, runs, fromCrown, fromHistory }`; `getNextRun(runs, authorIds, now)` -> `{ run, isoDate, daysUntil } | undefined` (niewycofany, z `plannedDate`, nieukończony wspólnie, dzień startu >= dziś w Europe/Warsaw, remis: `order`, potem `id`).
- `StatusBadge.astro`: tylko etykiety (Ukończony / Zaplanowany / Do ustalenia / Poza listą Korony 4.0); wartości, ikony i klasy bez zmian.
- Minimalna adaptacja widoku: `src/pages/index.astro` (kontrakt `getRunTerm` się zmienił, brak już `undefined`): używa `term.label`, `formatRunTerm(term)`, `term.isoDate`. Pozostałe widoki bez zmian; pełne przebudowanie widoków to TASK-021.
- `scripts/validate-content.mjs`: ostrzeżenie (exit 0), gdy liczba biegów bez `retired: true` != 10 (sprawdzone na kopii poza repo z usuniętym jednym biegiem).
- `public/admin/config.yml`: pola `expectedYear`, `resultsUrl` (bieg), `place` (wynik); polskie etykiety statusów, filtrów i flagi `retired` („Poza listą Korony 4.0”); pole `plannedDate` nazwane „Potwierdzona data startu”.
- Dokumentacja: DEC-012 (koniec `docs/decisions.md`), `architecture.md`, `authors-guide.md`, `ui.md`.

## Validation

### Tests

- `npm run lint`, `npm run format:check`, `npx astro check` (0 errors, 0 warnings, 0 hints), `npm run build` (walidacja treści OK, 16 stron): bez błędów.
- Jednorazowy skrypt (poza repo, esbuild + node) dla helperów: data potwierdzona (`plannedDate`: „3 października 2026”, `confirmed`), miesiąc + `expectedYear` („październik 2027”, bez dopisku), sam miesiąc („październik” + „termin orientacyjny”), sam rok, brak terminu („Termin do ustalenia”), daty z wyników (Ukończono / Podejście / Pierwsze podejście); `getNextRun` na danych rzeczywistych: now 2026-09-20 -> bison-ultra-trail (13 dni), 2026-10-03 -> bison-ultra-trail (0 dni), 2026-10-03T22:30Z (już 4.10 w Warszawie) i później -> brak; `splitCrownAndHistory`: 10 biegów + bieg-7-dolin; `getTogetherSummary`: 2/10 (Rzeźnik + 7 Dolin).
- `git diff` bez zmian w `src/content/`.

### Review

- Not reviewed

## Outcome

- Summary: model danych (`place`, `resultsUrl`, `expectedYear`), trzy rodzaje terminu, nowe etykiety statusów, helpery listy Korony / historii / najbliższego startu, ostrzeżenie o liczbie biegów aktywnych, panel CMS i dokumentacja (DEC-012).
- Tests: lint, format:check, astro check, build i skrypt weryfikujący helpery: OK.
- Important files: `src/content.config.ts`, `src/lib/runs.ts`, `src/lib/progress.ts`, `src/components/StatusBadge.astro`, `src/pages/index.astro` (minimalna adaptacja), `scripts/validate-content.mjs`, `public/admin/config.yml`, `docs/`.
- Commit: branch `agent/data/TASK-020-ux-data-model` (commity TASK-020).
- Follow-up tasks: TASK-021 (widoki: sekcja „Historia projektu”, karta „Najbliższy start” ze skryptem ukrywającym po dniu startu, wyjaśnienie licznika), TASK-022 (QA); ewentualne dopisanie `expectedYear` / `place` / `resultsUrl` do danych po potwierdzeniu w źródłach.

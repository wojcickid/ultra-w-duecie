# TASK-021 — Widoki: strona główna, lista biegów, karta biegu, blog

## Status

review

## Owner

frontend-agent

## Dependencies

- TASK-020

## Description

Przebudować widoki zgodnie z decyzjami: strona główna (tytuł i opis Damian + Grzegorz; POSTĘP DUETU „2 / 10” z zdaniem „2 z 10 biegów ukończonych razem” i jasnym wyjaśnieniem ‚tego samego dnia’ w głównym tekście, skład licznika; Najbliższy start z danych + skrypt ukrywający po dacie; Nasza droga: Korona 4.0 (10) + osobna sekcja Historia projektu z 7 Dolin jako zaliczonym; Ostatnie wpisy (tytuł, data, zajawka, powiązany bieg, link); Wyniki indywidualne niżej i lżejsze); /biegi analogicznie (Korona 4.0 + Historia); /biegi/<id>: nagłówek (nazwa, status, termin, dystans, lokalizacja), blok ‚Razem’, tabela Damian/Grzegorz (status, czas, miejsce — tylko istniejące dane; DNF/DNS/brak danych), Oficjalne wyniki, Relacja (powiązane wpisy albo subtelny komunikat „Relacja z tego biegu jeszcze się nie pojawiła.”), przygotowana struktura pod przyszłe sekcje (zdjęcia, trasa, GPX, statystyki) bez ich implementowania; /blog: kafelek wpisu z ‚Dotyczy biegu: …’.

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

- [x] Strona główna w hierarchii: nazwa → opis → postęp 2/10 → najbliższy start → nasza droga → ostatnie wpisy → wyniki indywidualne.
- [x] Licznik z danych; komunikat „2 z 10 biegów ukończonych razem” z wyjaśnieniem tego samego dnia bez czytania drobnego druku.
- [x] Najbliższy start z danych, z fallbackiem gdy brak; skrypt ukrywa kartę po dacie.
- [x] Bieg 7 Dolin w osobnej sekcji ‚Historia projektu’ z widocznym zaliczeniem; brak wrażenia 11 pozycji.
- [x] Statusy i terminy spójne na stronie głównej, liście i karcie biegu.
- [x] Karta biegu: struktura wg zadania; DNF/DNS/brak danych; brak pustych wartości.
- [x] Relacja: powiązane wpisy lub komunikat; blog pokazuje bieg.
- [x] Bez poziomego scrolla 320–1280 px; kontrast i dostępność jak dotychczas; styl bez zmian.
- [x] build, lint, format:check, astro check bez błędów; brak zmian w `src/content/`.

## Implementation notes

Nowe pliki:  (, ; werdykt „razem?” i powód z danych, korzysta z ), komponenty , , , , , . Zmienione:  (przyjmuje teraz  + , nie gotowe elementy),  (),  („Dotyczy biegu:”), strony , , ,  („Dotyczy biegu:” zamiast „Powiązany bieg:”), . Jedyny dodatek do istniejącej biblioteki:  w . Brak zmian w .

Decyzje i odstępstwa:
- Strona biegu: punkt rozszerzenia = komentarz „SEKCJE STRONY BIEGU” + komponent ; sekcja „Oficjalne wyniki” widoczna tylko przy  (linki per osoba są w wierszu „Wyniki oficjalne” tabeli, żeby ich nie dublować). W danych żaden bieg nie ma jeszcze  biegu, więc sekcja się nie pojawia.
- Tabela wyników poniżej  ma układ blokowy ( na elementach tabeli); część czytników ekranu może wtedy tracić semantykę tabeli (dopuszczone w zleceniu). Kolumny mają też widoczne imię w komórce.
- Nagłówek „Miejsce” z  (lokalizacja) nie jest używany w widokach; nowy  nazywa ją „Lokalizacja”, bo „Miejsce” oznacza teraz miejsce w klasyfikacji ().  zostaje tylko do opisu meta strony.
- Skrypt „Najbliższy start”: , bez zależności; po dniu startu (Europe/Warsaw) ukrywa kartę i pokazuje „Kolejny termin do ustalenia” (przetestowane z zegarem 2026-10-03 i 2026-10-04).
- Zauważone w danych (bez zmian, poza zakresem): SGS i Ultra Granią Tatr mają wyniki, ale , więc znacznik to „Do ustalenia”, choć bieg się odbył; werdykt „Nie ukończyliśmy tego biegu razem” to wyjaśnia. Sugestia dla właściciela: rozważyć status /nowy status dla „podejście bez ukończenia”.

## Validation

### Tests

- npm run lint: OK; npm run format:check: OK; npx astro check: 0 errors/0 warnings/0 hints; npm run build: OK (16 stron).
- Przeglądarka (Playwright-core + MS Edge, poza repozytorium; statyczny serwer na porcie 4399, zatrzymany): strony /, /biegi, /biegi/{bieg-rzeznika,sgs,ultra-grania-tatr,bison-ultra-trail,zuk,bieg-7-dolin}, /blog przy 320, 390 i 1280 px — brak poziomego scrolla (scrollWidth <= clientWidth) na wszystkich 27 kombinacjach; zrzuty przejrzone wizualnie. Skrypt ukrywający kartę: przed datą start karta widoczna, po dacie ukryta i pokazany komunikat.

### Review

- Czeka na przegląd Lead/QA (TASK-022).

## Outcome

- Summary: przebudowane widoki wg DEC-012 (Korona 4.0 + Historia projektu, postęp duetu z wyjaśnieniem i składem licznika, Najbliższy start, Ostatnie wpisy, lżejsze Wyniki indywidualne, karta biegu z werdyktem „Razem” i tabelą, Relacja, blog z „Dotyczy biegu”).
- Tests: lint, format:check, astro check, build OK; weryfikacja wizualna 320/390/1280 px bez poziomego scrolla.
- Important files: src/pages/{index,biegi/index,biegi/[id],blog/[id]}.astro, src/components/{Timeline,RunCard,PostCard,Section,RunTerm,RunFacts,RunVerdict,RunResultsTable,PostTeaser}.astro, src/lib/run-verdict.ts, src/lib/blog.ts, docs/ui.md.
- Commit:
- Follow-up tasks: TASK-022 (QA); decyzja właściciela o statusach biegów z wynikami, ale `unplanned` (SGS, Ultra Granią Tatr).

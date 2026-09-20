# TASK-021 — Widoki: strona główna, lista biegów, karta biegu, blog

## Status

backlog

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

- [ ] Strona główna w hierarchii: nazwa → opis → postęp 2/10 → najbliższy start → nasza droga → ostatnie wpisy → wyniki indywidualne.
- [ ] Licznik z danych; komunikat „2 z 10 biegów ukończonych razem” z wyjaśnieniem tego samego dnia bez czytania drobnego druku.
- [ ] Najbliższy start z danych, z fallbackiem gdy brak; skrypt ukrywa kartę po dacie.
- [ ] Bieg 7 Dolin w osobnej sekcji ‚Historia projektu’ z widocznym zaliczeniem; brak wrażenia 11 pozycji.
- [ ] Statusy i terminy spójne na stronie głównej, liście i karcie biegu.
- [ ] Karta biegu: struktura wg zadania; DNF/DNS/brak danych; brak pustych wartości.
- [ ] Relacja: powiązane wpisy lub komunikat; blog pokazuje bieg.
- [ ] Bez poziomego scrolla 320–1280 px; kontrast i dostępność jak dotychczas; styl bez zmian.
- [ ] build, lint, format:check, astro check bez błędów; brak zmian w `src/content/`.

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

# TASK-020 — Model danych i logika: pola, terminy, statusy

## Status

in-progress

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

- [ ] Schemat zawiera opcjonalne `place`, `resultsUrl`, `expectedYear`; istniejące dane przechodzą bez zmian.
- [ ] Panel (`config.yml`) ma nowe pola z podpowiedziami po polsku.
- [ ] Etykiety statusów zmienione w jednym miejscu; wartości w danych bez zmian.
- [ ] `getRunTerm` rozróżnia 3 rodzaje terminu; brak prefiksu „orientacyjnie:”.
- [ ] Helpery: najbliższy start (z danych, nie z hardkodu), podział Korona 4.0 / historia.
- [ ] Walidacja ostrzega, gdy aktywnych biegów != 10.
- [ ] DEC-012 i dokumentacja zaktualizowane (po polsku).
- [ ] build, lint, format:check, astro check, walidacja treści bez błędów; brak zmian w `src/content/`.

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

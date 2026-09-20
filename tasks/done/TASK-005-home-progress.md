# TASK-005 — Strona główna: postęp Korony i oś czasu

## Status

done

## Owner

frontend-agent

## Dependencies

- TASK-003
- TASK-004
- Użytkownik: decyzja o wolnym slocie po Biegu 7 Dolin, jeśli wpływa na licznik (DEC-008; pytanie otwarte 2)

## Description

Strona główna z krótkim opisem projektu, licznikiem biegów ukończonych wspólnie (X/10, DEC-007), osią czasu postępu (z wyróżnieniem biegu wycofanego) oraz ostatnimi wpisami bloga. Wyniki indywidualne pokazywane osobno poza licznikiem.

## Context

FR-1, FR-2 z `docs/requirements.md`. Dane z kolekcji `biegi` i `wpisy`. Status nie może być komunikowany wyłącznie kolorem.

## Acceptance criteria

- [x] Daty formatowane z jawną strefą czasową (Europe/Warsaw), bo daty w kolekcjach są parsowane jako UTC.
- [x] Licznik X/10 liczony automatycznie z danych.
- [x] Oś czasu pokazuje biegi ze statusem i terminem, poprawnie na telefonie.
- [x] Sekcja ostatnich wpisów (obsługuje brak wpisów).
- [x] Zgodność z `docs/ui.md`.

## Implementation notes

- Logika w `src/lib/progress.ts` (czyste funkcje bez zależności od Astro): `CROWN_TOTAL = 10`, `sortRuns` (po `order`, brak `order` na końcu), `isCompletedTogether` (każdy autor z kolekcji `authors` ma wynik; bieg `retired` się liczy, DEC-008), `countCompletedTogether`, `getAuthorResults` (wyniki autora, także solo).
- Nowe komponenty: `ProgressBar.astro` (`role="progressbar"`, aria-valuenow/max/text; segmenty wypełniony/pusty różnią się też obramowaniem; obok jest tekst „X z 10 biegów ukończonych wspólnie”) i `Timeline.astro` (lista `<ol>`, jedna kolumna od 360 px, nazwy biegów jako `h4` pod `h3` „Oś czasu biegów”).
- Status na osi: `retired` -> wariant StatusBadge `withdrawn` (także gdy ukończony wspólnie) + adnotacja tekstowa; pozostałe: wartość `status` z kolekcji. Adnotacje: „Ukończony wspólnie.” / „Ukończony indywidualnie: <imię>.”.
- Termin na osi: data najwcześniejszego wyniku (jeśli są wyniki), inaczej `plannedDate`, inaczej `typicalMonth`, inaczej „Termin nieznany”. Daty przez `formatDate` (Europe/Warsaw); dystans przez Intl pl-PL (przecinek dziesiętny).
- Wyniki indywidualne: karty `Card` per autor (kolejność po id autora), stan pusty „Jeszcze bez ukończonych biegów”; wynik wspólny oznaczony tekstem „ukończony wspólnie”.
- Ostatnie wpisy: do 3, malejąco po dacie, lista inline (bez PostCard), linki `/blog/<id>`; stan pusty „Wpisy pojawią się wkrótce”.
- Linki `/biegi/<id>`, `/biegi`, `/blog/<id>`, `/blog` prowadzą do stron z TASK-006/007 (do czasu scalenia dają 404).
- Uwagi do dokumentacji (dla Leada): docs/ui.md — dopisać komponenty `ProgressBar` i `Timeline`; docs/architecture.md — wspomnieć `src/lib/progress.ts`. Wpis testowy (`testowy-wpis`) pojawia się na stronie głównej do czasu usunięcia. Gdyby licznik przekroczył 10 (np. po decyzji o slocie po 7 Dolinach), segmenty paska są przycięte do 10, a tekst pokazuje realną liczbę — do rozważenia razem z pytaniem otwartym 2.

## Validation

### Tests

- `npm run build`, `lint`, `format:check`, `check` — bez błędów (0 errors/warnings/hints).
- Logika `progress.ts` sprawdzona skryptem asercji (node, poza repo): brak biegów lub brak autorów -> 0; bieg z jednym autorem nie liczy się; bieg z obojgiem (także w odwróconej kolejności wyników, także wycofany) liczy się; brak `order` -> koniec listy; wyniki autora solo vs wspólne.
- Dane tymczasowe (przywrócone przez `git checkout -- src/content`): wspólny ZUK, solo SGS, wspólny wycofany 7 Dolin, planowany z `plannedDate`, 5 wpisów -> 2/10, do 3 wpisów malejąco po dacie, poprawne oś czasu i sekcje wyników.
- Dane rzeczywiste: 0/10, stany puste wyników; po tymczasowym usunięciu wpisu testowego — „Wpisy pojawią się wkrótce”.
- Chrome headless (CDP, emulacja 360 i 1280 px): brak przewijania poziomego przy 360 px (scrollWidth = 360), układ jednokolumnowy; przy 1280 px karty wyników w dwóch kolumnach.

### Review

- Lead (2026-09-20): diff tylko w zakresie; build (3 strony), lint, format:check i astro check uruchomione niezależnie, bez błędów; licznik na danych rzeczywistych: 0 z 10. Logika licznika zgodna z DEC-007/DEC-008. Zaakceptowane. Uwagi do dokumentacji (ProgressBar, Timeline, progress.ts) — Lead uzupełni po scaleniu.

## Outcome

Complete this section before moving the task to `done`.

- Summary: Strona główna: wstęp, licznik X/10 z paskiem postępu, oś czasu biegów, wyniki indywidualne, ostatnie wpisy.
- Tests: build, lint, format:check, check OK; logika i render sprawdzone na danych tymczasowych (patrz Validation).
- Important files: `src/pages/index.astro`, `src/lib/progress.ts`, `src/components/ProgressBar.astro`, `src/components/Timeline.astro`
- Commit: a2bd0f9 (gałąź agent/frontend/TASK-005-home-progress)
- Follow-up tasks: wpis testowy widoczny na stronie głównej do usunięcia przed publikacją (TASK-010); przy decyzji o slocie po 7 Dolinach zweryfikować licznik (pytanie otwarte 2).

# TASK-006 — Lista biegów i strona szczegółów biegu

## Status

done

## Owner

frontend-agent

## Dependencies

- TASK-003
- TASK-004

## Description

Strona z listą 10 biegów Korony oraz podstrona każdego biegu (dane, status, wynik, link do wyników, powiązane wpisy).

## Context

FR-1, FR-3 z `docs/requirements.md`. Podstrony generowane statycznie z kolekcji `biegi`.

## Acceptance criteria

- [x] Daty formatowane z jawną strefą czasową (Europe/Warsaw), bo daty w kolekcjach są parsowane jako UTC.
- [x] Lista pokazuje wszystkie biegi z kompletem danych i statusem.
- [x] Każdy bieg ma własną podstronę z poprawnym adresem URL.
- [x] Powiązane wpisy wyświetlane, gdy istnieją; poprawny stan pusty.
- [x] Zgodność z `docs/ui.md`.

## Implementation notes

- Lista `/biegi` (`src/pages/biegi/index.astro`): kolekcja `runs` posortowana po `order` (brak `order` = na końcu), siatka 1 kolumna (od 360 px) / 2 od `sm` / 3 od `lg`, każda pozycja to `<li>` z `RunCard` (h2 w `Card` z `href`, cała karta klikalna). Karta: nazwa, StatusBadge, Dystans / Miejsce / Termin (`dl`); brakujące pola pomijane.
- Podstrona `/biegi/<id>` (`src/pages/biegi/[id].astro`, `getStaticPaths` z kolekcji): h1, znaczniki statusu, adnotacja dla `retired`, dane, `notes` jako zwykły tekst, sekcja „Wyniki” (karta na osobę: h3 z `displayName`, data przez `formatDate`, czas, link `rel="noopener"` z etykietą „Wyniki oficjalne — <imię>”; stan pusty „Jeszcze bez wyniku” z ikoną), sekcja „Powiązane wpisy” (lista inline: tytuł-link `/blog/<id>`, `<time>`, autorzy; najnowsze pierwsze; stan pusty „Brak wpisów o tym biegu.”), link powrotny „Wszystkie biegi”. Tytuł i opis unikalne dla każdego biegu (`<Nazwa> — Ultra w duecie`).
- Nowy plik `src/lib/runs.ts` (poza listą własnych plików z zadania, ale wspólny dla RunCard i strony biegu; nie dotyka plików innych zadań): `getRunBadges` (mapowanie statusu na znaczniki) i `getRunFacts` (Dystans / Miejsce / Termin).
- Decyzja: `retired` -> znacznik „Wycofany” zamiast statusu z kolekcji; gdy wycofany bieg ma status `completed`, pokazujemy oba znaczniki („Ukończony” + „Wycofany”), żeby nie ukrywać zaliczenia (DEC-008). Obecne dane: Bieg 7 Dolin ma `status: unplanned` + `retired: true`, więc pokazuje samo „Wycofany”.
- Termin: `plannedDate` (formatDate) ma pierwszeństwo, w przeciwnym razie `typicalMonth` z prefiksem „orientacyjnie:”. Dla ukończonych biegów termin to nadal plannedDate/typicalMonth; daty ukończenia są w sekcji „Wyniki”.
- Uwagi do dokumentacji dla Leada: dodać do `docs/ui.md` opis `RunCard` (props: `run`) oraz wzorzec „stan pusty wyników / powiązanych wpisów”; `docs/architecture.md`: strony `/biegi`, `/biegi/[id]` i helpery `src/lib/runs.ts`. Sugestia: `plannedDate` bez wyniku dla biegu `completed` nie jest wymagana schematem — jeśli bieg ukończony ma wyświetlać datę faktyczną na liście, można to rozszerzyć później (np. z pierwszego wyniku).
- Dane (`src/content`) niezmienione; do weryfikacji użyto danych tymczasowych, przywróconych `git checkout -- src/content`.

## Validation

### Tests

- `npm run lint`, `npm run format:check`, `npm run check` (0 errors/warnings/hints), `npm run build` (15 stron: lista + 11 podstron biegów + 404, styleguide, start) — bez błędów.
- Dane tymczasowe (przywrócone): SGS z wynikiem solo (Damian), Łemkowyna ŁUT 150 z wynikami obu autorów (jeden z `resultsUrl`), testowy wpis powiązany z ŁUT (obaj autorzy), Bieg 7 Dolin jako `completed` + `retired`, ZUK z `plannedDate` `2027-02-20T23:30:00Z`. Odczyt HTML z `dist/`: wyniki per osoba, link `rel="noopener"`, powiązany wpis (`/blog/testowy-wpis`, data, autorzy), oba znaczniki „Ukończony”+„Wycofany” z adnotacją, „Jeszcze bez wyniku”, „Brak wpisów o tym biegu.”, data 21 lutego 2027 (strefa Europe/Warsaw, UTC 23:30 -> następny dzień).
- Chrome headless (CDP, skrypt poza repozytorium): szerokości 320, 360 i 1280 px na `/biegi` i podstronach — brak poziomego przewijania (1280 px: scrollWidth 1265 = szerokość bez paska przewijania); zrzuty 360 i 1280 px obejrzone.
- Nie testowano czytników ekranu.

### Review

- Lead (2026-09-20): diff tylko w zakresie (dodatkowo uzasadniony `src/lib/runs.ts`); build (15 stron), lint, format:check i astro check uruchomione niezależnie, bez błędów. Zaakceptowane. Uwagi do dokumentacji (RunCard, stany puste, trasy `/biegi`) — Lead uzupełni po scaleniu TASK-005..007.

## Outcome

Complete this section before moving the task to `done`.

- Summary: Lista biegów `/biegi` (RunCard) i statyczne podstrony `/biegi/<id>` z wynikami per osoba, powiązanymi wpisami, stanami pustymi i adnotacją dla biegu wycofanego.
- Tests: lint, format:check, astro check, build bez błędów; weryfikacja na danych tymczasowych i w Chrome headless (320/360/1280 px) — patrz Validation.
- Important files: `src/pages/biegi/index.astro`, `src/pages/biegi/[id].astro`, `src/components/RunCard.astro`, `src/lib/runs.ts`.
- Commit: gałąź `agent/frontend/TASK-006-runs-pages` (skrót w historii gałęzi).
- Follow-up tasks: TASK-013 doda Biegowi 7 Dolin wynik i status `completed`; decyzja, czy na liście pokazywać faktyczną datę ukończenia zamiast terminu orientacyjnego.

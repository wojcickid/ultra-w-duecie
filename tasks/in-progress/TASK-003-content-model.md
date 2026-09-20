# TASK-003 — Model treści: kolekcje „biegi” i „wpisy”

## Status

in-progress

## Owner

frontend-agent

## Dependencies

- TASK-002
- Brak zablokowań po stronie użytkownika (DEC-007, DEC-008)

## Description

Zdefiniować kolekcje treści Astro z walidacją schematu (nazwy w kodzie po angielsku, DEC-005) i wprowadzić 10 biegów Korony jako dane początkowe (wszystkie ze statusem „planowany/bez planu”, bez danych o ukończeniu — historię dodaje TASK-013).

## Context

Kolekcje: `runs` (biegi), `posts` (wpisy), `authors` (autorzy).
Pola `runs`: nazwa, dystans (km), miejsce, orientacyjny termin, status (ukończony / planowany / bez planu), data planowana, notatki oraz lista wyników per osoba (osoba, data ukończenia, czas, link do wyników). Pola `posts`: tytuł, data, treść Markdown, zdjęcia, autor/autorzy, opcjonalne powiązanie z biegiem. Pola `authors`: identyfikator, nazwa wyświetlana. Lista biegów z regulaminu Korony 4.0.

## Acceptance criteria

- [x] Schematy walidują dane; niepoprawny plik powoduje czytelny błąd budowy.
- [x] Wyniki można zapisać osobno dla każdej z dwóch osób; wpis ma pole autora.
- [x] 10 biegów z regulaminu Korony 4.0 dodanych jako dane początkowe, plus Bieg 7 Dolin oznaczony jako wycofany (`retired`), bez danych o ukończeniu.
- [x] Autorzy początkowi: Damian i Grzegorz.
- [x] Przykładowy wpis testowy przechodzi walidację (do usunięcia przed publikacją).
- [x] Schemat jest udokumentowany w `docs/architecture.md`.

## Implementation notes

- Plik `src/content.config.ts` (Astro 7.3.3, Zod 4 z `astro/zod`, loader `glob` z `astro/loaders`, `reference` i `image` z `astro:content`). Dane: `src/content/authors/*.json`, `src/content/runs/*.json`, `src/content/posts/*.md`; id wpisu = nazwa pliku. Pełny opis pól: `docs/architecture.md`.
- Nowe zależności: brak.
- Reguły dodatkowe w `runs`: jeden wynik na autora w biegu; status `completed` wymaga co najmniej jednego wyniku. `time` w formacie H(H)(H):MM:SS. `order` (1-11) do sortowania; `typicalMonth` to tekst swobodny (np. „kwiecień/maj”, „Boże Ciało”).
- Dane początkowe: 10 biegów Korony 4.0 + Bieg 7 Dolin (`retired: true`, bez dystansu i miejsca), wszystkie `unplanned`, `results: []`. Nie wpisano miejsc (`location`) - brak w danych źródłowych. W `notes` każdego biegu adnotacja o weryfikacji z regulaminem.
- Wpis testowy: `src/content/posts/testowy-wpis.md` (TESTOWY, do usunięcia przed publikacją).
- `images[].src` używa `image()`: obrazy muszą leżeć w `src/` (np. `src/assets`), ścieżka względna od pliku wpisu; TASK-CMS musi ustawić media_folder zgodnie z tym (zweryfikowane tymczasowym obrazem, niecommitowanym).
- Ograniczenie Astro: nieistniejąca referencja (np. autor) daje tylko `[ERROR] Invalid content reference` w logu, ale build kończy się kodem 0 - do wychwycenia w kodzie stron (TASK-005..007) lub osobnym skryptem walidacji.
- Daty (`coerce.date`) są parsowane jako UTC; przy wyświetlaniu używać strefy UTC/Europe/Warsaw świadomie.

### Zademonstrowane błędy walidacji (pliki tymczasowo zepsute, przywrócone, niecommitowane)

- `status: "finished"` w zuk.json: `[InvalidContentEntryDataError] runs → zuk data does not match collection schema. status: Invalid option: expected one of "completed"|"planned"|"unplanned"` (build przerwany).
- Zły czas i zdublowany autor: `results.0.time: Czas musi mieć format HH:MM:SS (np. 12:34:56)` oraz `results.1.author: Autor "damian" ma więcej niż jeden wynik w tym biegu.`
- Pusty `alt` obrazu we wpisie: `images.0.alt: Too small: expected string to have >=1 characters`.
- Nieistniejący autor we wpisie: `[ERROR] [content] Invalid content reference: entry "testowy-wpis" in collection "posts" (field: authors[0]) references "nieistnieje" in collection "authors", but that entry does not exist.` (build nie przerwany, exit 0).

## Validation

### Tests

- `npm run build`, `npm run lint`, `npm run format:check`, `npm run check`: bez błędów (patrz wyniki w raporcie agenta).
- Tymczasowa strona weryfikacyjna (niecommitowana): 2 autorów (Damian, Grzegorz), 11 biegów (1 retired, 0 wyników), wpis testowy rozwiązuje autora damian.

### Review

- Not reviewed

## Outcome

Complete this section before moving the task to `done`.

- Summary: Zdefiniowano kolekcje `authors`, `runs`, `posts` z walidacją Zod, dane początkowe (2 autorów, 10 biegów Korony 4.0 + Bieg 7 Dolin jako `retired`, wszystkie `unplanned` bez wyników) i testowy wpis; zaktualizowano `docs/architecture.md`.
- Tests: build, lint, format:check, check - OK; testy negatywne walidacji opisane w Implementation notes.
- Important files: `src/content.config.ts`, `src/content/authors/`, `src/content/runs/`, `src/content/posts/testowy-wpis.md`, `docs/architecture.md`.
- Commit:
- Follow-up tasks:

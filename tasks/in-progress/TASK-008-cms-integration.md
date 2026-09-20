# TASK-008 — Integracja panelu CMS z kolekcjami treści

## Status

in-progress

## Owner

frontend-agent

## Dependencies

- TASK-001 (kod i instrukcja gotowe; weryfikacja na żywo po wdrożeniu)
- TASK-003

## Description

Skonfigurować panel `/admin` (wybrany w TASK-001) dla kolekcji `wpisy` i `biegi`, w tym wgrywanie zdjęć, polskie etykiety pól i logowanie przez GitHub.

## Context

FR-5 z `docs/requirements.md`. Panel nie ma linku w publicznej nawigacji. Sekrety wyłącznie w ustawieniach Cloudflare.

## Acceptance criteria

- [x] Wpisy zapisywane w układzie pakietu `src/content/posts/<slug>/index.md` z obrazami obok (ścieżki względne, zgodne z `image()` w schemacie `posts`; DEC-009).
- [x] Pole autorów we wpisie to relacja do kolekcji `authors` (zamiast tymczasowego `select` z TASK-001), a wyniki biegów wskazują autora tak samo.
- [ ] Zalogowany autor dodaje i edytuje wpis oraz zmienia status biegu przez panel.
- [ ] Zmiany zapisują się jako commity i po publikacji są widoczne na stronie.
- [x] Pola w panelu zgodne ze schematem z TASK-003, z polskimi etykietami, w tym wybór autora wpisu i wyniki per osoba.
- [x] Autor wpisu jest niezależny od konta GitHub, które publikuje.
- [ ] Niezalogowany użytkownik nie może zapisać zmian.

## Implementation notes

Stan: konfiguracja gotowa i sprawdzona lokalnie (tryb „Work with Local Repository” w headless Chrome). Kryteria wymagające logowania i zapisu na żywo (edycja przez zalogowanego autora, commity i publikacja, niezalogowany użytkownik) zostają otwarte dla Leada i właściciela po scaleniu i wdrożeniu.

### Badanie dokumentacji Sveltia CMS (wersja 0.217.0, przypięta w `public/admin/index.html`)

- Puste pola opcjonalne: domyślnie Sveltia zapisuje `""`, `null` lub `[]` zamiast pominąć pole (https://sveltiacms.app/en/docs/data-output). To psuje schemat Zod (`z.url().optional()`, `z.coerce.date().optional()` nie przyjmują `""`). Rozwiązanie: globalne `output: { omit_empty_optional_fields: true }` (działa też w polach zagnieżdżonych elementów listy; sprawdzone w teście: pusty `resultsUrl`, `plannedDate`, `location` znikają z pliku). Bez zmiany schematu.
- Slug: globalna opcja `slug: { encoding: ascii, clean_accents: true, maxlength: 60 }` (https://sveltiacms.app/en/docs/collections/entries/slugs). Sprawdzone: tytuł „Żółć: test po wdrożeniu — Łódź na Ślęży! …” daje `zolc-test-po-wdrozeniu-lodz-na-slezy-bardzo-dlugi-tytul-wpis` (60 znaków; ł/ó/ś/ę/ż poprawnie transliterowane).
- Relacja (https://sveltiacms.app/en/docs/fields/relation): `value_field: '{{slug}}'` daje nazwę pliku (`damian`, `sgs`), `display_fields` steruje etykietą; przy `create: false` w kolekcji docelowej przycisk „Dodaj” w relacji nie jest oferowany.
- Kolekcje: `create`/`delete: false` (https://sveltiacms.app/en/docs/collections/entries/operations), `summary` (wartość pola `select` pokazuje się jako etykieta, np. „Bez planu”), `sortable_fields` w składni rozszerzonej z `default` (kolejność biegów po `order`, wpisów po dacie malejąco), `view_filters` (status, wycofany).
- Format JSON: `format: json` (2 spacje wcięcia, LF, nowa linia na końcu, klucze w kolejności z konfiguracji). Kolejność pól w `runs` jest taka jak w istniejących plikach danych, więc pierwsze zapisy nie mieszają kolejności kluczy.
- Widgety: `number` z `value_type: float`/`int` zapisuje liczbę; `datetime` z `type: date` zapisuje `YYYY-MM-DD`; `boolean` zawsze zapisuje `true/false`; `string` z `pattern: [regex, komunikat]` i `type: url` waliduje w panelu; obraz z `choose_url: false` (bez zewnętrznych adresów, których `image()` nie przyjmie).
- Tryb lokalny (https://sveltiacms.app/en/docs/workflows/local): Chromium, File System Access API, wskazanie katalogu głównego z `.git`, brak operacji Git; opis w `docs/cms-setup.md`.

### Decyzje

- `retired` jest `required: false` z `default: false` (ma `.default(false)` w schemacie; pole zawsze zapisuje się jako `true/false`). `status` ma `default: unplanned`.
- Autorzy i biegi: `create: false`, `delete: false`; `identifier_field` (`displayName`, `name`) i `summary` czytelne.
- `date` wpisu: `widget: datetime, type: date` jak na produkcji, plus `default: '{{now}}'` (decyzja Leada po przeglądzie). Test: nowy wpis dostaje dzisiejszą datę w formacie `YYYY-MM-DD` (bez godziny i strefy), zapisany plik przechodzi walidację schematem (`z.coerce.date()`).
- Podpowiedź przy `retired` zgodna z DEC-008: bieg wycofany z listy Korony nadal liczy się do postępu, jeśli obaj autorzy go ukończyli (poprawiono błędne „nie liczy się do licznika”; w dokumentacji i notatkach nie było tego błędu).
- Reguł łączonych ze schematu (status „Ukończony” wymaga wyniku, jeden wynik na osobę) panel nie egzekwuje (Sveltia nie ma takich reguł); są w opisach pól, a wykrywa je budowa (`prebuild` i schemat Astro). Błędne dane z panelu mogą więc zatrzymać budowę do poprawki.

### Znane ograniczenia i uwagi

- Pierwszy zapis biegu przez panel usuwa z jego pliku pustą tablicę `"results": []` (omit_empty_optional_fields); Zod przywraca ją przez `default([])`, a `scripts/validate-content.mjs` pomija brak `results`. Skutek tylko w diffie danych.
- Stary płaski plik `posts/testowy-wpis.md` nie pasuje do ścieżki `{{slug}}/index`, więc panel go nie pokazuje (do usunięcia w TASK-010). Identyfikator wpisu w panelu to `<slug>/index`, w Astro `<slug>`; relacje z wpisami nie istnieją, więc nie ma to skutku.
- Polska etykieta „Tworzenie Wpis” (szablon Sveltia nie odmienia `label_singular`); kosmetyka, bez wpływu.
- Nie sprawdzono w panelu wgrywania zdjęć do listy `images` (wybór pliku przez okno systemowe); konfiguracja pola `src` jest bez zmian względem zweryfikowanej (poza `choose_url: false`).
- `npm run format:check` zgłasza plik `src/content/posts/test-po-wdrożeniu-na-stronę/index.md` (spacja na końcu wiersza w treści, wpis dodany przez panel przed tym zadaniem; poza zakresem, zmiany danych zabronione). Pozostałe pliki przechodzą.

## Validation

### Tests

- `npm run build`, `npm run lint`, `npm run check` (0 błędów, 0 ostrzeżeń): OK. `npm run format:check`: jedyne zgłoszenie to istniejący wpis testowy (patrz uwagi wyżej); `public/admin/config.yml` i dokumenty przechodzą.
- Skrypt kontrolny (jednorazowy, poza repozytorium): wczytuje `config.yml` (js-yaml) i rzeczywisty schemat z `src/content.config.ts` (kompilacja esbuild z podmianą importów `astro:*`, Zod z projektu). Sprawdza: identyczne nazwy pól i brak nadmiarowych po obu stronach, widget zgodny z typem Zod, wymagalność, `select` = enum, `int`/`float`, `min: 1` autorów, wzorzec czasu identyczny z regexem schematu, kolejność kolekcji. Wynik: OK; test mutacyjny (zmiana `float`->`int`, opcji `planned`, wymagalności `location`) wykrywa rozbieżności. Symulacje schematu: puste `resultsUrl`/`plannedDate` (`""`) są odrzucane, więc `omit_empty_optional_fields` jest konieczne; poprawne dane przyjęte.
- Test w przeglądarce (headless Chrome, CDP, `astro dev`, tryb „Work with Local Repository” z katalogiem OPFS podstawionym pod `showDirectoryPicker`): konfiguracja ładuje się bez błędów; menu Wpisy/Biegi/Autorzy (1/11/2 wpisów), polskie etykiety i opisy; walidacja czasu (`12:60:00` daje komunikat „Czas musi mieć format HH:MM:SS (np. 12:34:56).”), walidacja URL; zapis biegu z wynikiem daje JSON zgodny ze schematem (brak pustych pól, `completedDate` jako `YYYY-MM-DD`); nowy wpis z autorami i biegiem daje `index.md` z `authors: [...]`, `run: sgs` i slugiem ASCII; istniejący wpis testowy otwiera się z zaznaczonym autorem Damian. Pliki zapisane przez panel przechodzą walidację prawdziwym schematem. Procesy (Chrome, serwer Astro) zatrzymane po PID; brak zajętych portów.
- Nie testowano (wymaga kont): logowania GitHub, zapisu commitów, niezalogowanego użytkownika, wgrywania obrazu przez okno wyboru pliku.

### Review

- Not reviewed

## Outcome

Complete this section before moving the task to `done`.

- Summary:
- Tests:
- Important files:
- Commit:
- Follow-up tasks:

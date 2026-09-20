# TASK-014 — Walidacja referencji między kolekcjami w buildzie

## Status

done

## Owner

frontend-agent

## Dependencies

- TASK-003

## Description

Astro tylko loguje `[ERROR]` (kod wyjścia 0), gdy wpis odwołuje się do nieistniejącego autora lub biegu, więc build się nie przerywa. Dodać prostą walidację referencji (autor we wpisach i wynikach, bieg we wpisie), która przerywa build (`npm run build` i `npm run check`) z czytelnym komunikatem.

## Context

Wynik przeglądu TASK-003. Dotyczy kryterium „niepoprawny plik powoduje czytelny błąd budowy”. Rozwiązanie ma być minimalne (bez nowych zależności, jeśli to możliwe), np. mały skrypt uruchamiany przed buildem albo integracja Astro.

## Acceptance criteria

- [x] Odwołanie do nieistniejącego autora (we wpisie lub wyniku) przerywa build z czytelnym komunikatem.
- [x] Odwołanie do nieistniejącego biegu we wpisie przerywa build z czytelnym komunikatem.
- [x] Poprawne dane budują się bez zmian.
- [x] Działanie opisane w README lub docs/architecture.md.

## Implementation notes

Wybrane rozwiązanie: skrypt Node `scripts/validate-content.mjs` (bez nowych zależności), uruchamiany przez npm: `prebuild` (npm wywołuje go automatycznie przed `npm run build`, także w Cloudflare Pages) oraz `check` (`npm run validate:content && astro check`; `&&` działa w cmd i sh). Osobny skrypt `validate:content` do ręcznego uruchamiania.

Dlaczego skrypt, a nie integracja Astro: integracja (`astro:build:start`) nie obejmuje `astro check`, a skrypt jest prostszy, niezależny od wewnętrznych API Astro i uruchamialny osobno. Ograniczenie: bezpośrednie `astro build` (z pominięciem npm) nie uruchamia walidacji.

Działanie: identyfikatory autorów i biegów = nazwy plików JSON (tak jak w loaderze `glob`); sprawdzane są `posts[].authors[]`, `posts[].run` (frontmatter) i `runs[].results[].author`. Referencja może być tekstem lub obiektem `{ collection, id }`. Zbierane są wszystkie błędy naraz (plik, pole, brakujący id, lista dostępnych id), kod wyjścia 1. Niepoprawny JSON/YAML również daje czytelny błąd z nazwą pliku.

Frontmatter parsuje `js-yaml` — zależność Astro (już w `node_modules`, ta sama wersja co w lockfile), bez dopisywania do package.json; własny parser byłby kruchy wobec YAML zapisywanego przez CMS (cudzysłowy, listy inline). Ryzyko: to zależność tranzytywna; jeśli Astro ją usunie, skrypt zgłosi błąd importu — wtedy dodać `js-yaml` do devDependencies.

## Validation

### Tests

- `npm run build`, `npm run lint`, `npm run format:check`, `npm run check` na poprawnych danych (11 biegów, 2 autorów, 1 wpis testowy): bez błędów; walidacja: `Walidacja referencji: OK (autorzy: 2, biegi: 11).`
- Test negatywny (tymczasowo zepsute dane, potem `git checkout -- src/content`): autor `ktos` w `runs/zuk.json` wyniku, autor `nikt` i bieg `nie-ma-takiego-biegu` w `posts/testowy-wpis.md`. `npm run build` -> kod wyjścia 1, `npm run check` -> kod wyjścia 1 (astro check się nie uruchamia). Komunikat (przykład): `src/content/runs/zuk.json: pole "results[0].author" odwołuje się do nieistniejącego wpisu kolekcji "authors": "ktos" (dostępne: damian, grzegorz)`; analogicznie dla `authors[1]` i `run` we wpisie; na końcu `Znaleziono błędów: 3.`

### Review

- Lead (2026-09-20): diff w zakresie; build (17 stron), lint, format:check i astro check bez błędów; test negatywny powtórzony niezależnie po ostatniej poprawce agenta (kod wyjścia 1, czytelne komunikaty z plikiem, polem i dostępnymi id). Decyzja Leada: `js-yaml` dopisany jawnie do devDependencies (^4.3.2), zamiast polegać na zależności tranzytywnej. Zaakceptowane.

## Outcome

Complete this section before moving the task to `done`.

- Summary: dodano `scripts/validate-content.mjs` przerywający `npm run build` (prebuild) i `npm run check` przy nieistniejącym autorze (wpis, wynik biegu) lub biegu (wpis); opis w README i docs/architecture.md.
- Tests: build/lint/format:check/check OK; test negatywny: kod wyjścia 1 (szczegóły wyżej).
- Important files: scripts/validate-content.mjs, package.json (skrypty prebuild, validate:content, check), README.md, docs/architecture.md.
- Commit: 1a11548 + commit z jawną zależnością js-yaml (gałąź agent/frontend/TASK-014-reference-validation)
- Follow-up tasks:

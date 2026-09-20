# TASK-002 — Inicjalizacja projektu Astro + Tailwind

## Status

done

## Owner

frontend-agent

## Dependencies

- Brak

## Description

Utworzyć szkielet projektu: Astro (TypeScript, tryb statyczny), Tailwind CSS, formatowanie i lint, skrypty `dev`/`build`/`preview`, podstawowa struktura katalogów, `lang="pl"`.

## Context

Patrz `docs/architecture.md` i `docs/ui.md`. Nie dodawać zależności bez powodu. Zależności przypiąć w lockfile.

## Acceptance criteria

- [x] `npm run dev` i `npm run build` działają bez błędów.
- [x] Skonfigurowano formatowanie i lint (skrypty w `package.json`).
- [x] Strona startowa renderuje się z `lang="pl"`.
- [x] `.gitignore` obejmuje artefakty budowy; brak sekretów w repozytorium.
- [x] README zawiera krótką instrukcję uruchomienia lokalnego.
- [x] Adres strony (`site`) jest zdefiniowany w jednym miejscu konfiguracji, a linki wewnętrzne są względne (bez wpisanej domeny), aby zmiana domeny wymagała edycji jednego miejsca.

## Implementation notes

- Wersje (przypięte w package-lock.json): astro 7.3.3, tailwindcss 4.3.3 + @tailwindcss/vite 4.3.3 (integracja przez plugin Vite, zalecana dla Tailwind v4; `@astrojs/tailwind` jest przestarzała), eslint 10.11.0, typescript-eslint 8.70.0, eslint-plugin-astro 3.2.1, prettier 3.9.8, prettier-plugin-astro 1.0.1, prettier-plugin-tailwindcss 0.8.1, @astrojs/check 0.9.10, typescript 6.0.3.
- TypeScript przypięty do ~6.0.3 (nie 7.x), bo @astrojs/check i typescript-eslint deklarują wsparcie tylko dla TS < 6.1.
- Tryb statyczny (`output: 'static'`), bez adaptera. `site` (https://korona.damianwojcicki.com, adres MVP do potwierdzenia) tylko w `astro.config.mjs`; linki wewnętrzne względne (ikona: `/favicon.svg`).
- Struktura: `src/pages/index.astro`, `src/layouts/BaseLayout.astro` (`<html lang="pl">`, tytuł "Ultra w duecie"), `src/styles/global.css` (`@import 'tailwindcss'`), pusty `src/components/`, `public/favicon.svg`. Tokeny designu i właściwy layout to zakres TASK-004.
- Skrypty: `dev`, `build`, `preview`, `check` (astro check), `lint`, `lint:fix`, `format`, `format:check`.
- Prettier pomija `docs/`, `tasks/`, `.claude/`, `CLAUDE.md` i `README.md` (`.prettierignore`), aby nie przeformatowywać dokumentacji; `endOfLine: 'auto'` (Windows/CRLF).
- npm ostrzega, że postinstall esbuild nie jest objęty `allowScripts`; build działa bez tego skryptu, zmiany nie wprowadzono.
- `npm run dev` uruchamia serwer w tle (astro dev stop zatrzymuje go); po teście zatrzymany.

## Validation

### Tests

- `npm install`: OK, 0 podatności.
- `npm run build`: OK, 1 strona zbudowana (`dist/index.html`, `<html lang="pl">`).
- `npm run lint`: OK, bez błędów.
- `npm run format:check`: OK.
- `npm run check` (astro check): 0 błędów, 0 ostrzeżeń, 0 podpowiedzi.
- `npm run dev`: serwer wystartował na porcie 4321, GET / zwrócił 200 i `<html lang="pl">`; serwer zatrzymany (`astro dev stop`), brak działających procesów node.

### Review

- Lead (2026-09-20): diff obejmuje tylko oczekiwane pliki; build, lint i format:check uruchomione niezależnie, bez błędów; `<html lang="pl">` potwierdzone w dist/index.html. Zaakceptowane.

## Outcome

Complete this section before moving the task to `done`.

- Summary: szkielet Astro 7 (statyczny) + Tailwind 4 z ESLint, Prettier, astro check; jedna strona startowa z lang="pl"; README z instrukcją lokalną.
- Tests: patrz Validation → Tests (wszystko przeszło).
- Important files: `package.json`, `package-lock.json`, `astro.config.mjs`, `tsconfig.json`, `eslint.config.mjs`, `prettier.config.mjs`, `.prettierignore`, `.gitignore`, `src/layouts/BaseLayout.astro`, `src/pages/index.astro`, `src/styles/global.css`, `README.md`
- Commit: f484000, f6a1001, 23bfd45 (gałąź agent/frontend/TASK-002-astro-init)
- Follow-up tasks: TASK-003, TASK-004 (odblokowane); adres `site` do potwierdzenia w TASK-009; rozważyć `.gitattributes` (eol=lf) — na razie działa autocrlf.

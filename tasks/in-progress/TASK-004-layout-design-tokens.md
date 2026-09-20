# TASK-004 — Layout, nawigacja i tokeny designu

## Status

in-progress

## Owner

frontend-agent

## Dependencies

- TASK-002

## Description

Zbudować układ strony (nagłówek, nawigacja Start/Biegi/Blog, stopka), zdefiniować tokeny designu (kolory, typografia, odstępy) i bazowe komponenty (znacznik statusu, karta). Przedstawić użytkownikowi propozycję wyglądu do zatwierdzenia.

## Context

Patrz `docs/ui.md`: mobile-first, Tailwind, WCAG 2.1 AA, brak drugiego systemu designu. Wygląd wymaga akceptacji użytkownika (brak szablonu).

## Acceptance criteria

- [x] Layout działa od 360 px do desktopu.
- [x] Tokeny designu zdefiniowane w jednym miejscu i opisane w `docs/ui.md`.
- [x] Kontrast i fokus spełniają WCAG 2.1 AA.
- [x] Strona 404.
- [ ] Użytkownik zaakceptował kierunek wizualny.

## Implementation notes

**Kierunek wizualny (do akceptacji przez użytkownika).** Spokojny, „outdoorowy” styl: ciepłe, papierowe tło (`#f7f5ef`), leśna zieleń (`#2d5a3d`) jako kolor marki i rdzawy akcent (`#a4491b`). Nagłówki szeryfowe (systemowy stos Charter/Cambria), tekst bezszeryfowy (system-ui) — bez zewnętrznych czcionek. Białe karty z delikatnym obramowaniem i zaokrągleniem, zielony przycisk główny, znaczniki statusu w kształcie pigułki (tekst + ikona, kolor tylko wzmacnia). Podgląd: `/styleguide` (po `npm run dev`/`build`).

**Co zrobiono**
- Tokeny w jednym miejscu: blok `@theme` w `src/styles/global.css`. Domyślna paleta kolorów i promieni Tailwinda wyłączona (`--color-*: initial`, `--radius-*: initial`), więc kolory spoza listy nie są dostępne. Skala rozmiarów tekstu i odstępów: domyślna Tailwinda (udokumentowane, nienadpisywane). Opis tokenów, komponentów i kontrastów: `docs/ui.md`.
- `BaseLayout` rozszerzony (zachowane `lang="pl"`): link „Przejdź do treści”, `SiteHeader`, `<main id="main">`, `SiteFooter`, nowa właściwość `noindex`.
- Komponenty: `SiteHeader`, `SiteFooter`, `Icon` (jeden zestaw inline SVG, styl Lucide-podobny, ścieżki wpisane ręcznie), `StatusBadge` (4 statusy: tekst + ikona + wariant ramki), `Card` (opcjonalnie klikalna całość przez rozciągnięty link na tytule).
- Globalny fokus `:focus-visible` (obrys 3 px, `#0b5cad`, offset 2 px), `prefers-reduced-motion`, klasy `.link`, `.btn`, `.btn-primary`, `.btn-secondary`.
- `src/pages/404.astro` (z `noindex`), `src/pages/styleguide.astro` (z `noindex`), drobne dopasowanie `src/pages/index.astro`, kolory `public/favicon.svg` dopasowane do palety.

**Decyzje i odstępstwa**
- Menu na telefonie: zamiast „hamburgera” logo i trzy linki układają się w dwóch rzędach (bez JS). Trzy krótkie pozycje mieszczą się nawet przy 320 px, a ukrywanie ich pogorszyłoby użyteczność. Jeśli pozycji przybędzie, trzeba dodać zwijanie.
- Linki `/biegi` i `/blog` w nawigacji (oraz „Zobacz biegi” na 404) prowadzą na razie donikąd (404) — strony docelowe to osobne zadania (TASK-005–007).
- `/styleguide` to strona pomocnicza: **usunąć lub ukryć przed publikacją** (ma `noindex`, ale jest w buildzie i pod `/styleguide`).
- Motyw ciemny: nie wdrożono (`color-scheme: light`), poza zakresem MVP.
- Token `line-strong` (obramowania kontrolek formularzy, >= 3:1) jest zdefiniowany na zapas i na razie nieużywany w komponentach (widoczny tylko na próbniku palety).
- Bez nowych zależności.

**Weryfikacja responsywności.** Chrome headless (zainstalowany w systemie, sterowany przez CDP skryptem tymczasowym poza repozytorium; Playwright/Puppeteer nie dodane): emulacja szerokości 320, 360, 768, 1280 px na `/`, `/styleguide`, `/404.html` — brak poziomego przewijania (`scrollWidth` = szerokość okna, brak elementów wychodzących poza viewport). Zrzuty obejrzone dla 360 i 1280 px. Sprawdzono też fokus klawiaturą (Tab): widoczny link „Przejdź do treści” i obrys na linku nawigacji. Ograniczenie: testowano tylko Chromium; nie testowano czytników ekranu ani fizycznych urządzeń.

**Kontrast (WCAG 2.1, obliczony)** — pełna tabela w `docs/ui.md`. Główne pary: `ink` na `paper` 14,30:1; `ink-muted` na `paper` 6,85:1; `brand` na `paper` 7,29:1; biały na `brand` 7,95:1; `accent` na `paper` 5,43:1; statusy 7,41–8,49:1; fokus `#0b5cad` na `paper` 6,12:1 (wymagane 3:1).

## Validation

### Tests

- `npm run build` — OK (3 strony: `/`, `/404.html`, `/styleguide`).
- `npm run lint` — OK, bez błędów.
- `npm run format:check` — OK.
- `npm run check` (astro check) — 0 errors, 0 warnings, 0 hints.
- Ręczna weryfikacja w Chrome headless (szerokości 320/360/768/1280, fokus klawiaturą) — jak wyżej.

### Review

- Not reviewed

## Outcome

Complete this section before moving the task to `done`.

- Summary: Layout z nagłówkiem/nawigacją/stopką, tokeny designu w `@theme`, komponenty `StatusBadge`, `Card`, `Icon`, strona 404 i strona podglądu `/styleguide`; `docs/ui.md` zaktualizowany. Czeka na akceptację kierunku wizualnego przez użytkownika.
- Tests: build, lint, format:check, astro check — bez błędów; ręcznie Chrome headless 320–1280 px (bez poziomego przewijania) i fokus klawiaturą.
- Important files: `src/styles/global.css`, `src/layouts/BaseLayout.astro`, `src/components/*`, `src/pages/404.astro`, `src/pages/styleguide.astro`, `docs/ui.md`.
- Commit: patrz historia gałęzi `agent/frontend/TASK-004-layout-design-tokens`
- Follow-up tasks:

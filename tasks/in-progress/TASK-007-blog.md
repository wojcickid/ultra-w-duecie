# TASK-007 — Blog: lista wpisów, wpis, paginacja, RSS

## Status

in-progress

## Owner

frontend-agent

## Dependencies

- TASK-003
- TASK-004

## Description

Lista wpisów (od najnowszych, z paginacją), strona pojedynczego wpisu (Markdown, responsywne zdjęcia, powiązany bieg) oraz kanał RSS.

## Context

FR-4 z `docs/requirements.md`. Zdjęcia w repozytorium — zoptymalizować przez wbudowane narzędzia Astro.

## Acceptance criteria

- [x] Daty formatowane z jawną strefą czasową (Europe/Warsaw), bo daty w kolekcjach są parsowane jako UTC.
- [x] Lista wpisów posortowana malejąco po dacie, z paginacją.
- [x] Strona wpisu renderuje Markdown i zdjęcia z tekstem alternatywnym.
- [x] Lista i strona wpisu pokazują autora (jednego lub obu).
- [x] Kanał RSS generowany przy budowie.
- [x] Stan pusty (brak wpisów) obsłużony.
- [x] Zgodność z `docs/ui.md` (WCAG 2.1 AA: semantyczny HTML, hierarchia nagłówków, alt zdjęć, nawigacja klawiaturą).

## Implementation notes

**Pliki.** `src/lib/blog.ts` (sortowanie wpisów, nazwy autorów, opis z Markdown, adresy stron), `src/components/PostCard.astro`, `src/components/Prose.astro` (typografia treści Markdown), `src/pages/blog/index.astro`, `src/pages/blog/strona/[page].astro`, `src/pages/blog/[id].astro`, `src/pages/blog/_PostsPage.astro` (wspólny widok listy; przedrostek `_` wyklucza plik z routingu), `src/pages/rss.xml.ts`, jedna zmiana w `BaseLayout.astro` (`<link rel="alternate" type="application/rss+xml">`).

**Trasy i paginacja (decyzja).** `/blog` (strona 1) to `blog/index.astro`; strony 2+ to `/blog/strona/<n>` (`blog/strona/[page].astro` z wbudowanym `paginate()`, 10 wpisów na stronę, wynik odfiltrowany do stron > 1, więc `/blog/strona/1` nie istnieje); wpis to `/blog/<id>` (`blog/[id].astro`). Trasy nie kolidują (segment `strona/` ma więcej segmentów niż `[id]`). `index.astro` nie może użyć `paginate()` (brak parametru trasy), więc bierze pierwsze 10 wpisów ze wspólnego helpera. Ograniczenie: wpis o identyfikatorze `strona` dałby `/blog/strona` (nie koliduje z `/blog/strona/2`, ale warto unikać takiej nazwy pliku).

**Zachowanie.**
- Karta wpisu: `Card` (h2, cała karta klikalna) + data (`formatDate`, Europe/Warsaw; `<time datetime>` w UTC) + autorzy ("Damian i Grzegorz") + miniatura pierwszego zdjęcia (`astro:assets`, 320x180, 1x/2x, alt z danych).
- Strona wpisu: h1, data, "Autor:"/"Autorzy:", powiązany bieg (link `/biegi/<id>` z nazwą; niepoprawna referencja jest pomijana bez błędu), treść Markdown w `Prose`, galeria "Zdjęcia" (h2, `Image layout="constrained"`, width 800, lazy, srcset) i przycisk "Wróć do bloga".
- Title/description: strona wpisu ma title "<tytuł> — Ultra w duecie" i description z pierwszych ~160 znaków treści (`excerpt()`, bez składni Markdown); lista: "Blog — Ultra w duecie", od strony 2 "Blog — strona N z M — Ultra w duecie".
- Paginacja: `<nav aria-label="Paginacja wpisów">`, "Poprzednia strona" / "Następna strona" z `aria-label` zawierającym numer strony, `rel="prev|next"`, tekst "Strona N z M"; brak nawigacji przy jednej stronie.
- Stan pusty: "Wpisów jeszcze nie ma. Zajrzyj wkrótce." (bez paginacji, brak stron `/blog/strona/*`).
- Typografia Markdown: bez `@tailwindcss/typography` — komponent `Prose` ze stylami zakresowymi (`:global`) opartymi na tokenach z `global.css` (`--color-*`, `--radius-*`); nie ruszano `global.css`, więc brak ryzyka konfliktu z innymi zadaniami.

**RSS.** Nowa zależność: `@astrojs/rss@^4.0.19` (oficjalny pakiet Astro, jedyna dodana; wymagany przez zadanie — ręczne generowanie XML byłoby bardziej podatne na błędy). `/rss.xml` z `site` z `astro.config.mjs` (`context.site`, brak domeny w kodzie), tytuł "Ultra w duecie", opis po polsku, `<language>pl-pl</language>`, wpisy malejąco po dacie, autorzy w `<dc:creator>`. Adresy pozycji mają końcowy ukośnik (domyślne `trailingSlash` pakietu, zgodne z `build.format: directory`).

**Uwagi do dokumentacji (dla Leada).**
- `docs/architecture.md` (Routing): dodać trasy `/blog`, `/blog/strona/<n>`, `/blog/<id>`, `/rss.xml`; zależność `@astrojs/rss`; helper `src/lib/blog.ts`.
- `docs/ui.md` (Komponenty): dodać `PostCard` (`post`), `Prose` (kontener typografii Markdown; slot) oraz link RSS w `BaseLayout`.
- Bloki kodu w Markdown renderuje Shiki z ciemnym tłem i kolorami inline (motyw domyślny Astro, poza tokenami); w MVP zostawione, jeśli wpisy nie będą zawierać kodu — do decyzji, czy wyłączyć `markdown.syntaxHighlight` w `astro.config.mjs`.
- Jeśli opis wpisu (meta description) ma być własny, potrzebne pole `description` w schemacie `posts` (obecnie opis generowany z treści).

## Validation

### Tests

- `npm run build`, `npm run lint`, `npm run format:check`, `npm run check` (0 errors, 0 warnings) — bez błędów na końcowym stanie repozytorium (tylko wpis testowy).
- Dane tymczasowe (usunięte): 14 wpisów + wpis z dwoma autorami, `run: sgs`, dwoma zdjęciami (PNG w `src/assets`, ścieżka względna od pliku wpisu) obok wpisu testowego = 16 wpisów. Sprawdzone w `dist/`: 2 strony listy (10 + 6 wpisów), `/blog/strona/2` z linkiem "Poprzednia strona" do `/blog`, sortowanie malejąco po dacie, daty w formacie polskim, autor/autorzy, link do biegu, srcset/lazy/alt zdjęć, miniatura na liście, `/rss.xml` (16 pozycji malejąco, `site` z konfiguracji, escapowanie znaków), `<link rel="alternate">` w `<head>`.
- Stan pusty: po tymczasowym przeniesieniu wpisów poza `src/content/posts` — `/blog` pokazuje komunikat, brak `/blog/strona/*`, RSS z pustą listą pozycji (glob-loader ostrzega tylko o braku plików).
- Chrome headless (CDP, skrypt poza repozytorium, bez nowych zależności): szerokości 360 i 1280 px na `/blog`, `/blog/strona/2`, wpisie z obrazem i wpisie testowym — brak poziomego przewijania; zrzuty obejrzone (układ karty, miniatura, treść Markdown, galeria, przyciski paginacji). Nie testowano czytników ekranu ani ręcznie pełnej nawigacji Tab (fokus kart i przycisków dziedziczy globalne `:focus-visible` i wzorzec `Card` z TASK-004).

### Review

- Not reviewed

## Outcome

Complete this section before moving the task to `done`.

- Summary: Lista wpisów z paginacją (10/stronę, `/blog` i `/blog/strona/<n>`), strona wpisu (Markdown, galeria, powiązany bieg), kanał RSS (`/rss.xml`) i link RSS w `<head>`; stan pusty obsłużony.
- Tests: build, lint, format:check, check bez błędów; weryfikacja na danych tymczasowych (paginacja, obraz, dwóch autorów, bieg, stan pusty) i Chrome headless 360/1280 px — szczegóły w Validation.
- Important files: `src/pages/blog/*`, `src/pages/rss.xml.ts`, `src/components/PostCard.astro`, `src/components/Prose.astro`, `src/lib/blog.ts`, `src/layouts/BaseLayout.astro`, `package.json`.
- Commit:
- Follow-up tasks:

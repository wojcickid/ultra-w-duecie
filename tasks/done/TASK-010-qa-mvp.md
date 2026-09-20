# TASK-010 — QA MVP: przepływy, dostępność, wydajność

## Status

done

## Owner

qa-agent

## Dependencies

- TASK-005
- TASK-006
- TASK-007
- TASK-008

## Description

Zweryfikować MVP: testy budowy i linków, responsywność (telefon/desktop), dostępność (WCAG 2.1 AA), wydajność (Lighthouse) oraz przepływ end-to-end: zalogowanie, dodanie wpisu, zmiana statusu biegu, publikacja.

## Context

Kryterium sukcesu MVP w `docs/requirements.md`. QA nie zmienia wymagań; wady zgłasza jako zadania.

## Acceptance criteria

- [x] Strona pomocnicza `/styleguide` (TASK-004) i testowy wpis (`posts/testowy-wpis.md`, TASK-003) usunięte lub niedostępne w buildzie produkcyjnym (usunięte w gałęzi; produkcja nadal je serwuje do czasu wdrożenia gałęzi, patrz D-02).
- [x] Budowa bez błędów i bez uszkodzonych linków wewnętrznych.
- [x] Sprawdzono szerokości od 360 px do desktopu (320, 360, 768, 1280 px).
- [x] Brak krytycznych problemów dostępności; wyniki udokumentowane (axe: 0 naruszeń).
- [x] Wynik Lighthouse udokumentowany (cel: wysoki wynik wydajności i dostępności): 100/100/100/100.
- [x] Przepływ dodania wpisu i zmiany statusu przez panel działa end-to-end: potwierdzony przez właściciela na produkcji (wpis z 2 zdjęciami, zmiany biegów: status, wyniki, DNF/DNS, odmowa dla obcego konta; commity `6177620`, `2526268`). Nie sprawdzono przycisku Revert na GitHubie ani Web Analytics (poza kryteriami).
- [x] Raport wad z priorytetami zapisany w zadaniu (skrót poniżej, pełny raport: `docs/qa-report-mvp.md`).

## Implementation notes

Pełny raport: `docs/qa-report-mvp.md` (2026-09-20). **Ocena: gotowe z uwagami.** Brak wad P0.

Zrobione w kodzie (Część 1, commit „TASK-010: usunięcie strony /styleguide i wpisu testowego…”): usunięto `src/pages/styleguide.astro` i `src/content/posts/testowy-wpis.md`, zaktualizowano odwołania w `docs/architecture.md`, `docs/ui.md`, `docs/decisions.md`, `docs/project-state.md` i komentarz w `BaseLayout.astro` (zadania w `tasks/done` i `tasks/review` pozostawiono jako historię).

Kluczowe liczby: 0 martwych linków wewnętrznych (34 cele), axe 0 naruszeń na 8 stronach × 2 szerokości, Lighthouse produkcja (mobile i desktop, 16 przebiegów) 100/100/100/100, LCP 1,2 s najwyżej, wpis z 2 zdjęciami 207 KiB (WebP `srcset`), 30 przypadków domenowych zgodnych z DEC-007/008/010/011, brak sekretów w drzewie i historii (90 commitów), `npm audit --omit=dev`: 0 podatności.

Wady (szczegóły, kroki, miejsce w kodzie i propozycje w raporcie):

- P1 D-01: produkcja nie przekierowuje HTTP na HTTPS i nie ma HSTS (`http://…/admin` zwraca 200); włączyć w Cloudflare (Always Use HTTPS, potem HSTS).
- P1 (warunek wdrożeniowy) D-02: produkcja nadal serwuje `/styleguide` i wpis testowy do czasu scalenia i wdrożenia tej gałęzi.
- P2 D-03: ukończone biegi na `/biegi` i `/biegi/<id>` mają „Termin: orientacyjnie: <miesiąc>” zamiast faktycznej daty (`getRunFacts` w `src/lib/runs.ts`).
- P2 D-04: RSS ma adresy i `guid` z ukośnikiem (307 na produkcji); poprawka: `trailingSlash: false` w `src/pages/rss.xml.ts`.
- P2 D-05: długi URL bez spacji w treści wpisu daje poziome przewijanie na 320/360 px (`overflow-wrap: anywhere` w `Prose.astro`).
- P2 D-06: `/_astro/*` bez długiego cache (`Cache-Control: max-age=0, must-revalidate`); dodać regułę w `public/_headers`.
- P3: nagłówki bezpieczeństwa i CSP dla stron publicznych (propozycja w raporcie), canonical/OG/sitemap/`robots.txt`, `/404` zwraca 200, pierwsze zdjęcie wpisu `lazy` (LCP), niespójne „Damian, Grzegorz” vs „Damian i Grzegorz”, sztywne „od 2026 r.” dla biegów wycofanych, stany puste `/biegi`, powiększony tekst 150–200% na telefonie, cele dotykowe 18–21 px, status „Bez planu” przy biegach z wynikami DNF/DNS/solo (pytanie produktowe), emoji w alt, angielskie komunikaty błędów budowy, brak testów po buildzie w repozytorium.

Pytania do Leada: patrz sekcja 12 raportu.

## Validation

### Tests

- `npm run build` (16 stron), `npm run lint`, `npm run format:check`, `npm run check` (0 errors, 0 warnings, 0 hints): bez błędów po Części 1.
- Linki: skrypt poza repo, 34 cele wewnętrzne sprawdzone na `wrangler dev --local` (0 błędów). axe-core: 0 naruszeń. Lighthouse (produkcja, 2 przebiegi × 4 strony × mobile/desktop): 100 we wszystkich kategoriach.
- Responsywność: Chrome headless CDP, 8 stron × 320/360/768/1280 px: brak poziomego przewijania.
- Reguły domenowe: 30 przypadków na danych tymczasowych, przywrócone `git checkout -- src/content` (`git status` czysty).
- Produkcja: tylko GET/HEAD. Skrypty pomocnicze poza repozytorium; zatrzymano własne procesy po PID (wrangler dev, Chrome), porty 8787/931x wolne.

### Review

- Lead (2026-09-20): zakres zmian zweryfikowany (usunięcia styleguide i wpisu testowego, dokumentacja, raport; bez zmian w danych i logice); po scaleniu build (16 stron), lint, format:check, astro check bez błędów; brak procesów po testach agenta. Wady D-03..D-06 i część P3 przejęte w TASK-019; D-01 (HTTPS) i D-02 (wdrożenie) – działania wdrożeniowe. Zaakceptowane.

## Outcome

Complete this section before moving the task to `done`.

- Summary:
- Tests:
- Important files:
- Commit:
- Follow-up tasks:

# TASK-019 — Poprawki z raportu QA (D-03…D-06 i wybrane P3)

## Status

done

## Owner

frontend-agent

## Dependencies

- TASK-010 (raport QA: docs/qa-report-mvp.md)

## Description

Naprawić wady zgłoszone w raporcie QA, które warto poprawić przed oficjalnym startem:

- **D-03:** ukończone biegi na `/biegi` i `/biegi/<id>` pokazują „orientacyjnie: <miesiąc>” zamiast faktycznej daty ukończenia (strona główna pokazuje datę poprawnie).
- **D-04:** adresy i `guid` w RSS mają ukośnik na końcu (307 na produkcji).
- **D-05:** długi adres URL w treści wpisu powoduje poziome przewijanie na 320/360 px.
- **D-06:** `/_astro/*` ma `Cache-Control: max-age=0, must-revalidate`; ustawić długie cache (zasoby z hashem); dodać minimalne nagłówki bezpieczeństwa dla stron publicznych (D-08) bez naruszenia `/admin`.
- **P3 (tekst):** ujednolicić zapis autorów („Damian i Grzegorz” zamiast „Damian, Grzegorz”); usunąć sztywne „od 2026 r.” przy biegach wycofanych (nieprecyzyjne: edycja 2026 Biegu 7 Dolin została odwołana, powrót zapowiedziany na 2027).

## Context

Szczegóły, kroki odtworzenia i propozycje napraw: `docs/qa-report-mvp.md` (sekcja 11). Poza zakresem (decyzje właściciela/Leada): status „Bez planu” przy biegach z wynikami solo/DNF/DNS, canonical/OG/sitemapa, HSTS i przekierowanie HTTP→HTTPS (ustawienia Cloudflare), emoji w `alt`.

## Acceptance criteria

- [x] D-03: dla biegu z wynikami strona listy i strona biegu pokazują datę faktyczną (spójnie z osią czasu na stronie głównej, wspólny helper), a dla biegów bez wyników — jak dotąd (data planowana lub orientacyjny termin).
- [x] D-04: adresy i `guid` w RSS bez końcowego ukośnika; RSS nadal poprawny.
- [x] D-05: brak poziomego przewijania przy długim URL w treści wpisu (320/360 px).
- [x] D-06: `/_astro/*` z `Cache-Control: public, max-age=31536000, immutable`; nagłówki `X-Content-Type-Options: nosniff`, `Referrer-Policy` i `Permissions-Policy` dla stron publicznych; `/admin` nadal działa i zachowuje własne nagłówki (test lokalny `wrangler dev --local`, sprawdzenie w headless Chrome, że Sveltia się ładuje).
- [x] P3: spójny zapis autorów; brak sztywnego „od 2026 r.”.
- [x] `npm run build`, `lint`, `format:check`, `check` bez błędów; brak regresji (axe: 0 naruszeń na kluczowych stronach, brak poziomego przewijania).

## Implementation notes

- **D-03:** `getRunTerm` w `src/lib/runs.ts` (jedno źródło prawdy; `getRunFacts` i oś czasu na `/` korzystają z niego, `RunCard` i `/biegi/<id>` przez `getRunFacts`). Pierwszeństwo: najwcześniejsza data z wyników > `plannedDate` > `typicalMonth` („orientacyjnie: …”). Etykieta: „Ukończono” (wszyscy z datą wyniku ukończyli, ten sam dzień w Europe/Warsaw), „Podejście” (ten sam dzień, ale co najmniej jeden DNF/DNS, np. SGS: Damian ukończył, Grzegorz DNS), „Pierwsze podejście” (wyniki z różnych dni, DEC-010: pokazujemy najwcześniejszą datę, daty osób są na stronie biegu w kartach wyników). Bez wyników: „Termin”. Timeline dostał pole `termLabel` (etykieta w `sr-only`); wizualnie oś czasu bez zmian, poza tym, że przy samym miesiącu jest teraz „orientacyjnie: <miesiąc>” (spójnie z listą).
- **D-04:** `trailingSlash: false` w `rss()`; `<link>` i `<guid>` bez ukośnika. Link kanału to `https://korona.damianwojcicki.com` (bez `/`, efekt tej samej opcji; równoważny adres strony głównej).
- **D-05:** `overflow-wrap: anywhere` i `min-width: 0` na `.prose-content`. Pomiar na tymczasowym wpisie (długi goły URL, długi tekst linku, blok kodu): 360 px scrollWidth 360 z poprawką, 1462 bez.
- **D-06/D-08 (nagłówki):** `public/_headers`: `/*` (nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy camera/microphone/geolocation/payment/usb), `/_astro/*` (cache 1 rok, immutable), `/admin` i `/admin/*` (własne). Scalanie w `wrangler dev --local`: reguły się łączą, a nagłówki o tej samej nazwie z dwóch reguł wychodzą jako DWIE osobne linie (np. `referrer-policy: strict-origin-when-cross-origin` i `referrer-policy: same-origin`). Rozwiązanie: w blokach `/admin` zapis `! Referrer-Policy` (odpięcie wartości ogólnej) przed własną wartością; wynik: jedna linia `referrer-policy: same-origin`. `X-Robots-Tag` i `X-Frame-Options` nie kolidują (ogólna reguła ich nie ustawia). `nosniff` i `Permissions-Policy` z `/*` obejmują też `/admin` (celowo, bez konfliktu). Odpowiedzi Workera (`/api/*`) nie przechodzą przez `_headers`. Zachowanie Cloudflare na produkcji może się różnić od lokalnego `wrangler dev`: do potwierdzenia po wdrożeniu (`curl -sI` na `/`, `/admin`, `/_astro/...`).
- **P3 tekst:** `joinNames` w `src/pages/index.astro` i `src/pages/biegi/[id].astro` („Damian i Grzegorz”); baner biegu wycofanego: „Bieg wycofany z listy stałych biegów Korony.” (bez „od 2026 r.”). Zostało poza zakresem plików agenta: `docs/authors-guide.md` (wiersz o biegu wycofanym: „nieorganizowany od 2026 r.”) oraz `notes` w danych (już poprawne w `src/content`).
- Dokumentacja: `docs/ui.md`, `docs/architecture.md`, nowa sekcja 13 „Status napraw (TASK-019)” w `docs/qa-report-mvp.md`.

## Validation

### Tests

- `npm run build`, `lint`, `format:check`, `check`: bez błędów i ostrzeżeń.
- D-03 na danych tymczasowych (przywróconych `git checkout -- src/content`): ukończony wspólnie (Bieg Rzeźnika: „Ukończono: 31 maja 2024”), różne daty (7 Dolin z datą Grzegorza +1 dzień: „Pierwsze podejście: 7 września 2024”), solo (jeden wynik finished: „Ukończono”), DNF/DNS (SGS, Ultra Granią Tatr: „Podejście: …”), bez wyników z plannedDate (Bison: „Termin: 3 października 2026”), bez wyników z typicalMonth („Termin: orientacyjnie: …”).
- RSS: `<link>`, `<guid>` wpisu bez końcowego ukośnika.
- Nagłówki (`wrangler dev --local`): `/`, `/biegi`, `/blog`, `/_astro/*.css`, `/rss.xml`, `/nie-ma` (404) z nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy; `/_astro/*` z `public, max-age=31536000, immutable`; `/admin`, `/admin/config.yml` z `same-origin` (jedna linia), `X-Frame-Options: DENY`, `X-Robots-Tag: noindex, nofollow`; `/api/nieistnieje` 404.
- Headless Chrome (CDP): `/admin` ładuje Sveltia („Sveltia CMS”, ekran logowania), bez błędów w konsoli i bez nieudanych żądań (bez logowania); wpis publiczny z obrazami (naturalWidth > 0), brak błędów.
- Poziome przewijanie: 320/360/768/1280 na `/`, `/biegi`, `/biegi/bieg-rzeznika`, `/biegi/sgs`, `/blog`, `/blog/piwniczna-pierwsza-setka`, tymczasowy wpis z długim URL: brak. axe-core (poza repo, 360 i 1280, tagi wcag2a/aa, 21a/aa, best-practice): 0 naruszeń na tych stronach.

### Review

- Lead (2026-09-20): zakres zweryfikowany (bez zmian w src/content, worker, wrangler); przejrzane: public/_headers (odpięcie Referrer-Policy dla /admin), getRunTerm; procesy agenta zatrzymane po PID, porty wolne. Zachowanie nagłówków na produkcji do potwierdzenia po wdrożeniu (curl -I). Zaakceptowane.

## Outcome

Complete this section before moving the task to `done`.

- Summary: naprawione D-03 (helper `getRunTerm`), D-04 (RSS bez ukośnika), D-05 (zawijanie długich URL-i), D-06 i D-08 (nagłówki, `/admin` bez konfliktu), P3 (zapis autorów, brak „od 2026 r.”); dokumentacja i sekcja 13 raportu QA zaktualizowane.
- Tests: patrz Validation → Tests (build, lint, format:check, check, nagłówki lokalnie, Chrome, axe, brak poziomego przewijania).
- Important files: `src/lib/runs.ts`, `src/components/Timeline.astro`, `src/components/Prose.astro`, `src/pages/index.astro`, `src/pages/biegi/[id].astro`, `src/pages/rss.xml.ts`, `public/_headers`, `docs/ui.md`, `docs/architecture.md`, `docs/qa-report-mvp.md`.
- Commit: gałąź `agent/frontend/TASK-019-qa-fixes` (4 commity: D-03; RSS i Prose; nagłówki; tekst i dokumentacja).
- Follow-up tasks: po wdrożeniu potwierdzić na produkcji nagłówki i adresy RSS (GET/HEAD); `docs/authors-guide.md` zawiera „nieorganizowany od 2026 r.” (do korekty przez Lead).

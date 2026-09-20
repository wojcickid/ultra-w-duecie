# TASK-019 — Poprawki z raportu QA (D-03…D-06 i wybrane P3)

## Status

in-progress

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

- [ ] D-03: dla biegu z wynikami strona listy i strona biegu pokazują datę faktyczną (spójnie z osią czasu na stronie głównej, wspólny helper), a dla biegów bez wyników — jak dotąd (data planowana lub orientacyjny termin).
- [ ] D-04: adresy i `guid` w RSS bez końcowego ukośnika; RSS nadal poprawny.
- [ ] D-05: brak poziomego przewijania przy długim URL w treści wpisu (320/360 px).
- [ ] D-06: `/_astro/*` z `Cache-Control: public, max-age=31536000, immutable`; nagłówki `X-Content-Type-Options: nosniff`, `Referrer-Policy` i `Permissions-Policy` dla stron publicznych; `/admin` nadal działa i zachowuje własne nagłówki (test lokalny `wrangler dev --local`, sprawdzenie w headless Chrome, że Sveltia się ładuje).
- [ ] P3: spójny zapis autorów; brak sztywnego „od 2026 r.”.
- [ ] `npm run build`, `lint`, `format:check`, `check` bez błędów; brak regresji (axe: 0 naruszeń na kluczowych stronach, brak poziomego przewijania).

## Implementation notes

Optional notes added during implementation.

## Validation

### Tests

- Not run

### Review

- Not reviewed

## Outcome

Complete this section before moving the task to `done`.

- Summary:
- Tests:
- Important files:
- Commit:
- Follow-up tasks:

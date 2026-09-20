# Stan projektu — Ultra w duecie

Punkt odzyskiwania stanu dla długotrwałej pracy agentów.

## Aktualny kamień milowy

M2 — Strona działa publicznie na https://korona.damianwojcicki.com (Worker + static assets, Cloudflare); panel /admin działa, wpis testowy dodany przez panel. Dalej: pełna konfiguracja panelu (TASK-008), QA i sprzątanie przed oficjalnym startem.

## Aktualny status

- Zamknięte i scalone do `main`: TASK-002 (szkielet Astro 7 + Tailwind 4), TASK-003 (kolekcje `authors`/`runs`/`posts`), TASK-004 (layout, tokeny, komponenty; paleta tymczasowa, TASK-015), TASK-005 (strona główna), TASK-006 (biegi), TASK-007 (blog + RSS), TASK-014 (walidacja referencji).
- TASK-001 (panel Sveltia CMS + logowanie OAuth GitHub, DEC-009) i TASK-016 (przeniesienie logiki OAuth z Pages Functions do Workera ze static assets: `wrangler.jsonc`, `worker/`) scalone; instrukcja `docs/cms-setup.md`; weryfikacja na żywo po wdrożeniu.
- Zdalne repo (publiczne): `git@github.com:wojcickid/ultra-w-duecie.git`. Push tylko na polecenie użytkownika.
- Wspólny kod: `src/lib/` (`format.ts`, `progress.ts`, `runs.ts`, `blog.ts`).
- Strony: `/`, `/biegi`, `/biegi/<id>`, `/blog`, `/blog/strona/<n>`, `/blog/<id>`, `/rss.xml`, `/404`. Strona pomocnicza `/styleguide` usunięta w TASK-010 (podgląd wariantów komponentów: historia Git).

## Aktywne zadania

- TASK-001, TASK-008, TASK-017 czekają na potwierdzenie przez właściciela na produkcji (test panelu: zapis wpisu ze zdjęciem, wyniki biegu, outcome DNF/DNS, odmowa zapisu bez uprawnień).

## Ostatnio ukończone

- TASK-002, TASK-003, TASK-004, TASK-005, TASK-006, TASK-007, TASK-014, TASK-016

## Zablokowane

- Brak. TASK-008 czeka na weryfikację TASK-001 na żywo (wdrożenie na Cloudflare wykonuje właściciel wg `docs/cms-setup.md`).

## Ważne decyzje

- Patrz `docs/decisions.md` (DEC-001…DEC-011): m.in. DEC-010 (ukończony wspólnie = obaj finished z tą samą datą), DEC-011 (wynik osoby: outcome finished/dnf/dns).
- Język: o obu autorach piszemy „obaj”, „obu”, „dwóch” (nie „oboje”, „dwoje”).
- Licznik postępu: tylko biegi ukończone wspólnie (DEC-007); Bieg 7 Dolin jako wycofany (DEC-008).
- Zewnętrzne kroki (Cloudflare, GitHub OAuth) odłożone do TASK-001/008/009, gdy będzie co wdrażać.
- Zasada dla agentów: nie zabijać procesów po nazwie obrazu (`taskkill /IM chrome.exe` / `node.exe`) — tylko własne procesy po PID. Uwaga: zatrzymanie zadania w tle nie zamyka procesów potomnych (np. `workerd`); po testach sprawdzić porty i procesy.

## Do zrobienia po stronie użytkownika

- Przeczytać instrukcję dla autorów `docs/authors-guide.md` (TASK-011) i wykonać w praktyce jej kroki: logowanie, wpis ze zdjęciem, zmiana statusu i wyniku biegu, cofnięcie zmiany.
- Wybrać nazwę subdomeny (propozycja: `korona.damianwojcicki.com`).
- Wdrożenie w Cloudflare jako Worker ze static assets (nie Pages) wg `docs/cms-setup.md`: kreator Workera (Project name `ultra-w-duecie`, Build `npm run build`, Deploy `npx wrangler deploy`, Non-production `npx wrangler versions upload`, Root `/`), Custom domain `korona.damianwojcicki.com`, aplikacja OAuth w GitHubie (callback `https://korona.damianwojcicki.com/api/callback`), dwa Secrets `GITHUB_CLIENT_ID` i `GITHUB_CLIENT_SECRET` w Workerze (Settings → Variables and Secrets) po pierwszym wdrożeniu oraz Web Analytics dla domeny (bez wpisywania czegokolwiek w repozytorium).
- Dostarczyć daty, czasy i linki do wyników ukończonych biegów (przed TASK-013).
- Ewentualnie podać lokalizacje biegów (pole `location` jest puste).
- Opcjonalnie: wskazówki co do palety kolorów (TASK-015).

## Sprzątanie przed publikacją (TASK-010)

- Wykonane w TASK-010: usunięto stronę pomocniczą `/styleguide` i wpis testowy `src/content/posts/testowy-wpis.md`.

## Ostatnia walidacja

- Po scaleniu TASK-005/006/007: build (17 stron), lint, format:check i astro check przechodzą na `main`.

## Następna zalecana akcja

1. Push `main` na GitHub (na polecenie użytkownika).
2. TASK-014 (walidacja referencji), TASK-001 → TASK-008 (panel CMS), TASK-009 (wdrożenie na Cloudflare), TASK-010 (QA), TASK-011 (instrukcja dla autorów).

> Aktualizuj ten plik przed zakończeniem większej sesji pracy lub po istotnej zmianie stanu projektu.

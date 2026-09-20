# Stan projektu — Ultra w duecie

Punkt odzyskiwania stanu dla długotrwałej pracy agentów.

## Aktualny kamień milowy

M3 — MVP działa publicznie na https://korona.damianwojcicki.com (Worker + static assets, Cloudflare), panel `/admin` z logowaniem GitHub działa i przetestowano go na produkcji (wpis ze zdjęciami, wyniki biegów z DNF/DNS, odmowa dla obcego konta). Raport QA: gotowe z uwagami (`docs/qa-report-mvp.md`). Zostały drobne prace właściciela (Cloudflare) i zadania opcjonalne.

## Aktualny status

- Zamknięte i scalone do `main`: TASK-001…008, 010, 011 (do `review`, patrz niżej), 014, 016…019.
- Stan produkcji (zweryfikowany 2026-09-20): strony `/`, `/biegi`, `/biegi/<id>`, `/blog`, `/blog/<id>`, `/rss.xml`, `/404`; `/styleguide` i wpis testowy usunięte (404); nagłówki bezpieczeństwa i długi cache `/_astro/*` działają; RSS bez końcowego ukośnika.
- Dane (`src/content`) edytuje właściciel przez panel na produkcji; agenci ich nie zmieniają poza uzgodnionymi zadaniami (np. TASK-018). Przed pracą na danych zawsze `git pull`.
- Zdalne repo (publiczne): `git@github.com:wojcickid/ultra-w-duecie.git`. Push tylko na polecenie użytkownika.
- Wspólny kod: `src/lib/` (`format.ts`, `progress.ts`, `runs.ts`, `blog.ts`).
- Model wyniku osoby: `outcome` = finished/dnf/dns (DEC-011); „wspólnie” = obaj finished z tą samą datą (DEC-010).

## Aktywne zadania

- Brak aktywnych zadań agentów.
- TASK-011 (instrukcja `docs/authors-guide.md`) w `review`: do potwierdzenia w praktyce przycisk „Revert” na GitHubie i działanie „Delete entry” w panelu.

## Zablokowane

- Brak.

## Ważne decyzje

- Patrz `docs/decisions.md` (DEC-001…DEC-011).
- Język: o obu autorach piszemy „obaj”, „obu”, „dwóch” (nie „oboje”, „dwoje”).
- Bieg 7 Dolin: wycofany z listy stałych biegów, ale wg regulaminu Korony 4.0 ukończenie do edycji 2025 włącznie się zalicza; wolny slot nie jest przypisany (pytanie do redakcji Kingrunera odłożone).
- Zasada dla agentów: nie zabijać procesów po nazwie obrazu (`taskkill /IM chrome.exe` / `node.exe`) — tylko własne procesy po PID. Zatrzymanie zadania w tle nie zamyka procesów potomnych (np. `workerd`); po testach sprawdzić porty i procesy.

## Do zrobienia po stronie użytkownika

- Cloudflare: Redirect Rule HTTP→HTTPS tylko dla hosta `korona.damianwojcicki.com` (nie włączać „Always Use HTTPS” dla całej strefy; wada D-01), Web Analytics (na produkcji nie ma jeszcze skryptu `static.cloudflareinsights.com`), ewentualnie wyłączenie adresu `workers.dev` (TASK-009).
- Zdecydować: status „Bez planu” przy biegach z wynikami solo/DNF/DNS; czy dodać canonical/Open Graph/sitemapę po starcie; poprawny czas Damiana w Biegu 7 Dolin (dane 18:43:38 vs tekst wpisu 18:43:25).
- Sprawdzić w praktyce: przycisk „Revert” na GitHubie i „Delete entry” w panelu (TASK-011).
- Opcjonalnie: wskazówki co do palety kolorów (TASK-015); kopia zapasowa repozytorium na Proxmoxie (TASK-012); pytanie do redakcji Kingrunera o slot Biegu 7 Dolin; Grzegorz może założyć konto GitHub (potem dodać jako współpracownika).

## Backlog (opcjonalne)

- TASK-009 — dokończenie wdrożenia (Web Analytics, `workers.dev`) — po stronie właściciela.
- TASK-012 — kopia zapasowa repozytorium poza GitHubem.
- TASK-013 — import historii ukończonych biegów (dane właściciel wprowadził sam przez panel; do zamknięcia po przeglądzie).
- TASK-015 — rewizja palety kolorów.

## Ostatnia walidacja

- `main`: build (16 stron), lint, format:check, astro check bez błędów; walidacja referencji OK (2 autorów, 11 biegów).
- QA (produkcja): Lighthouse 100/100/100/100 na 4 stronach; axe 0 naruszeń; 0 martwych linków; brak poziomego przewijania 320–1280 px.

## Następna zalecana akcja

1. Właściciel: Redirect Rule HTTP→HTTPS i Web Analytics w Cloudflare.
2. Właściciel: odpowiedzi na pytania z sekcji „Do zrobienia po stronie użytkownika”.
3. Lead: po odpowiedziach — ewentualne zadania (status biegu z wynikami, SEO), zamknięcie TASK-009, TASK-011 i TASK-013.

> Aktualizuj ten plik przed zakończeniem większej sesji pracy lub po istotnej zmianie stanu projektu.

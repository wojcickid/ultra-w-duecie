# Decyzje architektoniczne i produktowe

Rejestr ważnych decyzji wpływających na dalszą implementację.

Format wpisu:

## DEC-XXX — Krótki tytuł

Date: YYYY-MM-DD
Status: proposed | accepted | superseded

### Decision
### Context
### Alternatives considered
### Consequences

---

## DEC-001 — Strona statyczna z CMS opartym na Git

Date: 2026-09-20
Status: accepted

### Decision

Astro (generowanie statyczne) na Cloudflare Pages. Treść (wpisy i dane biegów) jako pliki w repozytorium GitHub, edytowane przez panel CMS (Decap CMS lub kompatybilny Sveltia CMS) z logowaniem przez GitHub. Bez własnego backendu i bazy danych.

### Context

Projekt hobbystyczny: koszt ograniczony do domeny (~11 USD/rok), minimalne utrzymanie, brak zbierania danych użytkowników, 2 osoby edytujące treść. Wstępne założenia użytkownika (Python, SQLite, logowanie e-mail+hasło) zostały zastąpione po analizie kosztów i utrzymania.

### Alternatives considered

- Django + SQLite na VPS (mikr.us): gotowy panel z hasłem, ale koszt VPS, łatanie, backupy, wysyłka maili do resetu hasła.
- Cloudflare Pages + Workers + D1 z własnym logowaniem: darmowe, ale więcej kodu i odpowiedzialności za bezpieczeństwo.

### Consequences

- Koszt: tylko domena.
- Backup i historia zmian: Git.
- Brak e-mail/hasła i resetu haseł; logowanie przez GitHub. Na start wystarczy jedno konto (DEC-006).
- Rozróżnienie admin/moderator wynika z uprawnień GitHub, nie z logiki aplikacji; użytkownik zaakceptował równorzędność ról.
- Role Backend i Database Agent nie są używane w tym projekcie.
- Dokładny wybór CMS i sposobu logowania OAuth potwierdza TASK-001.

## DEC-002 — Analityka: Cloudflare Web Analytics

Date: 2026-09-20
Status: accepted

### Decision

Do statystyk odwiedzin używamy Cloudflare Web Analytics.

### Context

Wymóg minimalnej komplikacji prawnej i brak zbierania danych użytkowników.

### Alternatives considered

- Google Analytics: wymaga baneru zgody na cookies i polityki prywatności w UE.
- Brak analityki.

### Consequences

Bez cookies i bez baneru zgody. Dane dostępne w panelu Cloudflare.

## DEC-003 — Workflow Git agentów

Date: 2026-09-20
Status: accepted

### Decision

Agenci commitują na gałęziach `agent/<obszar>/<TASK-ID>-<nazwa>`; scalenie do `main` wykonuje użytkownik. Brak pushu do `main` przez agentów.

### Context

Zgodność z `CLAUDE.md` i chęć zachowania kontroli nad zmianami przez użytkownika.

### Alternatives considered

- Commity bezpośrednio na `main`.
- Brak commitów agentów.

### Consequences

Każda zmiana jest przeglądana przed scaleniem; Cloudflare Pages tworzy podglądy gałęzi.

## DEC-004 — Zasady pytania użytkownika

Date: 2026-09-20
Status: accepted

### Decision

Agenci pytają użytkownika o decyzje kluczowe (architektura, zakres, bezpieczeństwo, koszty, zewnętrznie widoczne zachowanie). Decyzje rutynowe podejmują samodzielnie i dokumentują.

### Context

Wskazanie użytkownika w `docs/project-brief.md`, sekcja 8.

### Alternatives considered

- Pytanie przed każdą większą decyzją.

### Consequences

Mniej przerw w pracy; ważne wybory pozostają pod kontrolą użytkownika.

## DEC-005 — Język dokumentacji i kodu

Date: 2026-09-20
Status: accepted

### Decision

Dokumentacja, komentarze, treści interfejsu i komunikaty commitów po polsku. Identyfikatory w kodzie i nazwy plików technicznych po angielsku (konwencja ekosystemu Astro/TypeScript).

### Context

Użytkownik wskazał język polski dla dokumentacji i kodu i potwierdził angielskie nazwy w kodzie.

### Alternatives considered

- Wszystko po polsku, łącznie z identyfikatorami w kodzie.

### Consequences

Nazwy kolekcji i pól w kodzie po angielsku (np. `runs`, `posts`, `authors`). W dokumentach, kolekcje i pola opisujemy po polsku z nazwą kodową w nawiasie.

## DEC-006 — MVP na subdomenie istniejącej domeny; jedno konto GitHub na start

Date: 2026-09-20
Status: accepted

### Decision

MVP publikujemy na subdomenie istniejącej domeny właściciela (Cloudflare Pages, własna domena podpięta jako subdomena). Osobna domena — później, opcjonalnie. Na start jedno konto GitHub (właściciel); drugi autor przesyła treść, a autor wpisu jest polem wpisu. Admin i moderator są równorzędni (uprawnienia z GitHuba).

### Context

Użytkownik chce zminimalizować koszty i komplikacje; kolega nie ma konta GitHub.

### Alternatives considered

- Zakup nowej domeny od razu (ok. 11 USD/rok).
- Założenie drugiego konta GitHub przed startem.

### Consequences

- Brak dodatkowego kosztu na start.
- Wymagana informacja, gdzie działa DNS domeny właściciela (TASK-009).
- Wpisy pokazują autora niezależnie od tego, kto je opublikował.
- Drugie konto GitHub można dodać później bez zmiany architektury.
- Domena właściciela (damianwojcicki.com) jest w Cloudflare, więc dodanie subdomeny do projektu Pages tworzy rekord DNS automatycznie. Nazwę subdomeny wybiera właściciel.

## DEC-007 — Postęp „w duecie” liczy tylko biegi ukończone wspólnie

Date: 2026-09-20
Status: accepted

### Decision

Licznik X/10 na stronie głównej obejmuje wyłącznie biegi ukończone przez obu autorów. Wyniki indywidualne (np. SGS 2025 ukończony tylko przez Damiana) są zapisywane per osoba i pokazywane osobno, poza licznikiem.

### Context

Formuła wyzwania to zdobycie całej korony w parze.

### Alternatives considered

- Wliczanie biegów ukończonych przez jedną osobę do licznika.

### Consequences

Model danych przechowuje wyniki per osoba (FR-7). Licznik jest liczony automatycznie z danych.

Doprecyzowane w DEC-010 (ten sam dzień ukończenia) i DEC-011 (liczą się tylko wyniki „Ukończył”).

## DEC-008 — Bieg 7 Dolin jako bieg wycofany z listy

Date: 2026-09-20
Status: accepted

### Decision

Bieg 7 Dolin (Piwniczna) 2024, ukończony wspólnie, pozostaje w danych jako bieg wycofany z listy Korony (wg regulaminu 4.0 ukończenie do edycji 2025 włącznie można zaliczyć do klasyfikacji; edycja 2026 odwołana przez organizatora) i wlicza się do postępu. Wolnego miejsca nie zastępujemy innym biegiem na razie; decyzja o sposobie zaliczenia slotu zostaje odłożona.

### Context

W chwili ukończenia był biegiem podstawowym Korony. Regulamin 4.0 nie zawiera go już wśród stałych biegów.

### Alternatives considered

- Zastąpienie go od razu konkretnym biegiem z aktualnej listy.
- Usunięcie go ze statystyk.

### Consequences

Model danych ma flagę `retired` dla biegu. Zasadę wliczania do licznika, gdy aktualna lista zawiera 10 innych biegów, trzeba doprecyzować przy TASK-005 po sprawdzeniu regulaminu.

## DEC-009 — Panel CMS: Sveltia CMS z własnym proxy OAuth (Cloudflare Pages Function)

Date: 2026-09-20
Status: accepted

> Aktualizacja (2026-09-20): wdrożenie jako Worker ze static assets, nie Pages — patrz sekcja „Aktualizacja” na końcu tego wpisu. Poniższy opis Pages Function i `functions/` jest historyczny; obowiązuje `worker/` i `wrangler.jsonc`.

### Decision

Panel CMS to **Sveltia CMS** w przypiętej wersji (0.217.0, ładowany z CDN jsDelivr z sumą SRI) w `public/admin/`. Logowanie GitHub OAuth obsługuje własna, krótka **Cloudflare Pages Function** w `functions/api/` (`/api/auth`, `/api/callback`), oparta na protokole Decap/Sveltia (przekierowanie do GitHuba, wymiana kodu na token, przekazanie tokenu do okna panelu przez `postMessage`). Zabezpieczenia: losowy `state` w ciasteczku HttpOnly, stały minimalny zakres `public_repo` (repozytorium jest publiczne), token wydawany wyłącznie originowi z `ALLOWED_ORIGIN`, sekrety tylko w zmiennych Cloudflare (`GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`), brak logowania tokenów i sekretów. Wpisy mają układ pakietu (`src/content/posts/<slug>/index.md` + obrazy obok), co daje ścieżki względne wymagane przez `image()` w Astro.

### Context

DEC-001 przewiduje CMS oparty na Git. Na Cloudflare Pages nie ma wbudowanego dostawcy OAuth (jak Netlify Identity/Git Gateway), więc GitHub OAuth wymaga własnego małego serwisu do wymiany kodu na token (sekret aplikacji nie może trafić do przeglądarki). Decap CMS i Sveltia CMS używają tego samego protokołu proxy OAuth, a konfiguracja (`config.yml`) jest w dużej mierze wspólna. Stan na 2026-09-20 (źródła: dokumentacja Sveltia CMS, README `sveltia-cms-auth`, npm, dokumentacja Cloudflare Pages):

- Sveltia CMS 0.217.0 (MIT, wydanie z 2026-09-19, publikacja npm z atestacją pochodzenia, autor aktywnie utrzymuje projekt, deklaruje „feature complete”, ale wersja jest jeszcze 0.x). Plik ~2,1 MB (617 kB po kompresji gzip). Interfejs po polsku (język z ustawień przeglądarki), commity GitHub podpisywane, obsługa GraphQL, ochrona XSS (DOMPurify), zakres OAuth ustawiany opcją `auth_scope`, wbudowane logowanie tokenem osobistym (awaryjnie, bez proxy OAuth).
- Decap CMS 3.16.2 (MIT, wydanie z 2026-09-14, repozytorium aktywne). Plik ~5,2 MB (1,5 MB gzip), według autorów Sveltia bez poprawki znanej luki XSS i z wieloma niezałatwionymi zgłoszeniami; brak wbudowanego dostawcy OAuth poza Netlify, dokumentacja odsyła do rozwiązań zewnętrznych.
- Oficjalny `sveltia-cms-auth` działa jako osobny Cloudflare Worker (nie Pages Function) i wymaga wdrożenia drugiego serwisu; domyślnie prosi o szeroki zakres `repo,user`. Rozwiązania zewnętrzne dla Decap to głównie projekty społeczności, bez gwarancji utrzymania.

### Alternatives considered

- **Decap CMS + zewnętrzne proxy OAuth:** większy plik, wolniejszy i mniej dopracowany panel, dodatkowe rozwiązanie społeczności do zaufania.
- **Sveltia CMS + `sveltia-cms-auth` jako osobny Worker:** sprawdzone, ale to drugi serwis (osobne wdrożenie, dodatkowy adres `workers.dev` lub trasa), szerszy domyślny zakres OAuth; osobne repozytorium do śledzenia aktualizacji.
- **Sveltia CMS wyłącznie z tokenem osobistym (bez OAuth):** najmniej kodu i zero serwera; działa dla jednej osoby, ale token trzeba tworzyć i odnawiać ręcznie, a dla nietechnicznego drugiego autora jest niewygodny. Pozostaje metodą awaryjną.
- **Zależność npm zamiast CDN:** eliminuje zaufanie do CDN w czasie działania, ale dodaje ~23 MB zależności i wymaga własnego skryptu ładującego; przy przypięciu wersji i SRI zysk jest niewielki.

### Consequences

- Jedyny element serwerowy: dwie krótkie funkcje (`functions/`, ok. 240 linii, bez zależności), część projektu Pages, bez osobnego wdrożenia.
- Kod funkcji jest nasz: przy zmianach protokołu w Sveltia trzeba go dostosować; zmiany wersji panelu wymagają świadomej aktualizacji numeru wersji i SRI (`docs/cms-setup.md`).
- Zakres `public_repo` wystarcza do zapisu w publicznym repozytorium i nie daje dostępu do prywatnych repozytoriów konta; przy zmianie repozytorium na prywatne potrzebny jest zakres `repo`.
- Panel działa tylko na domenie z `ALLOWED_ORIGIN` (produkcyjna subdomena); podglądy `*.pages.dev` służą do sprawdzania strony, nie panelu.
- Układ wpisów jako pakiet katalogu (`<slug>/index.md`): identyfikator wpisu w Astro to `<slug>` (przyrostek `/index` jest pomijany), a obrazy leżą obok wpisu i są wskazywane samą nazwą pliku (Astro `image()` przyjmuje taką ścieżkę). Istniejący płaski plik `testowy-wpis.md` nie jest widoczny w panelu (do usunięcia przed publikacją).
- Instrukcja dla właściciela: `docs/cms-setup.md`. Weryfikacja logowania i zapisu na żywo oraz odmowy zapisu dla osoby bez uprawnień pozostaje do wykonania po wdrożeniu (TASK-001), pełną konfigurację kolekcji robi TASK-008.

### Aktualizacja: wdrożenie jako Worker ze static assets, nie Pages

Date: 2026-09-20
Status: accepted (decyzja o Sveltia CMS i własnym proxy OAuth bez zmian; zmienia się tylko sposób wdrożenia)

Kreator Cloudflare dla nowych projektów tworzy **Workera** (build z Git przez Workers Builds: `npm run build`, wdrożenie `npx wrangler deploy`, podglądy gałęzi `npx wrangler versions upload`), a nie projekt Pages; według dokumentacji Cloudflare (migracja z Pages: https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/) nowe projekty są rekomendowane na Workers, a Pages tylko dla już istniejących. Funkcje w formacie Pages Functions (`functions/`, `onRequestGet`, routing plikowy) w takim wdrożeniu nie działają, więc:

- kod OAuth przeniesiono do `worker/` (`worker/index.ts` jako punkt wejścia `fetch`, handlery `auth.ts` i `callback.ts`, wspólny `oauth.ts`); zachowanie i zabezpieczenia bez zmian (`state` w ciasteczku `Path=/api`, zakres `public_repo`, `ALLOWED_ORIGIN`, CSP z nonce, `no-store`); katalog `functions/` usunięto,
- `wrangler.jsonc`: `assets.directory: ./dist`, `not_found_handling: 404-page`, `run_worker_first: ["/api/*"]` (tylko `/api/*` uruchamia skrypt; reszta to statyczne pliki, `public/_headers` działa natywnie), `vars.ALLOWED_ORIGIN` jawnie, `observability` wyłączone,
- `GITHUB_CLIENT_ID` i `GITHUB_CLIENT_SECRET` jako **Secrets** w panelu Workera (nie w repozytorium i nie w `vars`): Cloudflare zachowuje sekrety między wdrożeniami, natomiast zwykłe zmienne z dashboardu, których nie ma w `wrangler.jsonc`, byłyby usuwane przez `wrangler deploy` (`keep_vars` nie włączamy: plik jest źródłem prawdy). Bez sekretów Worker wdraża się poprawnie i zwraca `MISCONFIGURED_CLIENT`,
- domena `korona.damianwojcicki.com` jako Custom Domain Workera (strefa jest w Cloudflare, DNS dodawany automatycznie); `wrangler` dopisano do devDependencies (Workers Builds uruchamia `npx wrangler`, a przypięta wersja daje powtarzalne budowy),
- skutek uboczny: adres `workers.dev` też serwuje stronę, ale panel działa tylko na domenie z `ALLOWED_ORIGIN`; `html_handling: drop-trailing-slash` (adresy bez ukośnika na końcu serwowane wprost, wersje z ukośnikiem przekierowują na nie; panel Sveltia ładuje `config.yml` z bezwzględnej ścieżki `/admin/config.yml`, więc nie zależy od ukośnika).

Instrukcja dla właściciela: `docs/cms-setup.md`.

## DEC-010 — „Ukończony wspólnie” = obaj mają wynik z tą samą datą ukończenia

Date: 2026-09-20
Status: accepted

### Decision

Bieg jest ukończony wspólnie (i liczy się do licznika X/10, DEC-007), gdy **każdy** autor ma wynik „Ukończył” (DEC-011), a wszystkie daty ukończenia (`completedDate`) są tym samym dniem kalendarzowym. Dni porównujemy w strefie Europe/Warsaw (tej samej, w której wyświetlamy daty, `toDayKey` w `src/lib/format.ts`); dla dat zapisanych jako `YYYY-MM-DD` to po prostu ta sama data. Bieg, w którym obaj mają wynik, ale daty się różnią, nie jest wspólny: jego wyniki pokazujemy jako indywidualne, a licznik ich nie liczy. `scripts/validate-content.mjs` ostrzega o takim przypadku (bez przerywania budowy), a panel podpowiada regułę przy polu wyników i dacie.

### Context

DEC-007 mówi, że licznik liczy biegi ukończone „wspólnie”, ale wcześniej sprawdzano tylko, czy obaj autorzy mają jakikolwiek wynik. Właściciel po teście na produkcji chce, żeby „wspólnie” oznaczało faktycznie ten sam start (ta sama edycja biegu, ten sam dzień).

### Alternatives considered

- Wystarczy posiadanie wyniku przez obu (dotychczasowa reguła): pozwala policzyć jako wspólne dwa osobne podejścia, np. różne edycje biegu.
- Osobne pole `edition` (rok/edycja) w biegu lub wyniku: dokładniejsze, ale dodatkowe dane do utrzymania; ta sama data ukończenia jest prostym, jawnym zastępnikiem.

### Consequences

- Dane muszą mieć spójną datę: jeśli biegli razem, obaj wpisują tę samą datę (data mety lub startu biegu).
- Bieg kończony po północy przez obu w różnych dniach kalendarzowych wymaga ręcznego wpisania tej samej daty; inaczej nie będzie wspólny.
- Daty z godziną i przesunięciem (nietypowe; panel zapisuje sam dzień) porównujemy według dnia w Europe/Warsaw, czyli tak, jak są wyświetlane.
- Nie wymaga migracji: dotychczasowe dane (Bieg Rzeźnika, Bieg 7 Dolin) mają identyczne daty obu autorów.

## DEC-011 — Wynik osoby: `outcome` finished / dnf / dns

Date: 2026-09-20
Status: accepted

### Decision

Każdy wynik w `results` ma pole `outcome`: `finished` (Ukończył, domyślne), `dnf` (Nie ukończył, Did Not Finish) albo `dns` (Nie wystartował, Did Not Start). Status biegu (`completed` / `planned` / `unplanned`) pozostaje wspólnym podejściem lub planem. Reguły w schemacie (`src/content.config.ts`):

- `finished`: wymaga `completedDate` i `time`;
- `dnf`: `completedDate` (data podejścia) i `time` opcjonalne;
- `dns`: `completedDate` opcjonalne, `time` niedozwolony;
- nowe opcjonalne pole `note` (np. „zejście na 62. km”); jeden wynik na autora w biegu bez zmian;
- `completed` wymaga co najmniej jednego wyniku `finished`.

Do licznika i reguły „wspólnie” (DEC-010) liczą się wyłącznie wyniki `finished`. DNF i DNS są pokazywane na stronie biegu, liście, osi czasu i w wynikach indywidualnych, zawsze z tekstem i ikoną.

### Context

Właściciel podał przypadki: SGS 2025 (Damian ukończył, Grzegorz DNS) i Bieg Ultra Granią Tatr (obaj DNF). Status biegu jest wspólny, więc nie opisuje tego, co przydarzyło się każdemu z osobna.

### Alternatives considered

- Statusy `dnf`/`dns` na poziomie biegu: odrzucone jako zbyt grube, nie oddają przypadków, w których jeden biegacz ukończył, a drugi nie wystartował.
- Osobna kolekcja podejść (attempts): większa zmiana modelu bez potrzeby.

### Consequences

- Istniejące wyniki bez `outcome` są traktowane jako `finished` (`default`), więc dane rzeczywiste przechodzą bez zmian.
- `completedDate` i `time` są opcjonalne na poziomie pola; ich wymagalność pilnuje schemat (panel Sveltia nie ma pól zależnych, więc pola są opcjonalne z podpowiedziami; błędne dane zatrzymują budowę z czytelnym komunikatem).
- Bieg można później ustawić z powrotem na `planned` (kolejna edycja); wcześniejsze wyniki DNF/DNS zostają w `results` do ręcznego usunięcia.
- Nowe tokeny kolorów `status-dnf-*` i `status-dns-*` oraz ikony `circle-x` i `circle-minus`.

## DEC-008 — aktualizacja (2026-09-20, TASK-018)

Weryfikacja w źródłach ([docs/run-data-proposals.md](run-data-proposals.md)) potwierdziła: regulamin Korony 4.0 (wersja z 07.12.2024) stanowi, że „wszyscy którzy przebiegli Bieg 7 Dolin Festiwalu Biegowego do edycji 2025 włącznie mogą zaliczyć ten bieg do klasyfikacji”. Organizator nie zakończył imprezy: odwołał edycję 2026 i zapowiedział propozycję na 2027. Regulamin nie wskazuje, który z 10 slotów zajmuje 7 Dolin (jest w nim niespójność „8 stałych + jeden z trzech”); właściciel odłożył pytanie do redakcji Kingrunera i pozostawia flagę `retired: true` oraz dotychczasowy licznik.

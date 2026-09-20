# Architektura — Ultra w duecie

Patrz też: `docs/decisions.md` (DEC-001 … DEC-012).

## Przegląd

Strona statyczna generowana przez Astro, hostowana na Cloudflare jako **Worker ze statycznymi plikami** (Workers Static Assets; DEC-009, aktualizacja). Treść (wpisy bloga i dane biegów) to pliki w repozytorium GitHub, edytowane przez panel CMS (Sveltia CMS, DEC-009), który zapisuje zmiany jako commity. Każdy commit uruchamia automatyczną budowę i publikację strony.

```text
Autor (admin/moderator)
   |  logowanie przez GitHub
   v
Panel CMS (/admin)  --commit-->  Repozytorium GitHub  --webhook-->  Cloudflare Workers Builds (build Astro)
                                                                        |
Czytelnik  <---------------- statyczne HTML/CSS/JS z CDN Cloudflare <---+
```

Brak własnego backendu, bazy danych i serwera do utrzymania.

## Frontend

- Framework: **Astro** (generowanie statyczne), TypeScript.
- Style: **Tailwind CSS**, mobile-first (szczegóły w `docs/ui.md`).
- Treść: **Astro Content Collections** (loader `glob`, schematy Zod z `astro/zod`); definicje w `src/content.config.ts`, dane w `src/content/`. Identyfikator wpisu kolekcji = nazwa pliku. Niepoprawne dane przerywają budowę czytelnym komunikatem (`InvalidContentEntryDataError` ze ścieżką pola):
  - **biegi** (`runs`, `src/content/runs/<slug>.json`) — 10 biegów Korony + bieg wycofany. Pola: `name` (nazwa), `distanceKm` (opcjonalny), `location` (opcjonalne), `typicalMonth` (orientacyjny termin, tekst, opcjonalny), `expectedYear` (rok terminu orientacyjnego, liczba całkowita, opcjonalny; DEC-012), `status` (`completed` / `planned` / `unplanned`; wspólne podejście lub plan), `retired` (bieg wycofany z listy Korony, domyślnie `false`), `plannedDate` (opcjonalna potwierdzona data startu), `resultsUrl` (opcjonalny link do wyników całego biegu), `notes` (opcjonalne), `order` (opcjonalna pozycja do sortowania), `results` (lista wyników per osoba, domyślnie pusta). Wynik: `author` (referencja do `authors`), `outcome` (`finished` domyślnie / `dnf` / `dns`, DEC-011), `completedDate` (data ukończenia lub podejścia), `time` (HH:MM:SS), `place` (opcjonalne miejsce, liczba całkowita dodatnia; DEC-012), `resultsUrl` (opcjonalny URL wyniku osoby), `note` (opcjonalna notatka). Reguły: jeden wynik na autora w danym biegu; `finished` wymaga `completedDate` i `time`; `dns` nie może mieć `time`; status `completed` wymaga co najmniej jednego wyniku `finished`. Postęp „w duecie” (DEC-007, DEC-010) liczy się w kodzie (`src/lib/progress.ts`): bieg jest zaliczony, gdy każdy autor ma wynik `finished` z tą samą datą ukończenia (dzień w Europe/Warsaw; DNF i DNS się nie liczą); `scripts/validate-content.mjs` ostrzega (exit 0), gdy daty się różnią lub bieg `completed` nie jest wspólny; mianownik `CROWN_TOTAL = 10`; ta sama walidacja ostrzega (exit 0), gdy liczba biegów aktywnych (bez `retired: true`) jest inna niż 10 (DEC-012),
  - **wpisy** (`posts`, `src/content/posts/*.md`) — pola we frontmatter: `title` (tytuł), `date` (data), `authors` (lista referencji do `authors`, min. 1), `run` (opcjonalna referencja do `runs`), `images` (opcjonalna lista `{ src, alt }`; `src` to obraz z `src/` walidowany przez `image()`, `alt` wymagany); treść w Markdown w pliku,
  - **autorzy** (`authors`, `src/content/authors/<id>.json`) — dwie osoby (`damian`, `grzegorz`); pole `displayName` (nazwa wyświetlana); wpisy i wyniki odwołują się do nich przez `reference('authors')`.
  - Walidacja referencji: Astro samo tylko loguje `[ERROR] Invalid content reference` (kod wyjścia 0), dlatego `scripts/validate-content.mjs` (uruchamiany przez `prebuild` i `npm run check`) przerywa budowę z komunikatem po polsku (plik, pole, brakujący identyfikator), gdy `posts[].authors`, `posts[].run` lub `runs[].results[].author` wskazują nieistniejący wpis. Skrypt nie zastępuje walidacji schematu Astro.
- Routing (statyczny):
  - `/` — strona główna (wprowadzenie, licznik postępu X/10, oś czasu, wyniki indywidualne, 3 ostatnie wpisy),
  - `/biegi` i `/biegi/<id>` — lista biegów i szczegóły biegu (wyniki per osoba, powiązane wpisy); termin biegu (na osi czasu, liście, stronie biegu i karcie „Najbliższy start”) liczy wspólny helper `getRunTerm` w `src/lib/runs.ts`, który zwraca jeden z trzech rodzajów terminu (`kind`, DEC-012): `confirmed` (najwcześniejsza data z wyników, inaczej `plannedDate`), `approximate` (`typicalMonth` z opcjonalnym `expectedYear`; sam miesiąc dostaje dopisek `qualifier` „termin orientacyjny”) albo `tbd` („Termin do ustalenia”). Lista biegów jest dzielona na 10 biegów Korony 4.0 i „Historię projektu” (`retired: true`), a najbliższy start wybiera `getNextRun` przy budowie strony (drobny skrypt po stronie przeglądarki ukrywa kartę po dniu startu),
  - `/blog` (strona 1), `/blog/strona/<n>` (od 2, po 10 wpisów) i `/blog/<id>` — lista z paginacją i wpis; unikać identyfikatora wpisu `strona`,
  - `/rss.xml` — kanał RSS (zależność `@astrojs/rss`, adres z `site` w `astro.config.mjs`); `trailingSlash: false`, więc `<link>` i `<guid>` wpisów to adresy bez końcowego ukośnika (zgodne z `html_handling: drop-trailing-slash`, bez przekierowania 307),
  - `/404`, panel `/admin` (TASK-008). Strona pomocnicza `/styleguide` (podgląd wariantów komponentów) została usunięta w TASK-010; jej ostatnia wersja jest w historii Git (`git log -- src/pages/styleguide.astro`).
- Wspólny kod w `src/lib/`: `format.ts` (`formatDate` i `toDayKey`, strefa Europe/Warsaw — daty z kolekcji są parsowane jako UTC), `progress.ts` (licznik, sortowanie po `order`, wyniki autora, `splitCrownAndHistory`, `getTogetherSummary`, `getNextRun` — czyste funkcje; `getNextRun` przyjmuje `now` jako parametr), `runs.ts` (`getRunBadges` — jedno źródło znaczników biegu dla osi czasu, listy i strony biegu; `getRunTerm` / `formatRunTerm` / `getRunFacts` — termin i dane biegu; opisy wyników osób), `blog.ts` (pomocnicze funkcje wpisów).
- Brak stanu po stronie klienta poza samym panelem CMS.

## Backend

Brak własnego backendu. Jedyny element serwerowy to niewielki skrypt Workera (`worker/`) obsługujący logowanie OAuth przez GitHub dla panelu CMS (DEC-009). Wszystko inne to statyczne pliki z `dist/`. Instrukcja wdrożenia: `docs/cms-setup.md`.

- **Panel CMS:** Sveltia CMS (wersja przypięta w `public/admin/index.html`, ładowana z CDN jsDelivr z sumą SRI); konfiguracja w `public/admin/config.yml` (backend GitHub, repozytorium `wojcickid/ultra-w-duecie`, gałąź `main`, zapis wprost jako commity). Wpisy to pakiety `src/content/posts/<slug>/index.md` z obrazami obok (ścieżki względne zgodne z `image()`). Kolekcje panelu (kolejność w menu: Wpisy, Biegi, Autorzy) odpowiadają kolekcjom z `src/content.config.ts` i mają te same nazwy pól (schemat jest źródłem prawdy; zmiana schematu wymaga zmiany `config.yml`): `posts` (tytuł, data, autorzy jako relacja do `authors`, opcjonalny bieg jako relacja do `runs`, zdjęcia z obowiązkowym opisem alternatywnym, treść Markdown; adres wpisu to slug ASCII do 60 znaków, np. „Łódź na Ślęży” daje `lodz-na-slezy`), `runs` (edycja istniejących biegów: status, wycofanie z listy Korony, planowana data oraz wyniki per autor z polami `outcome` (select, domyślnie „Ukończył”), datą, czasem HH:MM:SS sprawdzanym tym samym wzorcem co schemat, linkiem i notatką — `completedDate` i `time` są w panelu opcjonalne z podpowiedziami, bo Sveltia nie ma pól zależnych (wymagalność dla „Ukończył” pilnuje schemat); bez tworzenia i usuwania, bo listę biegów Korony dodaje deweloper jako pliki `src/content/runs/<slug>.json`) i `authors` (tylko zmiana nazwy wyświetlanej; kolekcja jest źródłem relacji, identyfikator autora to nazwa pliku, np. `damian`). Globalna opcja `output.omit_empty_optional_fields: true` sprawia, że puste pola opcjonalne są pomijane w plikach (bez `""`, `null` i `[]`), bo schemat nie przyjmuje pustego tekstu w polach z `z.url()` i `z.coerce.date()`; pusta lista `results` znika z pliku, a Zod przywraca ją przez `default([])`. Panel nie sprawdza reguł łączonych (co najmniej jeden wynik „Ukończył” dla statusu „Ukończony”, data i czas dla „Ukończył”, brak czasu dla DNS, jeden wynik na osobę): pilnuje ich schemat podczas budowy, a panel podpowiada je w opisach pól, więc błędne dane mogą zatrzymać budowę do poprawki.
- **Worker OAuth** (`worker/`, wdrażany razem ze stroną; konfiguracja w `wrangler.jsonc`; kod bez zależności czasu działania, własne lekkie typy; `wrangler` jest tylko w devDependencies):
  - `worker/index.ts` — punkt wejścia (`export default { fetch }`): `GET /api/auth` i `GET /api/callback` trafiają do handlerów; inna metoda na tych ścieżkach → 405 (`Allow: GET`), inna ścieżka pod `/api/` → 404 (puste odpowiedzi, `no-store`); pozostały ruch to zabezpieczenie `env.ASSETS.fetch(request)`. Statyczne pliki zwykle w ogóle nie uruchamiają Workera: `assets.run_worker_first` to `["/api/*"]`.
  - `GET /api/auth` — sprawdza `provider=github`, domenę (`site_id`) i konfigurację, losuje `state` (128 bitów, ciasteczko `oauth_state`: HttpOnly, Secure, SameSite=Lax, Path=/api, 10 minut) i przekierowuje (302) na `https://github.com/login/oauth/authorize` z `client_id`, `redirect_uri` (`<origin>/api/callback`), `scope=public_repo`, `state`, `allow_signup=false`.
  - `GET /api/callback` — porównuje `state` z zapytania z ciasteczkiem (porównanie w stałym czasie), wymienia `code` na token (`POST https://github.com/login/oauth/access_token`) i zwraca stronę, która przekazuje token do okna panelu przez `postMessage` (protokół `authorizing:github` / `authorization:github:success|error:<JSON>`), wyłącznie originowi z listy dozwolonych.
  - `worker/auth.ts`, `worker/callback.ts` — handlery; `worker/oauth.ts` — wspólny kod (odczyt konfiguracji, `state`, ciasteczka, odpowiedź HTML z CSP z nonce).
- **Konfiguracja Workera** (`wrangler.jsonc`): `name: ultra-w-duecie` (musi być identyczna z nazwą Workera w panelu Cloudflare), `main: worker/index.ts`, `assets.directory: ./dist`, `assets.not_found_handling: 404-page` (nieistniejące adresy dostają `dist/404.html` ze statusem 404), `assets.binding: ASSETS`, `observability` wyłączone (adres `/api/callback` zawiera jednorazowy kod z GitHuba). `public/_headers` trafia do `dist/` i działa natywnie w static assets; pliki `_headers` nie są serwowane jako zwykłe pliki. Zawartość: `/*` (strony publiczne i zasoby) — `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (wyłączone camera, microphone, geolocation, payment, usb); `/_astro/*` — `Cache-Control: public, max-age=31536000, immutable` (zasoby z hashem w nazwie); `/admin` i `/admin/*` — `X-Robots-Tag`, `X-Frame-Options`, `Referrer-Policy: same-origin`. Reguły dla pasujących wzorców się ŁĄCZĄ (nagłówki o tej samej nazwie z obu reguł są wysyłane jako osobne linie), dlatego bloki `/admin` zaczynają się od `! Referrer-Policy` (odpięcie wartości z `/*`) i dopiero potem ustawiają własną; sprawdzone lokalnie w `wrangler dev --local` (jedna linia `referrer-policy: same-origin`). Nowe nagłówki ogólne z nazwą, którą `/admin` ma ustawić inaczej, wymagają tego samego odpięcia. CSP i HSTS poza zakresem (HSTS i przekierowanie HTTP → HTTPS to ustawienia Cloudflare). Odpowiedzi Workera (`/api/*`) nie przechodzą przez `_headers` i mają własne nagłówki. `html_handling: drop-trailing-slash`: adresy bez ukośnika na końcu (`/biegi`, `/admin`) są serwowane wprost, a wersje z ukośnikiem przekierowują na nie (zgodnie z linkami w serwisie i dawnym zachowaniem Pages; domyślne `auto-trailing-slash` dawałoby przekierowanie przy każdym kliknięciu w menu).
- **Zmienne i sekrety:**
  - `ALLOWED_ORIGIN` — jawna zmienna w `wrangler.jsonc` (`vars`): origin panelu `https://korona.damianwojcicki.com` (kilka wartości po przecinku; gdy brak, przyjmowany jest origin żądania),
  - `GITHUB_CLIENT_ID` i `GITHUB_CLIENT_SECRET` — **Secrets** wpisywane w panelu Cloudflare (Worker → Settings → Variables and Secrets), nigdy w repozytorium. Nie ma ich w `wrangler.jsonc`, więc `wrangler deploy` ich nie nadpisuje (sekrety z dashboardu przeżywają kolejne wdrożenia; zwykłe zmienne z dashboardu, których nie ma w `wrangler.jsonc`, byłyby usuwane, bo plik konfiguracji jest źródłem prawdy dla `vars`; `keep_vars` celowo nie jest włączone). Bez obu sekretów Worker wdraża się poprawnie, a `/api/auth` zwraca błąd `MISCONFIGURED_CLIENT` („Logowanie nie jest skonfigurowane po stronie serwera”).
- **Lokalne uruchomienie Workera:** `npm run build`, potem `npx wrangler dev --local` (bez logowania do Cloudflare). Wartości testowe sekretów w `.dev.vars` (w `.gitignore`, nigdy nie commitować), np. `GITHUB_CLIENT_ID=...` i `GITHUB_CLIENT_SECRET=...`; origin lokalny: `--var ALLOWED_ORIGIN:http://127.0.0.1:8787` (i `site_id=127.0.0.1` w adresie `/api/auth`).

## Baza danych

Brak. Źródłem danych są pliki Markdown/JSON w repozytorium (kolekcje treści). Historia zmian i kopia zapasowa zapewnia Git. Rola „Database Agent” nie jest w tym projekcie używana.

## Analityka

**Cloudflare Web Analytics** — bez cookies i bez zbierania danych osobowych (DEC-002). Dla Workera włączane w panelu Web Analytics (dodanie witryny `korona.damianwojcicki.com`, automatyczne wstrzykiwanie skryptu dla domeny przechodzącej przez proxy Cloudflare); jeśli automatyczne wstrzykiwanie nie zadziała, awaryjnie ręczny fragment skryptu w układzie strony (patrz `docs/cms-setup.md`).

## Wdrożenie

- **Dev:** lokalnie (`astro dev`), opcjonalnie na własnym serwerze (Proxmox) — nie jest wymagane.
- **Prod:** Cloudflare Worker `ultra-w-duecie` ze statycznymi plikami, podpięty jako Custom Domain do subdomeny istniejącej domeny właściciela (DEC-006; strefa `damianwojcicki.com` jest w Cloudflare); dedykowana domena może zastąpić subdomenę później. Budowa i wdrożenie przez **Workers Builds** (integracja z GitHubem): po zmianie na gałęzi `main` uruchamiane są `npm run build` i `npx wrangler deploy`. Adres `ultra-w-duecie.<konto>.workers.dev` też działa (strona tak, panel nie, bo `ALLOWED_ORIGIN`).
- **Podgląd:** gałęzie inne niż `main` budowane są poleceniem `npx wrangler versions upload` (wersja z adresem podglądu, bez zmiany produkcji).
- Środowiska: dev (lokalnie) i prod. Środowisko testowe zastępują podglądy gałęzi.
- Repozytorium: GitHub (prywatne lub publiczne — do decyzji użytkownika; przy publicznym treść źródłowa jest jawna, nie zawiera sekretów).

## Bezpieczeństwo

- Publiczna strona jest statyczna: brak formularzy, sesji i danych użytkowników — minimalna powierzchnia ataku.
- Dostęp do zapisu treści ma wyłącznie osoba z uprawnieniami zapisu w repozytorium GitHub; logowanie do panelu przez konto GitHub (zalecane włączenie 2FA). Na start jedno konto (właściciel); drugi autor może zostać dodany później jako współpracownik repozytorium.
- Identyfikator i sekret aplikacji OAuth GitHub przechowywane wyłącznie jako Secrets w ustawieniach Workera w Cloudflare, nigdy w repozytorium.
- Worker OAuth (DEC-009): losowy `state` z ciasteczka HttpOnly chroni przed CSRF; stały, minimalny zakres `public_repo` (zakres z żądania jest ignorowany); token trafia tylko do originu z `ALLOWED_ORIGIN` (weryfikowany po stronie okna logowania na podstawie `event.origin`, którego nie da się podrobić), dodatkowo sprawdzana jest domena (`site_id`); sekrety i tokeny nie są logowane ani zwracane w błędach (komunikaty stałe); odpowiedzi mają `Cache-Control: no-store`, `Referrer-Policy: no-referrer` i CSP z nonce. Zalogować przez aplikację OAuth może każdy użytkownik GitHuba, ale zapis w repozytorium zależy od uprawnień jego konta na GitHubie.
- Wyłączone logi Workera (`observability`): adres `/api/callback` zawiera jednorazowy kod z GitHuba; kod i tak wymaga sekretu aplikacji do wymiany na token, ale nie ma powodu go zapisywać.
- Strony publiczne mają `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` i `Permissions-Policy` (`public/_headers`). `/admin` ma nagłówki `X-Robots-Tag: noindex`, `X-Frame-Options: DENY`, `Referrer-Policy: same-origin` (`public/_headers`, z odpięciem ogólnej wartości `Referrer-Policy`) i `<meta name="robots">`; skrypt panelu jest przypięty do wersji i chroniony sumą SRI.
- Ochrona gałęzi `main`: blokada force-push i usuwania gałęzi. Wymóg pull requesta zablokowałby zapis z panelu (commity wprost na `main`), więc na MVP go nie włączamy.
- Brak danych wrażliwych i osobowych czytelników.

## Kopie zapasowe

Wszystko (treść, obrazy, kod) jest w repozytorium Git. Zalecana dodatkowa kopia poza GitHubem: okresowy mirror repozytorium na własnym serwerze (Proxmox) — patrz TASK-012.

## Obserwowalność

- Logi budowy i wdrożeń: panel Cloudflare (Worker → Deployments / Builds). Logi działania Workera są wyłączone; do diagnozy można tymczasowo włączyć `observability` w `wrangler.jsonc` lub użyć `npx wrangler tail` (wymaga logowania do Cloudflare, poza zakresem agentów).
- Statystyki odwiedzin: Cloudflare Web Analytics.
- Monitoring dostępności: opcjonalnie darmowy monitor zewnętrzny (poza zakresem MVP).

# Architektura — Ultra w duecie

Patrz też: `docs/decisions.md` (DEC-001 … DEC-005).

## Przegląd

Strona statyczna generowana przez Astro, hostowana na Cloudflare Pages. Treść (wpisy bloga i dane biegów) to pliki w repozytorium GitHub, edytowane przez panel CMS (Sveltia CMS, DEC-009), który zapisuje zmiany jako commity. Każdy commit uruchamia automatyczną budowę i publikację strony.

```text
Autor (admin/moderator)
   |  logowanie przez GitHub
   v
Panel CMS (/admin)  --commit-->  Repozytorium GitHub  --webhook-->  Cloudflare Pages (build Astro)
                                                                        |
Czytelnik  <---------------- statyczne HTML/CSS/JS z CDN Cloudflare <---+
```

Brak własnego backendu, bazy danych i serwera do utrzymania.

## Frontend

- Framework: **Astro** (generowanie statyczne), TypeScript.
- Style: **Tailwind CSS**, mobile-first (szczegóły w `docs/ui.md`).
- Treść: **Astro Content Collections** (loader `glob`, schematy Zod z `astro/zod`); definicje w `src/content.config.ts`, dane w `src/content/`. Identyfikator wpisu kolekcji = nazwa pliku. Niepoprawne dane przerywają budowę czytelnym komunikatem (`InvalidContentEntryDataError` ze ścieżką pola):
  - **biegi** (`runs`, `src/content/runs/<slug>.json`) — 10 biegów Korony + bieg wycofany. Pola: `name` (nazwa), `distanceKm` (opcjonalny), `location` (opcjonalne), `typicalMonth` (orientacyjny termin, tekst, opcjonalny), `status` (`completed` / `planned` / `unplanned`), `retired` (bieg wycofany z listy Korony, domyślnie `false`), `plannedDate` (opcjonalna data), `notes` (opcjonalne), `order` (opcjonalna pozycja do sortowania), `results` (lista wyników per osoba, domyślnie pusta). Wynik: `author` (referencja do `authors`), `completedDate`, `time` (HH:MM:SS), `resultsUrl` (opcjonalny URL). Reguły: jeden wynik na autora w danym biegu; status `completed` wymaga co najmniej jednego wyniku. Postęp „w duecie” (DEC-007) liczy się w kodzie (`src/lib/progress.ts`): bieg jest zaliczony, gdy wyniki mają wszyscy autorzy; mianownik `CROWN_TOTAL = 10`,
  - **wpisy** (`posts`, `src/content/posts/*.md`) — pola we frontmatter: `title` (tytuł), `date` (data), `authors` (lista referencji do `authors`, min. 1), `run` (opcjonalna referencja do `runs`), `images` (opcjonalna lista `{ src, alt }`; `src` to obraz z `src/` walidowany przez `image()`, `alt` wymagany); treść w Markdown w pliku,
  - **autorzy** (`authors`, `src/content/authors/<id>.json`) — dwie osoby (`damian`, `grzegorz`); pole `displayName` (nazwa wyświetlana); wpisy i wyniki odwołują się do nich przez `reference('authors')`.
  - Walidacja referencji: Astro samo tylko loguje `[ERROR] Invalid content reference` (kod wyjścia 0), dlatego `scripts/validate-content.mjs` (uruchamiany przez `prebuild` i `npm run check`) przerywa budowę z komunikatem po polsku (plik, pole, brakujący identyfikator), gdy `posts[].authors`, `posts[].run` lub `runs[].results[].author` wskazują nieistniejący wpis. Skrypt nie zastępuje walidacji schematu Astro.
- Routing (statyczny):
  - `/` — strona główna (wprowadzenie, licznik postępu X/10, oś czasu, wyniki indywidualne, 3 ostatnie wpisy),
  - `/biegi` i `/biegi/<id>` — lista biegów i szczegóły biegu (wyniki per osoba, powiązane wpisy),
  - `/blog` (strona 1), `/blog/strona/<n>` (od 2, po 10 wpisów) i `/blog/<id>` — lista z paginacją i wpis; unikać identyfikatora wpisu `strona`,
  - `/rss.xml` — kanał RSS (zależność `@astrojs/rss`, adres z `site` w `astro.config.mjs`),
  - `/404`, pomocniczy `/styleguide` (do usunięcia przed publikacją, TASK-010), panel `/admin` (TASK-008).
- Wspólny kod w `src/lib/`: `format.ts` (`formatDate`, strefa Europe/Warsaw — daty z kolekcji są parsowane jako UTC), `progress.ts` (licznik, sortowanie po `order`, wyniki autora), `runs.ts` (znaczniki statusu i dane biegu do wyświetlenia), `blog.ts` (pomocnicze funkcje wpisów).
- Brak stanu po stronie klienta poza samym panelem CMS.

## Backend

Brak własnego backendu. Jedyny element serwerowy to niewielka funkcja (Cloudflare Pages Function) obsługująca logowanie OAuth przez GitHub dla panelu CMS (DEC-009). Instrukcja wdrożenia: `docs/cms-setup.md`.

- **Panel CMS:** Sveltia CMS (wersja przypięta w `public/admin/index.html`, ładowana z CDN jsDelivr z sumą SRI); konfiguracja w `public/admin/config.yml` (backend GitHub, repozytorium `wojcickid/ultra-w-duecie`, gałąź `main`, zapis wprost jako commity). Wpisy to pakiety `src/content/posts/<slug>/index.md` z obrazami obok (ścieżki względne zgodne z `image()`); pełną konfigurację kolekcji dodaje TASK-008.
- **Funkcje OAuth** (`functions/`, routing plikowy Pages Functions, bez zależności i bez kroku budowy):
  - `GET /api/auth` — sprawdza `provider=github`, domenę (`site_id`) i konfigurację, losuje `state` (128 bitów, ciasteczko `oauth_state`: HttpOnly, Secure, SameSite=Lax, Path=/api, 10 minut) i przekierowuje (302) na `https://github.com/login/oauth/authorize` z `client_id`, `redirect_uri` (`<origin>/api/callback`), `scope=public_repo`, `state`, `allow_signup=false`.
  - `GET /api/callback` — porównuje `state` z zapytania z ciasteczkiem (porównanie w stałym czasie), wymienia `code` na token (`POST https://github.com/login/oauth/access_token`) i zwraca stronę, która przekazuje token do okna panelu przez `postMessage` (protokół `authorizing:github` / `authorization:github:success|error:<JSON>`), wyłącznie originowi z listy dozwolonych.
  - `functions/_shared/oauth.ts` — wspólny kod (odczyt konfiguracji, `state`, ciasteczka, odpowiedź HTML z CSP z nonce).
- **Zmienne środowiskowe** (Cloudflare Pages → Settings → Variables and Secrets, środowisko Production):
  - `GITHUB_CLIENT_ID` (tekst) i `GITHUB_CLIENT_SECRET` (Secret) — dane aplikacji OAuth z GitHuba,
  - `ALLOWED_ORIGIN` — origin panelu, np. `https://korona.damianwojcicki.com` (kilka wartości po przecinku; gdy brak, przyjmowany jest origin żądania).
- **Lokalne uruchomienie funkcji:** `npm run build`, potem `npx wrangler pages dev dist --binding GITHUB_CLIENT_ID=... --binding GITHUB_CLIENT_SECRET=... --binding ALLOWED_ORIGIN=...` (bez logowania do Cloudflare; wartości testowe).

## Baza danych

Brak. Źródłem danych są pliki Markdown/JSON w repozytorium (kolekcje treści). Historia zmian i kopia zapasowa zapewnia Git. Rola „Database Agent” nie jest w tym projekcie używana.

## Analityka

**Cloudflare Web Analytics** — bez cookies i bez zbierania danych osobowych (DEC-002).

## Wdrożenie

- **Dev:** lokalnie (`astro dev`), opcjonalnie na własnym serwerze (Proxmox) — nie jest wymagane.
- **Prod:** Cloudflare Pages pod subdomeną istniejącej domeny właściciela (DEC-006); dedykowana domena może zastąpić subdomenę później. Automatyczna publikacja po zmianie na gałęzi `main`.
- **Podgląd:** Cloudflare Pages tworzy adresy podglądu dla gałęzi (do sprawdzania zmian przed merge).
- Środowiska: dev (lokalnie) i prod. Środowisko testowe zastępują podglądy gałęzi.
- Repozytorium: GitHub (prywatne lub publiczne — do decyzji użytkownika; przy publicznym treść źródłowa jest jawna, nie zawiera sekretów).

## Bezpieczeństwo

- Publiczna strona jest statyczna: brak formularzy, sesji i danych użytkowników — minimalna powierzchnia ataku.
- Dostęp do zapisu treści ma wyłącznie osoba z uprawnieniami zapisu w repozytorium GitHub; logowanie do panelu przez konto GitHub (zalecane włączenie 2FA). Na start jedno konto (właściciel); drugi autor może zostać dodany później jako współpracownik repozytorium.
- Sekrety (identyfikator i sekret aplikacji OAuth GitHub) przechowywane wyłącznie w ustawieniach Cloudflare, nigdy w repozytorium.
- Funkcje OAuth (DEC-009): losowy `state` z ciasteczka HttpOnly chroni przed CSRF; stały, minimalny zakres `public_repo` (zakres z żądania jest ignorowany); token trafia tylko do originu z `ALLOWED_ORIGIN` (weryfikowany po stronie okna logowania na podstawie `event.origin`, którego nie da się podrobić), dodatkowo sprawdzana jest domena (`site_id`); sekrety i tokeny nie są logowane ani zwracane w błędach (komunikaty stałe); odpowiedzi mają `Cache-Control: no-store`, `Referrer-Policy: no-referrer` i CSP z nonce. Zalogować przez aplikację OAuth może każdy użytkownik GitHuba, ale zapis w repozytorium zależy od uprawnień jego konta na GitHubie.
- `/admin` ma nagłówki `X-Robots-Tag: noindex`, `X-Frame-Options: DENY`, `Referrer-Policy: same-origin` (`public/_headers`) i `<meta name="robots">`; skrypt panelu jest przypięty do wersji i chroniony sumą SRI.
- Ochrona gałęzi `main`: blokada force-push i usuwania gałęzi. Wymóg pull requesta zablokowałby zapis z panelu (commity wprost na `main`), więc na MVP go nie włączamy.
- Brak danych wrażliwych i osobowych czytelników.

## Kopie zapasowe

Wszystko (treść, obrazy, kod) jest w repozytorium Git. Zalecana dodatkowa kopia poza GitHubem: okresowy mirror repozytorium na własnym serwerze (Proxmox) — patrz TASK-012.

## Obserwowalność

- Logi budowy i wdrożeń: panel Cloudflare Pages.
- Statystyki odwiedzin: Cloudflare Web Analytics.
- Monitoring dostępności: opcjonalnie darmowy monitor zewnętrzny (poza zakresem MVP).

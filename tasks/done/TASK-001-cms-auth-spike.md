# TASK-001 — Spike: logowanie do panelu CMS przez GitHub na Cloudflare Pages

## Status

done

## Owner

frontend-agent

## Dependencies

- Użytkownik: zdalne repozytorium GitHub, konto Cloudflare, konto GitHub właściciela z 2FA (drugie konto niewymagane na start, DEC-006)

## Description

Zbadać (aktualna dokumentacja) i przygotować w kodzie projektu panel CMS (Decap CMS vs Sveltia CMS) z logowaniem przez GitHub OAuth na Cloudflare Pages: wybrać CMS i sposób obsługi OAuth (Pages Function), zbudować minimalny panel `/admin` na prawdziwym projekcie (nie na osobnej stronie testowej) oraz napisać instrukcję konfiguracji krok po kroku dla właściciela (GitHub OAuth App, Cloudflare Pages, zmienne środowiskowe).

Uwaga o zakresie: agent nie ma dostępu do kont Cloudflare/GitHub. Kroki w panelach (utworzenie aplikacji OAuth, projektu Pages, ustawienie sekretów) wykonuje właściciel według instrukcji; weryfikację na żywo (kryteria 1 i 4) wykonuje Lead wspólnie z właścicielem po wdrożeniu. Do tego czasu zadanie zostaje w `in-progress`.

## Context

DEC-001 przyjmuje architekturę statyczną z CMS opartym na Git. Ryzyko: konfiguracja OAuth proxy na Cloudflare. Sekrety tylko w ustawieniach Cloudflare.

## Acceptance criteria

- [x] Panel `/admin` pozwala zalogować się kontem GitHub i zapisać zmianę jako commit (potwierdzone na produkcji przez właściciela, 2026-09-20).
- [x] Wybrano CMS (Decap lub Sveltia) i zapisano uzasadnienie w `docs/decisions.md` (nowe DEC).
- [x] Instrukcja konfiguracji OAuth krok po kroku (bez sekretów) dodana do dokumentacji.
- [x] Zweryfikowano, że osoba bez uprawnień zapisu w repozytorium nie może zapisać zmian (2026-09-20: przy logowaniu innym kontem GitHub panel pokazał „Wystąpił błąd podczas ładowania danych witryny: nie masz dostępu do repozytorium ultra-w-duecie”; zapis niemożliwy).

## Implementation notes

Stan: przygotowano kod i instrukcję; weryfikacja na żywo (kryteria 1 i 4) po wdrożeniu przez Leada z właścicielem.

### Wynik badania (dokumentacja z 2026-09-20)

Wybór: **Sveltia CMS 0.217.0** + własna **Pages Function** OAuth (DEC-009).

- Decap CMS 3.16.2: utrzymywany (wydanie 2026-09-14), ale plik ~5,2 MB (1,5 MB gzip) wobec ~2,1 MB (617 kB gzip) Sveltia; brak wbudowanego OAuth poza Netlify, dokumentacja odsyła do projektów społeczności. Źródła: https://github.com/decaporg/decap-cms, https://www.npmjs.com/package/decap-cms, https://decapcms.org/docs/external-oauth-clients/
- Sveltia CMS: MIT, wydanie z 2026-09-19 (npm z atestacją pochodzenia), zgodny z konfiguracją Decap, interfejs po polsku (język z przeglądarki; opcja `locale` jest ignorowana), commity GitHub podpisywane, `auth_scope`, logowanie tokenem osobistym bez proxy (metoda awaryjna). Wersja jeszcze 0.x ("feature complete"). Źródła: https://github.com/sveltia/sveltia-cms, https://sveltiacms.app/en/docs/backends/github, https://sveltiacms.app/en/docs/security, https://sveltiacms.app/llms-full.txt
- OAuth proxy: oficjalny `sveltia-cms-auth` to osobny **Cloudflare Worker** (nie Pages Function), zmienne `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `ALLOWED_DOMAINS`, domyślny zakres `repo,user`, `state` w ciasteczku (kod przeczytany: https://github.com/sveltia/sveltia-cms-auth). Protokół (`/auth?provider&site_id&scope`, `postMessage` `authorizing:github` / `authorization:github:<status>:<JSON>`) jest prosty, więc zamiast osobnego Workera napisano własne, krótkie funkcje w `functions/` (Pages Functions: routing plikowy, https://developers.cloudflare.com/pages/functions/routing/). Nie ma potrzeby drugiego serwisu.
- Media/Astro: Sveltia dla `public_folder` na poziomie globalnym odrzuca ścieżki `./` i `../` (błąd konfiguracji), więc ścieżka względna od pliku wpisu (wymagana przez `image()`) uzyskiwana jest układem "pakietu": `src/content/posts/<slug>/index.md` + obrazy obok, `media_folder: ''` i `public_folder: ''` (https://sveltiacms.app/en/docs/media/internal). Sprawdzone w Astro 7 na próbnym wpisie: id wpisu = `<slug>` (przyrostek `/index` pomijany), a `src: cover.png` (sama nazwa pliku) przechodzi walidację `image()`; nieistniejący plik daje `ImageNotFound`. Wpis próbny usunięty. Odstępstwo od zaleceń zadania (`src/assets/posts`): obrazy leżą obok wpisu; do potwierdzenia przy TASK-008.
- Cloudflare: instrukcje kroków wg dokumentacji Pages (Git integration, Custom domains, Variables and Secrets, Web Analytics one-click, domyślny Node 22.16): https://developers.cloudflare.com/pages/

### Co dodano

- `public/admin/index.html` (Sveltia 0.217.0 z jsDelivr, SRI sha384, `noindex`), `public/admin/config.yml` (minimalna kolekcja `posts`), `public/_headers` (nagłówki dla `/admin`).
- `functions/api/auth.ts`, `functions/api/callback.ts`, `functions/_shared/oauth.ts` (bez zależności; typy własne, bez `@cloudflare/workers-types`).
- `docs/cms-setup.md`, DEC-009 w `docs/decisions.md`, sekcje Przegląd/Backend/Bezpieczeństwo w `docs/architecture.md`, `.gitignore` (`.wrangler/`, `.dev.vars`).
- Nowe zależności: brak (wrangler tylko przez `npx` do testu lokalnego).

### Własny przegląd bezpieczeństwa funkcji OAuth

- `state`: 128 bitów z `crypto.getRandomValues`, ciasteczko HttpOnly + Secure + SameSite=Lax, Path=/api, 10 min; w callbacku porównanie w stałym czasie; brak ciasteczka/niezgodność = błąd, ciasteczko czyszczone po każdej odpowiedzi callbacku. Przetestowane: brak ciasteczka i niezgodny `state` dają `CSRF_DETECTED` bez wywołania GitHuba.
- Zakres: zawsze stały `public_repo` (żądany `scope` ignorowany; test z `scope=repo,user` daje `scope=public_repo`). Nie daje dostępu do prywatnych repozytoriów. Ryzyko do sprawdzenia na żywo: czy `public_repo` wystarcza Sveltia do odczytu profilu i zapisu commitów (spodziewane tak; w razie problemu zmienić na `repo` w `OAUTH_SCOPE`).
- Origin: token wysyłany `postMessage` tylko do `event.origin` z listy `ALLOWED_ORIGIN` (origin zdarzenia ustawia przeglądarka, nie da się go podrobić); test w symulowanym oknie: dozwolony origin dostaje token, obcy nie. Dodatkowo `site_id` (hostname) sprawdzany w `/api/auth`; domyślnie (brak `ALLOWED_ORIGIN`) dozwolony jest tylko origin żądania.
- Wyciek sekretów: brak `console.*`; sekret używany wyłącznie w treści żądania do GitHuba (JSON, HTTPS); komunikaty błędów stałe (nie powielają odpowiedzi GitHuba ani parametrów); `redirect_uri` zbudowany z origin żądania. Sprawdzono, że log lokalnego serwera nie zawiera wartości sekretu.
- XSS/osadzanie: dane w skrypcie serializowane `JSON.stringify` z ucieczką `<`, komunikaty w HTML escapowane, CSP `default-src 'none'; script-src 'nonce-...'`, `Cache-Control: no-store`, `Referrer-Policy: no-referrer`; skrypt panelu w `index.html` przypięty z SRI.
- Ograniczenia: zalogować się przez aplikację OAuth może każdy użytkownik GitHuba; zapis w repozytorium blokuje GitHub (brak uprawnień). Brak limitowania żądań do `/api/auth` (funkcja tylko przekierowuje, koszt znikomy; w razie nadużyć reguła WAF/Rate limiting w Cloudflare). Wymiana kodu bez PKCE (GitHub OAuth Apps nie wspierają PKCE dla tego przepływu).

### Do wykonania po wdrożeniu (Lead z właścicielem)

- Kroki z `docs/cms-setup.md` (Pages, domena, aplikacja OAuth, zmienne, Web Analytics), następnie kryteria 1 i 4.
- Sprawdzić na żywo: układ pakietu w panelu (utworzenie wpisu ze zdjęciem tworzy `src/content/posts/<slug>/index.md` + obraz obok, a `npm run build` przechodzi), pole `type: date` w `datetime`, czy `auth_scope` działa z Sveltia 0.217.0.
- Nie scalono ani nie wypchnięto gałęzi (DEC-003).

## Validation

### Tests

- `npm run lint`, `npm run format:check`, `npm run check` (0 błędów), `npm run build` (17 stron, `dist/admin/index.html`, `dist/admin/config.yml`, `dist/_headers` obecne): bez błędów.
- Lokalnie `npx wrangler pages dev dist` (bez logowania, wartości testowe, proces zatrzymany po teście): `/api/auth` -> 302 na `https://github.com/login/oauth/authorize` z `client_id`, `redirect_uri`, `scope=public_repo`, `state` i ciasteczkiem `oauth_state`; zły `site_id`/`provider` -> błąd `UNSUPPORTED_DOMAIN`/`UNSUPPORTED_BACKEND`; `/api/callback` bez ciasteczka lub z niezgodnym `state` -> `CSRF_DETECTED`; poprawny `state` z fałszywym kodem -> `TOKEN_REQUEST_FAILED` (GitHub odrzucił kod); `/admin/` i `/admin/config.yml` serwowane z nagłówkami `_headers`; plik `_shared` nie tworzy trasy.
- Test skryptu okna logowania w symulowanym `window` (Node): token przekazany tylko dozwolonemu originowi.
- Nie sprawdzono (wymaga kont): logowanie GitHub i zapis commita, odmowa zapisu bez uprawnień, ładowanie Sveltia i schematu `config.yml` w przeglądarce.

### Review

- Not reviewed

## Outcome

Complete this section before moving the task to `done`.

- Summary:
- Tests:
- Important files:
- Commit:
- Follow-up tasks:

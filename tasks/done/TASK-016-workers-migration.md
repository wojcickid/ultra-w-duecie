# TASK-016 — Przejście z Cloudflare Pages Functions na Workers (static assets)

## Status

done

## Owner

frontend-agent

## Dependencies

- TASK-001 (kod panelu i funkcji OAuth)

## Description

Kreator Cloudflare dla nowych projektów tworzy Workera (wdrożenie `npx wrangler deploy`, build z Git przez Workers Builds), a nie projekt Pages. Funkcje OAuth z `functions/` (format Pages Functions) nie zadziałają w takim wdrożeniu. Dodać `wrangler.jsonc` i punkt wejścia Workera obsługujący `/api/auth` i `/api/callback`, a pozostały ruch oddawać statycznym plikom z `dist/`.

## Context

Dokumentacja: https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/ (nowe projekty rekomendowane na Workers). Kluczowe różnice: `assets.directory` zamiast `pages_build_output_dir`; domyślnie zasoby statyczne są serwowane przed Workerem (`assets.run_worker_first`); zmienne środowiskowe czasu budowy i działania są rozdzielone; własna domena wymaga strefy w Cloudflare (jest: damianwojcicki.com); zwykłe zmienne w dashboardzie mogą być nadpisane przez `wrangler deploy` z `vars` w konfiguracji, sekrety są zachowywane.

## Acceptance criteria

- [x] `wrangler.jsonc` z nazwą `ultra-w-duecie`, `assets.directory: ./dist`, obsługą 404 dla statycznej strony Astro i przekazywaniem do Workera tylko `/api/*`.
- [x] Punkt wejścia Workera (`worker/index.ts` lub równoważny) używa istniejących handlerów; zachowanie `/api/auth` i `/api/callback` bez zmian (cookie `Path=/api`, stały zakres `public_repo`, weryfikacja `state`).
- [x] `ALLOWED_ORIGIN` w `vars` (jawne); `GITHUB_CLIENT_ID` i `GITHUB_CLIENT_SECRET` wyłącznie jako Secrets w dashboardzie (zmiana założenia od Leada: żadna wartość nie trafia do repozytorium).
- [x] Katalog `functions/` usunięty lub przeniesiony tak, by nie powodował niejednoznaczności; `public/_headers` nadal działa.
- [x] `npm run build`, `lint`, `format:check`, `check` bez błędów; lokalny test `npx wrangler dev` (bez logowania do Cloudflare) potwierdza przekierowanie `/api/auth`, `CSRF_DETECTED` w `/api/callback` i serwowanie `/`, `/admin/`, `/404`.
- [x] `docs/cms-setup.md`, `docs/architecture.md` i DEC-009 zaktualizowane (kroki dla kreatora Workers, gdzie wpisać zmienne i sekret, domena niestandardowa, Web Analytics).

## Implementation notes

### Wynik badania dokumentacji Cloudflare (2026-09-20)

- Migracja z Pages (https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/): nowe projekty rekomendowane na Workers; `assets.directory` zamiast `pages_build_output_dir`; domyślnie static assets są serwowane PRZED Workerem; `not_found_handling` trzeba ustawić jawnie (`404-page`); `_headers` i `_redirects` działają natywnie w katalogu assets; `ASSETS` trzeba zadeklarować (`assets.binding`); `wrangler dev` zastępuje `wrangler pages dev`.
- Routing (https://developers.cloudflare.com/workers/static-assets/routing/worker-script/): `run_worker_first` jako tablica wzorców (u nas `["/api/*"]`) uruchamia Workera tylko dla tych ścieżek; wzorce z `!` wykluczają.
- Konfiguracja (https://developers.cloudflare.com/workers/wrangler/configuration/): `name`, `main`, `compatibility_date`, `assets`, `vars`, `keep_vars`, `observability`. `html_handling`: domyślne `auto-trailing-slash`; ustawiono `drop-trailing-slash` (linki w serwisie nie mają ukośnika; bez tego każde kliknięcie w menu robiłoby przekierowanie 307).
- Workers Builds (https://developers.cloudflare.com/workers/ci-cd/builds/, .../configuration/, .../build-image/): pola Build command, Deploy command (`npx wrangler deploy`), Non-production branch deploy command (`npx wrangler versions upload`), Root directory, API token tworzony automatycznie; nazwa Workera w panelu MUSI być zgodna z `name` w konfiguracji; zmienne budowy nie są dostępne w czasie działania (osobne Variables and Secrets Workera); domyślny Node w obrazie budowy to 24.18 (22.23 też zainstalowany), zmiana przez `NODE_VERSION` lub `.nvmrc`.
- Zmienne i sekrety: `wrangler deploy` traktuje plik konfiguracji jako źródło prawdy dla zwykłych `vars` (zmienne dodane tylko w dashboardzie są usuwane, chyba że `keep_vars: true`); Secrets z dashboardu NIE są usuwane przez deploy, o ile w `vars` nie ma zmiennej o tej samej nazwie (wyjaśnienie zespołu Cloudflare w https://github.com/cloudflare/workers-sdk/issues/8871, komentarz z 2025-09-26). Dokumentacja Workers Builds nie opisuje tego wprost. Zgłaszany błąd: `wrangler versions upload` (budowy gałęzi podglądu) usuwał zmienne/sekrety z dashboardu; poprawka (PR #10865, `versions upload` respektuje `keep_vars`) scalona 2025-10-03, ale w 2026 nadal pojawiają się zgłoszenia. Wniosek: sekrety w dashboardzie, brak `keep_vars` (mało pomaga i komplikuje), ostrzeżenie w instrukcji o wyłączeniu budowy gałęzi innych niż `main`.
- Custom domain Workera (https://developers.cloudflare.com/workers/configuration/routing/custom-domains/): Settings → Domains & Routes → Add → Custom Domain; wymaga aktywnej strefy w koncie; DNS i certyfikat tworzą się automatycznie; nie da się dodać na hostname z istniejącym rekordem CNAME. Alternatywa (nieużyta): `routes: [{ pattern, custom_domain: true }]` w `wrangler.jsonc`.
- Web Analytics (https://developers.cloudflare.com/web-analytics/get-started/): automatyczne wstrzykiwanie skryptu dla hostów przechodzących przez proxy Cloudflare (Add a site → hostname → Done); dla Pages jest osobny przycisk w Metrics. Dokumentacja NIE opisuje wprost Workerów ze static assets; nie działa dla DNS-only ani przy `Cache-Control: public, no-transform`; alternatywa: ręczny skrypt `beacon.min.js` z `data-cf-beacon` (token) w układzie (wymaga tokenu i zmiany w `src/`, poza zakresem tego zadania). Do potwierdzenia na żywo.
- Wrangler w Workers Builds: dokumentacja nie mówi, skąd bierze się `wrangler` dla `npx wrangler deploy`. Odnotowany przypadek błędu „wrangler: not found”, gdy nie był w devDependencies. Dlatego `wrangler` dodano do devDependencies (`^4.135.0`, engines Node >=22; lockfile przypina wersję), co daje też powtarzalne budowy i lokalny `wrangler dev` bez pobierania.

### Decyzje

- `compatibility_date: 2026-09-18` = data zainstalowanego workerd (1.20260918.1); nowsza data nie byłaby wspierana lokalnie.
- `observability.enabled: false`: adres `/api/callback` zawiera jednorazowy kod GitHuba; funkcje i tak nie logują sekretów.
- `keep_vars` nie ustawiono (domyślnie false): w `vars` jest tylko `ALLOWED_ORIGIN`, plik jest źródłem prawdy; zmiana `ALLOWED_ORIGIN` w dashboardzie zostałaby cofnięta przy następnym wdrożeniu. Sekrety nie zależą od `keep_vars`. Nie użyto `secrets.required` w konfiguracji (mogłoby zatrzymać pierwsze wdrożenie bez sekretów).
- `git mv` kodu z `functions/` do `worker/` (auth.ts, callback.ts, oauth.ts); zmiany: `onRequestGet` -> `handleAuth`/`handleCallback`, wspólny `isOAuthConfigured` (type guard; brak któregokolwiek sekretu -> `MISCONFIGURED_CLIENT` jak dotąd). Nowe: `worker/index.ts` (404 dla nieznanych `/api/*`, 405 + `Allow: GET` dla innych metod, reszta `env.ASSETS.fetch`). Własne typy, bez `@cloudflare/workers-types`.
- Poprawki pomocnicze: `.wrangler/` dodano do ignorowanych w eslint, prettier i tsconfig (katalog tymczasowy `wrangler dev`); jeden komentarz w `public/admin/config.yml` (bez zmian w konfiguracji) zaktualizowano z „Pages Function” na „Worker”.

### Ryzyka

- Pierwsze wdrożenie bez sekretów przechodzi (potwierdzone `wrangler deploy --dry-run`: brak wymaganych sekretów; lokalnie bez `.dev.vars` `/api/auth` zwraca `MISCONFIGURED_CLIENT`); prawdziwe wdrożenie do potwierdzenia na żywo.
- Sekrety a budowy gałęzi podglądu (`wrangler versions upload`): patrz wyżej; instrukcja opisuje ponowne wpisanie sekretów i wyłączenie budów innych gałęzi.
- Web Analytics dla Workera: do potwierdzenia na żywo, plan awaryjny ręczny skrypt.
- Adres `*.workers.dev` serwuje stronę (`workers_dev` domyślnie włączone); panel tam nie działa (`ALLOWED_ORIGIN`). Do rozważenia wyłączenie po uruchomieniu domeny.
- Dokumenty historyczne (DEC-001, DEC-006, TASK-001, TASK-009 backlog) nadal wspominają Pages; TASK-009 wymaga aktualizacji przez Leada (Worker zamiast Pages).

## Validation

### Tests

- `npm ci`, `npm run build` (17 stron): OK. `npm run lint`, `npm run format:check`, `npm run check` (0 błędów): OK. `npx wrangler deploy --dry-run` (bez logowania): konfiguracja poprawna, 40 plików assets, bindingi ASSETS i ALLOWED_ORIGIN.
- `npx wrangler dev --local` (127.0.0.1:8799, wartości testowe w `.dev.vars`, niecommitowane; procesy zatrzymane po PID):
  - `/api/auth?provider=github&site_id=<host>` -> 302 na `github.com/login/oauth/authorize` z `client_id`, `redirect_uri=<origin>/api/callback`, `scope=public_repo` (parametr `scope=repo` z żądania zignorowany), `state`, `allow_signup=false`; ciasteczko `oauth_state=...; Max-Age=600; HttpOnly; Secure; SameSite=Lax; Path=/api`; `Cache-Control: no-store`. Sprawdzone też z produkcyjnym `ALLOWED_ORIGIN` z `wrangler.jsonc` i `site_id=korona.damianwojcicki.com`.
  - Zły `site_id` -> `UNSUPPORTED_DOMAIN`, zły `provider` -> `UNSUPPORTED_BACKEND`; bez sekretów -> `MISCONFIGURED_CLIENT` (także w `/api/callback` po poprawnym `state`).
  - `/api/callback` bez ciasteczka lub z niezgodnym `state` -> `CSRF_DETECTED` (odpowiedź z CSP z nonce, czyszczące ciasteczko, bez połączenia z GitHubem). Wymiana kodu na token z prawdziwym GitHubem nie była testowana (brak kont); kod bez zmian względem TASK-001.
  - `/api/nieistnieje`, `/api/`, `/api` -> 404 (puste, `no-store`); `POST /api/auth` -> 405 z `Allow: GET`.
  - Statyczne: `/`, `/biegi`, `/blog`, `/admin`, `/admin/config.yml`, `/rss.xml`, `/favicon.svg` -> 200; `/nieistnieje` i `/blog/nieistnieje` -> 404 ze strony 404 (tytuł „Nie znaleziono strony”); `/_headers` -> 404 (nie jest serwowany); `/admin` i `/admin/config.yml` mają nagłówki `x-robots-tag: noindex, nofollow`, `x-frame-options: DENY`, `referrer-policy: same-origin`, strona główna ich nie ma; `/biegi/`, `/blog/` i `/admin/` -> 307 na wersję bez ukośnika.
- Nie testowano: prawdziwego wdrożenia, domeny, Web Analytics, logowania do GitHuba (wymagają kont; Lead z właścicielem).

### Review

- Lead (2026-09-20): diff w zakresie; build (17 stron), lint, format:check, astro check i `wrangler deploy --dry-run` bez błędów; test lokalny `wrangler dev --local` powtórzony niezależnie (trasy statyczne, 302 do GitHuba z `scope=public_repo` i cookie `Path=/api`, `UNSUPPORTED_DOMAIN`, `CSRF_DETECTED`, nagłówki `/admin`); procesy testowe zatrzymane po PID. Kryteria wymagające kont (wdrożenie, domena, Web Analytics, logowanie) zweryfikowane zostaną na żywo w TASK-001/TASK-009. Zaakceptowane.

## Outcome

Complete this section before moving the task to `done`.

- Summary:
- Tests:
- Important files:
- Commit: 777f3b5, 76bb693 (gałąź agent/frontend/TASK-016-workers-migration)
- Follow-up tasks: TASK-009 (wdrożenie i Web Analytics na żywo); rozważyć `workers_dev: false` po uruchomieniu domeny; jeśli Web Analytics nie wstrzyknie się automatycznie, mały skrypt w układzie strony.

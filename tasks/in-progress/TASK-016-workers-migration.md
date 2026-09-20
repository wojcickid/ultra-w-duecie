# TASK-016 — Przejście z Cloudflare Pages Functions na Workers (static assets)

## Status

in-progress

## Owner

frontend-agent

## Dependencies

- TASK-001 (kod panelu i funkcji OAuth)

## Description

Kreator Cloudflare dla nowych projektów tworzy Workera (wdrożenie `npx wrangler deploy`, build z Git przez Workers Builds), a nie projekt Pages. Funkcje OAuth z `functions/` (format Pages Functions) nie zadziałają w takim wdrożeniu. Dodać `wrangler.jsonc` i punkt wejścia Workera obsługujący `/api/auth` i `/api/callback`, a pozostały ruch oddawać statycznym plikom z `dist/`.

## Context

Dokumentacja: https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/ (nowe projekty rekomendowane na Workers). Kluczowe różnice: `assets.directory` zamiast `pages_build_output_dir`; domyślnie zasoby statyczne są serwowane przed Workerem (`assets.run_worker_first`); zmienne środowiskowe czasu budowy i działania są rozdzielone; własna domena wymaga strefy w Cloudflare (jest: damianwojcicki.com); zwykłe zmienne w dashboardzie mogą być nadpisane przez `wrangler deploy` z `vars` w konfiguracji, sekrety są zachowywane.

## Acceptance criteria

- [ ] `wrangler.jsonc` z nazwą `ultra-w-duecie`, `assets.directory: ./dist`, obsługą 404 dla statycznej strony Astro i przekazywaniem do Workera tylko `/api/*`.
- [ ] Punkt wejścia Workera (`worker/index.ts` lub równoważny) używa istniejących handlerów; zachowanie `/api/auth` i `/api/callback` bez zmian (cookie `Path=/api`, stały zakres `public_repo`, weryfikacja `state`).
- [ ] `GITHUB_CLIENT_ID` i `ALLOWED_ORIGIN` w `vars` (jawne), `GITHUB_CLIENT_SECRET` wyłącznie jako Secret w dashboardzie (nigdy w repozytorium).
- [ ] Katalog `functions/` usunięty lub przeniesiony tak, by nie powodował niejednoznaczności; `public/_headers` nadal działa.
- [ ] `npm run build`, `lint`, `format:check`, `check` bez błędów; lokalny test `npx wrangler dev` (bez logowania do Cloudflare) potwierdza przekierowanie `/api/auth`, `CSRF_DETECTED` w `/api/callback` i serwowanie `/`, `/admin/`, `/404`.
- [ ] `docs/cms-setup.md`, `docs/architecture.md` i DEC-009 zaktualizowane (kroki dla kreatora Workers, gdzie wpisać zmienne i sekret, domena niestandardowa, Web Analytics).

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

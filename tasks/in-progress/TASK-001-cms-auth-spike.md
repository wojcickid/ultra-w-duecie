# TASK-001 — Spike: logowanie do panelu CMS przez GitHub na Cloudflare Pages

## Status

in-progress

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

- [ ] Panel `/admin` na stronie testowej pozwala zalogować się kontem GitHub i zapisać zmianę jako commit.
- [ ] Wybrano CMS (Decap lub Sveltia) i zapisano uzasadnienie w `docs/decisions.md` (nowe DEC).
- [ ] Instrukcja konfiguracji OAuth krok po kroku (bez sekretów) dodana do dokumentacji.
- [ ] Zweryfikowano, że osoba bez uprawnień zapisu w repozytorium nie może zapisać zmian.

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

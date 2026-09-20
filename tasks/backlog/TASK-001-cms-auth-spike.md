# TASK-001 — Spike: logowanie do panelu CMS przez GitHub na Cloudflare Pages

## Status

backlog

## Owner

frontend-agent

## Dependencies

- Użytkownik: zdalne repozytorium GitHub, konto Cloudflare, konto GitHub właściciela z 2FA (drugie konto niewymagane na start, DEC-006)

## Description

Zweryfikować w praktyce działanie panelu CMS (Decap CMS vs Sveltia CMS) z logowaniem przez GitHub OAuth na Cloudflare Pages, na minimalnej stronie testowej. Wybrać CMS i sposób obsługi OAuth (Pages Function/Worker) oraz opisać kroki konfiguracji.

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

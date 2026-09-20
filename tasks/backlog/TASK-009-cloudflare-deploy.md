# TASK-009 — Wdrożenie na Cloudflare (Worker ze static assets), domena i analityka

## Status

backlog

## Owner

lead-agent

## Dependencies

- TASK-002
- Użytkownik: zdalne repozytorium GitHub oraz wybór nazwy subdomeny (domena damianwojcicki.com ma DNS w Cloudflare)

## Description

Wdrożyć repozytorium jako Worker ze static assets przez Workers Builds (automatyczna publikacja z `main`; budowy gałęzi innych niż `main` rozważyć wyłączyć, patrz `docs/cms-setup.md`), podpiąć subdomenę istniejącej domeny właściciela (Custom domain Workera) oraz włączyć Cloudflare Web Analytics. Przygotować instrukcję kroków wykonywanych ręcznie przez użytkownika (DNS jest w Cloudflare, więc rekord subdomeny dodaje się automatycznie po dodaniu Custom domain w Workerze).

## Context

DEC-001, DEC-002, DEC-006. MVP na subdomenie istniejącej domeny — bez dodatkowego kosztu. Ewentualny zakup osobnej domeny (~11 USD/rok) dopiero później i wyłącznie przez użytkownika. Agent nie wykonuje płatności.

## Acceptance criteria

- [ ] Push na `main` publikuje stronę automatycznie.
- [ ] Strona dostępna pod wybraną subdomeną przez HTTPS.
- [ ] Web Analytics włączona, bez cookies i baneru zgody.
- [ ] Instrukcja kroków ręcznych w dokumentacji (bez sekretów).

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

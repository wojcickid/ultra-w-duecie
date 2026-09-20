# TASK-009 — Wdrożenie na Cloudflare Pages, domena i analityka

## Status

backlog

## Owner

lead-agent

## Dependencies

- TASK-002
- Użytkownik: zdalne repozytorium GitHub oraz wybór nazwy subdomeny (domena damianwojcicki.com ma DNS w Cloudflare)

## Description

Podłączyć repozytorium do Cloudflare Pages (automatyczna publikacja z `main`, podglądy gałęzi), podpiąć subdomenę istniejącej domeny właściciela oraz włączyć Cloudflare Web Analytics. Przygotować instrukcję kroków wykonywanych ręcznie przez użytkownika (DNS jest w Cloudflare, więc rekord subdomeny dodaje się automatycznie po podpięciu domeny w Pages).

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

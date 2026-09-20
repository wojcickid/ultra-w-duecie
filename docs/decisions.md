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

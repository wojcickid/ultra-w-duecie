# Stan projektu — Ultra w duecie

Punkt odzyskiwania stanu dla długotrwałej pracy agentów.

## Aktualny kamień milowy

M0 — Planowanie zakończone; oczekuje na akceptację planu przez użytkownika.

## Aktualny status

- Zebrano wymagania (`docs/project-brief.md`), uzupełniono `requirements.md`, `architecture.md`, `ui.md`, `decisions.md`.
- Przygotowano backlog zadań TASK-001 … TASK-013 w `tasks/backlog/`.
- Użytkownik odpowiedział na pytania: GitHub login, role równorzędne, język (DEC-005), autor wpisu, subdomena na MVP, jedno konto GitHub na start (DEC-006).
- Rozstrzygnięte: licznik „w duecie” tylko biegi wspólne (DEC-007), Bieg 7 Dolin jako wycofany z listy (DEC-008), autorzy Damian i Grzegorz, domena damianwojcicki.com w Cloudflare.
- Otwarte: nazwa subdomeny (wybór właściciela), wolny slot po Biegu 7 Dolin (odłożone), dane ukończonych biegów (po MVP, TASK-013).
- Użytkownik zaakceptował TASK-001 i TASK-002; oba w `tasks/ready/`. MVP na subdomenie `korona.damianwojcicki.com` (do potwierdzenia przy TASK-009).
- Implementacja nie rozpoczęta.

## Aktywne zadania

- Brak

## Ostatnio ukończone

- Inicjalizacja repozytorium z szablonem zespołu agentów.
- Ustalenie architektury (DEC-001…DEC-004).

## Zablokowane

- Brak zadań zablokowanych. Do startu implementacji potrzebne odpowiedzi użytkownika (patrz „Następna zalecana akcja”).

## Ważne decyzje

- Patrz `docs/decisions.md`.

## Ostatnia walidacja

- Testy: n/d (brak kodu)
- Build: n/d
- Lint/typy: n/d

## Następna zalecana akcja

1. Użytkownik zakłada zdalne repozytorium GitHub, włącza 2FA na koncie GitHub i wypycha `main` (oraz gałąź z dokumentacją).
2. Start TASK-002 (szkielet Astro) — niczego nie wymaga od użytkownika.
3. Start TASK-001 (logowanie do panelu CMS) po założeniu repozytorium GitHub.

> Aktualizuj ten plik przed zakończeniem większej sesji pracy lub po istotnej zmianie stanu projektu.

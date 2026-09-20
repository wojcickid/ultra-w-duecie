# Stan projektu — Ultra w duecie

Punkt odzyskiwania stanu dla długotrwałej pracy agentów.

## Aktualny kamień milowy

M1 — Front MVP: szkielet, model treści i layout gotowe; trwa budowa stron (strona główna, biegi, blog).

## Aktualny status

- Zamknięte: TASK-002 (szkielet Astro 7 + Tailwind 4), TASK-003 (kolekcje `authors`/`runs`/`posts`), TASK-004 (layout, tokeny, komponenty; paleta tymczasowa, TASK-015).
- Zescalone do `main` lokalnie; zdalne repo: `git@github.com:wojcickid/ultra-w-duecie.git` (push tylko na polecenie użytkownika).
- Uruchomione równolegle: TASK-005 (strona główna), TASK-006 (biegi), TASK-007 (blog), każde na własnej gałęzi/worktree w `C:\Users\wojci\Claude\ultra-worktrees\`.
- Wspólne narzędzie: `src/lib/format.ts` (`formatDate`, strefa Europe/Warsaw).

## Aktywne zadania

- TASK-005, TASK-006, TASK-007 (patrz `tasks/in-progress/`)

## Ostatnio ukończone

- TASK-002, TASK-003, TASK-004

## Zablokowane

- Brak.

## Ważne decyzje

- Patrz `docs/decisions.md` (DEC-001…DEC-008).
- Licznik postępu: tylko biegi ukończone wspólnie (DEC-007); Bieg 7 Dolin jako wycofany (DEC-008).
- Zewnętrzne kroki (Cloudflare, GitHub OAuth) odłożone do TASK-001/008/009, gdy będzie co wdrażać.

## Do zrobienia po stronie użytkownika

- Wybrać nazwę subdomeny (propozycja: `korona.damianwojcicki.com`).
- Dostarczyć daty, czasy i linki do wyników ukończonych biegów (przed TASK-013).
- Ewentualnie podać lokalizacje biegów (pole `location` jest puste).

## Ostatnia walidacja

- Build (3 strony), lint, format:check i astro check przechodzą na `main` po scaleniu TASK-002/003/004.

## Następna zalecana akcja

1. Przegląd i scalenie TASK-005/006/007.
2. Potem: TASK-014 (walidacja referencji), TASK-001/008 (panel CMS), TASK-009 (wdrożenie), TASK-010 (QA).

> Aktualizuj ten plik przed zakończeniem większej sesji pracy lub po istotnej zmianie stanu projektu.

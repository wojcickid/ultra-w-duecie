# Stan projektu — Ultra w duecie

Punkt odzyskiwania stanu dla długotrwałej pracy agentów.

## Aktualny kamień milowy

M1 — Front MVP (wersja lokalna) gotowy: szkielet, model treści, layout, strona główna, biegi i blog. Dalej: panel CMS, wdrożenie i QA.

## Aktualny status

- Zamknięte i scalone do `main` (lokalnie): TASK-002 (szkielet Astro 7 + Tailwind 4), TASK-003 (kolekcje `authors`/`runs`/`posts`), TASK-004 (layout, tokeny, komponenty; paleta tymczasowa, TASK-015), TASK-005 (strona główna), TASK-006 (biegi), TASK-007 (blog + RSS).
- Zdalne repo: `git@github.com:wojcickid/ultra-w-duecie.git`. Na GitHub wypchnięta jest dokumentacja i plan; kod (TASK-002…007) nie był jeszcze wypychany (push tylko na polecenie użytkownika).
- Wspólny kod: `src/lib/` (`format.ts`, `progress.ts`, `runs.ts`, `blog.ts`).
- Strony: `/`, `/biegi`, `/biegi/<id>`, `/blog`, `/blog/strona/<n>`, `/blog/<id>`, `/rss.xml`, `/404`, pomocniczy `/styleguide`.

## Aktywne zadania

- Brak.

## Ostatnio ukończone

- TASK-002, TASK-003, TASK-004, TASK-005, TASK-006, TASK-007

## Zablokowane

- Brak.

## Ważne decyzje

- Patrz `docs/decisions.md` (DEC-001…DEC-008).
- Licznik postępu: tylko biegi ukończone wspólnie (DEC-007); Bieg 7 Dolin jako wycofany (DEC-008).
- Zewnętrzne kroki (Cloudflare, GitHub OAuth) odłożone do TASK-001/008/009, gdy będzie co wdrażać.
- Zasada dla agentów: nie zabijać procesów po nazwie obrazu (`taskkill /IM chrome.exe` / `node.exe`) — tylko własne procesy po PID.

## Do zrobienia po stronie użytkownika

- Wybrać nazwę subdomeny (propozycja: `korona.damianwojcicki.com`).
- Dostarczyć daty, czasy i linki do wyników ukończonych biegów (przed TASK-013).
- Ewentualnie podać lokalizacje biegów (pole `location` jest puste).
- Opcjonalnie: wskazówki co do palety kolorów (TASK-015).

## Do usunięcia przed publikacją (TASK-010)

- Strona pomocnicza `/styleguide` i wpis testowy `src/content/posts/testowy-wpis.md`.

## Ostatnia walidacja

- Po scaleniu TASK-005/006/007: build (17 stron), lint, format:check i astro check przechodzą na `main`.

## Następna zalecana akcja

1. Push `main` na GitHub (na polecenie użytkownika).
2. TASK-014 (walidacja referencji), TASK-001 → TASK-008 (panel CMS), TASK-009 (wdrożenie na Cloudflare), TASK-010 (QA), TASK-011 (instrukcja dla autorów).

> Aktualizuj ten plik przed zakończeniem większej sesji pracy lub po istotnej zmianie stanu projektu.

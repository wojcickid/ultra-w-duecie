# TASK-011 — Instrukcja dla autorów (admin/moderator)

## Status

review

## Owner

lead-agent

## Dependencies

- TASK-008
- TASK-009

## Description

Napisać krótką instrukcję po polsku, krok po kroku: logowanie, dodanie wpisu ze zdjęciami i wybór autora, zmiana statusu biegu, podgląd zmian, cofnięcie zmiany, włączenie 2FA, dodanie drugiego autora jako współpracownika repozytorium (na później) oraz jak przyjmować treść od kolegi i publikować ją z autorstwem kolegi.

## Context

Właściciel nie ma zaawansowanego doświadczenia administracyjnego — instrukcja ma być zrozumiała bez wiedzy o Git.

## Acceptance criteria

- [x] Instrukcja obejmuje wszystkie powyższe czynności z opisem kroków.
- [ ] Sprawdzona w praktyce przez wykonanie każdego kroku.
- [x] Brak sekretów w dokumencie.

## Implementation notes

Dokument: `docs/authors-guide.md` (10 rozdziałów: działanie, logowanie i 2FA, wpis na blogu, wpis Grzegorza, biegi i wyniki z 3 przykładami, błędy budowy, cofanie zmian, praca przez Git, drugi autor, FAQ). Odsyłacz dodany w `README.md` (Start here, pkt 6) i w `docs/project-state.md` (sekcja „Do zrobienia po stronie użytkownika”).

Zweryfikowane z kodu i konfiguracji (bez uruchamiania panelu): nazwy pól i opcji z `public/admin/config.yml`; reguły wyników i komunikaty walidacji z `src/content.config.ts` i `scripts/validate-content.mjs`; reguła „wspólnie” z `src/lib/progress.ts` (DEC-010, DEC-011); adres wpisu (slug ASCII do 60 znaków); układ pakietu wpisu; galeria zdjęć w szerokości 800 px i miniatura z pierwszego zdjęcia (`src/pages/blog/[id].astro`, `src/components/PostCard.astro`); przykłady biegów z rzeczywistych plików `src/content/runs/*.json`; kroki 2FA, Collaborators i Cloudflare z `docs/cms-setup.md`.

Do potwierdzenia na żywo przez Leada z właścicielem (NIE wpisane w instrukcji jako fakt lub opisane wyłącznie według konfiguracji):

1. ~~Przycisk „Revert” przy pojedynczym commicie na GitHubie~~ — SPRAWDZONE (2026-09-22, właściciel na commicie panelu `5d19ea6`): przycisku Revert nie ma. Trzy sposoby cofania z rozdziału 7 pozostają aktualne i jedyne.
2. Zdjęcia w panelu: (a) ~~faktyczny zapis pliku i wartość `src`~~ — SPRAWDZONE (2026-09-22, commit `5d19ea6`, plik `src/content/posts/wpis-testowy-sekcja-3/index.md`): `src` to sama nazwa pliku, bez `./` (`src: pasted-image-1790109673895.png`); (b) rozdział 8 nadal używa `./meta.jpg` w przykładzie ręcznym (forma z dokumentacji Astro) — nie ma znaczenia dla panelu, tylko dla edycji ręcznej przez Git, zostawione bez zmian; (c) ~~build ze zdjęciem z panelu~~ — SPRAWDZONE pośrednio: wpis z panelu (ten testowy i wcześniejszy „bieg-rzeznika-2024”) zbudował się i wdrożył bez błędów.
3. ~~Usuwanie wpisu („Delete entry”)~~ — SPRAWDZONE (2026-09-22, commit `8ded381`): panel usuwa cały folder wpisu razem ze zdjęciami, nie tylko `index.md`.
4. ~~Nazwy przycisków panelu po polsku~~ — SPRAWDZONE (2026-09-22): interfejs panelu właściciela jest po polsku, zgodnie z założeniem w instrukcji.
5. ~~Czy tytuł edytowanego wpisu zmienia jego adres (slug) po edycji~~ — SPRAWDZONE (2026-09-22, wpis „Czy zmiana na nowy coś zmieniła?” pod adresem `/blog/czy-zmiana-tytulu-istniejacego-wpisu`): nie zmienia. Adres pozostaje taki, jak przy utworzeniu wpisu, niezależnie od późniejszych zmian tytułu.
6. Sposób pobrania starszej wersji pliku na GitHubie (link „1 parent”, „Browse files”, „Raw”, „Edit this file”): nazwy z pamięci, GitHub bywa zmieniany (zaznaczono to na początku dokumentu).
7. Zalecenia o zdjęciach (JPG/PNG/WebP, dłuższy bok około 2000 px, HEIC do JPG) to rekomendacje autora dokumentu, nie wynik pomiaru; zastrzeżenie o kompresji w FAQ: Astro przetwarza obrazy podczas budowy, ale format i jakość wyjściowa nie zostały sprawdzone w kodzie.
8. Ostrzeżenia w logu Cloudflare: czy log budowy wyświetla blok „Ostrzeżenia (src/content)” tak samo jak lokalnie (Workers Builds pokazuje standardowe wyjście, ale nie sprawdzano).
9. Wykonanie każdego kroku w praktyce (kryterium 2) wymaga sesji z właścicielem na produkcji.

**Lektura całości przez właściciela** — ZROBIONE (2026-09-22): przeczytał `docs/authors-guide.md` pobieżnie, bez zastrzeżeń co do jasności treści. To nie zastępuje wykonania każdego kroku (kryterium 2, punkty 4–9 wyżej nadal otwarte), ale potwierdza, że tekst sam w sobie jest zrozumiały.

## Validation

### Tests

- Nie uruchamiano (tylko dokumentacja; brak `node_modules` w worktree). Sprawdzono ręcznie zgodność nazw pól, komunikatów i przykładów z `config.yml`, `content.config.ts`, `validate-content.mjs` i plikami `src/content/runs/*.json`; brak sekretów i brak słów „oboje”/„dwoje”.

### Review

- Not reviewed

## Outcome

Complete this section before moving the task to `done`.

- Summary:
- Tests:
- Important files:
- Commit:
- Follow-up tasks:

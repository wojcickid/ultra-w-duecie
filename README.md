# Ultra w duecie

Strona, na której dwóch biegaczy dokumentuje drogę do zdobycia Korony Polskich Ultramaratonów 4.0 (Kingrunner): postęp w 10 biegach i blog. Projekt rozwija zespół agentów Claude Code (Lead, Backend, Frontend, Database, QA) na podstawie szablonu zespołu agentów.

## Start here

1. Przeczytaj `CLAUDE.md`.
2. Wymagania: `docs/requirements.md`; architektura: `docs/architecture.md`; UI: `docs/ui.md`; decyzje: `docs/decisions.md`.
3. Aktualny stan projektu: `docs/project-state.md`.
4. Zadania: `tasks/` (backlog -> ready -> in-progress -> review -> done).
5. Materiał wyjściowy właściciela: `docs/project-brief.md`.
6. Instrukcja dla autorów (wpisy, postęp w biegach, cofanie zmian): `docs/authors-guide.md`.

## Agent roles

- Lead: planning, delegation, integration
- Backend: API/business logic
- Frontend: UI/application frontend
- Database: schema/migrations
- QA: verification/testing

## Uruchomienie lokalne

Wymagany Node.js >= 22.12 (testowane na Node 24) i npm.

```bash
npm install        # instalacja zależności
npm run dev        # serwer deweloperski: http://localhost:4321
npm run build      # budowa statyczna do katalogu dist/
npm run preview    # podgląd zbudowanej strony
```


Walidacja treści: `npm run build` (przez `prebuild`) i `npm run check` uruchamiają `scripts/validate-content.mjs`, który przerywa działanie z komunikatem po polsku (plik, pole, brakujący identyfikator), gdy wpis lub wynik biegu odwołuje się do nieistniejącego autora lub biegu. Można go uruchomić osobno: `npm run validate:content`.

Kontrola jakości:

```bash
npm run check         # typy (astro check)
npm run lint          # ESLint
npm run format:check  # sprawdzenie formatowania (Prettier)
npm run format        # automatyczne formatowanie
```

Adres strony (`site`) jest ustawiony w jednym miejscu: `astro.config.mjs`. Linki wewnętrzne są względne.

## Licencja

Kod źródłowy — [MIT](LICENSE). Treści w `src/content/` (wpisy bloga, zdjęcia, relacje z biegów) NIE są objęte tą licencją i pozostają zastrzeżone (© Damian i Grzegorz) — szczegóły w pliku [LICENSE](LICENSE).

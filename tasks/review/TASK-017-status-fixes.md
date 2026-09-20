# TASK-017 — Poprawki po teście: reguła „wspólnie”, spójne znaczniki, statusy DNF i DNS

## Status

review

## Owner

frontend-agent

## Dependencies

- TASK-005, TASK-006, TASK-008 (zamknięte/scalone)

## Description

Trzy poprawki zgłoszone przez właściciela po teście panelu na produkcji:

1. **Reguła „ukończony wspólnie”:** obaj autorzy muszą mieć wynik z tą samą datą ukończenia (dziś sprawdzany jest tylko fakt posiadania wyniku).
2. **Spójne znaczniki:** bieg ukończony i jednocześnie wycofany (np. Bieg 7 Dolin) ma pokazywać oba znaczniki („Ukończony” i „Wycofany”) wszędzie: na stronie głównej (dziś tylko „Wycofany”), na liście biegów i na stronie biegu.
3. **Wynik osoby `outcome`: `finished` / `dnf` / `dns`:** nie ukończył (DNF) i nie wystartował (DNS) jako stan wyniku danej osoby (zmiana projektu ze zlecenia Lead Agenta: nie status na poziomie biegu; DEC-011).

## Context

DEC-007 (licznik tylko biegi ukończone wspólnie), DEC-008 (bieg wycofany). Dane rzeczywiste w `src/content` edytuje właściciel przez panel na produkcji — NIE zmieniaj ich (do testów używaj danych tymczasowych, których nie commitujesz).

## Acceptance criteria

- [x] `isCompletedTogether` wymaga wyniku `finished` każdego autora i identycznej daty ukończenia; opisane w DEC-010 i w podpowiedzi w panelu.
- [x] Dla biegu, gdzie obaj mają wyniki z różnymi datami (oraz dla `completed` bez wspólnego wyniku), build wypisuje ostrzeżenie (bez przerywania).
- [x] Jedno źródło prawdy dla znaczników (`getRunBadges`): strona główna, `/biegi` i `/biegi/<id>` pokazują dla ukończonego wycofanego oba znaczniki.
- [x] Wynik osoby: `outcome` finished/dnf/dns w schemacie (opcjonalne `completedDate`/`time` z regułami, pole `note`), panelu, komponentach i dokumentacji (DEC-011); znaczniki mają tekst i ikonę, kontrast min. 4,5:1.
- [x] Licznik postępu nie liczy DNF/DNS; istniejące dane nadal przechodzą walidację.
- [x] `npm run build`, `lint`, `format:check`, `check` bez błędów.

## Implementation notes

- **Zmiana projektu w trakcie:** DNF/DNS są per osoba (`outcome` w wyniku), nie statusem biegu; enum `status` biegu bez zmian (`completed | planned | unplanned`). Zapisane w DEC-011.
- **Reguła „wspólnie” (DEC-010):** każdy autor ma wynik `finished` z `completedDate`, a dni są równe. Dzień liczy `toDayKey` (`src/lib/format.ts`, Europe/Warsaw, jak `formatDate`), a nie `toISOString`: dla dat `YYYY-MM-DD` wynik jest identyczny (UTC 00:00 to w Warszawie 01:00/02:00 tego samego dnia, bez przesunięcia), a dla dat z godziną i przesunięciem (np. `2026-05-11T00:30:00+02:00`, w UTC 10 maja) dzień zgadza się z wyświetlanym. `getAuthorResults.together` i `countCompletedTogether` używają tej samej funkcji.
- **Schemat wyniku:** `outcome` (`default('finished')`, więc dane bez pola przechodzą), `completedDate` i `time` opcjonalne; `finished` wymaga obu, `dns` nie może mieć `time`; nowe `note`; `completed` wymaga co najmniej jednego wyniku `finished`.
- **Znaczniki:** `getRunBadges` jest jedynym źródłem dla osi czasu, listy i strony biegu (usunięto specjalny przypadek z `index.astro`/`Timeline`). `StatusBadge` przyjmuje też `finished | dnf | dns` (wynik osoby); `finished` współdzieli klasy z `completed`. Nowe tokeny: `status-dnf-bg/fg` `#ecdcf0/#4f1d63` (9,51:1), `status-dns-bg/fg` `#dbe6f3/#1b3a63` (9,07:1); ikony `circle-x` (DNF) i `circle-minus` (DNS).
- **Widoki:** strona biegu ma kartę na każdego autora (wynik ze znacznikiem albo „Jeszcze bez wyniku”); oś czasu i `RunCard` pokazują linijki „Osoba: ukończył HH:MM:SS / nie ukończył (DNF) / nie wystartował (DNS) — notatka” tylko dla biegu niewspólnego; oś czasu dodaje adnotację, gdy obaj ukończyli w różnych dniach. `RunCard` dostał prop `authors`. Sekcja „Wyniki indywidualne” pokazuje też DNF/DNS ze znacznikiem i notatką.
- **Ostrzeżenia buildu:** `validate-content.mjs` ostrzega (exit 0) przy różnych datach obu wyników oraz przy statusie `completed` bez wyniku `finished` od każdego autora. Dane rzeczywiste nie generują ostrzeżeń.
- **Panel:** Sveltia nie wspiera pól zależnych (dokumentacja: „does not support dependent fields yet”), więc `completedDate` i `time` są opcjonalne z podpowiedziami, a wymagalność pilnuje schemat. Nie testowano zapisu `outcome` w przeglądarce (Sveltia): przy `default: finished` i `omit_empty_optional_fields` niepusta wartość jest zapisywana, a wyczyszczone pole zostałoby pominięte i schemat przywróciłby `finished`.
- **Przypadek graniczny:** ręczne wpisanie różnych dat dla biegu ukończonego po północy nie jest wspólne (DEC-010); trzeba wpisać tę samą datę.
- Dane rzeczywiste w `src/content` nie były zmieniane (testy na danych tymczasowych, przywrócone przez `git checkout`).

## Validation

### Tests

- `npm run check` (0 errors, 0 warnings, 0 hints), `npm run build`, `npm run lint`, `npm run format:check`: bez błędów na danych rzeczywistych (licznik 2/10, brak ostrzeżeń, Bieg 7 Dolin ma znaczniki „Ukończony” + „Wycofany” na `/`, `/biegi`, `/biegi/bieg-7-dolin`).
- Test jednostkowy logiki (esbuild, poza repo): ta sama data, różne daty, solo, DNS, DNF x2, brak daty, przypadek północy z przesunięciem strefy: OK.
- Dane tymczasowe (przywrócone): (a) para z tą samą datą, licznik 2 do 3; (b) różne daty: licznik bez zmiany, ostrzeżenie w logu, exit 0, adnotacja na osi; (c) SGS: Damian finished + Grzegorz DNS: oba wpisy ze znacznikami na `/`, `/biegi`, `/biegi/sgs`; (d) Grań Tatr: obaj DNF z notatkami; (e) finished bez `time`, finished bez `completedDate`, dns z `time`, completed tylko z DNF: błąd budowy z czytelnym komunikatem (exit 1); (f) północ: `2026-05-10T23:30:00+02:00` + `2026-05-10` wspólne, `2026-05-11T00:30:00+02:00` + `2026-05-10` niewspólne (dzień w Europe/Warsaw); (g) completed + retired: oba znaczniki wszędzie.
- Skrypt zgodności `config.yml` do schematu (poza repo, jak w TASK-008): OK, wraz z symulacjami outcome.
- Chrome headless (CDP) 360 i 1280 px: `/`, `/biegi`, `/biegi/sgs`, `/biegi/bieg-7-dolin`, `/styleguide`: brak przewijania poziomego, znaczniki czytelne.

### Review

- Lead (2026-09-20): diff w zakresie (schemat, logika, komponenty, panel, dokumentacja; dane rzeczywiste nietknięte); przejrzane: schemat wyniku (outcome, reguły), isCompletedTogether (ta sama data, dzień w Europe/Warsaw), build (17 stron), lint, format:check, astro check bez błędów; na danych rzeczywistych licznik 2 z 10, Bieg 7 Dolin ma oba znaczniki na `/`, `/biegi` i `/biegi/bieg-7-dolin`; procesy agenta zatrzymane po PID. Do potwierdzenia przez właściciela na produkcji: zapis pola outcome w panelu (Sveltia), przykłady SGS i Grań Tatr.

## Outcome

Complete this section before moving the task to `done`.

- Summary: Reguła „wspólnie” = obaj `finished` z tą samą datą (DEC-010); jedno źródło znaczników biegu (`getRunBadges`) w osi czasu, liście i stronie biegu; wynik osoby `outcome` finished/dnf/dns z tokenami, ikonami i widokami (DEC-011); ostrzeżenia w walidacji; panel i dokumentacja zaktualizowane.
- Tests: check/build/lint/format:check bez błędów; scenariusze na danych tymczasowych (patrz Validation); Chrome headless 360/1280 px.
- Important files: `src/content.config.ts`, `src/lib/{progress,runs,format}.ts`, `src/components/{StatusBadge,Timeline,RunCard,Icon}.astro`, `src/pages/{index,biegi/index,biegi/[id],styleguide}.astro`, `src/styles/global.css`, `public/admin/config.yml`, `scripts/validate-content.mjs`, `docs/{decisions,requirements,architecture,ui}.md`.
- Commit: gałąź `agent/frontend/TASK-017-status-fixes` (4 commity: logika, znaczniki i panel, widoki, dokumentacja).
- Follow-up tasks:

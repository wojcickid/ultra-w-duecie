# TASK-018 — Weryfikacja danych 10 biegów Korony (propozycje do akceptacji)

## Status

review

## Owner

qa-agent

## Dependencies

- TASK-003 (dane początkowe), TASK-017

## Description

Dane biegów (dystans, miejsce, orientacyjny termin, nazwa) pochodzą z opisu na kingrunner.com przetworzonego automatycznie i mają w notatkach placeholder „wymagają weryfikacji z regulaminem”, widoczny publicznie. Zweryfikować dane w źródłach pierwotnych (regulamin Korony 4.0, strony organizatorów) i przygotować propozycje zmian do akceptacji właściciela. NIE zmieniać danych w `src/content` — właściciel edytuje je równolegle przez panel.

## Context

Regulamin: https://www.kingrunner.com/artykul/regulamin---korona-polskich-ultramaratonow-40/1109 oraz opis https://www.kingrunner.com/artykul/korona-polskich-ultramaratonow-40/154. Właściciel potwierdził: Bieg 7 Dolin był w chwili ukończenia (2024) biegiem podstawowym Korony, od 2026 r. nie jest organizowany (DEC-008).

## Acceptance criteria

- [x] Dla każdego z 10 biegów aktualnej listy Korony i dla Biegu 7 Dolin: oficjalna nazwa, dystans (km), miejsce (start/meta lub miejscowość), orientacyjny termin (miesiąc/okres), z linkiem do źródła i oceną pewności.
- [x] Rozbieżności między źródłami (opis vs regulamin vs organizator) wypisane wprost.
- [x] Weryfikacja: lista 10 biegów i zasady zaliczenia w regulaminie 4.0 (w tym status Biegu 7 Dolin).
- [x] Dokument `docs/run-data-proposals.md` z tabelą: pole, wartość obecna, propozycja, źródło, pewność; oraz propozycja usunięcia placeholderów z `notes`.
- [x] Żadne pliki w `src/content` nie zostały zmienione.

## Implementation notes

- Wynik: `docs/run-data-proposals.md` (propozycje do akceptacji właściciela; nic nie zapisano w `src/content`). Zawiera tabelę na każdy z 10 biegów i Bieg 7 Dolin, listę rozbieżności, sekcję o regulaminie (lista, status 7 Dolin, zaliczanie biegów wycofanych z cytatami), propozycję usunięcia placeholdera z `notes`, otwarte pytania oraz gotowe bloki JSON (A: bez konfliktu, B: wymaga decyzji, C: notes).
- Źródła: regulamin i opis Korony 4.0 (kingrunner.com) oraz ich archiwalne wersje 3.0 (web.archive.org, do porównania list); strony/regulaminy organizatorów: ZUK, Pieniny Ultra-Trail, Bieg Rzeźnika, SGS (w tym PDF regulaminu 2026 i komunikat o skróceniu trasy), Chudy Wawrzyniec, Bieg Granią Tatr, Łemkowyna Trail, Bison Ultra-Trail, Ultra Wysoczyzna, Festiwal Biegowy (Bieg 7 Dolin, komunikat o odwołaniu edycji 2026).
- Najważniejsze ustalenia:
  - Regulamin 4.0 jest niespójny wewnętrznie (lista 10 pozycji; zasady: „8 stałych + jeden z trzech" = 9; w „trzech" wymieniono cztery biegi) i różni się od opisu (opis: 10 stałych, wymienne tylko Maraton Karkonoski/Zamieć i 7 Dolin).
  - Bieg 7 Dolin: ukończenie do edycji 2025 włącznie jest jawnie zaliczane do Korony; w wersji 3.0 (do 21.05.2026) był stałym biegiem nr 7. Edycja 2026 została odwołana (komunikat 2.06.2026), a organizator zapowiada propozycję na 2027; sformułowanie „od 2026 r. nie jest organizowany" jest więc nieprecyzyjne.
  - Rozbieżności faktyczne: Rzeźnik 84 vs ok. 80 km, SGS 54,7 vs 55 km (edycja 2026 skrócona do ok. 45 km), Ultra Wysoczyzna start/meta w Elblągu (nie Tolkmicko), ZUK/ŁUT/BUGT/Chudy - start i meta w różnych miejscowościach.
  - Nie ustalono: terminów ZUK 2027, Chudy 2027, Bieg Granią Tatr 2026/2027 (strona organizatora zatrzymana na 2025), Kaliska Setka 2026 (strona organizatora nie odpowiadała), Pieniny Ultra-Trail 2027 (tylko kalendarz zewnętrzny).
- Ograniczenia: strony Facebook organizatorów niedostępne bez logowania; `f-time.pl` i `supermaraton.kalisz.pl` (Kaliska Setka) nie odpowiadały; streszczenia z narzędzi wyszukiwania weryfikowano surowymi stronami tam, gdzie to możliwe. Stan danych porównywano z commitem `b4d3328`; właściciel edytuje dane równolegle, więc przed wdrożeniem trzeba porównać z produkcją.
- Wnioskowanie (oznaczone w dokumencie jako hipoteza): wersja 4.0 regulaminu pojawiła się między 21.05.2026 a dziś (zbiega się z odwołaniem edycji 7 Dolin).

## Validation

### Tests

- Zadanie dokumentacyjne (bez kodu) - testy automatyczne nie dotyczą.
- Weryfikacja kryterium "Żadne pliki w src/content nie zostały zmienione": `git status --short` pokazuje tylko `tasks/in-progress/TASK-018-run-data-verification.md` (zmieniony) i `docs/run-data-proposals.md` (nowy); `git diff --stat -- src/content` zwraca pusty wynik (brak zmian w src/content).
- Cytaty z regulaminu Korony 4.0 i wersji 3.0 sprawdzone na surowym HTML (nie tylko na streszczeniu narzędzia).

### Review

- Not reviewed (oczekuje na przegląd Lead Agenta i decyzje właściciela wg sekcji "Otwarte pytania" w docs/run-data-proposals.md)

## Outcome

Complete this section before moving the task to `done`.

- Summary:
- Tests:
- Important files:
- Commit:
- Follow-up tasks:

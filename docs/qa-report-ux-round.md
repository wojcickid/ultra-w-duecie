# Raport QA rundy UX — Ultra w duecie

Zadanie: TASK-022. Data testów: 2026-09-20. Wykonawca: agent QA. Gałąź: `agent/qa/TASK-022-ux-qa` (od `main` po TASK-020 i TASK-021). W repozytorium zmieniono wyłącznie ten raport oraz plik zadania; kod aplikacji, dane (`src/content/`) i `public/` nie były dotykane, wady nie były naprawiane.

Zakres i metoda:

- Build realnych danych (`npm run build`), statyczny serwer Node na porcie 4391–4404 (uruchamiany i zamykany w skrypcie testowym; po testach porty wolne, żaden proces testowy nie został), zachowanie jak przy `html_handling: drop-trailing-slash` (`/biegi` → `biegi/index.html`, brak strony → `404.html` ze statusem 404).
- Przeglądarka: Microsoft Edge 153 (Chromium) sterowany przez `playwright-core` (zainstalowany w katalogu scratchpad poza repo), axe-core 4.x i Lighthouse (też w scratchpadzie). Zrzuty ekranu tylko poza repozytorium.
- Przypadki spoza realnych danych: **kopia projektu poza repozytorium** (scratchpad, `node_modules` podlinkowane), w której zmodyfikowano dane testowe (dokładny opis w sekcji 4). Nic z tego nie trafiło do repo (`git status` czysty poza raportem i zadaniem).
- Żadnych żądań do produkcji.

## 1. Podsumowanie

**Ocena: GOTOWE Z UWAGAMI.**

Uzasadnienie:

- Brak wad P0 i P1. Wszystkie kryteria akceptacji zadania są spełnione (tabela w sekcji 2–4).
- Strona główna, lista biegów, karty biegów i blog zachowują się zgodnie z DEC-007, DEC-008, DEC-010–012 na danych realnych i na 12 przypadkach syntetycznych. Licznik „2 / 10” i „2 z 10 biegów ukończonych razem” z wyjaśnieniem „tego samego dnia”, skład licznika (Bieg Rzeźnika, Bieg 7 Dolin), osobna sekcja „Historia projektu” z Biegiem 7 Dolin (na liście Korony 4.0 dokładnie 10 kart), „Najbliższy start” = Bison Ultra Trail (3 października 2026), skrypt ukrywający kartę po dniu startu (w strefach Europe/Warsaw, America/Los_Angeles i Pacific/Auckland) — działają.
- 0 poziomych przewijań (80 kombinacji strona × szerokość dla danych realnych, 60 dla danych testowych), 0 nakładających się znaczników statusu, 0 obciętych nazw, 0 naruszeń axe (WCAG 2.0/2.1/2.2 A/AA + best-practice, jasny i ciemny schemat), Lighthouse 100/100/100/100 (mobile i desktop), 0 martwych linków, brak zmian w `src/content/` względem `main`.
- Jedna wada P2: nazwa (`<caption>`) tabeli wyników jest sklejona bez spacji („Wyniki w bieguBieg Rzeźnika:Damian i Grzegorz”) — czytniki ekranu odczytają ją błędnie. Poza tym 6 uwag P3 (spójność słownictwa, status vs wyniki, dopisek 12 px, powiększenie tekstu 200%, semantyka tabeli w WebKit, tekst przy braku terminu dla czytników).

Kluczowe liczby:

| Miara | Wynik |
| ----- | ----- |
| Strony HTML w `dist/` (dane realne) | 17 (w tym `404`, `/admin`) |
| Martwe linki wewnętrzne / zasoby | 0 z 34 unikalnych celów |
| Poziomy scroll, obcięcia, nakładanie znaczników | 0 (dane realne: 16 stron × 5 szerokości; kopia testowa: 12 stron × 5 szerokości) |
| axe (16 stron × 320/1280 px × jasny/ciemny) | 0 naruszeń, 0 „incomplete” |
| Lighthouse (`/`, `/biegi`, `/biegi/bieg-7-dolin`, `/blog`; mobile i desktop) | 100 / 100 / 100 / 100; LCP ≤ 1,1 s, CLS 0, TBT 0 ms |
| Wady | P0: 0, P1: 0, P2: 1, P3: 6 |

## 2. Kryteria akceptacji zadania

| Kryterium | Wynik |
| --------- | ----- |
| Przypadki: ukończony, planowany, termin orientacyjny, brak terminu, DNF, DNS, wycofany/historyczny, brak wpisu, wpis powiązany | PASS (sekcje 3 i 4) |
| 2/10, Bieg 7 Dolin, najbliższy start (także po dacie), daty dokładne/orientacyjne | PASS |
| Brak poziomego scrolla, obcinania nazw, nakładania się statusów | PASS (przy zwykłym zoomie i powiększeniu tekstu do 150%; przy 200% tekstu patrz D-06, P3) |
| Wpisy bloga niezmienione względem `main` | PASS (`git diff main -- src/content` = 0 linii; `git diff main --stat` puste) |
| Raport z listą wad | ten dokument |

## 3. Testy na danych realnych (build z `main`)

### 3.1 Strona główna `/`

| # | Przypadek | Wynik |
| - | --------- | ----- |
| A1 | Kolejność sekcji: nazwa (h1) → opis → „Postęp duetu” → „Najbliższy start” → „Nasza droga” → „Ostatnie wpisy” → „Wyniki indywidualne” | PASS (kolejność nagłówków h1, h2, h2, h2, h2, h2; „Wyniki indywidualne” lżejsze, na dole) |
| A2 | Licznik „2 / 10” (dekoracyjny) i tekst „2 z 10 biegów ukończonych razem” w głównym tekście | PASS; postęp z etykietą tekstową |
| A3 | Wyjaśnienie „tego samego dnia” | PASS: „Liczą się tylko biegi ukończone przez nas obu tego samego dnia. Biegi, które ukończył tylko jeden z nas albo które ukończyliśmy w różnych dniach, oraz DNF i DNS pokazujemy osobno, poza licznikiem.” |
| A4 | Skład licznika: Bieg Rzeźnika, Bieg 7 Dolin (Piwniczna) z adnotacją | PASS (2 pozycje, linki do `/biegi/<id>`) |
| A5 | „Najbliższy start” = Bison Ultra Trail, 3 października 2026, link do `/biegi/bison-ultra-trail` | PASS (nagłówek i „Szczegóły biegu”) |
| A6 | Lista Korony 4.0: dokładnie 10 kart w kolejności `order` (ZUK … Kaliska Setka) | PASS (10 nagłówków h4 w bloku „Korona 4.0 — 10 biegów”) |
| A7 | Bieg 7 Dolin w osobnej sekcji „Historia projektu”, widocznie zaliczony, brak wrażenia 11 pozycji | PASS (znaczniki „Ukończony” + „Poza listą Korony 4.0”, „Ukończyliśmy razem”, adnotacja „Nie jest jedną z 10 pozycji Korony 4.0, ale zalicza się do naszego wspólnego postępu…”, przerywana ramka; ostrzeżenie o D-02 dotyczy tylko brzmienia) |
| A8 | Brak fraz „Bez planu” i „orientacyjnie:” w wynikowym HTML (`dist/`) i kodzie (`src/`) | PASS (`grep` bez trafień) |
| A9 | Spójność statusów i terminów: `/`, `/biegi`, `/biegi/<id>` (11 biegów) | PASS (te same etykiety: Ukończony / Zaplanowany / Do ustalenia / Poza listą Korony 4.0; te same terminy: „luty (termin orientacyjny)”, „31 maja 2024”, „Podejście: 28 czerwca 2025”, „3 października 2026” itd.) |
| A10 | Wyniki indywidualne: SGS (Damian ukończył 09:49:42, Grzegorz DNS z notatką), Grań Tatr (obaj DNF z notatką i czasem), „ukończony razem” przy Rzeźniku i 7 Dolinach | PASS |

### 3.2 Skrypt ukrywający kartę „Najbliższy start” (zegar Playwright)

`page.clock.install`, karta `[data-next-run]` i komunikat `#next-run-empty` („Kolejny termin do ustalenia”), sprawdzane w 3 strefach czasowych przeglądarki:

| Moment (czas polski) | Europe/Warsaw | America/Los_Angeles | Pacific/Auckland |
| -------------------- | ------------- | ------------------- | ---------------- |
| 2026-10-02 10:00 (przed) | karta | karta | karta |
| 2026-10-03 00:05 / 12:00 / 23:59 (w dniu) | karta | karta | karta |
| 2026-10-04 00:01 / 12:00 (po dniu) | komunikat | komunikat | komunikat |
| 2027-01-01 | komunikat | komunikat | komunikat |

Wynik: PASS w obu kierunkach; granica dnia liczona w Europe/Warsaw niezależnie od strefy urządzenia. Przy wyłączonym JavaScript karta pozostaje widoczna po dacie startu do kolejnego builda — zgodne z DEC-012 (ograniczenie strony statycznej, nie wada).

### 3.3 Lista `/biegi` i karta biegu

| # | Przypadek | Wynik |
| - | --------- | ----- |
| B1 | `/biegi`: sekcja „Korona 4.0 — 10 biegów” (10 kart) i pod nią „Historia projektu” (1 karta), h1 → h2 → h3 | PASS |
| B2 | Rzeźnik (ukończony razem): znacznik „Ukończony”, werdykt „Ukończyliśmy razem”, „Ukończono: 31 maja 2024”, tabela z obu wynikami i linkami do wyników | PASS |
| B3 | 7 Dolin (ukończony razem, historia): dwa znaczniki, adnotacja „poza listą”, wpis w „Relacji” z linkiem | PASS |
| B4 | SGS (solo + DNS): „Nie ukończyliśmy tego biegu razem — tylko Damian ukończył; Grzegorz nie wystartował (DNS)”, „Podejście: 28 czerwca 2025”, tabela: Ukończył / Nie wystartował (DNS), „—” + „brak danych” w pustych komórkach | PASS |
| B5 | Grań Tatr (obaj DNF): „obaj nie ukończyli (DNF)”, notatki obu | PASS |
| B6 | Bison (planowany z potwierdzoną datą): „Zaplanowany”, „Termin: 3 października 2026”, „Jeszcze przed nami”, brak sekcji „Nasz wynik” | PASS |
| B7 | ZUK, Pieniny (orientacyjny bez roku): „luty (termin orientacyjny)”, „kwiecień (termin orientacyjny)” — dopisek mniejszym, stonowanym tekstem | PASS (kontrast dopisku 7,47:1, patrz D-05) |
| B8 | Brak wpisu: „Relacja z tego biegu jeszcze się nie pojawiła.” (10 biegów) | PASS |
| B9 | Wpis powiązany: 7 Dolin — „Relacja” z zajawką; `/blog` i wpis pokazują „Dotyczy biegu: Bieg 7 Dolin (Piwniczna)” z linkiem | PASS |
| B10 | Nagłówki bez przeskoków (h1 → h2 → h3) na wszystkich stronach; `/blog` h1 → h2 | PASS |
| B11 | `/rss.xml`: poprawny XML, 1 pozycja, adresy bez ukośnika, `dc:creator` | PASS |
| B12 | `/404` (status 404 dla nieistniejących adresów), `/admin` i `/admin/config.yml` dostępne (200), `public/admin` niezmienione | PASS |

### 3.4 Responsywność (320, 360, 390, 768, 1280 px)

Dla 16 stron (`/`, `/biegi`, 11 × `/biegi/<id>`, `/blog`, wpis, `/404`) × 5 szerokości: `scrollWidth <= clientWidth` wszędzie, żaden element widoczny nie wystaje poza viewport, brak elementów przyciętych (`overflow: hidden` / `ellipsis`), brak kolizji ramek znaczników statusu między sobą ani z nagłówkiem karty (do 20 znaczników na stronie). Zrzuty obejrzane wybiórczo (`/` 390, karta SGS 360): układ czytelny, tabela wyników poniżej `sm` w układzie blokowym („Damian: …”, „Grzegorz: …” pod etykietą wiersza), brak poziomego przewijania.

Powiększenie samego tekstu (root `font-size` 150% i 200% przy viewport 360 px): 150% bez przewijania; przy 200% przewijanie poziome (D-06, P3).

## 4. Przypadki spoza danych realnych (kopia projektu poza repo)

Dane zmodyfikowane wyłącznie w kopii (`scratchpad/copy`), build 33 stron. `scripts/validate-content.mjs` poprawnie ostrzegł o przypadkach „różne dni” i „completed bez wyniku obu autorów”, ale nie przerwał budowy.

| # | Zmiana danych w kopii | Oczekiwane | Wynik |
| - | --------------------- | ---------- | ----- |
| T1 | ZUK: `typicalMonth: luty` + `expectedYear: 2027` | „luty 2027” bez dopisku | PASS |
| T2 | Pieniny: tylko `expectedYear: 2027` | „2027 (termin orientacyjny)” | PASS |
| T3 | Wysoczyzna: brak `typicalMonth`, `plannedDate`, wyników, status planned | „Termin do ustalenia” (`/biegi/<id>`: „Termin: do ustalenia”), status Zaplanowany | PASS (na osi czasu z ukrytą etykietą: D-04, P3) |
| T4 | Rzeźnik: `resultsUrl` biegu + `place: 12` obu | sekcja „Oficjalne wyniki” z linkiem, wiersz „Miejsce” w tabeli, „miejsce 12” i „ukończony razem” w wynikach indywidualnych, licznik nadal 2/10 | PASS |
| T5 | Chudy Wawrzyniec: oba `finished`, daty 2025-08-01 i 2025-08-02, `place` tylko Damiana | nie liczy się jako razem (licznik zostaje 2/10), „Pierwsze podejście: 1 sierpnia 2025”, „obaj ukończyli, ale w różnych dniach”, „Miejsce: 5 / —” | PASS |
| T6 | Łemkowyna: `planned` z `plannedDate` 2026-09-25 | „Najbliższy start” = Łemkowyna (wcześniejsza data niż Bison) | PASS |
| T7 | Kaliska: `planned` z `plannedDate` 2026-09-10 (przeszłość) | pominięta w „Najbliższym starcie”, termin „10 września 2026” | PASS (uwaga: status „Zaplanowany” zostaje z przeszłą datą — to dane, patrz uwagi w sekcji 7) |
| T8 | Nowy bieg wycofany nieukończony, bez wyników i terminu | sekcja „Historia projektu”, tylko znacznik „Poza listą Korony 4.0”, „Termin do ustalenia”; nie zmienia licznika ani listy 10 | PASS |
| T9 | Nowy bieg wycofany: Damian ukończył z `place` i linkiem, Grzegorz DNF, `expectedYear` + `typicalMonth` | w historii, „nie ukończyliśmy razem”, „Podejście: 6 maja 2023” (data z wyników ma pierwszeństwo), nie liczy się do 2/10 | PASS |
| T10 | 3 wpisy jednego biegu (SGS) | „Relacja” na karcie biegu: 3 zajawki, od najnowszego, bez „Dotyczy biegu” (zbędne); `/blog`: „Dotyczy biegu: …” przy każdym | PASS |
| T11 | Wpis bez powiązanego biegu | brak linii „Dotyczy biegu” w `/blog` i na stronie głównej | PASS |
| T12 | 15 wpisów łącznie | strona główna: 3 najnowsze; `/blog` 10 wpisów + „Strona 1 z 2”; `/blog/strona/2` z 5 wpisami i „Poprzednia strona” | PASS |

Na kopii powtórzono także pomiary responsywności (12 stron × 5 szerokości: 0 problemów) i axe (11 stron × 2 szerokości × 2 schematy: 0 naruszeń).

## 5. Dostępność

| Kontrola | Wynik |
| -------- | ----- |
| axe-core (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`, `best-practice`), 16 stron × 320/1280 px × jasny/ciemny schemat | 0 naruszeń (critical 0, serious 0, moderate 0, minor 0), 0 „incomplete” |
| j.w. na kopii z danymi testowymi (11 stron) | 0 naruszeń |
| Kolejność nagłówków | poprawna na wszystkich stronach (sekcja 3.3, B10) |
| Tabela wyników: semantyka | `table` z `caption`, `columnheader` (Damian, Grzegorz), `rowheader` (Status, Czas, …); drzewo dostępności (Chromium) zachowane na 360 i na 1280 px; na 360 komórki dostają nazwę „Damian: …”. Wada: nazwa tabeli bez spacji (D-01). Ryzyko WebKit: D-07 |
| Układ blokowy poniżej `sm` | ocena: sensowny (etykieta wiersza nad wartościami z imieniem osoby, brak przewijania, DNS/„brak danych” czytelne); wartościowe jest ukrycie `thead` tylko wizualnie |
| Kontrast dopisku „termin orientacyjny” | `text-ink-muted` (rgb 75,88,80) na białym: 7,47:1; na tle strony (247,245,239): 6,85:1 — spełnia AA i AAA; rozmiar 12 px (D-05) |
| Znaczniki statusu | tekst + ikona, nie sam kolor; nazwy zawsze widoczne |

## 6. Wyniki komend (worktree TASK-022)

| Polecenie | Wynik |
| --------- | ----- |
| `npm ci` | OK (ostrzeżenia npm o skryptach instalacyjnych `esbuild`/`workerd`, bez wpływu) |
| `npm run build` | OK, 16 stron; prebuild `validate-content`: „Walidacja referencji: OK”, bez ostrzeżeń |
| `npm run lint` | bez błędów |
| `npm run format:check` | „All matched files use Prettier code style!” |
| `npm run check` | walidacja + `astro check`: 0 errors, 0 warnings, 0 hints (41 plików) |
| `git diff main -- src/content` | pusty (0 linii); `git diff main --stat` pusty |
| Martwe linki | 17 plików HTML, 34 unikalne cele wewnętrzne, 0 martwych (`href`, `src`, `srcset`) |
| Lighthouse (lokalny build) | 100/100/100/100 dla `/`, `/biegi`, `/biegi/bieg-7-dolin`, `/blog` (mobile i desktop) |
| Porty 4391–4404 po testach | wolne; procesy testowe (serwer, Edge z Playwright) zakończone w skryptach, `node_modules` worktree nienaruszone |

## 7. Lista wad i uwag

### P0 / P1

Brak.

### P2

**D-01 — `<caption>` tabeli wyników jest sklejony bez spacji**

- Oczekiwane: „Wyniki w biegu Bieg Rzeźnika: Damian i Grzegorz”.
- Aktualne: „Wyniki w bieguBieg Rzeźnika:Damian i Grzegorz” (drzewo dostępności i `innerText`; `dist/biegi/sgs/index.html`: `<caption class="sr-only">Wyniki w bieguSupermaraton Gór Stołowych (SGS):Damian i Grzegorz</caption>`). Nazwa tabeli jest odczytywana przez czytniki ekranu jako jedno słowo („bieguSupermaraton”).
- Odtworzenie: `npm run build`, otworzyć `/biegi/sgs`, sprawdzić tekst `caption` (albo `page.locator('table').ariaSnapshot()`).
- Obszar: `src/components/RunResultsTable.astro`, `<caption>` (Prettier zjada białe znaki wokół wyrażeń JSX-owych po złamaniu linii).
- Sugestia: zbudować tekst w frontmatterze (`const caption = \`Wyniki w biegu ${runName}: ${joinNames(...)}\``) i wstawić `{caption}`.

### P3

**D-02 — Niespójne nazwy dla biegu spoza listy i brak literalnego „Ukończony wspólnie”**

- Decyzja właściciela (TASK-022, kontekst): „wyraźny znacznik «Ukończony wspólnie»”. Widok pokazuje znacznik „Ukończony” + „Poza listą Korony 4.0” i tekst „Ukończyliśmy razem”; frazy „Ukończony wspólnie” nie ma nigdzie w HTML. Dodatkowo w „Składzie licznika” ten sam bieg opisany jest jako „wycofany z listy 10 biegów Korony 4.0”, a znacznik mówi „Poza listą Korony 4.0” (dwa słowniki: „wycofany” vs „poza listą”).
- Odtworzenie: `/` — sekcja „Postęp duetu” (skład licznika) i „Historia projektu”; `/biegi/bieg-7-dolin`.
- Obszar: `src/pages/index.astro` (skład licznika), `RunVerdict.astro`/`run-verdict.ts` (headline), ewent. potwierdzić z właścicielem, czy „Ukończyliśmy razem” jest akceptowalnym odpowiednikiem.
- Sugestia: ujednolicić „poza listą” w składzie licznika; ustalić z właścicielem brzmienie znacznika.

**D-03 — Status biegu obok wyników z poprzedniego podejścia bywa mylący**

- SGS i Bieg Ultra Granią Tatr mają status „Do ustalenia” (kolejne podejście), a obok „Podejście: 28 czerwca 2025” i „Nie ukończyliśmy tego biegu razem”. W kopii testowej „Ukończony” (bieg z wynikami obu w różnych dniach) stoi obok „Nie ukończyliśmy tego biegu razem”. Zgodne z modelem danych (status wspólny, DEC-011), ale czytelnik może nie rozumieć, czego dotyczy znacznik.
- Odtworzenie: `/`, `/biegi`, `/biegi/sgs`.
- Sugestia: na karcie dopisać, że status dotyczy kolejnego podejścia (np. „Kolejne podejście: do ustalenia”), albo rozważyć dodatkowy status „Nieukończony”; decyzja produktowa.

**D-04 — Oś czasu: „Termin: Termin do ustalenia” dla czytników ekranu**

- Na osi czasu etykieta jest ukryta wizualnie (`sr-only`), więc czytnik odczytuje „Termin: Termin do ustalenia”; `RunFacts` ma to rozwiązane („Termin: do ustalenia”). Wizualnie OK. Dotyczy tylko biegu bez żadnego terminu (w danych realnych obecnie brak takiego biegu; odtworzone w kopii, T3/T8).
- Obszar: `src/components/Timeline.astro` (użyć tej samej reguły co `RunFacts` dla `term.kind === 'tbd'`).

**D-05 — Dopisek „termin orientacyjny” ma 12 px**

- Kontrast jest dobry (7,47:1), ale `text-xs` w kartach z `text-sm` daje bardzo drobny tekst na telefonie; dopisek niesie ważną informację (data niepotwierdzona).
- Obszar: `src/components/RunTerm.astro` (`text-xs` → `text-sm`).

**D-06 — Powiększenie samego tekstu do 200% powoduje poziome przewijanie (360 px)**

- Przy 150%: bez przewijania. Przy 200% (root `font-size: 32px`, viewport 360 px): `/` 438/360, `/biegi` 423/360, `/biegi/sgs` 458/360 (znacznik „Nie wystartował (DNS)”, `whitespace-nowrap`), `/biegi/ultra-grania-tatr` 396/360, `/blog` 384/360 (nawigacja „Blog”); na `/` także „Poza listą Korony 4.0” (415) i data w „Najbliższy start” (438). Nowa, dłuższa etykieta „Poza listą Korony 4.0” pogarsza sytuację względem „Wycofany”. Kontynuacja D-07 z raportu MVP (tam dotyczyło głównie 150%/200% tekstu systemowego).
- Odtworzenie: viewport 360 px, ustawić `html{font-size:32px}`.
- Sugestia: pozwolić znacznikom zawijać się poniżej `sm` (zamiast `whitespace-nowrap`) i dopuścić zawijanie nawigacji. Nie blokuje startu.

**D-07 — Semantyka tabeli w układzie blokowym poniżej `sm` niepotwierdzona w WebKit**

- W Chromium drzewo dostępności zachowuje role `table/row/cell` mimo `display:block` (zweryfikowane). Safari/VoiceOver historycznie traci semantykę tabeli po zmianie `display` elementów tabeli. Nie sprawdzono (brak WebKit w środowisku QA).
- Obszar: `RunResultsTable.astro`. Sugestia: dopisać jawne `role="table|rowgroup|row|columnheader|rowheader|cell"` albo zweryfikować ręcznie na iPhonie z VoiceOver.

### Obserwacje (bez wady)

- Kaliska w kopii testowej: status „Zaplanowany” zostaje po upływie `plannedDate`; jest to zgodne z modelem (status ręczny), ale warto zapamiętać w instrukcji dla autorów, że po starcie status i wyniki aktualizuje się ręcznie.
- Zajawka wpisu Piwniczna na stronie głównej cytuje surowy początek treści (m.in. „18:43:25…” i emoji); treść wpisów jest poza zakresem tej rundy.
- Bez JavaScript karta „Najbliższy start” zostaje po dacie startu do następnego builda (świadome ograniczenie, DEC-012).
- Frazy „Bez planu” i „orientacyjnie:” usunięte w całości; „Lokalizacja” zamiast „Miejsce” w danych biegu jest udokumentowane w `docs/ui.md`.

## 8. Czego nie sprawdzono

- Safari/WebKit i Firefox (tylko Edge/Chromium 153); rzeczywiste urządzenia mobilne; czytniki ekranu (ocena na podstawie drzewa dostępności).
- Panel `/admin` (interfejs Sveltia CMS) — sprawdzono tylko dostępność plików; przepływ end-to-end nadal poza zakresem QA.
- Produkcja (celowo brak żądań).

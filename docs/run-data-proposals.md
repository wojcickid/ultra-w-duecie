# Weryfikacja danych biegów — propozycje do akceptacji właściciela (TASK-018)

> **Status (2026-09-20):** decyzje właściciela wprowadzone do danych (`src/content/runs`): przy rozbieżności bierzemy dłuższy dystans (SGS 55, Chudy Wawrzyniec 82,5, Bieg 7 Dolin 100,7 — uwaga: dla 7 Dolin to dystans obecnej trasy, trasy z 2024 r. nie sprawdzono), nazwy z regulaminu Korony, lokalizacja w formacie „start – meta”, bez `plannedDate` (nie zawsze planujemy najbliższy bieg), placeholdery w `notes` usunięte, notatki z limitami czasu nie zostały wprowadzone, pytanie do redakcji Kingrunera odłożone.

## Wstęp

- **Data weryfikacji:** 2026-09-20 (stan źródeł na ten dzień).
- **Stan danych porównywany z propozycjami:** pliki `src/content/runs/*.json` z gałęzi zadania (commit `b4d3328`). Właściciel edytuje dane równolegle przez panel, więc przed wdrożeniem propozycji należy porównać je z aktualnym stanem na produkcji.
- **Ten dokument niczego nie zmienia w danych.** Wszystkie wartości to propozycje; żaden plik w `src/content` nie został zmodyfikowany.
- **Jak czytać tabele:** każdy bieg ma osobną tabelkę: pole, wartość obecna w danych, propozycja, źródło, pewność, uwagi. „Nie ustalono" oznacza, że w źródłach pierwotnych nie znaleziono potwierdzenia.
- **Skala pewności:**
  - **wysoka** — potwierdzone przez organizatora biegu lub regulamin Korony 4.0;
  - **średnia** — jedno źródło niebędące organizatorem (np. kalendarz biegów) albo dokument organizatora znany tylko z pośredniego streszczenia;
  - **niska** — niepewne lub sprzeczne.
- **Skróty źródeł:**
  - `[REG]` — regulamin Korony 4.0: <https://www.kingrunner.com/artykul/regulamin---korona-polskich-ultramaratonow-40/1109>
  - `[OPIS]` — opis Korony 4.0 (aktualizacja czerwiec 2026): <https://www.kingrunner.com/artykul/korona-polskich-ultramaratonow-40/154>
  - `[REG-3.0]` — archiwalna wersja regulaminu z 21.05.2026 (nagłówek „3.0", ta sama data „07.12.2024"): <https://web.archive.org/web/20260521011544/https://www.kingrunner.com/artykul/regulamin---korona-polskich-ultramaratonow-30/1109>
  - `[OPIS-3.0]` — archiwalna wersja opisu z 14.03.2026: <https://web.archive.org/web/20260314203428/https://www.kingrunner.com/artykul/korona-polskich-ultramaratonow-30/154>
- **Uwaga metodyczna:** strony i regulaminy organizatorów pobrano w surowej postaci i sprawdzono cytaty w tekście; streszczenia z narzędzi wyszukiwania traktowano tylko jako wskazówkę, gdzie szukać. Tam, gdzie organizator nie opublikował jeszcze terminu 2027, piszę „nie ustalono".

## Najważniejsze wnioski (skrót)

1. **Bieg 7 Dolin:** ukończenie do edycji 2025 włącznie **można zaliczyć do Korony** (dosłownie w regulaminie). Stwierdzenie „od 2026 r. nie jest organizowany" jest nieprecyzyjne: organizator **odwołał tylko edycję 2026** (komunikat z 2.06.2026) i zapowiedział propozycję na 2027 rok. Do korekty w `notes` i `docs/requirements.md` (FR-8).
2. **Regulamin Korony 4.0 jest wewnętrznie niespójny** (lista 10 pozycji vs „8 stałych + jeden z trzech" = 9, nie 10) i różni się od opisu — patrz sekcja „Regulamin". Sposób liczenia „wolnego slotu" wymaga potwierdzenia u redakcji Kingrunner.
3. **Rozbieżności faktyczne** między regulaminem Korony a organizatorami: Bieg Rzeźnika (84 vs ok. 80 km), SGS (54,7 vs 55 km), Ultra Wysoczyzna (start/meta w Elblągu, nie Tolkmicku), ZUK (start Szklarska Poręba, meta Karpacz), ŁUT 150 (meta w Komańczy), Chudy Wawrzyniec (82 vs ok. 82,5 km i meta w Ujsołach).
4. **Niska pewność / nie ustalono terminów** dla: Bieg Ultra Granią Tatr (strona organizatora zatrzymana na edycji 2025), Kaliska Setka (nie udało się otworzyć strony organizatora), ZUK 2027, Chudy Wawrzyniec 2027, Pieniny Ultra Trail 2027 (tylko kalendarz zewnętrzny).
5. Placeholder w `notes` („Dane orientacyjne z regulaminu Korony 4.0 (kingrunner.com) - wymagają weryfikacji z regulaminem.") występuje w 10 z 11 biegów (wszystkie oprócz Biegu 7 Dolin) — propozycja usunięcia poniżej.

---

## Dane biegów (jedna tabelka na bieg)

Kolejność zgodna z polem `order`. Pole `plannedDate` dotyczy **najbliższej znanej edycji** (data edycji, nie deklaracja startu właściciela); stosować tylko dla biegów, które właściciel faktycznie planuje.

### 1. ZUK — Zimowy Ultramaraton Karkonoski (`zuk`, order 1)

| Pole | Wartość obecna | Propozycja | Źródło | Pewność | Uwagi |
|---|---|---|---|---|---|
| name | Zimowy Ultramaraton Karkonoski (ZUK) | bez zmian (oficjalnie: „Zimowy Ultramaraton Karkonoski im. Tomka Kowalskiego") | [strona organizatora](https://ultramaratonkarkonoski.pl/), [REG] | wysoka | Organizator: „XII Zimowy Ultramaraton Karkonoski im. Tomka Kowalskiego". Człon „im. Tomka Kowalskiego" można dodać. |
| distanceKm | 47.5 | 47.5 | [regulamin ZUK 2026](https://docs.google.com/document/d/1-QYwQgoQdWlA7SPtjVhhDipo9Zj5YCCp/edit) („Dystans – ok 47,5 km"), [REG] | wysoka | Strona trasy organizatora: „około 48 km" ([trasa](https://ultramaratonkarkonoski.pl/trasa/)). |
| location | (brak) | Szklarska Poręba – Karpacz (Karkonosze) | [trasa](https://ultramaratonkarkonoski.pl/trasa/): start Szklarska Poręba, meta Deptak w Karpaczu | wysoka | [REG] podaje tylko „Karpacz". |
| typicalMonth | luty | luty | [REG], [aktualności ZUK](https://ultramaratonkarkonoski.pl/aktualnosci/) (28.02.2026) | wysoka | |
| plannedDate | (brak) | nie ustalono (2027) | — | — | Edycja 2026 odbyła się 28.02.2026. Organizator zapowiadał zapisy „jak zawsze na przełomie października i listopada"; terminu 2027 nie opublikował. |
| notes (limit) | placeholder | „Limit czasu: 10,5 godz. (regulamin 2026)." | [regulamin ZUK 2026](https://docs.google.com/document/d/1-QYwQgoQdWlA7SPtjVhhDipo9Zj5YCCp/edit) | wysoka | Warunki udziału 2026: min. 2 biegi górskie ≥ maraton lub losowanie; limit 400 osób. |

### 2. Pieniny Ultra Trail — Niepokorny Mnich (`pieniny-ultra-trail`, order 2)

| Pole | Wartość obecna | Propozycja | Źródło | Pewność | Uwagi |
|---|---|---|---|---|---|
| name | Pieniny Ultra Trail | „Pieniny Ultra-Trail — Niepokorny Mnich" (opcjonalnie) | [organizator](https://pieninyultratrail.pl/en/routes/niepokorny-mnich/), [REG] | wysoka | Organizator pisze „Pieniny Ultra-Trail®", trasa „Niepokorny Mnich 95". Zaliczana do Korony jest trasa Niepokorny Mnich. |
| distanceKm | 95.2 | 95.2 | [organizator](https://pieninyultratrail.pl/en/routes/niepokorny-mnich/) („Distance: 95,2 km"), [REG] | wysoka | +4940 m / −4940 m. [OPIS] pisze „~100 km" (przybliżenie). |
| location | (brak) | Szczawnica (Pieniny) | [organizator](https://pieninyultratrail.pl/en/routes/niepokorny-mnich/): start i meta Szczawnica, Plac Dietla | wysoka | |
| typicalMonth | kwiecień | kwiecień | [organizator](https://pieninyultratrail.pl/en/) (23–26.04.2026), [REG] | wysoka | |
| plannedDate | (brak) | nie ustalono (2027) | [Rate My Trail](https://ratemytrail.com/event/pieniny-ultra-trail-2027) podaje 22–25.04.2027 | niska | Strona organizatora nadal pokazuje edycję 2026 (bieg Niepokorny Mnich: 24.04.2026, start 1:00). Termin 2027 tylko z kalendarza zewnętrznego — nie zapisywać jako `plannedDate`. |
| notes (limit) | placeholder | „Limit czasu: 20 godz. (edycja 2026); 4 punkty ITRA." | [organizator](https://pieninyultratrail.pl/en/routes/niepokorny-mnich/) | wysoka | Limit 450 uczestników. |

### 3. Ultra Wysoczyzna — Ryk Jelenia (`ultra-wysoczyzna-ryk-jelenia`, order 3)

| Pole | Wartość obecna | Propozycja | Źródło | Pewność | Uwagi |
|---|---|---|---|---|---|
| name | Ultra Wysoczyzna Ryk Jelenia | bez zmian (oficjalnie: „Meble Wójcik ULTRA WYSOCZYZNA — Ryk jelenia (103 km)") | [regulamin organizatora](https://ultrawysoczyzna.pl/regulamin/) | wysoka | Nazwa organizatora zawiera nazwę sponsora tytularnego; może się zmieniać. |
| distanceKm | 103 | 103 | [regulamin organizatora](https://ultrawysoczyzna.pl/regulamin/), [REG] | wysoka | +2300 m / −2300 m. |
| location | (brak) | Elbląg (Wysoczyzna Elbląska) | [regulamin organizatora](https://ultrawysoczyzna.pl/regulamin/): start i meta Ryk jelenia — Elbląg, Park Bażantarnia | wysoka | **Rozbieżność:** [REG] podaje „Tolkmicko". Wg organizatora w Tolkmicku jest tylko przepak (49. km); start dystansu 54 km (Wycie wilka) jest w Tolkmicku. |
| typicalMonth | kwiecień/maj | kwiecień | [regulamin organizatora](https://ultrawysoczyzna.pl/regulamin/) (edycja 16–18.04.2027) | wysoka | [REG] podaje „kwiecień/maj". Znany jest tylko termin 2027. |
| plannedDate | (brak) | 2027-04-17 | [regulamin organizatora](https://ultrawysoczyzna.pl/regulamin/): „17.04.2027 r. (sobota)", start 4:00 | wysoka | Edycja 16–18.04.2027. **Do Korony liczy się od edycji 2027** ([REG]), więc jest to pierwsza edycja, która się liczy. |
| notes (limit) | placeholder | „Limit czasu: 17 godz. Do Korony zaliczany od edycji 2027." | [regulamin organizatora](https://ultrawysoczyzna.pl/regulamin/), [REG] | wysoka | Limit 250 osób na dystansie 103 km. Opłata 330 zł do 5.02.2027 (nieistotne dla danych). |

### 4. Bieg Rzeźnika (`bieg-rzeznika`, order 4, ukończony 2024-05-31)

| Pole | Wartość obecna | Propozycja | Źródło | Pewność | Uwagi |
|---|---|---|---|---|---|
| name | Bieg Rzeźnika | bez zmian | [organizator](https://www.biegrzeznika.pl/bieg-rzeznika/) („XXIV Bieg Rzeźnika"), [REG] | wysoka | |
| distanceKm | 84 | **do decyzji właściciela:** 84 ([REG]) albo 80 (organizator) | [organizator](https://www.biegrzeznika.pl/bieg-rzeznika/): „Dystans : około 80 km", 4085 m przewyższeń; [REG]: „84 km" | niska (sprzeczne) | **Rozbieżność.** Organizator (strona edycji 2027) podaje ok. 80 km; regulamin Korony 84 km. Nie ustalono, jaki dystans miała trasa z 2024 r. |
| location | Komańcza, Cisna, Bieszczady | Komańcza – Cisna (Bieszczady) | [organizator](https://www.biegrzeznika.pl/bieg-rzeznika/): start Komańcza, meta Cisna (stadion Orlik) | wysoka | Zapis obecny jest poprawny; propozycja tylko porządkuje (start – meta). |
| typicalMonth | Boże Ciało | maj/czerwiec (weekend Bożego Ciała) | [organizator](https://www.biegrzeznika.pl/bieg-rzeznika/) (festiwal 3–6.06.2026; 26–29.05.2027), [REG] | wysoka | Termin zależy od daty Bożego Ciała (w 2024: 31.05; w 2027: 28.05). |
| plannedDate | (brak) | nie dotyczy (bieg ukończony) | — | — | Najbliższa edycja: 28.05.2027 (piątek), start 3:00 z Komańczy ([organizator](https://www.biegrzeznika.pl/bieg-rzeznika/)). |
| notes | placeholder | „Bieg w parach. Limit czasu: 17 godz." | [organizator](https://www.biegrzeznika.pl/bieg-rzeznika/): „Biegniemy parami!", limit 17 h | wysoka | Limit i format wg regulaminu edycji 2027. |

### 5. Supermaraton Gór Stołowych — SGS (`sgs`, order 5)

| Pole | Wartość obecna | Propozycja | Źródło | Pewność | Uwagi |
|---|---|---|---|---|---|
| name | Supermaraton Gór Stołowych (SGS) | bez zmian | [organizator](https://www.maratongorstolowych.pl/sgs/informacje-sgs/), [REG] | wysoka | Trasa zaliczana: SGS ULTRA. |
| distanceKm | 54.7 | **do decyzji właściciela:** 54.7 ([REG]) albo 55 (organizator) | [regulamin SGS 2026 (PDF)](https://www.maratongorstolowych.pl/wp-content/uploads/2026/02/SGS26_Regulamin.docx-1.pdf): „Ultramaraton 55 km"; [REG]: „54,7 km" | średnia (drobna rozbieżność) | Różnica 0,3 km. **Edycja 2026 została skrócona z 55 do ok. 45 km** z powodu upałów ([komunikat 26.06.2026](https://www.maratongorstolowych.pl/trasa-ultra-55km-zostaje-skrocona/)); regulamin Korony nie mówi, jak to traktuje. |
| location | Karłów | Karłów (Góry Stołowe) | [organizator](https://www.maratongorstolowych.pl/sgs/informacje-sgs/): start Karłów; meta Schronisko PTTK na Szczelińcu (3 km od startu) | wysoka | Obecny zapis „Karłów" jest poprawny. |
| typicalMonth | czerwiec | czerwiec | [organizator](https://www.maratongorstolowych.pl/) (27.06.2026; 26.06.2027) | wysoka | |
| plannedDate | (brak) | 2027-06-26 (opcjonalnie) | [organizator](https://www.maratongorstolowych.pl/): „26 CZERWCA 2027 Supermaraton Gór Stołowych", „Start 26 czerwca 2027 (sobota)" | wysoka | Edycja 2026 odbyła się 27.06.2026 (skrócona). |
| notes (limit) | placeholder | „Limit czasu: 11 godz. (trasa ULTRA, regulamin 2026)." | [regulamin SGS 2026 (PDF)](https://www.maratongorstolowych.pl/wp-content/uploads/2026/02/SGS26_Regulamin.docx-1.pdf) | wysoka | Limit 400 osób na trasie ULTRA. |

### 6. Chudy Wawrzyniec 80+ (`chudy-wawrzyniec`, order 6)

| Pole | Wartość obecna | Propozycja | Źródło | Pewność | Uwagi |
|---|---|---|---|---|---|
| name | Chudy Wawrzyniec 80+ | bez zmian (organizator: „Chudy Wawrzyniec — 80 km"; strona: „80km+") | [regulamin organizatora 2026](https://chudywawrzyniec.pl/regulamin-biegow-gorskich-chudy-wawrzyniec-2026/), [REG] | wysoka | Trzy dystanse do wyboru w trakcie biegu: 52, 82 i 102 km. Do Korony zaliczany jest wariant 80+. |
| distanceKm | 82 | 82 (organizator: „ok. 82,5 km") | [regulamin organizatora 2026](https://chudywawrzyniec.pl/regulamin-biegow-gorskich-chudy-wawrzyniec-2026/), [trasa](https://chudywawrzyniec.pl/trasa/), [REG] („82 km") | wysoka | Rozbieżność kosmetyczna: [trasa](https://chudywawrzyniec.pl/trasa/) podaje 82 km, regulamin 82,5 km. +3825 m / −3775 m. |
| location | (brak) | Rajcza – Ujsoły (Beskid Żywiecki) | [regulamin organizatora 2026](https://chudywawrzyniec.pl/regulamin-biegow-gorskich-chudy-wawrzyniec-2026/): start Park w Rajczy, meta Amfiteatr w Ujsołach | wysoka | [REG] podaje tylko „Rajcza". |
| typicalMonth | sierpień | sierpień | [regulamin organizatora 2026](https://chudywawrzyniec.pl/regulamin-biegow-gorskich-chudy-wawrzyniec-2026/) (8.08.2026), [organizator](https://chudywawrzyniec.pl/termin-edycji-2026/): „w drugi weekend sierpnia" | wysoka | |
| plannedDate | (brak) | nie ustalono (2027) | — | — | Edycja 2026 odbyła się 8.08.2026. Terminu 2027 organizator nie opublikował (tradycja: drugi weekend sierpnia). |
| notes (limit) | placeholder | „Limit czasu: 16 godz. (regulamin 2026)." | [regulamin organizatora 2026](https://chudywawrzyniec.pl/regulamin-biegow-gorskich-chudy-wawrzyniec-2026/) | wysoka | Uwaga: ograniczony support organizatora; zob. [OPIS]. |

### 7. Bieg Ultra Granią Tatr (`ultra-grania-tatr`, order 7)

| Pole | Wartość obecna | Propozycja | Źródło | Pewność | Uwagi |
|---|---|---|---|---|---|
| name | Bieg Ultra Granią Tatr | bez zmian (organizator: „Bieg Granią Tatr" / „Bieg Ultra Granią Tatr") | [organizator](https://www.graniatatr.pl/), [REG] | wysoka | |
| distanceKm | 71 | 71 | [organizator](https://www.graniatatr.pl/) („długość trasy 71 km", +/−5000 m), [REG] | wysoka | Strona organizatora opisuje edycję VIII (23.08.2025). |
| location | (brak) | Siwa Polana – Kuźnice (Tatry, Zakopane) | [organizator](https://www.graniatatr.pl/trasa.html): start Siwa Polana, meta Kuźnice | wysoka | [REG] podaje „Zakopane". |
| typicalMonth | sierpień | sierpień | [organizator](https://www.graniatatr.pl/): „zawsze w drugiej połowie sierpnia" | wysoka | |
| plannedDate | (brak) | nie ustalono | — | — | **Strona organizatora nie zawiera informacji o edycjach 2026/2027** (najnowsza: 23.08.2025). Nie ustalono, czy edycja 2026 się odbyła i kiedy będzie 2027. |
| notes (limit) | placeholder | „Limit czasu: 16 godz. 30 min. Udział wymaga punktów kwalifikacyjnych i losowania." | [regulamin 2025](https://www.graniatatr.pl/regulamin.html) | średnia | Wymogi z regulaminu edycji 2025 (losowanie 300 osób, limit 350); mogą się zmienić. [OPIS] podaje ten sam limit 16:30 h. |

### 8. Łemkowyna Trail 150 — ŁUT 150 (`lemkowyna-lut-150`, order 8)

| Pole | Wartość obecna | Propozycja | Źródło | Pewność | Uwagi |
|---|---|---|---|---|---|
| name | Łemkowyna Trail ŁUT 150 | bez zmian (organizator: „Łemkowyna Trail 150"; marka „Łemkowyna Ultra-Trail®") | [organizator](http://www.ultralemkowyna.pl/trasy/lemkowyna-trail-150), [REG] | wysoka | |
| distanceKm | 150 | 150 | [organizator](http://www.ultralemkowyna.pl/trasy/lemkowyna-trail-150): „ok. 150km", +5860 m / −5970 m | wysoka | |
| location | (brak) | Krynica-Zdrój – Komańcza (Główny Szlak Beskidzki) | [organizator](http://www.ultralemkowyna.pl/trasy/lemkowyna-trail-150): start Krynica-Zdrój, meta Komańcza | wysoka | [REG] podaje tylko „Krynica-Zdrój". |
| typicalMonth | październik | październik | [organizator](http://www.ultralemkowyna.pl/trasy/lemkowyna-trail-150), [REG] | wysoka | |
| plannedDate | (brak) | 2026-10-17 | [organizator](http://www.ultralemkowyna.pl/trasy/lemkowyna-trail-150): „17.10.2026, 01:00" start; zamknięcie mety 18.10.2026, 12:00 | wysoka | Edycja 17–18.10.2026. Terminu 2027 nie ustalono. |
| notes | placeholder | „Limit czasu: 35 godz. Wymóg: min. 6 pkt ITRA w maks. 2 biegach lub udokumentowane doświadczenie." | [organizator](http://www.ultralemkowyna.pl/trasy/lemkowyna-trail-150), [zgłoszenia](https://www.ultralemkowyna.pl/zgloszenia) | wysoka | 5 pkt ITRA za bieg; limit 550 osób. |

### 9. Bison Ultra Trail (`bison-ultra-trail`, order 9)

| Pole | Wartość obecna | Propozycja | Źródło | Pewność | Uwagi |
|---|---|---|---|---|---|
| name | Bison Ultra Trail | „Bison Ultra-Trail 100" (opcjonalnie; ok. 106 km) | [organizator](https://bisonultratrail.pl/trasy/bison-ultra-trail-100-km/): „Bison Ultra-Trail® 100" | wysoka | [REG] pisze „Bison Ultra Trail – 106 km". |
| distanceKm | 106 | 106 | [organizator](https://bisonultratrail.pl/trasy/bison-ultra-trail-100-km/): „DYSTANS: ok. 106 km", [REG] | wysoka | Nazwa „100" jest nazwą handlową, faktyczny dystans ok. 106 km. [OPIS] pisze „Bison Ultra Trail 100 — 100 km" (nieprecyzyjnie). |
| location | (brak) | Supraśl (Podlasie) | [organizator](https://bisonultratrail.pl/trasy/bison-ultra-trail-100-km/): start i meta Supraśl | wysoka | |
| typicalMonth | październik | październik | [organizator](https://bisonultratrail.pl/), [REG] | wysoka | |
| plannedDate | 2026-10-03 | 2026-10-03 (potwierdzone) | [organizator](https://bisonultratrail.pl/trasy/bison-ultra-trail-100-km/): „DATA: 03 października 2026", start 3:00 | wysoka | Strona „Program" organizatora ([program](https://bisonultratrail.pl/program-startow/)) jest nieaktualna (opis edycji 2025, aktualizacja 26.09.2025) — nie używać. |
| notes | placeholder | „Limit czasu: 16 godz.; 4 pkt ITRA." | [organizator](https://bisonultratrail.pl/trasy/bison-ultra-trail-100-km/) | wysoka | Limit 450 osób. **Do potwierdzenia u Kingrunner:** czy edycja 2026 zalicza się do Korony (zob. „Otwarte pytania"). |

### 10. Kaliska Setka (`kaliska-setka`, order 10)

| Pole | Wartość obecna | Propozycja | Źródło | Pewność | Uwagi |
|---|---|---|---|---|---|
| name | Kaliska Setka | bez zmian | [REG], [Kingrunner — 40. Kaliska Setka](https://www.kingrunner.com/bieg/40-kaliska-setka/4071) | wysoka | |
| distanceKm | 100 | 100 | [REG], [Kingrunner — 40. Kaliska Setka](https://www.kingrunner.com/bieg/40-kaliska-setka/4071) | wysoka | Bieg na pętli (20 pętli po 5 km) — wg opisów zewnętrznych. |
| location | (brak) | Kalisz (Wielkopolska) | [REG], [Kingrunner](https://www.kingrunner.com/bieg/40-kaliska-setka/4071): Park Miejski, Kalisz | wysoka (miasto) / średnia (Park Miejski) | Organizator: Klub Biegacza Supermaratończyk. Jego strona (`supermaraton.kalisz.pl`) i rejestracja (`f-time.pl`) nie odpowiedziały przy weryfikacji; szczegóły „Park Miejski / pętla 5 km" pochodzą z kalendarza Kingrunner i streszczenia regulaminu 39. edycji ([PDF](http://f-time.pl/dokumenty/2024/regulamin_Kaliska_Setka_2024.pdf), tylko przez wyszukiwarkę). |
| typicalMonth | październik | październik | [REG], edycje: 26.10.2024, 25.10.2025 ([Kingrunner](https://www.kingrunner.com/bieg/40-kaliska-setka/4071)) | wysoka | Bywa ostatnim biegiem sezonu Korony. |
| plannedDate | (brak) | nie ustalono (2026) | — | — | Nie znaleziono terminu 41. edycji (2026) ani potwierdzenia od organizatora. Wzorzec: sobota w drugiej połowie października — nie zapisywać jako pewnik. |
| notes | placeholder | „Limit czasu: 12,5 godz." | [Kingrunner](https://www.kingrunner.com/bieg/40-kaliska-setka/4071) (edycja 2025) | średnia | Wartość z kalendarza (edycja 2025) i z regulaminu 2024 — do sprawdzenia w regulaminie 2026 lub pominięcia. |

### 11. Bieg 7 Dolin (Piwniczna) — bieg wycofany (`bieg-7-dolin`, order 11, ukończony 2024-09-07)

| Pole | Wartość obecna | Propozycja | Źródło | Pewność | Uwagi |
|---|---|---|---|---|---|
| name | Bieg 7 Dolin (Piwniczna) | bez zmian (oficjalnie: „Festiwal Biegowy — Bieg 7 Dolin 100 km") | [organizator](https://www.festiwalbiegowy.pl/trasy/bieg-7-dolin-100km), [REG-3.0] | wysoka | |
| distanceKm | 100 | 100 (organizator, obecna trasa: 100,7 km) | [REG-3.0]: „100 km"; [organizator](https://www.festiwalbiegowy.pl/trasy/bieg-7-dolin-100km): „Dystans: 100,7 km", +3740/−3740 m | średnia | Dokładny dystans trasy z 2024 r. nie został sprawdzony; zapis 100 jest zgodny z listą Korony. |
| location | Piwniczna Zdrój | Piwniczna-Zdrój (Beskid Sądecki) | [organizator](https://www.festiwalbiegowy.pl/trasy/bieg-7-dolin-100km): „Lokalizacja startu i mety: Piwniczna-Zdrój, Nakło" | wysoka | Poprawna pisownia miejscowości: z łącznikiem. |
| typicalMonth | (brak) | wrzesień (edycje 2024 i 2025) | [REG-3.0]: „(wrzesień)"; [Kingrunner — 7 Dolin 2025](https://www.kingrunner.com/bieg/festiwal-biegowy---bieg-7-dolin---100-km/3868): 6.09.2025 | wysoka | Edycja 2026 miała być w lipcu (24–26.07.2026), po zmianie terminu; została odwołana. Zapis przydatny tylko historycznie. |
| plannedDate | (brak) | nie dotyczy | — | — | Bieg ukończony wspólnie 2024-09-07 (dane właściciela). |
| retired / notes | „Bieg wycofany z listy Korony: od 2026 r. nie jest organizowany, wcześniej bieg podstawowy Korony." | „Bieg wycofany z listy stałych biegów Korony 4.0; wg regulaminu Korony ukończenie do edycji 2025 włącznie można zaliczyć do klasyfikacji. Edycja 2026 została odwołana przez organizatora." | [REG], [komunikat organizatora z 2.06.2026](https://www.festiwalbiegowy.pl/aktualnosci/komunikat-o-odwolaniu-17-festiwalu-biegowego-w-piwnicznej-zdroju) | wysoka | Obecny tekst jest nieprecyzyjny: organizator nie ogłosił zakończenia imprezy, tylko odwołał edycję 2026 i zapowiedział „propozycję wydarzenia biegowego na 2027 rok". Obecne `retired: true` pozostaje zgodne z regulaminem 4.0 (nie ma go na liście). |

---

## Rozbieżności między źródłami

**Regulamin Korony 4.0 vs opis Korony 4.0 (kingrunner.com)**

1. **Struktura listy.** [OPIS] wymienia „10 biegów Korony (stałe)": ZUK, PUT, Rzeźnik, SGS, Chudy, BUGT, ŁUT, Kaliska, **Bison Ultra Trail 100**, **Ultra Wysoczyzna Ryk Jelenia**; jako „zamienne/alternatywne" tylko Maraton Karkonoski i/lub Zamieć 24h (do edycji 2024) oraz Bieg 7 Dolin (do edycji 2025). [REG] ma listę 10 numerowanych pozycji (te same 10), ale w zasadach dzieli je na **8 stałych** (bez Bisona i Ryka Jelenia) plus „jeden z trzech": Maraton Karkonoski / Zamieć 24h (do 2024), Bison Ultra Trail 106 km, Ultra Wysoczyzna Ryk Jelenia (od edycji 2027).
2. **Arytmetyka w [REG]:** „potrzebne jest 10 biegów czyli, 8 tych które są od samego początku oraz jeden z trzech" — 8 + 1 = 9, nie 10. Wersja 3.0 miała „9 + jeden z trzech" = 10 (z Biegiem 7 Dolin jako stałym); po wyjęciu 7 Dolin liczba 10 nie została poprawiona.
3. **Ultra Wysoczyzna Ryk Jelenia:** [OPIS] — „103 km (od 2026)" i traktuje jako stały bieg; [REG] — trasa liczy się „od edycji 2027 roku". Kilometraż 103 km obowiązuje od 2026 ([OPIS]), a do Korony liczy się dopiero od edycji 2027 ([REG]).
4. **Bison:** [REG]: „Bison Ultra Trail - 106 km zaliczamy z poprzednich edycji" (nieprecyzyjne: czy liczy się edycja 2026?); [OPIS]: „Bison Ultra Trail 100 — 100 km"; organizator: „ok. 106 km".
5. **Data i wersja:** tekst [REG] nadal nosi datę „POLSKA, 07.12.2024", a archiwum pokazuje, że do 21.05.2026 ten sam adres miał nagłówek „3.0" z Biegiem 7 Dolin jako stałym biegiem nr 7. Wersja 4.0 pojawiła się więc między 21.05.2026 a dziś; [OPIS] ma dopisek „aktualizacja: czerwiec 2026r." (wnioskowanie: zmiana zbiegła się z odwołaniem edycji 7 Dolin 2.06.2026 — to hipoteza, nie stwierdzenie źródła).
6. **Strona Bison Ultra Trail „Korona Polskich Ultramaratonów"** ([link](https://bisonultratrail.pl/korona-polskich-ultramaratonow/), „ostatnia aktualizacja 4 marca 2026") nadal pokazuje starą listę 3.0 (z Biegiem 7 Dolin i „9 + jeden z trzech"), więc jest nieaktualna względem 4.0.
7. **Bieg Ultra Granią Tatr:** [OPIS]: „od 2023 r. bieg odbywa się co roku"; organizator: „od roku 2024 jest rozgrywany co roku". Drobna rozbieżność, bez wpływu na dane.

**Regulamin/opis Korony vs organizatorzy**

| Bieg | Regulamin/opis Korony | Organizator | Wniosek |
|---|---|---|---|
| Bieg Rzeźnika | 84 km ([REG]) | „około 80 km" ([organizator](https://www.biegrzeznika.pl/bieg-rzeznika/), edycja 2027; Hardcore 80 + 22,5 = ok. 106 km) | do decyzji właściciela |
| SGS | 54,7 km ([REG]) | 55 km ([regulamin 2026](https://www.maratongorstolowych.pl/wp-content/uploads/2026/02/SGS26_Regulamin.docx-1.pdf)); edycja 2026 faktycznie ok. 45 km | do decyzji właściciela |
| ZUK | 47,5 km, „Karpacz" ([REG]) | 47,5 km wg regulaminu, „około 48 km" wg strony trasy; start Szklarska Poręba, meta Karpacz | dystans zgodny; miejsce: start–meta |
| Chudy Wawrzyniec 80+ | 82 km, „Rajcza" | ok. 82,5 km; start Rajcza, meta Ujsoły | dystans zgodny (zaokrąglenie), miejsce: start–meta |
| Ultra Wysoczyzna | „Tolkmicko" | start i meta w Elblągu; Tolkmicko = przepak (49. km) | wg organizatora: Elbląg |
| ŁUT 150 | „Krynica-Zdrój" | start Krynica-Zdrój, meta Komańcza | miejsce: start–meta |
| Bieg Ultra Granią Tatr | „Zakopane" | start Siwa Polana, meta Kuźnice (Zakopane) | miejsce: start–meta |
| Bison | „106 km" ([REG]) / „100 km" ([OPIS]) | ok. 106 km | 106 |
| 7 Dolin | „100 km" | 100,7 km (trasa 2025/2026) | drobna różnica |

**Organizator vs stan wiedzy właściciela / dokumentów projektu**

- **Bieg 7 Dolin:** projekt (DEC-008, FR-8, `notes`): „od 2026 r. nie jest organizowany". Organizator: edycja 2026 **odwołana** (komunikat 2.06.2026), powrót „na 2027 rok" zapowiedziany bez daty. Regulamin Korony: zaliczenie „do edycji 2025 włącznie".
- **Strona organizatora 7 Dolin** ([link](https://www.festiwalbiegowy.pl/trasy/bieg-7-dolin-100km)) nadal pokazuje termin „25. lipca 2026" — jest nieaktualna względem komunikatu o odwołaniu.
- **Strona Bieg Ultra Granią Tatr** ([link](https://www.graniatatr.pl/)) nie zawiera nic o edycji 2026/2027.

---

## Regulamin Korony 4.0 — wymagane ustalenia

### 1. Lista biegów i podział stałe / wymienne

Źródło: [REG]. Dosłowna lista (10 pozycji):

1. ZUK — 47,5 km, Karpacz (luty)
2. Pieniny Ultra Trail – Niepokorny Mnich — 95,2 km, Szczawnica (kwiecień)
3. Ultra Wysoczyzna – Ryk Jelenia — 103 km, Tolkmicko (kwiecień/maj)
4. Bieg Rzeźnika — 84 km, Komańcza (weekend Boże Ciało)
5. Supermaraton Gór Stołowych — 54,7 km, Karłów (czerwiec)
6. Chudy Wawrzyniec 80+ — 82 km, Rajcza (sierpień)
7. Bieg Ultra Granią Tatr — 71 km, Zakopane (sierpień)
8. Łemkowyna Trail – ŁUT 150 — 150 km, Krynica-Zdrój (październik)
9. Bison Ultra Trail — 106 km, Supraśl (październik)
10. Kaliska Setka — 100 km, Kalisz (październik)

Zasady zaliczenia w [REG]: „Do zaliczenia KPU potrzebne jest 10 biegów czyli, 8 tych które są od samego początku oraz jeden z trzech - Maraton Karkonoski, Zamieć 24h (do edycji 2024), Bison Ultra Trail 106 km oraz Ultra Wysoczyzna Ryk Jelenia od edycji 2027 roku."

Wychodzi więc, że **stałych jest 8** (bez pozycji 3 i 9), a Bison 106 km i Ultra Wysoczyzna są w grupie „jeden z…" (wymienne). W tym zdaniu wymieniono w rzeczywistości cztery biegi (Maraton Karkonoski, Zamieć 24h, Bison, Ultra Wysoczyzna) jako „jeden z trzech" — kolejna niespójność. Opis [OPIS] traktuje wszystkie 10 pozycji jako stałe, a jako zamienne wymienia tylko Maraton Karkonoski/Zamieć 24h i Bieg 7 Dolin. **Rozbieżności wypisano w sekcji wyżej.**

Dodatkowo w [REG]: brak określonego czasu ukończenia całej Korony („Może trwać rok, może trwać kila lat"), kolejność dowolna, wymagane jest ukończenie w limicie czasu, zgłoszenie na `redakcja@kingrunner.com` z linkami do wyników. Bluza finishera: aktywna prenumerata Magazynu ULTRA i „opłata manipulacyjna, 99,00 zł" dla zgłoszeń od 2026 r.

### 2. Status Biegu 7 Dolin

- **Nie ma go na liście 10 biegów** w [REG] ani w [OPIS]. W wersji 3.0 był stałym biegiem nr 7: „Festiwal Biegowy, Bieg 7 Dolin – 100 km, Piwniczna-Zdrój, Beskid Sądecki (wrzesień)" ([REG-3.0], [OPIS-3.0] — zob. też wersja z 23.06.2024 [opisu](https://web.archive.org/web/20240623085954/https://www.kingrunner.com/artykul/korona-polskich-ultramaratonow/154), gdzie był biegiem nr 7 „Bieg 7 Dolin 100"). **Potwierdza to twierdzenie właściciela, że w 2024 był biegiem podstawowym Korony.**
- W 4.0 jest opisany jako bieg zaliczany historycznie: „Wszyscy którzy przebiegli Bieg 7 Dolin Festiwalu Biegowego do edycji 2025 włącznie mogą zaliczyć ten bieg do klasyfikacji." ([REG]) oraz „… Bieg 7 Dolin Festiwal Biegowy do edycji 2025 włącznie, mogą zaliczyć ten bieg do puli 10-ciu biegów KORONY POLSKICH ULTRAMARATONÓW" ([OPIS], dopisek PS).
- **Od kiedy wycofany:** regulamin nie podaje daty ani powodu; ostatnią edycją zaliczaną jest 2025 (6.09.2025). Edycja 2026 (planowana 24–26.07.2026) została **odwołana** przez organizatora 2.06.2026 ([komunikat](https://www.festiwalbiegowy.pl/aktualnosci/komunikat-o-odwolaniu-17-festiwalu-biegowego-w-piwnicznej-zdroju)); organizator: „Wrócimy do Was z propozycją wydarzenia biegowego na 2027 rok". Nie ustalono, czy edycja 2027 się odbędzie i czy będzie zaliczana.

### 3. Wycofanie biegu z listy a osoby, które go ukończyły (wpływ na „wolny slot", DEC-008)

Cytaty z [REG] (<https://www.kingrunner.com/artykul/regulamin---korona-polskich-ultramaratonow-40/1109>):

- Pytanie postawione we wstępie: „Czy można zaliczyć biegi, które juz nie znajdują się w "Koronie"?" — „Mamy nadzieję, że poniższy regulamin wyjaśni wasze wątpliwości."
- Odpowiedź: „Wszyscy którzy przebiegli Bieg 7 Dolin Festiwalu Biegowego do edycji 2025 włącznie mogą zaliczyć ten bieg do klasyfikacji."
- Analogicznie dla biegów wcześniej wycofanych: „Do klasyfikacji liczą się również Maraton Karkonoski oraz Zamieć 24h (do edycji 2024 r. włącznie), minimum 4 pętle, w dowolnym roku w którym odbywał się dany bieg."
- Czas: „Czas rozpoczęcia zdobywania poszczególnych biegów … nie jest określony." / „Kolejność ukończenia poszczególnych biegów jest dowolna."

**Wniosek:** ukończony w 2024 r. Bieg 7 Dolin **zalicza się do Korony** wg regulaminu 4.0. Regulamin nie mówi jednak wprost, **który slot z 10 zajmuje** (zob. niespójności 1–2 wyżej). Dwie możliwe interpretacje, wpływające na decyzję o „wolnym slocie":

- **Wg [OPIS]** (10 stałych + 7 Dolin zamiast jednego z nich, „do puli 10-ciu biegów"): właściciele potrzebują 9 z pozostałych 10 biegów; do wyboru, którego z nich nie biec (np. Bison **albo** Ultra Wysoczyzna).
- **Wg [REG]** (8 stałych + „jeden z…" = 9, plus 7 Dolin jako dziesiąty): potrzebne są 8 stałych + jeden z {Bison 106 km, Ultra Wysoczyzna od 2027, Maraton Karkonoski/Zamieć do 2024}.

W obu interpretacjach **nie trzeba ukończyć zarówno Bisona, jak i Ultra Wysoczyzny**. Rozstrzygnąć może tylko redakcja (`redakcja@kingrunner.com`) — zob. otwarte pytania. Rekomendacja Lead/QA: do czasu odpowiedzi nie zmieniać licznika X/10 (obecnie 7 Dolin wlicza się zgodnie z DEC-008).

---

## Propozycja usunięcia placeholdera z `notes`

Placeholder do usunięcia, dosłownie: „Dane orientacyjne z regulaminu Korony 4.0 (kingrunner.com) - wymagają weryfikacji z regulaminem." Występuje w 10 plikach: `zuk`, `pieniny-ultra-trail`, `ultra-wysoczyzna-ryk-jelenia`, `bieg-rzeznika`, `sgs`, `chudy-wawrzyniec`, `ultra-grania-tatr`, `lemkowyna-lut-150`, `bison-ultra-trail`, `kaliska-setka`. Plik `bieg-7-dolin` go nie zawiera.

**Propozycja:** usunąć pole `notes` w tych 10 biegach (albo zastąpić krótkimi notatkami poniżej, tylko te, które wnoszą wartość dla czytelnika). Notatki bez treści osobistych; limity wg regulaminów najnowszych znanych edycji.

| Bieg | Proponowane `notes` | Uwagi |
|---|---|---|
| zuk | Limit czasu: 10,5 godz. | pewność wysoka |
| pieniny-ultra-trail | Limit czasu: 20 godz. | wysoka |
| ultra-wysoczyzna-ryk-jelenia | Limit czasu: 17 godz. Do Korony zaliczany od edycji 2027. | wysoka |
| bieg-rzeznika | Bieg w parach. Limit czasu: 17 godz. | wysoka |
| sgs | Limit czasu: 11 godz. | wysoka |
| chudy-wawrzyniec | Limit czasu: 16 godz. | wysoka |
| ultra-grania-tatr | Limit czasu: 16 godz. 30 min. Udział przez losowanie, wymagane punkty kwalifikacyjne. | średnia (regulamin 2025) |
| lemkowyna-lut-150 | Limit czasu: 35 godz. Wymagane min. 6 pkt ITRA. | wysoka |
| bison-ultra-trail | Limit czasu: 16 godz. | wysoka |
| kaliska-setka | (bez notatki; limit 12,5 godz. do sprawdzenia w regulaminie 2026) | średnia |
| bieg-7-dolin | „Bieg wycofany z listy stałych biegów Korony 4.0; wg regulaminu Korony ukończenie do edycji 2025 włącznie można zaliczyć do klasyfikacji. Edycja 2026 została odwołana przez organizatora." | wysoka; zastępuje obecną notatkę |

---

## Otwarte pytania do właściciela

1. **Dystans w danych:** który wariant przyjąć tam, gdzie regulamin Korony i organizator się różnią: Bieg Rzeźnika (84 vs ok. 80 km), SGS (54,7 vs 55 km), Chudy Wawrzyniec (82 vs 82,5 km), Bieg 7 Dolin (100 vs 100,7 km)? Czy zależy Wam na dystansie „z regulaminu Korony", czy faktycznie przebiegniętym w Waszej edycji? (Dla Rzeźnika i 7 Dolin z 2024 r. nie ustalono dystansu trasy z tamtej edycji.)
2. **Interpretacja regulaminu:** czy wysłać pytanie do `redakcja@kingrunner.com` o (a) który slot zajmuje Bieg 7 Dolin, (b) czy Bison Ultra-Trail 2026 (3.10.2026) zalicza się mimo zapisu „zaliczamy z poprzednich edycji", (c) czy liczbę 10 należy rozumieć jako 8 stałych + 7 Dolin + jeden z {Bison, Ultra Wysoczyzna}, (d) czy skrócona edycja SGS 2026 (ok. 45 km) ma znaczenie dla zaliczenia? Od tego zależy decyzja o „wolnym slocie" (DEC-008).
3. **Bieg 7 Dolin:** czy zmienić sformułowanie „od 2026 r. nie jest organizowany" (w danych, DEC-008, FR-8) na „edycja 2026 odwołana; organizator zapowiada powrót w 2027"? Czy zostawić flagę `retired: true` mimo możliwego powrotu w 2027 r.?
4. ~~**Terminy bez potwierdzenia organizatora**~~ — POMINIĘTE (2026-09-22, decyzja właściciela): ZUK 2027, Chudy Wawrzyniec 2027, Bieg Ultra Granią Tatr (2026/2027), Kaliska Setka 2026, Pieniny Ultra Trail 2027 nieistotne na tym etapie; nie sprawdzać u organizatorów.
5. **Kaliska Setka:** czy potwierdzić limit czasu, Park Miejski i pętlę 5 km bezpośrednio na stronie/Facebooku organizatora (Klub Biegacza Supermaratończyk)? Nie udało się otworzyć źródeł organizatora.
6. **Nazwy:** używać nazw z regulaminu Korony (obecnie), czy organizatora („Bieg Granią Tatr", „Łemkowyna Trail 150", „Bison Ultra-Trail 100", „Meble Wójcik ULTRA WYSOCZYZNA — Ryk jelenia")? Rekomendacja: zostawić dotychczasowe (zgodne z Koroną), dopisać tylko „im. Tomka Kowalskiego" (ZUK) i „Niepokorny Mnich" (PUT) opcjonalnie.
7. **Format `location`:** przyjąć „start – meta" (np. „Komańcza – Cisna"), czy sam start/region? Propozycje w tym dokumencie stosują „start – meta (region)".
8. **`plannedDate` dla biegów bez planu:** strona pokazuje pole „Termin" także dla `unplanned`. Czy zapisywać tam termin najbliższej edycji (np. ŁUT 2026-10-17, SGS 2027-06-26, Ryk Jelenia 2027-04-17), czy tylko dla biegów, na które właściciele się zapiszą?
9. **Notatki:** czy wstawiać limit czasu (zmienia się między edycjami), czy usunąć `notes` całkowicie? Propozycja: wstawić tylko limity z najnowszych edycji, jak w tabeli.

---

## Gotowy JSON do skopiowania (po akceptacji właściciela)

Zasady: tylko pola o pewności **wysokiej**. Nie zapisano nigdzie w `src/content`. Klucz to identyfikator pliku (`<klucz>.json`); kopiować wartości do odpowiednich pól (np. w panelu). `plannedDate` wstawiać tylko dla biegów, które właściciel planuje (zob. pytanie 8).

### Blok A — bez konfliktu ze źródłami

```json
{
  "zuk": {
    "distanceKm": 47.5,
    "location": "Szklarska Poręba – Karpacz (Karkonosze)",
    "typicalMonth": "luty"
  },
  "pieniny-ultra-trail": {
    "distanceKm": 95.2,
    "location": "Szczawnica (Pieniny)",
    "typicalMonth": "kwiecień"
  },
  "ultra-wysoczyzna-ryk-jelenia": {
    "distanceKm": 103,
    "location": "Elbląg (Wysoczyzna Elbląska)",
    "typicalMonth": "kwiecień",
    "plannedDate": "2027-04-17"
  },
  "bieg-rzeznika": {
    "location": "Komańcza – Cisna (Bieszczady)",
    "typicalMonth": "maj/czerwiec (weekend Bożego Ciała)"
  },
  "sgs": {
    "location": "Karłów (Góry Stołowe)",
    "typicalMonth": "czerwiec",
    "plannedDate": "2027-06-26"
  },
  "chudy-wawrzyniec": {
    "distanceKm": 82,
    "location": "Rajcza – Ujsoły (Beskid Żywiecki)",
    "typicalMonth": "sierpień"
  },
  "ultra-grania-tatr": {
    "distanceKm": 71,
    "location": "Siwa Polana – Kuźnice (Tatry, Zakopane)",
    "typicalMonth": "sierpień"
  },
  "lemkowyna-lut-150": {
    "distanceKm": 150,
    "location": "Krynica-Zdrój – Komańcza (Główny Szlak Beskidzki)",
    "typicalMonth": "październik",
    "plannedDate": "2026-10-17"
  },
  "bison-ultra-trail": {
    "distanceKm": 106,
    "location": "Supraśl (Podlasie)",
    "typicalMonth": "październik",
    "plannedDate": "2026-10-03"
  },
  "kaliska-setka": {
    "distanceKm": 100,
    "location": "Kalisz (Wielkopolska)",
    "typicalMonth": "październik"
  },
  "bieg-7-dolin": {
    "location": "Piwniczna-Zdrój (Beskid Sądecki)",
    "typicalMonth": "wrzesień"
  }
}
```

### Blok B — wartości organizatora sprzeczne z regulaminem Korony (tylko po decyzji, pytanie 1)

Bez decyzji zostawić dotychczasowe wartości (84 / 54.7 / 100).

```json
{
  "bieg-rzeznika": { "distanceKm": 80 },
  "sgs": { "distanceKm": 55 }
}
```

### Blok C — `notes` (opcjonalnie, zamiast placeholdera; pozostałe biegi: usunąć pole `notes`)

```json
{
  "zuk": { "notes": "Limit czasu: 10,5 godz." },
  "pieniny-ultra-trail": { "notes": "Limit czasu: 20 godz." },
  "ultra-wysoczyzna-ryk-jelenia": { "notes": "Limit czasu: 17 godz. Do Korony zaliczany od edycji 2027." },
  "bieg-rzeznika": { "notes": "Bieg w parach. Limit czasu: 17 godz." },
  "sgs": { "notes": "Limit czasu: 11 godz." },
  "chudy-wawrzyniec": { "notes": "Limit czasu: 16 godz." },
  "lemkowyna-lut-150": { "notes": "Limit czasu: 35 godz. Wymagane min. 6 pkt ITRA." },
  "bison-ultra-trail": { "notes": "Limit czasu: 16 godz." },
  "bieg-7-dolin": { "notes": "Bieg wycofany z listy stałych biegów Korony 4.0; wg regulaminu Korony ukończenie do edycji 2025 włącznie można zaliczyć do klasyfikacji. Edycja 2026 została odwołana przez organizatora." }
}
```

Bez notatek (usunąć samo pole `notes`): `ultra-grania-tatr` (średnia pewność, regulamin 2025) i `kaliska-setka` (średnia pewność).

# Instrukcja dla autorów strony „Ultra w duecie”

Dla Damiana i Grzegorza. To instrukcja codziennego użycia: jak dodać wpis, jak zaktualizować postęp w biegach i co zrobić, gdy coś pójdzie nie tak. Nie wymaga wiedzy o programowaniu ani o Git.

Instalację i wdrożenie strony (Cloudflare, aplikacja GitHub) opisuje osobny dokument: `docs/cms-setup.md`. Tu tylko na niego odsyłamy.

Nazwy przycisków i pól w panelu podajemy tak, jak są w konfiguracji panelu. Nazwy w serwisach zewnętrznych (GitHub, Cloudflare) bywają zmieniane przez ich właścicieli; jeśli coś wygląda inaczej, szukaj najbardziej podobnej opcji.

## Spis treści

1. [Jak to działa w skrócie](#1-jak-to-działa-w-skrócie)
2. [Logowanie do panelu](#2-logowanie-do-panelu)
3. [Dodanie wpisu na blogu](#3-dodanie-wpisu-na-blogu)
4. [Wpis Grzegorza (bez konta GitHub)](#4-wpis-grzegorza-bez-konta-github)
5. [Aktualizacja postępu w biegach](#5-aktualizacja-postępu-w-biegach)
6. [Gdy dane są błędne: co się dzieje i jak naprawić](#6-gdy-dane-są-błędne-co-się-dzieje-i-jak-naprawić)
7. [Cofnięcie błędnej zmiany](#7-cofnięcie-błędnej-zmiany)
8. [Praca z własnego komputera (dla Damiana)](#8-praca-z-własnego-komputera-dla-damiana)
9. [Dodanie Grzegorza jako współautora w przyszłości](#9-dodanie-grzegorza-jako-współautora-w-przyszłości)
10. [Najczęstsze pytania](#10-najczęstsze-pytania)

## 1. Jak to działa w skrócie

- Cała treść strony (wpisy, zdjęcia, dane biegów) leży w **repozytorium** na GitHubie. Repozytorium to folder z plikami, w którym GitHub pamięta całą historię zmian.
- **Panel** to strona do edycji tej treści, z formularzami zamiast plików. Adres panelu: **https://korona.damianwojcicki.com/admin/**. Gdy wpiszesz adres z ukośnikiem na końcu, przeglądarka sama przeniesie Cię na wersję bez ukośnika (`/admin`). To normalne.
- Kiedy w panelu klikasz zapis, panel zapisuje zmianę w repozytorium jako **commit** (zapisany krok w historii zmian, z datą i autorem). Nic się nie „gubi”: każdą zmianę da się obejrzeć i cofnąć (rozdział 7).
- Po każdym zapisie Cloudflare sam buduje stronę na nowo. Nowa wersja jest widoczna zwykle **po 1-2 minutach**. Odśwież stronę, jeśli nie widzisz zmiany od razu.
- Zapisywać zmiany może tylko konto GitHub, które ma **prawo zapisu** w repozytorium `wojcickid/ultra-w-duecie`; bez niego panel niczego nie opublikuje. Na start jest to konto Damiana.
- Autor wpisu to pole w formularzu, a nie konto, którym się logujesz. Dlatego Damian może opublikować wpis podpisany „Grzegorz” (rozdział 4).

Panel ma trzy działy (w menu): **Wpisy**, **Biegi**, **Autorzy**.

## 2. Logowanie do panelu

1. Otwórz https://korona.damianwojcicki.com/admin/.
2. Kliknij **Sign In with GitHub**.
3. Otworzy się małe okno GitHuba. Zaloguj się (jeśli trzeba) i zatwierdź prośbę o zgodę dla aplikacji „Ultra w duecie - panel CMS”. Przy pierwszym logowaniu GitHub pyta o zgodę; przy kolejnych zwykle już nie.
4. Okno zamknie się samo, a panel się załaduje.

Jeśli okno logowania się nie otwiera, przeglądarka najpewniej zablokowała wyskakujące okna. Zezwól na nie dla `korona.damianwojcicki.com` i spróbuj ponownie.

### Włączenie 2FA na koncie GitHub

2FA (uwierzytelnianie dwuskładnikowe) to drugi krok przy logowaniu, zwykle kod z aplikacji w telefonie. Chroni konto, które może zmienić całą stronę, więc jest zalecane dla każdego konta z prawem zapisu.

1. Zaloguj się na github.com.
2. Kliknij swój awatar (prawy górny róg) → **Settings**.
3. W lewym menu wybierz **Password and authentication**.
4. W sekcji dotyczącej uwierzytelniania dwuskładnikowego (**Two-factor authentication**) kliknij **Enable** i postępuj według instrukcji na ekranie (najwygodniej aplikacja do kodów w telefonie).
5. Zapisz kody odzyskiwania w bezpiecznym miejscu (np. w menedżerze haseł). Nie wysyłaj ich nikomu.

### Problemy z logowaniem

Najczęstsze komunikaty i ich rozwiązania są w tabeli „Gdy nie działa (typowe problemy)” w `docs/cms-setup.md`. Zajrzyj tam, jeśli widzisz np. „Ta domena nie ma prawa korzystać z logowania”, „Logowanie nie jest skonfigurowane po stronie serwera” albo błąd GitHuba o adresie zwrotnym (`redirect_uri`). W razie kłopotów przekaż komunikat osobie technicznej.

## 3. Dodanie wpisu na blogu

1. Zaloguj się do panelu (rozdział 2).
2. W menu wybierz **Wpisy** i kliknij przycisk tworzenia nowego wpisu (**Nowy wpis**).
3. Wypełnij pola (nazwy dokładnie jak w panelu):

   | Pole | Co wpisać |
   | --- | --- |
   | **Tytuł** | Tytuł wpisu. Z tytułu powstaje adres wpisu (patrz niżej). |
   | **Data** | Domyślnie dzisiejsza. Zmień, jeśli wpis ma nosić inną datę. Wpisy na liście są od najnowszych. |
   | **Autorzy** | Wybierz jednego autora albo obu (pole pozwala wskazać kilka osób; wymagany jest co najmniej jeden). Autor nie zależy od konta GitHub, którym publikujesz. |
   | **Bieg** | Opcjonalnie. Wybierz, jeśli wpis dotyczy konkretnego biegu Korony. Na stronie wpisu pojawi się link „Powiązany bieg”. |
   | **Zdjęcia** | Opcjonalnie. Dodaj zdjęcie przyciskiem dodawania elementu listy, w polu **Plik** wybierz plik z komputera, a w polu **Opis alternatywny** wpisz krótko, co widać na zdjęciu (np. „Damian i Grzegorz na mecie Biegu Rzeźnika”). Opis jest obowiązkowy dla każdego zdjęcia: czytają go programy dla osób niewidzących i wyświetla się, gdy zdjęcie się nie załaduje. |
   | **Treść** | Tekst wpisu w Markdownie (ściągawka niżej). |

4. Kliknij **Zapisz** (po angielsku **Save**). Zapis od razu tworzy commit w repozytorium; nie ma osobnego etapu zatwierdzania.
5. Poczekaj 1-2 minuty i sprawdź stronę: https://korona.damianwojcicki.com/blog.

Zdjęcia dodane w polu **Zdjęcia** wyświetlają się na stronie wpisu w sekcji „Zdjęcia” pod tekstem, a pierwsze zdjęcie jest miniaturą wpisu na liście bloga. Panel zapisuje je w folderze wpisu, obok pliku z tekstem (patrz rozdział 8).

### Adres wpisu

Adres powstaje automatycznie z tytułu: bez polskich znaków, małymi literami, spacje zamieniane na myślniki, do 60 znaków. Przykład: tytuł „Łódź na Ślęży” daje adres `https://korona.damianwojcicki.com/blog/lodz-na-slezy`. Wybierz więc tytuł, z którego wyjdzie sensowny adres.

### Ściągawka Markdown

Markdown to prosty sposób zapisu formatowania zwykłym tekstem. Pole **Treść** ma też przyciski formatowania, więc nie musisz znać znaków na pamięć.

| Chcesz | Wpisz |
| --- | --- |
| Nagłówek większy | `## Tytuł sekcji` |
| Nagłówek mniejszy | `### Podtytuł` |
| Pogrubienie | `**pogrubiony tekst**` |
| Pochylenie | `*pochylony tekst*` |
| Lista punktowana | linie zaczynające się od `- ` |
| Lista numerowana | linie zaczynające się od `1. `, `2. ` |
| Link | `[tekst linku](https://adres.pl)` |
| Nowy akapit | pusta linia między akapitami |

Nagłówek pierwszego poziomu (`#`) pomiń: tytuł wpisu strona pokazuje sama z pola **Tytuł**.

### Edycja wpisu

1. **Wpisy** → kliknij wpis na liście.
2. Zmień, co trzeba, i kliknij **Zapisz**.
3. Po 1-2 minutach zmiana jest na stronie.

### Usunięcie wpisu

1. **Wpisy** → otwórz wpis.
2. Użyj opcji usunięcia wpisu (**Delete entry**) i potwierdź.
3. Po 1-2 minutach wpis znika ze strony.

Usunięcie też jest zwykłym commitem, więc można je cofnąć (rozdział 7). Jeśli po usunięciu w repozytorium zostały same pliki zdjęć z folderu wpisu, nie szkodzą one stronie (nieużywane zdjęcia nie trafiają na stronę); Damian może je usunąć później.

## 4. Wpis Grzegorza (bez konta GitHub)

Grzegorz nie musi mieć konta GitHub. Jego wpis publikuje Damian, a podpisany jest Grzegorzem, bo pole **Autorzy** jest niezależne od konta, które publikuje.

### Co robi Grzegorz

1. Pisze tekst w dowolnym edytorze (Notatnik, Word, wiadomość w komunikatorze). Wystarczy zwykły tekst; formatowanie Damian doda w Markdownie (rozdział 3). Jeśli Grzegorz chce coś pogrubić albo dodać nagłówki, może to zaznaczyć w wiadomości.
2. Podaje w wiadomości:
   - **tytuł** wpisu,
   - **datę** (jeśli inna niż dzień wysłania),
   - czy wpis ma być podpisany tylko przez niego, czy przez obu,
   - **bieg**, którego dotyczy wpis (jeśli dotyczy).
3. Wysyła tekst i zdjęcia Damianowi e-mailem albo komunikatorem.

### Zdjęcia od Grzegorza

- **Format:** JPG, PNG lub WebP. Zdjęcia z telefonu w formacie HEIC (typowe dla iPhone’ów) najlepiej wysłać jako JPG.
- **Rozmiar:** wystarczy zdjęcie o dłuższym boku około 2000 pikseli i do kilku MB. Na stronie zdjęcia w galerii wyświetlają się w szerokości do 800 pikseli, a większe pliki niepotrzebnie zapełniają repozytorium.
- **Opis alternatywny:** do każdego zdjęcia Grzegorz dopisuje jedno zdanie o tym, co na nim widać (np. „Widok na Tatry z Doliny Pięciu Stawów”). Bez opisu panel nie pozwoli zapisać zdjęcia.
- **Prywatność:** repozytorium jest publiczne, więc każde wgrane zdjęcie może zobaczyć każdy. Zdjęcia z telefonu mogą zawierać ukryte dane o lokalizacji (GPS). Jeśli to problem, wyłącz zapisywanie lokalizacji w aparacie albo usuń dane lokalizacji przed wysłaniem.
- Wysyłaj zdjęcia jako załączniki lub pliki, a nie przez komunikator, który mocno je kompresuje (jakość na stronie będzie wtedy słabsza).

### Co robi Damian

1. Loguje się do panelu (rozdział 2) i tworzy nowy wpis (rozdział 3).
2. Wkleja tytuł i tekst od Grzegorza do pól **Tytuł** i **Treść**, poprawia formatowanie.
3. W polu **Autorzy** wybiera **Grzegorz** (albo obu, jeśli wpis jest wspólny).
4. Dodaje zdjęcia od Grzegorza w polu **Zdjęcia** z jego opisami w polu **Opis alternatywny**.
5. Jeśli wpis dotyczy biegu, wybiera go w polu **Bieg**.
6. Klika **Zapisz** i po 1-2 minutach sprawdza wpis na stronie. Dobrze jest odesłać Grzegorzowi link do gotowego wpisu.

Kiedy Grzegorz będzie miał własne konto GitHub, może publikować sam (rozdział 9).

## 5. Aktualizacja postępu w biegach

Dane biegów Korony są w dziale **Biegi**. Lista biegów jest stała: w panelu **zmieniasz istniejące biegi**, ale nie da się dodać nowego biegu ani usunąć istniejącego. Nowy bieg dodaje deweloper (jako plik `src/content/runs/<nazwa>.json`).

### Jak edytować bieg

1. **Biegi** → kliknij bieg na liście. Listę można filtrować: **Ukończone**, **Planowane**, **Bez planu**, **Wycofane z listy Korony**.
2. Zmień pola i kliknij **Zapisz**.
3. Po 1-2 minutach zmiana jest na stronie.

### Status biegu

Pole **Status** opisuje wspólne podejście albo plan:

| Status w panelu | Znaczenie |
| --- | --- |
| **Ukończony** | Bieg został przebiegnięty i ma wpisany co najmniej jeden wynik „Ukończył”. |
| **Planowany** | Jest plan na ten bieg. Ustaw też **Planowana data**, jeśli ją znacie. |
| **Bez planu** | Domyślny status: na razie nie ma planu. |

Inne przydatne pola: **Orientacyjny termin** (tekst, np. „luty”), **Notatki**, **Kolejność** (pozycja na liście). Pole **Wycofany z listy Korony** opisano niżej.

### Wynik każdego autora

W polu **Wyniki** dodajesz osobny wynik dla każdego autora (jeden wynik na osobę; przycisk dodawania elementu listy jest pod nagłówkiem **Wyniki**). Każdy wynik ma pola:

| Pole | Co wpisać |
| --- | --- |
| **Autor** | Damian albo Grzegorz. |
| **Wynik** | **Ukończył**, **Nie ukończył (DNF)** albo **Nie wystartował (DNS)**. Domyślnie „Ukończył”. |
| **Data ukończenia** | Dla „Ukończył” obowiązkowa (data mety). Dla DNF i DNS opcjonalna (data podejścia). |
| **Czas oficjalny** | Format **HH:MM:SS**, np. `12:34:56` albo `105:12:00`. Dla „Ukończył” obowiązkowy, dla DNF opcjonalny, dla DNS zostaw puste. |
| **Link do wyników** | Opcjonalnie, pełny adres zaczynający się od `https://`. |
| **Notatka** | Opcjonalnie, krótko, np. „zejście na 62. km”. |

DNF (Did Not Finish) to start bez dobiegnięcia do mety. DNS (Did Not Start) to zapisanie się bez startu.

### Zasady, które warto znać

1. **„Ukończony” wymaga wyniku „Ukończył”.** Nie da się ustawić statusu **Ukończony**, jeśli nikt nie ma wyniku **Ukończył** (budowa strony zatrzyma się z błędem, rozdział 6).
2. **Licznik postępu (X/10 na stronie głównej) liczy bieg tylko wtedy, gdy obaj autorzy mają wynik „Ukończył” z TĄ SAMĄ datą ukończenia.** To znaczy „ukończony wspólnie”.
   - Przykład, który się liczy: Damian i Grzegorz mają „Ukończył” i obaj datę `2024-05-31`.
   - Przykład, który się NIE liczy: Damian „Ukończył” `2025-06-28`, a Grzegorz „Ukończył” `2025-07-05` (dwa różne podejścia). Wyniki są widoczne osobno jako indywidualne, ale licznik ich nie liczy.
   - Przykład, który się NIE liczy: Damian „Ukończył”, a Grzegorz „Nie wystartował (DNS)”.
3. **Biegli razem po północy?** Jeśli bieg trwał przez noc i mety mieliście w różnych dniach kalendarzowych, wpisz **obu tę samą datę** (np. datę startu albo mety, byle taką samą). Inaczej licznik uzna to za dwa osobne podejścia.
4. **DNF i DNS nie liczą się do licznika, ale są widoczne** na stronie biegu, na liście, na osi czasu i w wynikach indywidualnych (zawsze z tekstem i ikoną).
5. **Bieg wycofany z listy Korony.** Zaznacz **Wycofany z listy Korony** dla biegu, którego już nie ma na liście (np. Bieg 7 Dolin, którego edycja 2026 została odwołana, a wg regulaminu Korony ukończenie do edycji 2025 włącznie nadal się zalicza). Taki bieg nadal liczy się do postępu, jeśli obaj autorzy ukończyli go tego samego dnia.
6. Jeśli bieg nie jest ukończony wspólnie (np. tylko Damian ukończył), ustaw **Status** zgodnie z tym, co jest prawdą dla następnego podejścia (zwykle **Bez planu** albo **Planowany**), a wynik Damiana zostaw w **Wynikach**. Status **Ukończony** przy wyniku tylko jednej osoby zbuduje się, ale w logu budowy pojawi się ostrzeżenie, że bieg nie liczy się jako wspólny.

### Gotowe przykłady

**Przykład 1. Bieg ukończony razem (tak wygląda Bieg Rzeźnika).**

- **Status**: Ukończony
- Wynik 1: **Autor** Damian, **Wynik** Ukończył, **Data ukończenia** 2024-05-31, **Czas oficjalny** 16:46:15, **Link do wyników** z wyników zawodów.
- Wynik 2: **Autor** Grzegorz, **Wynik** Ukończył, **Data ukończenia** 2024-05-31, **Czas oficjalny** 16:46:15, **Link do wyników** z wyników zawodów.
- Skutek: bieg liczy się do licznika.

**Przykład 2. Damian ukończył, Grzegorz nie wystartował (tak wygląda SGS 2025).**

- **Status**: bez zmian (bieg nie jest ukończony wspólnie), tu: Bez planu.
- Wynik 1: **Autor** Damian, **Wynik** Ukończył, **Data ukończenia** 2025-06-28, **Czas oficjalny** 09:49:42, **Link do wyników**.
- Wynik 2: **Autor** Grzegorz, **Wynik** Nie wystartował (DNS), **Data ukończenia** 2025-06-28 (opcjonalna, data podejścia), **Czas oficjalny** puste, **Notatka** z powodem.
- Skutek: bieg NIE liczy się do licznika, ale wynik Damiana i DNS Grzegorza są widoczne na stronie.

**Przykład 3. Obaj nie ukończyli (tak wygląda Bieg Ultra Granią Tatr 2025).**

- **Status**: bez zmian, tu: Bez planu.
- Wynik 1: **Autor** Damian, **Wynik** Nie ukończył (DNF), **Data ukończenia** 2025-08-23, **Czas oficjalny** 11:29:57 (opcjonalny dla DNF), **Notatka** „Nie zdążyliśmy na drugi punkt kontrolny na Murowańcu (42km) w czasie.”
- Wynik 2: **Autor** Grzegorz, dokładnie tak samo.
- Skutek: bieg nie liczy się do licznika, ale próba jest widoczna na stronie.

Gdy w przyszłości bieg z DNF zostanie ukończony w kolejnej edycji, ustaw status **Planowany**, a potem **Ukończony** i zmień wynik na **Ukończył** z nową datą i czasem. Stary wynik DNF/DNS trzeba wtedy ręcznie zamienić albo usunąć z listy **Wyniki** (jeden wynik na osobę).

## 6. Gdy dane są błędne: co się dzieje i jak naprawić

Panel sprawdza część pól (np. format czasu), ale nie wszystkie zależności między nimi (np. „Ukończył” bez daty). Pełne sprawdzenie robi budowa strony w Cloudflare.

**Co się dzieje przy błędnych danych:** zapis w panelu się udaje (commit trafia do repozytorium), ale budowa strony w Cloudflare **zatrzymuje się z błędem**. Strona zostaje wtedy **w poprzedniej, działającej wersji**. Nic się nie psuje dla czytelników, tylko nowa zmiana jeszcze nie jest widoczna. Po poprawieniu danych kolejna budowa przejdzie i strona się zaktualizuje.

### Gdzie zobaczyć błąd

1. Zaloguj się na https://dash.cloudflare.com.
2. Menu po lewej: **Workers & Pages** → projekt (Worker) **`ultra-w-duecie`**.
3. Zakładka **Deployments** (w niektórych widokach **Builds**).
4. Kliknij ostatnią budowę oznaczoną jako nieudana i otwórz **log budowy** (**Build log**). Błąd jest na końcu logu; komunikat zawiera nazwę pliku (np. `src/content/runs/sgs.json`), pole i opis po polsku.

### Typowe komunikaty i ich naprawa

| Komunikat (fragment) | Co znaczy | Jak naprawić |
| --- | --- | --- |
| „Czas musi mieć format HH:MM:SS (np. 12:34:56)” | Pole **Czas oficjalny** ma zły format (np. `9:5:30`, `10.30.15` albo `9h 40m`). | Wpisz czas jako godziny:minuty:sekundy, z dwucyfrowymi minutami i sekundami, np. `09:49:42`. Godziny mogą mieć 1-3 cyfry. |
| „Wynik "Ukończył" wymaga daty ukończenia (completedDate)” | Wynik **Ukończył** nie ma pola **Data ukończenia**. | Uzupełnij **Data ukończenia** (data mety). |
| „Wynik "Ukończył" wymaga czasu oficjalnego (time)” | Wynik **Ukończył** nie ma pola **Czas oficjalny**. | Uzupełnij czas w formacie HH:MM:SS. Jeśli osoba w rzeczywistości nie ukończyła, zmień **Wynik** na **Nie ukończył (DNF)** albo **Nie wystartował (DNS)**. |
| „Bieg ze statusem "completed" musi mieć co najmniej jeden wynik "Ukończył"” | **Status** to **Ukończony**, a nikt nie ma wyniku **Ukończył**. | Dodaj wynik **Ukończył** albo zmień **Status** na **Planowany** / **Bez planu**. |
| „Wynik "Nie wystartował (DNS)" nie może mieć czasu (time)” | Wynik **Nie wystartował (DNS)** ma wpisany **Czas oficjalny**. | Usuń **Czas oficjalny** z tego wyniku. |
| „Autor "damian" ma więcej niż jeden wynik w tym biegu” | Ten sam autor ma dwa wpisy na liście **Wyniki**. | Zostaw jeden wynik na autora, drugi usuń. |
| „odwołuje się do nieistniejącego wpisu kolekcji” | Wpis lub wynik wskazuje autora albo bieg, którego nie ma (zwykle po ręcznej edycji plików). | Popraw nazwę na istniejącą (autorzy: `damian`, `grzegorz`; bieg: nazwa pliku z `src/content/runs`). |

Po naprawie w panelu kliknij **Zapisz** i poczekaj na kolejną budowę (zakładka **Deployments** powinna pokazać sukces).

### Ostrzeżenia w logu budowy (nie zatrzymują budowy)

W logu może pojawić się blok „Ostrzeżenia (src/content), budowa jest kontynuowana”. Strona się zbuduje, ale ostrzeżenie mówi, że coś nie liczy się do licznika. Dwa przypadki:

- **Obaj mają „Ukończył”, ale w różne dni** (komunikat zawiera daty każdego autora). Bieg NIE liczy się jako ukończony wspólnie, a wyniki są pokazane jako indywidualne. Jeśli biegli razem, ustaw w obu wynikach tę samą **Data ukończenia**. Jeśli to naprawdę dwa osobne podejścia, nic nie zmieniaj.
- **Status „Ukończony”, ale nie obaj mają „Ukończył”.** Bieg nie liczy się jako wspólny. Jeśli to prawda, zmień **Status** biegu. Jeśli brakuje wyniku, dodaj go.

## 7. Cofnięcie błędnej zmiany

Każdy zapis w panelu to osobny commit, więc historia jest w GitHubie. Masz trzy sposoby; zacznij od najprostszego.

### Sposób A. Popraw ręcznie w panelu (najprostszy)

Otwórz wpis albo bieg w panelu, przywróć poprzednie wartości i kliknij **Zapisz**. Dobre dla małych pomyłek (literówka, zły status, zła data).

### Sposób B. Przywróć starą wersję pliku przez stronę GitHub (bez Git)

Dobre, gdy chcesz odzyskać poprzednią treść jednego pliku (np. wpisu albo pliku biegu).

1. Wejdź na https://github.com/wojcickid/ultra-w-duecie i zaloguj się.
2. Na stronie repozytorium kliknij liczbę commitów lub napis **Commits** (nad listą plików). Zobaczysz listę zmian od najnowszej. Opis commitu zwykle mówi, co zostało zmienione i w jakim pliku.
3. Kliknij commit, który jest błędny. Zobaczysz, co dokładnie zmienił: linie na czerwono zostały usunięte, na zielono dodane. Na górze strony commitu jest link do jego poprzednika (**1 parent** i kilka znaków).
4. Kliknij ten link do poprzednika, potem **Browse files** (przeglądanie plików w tamtej, starszej wersji), przejdź do właściwego pliku (np. `src/content/runs/sgs.json` albo `src/content/posts/<nazwa>/index.md`) i wybierz **Raw**. Skopiuj całą treść (Ctrl+A, Ctrl+C).
5. Wróć do aktualnej wersji pliku na gałęzi `main` (ta sama ścieżka, wybór gałęzi **main** w lewym górnym rogu widoku plików), kliknij ikonę ołówka (**Edit this file**), zaznacz całą treść, wklej skopiowaną i kliknij **Commit changes**. W okienku możesz zostawić proponowany opis i zatwierdzić.
6. Poczekaj 1-2 minuty na nową budowę strony.

### Sposób C. Cofnięcie całego commitu poleceniem Git (dla Damiana)

Dobre, gdy zmiana dotyczy wielu plików (np. wpis ze zdjęciami) albo chcesz wycofać usunięty wpis.

1. Wejdź do folderu projektu na swoim komputerze i pobierz najnowsze zmiany: `git pull`.
2. Znajdź commit do cofnięcia: `git log --oneline -10` (skrót commitu to pierwsze znaki w linii).
3. Cofnij go: `git revert <skrót-commitu>`. Git otworzy edytor z proponowanym opisem; zapisz i zamknij.
4. Wyślij zmianę: `git push`. Cloudflare zbuduje stronę na nowo.

`git revert` nie kasuje historii: dodaje nowy commit, który odwraca poprzedni.

## 8. Praca z własnego komputera (dla Damiana)

Ten rozdział jest opcjonalny: wszystko można zrobić w panelu. Praca przez Git przydaje się przy większych zmianach, sprawdzeniu strony przed publikacją albo hurtowym dodaniu danych. Wymaga zainstalowanego Git i Node.js (wersja 22.12 lub nowsza, `README.md`).

### Zasada podstawowa: najpierw `git pull`

Panel zapisuje zmiany **bezpośrednio na gałęzi `main`** w GitHubie. Zanim zaczniesz pracę na komputerze, zawsze pobierz najnowsze zmiany: `git pull`. Inaczej Twoje zmiany i zmiany zrobione w panelu mogą się rozjechać.

### Wpis jako folder

Każdy wpis to osobny folder w `src/content/posts/`, z plikiem `index.md` i zdjęciami obok:

```text
src/content/posts/lodz-na-slezy/
  index.md
  meta.jpg
  szlak.jpg
```

Nazwa folderu (`lodz-na-slezy`) to adres wpisu (`/blog/lodz-na-slezy`): małe litery, bez polskich znaków, myślniki zamiast spacji. Plik `index.md` zaczyna się od nagłówka (dane wpisu) ograniczonego liniami `---`, a potem jest treść w Markdownie:

```markdown
---
title: 'Łódź na Ślęży'
date: 2026-09-21
authors:
  - damian
  - grzegorz
run: bieg-rzeznika
images:
  - src: meta.jpg
    alt: 'Damian i Grzegorz na mecie'
  - src: szlak.jpg
    alt: 'Szlak na Ślężę we mgle'
---

Treść wpisu w **Markdownie**.

## Podtytuł

- pierwszy punkt
- drugi punkt
```

Pola nagłówka:

- `title` (tytuł), `date` (data w formacie `RRRR-MM-DD`),
- `authors`: lista autorów; dostępne wartości to nazwy plików z `src/content/authors` (`damian`, `grzegorz`), co najmniej jedna,
- `run` (opcjonalnie): nazwa pliku biegu z `src/content/runs`, bez `.json` (np. `bieg-rzeznika`),
- `images` (opcjonalnie): lista zdjęć; każde ma `src` (plik leżący obok `index.md`) i `alt` (opis alternatywny, obowiązkowy i niepusty).

### Sprawdzenie, commit i wysłanie

1. `npm install` (tylko za pierwszym razem).
2. `npm run build`: buduje stronę tak jak Cloudflare i sprawdza dane. Jeśli jest błąd, komunikat wskaże plik i pole (rozdział 6). Zbudowaną stronę można obejrzeć poleceniem `npm run preview` (wyłącz je kombinacją Ctrl+C).
3. `git add src/content` (albo konkretny folder), potem `git commit -m "Wpis: Łódź na Ślęży"`.
4. `git push`.
5. Jeśli push zostanie odrzucony (bo w międzyczasie ktoś zapisał zmianę w panelu), wykonaj `git pull --rebase`, a potem ponownie `git push`. Jeśli Git zgłosi konflikt, nie rozwiązuj go na siłę: przerwij (`git rebase --abort`) i poproś o pomoc.

### Dane biegów w plikach

Każdy bieg to plik `src/content/runs/<nazwa>.json`. Wyniki są w liście `results`. Przykład (SGS 2025):

```json
"results": [
  {
    "author": "damian",
    "outcome": "finished",
    "completedDate": "2025-06-28",
    "time": "09:49:42",
    "resultsUrl": "https://example.com/wyniki"
  },
  {
    "author": "grzegorz",
    "outcome": "dns",
    "completedDate": "2025-06-28",
    "note": "Powód niestartu."
  }
]
```

Wartości `outcome`: `finished` (Ukończył, wartość domyślna, gdy pole pominięto), `dnf` (Nie ukończył), `dns` (Nie wystartował). Status biegu w pliku to `completed`, `planned` albo `unplanned`; bieg wycofany z listy ma `"retired": true`. Reguły są takie same jak w rozdziale 5 i sprawdza je `npm run build`.

### Test panelu na własnym komputerze

Panel można wypróbować lokalnie, bez logowania do GitHuba i bez publikowania. Opis krok po kroku: `docs/cms-setup.md`, sekcja „Test panelu lokalnie (bez logowania do GitHuba)”.

## 9. Dodanie Grzegorza jako współautora w przyszłości

Na start Grzegorz nie potrzebuje konta GitHub (rozdział 4). Gdy zechce publikować sam:

1. Grzegorz zakłada konto GitHub i włącza 2FA (rozdział 2).
2. Damian dodaje go do repozytorium z prawem zapisu.
3. Grzegorz loguje się do panelu swoim kontem. W Cloudflare ani w kodzie nic więcej nie trzeba zmieniać.

Szczegółowe kroki (Settings → Collaborators → Add people, rola Write) są w `docs/cms-setup.md`, sekcja „Drugi autor (później)”. Tam też opisano, jak odebrać dostęp.

## 10. Najczęstsze pytania

**Czy strona zbiera dane czytelników?**
Nie zbiera danych osobowych. Do statystyk odwiedzin używamy Cloudflare Web Analytics, które działa bez cookies i bez baneru zgody. Nie ma komentarzy, kont czytelników ani newslettera. Ciasteczko pomocnicze pojawia się tylko podczas logowania autora do panelu.

**Czy mogę zmienić nazwę wyświetlaną autora (np. „Grzegorz” na inną)?**
Tak. W panelu: **Autorzy** → wybierz autora → pole **Nazwa wyświetlana** → **Zapisz**. Zmieni się nazwa pokazywana na stronie. Identyfikator autora (nazwa pliku, np. `grzegorz`) zostaje ten sam, więc stare wpisy i wyniki nadal działają.

**Czy mogę dodać nowy bieg albo usunąć bieg?**
Nie w panelu. Lista biegów Korony jest stała; nowy bieg dodaje deweloper.

**Czy zdjęcia są kompresowane?**
Ze źródeł w repozytorium wynika tyle: strona wyświetla zdjęcia z wpisów w szerokości do 800 pikseli (miniatury na liście bloga 320 na 180 pikseli), w wersjach dopasowanych do ekranu i z leniwym ładowaniem, a za przetwarzanie obrazów odpowiada Astro podczas budowy. Oryginał, który wgrasz, zostaje w repozytorium bez zmian, więc nie wgrywaj zbyt dużych plików (rozdział 4). Nie mamy sprawdzonych szczegółów, jakiego formatu i jakiej jakości są pliki po przetworzeniu.

**Jak długo czekać na zmianę na stronie?**
Zwykle 1-2 minuty po zapisie. Jeśli po kilku minutach nic się nie zmienia, sprawdź budowę w Cloudflare (rozdział 6).

**Zapisałem zmianę i nic się nie stało.**
Najczęściej budowa się nie udała z powodu błędnych danych. Zobacz rozdział 6.

**Panel nie pozwala mi się zalogować albo pokazuje pustą listę.**
Sprawdź tabelę problemów w `docs/cms-setup.md` (rozdział 2 tej instrukcji). Konto GitHub musi mieć prawo zapisu w repozytorium.

**Do kogo zgłosić problem, którego tu nie ma?**
Do osoby technicznej obsługującej projekt. Podaj: co robiłeś, kiedy, i (jeśli jest) treść komunikatu błędu z panelu lub logu budowy w Cloudflare. Nie wysyłaj tokenów, haseł ani kodów z GitHuba.

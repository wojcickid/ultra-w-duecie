# Wymagania — Ultra w duecie

Źródło: `docs/project-brief.md` oraz decyzje użytkownika z sesji planowania (patrz `docs/decisions.md`).

## Cel

Publiczna strona internetowa, na której dwóch biegaczy dokumentuje swoją drogę do zdobycia **Korony Polskich Ultramaratonów 4.0** (Kingrunner): ukończenia 10 wskazanych biegów ultra, w tym wyzwaniu **w parze** (cała korona razem). Pomysł zrodził się po wspólnym przebiegnięciu Biegu Rzeźnika w 2024 r.

Strona pokazuje postęp (które biegi ukończone, które planowane) oraz blog z wpisami o drodze do korony.

Zasady Korony (źródło: kingrunner.com, opis i regulamin):
- do zdobycia korony trzeba ukończyć 10 biegów z listy, w limitach czasu,
- brak terminu końcowego, kolejność dowolna,
- po zebraniu biegów wysyła się zgłoszenie z linkami do wyników do redakcji Kingrunera.

## Użytkownicy i role

| Rola | Kto | Uprawnienia | Logowanie |
|------|-----|-------------|-----------|
| Czytelnik | każdy w internecie | czytanie wpisów, przeglądanie postępu | nie |
| Moderator | jeden z autorów | dodawanie i edycja wpisów, aktualizacja statusu biegów (oś czasu postępu) | tak |
| Admin | jeden z autorów | uprawnienia moderatora + zarządzanie treścią i ustawieniami strony | tak |

Docelowo 2 osoby z logowaniem; ruch czytelników niewielki (kilka–kilkanaście osób).

Admin i moderator są w praktyce równorzędni: rozróżnienie wynika wyłącznie z uprawnień na GitHubie, a nie z logiki aplikacji (DEC-001, DEC-006).

**Start MVP z jednym kontem:** na początku loguje się tylko jeden autor (właściciel, konto GitHub). Drugi autor przesyła treść właścicielowi, który ją publikuje. Autor wpisu jest polem wpisu, niezależnym od tego, kto go opublikował. Drugie konto GitHub można dodać później bez zmian w projekcie.

## Funkcje wersji 1 (MVP)

- **FR-1 Szkielet Korony:** lista 10 biegów z informacją o statusie (ukończony / planowany / bez planu), planowanym lub faktycznym terminie, dystansie i miejscu.
- **FR-2 Postęp:** strona główna pokazuje licznik ukończonych biegów (X/10) i oś czasu postępu.
- **FR-3 Szczegóły biegu:** podstrona biegu z danymi, statusem, wynikiem i powiązanymi wpisami (gdy istnieją).
- **FR-4 Blog:** lista wpisów i strona pojedynczego wpisu (tekst, data, zdjęcia); wpis pokazuje **autora** (jeden z dwóch lub obaj); wpisy mogą być powiązane z biegiem.
- **FR-5 Panel logowania:** panel dostępny tylko dla moderatora i admina, umożliwiający dodawanie/edycję wpisów oraz zmianę statusu biegów.
- **FR-6 Strona publiczna bez logowania,** działająca na komputerze i telefonie, w języku polskim.
- **FR-7 Wyniki per osoba:** dla biegu można zapisać ukończenie osobno dla każdego z dwóch biegaczy (data, czas, link do wyników), ponieważ wyzwanie jest „w parze”, a zdarzają się biegi ukończone przez jedną osobę (np. SGS 2025). Sposób liczenia postępu „w duecie” — patrz „Otwarte pytania”.

Kryterium sukcesu MVP: strona działa publicznie (na subdomenie, DEC-006), ma wszystkie funkcje FR-1…FR-7, a właściciel potrafi samodzielnie dodać wpis i zmienić status biegu.

## Po MVP (nie w pierwszej wersji)

- Sekcja z treningami do poszczególnych ultramaratonów (cykl przygotowań).
- Import historii już ukończonych biegów (TASK-013) — dodawany, gdy MVP będzie działać.
- Dedykowana domena zamiast subdomeny.
- Drugie konto GitHub dla współautora.

## Poza zakresem (propozycja, do potwierdzenia)

- Komentarze czytelników oraz rejestracja/konta użytkowników.
- Newsletter i zbieranie adresów e-mail.
- Płatności i sklep.
- Integracje ze Stravą/Garminem i automatyczne importy wyników.
- Aplikacja mobilna.
- Wersje językowe inne niż polska.
- Własny backend i baza danych (patrz DEC-001).

## Ograniczenia

- **Koszt:** MVP bez dodatkowych opłat (subdomena własnej domeny właściciela, DEC-006); ewentualna osobna domena ok. 11 USD/rok (Cloudflare) dopiero później. Reszta rozwiązania darmowa.
- **Utrzymanie:** możliwie proste, bez serwerów do łatania i bez dodatkowej pracy operacyjnej.
- **Prawo i dane:** nie zbieramy danych osobowych czytelników; bez cookies wymagających zgody. Analityka bez cookies (DEC-002).
- **Termin:** brak; projekt hobbystyczny.
- **Język:** interfejs i treści po polsku (dokumentacja i komentarze po polsku, identyfikatory w kodzie po angielsku, DEC-005).
- **Doświadczenie:** właściciel stawiał prostą stronę (mikr.us + Cloudflare), bez zaawansowanego doświadczenia administracyjnego — instrukcje muszą być krok po kroku.

## Rozstrzygnięte

- Logowanie do panelu przez GitHub — zaakceptowane.
- Admin i moderator równorzędni — zaakceptowane.
- Język: dokumentacja i komentarze po polsku, nazwy w kodzie po angielsku — zaakceptowane (DEC-005).
- Autor wpisu pokazywany na stronie; publikować może jedna osoba za obu — zaakceptowane.
- Na start jedno konto GitHub wystarcza — zaakceptowane.
- Domena: MVP na subdomenie istniejącej domeny właściciela — zaakceptowane (DEC-006).
- Ukończone przez oboje: Bieg Rzeźnika 2024 oraz Bieg 7 Dolin (Piwniczna) 2024. Ukończony solo przez właściciela: Supermaraton Gór Stołowych 2025.

## Otwarte pytania

1. **Liczenie postępu „w duecie”:** czy SGS 2025 (ukończony tylko przez właściciela) wlicza się do licznika X/10, czy pokazujemy go osobno jako wynik indywidualny, a licznik obejmuje tylko biegi ukończone wspólnie?
2. **Bieg 7 Dolin a lista Korony:** wg regulaminu 4.0 nie jest to jeden ze stałych 10 biegów (pojawia się jako wariant alternatywny). Który bieg z listy ma zastąpić — do sprawdzenia w regulaminie i potwierdzenia.
3. Dane o ukończonych biegach: daty, czasy i linki do wyników (do TASK-013).
4. Nazwy wyświetlane obu autorów na stronie (imię/pseudonim).
5. Nazwa subdomeny i miejsce zarządzania DNS domeny właściciela (Cloudflare czy inny dostawca).

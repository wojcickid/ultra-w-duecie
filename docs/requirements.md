# Wymagania — Ultra w duecie

Źródło: `docs/project-brief.md` oraz decyzje użytkownika z sesji planowania (patrz `docs/decisions.md`).

## Cel

Publiczna strona internetowa, na której dwóch biegaczy dokumentuje swoją drogę do zdobycia **Korony Polskich Ultramaratonów 4.0** (Kingrunner): ukończenia 10 wskazanych biegów ultra. Pomysł zrodził się po wspólnym przebiegnięciu Biegu Rzeźnika w 2024 r.

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

Uwaga: w przyjętej architekturze (DEC-001) rozróżnienie admin/moderator wynika z uprawnień na GitHubie, a nie z logiki aplikacji. Patrz sekcja „Otwarte pytania”.

## Funkcje wersji 1 (MVP)

- **FR-1 Szkielet Korony:** lista 10 biegów z informacją o statusie (ukończony / planowany / bez planu), planowanym lub faktycznym terminie, dystansie i miejscu.
- **FR-2 Postęp:** strona główna pokazuje licznik ukończonych biegów (X/10) i oś czasu postępu.
- **FR-3 Szczegóły biegu:** podstrona biegu z danymi, statusem, wynikiem i powiązanymi wpisami (gdy istnieją).
- **FR-4 Blog:** lista wpisów i strona pojedynczego wpisu (tekst, data, zdjęcia); wpisy mogą być powiązane z biegiem.
- **FR-5 Panel logowania:** panel dostępny tylko dla moderatora i admina, umożliwiający dodawanie/edycję wpisów oraz zmianę statusu biegów.
- **FR-6 Strona publiczna bez logowania,** działająca na komputerze i telefonie, w języku polskim.

Kryterium sukcesu MVP: strona działa publicznie pod własną domeną, ma wszystkie funkcje FR-1…FR-6, a obaj autorzy potrafią samodzielnie dodać wpis i zmienić status biegu.

## Po MVP (nie w pierwszej wersji)

- Sekcja z treningami do poszczególnych ultramaratonów (cykl przygotowań).
- Import historii już ukończonych biegów (2/10) — dodawany, gdy MVP będzie działać.

## Poza zakresem (propozycja, do potwierdzenia)

- Komentarze czytelników oraz rejestracja/konta użytkowników.
- Newsletter i zbieranie adresów e-mail.
- Płatności i sklep.
- Integracje ze Stravą/Garminem i automatyczne importy wyników.
- Aplikacja mobilna.
- Wersje językowe inne niż polska.
- Własny backend i baza danych (patrz DEC-001).

## Ograniczenia

- **Koszt:** poza opłatą za domenę (ok. 11 USD/rok, Cloudflare) rozwiązanie ma być darmowe.
- **Utrzymanie:** możliwie proste, bez serwerów do łatania i bez dodatkowej pracy operacyjnej.
- **Prawo i dane:** nie zbieramy danych osobowych czytelników; bez cookies wymagających zgody. Analityka bez cookies (DEC-002).
- **Termin:** brak; projekt hobbystyczny.
- **Język:** interfejs i treści po polsku.
- **Doświadczenie:** właściciel stawiał prostą stronę (mikr.us + Cloudflare), bez zaawansowanego doświadczenia administracyjnego — instrukcje muszą być krok po kroku.

## Otwarte pytania

1. Które 2 z 10 biegów są już ukończone (Bieg Rzeźnika 2024 + jaki drugi?) oraz jakie dane o nich zapisać (data, czas, link do wyników)?
2. Lista 10 biegów: przyjęto listę z regulaminu Korony 4.0; opis na kingrunner.com zawiera inne warianty alternatywne — potwierdzić listę.
3. Czy obaj autorzy mają konta GitHub (wymagane do logowania do panelu, DEC-001)?
4. Czy rozróżnienie admin/moderator ma być egzekwowane technicznie? Przy 2 zaufanych osobach proponuje się traktować obu równorzędnie (obie z prawem zapisu w repozytorium).
5. Czy wpisy pisze wspólnie „my” (jedno konto autora), czy chcesz pokazywać autora każdego wpisu?
6. Nazwa domeny (do zakupu na Cloudflare).

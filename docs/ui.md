# Wytyczne UI — Ultra w duecie

> Brak gotowego szablonu. Poniżej propozycja wyjściowa; szczegóły wizualne (kolory, typografia) ustala TASK-004 i zatwierdza użytkownik.

## Źródło prawdy

Szablon/repozytorium: brak (własny, minimalny system w Tailwind CSS).

Materiały referencyjne: brak. Inspiracja treściowa: kingrunner.com (Korona Polskich Ultramaratonów).

## System designu

- Biblioteka: **Tailwind CSS**, własne, małe komponenty Astro (bez dużej biblioteki UI).
- Kolory, typografia, odstępy: definiowane raz jako tokeny (zmienne CSS / konfiguracja Tailwind) w TASK-004.
- Charakter: prosty, czytelny, „outdoorowy”; nacisk na czytelność treści i zdjęć.
- Komponenty do zbudowania: nagłówek z nawigacją, stopka, karta biegu, znacznik statusu biegu (ukończony / planowany / bez planu), oś czasu postępu, licznik X/10, karta i treść wpisu, paginacja.
- Ikony: jeden zestaw SVG (bez ikon z wielu źródeł).
- Nawigacja: Start, Biegi, Blog. Panel `/admin` bez linku w publicznej nawigacji.
- Formularze i tabele: brak w części publicznej; panel CMS ma własny interfejs (nie stylizujemy go).
- Stany: pusta lista wpisów, strona 404, brak zdjęcia.

## Zasady

- Ponownie używaj istniejących komponentów.
- Nie wprowadzaj drugiego systemu designu.
- Zachowuj ustalone układy i wzorce interakcji.
- Nowe komponenty muszą stosować istniejące konwencje i tokeny.

## Responsywność

- Podejście mobile-first.
- Wspierane szerokości: od 360 px (telefon) do szerokich ekranów desktopowych.
- Oś czasu i lista biegów przebudowują się na jedną kolumnę na telefonie.
- Zdjęcia responsywne (`srcset`), leniwe ładowanie.

## Dostępność

Proponowany standard: **WCAG 2.1 AA** w zakresie praktycznym dla strony treściowej:
- kontrast tekstu min. 4.5:1,
- semantyczny HTML i poprawna hierarchia nagłówków,
- pełna obsługa klawiaturą i widoczny fokus,
- teksty alternatywne zdjęć,
- atrybut `lang="pl"`,
- status biegu nie może być komunikowany wyłącznie kolorem.

## Język

Interfejs i treści po polsku.

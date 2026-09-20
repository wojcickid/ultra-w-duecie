# Wytyczne UI — Ultra w duecie

> Brak gotowego szablonu. Kierunek wizualny (tokeny, komponenty) zaproponowano w TASK-004; wymaga akceptacji użytkownika (podgląd: strona `/styleguide`).

## Źródło prawdy

Szablon/repozytorium: brak (własny, minimalny system w Tailwind CSS).

Materiały referencyjne: brak. Inspiracja treściowa: kingrunner.com (Korona Polskich Ultramaratonów).

## System designu

- Biblioteka: **Tailwind CSS 4** (konfiguracja w CSS), własne, małe komponenty Astro (bez dużej biblioteki UI).
- Kolory, typografia, promienie: definiowane raz jako tokeny w bloku `@theme` w `src/styles/global.css` — to jedyne miejsce definicji. Tokeny stają się klasami Tailwinda (np. `bg-paper`, `text-ink-muted`, `font-heading`, `rounded-md`).
- Domyślna paleta kolorów Tailwinda jest wyłączona (`--color-*: initial`), więc nie da się przypadkiem użyć koloru spoza listy poniżej. Analogicznie domyślne promienie.
- Charakter: prosty, czytelny, „outdoorowy” — ciepły „papierowy” fon, leśna zieleń jako kolor marki, rdzawy akcent, nagłówki szeryfowe (systemowe), tekst bezszeryfowy. Nacisk na czytelność treści i zdjęć.
- Ikony: jeden zestaw inline SVG (styl linii, siatka 24x24, stroke 2) w komponencie `Icon.astro`; ikony są dekoracyjne (`aria-hidden`), znaczenie niesie tekst obok.
- Nawigacja: Start (`/`), Biegi (`/biegi`), Blog (`/blog`). Panel `/admin` bez linku w publicznej nawigacji.
- Formularze i tabele: brak w części publicznej; panel CMS ma własny interfejs (nie stylizujemy go).
- Stany: pusta lista wpisów, strona 404 (`src/pages/404.astro`), brak zdjęcia.

## Tokeny

### Kolory

| Token (klasa)                    | Wartość   | Zastosowanie                                             |
| -------------------------------- | --------- | -------------------------------------------------------- |
| `paper`                          | `#f7f5ef` | tło strony                                               |
| `surface`                        | `#ffffff` | karty, nagłówek                                          |
| `sand`                           | `#ece8db` | stopka, tło hover, wyróżnione bloki                      |
| `ink`                            | `#1c2620` | tekst podstawowy                                         |
| `ink-muted`                      | `#4b5850` | tekst drugorzędny (daty, opisy)                          |
| `brand`                          | `#2d5a3d` | kolor marki: linki, przycisk główny, ikony               |
| `brand-strong`                   | `#1f4230` | hover, aktywna pozycja menu, logo                        |
| `accent`                         | `#a4491b` | akcent (np. etykieta „Błąd 404”); tekst min. 4,5:1       |
| `line`                           | `#d9d5c7` | dekoracyjne linie i obramowania kart (nie niosą informacji) |
| `line-strong`                    | `#7b837a` | obramowania elementów interaktywnych (>= 3:1); zarezerwowany |
| `focus`                          | `#0b5cad` | obrys fokusu klawiatury                                  |
| `white`                          | `#ffffff` | tekst na `brand`                                         |
| `status-completed-bg` / `-fg`    | `#dcecd7` / `#1d4a2a` | status „Ukończony”                           |
| `status-planned-bg` / `-fg`      | `#fbe9c4` / `#6f3b00` | status „Planowany”                           |
| `status-unplanned-bg` / `-fg`    | `#e7e5de` / `#41493f` | status „Bez planu”                           |
| `status-withdrawn-bg` / `-fg`    | `#f2e2dc` / `#6b2a14` | status „Wycofany”                            |

Motyw: tylko jasny (`color-scheme: light`). Motyw ciemny — poza zakresem MVP.

### Typografia

- `font-sans`: `system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif` — tekst i UI.
- `font-heading`: `Charter, 'Bitstream Charter', 'Sitka Text', Cambria, Georgia, serif` — nagłówki h1–h4 (ustawione globalnie w `@layer base`), logo.
- Stosy systemowe: bez zewnętrznych CDN, bez plików czcionek (prywatność, szybkość).
- Skala rozmiarów: domyślna skala Tailwinda. Zalecane: h1 `text-3xl sm:text-4xl`, h2 `text-2xl`, h3 `text-xl`, tekst `text-base` (line-height 1.6), meta `text-sm`. Szerokość akapitu `max-w-prose`.

### Odstępy i układ

- Skala odstępów: domyślna Tailwinda (`1` = 0,25 rem). Nie definiujemy własnej.
- Kontener treści: `max-w-5xl`, marginesy boczne 16 px (od `sm` 24 px), `mx-auto`. Zapewnia go `BaseLayout`.
- Rytm pionowy: sekcje co `mt-12`, elementy w sekcji `mt-4`/`gap-4`.
- Cel dotykowy: min. 44 px wysokości (`min-h-11`) dla linków nawigacji i przycisków.

### Promienie

`rounded-sm` 0,25 rem, `rounded-md` 0,5 rem (przyciski, linki nawigacji), `rounded-lg` 0,875 rem (karty), `rounded-pill` 9999 px (znaczniki statusu).

## Komponenty

Wszystkie w `src/components/`; podgląd wszystkich wariantów na `/styleguide` (strona pomocnicza, `noindex` — usunąć lub ukryć przed publikacją).

- **`BaseLayout`** (`src/layouts/`): `<html lang="pl">`, link „Przejdź do treści” (pierwszy element fokusowalny), `SiteHeader`, `<main id="main">` w kontenerze, `SiteFooter`. Właściwości: `title`, `description`, `noindex`.
- **`SiteHeader`**: logo + nawigacja (Start / Biegi / Blog), aktywna pozycja oznaczona `aria-current="page"` i podkreśleniem. Bez JS: na telefonie logo i linki w dwóch rzędach, od `sm` w jednym. Trzy krótkie pozycje mieszczą się od 320 px, więc menu „hamburger” nie jest potrzebne; jeśli pozycji przybędzie, trzeba dodać zwijanie.
- **`SiteFooter`**: krótki opis projektu i rok.
- **`Icon`**: `name` = `mountain | check-circle | calendar | circle-dashed | ban | arrow-right`; rozmiar przez `class` (domyślnie `size-4`). Nowe ikony dodawać w tym samym pliku i stylu.
- **`StatusBadge`**: `status` = `completed | planned | unplanned | withdrawn` → „Ukończony” (ikona ptaszka w kółku), „Planowany” (kalendarz), „Bez planu” (przerywane kółko, przerywana ramka), „Wycofany” (przekreślone kółko). Status zawsze ma tekst i ikonę — nigdy sam kolor (WCAG 1.4.1).
- **`Card`**: `title?`, `headingLevel` (2–4, domyślnie 3), `href?`. Z `href` cała karta jest klikalna (rozciągnięty link na tytule) i pokazuje fokus całej karty. Treść przez slot.
- **Klasy pomocnicze** (`@layer components` w `global.css`): `.link` (link w treści: podkreślony, kolor marki), `.btn` + `.btn-primary` / `.btn-secondary` (link wyglądający jak przycisk).

## Zasady

- Ponownie używaj istniejących komponentów.
- Używaj wyłącznie tokenów z `global.css`; nie wpisuj kolorów szesnastkowo w komponentach ani nie dodawaj wartości arbitralnych (`bg-[#...]`).
- Nie wprowadzaj drugiego systemu designu.
- Zachowuj ustalone układy i wzorce interakcji.
- Nowe komponenty muszą stosować istniejące konwencje i tokeny; nowy token dodaj w `@theme` i opisz tutaj.
- Linki wewnętrzne są względne (`/biegi`), domena tylko w `astro.config.mjs`.

## Responsywność

- Podejście mobile-first.
- Wspierane szerokości: od 360 px (telefon; sprawdzono także 320 px) do szerokich ekranów desktopowych (kontener do 1024 px).
- Oś czasu i lista biegów przebudowują się na jedną kolumnę na telefonie.
- Zdjęcia responsywne (`srcset`), leniwe ładowanie.

## Dostępność

Standard: **WCAG 2.1 AA** w zakresie praktycznym dla strony treściowej:
- kontrast tekstu min. 4.5:1, elementów interfejsu i fokusu min. 3:1,
- semantyczny HTML i poprawna hierarchia nagłówków,
- pełna obsługa klawiaturą i widoczny fokus (`:focus-visible`: obrys 3 px `focus`, odsunięty o 2 px, globalnie),
- link „Przejdź do treści”,
- teksty alternatywne zdjęć,
- atrybut `lang="pl"`,
- status biegu nie może być komunikowany wyłącznie kolorem,
- `prefers-reduced-motion` skraca animacje.

### Współczynniki kontrastu (WCAG, obliczone)

| Para (tekst na tle)                        | Współczynnik |
| ------------------------------------------ | ------------ |
| `ink` na `paper`                           | 14,30:1      |
| `ink` na `surface`                         | 15,58:1      |
| `ink` na `sand`                            | 12,71:1      |
| `ink-muted` na `paper`                     | 6,85:1       |
| `ink-muted` na `surface`                   | 7,47:1       |
| `ink-muted` na `sand`                      | 6,09:1       |
| `brand` na `paper`                         | 7,29:1       |
| `brand` na `surface`                       | 7,95:1       |
| `brand` na `sand` (hover przycisku)        | 6,49:1       |
| `brand-strong` na `paper`                  | 10,24:1      |
| `white` na `brand` (przycisk główny)       | 7,95:1       |
| `white` na `brand-strong`                  | 11,17:1      |
| `accent` na `paper`                        | 5,43:1       |
| `accent` na `surface`                      | 5,92:1       |
| `status-completed-fg` na `-bg`             | 8,24:1       |
| `status-planned-fg` na `-bg`               | 7,63:1       |
| `status-unplanned-fg` na `-bg`             | 7,41:1       |
| `status-withdrawn-fg` na `-bg`             | 8,49:1       |
| `focus` na `paper` / `surface` / `sand`    | 6,12 / 6,67 / 5,44:1 |
| `line-strong` na `paper`                   | 3,59:1       |

Obrys fokusu jest odsunięty od elementu, więc leży na tle strony (nie na kolorze elementu).

## Język

Interfejs i treści po polsku.

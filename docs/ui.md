# Wytyczne UI — Ultra w duecie

> Brak gotowego szablonu. Kierunek wizualny (tokeny, komponenty) zaproponowano w TASK-004; wymaga akceptacji użytkownika (podgląd wariantów komponentów był na stronie pomocniczej `/styleguide`, usuniętej w TASK-010; jej wersja jest w historii Git).

## Źródło prawdy

Szablon/repozytorium: brak (własny, minimalny system w Tailwind CSS).

Materiały referencyjne: brak. Inspiracja treściowa: kingrunner.com (Korona Polskich Ultramaratonów).

## System designu

- Biblioteka: **Tailwind CSS 4** (konfiguracja w CSS), własne, małe komponenty Astro (bez dużej biblioteki UI).
- Kolory, typografia, promienie: definiowane raz jako tokeny w bloku `@theme` w `src/styles/global.css` — to jedyne miejsce definicji. Tokeny stają się klasami Tailwinda (np. `bg-paper`, `text-ink-muted`, `font-heading`, `rounded-md`).
- Domyślna paleta kolorów Tailwinda jest wyłączona (`--color-*: initial`), więc nie da się przypadkiem użyć koloru spoza listy poniżej. Analogicznie domyślne promienie.
- Charakter: prosty, czytelny, „outdoorowy” — ciepły „papierowy” fon, leśna zieleń jako kolor marki, rdzawy akcent, nagłówki szeryfowe (systemowe), tekst bezszeryfowy. Nacisk na czytelność treści i zdjęć.
- Ikony: jeden zestaw inline SVG (styl linii, siatka 24x24, stroke 2) w komponencie `Icon.astro`; ikony są dekoracyjne (`aria-hidden`), znaczenie niesie tekst obok.
- Nawigacja: Start (`/`), Biegi (`/biegi`), Wyniki (`/wyniki`, wyniki indywidualne każdego z nas; wcześniej sekcja na stronie głównej), Blog (`/blog`). Panel `/admin` bez linku w publicznej nawigacji.
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
| `status-planned-bg` / `-fg`      | `#fbe9c4` / `#6f3b00` | status „Zaplanowany”                         |
| `status-unplanned-bg` / `-fg`    | `#e7e5de` / `#41493f` | status „Do ustalenia”                        |
| `status-withdrawn-bg` / `-fg`    | `#f2e2dc` / `#6b2a14` | znacznik „Poza listą Korony 4.0”             |
| `status-dnf-bg` / `-fg`          | `#ecdcf0` / `#4f1d63` | wynik osoby „Nie ukończył (DNF)”             |
| `status-dns-bg` / `-fg`          | `#dbe6f3` / `#1b3a63` | wynik osoby „Nie wystartował (DNS)”          |

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

Wszystkie w `src/components/`. Strona pomocnicza `/styleguide` z podglądem wszystkich wariantów została usunięta w TASK-010 (przed oficjalnym startem); jej ostatnia wersja jest w historii Git (`git log -- src/pages/styleguide.astro`). Warianty można oglądać na stronach docelowych (`/`, `/biegi`, `/biegi/<id>`).

- **`BaseLayout`** (`src/layouts/`): `<html lang="pl">`, link „Przejdź do treści” (pierwszy element fokusowalny), `SiteHeader`, `<main id="main">` w kontenerze, `SiteFooter`. Właściwości: `title`, `description`, `noindex`.
- **`SiteHeader`**: logo + nawigacja (Start / Biegi / Wyniki / Blog), aktywna pozycja oznaczona `aria-current="page"` i podkreśleniem. Bez JS: na telefonie logo i linki w dwóch rzędach, od `sm` w jednym. Cztery krótkie pozycje mieszczą się od 320 px (sprawdzone: jeden rząd linków, brak poziomego scrolla), więc menu „hamburger” nie jest potrzebne; jeśli pozycji przybędzie, trzeba dodać zwijanie.
- **`SiteFooter`**: krótki opis projektu i rok.
- **`Icon`**: `name` = `mountain | check-circle | calendar | circle-dashed | ban | circle-x | circle-minus | arrow-right`; rozmiar przez `class` (domyślnie `size-4`). Nowe ikony dodawać w tym samym pliku i stylu.
- **`StatusBadge`**: `status` = `completed | planned | unplanned | withdrawn` (status biegu) albo `finished | dnf | dns` (wynik osoby, `outcome`) → „Ukończony” (ikona ptaszka w kółku), „Zaplanowany” (kalendarz), „Do ustalenia” (przerywane kółko, przerywana ramka), „Poza listą Korony 4.0” (przekreślone kółko; wartość `withdrawn`, DEC-012), „Ukończył” (ptaszek, kolory jak „Ukończony”), „Nie ukończył (DNF)” (kółko z krzyżykiem, fiolet), „Nie wystartował (DNS)” (kółko z kreską, granat). Bieg ukończony i wycofany ma oba znaczniki wszędzie; lista znaczników pochodzi z `getRunBadges` (`src/lib/runs.ts`). Status zawsze ma tekst i ikonę — nigdy sam kolor (WCAG 1.4.1).
- **`Card`**: `title?`, `headingLevel` (2–4, domyślnie 3), `href?`. Z `href` cała karta jest klikalna (rozciągnięty link na tytule) i pokazuje fokus całej karty. Treść przez slot.
- **`ProgressBar`**: pasek postępu `role="progressbar"` (`aria-valuenow/min/max/valuetext`); segmenty pełny/pusty różnią się też obramowaniem, obok zawsze jest tekst „X z 10”. Segmenty przycięte do 10.
- **`Timeline`**: oś czasu biegów jako `<ol>` (przyjmuje `runs` + `authors`, sama liczy znaczniki, werdykt i wyniki); w jednej kolumnie, elementy z `h4` (pod `h3` bloku „Korona 4.0 — 10 biegów” / „Historia projektu” w sekcji „Nasza droga”). Kolejność w elemencie: nazwa + znaczniki (`getRunBadges`), informacja „razem?” (`RunVerdict`), termin i dystans (`RunTerm`, `getRunTerm`), na końcu wyniki osób mniejszą czcionką (tylko gdy bieg nie jest ukończony wspólnie). Bieg wycofany z przerywaną ramką.
- **`RunCard`**: karta biegu (nazwa jako nagłówek o poziomie `headingLevel`, domyślnie `h3`; znaczniki z `getRunBadges`; `RunVerdict`; `RunFacts`; linijki wyników osób dla biegu nieukończonego wspólnie); cała karta klikalna. Termin z `getRunTerm` (jedno źródło prawdy dla osi czasu, `/biegi`, `/biegi/<id>` i karty „Najbliższy start”): gdy są wyniki z datą — najwcześniejsza data z etykietą „Ukończono” / „Podejście” / „Pierwsze podejście” (DEC-010); bez wyników — potwierdzona data, termin orientacyjny albo „Termin do ustalenia” (DEC-012). Dopisek „termin orientacyjny” (`qualifier`) pokazuje `RunTerm` mniejszym, stonowanym tekstem, nigdy prefiksem.
- **Struktura widoków biegów (DEC-012, wdraża TASK-021):** 10 biegów Korony 4.0 (`retired: false`) w kolejności sezonu (`order`), pod nimi osobna sekcja „Historia projektu” z biegami `retired: true` (podział: `splitCrownAndHistory`). Bieg 7 Dolin ma tam wyraźny znacznik „Ukończony wspólnie” i adnotację, że nie jest jedną z 10 pozycji Korony 4.0. Pod licznikiem X/10 jest krótkie wyjaśnienie, z czego się składa (`getTogetherSummary`: Bieg Rzeźnika + Bieg 7 Dolin). Karta „Najbliższy start” pochodzi z `getNextRun` (dane, nie hardkod); mały skrypt ukrywa ją po dniu startu (`isoDate`). Styl wizualny bez zmian (bez gradientów, animacji i wykresów).
- **`Section`**: sekcja strony (`id`, `title` → `h2`, `aria-labelledby`, odstęp `mt-12`). Strona biegu składa się z takich sekcji; **nową sekcję (zdjęcia, trasa, GPX, przewyższenie, statystyki, wideo) dodaje się jako jeden blok `<Section>` w `src/pages/biegi/[id].astro`** (oznaczony komentarzem „SEKCJE STRONY BIEGU”), bez zmian gdzie indziej. Nie dodajemy pustych placeholderów.
- **Strona biegu (`/biegi/<id>`)**: nagłówek (nazwa, znaczniki, adnotacja `getRetiredNote` dla biegu poza listą, `RunFacts`), „Razem” (jednozdaniowy werdykt z `getTogetherVerdict`, `src/lib/run-verdict.ts`: „Ukończyliśmy razem — <data>”, „Nie ukończyliśmy tego biegu razem — <powód z danych>”, „Jeszcze przed nami”), „Nasz wynik” (`RunResultsTable`), „Oficjalne wyniki” (tylko gdy jest `run.resultsUrl`), „Relacja” (`PostTeaser` albo „Relacja z tego biegu jeszcze się nie pojawiła.”).
- **`RunResultsTable`**: semantyczny `<table>` Damian | Grzegorz; wiersze Czas, Miejsce, Data, Notatka, Wyniki oficjalne pojawiają się tylko, gdy którykolwiek autor ma dane (Status zawsze); pusta komórka to „—” + „brak danych” dla czytników ekranu; autor bez wyniku ma w Statusie „Brak danych”. Poniżej `sm` tabela przechodzi na układ blokowy (etykieta wiersza, pod nią wartości z imieniem), bez poziomego przewijania.
- **`RunVerdict`** (informacja „razem?” + adnotacja o biegu poza listą, dla kart i osi czasu), **`RunFacts`** (Dystans / Lokalizacja / termin; „Lokalizacja”, żeby nie mylić z „Miejscem” w klasyfikacji), **`RunTerm`** (termin: `<time>` + dopisek), **`PostTeaser`** (zajawka wpisu: tytuł, data, autorzy, fragment treści z `excerpt`, „Dotyczy biegu: …”; strona główna i „Relacja”).
- **`PostCard`**: karta wpisu (tytuł `h2`, data, autorzy „Damian i Grzegorz” — zapis autorów wszędzie przez `joinNames` z `src/lib/blog.ts`: „Damian”, „Damian i Grzegorz”; opcjonalna miniatura z altem; „Dotyczy biegu: <nazwa>” z linkiem, gdy wpis ma `run`, nazwę zapewnia `getPostRun` z `src/lib/blog.ts`); cała karta klikalna.
- **`Prose`**: typografia treści Markdown wpisu (style zakresowe oparte na tokenach; bez `@tailwindcss/typography`). Kontener ma `overflow-wrap: anywhere`, więc długi goły adres URL w akapicie zawija się zamiast poszerzać stronę (bez poziomego przewijania na 320 px). Bloki kodu renderuje Shiki z własnymi kolorami (poza tokenami) — akceptowane, bo wpisy raczej nie zawierają kodu.
- **Stany puste**: każda lista ma czytelny komunikat („Jeszcze bez ukończonych biegów”, „Wpisy pojawią się wkrótce”, „Relacja z tego biegu jeszcze się nie pojawiła.”, „Wpisów jeszcze nie ma. Zajrzyj wkrótce.”, „Jeszcze bez wyniku”).
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
| `status-dnf-fg` na `-bg`                   | 9,51:1       |
| `status-dns-fg` na `-bg`                   | 9,07:1       |
| `focus` na `paper` / `surface` / `sand`    | 6,12 / 6,67 / 5,44:1 |
| `line-strong` na `paper`                   | 3,59:1       |

Obrys fokusu jest odsunięty od elementu, więc leży na tle strony (nie na kolorze elementu).

## Język

Interfejs i treści po polsku.

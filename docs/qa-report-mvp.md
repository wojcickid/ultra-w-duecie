# Raport QA MVP — Ultra w duecie

Zadanie: TASK-010. Data testów: 2026-09-20. Wykonawca: agent QA. Gałąź: `agent/qa/TASK-010-mvp-qa` (zmiany w kodzie tylko z części „Sprzątanie”; wady nie były naprawiane).

Zakres: lokalny build (`npm run build`) serwowany przez `wrangler dev --local` (ta sama konfiguracja `html_handling` i `_headers` co produkcja), Chrome headless sterowany przez CDP, axe-core 4.x, Lighthouse (Chrome) na produkcji, żądania tylko do odczytu (GET/HEAD) wobec https://korona.damianwojcicki.com. Skrypty pomocnicze były poza repozytorium; do projektu nie dodano żadnych zależności.

## 1. Podsumowanie

**Ocena gotowości do oficjalnego startu: GOTOWE Z UWAGAMI.**

Uzasadnienie:

- Brak wad P0. Budowa, lint, `format:check` i `astro check` przechodzą bez błędów i ostrzeżeń; 0 martwych linków wewnętrznych (34 unikalne cele wewnętrzne), 0 naruszeń axe (WCAG 2.1 A/AA + best-practice) na 8 stronach w 2 szerokościach, Lighthouse 100/100/100/100 na produkcji (mobile i desktop, wszystkie 4 strony, 16 przebiegów), brak poziomego przewijania od 320 px do 1280 px na stronach z danymi właściciela.
- Reguły domenowe (licznik „wspólnie”, DNF/DNS, wycofany, walidacje, paginacja, stany puste) zachowują się zgodnie z DEC-007/008/010/011 w 30 przypadkach testowych (tabela w sekcji 8).
- Do wprowadzenia przed startem są dwie rzeczy: (1) wdrożenie tej gałęzi na produkcję, bo produkcja nadal serwuje `/styleguide` i wpis testowy (sekcje 7 i 11, D-02), oraz (2) włączenie przekierowania HTTP na HTTPS i HSTS w Cloudflare (D-01; działanie w panelu Cloudflare, nie w kodzie).
- Reszta to poprawki P2 (data biegu, adresy w RSS, długie URL-e w treści wpisu, cache zasobów) i rekomendacje P3. Żadna z nich nie blokuje startu, ale D-03 (data biegu „orientacyjnie: …” przy biegach już ukończonych) jest widoczna dla każdego czytelnika, więc warto ją poprawić szybko.
- Kryterium „przepływ dodania wpisu i zmiany statusu przez panel działa end-to-end” pozostaje **niezaznaczone** (QA nie ma konta; opis w sekcji 10).

Kluczowe liczby:

| Miara | Wynik |
| ----- | ----- |
| Pliki HTML w `dist/` | 17 (w tym `404` i `/admin`), po usunięciu `/styleguide` i wpisu testowego |
| Martwe linki wewnętrzne / zasoby | 0 z 34 unikalnych celów wewnętrznych (dodatkowo 6 zewnętrznych, niesprawdzanych) |
| axe (8 stron × 360 i 1280 px) | 0 naruszeń (critical 0, serious 0, moderate 0, minor 0), 0 „incomplete” |
| Lighthouse produkcja (mobile) | Performance 100, Accessibility 100, Best Practices 100, SEO 100 |
| Lighthouse produkcja (desktop) | 100 / 100 / 100 / 100 |
| LCP / CLS / TBT (mobile, najgorsza strona) | 1,2 s / 0 / 0 ms |
| Waga wpisu z 2 zdjęciami | 207 KiB (mobile), 227 KiB (desktop); oryginały 1,1 i 1,6 MB nie są ładowane |
| Wady | P0: 0, P1: 1 (+1 warunek wdrożeniowy), P2: 4, P3: 16 (rekomendacje i informacje) |

## 2. Sprzątanie przed startem (Część 1)

| Zmiana | Wynik |
| ------ | ----- |
| Usunięto `src/pages/styleguide.astro` | brak linków do niej w kodzie; wszystkie komponenty nadal używane przez strony docelowe (sprawdzone `grep`) |
| Usunięto `src/content/posts/testowy-wpis.md` | dalej 1 prawdziwy wpis (`piwniczna-pierwsza-setka`, folder nietknięty); strona główna, `/blog`, RSS i strona biegu 7 Dolin działają |
| Dokumentacja | zaktualizowano `docs/architecture.md`, `docs/ui.md`, `docs/decisions.md`, `docs/project-state.md`; komentarz w `BaseLayout.astro`; pominięto zadania w `tasks/done` i `tasks/review` (historia) |
| `npm run build` | OK, 16 stron według logu Astro, obrazy WebP wygenerowane |
| `npm run lint`, `format:check`, `check` | bez błędów; `astro check`: 0 errors, 0 warnings, 0 hints |
| Walidacja referencji | `Walidacja referencji: OK (autorzy: 2, biegi: 11)`, bez ostrzeżeń |

Commit: „TASK-010: usunięcie strony /styleguide i wpisu testowego, aktualizacja dokumentacji”.

## 3. Linki, HTML i SEO

### 3.1 Linki wewnętrzne i zasoby

Skrypt zebrał `href`/`src`/`srcset` ze wszystkich 17 plików HTML w `dist/` i sprawdził każdy cel żądaniem HTTP do `wrangler dev --local` (z `html_handling: drop-trailing-slash`, `not_found_handling: 404-page`).

| Kategoria | Wynik |
| --------- | ----- |
| Strony (`/`, `/biegi`, `/blog`, wpis) | 200 |
| `/biegi/<id>` dla wszystkich 11 biegów | 200 (0 martwych) |
| `/rss.xml`, `/favicon.svg`, CSS, 16 obrazów WebP (`srcset`) | 200 |
| Kotwice (`#main` skip-link) | poprawne |
| Linki zewnętrzne (wyniki b4sport, sts-timing, jsDelivr dla panelu) | pominięte w testach automatycznych; SRI Sveltia CMS zgodne (`sha384-ilMRx…`), plik dostępny (200) |
| Adresy z ukośnikiem (`/biegi/`, `/admin/`, `/index.html`) | 307 na wersję bez ukośnika (zgodnie z konfiguracją) |
| Nieistniejące (`/styleguide`, `/blog/testowy-wpis`, `/blog/strona/2` przy 1 wpisie) | 404 |
| `/api/nieistnieje` | 404 (puste, `no-store`) |

Uwagi: linki wewnętrzne w serwisie są bez ukośnika, więc nie powodują przekierowań. Wyjątek: adresy w RSS (wada D-04).

### 3.2 HTML/meta (17 plików)

| Kontrola | Wynik |
| -------- | ----- |
| `<html lang="pl">`, `meta viewport`, jeden `<main>` | wszystkie strony |
| Unikalny `<title>` | tak (16/16; `/admin` ma własny) |
| `meta description` | wszystkie strony poza `/admin`; duplikat tylko między `/` a `/404` (domyślny opis, `/404` ma `noindex`) |
| Jeden `h1`, bez przeskoków poziomów | tak; strona główna: h1, h2, h3, h4 (oś czasu), h2, h3, h2, h3; `/admin` bez h1 (interfejs CMS) |
| `alt` zdjęć | 3 z 3 obrazów mają niepusty `alt` (galeria 2, miniatura na `/blog` 1); `width`/`height` ustawione, `loading="lazy"`, `srcset` 640–1600 px |
| Canonical, Open Graph, Twitter Card | **brak** (rekomendacja P3, D-09) |
| Znaczniki `noindex` | `/404` i `/admin` |
| 404 | kod 404 dla nieistniejących adresów, treść „Nie ma takiej strony” z przyciskami; `/404` bezpośrednio zwraca 200 (P3, D-10) |
| `robots.txt` / sitemapa | w repozytorium brak obu; produkcja serwuje `robots.txt` zarządzany przez Cloudflare (same komentarze Content Signals, bez reguł i bez `Sitemap`); `/sitemap.xml`, `/sitemap-index.xml` → 404 |
| RSS (`/rss.xml`) | dobrze sformowany XML (walidator `fast-xml-parser`, także z tytułem zawierającym `<`, `&`, `"`, `]]>`), `Content-Type: application/xml`, wpisy malejąco po dacie (test: 25 wpisów), adresy z `site`, `dc:creator` „Damian i Grzegorz”, kanał pusty przy 0 wpisów jest poprawny. Wada: adresy z ukośnikiem na końcu (D-04); brak `atom:link rel="self"`, `lastBuildDate` (P3) |

## 4. Responsywność

Chrome headless (CDP), 8 stron × 4 szerokości (320, 360, 768, 1280 px) = 32 zrzuty obejrzane wybiórczo (`/` 360 i 1280, `/biegi` 768, `/biegi/bieg-7-dolin` 320, wpis 360, `/blog` 360, `/404` 320), pomiary `scrollWidth`/`clientWidth` dla wszystkich.

| Strona | 320 | 360 | 768 | 1280 |
| ------ | --- | --- | --- | ---- |
| `/` | brak poz. przewijania | brak | brak | brak |
| `/biegi` | brak | brak | brak | brak |
| `/biegi/sgs` | brak | brak | brak | brak |
| `/biegi/bieg-7-dolin` | brak | brak | brak | brak |
| `/biegi/ultra-grania-tatr` | brak | brak | brak | brak |
| `/blog` | brak | brak | brak | brak |
| `/blog/piwniczna-pierwsza-setka` | brak | brak | brak | brak |
| `/404` | brak | brak | brak | brak |

Obserwacje:

- Znaczniki statusu (Ukończony, Wycofany, Ukończył, Nie ukończył (DNF), Nie wystartował (DNS), Planowany, Bez planu) mają tekst i ikonę, są czytelne na wszystkich szerokościach; Bieg 7 Dolin ma oba znaczniki („Ukończony” + „Wycofany”) na `/`, `/biegi` i `/biegi/bieg-7-dolin`, kartę z przerywaną ramką na osi czasu.
- Oś czasu jest jedną kolumną na każdej szerokości (zgodnie z `docs/ui.md`); linijki wyników osób (SGS, Ultra Granią Tatr) zawijają się poprawnie.
- Zdjęcia: przeglądarka pobiera WebP z `srcset` dobranym do szerokości (np. 288 px CSS ← 320 px, 480 px ← 800 px); miniatura na `/blog` przycięta do 16:9 (twarze widoczne, kadr środkowy).
- Zoom przeglądarki 200% na 1280 px (okno 640 px, DPR 2): bez poziomego przewijania (reflow OK).
- Ograniczenia (P3, D-07): przy samym powiększeniu **tekstu** systemowego 150% strona główna ma poziome przewijanie (367/360 px; przycisk statusu `whitespace-nowrap` w karcie wyników indywidualnych), przy 200% także nawigacja (384/360 px). Zwykły zoom działa.
- Ograniczenie (P2, D-05): goły, długi URL w treści wpisu (bez spacji) powoduje poziome przewijanie całej strony na 320/360 px (658/320 px w teście). Tabele i bloki kodu mają własne przewijanie i są bezpieczne.
- Nazwa biegu bez spacji o długości 68 znaków (test syntetyczny) także przepełnia stronę, ale prawdziwe nazwy zawierają spacje (uwaga w D-05).

## 5. Dostępność (WCAG 2.1 AA)

### 5.1 axe-core (tagi: `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `best-practice`)

| Strona | 360 px | 1280 px |
| ------ | ------ | ------- |
| `/` | 0 (36 reguł spełnionych) | 0 |
| `/biegi` | 0 | 0 |
| `/biegi/sgs` | 0 | 0 |
| `/biegi/bieg-7-dolin` | 0 | 0 |
| `/biegi/ultra-grania-tatr` | 0 | 0 |
| `/blog` | 0 | 0 |
| `/blog/piwniczna-pierwsza-setka` | 0 | 0 |
| `/404` | 0 | 0 |

Naruszenia wg wagi: critical 0, serious 0, moderate 0, minor 0. Brak wyników „incomplete”, więc kontrast został rozstrzygnięty automatycznie. Panel `/admin` (interfejs Sveltia CMS) nie był badany.

### 5.2 Ręcznie

| Kontrola | Wynik |
| -------- | ----- |
| Klawiatura: Tab | pierwszy fokus to „Przejdź do treści” (widoczny, `top: 8px; left: 8px`), potem logo, Start, Biegi, Blog, potem treść w kolejności wizualnej; brak pułapek (po ostatnim elemencie fokus wychodzi do przeglądarki) |
| Skip-link | Enter przenosi na `#main`; następny Tab trafia w pierwszy link w treści (fokus programowy nie jest ustawiony na `main`, ale punkt startowy nawigacji jest poprawny) |
| Widoczność fokusu | obrys 3 px `focus` (`rgb(11, 92, 173)`, kontrast 6,1:1); na kartach (`/biegi`) obrys rysowany na całej karcie (`focus-within`), link ma `outline: none` — zweryfikowano zrzutem |
| Semantyka | `nav` z `aria-label`, `aria-current="page"`, oś czasu jako `<ol>`, listy jako `<ul>`, `<dl>` dla danych biegu, `<time datetime>` |
| Status nie tylko kolorem | tak: tekst + ikona + wariant ramki (przerywana dla „Bez planu”), zgodnie z WCAG 1.4.1 |
| Kontrast | axe bez uwag; tokeny opisane w `docs/ui.md` (min. 5,4:1 dla tekstu) |
| Tekst alternatywny zdjęć | obecny (galeria i miniatura); w alt wpisu są emoji (P3, D-17) |
| `prefers-reduced-motion` | `transition-duration: 1e-5s`, `scroll-behavior: auto` (sprawdzone w emulacji) |
| Cele dotykowe | linki nawigacji i przyciski 44 px; linki tytułów na osi czasu i wyniki indywidualne mają 18–21 px wysokości (WCAG 2.1 nie wymaga; kryterium 2.5.8 z WCAG 2.2 dopuszcza je dzięki odstępom; rekomendacja P3, D-15) |
| Powiększenie tekstu 150%/200% | patrz sekcja 4 (P3) |

## 6. Wydajność (Lighthouse, produkcja)

Wersja Lighthouse z npm, Chrome headless, 2 przebiegi na stronę i tryb. Mobile: domyślne throttling (symulowany 4G, CPU 4x); desktop: RTT 40 ms, 10 Mbps. Wyniki identyczne w obu przebiegach.

| Strona | Tryb | Perf | A11y | BP | SEO | FCP | LCP | CLS | TBT | SI | Transfer |
| ------ | ---- | ---- | ---- | -- | --- | --- | --- | --- | --- | -- | -------- |
| `/` | mobile | 100 | 100 | 100 | 100 | 1,0 s | 1,0 s | 0 | 0 ms | 1,2–1,3 s | 10 KiB |
| `/biegi` | mobile | 100 | 100 | 100 | 100 | 0,9 s | 0,9 s | 0 | 0 ms | 1,2–1,3 s | 9 KiB |
| `/blog` | mobile | 100 | 100 | 100 | 100 | 0,8–0,9 s | 1,1 s | 0 | 0 ms | 1,1 s | 47 KiB |
| `/blog/piwniczna-pierwsza-setka` | mobile | 100 | 100 | 100 | 100 | 0,9 s | 1,2 s | 0 | 0 ms | 1,2–1,3 s | 207 KiB |
| `/` | desktop | 100 | 100 | 100 | 100 | 0,3 s | 0,3 s | 0 | 0 ms | 0,4 s | 10 KiB |
| `/biegi` | desktop | 100 | 100 | 100 | 100 | 0,2 s | 0,2 s | 0 | 0 ms | 0,4 s | 9 KiB |
| `/blog` | desktop | 100 | 100 | 100 | 100 | 0,2–0,3 s | 0,3–0,4 s | 0 | 0 ms | 0,4–0,7 s | 22 KiB |
| `/blog/piwniczna-pierwsza-setka` | desktop | 100 | 100 | 100 | 100 | 0,2–0,3 s | 0,3–0,4 s | 0 | 0 ms | 0,5 s | 227 KiB |

Rekomendacje Lighthouse (wszystkie „informacyjne”, wynik 100): blokujący render arkusz CSS (5 KB, `render-blocking`), łańcuch zależności dokument → CSS, na stronie wpisu „LCP request discovery” (pierwsze zdjęcie ma `loading="lazy"`, brak `fetchpriority`, D-11) oraz „image delivery” (0,5 na mobile). Żadna nie wymaga działania przed startem.

Zdjęcia wpisu: oryginały 2736×2736 (1,60 MB i 1,15 MB), w buildzie 7 rozmiarów WebP na zdjęcie (13–381 KB), przeglądarka na telefonie pobiera warianty ok. 77–90 KB (750–800 px). Łącznie 207 KiB, więc waga nie jest problemem.

## 7. Nagłówki i konfiguracja produkcji (tylko odczyt)

| Kontrola | Oczekiwane | Faktyczne | Ocena |
| -------- | ---------- | --------- | ----- |
| HTTPS | działa | `https://` 200, HTTP/3 (alt-svc) | OK |
| Przekierowanie HTTP → HTTPS | 301/308 | `http://korona.damianwojcicki.com/` i `/admin` zwracają **200** (brak przekierowania) | **wada D-01** |
| HSTS | `Strict-Transport-Security` | brak | **wada D-01** |
| `/admin/` → `/admin` | 307 | 307, `Location: /admin`, z nagłówkami `_headers` | OK |
| `/admin` nagłówki | `X-Robots-Tag: noindex, nofollow`, `X-Frame-Options: DENY`, `Referrer-Policy: same-origin` | wszystkie trzy obecne | OK |
| Strony publiczne | bez tych nagłówków | brak, w tym brak `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, CSP | rekomendacja D-08 |
| `Cache-Control` HTML | krótki | `public, max-age=0, must-revalidate` | OK |
| `Cache-Control` `/_astro/*` (CSS, WebP z hashem) | długi, `immutable` | `public, max-age=0, must-revalidate` | **wada D-06** |
| Kompresja | tak | `Content-Encoding: br` dla CSS | OK |
| `Content-Type` RSS | XML | `application/xml` (można `application/rss+xml`, nie jest wadą) | OK |
| Nieistniejące strony | 404 + strona 404 | 404 `text/html` | OK |
| `/api/nieistnieje` | 404 | 404 (puste) | OK |
| Web Analytics (`static.cloudflareinsights.com`) | (właściciel zajmie się później) | skryptu **nie ma** w HTML | odnotowano |
| `/styleguide`, `/blog/testowy-wpis` | 404 po wdrożeniu tej gałęzi | **jeszcze 200** (produkcja sprzed sprzątania); RSS zawiera wpis testowy | **D-02, warunek wdrożenia** |
| `Content-Type` HTML | — | `text/html` bez `charset` (dokument ma `<meta charset="utf-8">`, więc działa) | informacja |
| RSS `/blog/<id>/` | 200 | 307 na `/blog/<id>` | wada D-04 |

### Propozycja `public/_headers` (do decyzji Leada; NIE dodane)

```text
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
  Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'

/_astro/*
  Cache-Control: public, max-age=31536000, immutable
```

Uwagi do wdrożenia propozycji:

- Strony publiczne nie ładują żadnych skryptów (jedyny `<script>` jest w `/admin`); jedyny inline to `<style>` w stronie wpisu (Prose), stąd `style-src 'unsafe-inline'`.
- Reguły `/*` i `/admin` się scalają (nagłówki z obu wzorców). Panel Sveltia potrzebuje luźniejszego CSP (skrypt z jsDelivr, połączenia z `api.github.com`, `blob:`), więc dla `/admin` trzeba w bloku `/admin` i `/admin/*` usunąć nagłówek zapisem `! Content-Security-Policy` (i sprawdzić `Referrer-Policy`, żeby nie pojawił się zduplikowany). Sprawdzić lokalnie `wrangler dev --local` przed wdrożeniem.
- Po włączeniu Web Analytics dodać do CSP `script-src https://static.cloudflareinsights.com` i `connect-src https://cloudflareinsights.com`.
- Przekierowanie HTTP → HTTPS i HSTS włącza się w Cloudflare (SSL/TLS → Edge Certificates: „Always Use HTTPS” i HSTS), nie w `_headers`.

## 8. Reguły domenowe (dane tymczasowe, przywrócone `git checkout -- src/content`)

Po testach `git status` czysty. „Baza” = dane bieżące: licznik 2/10 (Bieg Rzeźnika i Bieg 7 Dolin, obaj z tą samą datą).

| # | Przypadek | Oczekiwane | Faktyczne | Wynik |
| - | --------- | ---------- | --------- | ----- |
| 1 | Baza (dane bieżące) | 2/10; 7 Dolin: „Ukończony” + „Wycofany” | 2/10; oba znaczniki na `/`, `/biegi`, `/biegi/bieg-7-dolin` | OK |
| 2 | Obaj `finished`, ta sama data (Rzeźnik) | liczy się | liczy się; notatka „Ukończony wspólnie.” | OK |
| 3 | Obaj `finished`, różne daty (31.05 i 01.06) | nie liczy się (1/10), ostrzeżenie w buildzie | 1/10; wyniki indywidualne pod biegiem; ostrzeżenie `validate-content` (exit 0) | OK |
| 4 | Różne godziny UTC, ten sam dzień w Europe/Warsaw | liczy się | 2/10; wyświetlona data 1 czerwca 2024 | OK |
| 5 | Damian `finished` + Grzegorz DNF | 1/10 | 1/10; ostrzeżenie „status completed, ale nie każdy autor…” | OK |
| 6 | Damian `finished` + Grzegorz DNS | 1/10 | 1/10; ostrzeżenie | OK |
| 7 | Ukończony + `retired` (Rzeźnik) | oba znaczniki wszędzie, licznik bez zmian | `completed`+`withdrawn` na `/`, `/biegi`, `/biegi/<id>`; 2/10 | OK |
| 8 | Planowany + `retired` (Bison) | tylko „Wycofany” | tylko `withdrawn` na `/`, `/biegi`, `/biegi/<id>` | OK |
| 9 | Status `completed` bez wyniku (results = []) | błąd budowy | `InvalidContentEntryDataError`: „Bieg ze statusem "completed" musi mieć co najmniej jeden wynik "Ukończył"” | OK |
| 10 | Status `completed`, tylko DNF | błąd budowy | ten sam błąd | OK |
| 11 | Brak `outcome` (stare dane) | traktowane jako `finished` | 2/10, „Ukończony wspólnie” | OK |
| 12 | `finished` bez czasu | błąd budowy | „Wynik "Ukończył" wymaga czasu oficjalnego (time)” | OK |
| 13 | DNS z czasem | błąd budowy | „Wynik "Nie wystartował (DNS)" nie może mieć czasu” | OK |
| 14 | Zły format czasu `9:5:3` | błąd budowy | „Czas musi mieć format HH:MM:SS” | OK |
| 15 | Dwa wyniki tego samego autora | błąd budowy | „Autor "damian" ma więcej niż jeden wynik” | OK |
| 16 | Dwaj autorzy w danych | obaj widoczni | tak (wyniki osobno, kolejność alfabetyczna po id) | OK |
| 17 | Nieistniejący autor w wyniku | walidacja przerywa build | komunikat po polsku: plik, pole, brakujący id, lista dostępnych; exit 1 | OK |
| 18 | Wpis z nieistniejącym autorem / biegiem | walidacja przerywa build | komunikaty po polsku, exit 1 | OK |
| 19 | Wpis z pustą listą autorów | błąd budowy | błąd schematu Astro (po angielsku) | OK (P3, D-18) |
| 20 | Zdjęcie z pustym `alt` | błąd budowy | „images.0.alt: Too small: expected string to have >=1 characters” | OK |
| 21 | Zdjęcie o nieistniejącej nazwie | błąd budowy | `ImageNotFound: Could not find requested image` | OK |
| 22 | 0 wpisów | „Wpisy pojawią się wkrótce”; „Wpisów jeszcze nie ma. Zajrzyj wkrótce.”; RSS pusty; brak paginacji; „Brak wpisów o tym biegu” | zgodnie; RSS poprawny (0 pozycji); zostaje link „Wszystkie wpisy” (P3, D-14) | OK |
| 23 | 0 biegów i 0 wpisów | build OK, 0/10 | build OK, 0/10, brak stron biegów; `/biegi` pusta bez komunikatu (P3, D-14) | OK z uwagą |
| 24 | Wpis dwóch autorów, powiązany z biegiem, tytuł ze znakami specjalnymi | „Damian i Grzegorz”; wpis widoczny na stronie biegu; escapowanie | wpis: „Damian i Grzegorz”; RSS `dc:creator` poprawny; HTML i XML escapowane; na `/` i `/biegi/sgs` „Damian, Grzegorz” (P3, D-12) | OK z uwagą |
| 25 | Wpis o identyfikatorze `strona` (przy paginacji) | brak konfliktu tras | brak konfliktu (`/blog/strona` i `/blog/strona/2` obok siebie) | OK |
| 26 | 10 wpisów | bez paginacji | 1 strona, brak nawigacji | OK |
| 27 | 11 wpisów | `/blog/strona/2` z 1 wpisem | zgodnie, „Strona 2 z 2” | OK |
| 28 | 25 wpisów | 10 + 10 + 5; RSS malejąco | `/blog` 10, `/blog/strona/2` 10, `/blog/strona/3` 5; RSS 25 pozycji od najnowszej | OK |
| 29 | Wpis z datą w przyszłości | (informacyjnie) | publikowany od razu, bez planowania publikacji | informacja |
| 30 | Treść wpisu z `<script>`, tabelą, blokiem kodu i długim URL | (informacyjnie) | HTML w Markdownie przechodzi bez filtrowania (autorzy zaufani, D-19); długi URL przepełnia stronę (D-05) | informacja / D-05 |

## 9. Bezpieczeństwo (przegląd statyczny) i dane w repozytorium

### 9.1 Worker OAuth (`worker/*`)

Przeczytano `index.ts`, `auth.ts`, `callback.ts`, `oauth.ts`; przetestowano lokalnie (`wrangler dev --local`, bez sekretów).

| Element | Ocena |
| ------- | ----- |
| `state` | 128 bitów z `crypto.getRandomValues`, ciasteczko `HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=600`, porównanie w stałym czasie z kontrolą długości; ciasteczko czyszczone w każdej odpowiedzi popupu |
| Zakres | stały `public_repo`, parametr `scope` z żądania ignorowany; `allow_signup=false` |
| Domena i origin | `site_id` porównywany z hostami z `ALLOWED_ORIGIN` (`evil.com` → `UNSUPPORTED_DOMAIN`); token wysyłany `postMessage` wyłącznie do originów z listy, po komunikacie `authorizing:github` od okna panelu (`event.origin`); drugi komunikat `postMessage('authorizing:github', '*')` niesie stały tekst |
| Odpowiedzi | `Cache-Control: no-store`, `Referrer-Policy: no-referrer`, `X-Content-Type-Options: nosniff`, CSP z nonce (`default-src 'none'; script-src 'nonce-…'; base-uri 'none'`); komunikaty błędów stałe i escapowane; wartości w `<script>` serializowane z `\x3C` |
| Logowanie sekretów | brak `console.*`; `observability` wyłączone |
| Metody i ścieżki | tylko `GET`; `POST` → 405 z `Allow: GET`; `/api/nieistnieje`, `/api/`, `/api/auth/` → 404 (puste); `/api` bez ukośnika trafia do plików statycznych (404 z stroną 404) |
| Brak sekretów | bez `GITHUB_CLIENT_ID`/`GITHUB_CLIENT_SECRET` → `MISCONFIGURED_CLIENT`, brak wycieku |
| Błędy logiczne | nie znaleziono. Uwagi: (a) przy pustym `ALLOWED_ORIGIN` Worker akceptuje origin żądania (zapisane w dokumentacji), (b) `public_repo` daje token z zapisem do wszystkich publicznych repozytoriów konta (ograniczenie OAuth App, opisane w DEC-009), (c) kod `/api/callback` nie sprawdza `response.ok` z GitHuba, ale brak tokenu kończy się kontrolowanym błędem |

### 9.2 Sekrety, zależności, dane wrażliwe

| Kontrola | Wynik |
| -------- | ----- |
| Drzewo robocze: wzorce `ghp_`, `github_pat_`, `gho_`, `BEGIN … PRIVATE KEY`, `AKIA`, `xox*`, `sk-` | 0 trafień |
| Historia Gita (`git log --all -p`, 90 commitów): te same wzorce + `client_secret = <wartość>` | 0 trafień; nigdy nie zacommitowano plików `.env`, `.dev.vars`, `*.pem`, `*.key` (sprawdzone po nazwach plików w historii); `.gitignore` je wyklucza |
| Wystąpienia `client_secret`/`CLIENT_SECRET` | wyłącznie nazwy zmiennych w kodzie i dokumentacji, żadnych wartości |
| `npm audit --omit=dev` | found 0 vulnerabilities (bez `audit fix`) |
| SRI panelu | suma `sha384` w `public/admin/index.html` zgodna z plikiem z jsDelivr (Sveltia CMS 0.217.0) |
| E-mail w historii | 79 z 90 commitów ma autora `Damian Wójcicki <wojcicki.d@gmail.com>`; 11 commitów z panelu ma adres `@users.noreply.github.com`. Odnotowano, bez zmian (przy publicznym repozytorium adres jest publiczny; można włączyć „Keep my email addresses private” w GitHubie, co działa tylko dla przyszłych commitów) |
| Inne dane osobowe w plikach | brak telefonów; publiczne adresy: `redakcja@kingrunner.com` (dokumentacja). W linkach wyników zawodów są nazwiska zawodników (Wójcicki, Kudrej) — świadomie publikowane przez właściciela |
| Powierzchnia ataku | strona statyczna; jedyna zawartość dynamiczna to Worker OAuth i panel CMS |

## 10. Przepływ end-to-end (kryterium do NIEZAZNACZENIA)

Agent QA nie ma konta i nie loguje się do żadnych usług, więc kryterium „Przepływ dodania wpisu i zmiany statusu przez panel działa end-to-end” pozostaje **niezaznaczone** w zadaniu.

Co właściciel już potwierdził na produkcji (dowody w historii Git `main`):

- Zapis wpisu ze zdjęciami: commit `6177620` „Create Wpis “piwniczna-pierwsza-setka” +2” (`index.md` + `01.jpg` + `05.jpg` obok siebie), wpis widoczny na stronie i w RSS, zdjęcia serwowane jako WebP z opisem alternatywnym; wcześniej wpis testowy „test-po-wdrożeniu-na-stronę” dodany (`de6ae58`) i usunięty przez panel (`8e8b271`).
- Aktualizacje biegów, w tym DNF/DNS: commity „Update Bieg “bieg-rzeznika”, “bison-ultra-trail”, “bieg-7-dolin” (x2), “sgs” (x2), “ultra-grania-tatr” (x2)” (wszystkie 2026-09-20), pola `outcome` zapisane przez panel; strona pokazuje DNF/DNS i licznik zgodnie z regułami.
- Commity z panelu (11 z autorem `…@users.noreply.github.com`, committer GitHub), budowa i publikacja po commicie.
- Test konta bez uprawnień: wg commitu `2526268` na `main` (nie ma go w tej gałęzi, powstała wcześniej) właściciel potwierdził, że przy logowaniu obcym kontem panel odmawia dostępu do repozytorium („nie masz dostępu do repozytorium ultra-w-duecie”).

Czego nie sprawdzono (poza zasięgiem QA lub jeszcze otwarte):

- Wbudowany przycisk cofania (Revert) na GitHubie dla commitu z panelu (opis w `docs/authors-guide.md`).
- Web Analytics (skrypt jeszcze niewstrzyknięty).
- Zapis przez drugie konto z prawami zapisu (poza MVP).
- Zachowanie panelu po wdrożeniu tej gałęzi (usunięty wpis testowy) — powinno być bez zmian.

### Checklista akceptacyjna dla właściciela (ok. 15 minut)

1. Po wdrożeniu gałęzi z TASK-010: otwórz `/styleguide` i `/blog/testowy-wpis`. Oczekiwane: „Nie ma takiej strony” (404). W `/rss.xml` ma być tylko wpis „Piwniczna - Pierwsza setka”.
2. Wejdź na `http://korona.damianwojcicki.com` (bez `s`). Oczekiwane po włączeniu „Always Use HTTPS”: przekierowanie na `https://`.
3. Wejdź na `/admin`, zaloguj się przez GitHub. Oczekiwane: lista kolekcji Wpisy, Biegi, Autorzy.
4. Dodaj wpis „Wpis kontrolny” (data dziś, autor Damian, jedno zdjęcie z opisem alternatywnym, bez emoji w opisie), zapisz. Poczekaj na budowę w Cloudflare (1–3 min), sprawdź `/blog`, stronę główną (sekcja „Ostatnie wpisy”) i `/rss.xml`.
5. Otwórz bieg, który jeszcze nie ma wyniku (np. Pieniny Ultra Trail), ustaw status „Planowany” i datę, zapisz. Sprawdź `/`, `/biegi`, `/biegi/pieniny-ultra-trail` (znacznik „Planowany”).
6. W tym samym biegu dodaj wyniki dla obu autorów jako „Ukończył” z tą samą datą i czasami. Oczekiwane: licznik na `/` rośnie do 3/10 i pojawia się „Ukończony wspólnie”. Zmień datę jednego autora na inny dzień: licznik ma spaść do 2/10 z adnotacją o różnych dniach.
7. Cofnij zmiany: na GitHubie otwórz commity z kroków 4–6 i użyj Revert (albo usuń wpis w panelu i przywróć dane biegu); poczekaj na budowę i sprawdź, że strona wróciła do stanu sprzed testu.
8. Sprawdź telefon (Chrome/Safari): `/`, `/biegi`, wpis ze zdjęciami — czy nic nie wychodzi poza ekran. Po włączeniu Web Analytics sprawdź, czy w kodzie strony pojawił się skrypt `static.cloudflareinsights.com` i po kilku minutach pierwsze odsłony w panelu Cloudflare.

## 11. Lista wad i rekomendacji

Legenda: **P0** blokuje start, **P1** ważne, **P2** drobne, **P3** rekomendacje/kosmetyka. Wysiłek: S (do 1 h), M (1–3 h), L (ponad 3 h).

### P0

Brak.

### P1

**D-01. Brak przekierowania HTTP → HTTPS i brak HSTS na produkcji**
- Opis: `http://korona.damianwojcicki.com/` i `/admin` zwracają 200 bez przekierowania; brak nagłówka `Strict-Transport-Security`. Panel logowania (`/admin`) i cała strona można otworzyć po HTTP; atakujący w sieci mógłby podmienić stronę logowania (SRI chroni tylko przed podmianą pliku z CDN, nie przed podmianą samego HTML). Ciasteczko `state` ma `Secure`, więc logowanie po HTTP i tak nie zadziała, ale to mylące.
- Kroki: `curl -sI http://korona.damianwojcicki.com/` → `HTTP/1.1 200 OK`, bez `Location`.
- Miejsce: konfiguracja Cloudflare (nie kod): SSL/TLS → Edge Certificates.
- Naprawa: włączyć „Always Use HTTPS”; po sprawdzeniu włączyć HSTS (najpierw `max-age` np. 6 miesięcy, bez `includeSubDomains`, bo to subdomena innej witryny właściciela). Zaktualizować `docs/cms-setup.md`.
- Wysiłek: S (właściciel, panel Cloudflare).

**D-02 (warunek wdrożeniowy, nie wada kodu). Produkcja nadal serwuje `/styleguide` i wpis testowy**
- Opis: `https://korona.damianwojcicki.com/styleguide` i `/blog/testowy-wpis` zwracają 200, a `/rss.xml` i lista wpisów zawierają „WPIS TESTOWY”. Kod jest naprawiony w tej gałęzi (Część 1).
- Kroki: `curl -s -o /dev/null -w "%{http_code}" https://korona.damianwojcicki.com/styleguide`.
- Naprawa: Lead scala gałąź do `main` (push na polecenie użytkownika), Workers Builds wdrożą; następnie wykonać krok 1 checklisty.
- Wysiłek: S.

### P2

**D-03. Ukończone biegi pokazują „Termin: orientacyjnie: <miesiąc>” zamiast faktycznej daty na `/biegi` i `/biegi/<id>`**
- Opis: Bieg Rzeźnika (ukończony 31.05.2024) ma „Termin: orientacyjnie: Boże Ciało”, Bieg 7 Dolin (07.09.2024) „orientacyjnie: wrzesień”; podobnie SGS (28.06.2025) i Ultra Granią Tatr (23.08.2025) mają tylko miesiąc. Na stronie głównej ta sama informacja jest poprawna (data z wyniku). Niespójność widoczna dla czytelnika.
- Kroki: otworzyć `/biegi` i `/biegi/bieg-rzeznika`.
- Miejsce: `src/lib/runs.ts` (`getRunFacts` bierze tylko `plannedDate`/`typicalMonth`), `src/components/RunCard.astro`, `src/pages/biegi/[id].astro`.
- Naprawa: gdy istnieją wyniki z `completedDate`, pokazywać „Data: <najwcześniejsza data z wyników>” (jak `termDate` w `src/pages/index.astro`, najlepiej wynieść do wspólnej funkcji w `src/lib/`), a „orientacyjnie” tylko dla biegów bez wyników.
- Wysiłek: S.

**D-04. RSS: adresy pozycji i `guid` z ukośnikiem na końcu, a serwis przekierowuje je 307**
- Opis: `<link>` i `<guid>` mają postać `https://korona.damianwojcicki.com/blog/<id>/`, produkcja odpowiada 307 na `/blog/<id>` (`html_handling: drop-trailing-slash`). Czytniki RSS dostają przekierowanie, a `guid` różni się od adresu kanonicznego (zmiana `guid` po naprawie duplikuje wpisy w czytnikach, więc lepiej poprawić przed rosnącą liczbą subskrybentów).
- Kroki: `curl -sI https://korona.damianwojcicki.com/blog/piwniczna-pierwsza-setka/` → 307; `grep '<link>' dist/rss.xml`.
- Miejsce: `src/pages/rss.xml.ts` (`@astrojs/rss` domyślnie `trailingSlash: true`).
- Naprawa: dodać do wywołania `rss({ … trailingSlash: false })` (kanał `<link>` z `site` zostanie `https://…/`). Ewentualnie dodać `atom:link rel="self"`.
- Wysiłek: S.

**D-05. Długi ciąg bez spacji w treści wpisu (np. wklejony URL) przepełnia stronę na telefonie**
- Opis: wpis z gołym URL wyników (`https://wyniki.b4sport.pl/…?FiltersForm%5B…`) daje na 320 i 360 px `scrollWidth` 658 px (poziome przewijanie całej strony). Autorzy będą wklejać takie linki (linki do wyników są w danych biegów). Tabele i bloki kodu w `Prose` mają własne przewijanie i są bezpieczne. Podobnie bardzo długa nazwa biegu bez spacji (68 znaków, test syntetyczny).
- Kroki: utworzyć wpis z akapitem `Wyniki: https://wyniki.b4sport.pl/xxi-bieg-rzeznika/r5431.html?FiltersForm%5Bnumber%5D=&FiltersForm%5Bname1%5D=Kudrej&format=html`, otworzyć na 320 px.
- Miejsce: `src/components/Prose.astro` (kontener `.prose-content`), ewentualnie globalnie `src/styles/global.css`.
- Naprawa: `overflow-wrap: anywhere` dla `.prose-content` (i `break-words` w kartach/nagłówkach). Do `docs/authors-guide.md` dodać zalecenie linku w postaci `[tekst](adres)`.
- Wysiłek: S.

**D-06. Zasoby z hashem w `/_astro/*` nie mają długiego cache**
- Opis: CSS i WebP (nazwy z hashem zawartości) mają `Cache-Control: public, max-age=0, must-revalidate`. Każda wizyta wymaga rewalidacji (304), przy zdjęciach wpisu to kilka dodatkowych żądań. Wynik Lighthouse to nie wykrywa (pierwsze załadowanie), ale wizyty powrotne są wolniejsze niż muszą.
- Kroki: `curl -sI https://korona.damianwojcicki.com/_astro/<plik>.css`.
- Miejsce: `public/_headers`.
- Naprawa: dodać regułę `/_astro/*` → `Cache-Control: public, max-age=31536000, immutable` (patrz sekcja 7).
- Wysiłek: S.

### P3 — rekomendacje i drobne

**D-07. Poziom przewijania przy powiększonym tekście na telefonie**: przy tekście systemowym 150% (`/` 367/360 px, karta wyników indywidualnych z `whitespace-nowrap` w `StatusBadge`) i 200% (nawigacja 384/360 px; `SiteHeader`). Zwykły zoom przeglądarki jest bez problemu. Naprawa: pozwolić znacznikom zawijać się (`whitespace-normal` w wąskich kontenerach) lub zawijać listę nawigacji (`flex-wrap`). Wysiłek: S.

**D-08. Brak nagłówków bezpieczeństwa na stronach publicznych**: `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, CSP (propozycja w sekcji 7). Wysiłek: S–M (testy z `/admin`).

**D-09. Brak canonical, Open Graph, Twitter Card, sitemapy oraz własnego `robots.txt`**: udostępnienie linku (komunikator, media społecznościowe) da gołe podglądy; produkcyjny `robots.txt` to szablon Cloudflare (Content Signals) bez reguł i `Sitemap`. Propozycja: `<link rel="canonical">`, `og:title/description/type/url/image` w `BaseLayout` (dla wpisu pierwsze zdjęcie), statyczny `public/robots.txt` z `Sitemap:` i `Disallow: /admin`, sitemapa (własny plik `sitemap.xml.ts` bez dodawania zależności lub oficjalna integracja po decyzji o zależności). Wysiłek: M.

**D-10. `/404` zwraca 200**: bezpośrednie wejście na `/404` daje stronę błędu ze statusem 200 (jest `noindex`). Nieistniejące adresy poprawnie dają 404. Zachowanie typowe dla static assets, bez potrzeby zmiany; odnotowane.

**D-11. Pierwsze zdjęcie wpisu ładowane leniwie**: Lighthouse „LCP request discovery” (LCP na stronie wpisu to pierwsze zdjęcie z `loading="lazy"`). Naprawa: `loading="eager"` i `fetchpriority="high"` dla pierwszego obrazu galerii w `src/pages/blog/[id].astro`. Zysk minimalny (LCP 1,2 s). Wysiłek: S.

**D-12. Niespójny zapis autorów wpisu**: „Damian, Grzegorz” na `/` (Ostatnie wpisy) i `/biegi/<id>` (Powiązane wpisy), a „Damian i Grzegorz” na `/blog` i w samym wpisie (`joinNames`). Naprawa: użyć `joinNames` w `src/pages/index.astro` i `src/pages/biegi/[id].astro`. Wysiłek: S.

**D-13. Zakodowany na sztywno tekst „Bieg wycofany z listy Korony od 2026 r.”** w `src/pages/biegi/[id].astro` dla każdego biegu z `retired: true`. Przy kolejnym wycofanym biegu tekst będzie nieprawdziwy. Naprawa: neutralne „Bieg wycofany z listy Korony.” albo pole `retiredFrom` w schemacie/panelu. Wysiłek: S.

**D-14. Drobne stany puste**: `/biegi` przy 0 biegów pokazuje pustą listę bez komunikatu; link „Wszystkie wpisy” pod komunikatem „Wpisy pojawią się wkrótce”. Wysiłek: S. Nie dotyczy bieżących danych.

**D-15. Cele dotykowe linków tytułów**: linki tytułów w osi czasu i wynikach indywidualnych mają 18–21 px wysokości (nawigacja i przyciski 44 px). WCAG 2.1 tego nie wymaga; na telefonie wygodniejszy byłby `min-h-11` z `inline-flex`. Wysiłek: S.

**D-16. Pytanie produktowe: status „Bez planu” przy biegach z wynikami**: SGS (Damian ukończył solo, Grzegorz DNS) i Ultra Granią Tatr (obaj DNF) mają znacznik „Bez planu”, obok linijek „Damian: ukończył 09:49:42” lub „nie ukończył (DNF)”. Może mylić czytelników (bieg był, ale nie liczy się do licznika). Decyzja Leada/właściciela: czy dodać status lub adnotację („Do powtórzenia”, „Podejście bez zaliczenia”)? Ewentualna zmiana wymaga zmian w schemacie i `config.yml`. Wysiłek: M.

**D-17. Emoji w tekstach alternatywnych zdjęć**: „Przed startem, a już szczęśliwi 😁”, „Dzień po, ale z uśmiechem 🙈” — czytniki ekranu wymawiają nazwy emoji. Dodać zalecenie do `docs/authors-guide.md` (opis bez emoji). Wysiłek: S.

**D-18. Komunikaty błędów budowy w większości po angielsku**: tylko walidacja referencji jest po polsku; błędy schematu Astro (pusta lista autorów, pusty `alt`, brak pliku zdjęcia) są po angielsku w logu Workers Builds. Produkcja zostaje na poprzedniej wersji, więc błąd jest bezpieczny, ale właściciel może go nie zauważyć. Rekomendacja: krótka sekcja „Co zrobić, gdy budowa się nie powiodła” w `docs/authors-guide.md` (jeśli jej nie ma) i powiadomienia Cloudflare o nieudanych buildach. Wysiłek: S.

**D-19. HTML w treści Markdown nie jest filtrowany** (np. `<script>` w treści wpisu wykona się w przeglądarce czytelnika). Ryzyko akceptowalne, bo wpisy tworzą wyłącznie osoby z zapisem w repozytorium (mogą i tak zmienić cały kod); odnotowane dla świadomości. Wysiłek: brak działań.

**D-20. Repozytorium publiczne: adres e-mail autora commitów** (`wojcicki.d@gmail.com`, 79 commitów) jest w historii; nazwiska w linkach wyników. Decyzja właściciela, bez zmian; można włączyć „Keep my email addresses private” dla przyszłych commitów.

**D-21. Brak automatycznych testów w repozytorium** (skrypty `lint`, `check`, `validate:content` istnieją, ale brak kontroli linków/SEO/a11y po buildzie). Rekomendacja: dodać lekki skrypt (bez nowych zależności) sprawdzający po `npm run build` linki wewnętrzne, tytuły i `alt` — logika z tego przeglądu jest gotowa do przeniesienia. Wysiłek: M.

**D-22. Web Analytics nieaktywne**: brak skryptu w HTML (właściciel zajmie się później). Po włączeniu zaktualizować CSP (sekcja 7).

### Obserwacje dotyczące danych (bez wady)

- Bieg 7 Dolin: w danych czas Damiana 18:43:38, w tekście wpisu „18:43:25” (różne czasy chip/gun lub literówka — do potwierdzenia przez właściciela); Grzegorz 18:43:37.
- Notatka DNS przy SGS zaczyna się od „Nie wystartował…”, a znacznik już mówi „Nie wystartował (DNS)” — powtórzenie w tekście (kosmetyka).

## 12. Pytania do Leada

1. Czy tworzymy zadania z D-03, D-04, D-05, D-06 przed oficjalnym startem (proponuję tak: łącznie ok. 2 h pracy)?
2. Czy wdrażamy `public/_headers` z sekcji 7 (D-06 + D-08) jako jedno zadanie z testem `/admin` w `wrangler dev`?
3. D-16: czy status „Bez planu” dla biegów z wynikami DNF/DNS/solo jest zamierzony (decyzja właściciela)?
4. Czy metadane społecznościowe i sitemapa (D-09) wchodzą do zakresu MVP, czy po starcie?
5. Kryterium „przepływ dodania wpisu i zmiany statusu” zamyka właściciel; checklista w sekcji 10.

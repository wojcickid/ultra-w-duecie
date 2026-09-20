# Architektura — Ultra w duecie

Patrz też: `docs/decisions.md` (DEC-001 … DEC-005).

## Przegląd

Strona statyczna generowana przez Astro, hostowana na Cloudflare Pages. Treść (wpisy bloga i dane biegów) to pliki w repozytorium GitHub, edytowane przez panel CMS (Decap CMS lub kompatybilny Sveltia CMS), który zapisuje zmiany jako commity. Każdy commit uruchamia automatyczną budowę i publikację strony.

```text
Autor (admin/moderator)
   |  logowanie przez GitHub
   v
Panel CMS (/admin)  --commit-->  Repozytorium GitHub  --webhook-->  Cloudflare Pages (build Astro)
                                                                        |
Czytelnik  <---------------- statyczne HTML/CSS/JS z CDN Cloudflare <---+
```

Brak własnego backendu, bazy danych i serwera do utrzymania.

## Frontend

- Framework: **Astro** (generowanie statyczne), TypeScript.
- Style: **Tailwind CSS**, mobile-first (szczegóły w `docs/ui.md`).
- Treść: **Astro Content Collections** z walidacją schematu (Zod):
  - `biegi` — 10 biegów Korony (nazwa, dystans, miejsce, orientacyjny termin, status, flaga wycofania z listy Korony (`retired`), data planowana, notatki, oraz lista wyników per osoba: osoba, data ukończenia, czas, link do wyników),
  - `wpisy` — wpisy bloga (tytuł, data, treść w Markdown, zdjęcia, autor/autorzy, opcjonalne powiązanie z biegiem),
  - `autorzy` — dwie osoby (identyfikator, nazwa wyświetlana); wpisy i wyniki odwołują się do nich.
- Routing: strona główna, lista biegów, strona biegu, lista wpisów, strona wpisu; panel pod `/admin`.
- Brak stanu po stronie klienta poza samym panelem CMS.

## Backend

Brak własnego backendu. Jedyny element serwerowy to niewielka funkcja (Cloudflare Pages Function / Worker) obsługująca logowanie OAuth przez GitHub dla panelu CMS — wybór dokładnego rozwiązania w TASK-001.

## Baza danych

Brak. Źródłem danych są pliki Markdown/JSON w repozytorium (kolekcje treści). Historia zmian i kopia zapasowa zapewnia Git. Rola „Database Agent” nie jest w tym projekcie używana.

## Analityka

**Cloudflare Web Analytics** — bez cookies i bez zbierania danych osobowych (DEC-002).

## Wdrożenie

- **Dev:** lokalnie (`astro dev`), opcjonalnie na własnym serwerze (Proxmox) — nie jest wymagane.
- **Prod:** Cloudflare Pages pod subdomeną istniejącej domeny właściciela (DEC-006); dedykowana domena może zastąpić subdomenę później. Automatyczna publikacja po zmianie na gałęzi `main`.
- **Podgląd:** Cloudflare Pages tworzy adresy podglądu dla gałęzi (do sprawdzania zmian przed merge).
- Środowiska: dev (lokalnie) i prod. Środowisko testowe zastępują podglądy gałęzi.
- Repozytorium: GitHub (prywatne lub publiczne — do decyzji użytkownika; przy publicznym treść źródłowa jest jawna, nie zawiera sekretów).

## Bezpieczeństwo

- Publiczna strona jest statyczna: brak formularzy, sesji i danych użytkowników — minimalna powierzchnia ataku.
- Dostęp do zapisu treści ma wyłącznie osoba z uprawnieniami zapisu w repozytorium GitHub; logowanie do panelu przez konto GitHub (zalecane włączenie 2FA). Na start jedno konto (właściciel); drugi autor może zostać dodany później jako współpracownik repozytorium.
- Sekrety (identyfikator i sekret aplikacji OAuth GitHub) przechowywane wyłącznie w ustawieniach Cloudflare, nigdy w repozytorium.
- Ochrona gałęzi `main` (wymóg PR lub przynajmniej brak force-push).
- Brak danych wrażliwych i osobowych czytelników.

## Kopie zapasowe

Wszystko (treść, obrazy, kod) jest w repozytorium Git. Zalecana dodatkowa kopia poza GitHubem: okresowy mirror repozytorium na własnym serwerze (Proxmox) — patrz TASK-012.

## Obserwowalność

- Logi budowy i wdrożeń: panel Cloudflare Pages.
- Statystyki odwiedzin: Cloudflare Web Analytics.
- Monitoring dostępności: opcjonalnie darmowy monitor zewnętrzny (poza zakresem MVP).

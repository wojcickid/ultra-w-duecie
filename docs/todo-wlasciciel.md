# Lista zadań właściciela (na później)

Stan na 2026-09-22 (sekcje 3–6: TO DO). Nic z tej listy nie blokuje działania strony. Po wykonaniu punktu wystarczy napisać Leadowi, co zrobiłeś (albo co wybrałeś), a on zamknie powiązane zadania.

Nazwy przycisków w Cloudflare i GitHubie bywają zmieniane; szukaj najbardziej podobnej opcji.

## 1. Cloudflare (zalecane przed oficjalnym startem)

### 1.1 Przekierowanie HTTP → HTTPS (wada D-01 z raportu QA, priorytet P1)

**Status (2026-09-22): ROZWIĄZANE inaczej, niż planowano — nic nie musisz robić.** Twoja reguła Page Rule w Cloudflare (`http://korona.damianwojcicki.com/*` → Forwarding URL 301) nie zadziałała, bo strona jest Workers Custom Domain + statyczne pliki — ten typ wdrożenia omija miejsce w potoku Cloudflare, gdzie działają Page/Redirect Rules. To nie Twój błąd w konfiguracji, tylko ograniczenie tej architektury (opisane w DEC-014 w `docs/decisions.md`).

Przekierowanie jest teraz w kodzie Workera (`worker/index.ts`) — wdroży się razem z najbliższym „wypychaj”. Twoją Page Rule możesz zostawić (nieszkodliwa, nadmiarowa) albo usunąć, jak wolisz — bez znaczenia dla działania strony.

Po wdrożeniu Lead sprawdzi `curl -I http://korona.damianwojcicki.com/` i zamknie ten punkt.

### 1.2 Web Analytics (statystyki odwiedzin, DEC-002)

**Status (2026-09-22): ZROBIONE.** Witryna dodana ręcznie w Cloudflare, token przesłany, skrypt dodany do `src/layouts/BaseLayout.astro` (jedna linia w `<head>`, bez ciasteczek, bez danych osobowych — zgodnie z DEC-002). Wdroży się po najbliższym „wypychaj”.

Statystyki pojawią się w panelu Web Analytics z opóźnieniem (zwykle kilka minut do godziny) po pierwszych odwiedzinach strony po wdrożeniu.

### 1.3 Adres `workers.dev` (opcjonalnie) — ZROBIONE (2026-09-21)

Właściciel wyłączył `workers.dev`; strona działa pod `korona.damianwojcicki.com`.

Strona jest dostępna także pod domyślnym adresem `ultra-w-duecie.<konto>.workers.dev` (logowanie do panelu tam nie zadziała, to zamierzone). Żeby był tylko jeden adres: Worker → **Settings** → **Domains & Routes** → wyłącz `workers.dev`. Zrób to dopiero po potwierdzeniu, że domena `korona.damianwojcicki.com` działa.

### 1.4 Bezpieczeństwo konta

**Status (2026-09-22): ZROBIONE.** 2FA na koncie Cloudflare aktywne w dwóch wariantach: klucz sprzętowy (security key) i e-mail.

## 2. Decyzje do podjęcia

1. **Status „Bez planu”** — ZAŁATWIONE rundą UX (2026-09-21): etykieta to teraz „Do ustalenia”; SGS i Grań Tatr pokazują dodatkowo blok „Razem” z wyjaśnieniem, co się stało. Jeśli kiedyś zechcesz inny znacznik dla biegów z wynikami, to osobna decyzja.
2. **SEO** — do decyzji (rekomendacja Leada): dla osobistej kroniki nie potrzebujesz pozycjonowania. Warto tylko **Open Graph** (ładny podgląd linku z tytułem i opisem w Messengerze/WhatsAppie/na Facebooku): ok. 1 h pracy, bez kosztów. Sitemapa i canonical mają tu znikome znaczenie. Napisz „OG tak” albo „pomijamy”.
3. **Czas Damiana w Biegu 7 Dolin** — ZAŁATWIONE: w danych jest czas oficjalny (brutto) 18:43:38, a wpis zawiera czas z zegarka autora (18:43:25); różnica jest zamierzona, nic nie zmieniamy.

## 3. Do sprawdzenia w praktyce (zamknie TASK-011)

1. **Przycisk „Revert” na GitHubie** — SPRAWDZONE (2026-09-22): nie ma go przy commitach z panelu (widoczny tylko przy scalonych pull requestach, a panel commituje wprost na `main`). Cofanie zmian wciąż możliwe trzema opisanymi w `docs/authors-guide.md` sposobami.
2. **„Delete entry” w panelu** — SPRAWDZONE (2026-09-22): commit usuwa cały folder wpisu, razem ze zdjęciami (nie zostają osierocone pliki w repozytorium).
3. Przeczytaj `docs/authors-guide.md` i zgłoś fragmenty, które są niejasne.

## 4. Opcjonalne (bez pośpiechu)

- **Blokada force-push na `main`:** GitHub → Settings → Branches → Add rule dla `main`: zaznacz blokadę force-push (bez wymogu pull requesta, bo panel zapisuje wprost na `main`).
- **Odwołanie autoryzacji na koncie testowym:** konto `dwojcickitest-tech` → Settings → Applications → Authorized OAuth Apps → „Ultra w duecie - panel CMS” → Revoke.
- **Konto GitHub dla Grzegorza:** gdy je założy (z 2FA), dodaj go jako współpracownika z prawem zapisu (repozytorium → Settings → Collaborators). Wtedy sam loguje się do `/admin/`. Do tego czasu przesyła Ci treść, a Ty ją publikujesz z jego autorstwem.
- **Pytanie do redakcji Kingrunera** (`redakcja@kingrunner.com`): który slot z 10 zajmuje Bieg 7 Dolin, czy Bison Ultra Trail 2026 się zalicza, jak rozumieć „8 stałych + jeden z trzech”. Lead może przygotować gotowy tekst maila.
- **Paleta kolorów (TASK-015):** gdy będziesz wiedział, co Ci się podoba, napisz (nastrój, przykład strony). Zmiana to kilkanaście wartości w jednym miejscu.
- **Kopia zapasowa repozytorium na Proxmoxie (TASK-012):** okresowy mirror poza GitHubem; Lead opisze prosty mechanizm.
- **Dystans Biegu 7 Dolin:** w danych 100,7 km to długość obecnej trasy; trasy z 2024 r. nie sprawdzono. Zostaw albo wróć do 100 km w panelu.
- **Terminy z niską pewnością** (Bieg Ultra Granią Tatr, Kaliska Setka, ZUK 2027, Chudy Wawrzyniec 2027): do potwierdzenia u organizatorów, jeśli chcesz mieć je na stronie (szczegóły w `docs/run-data-proposals.md`).

## 5. Praca na co dzień

- Dodawanie wpisów i wyników: panel `https://korona.damianwojcicki.com/admin/`, opis w `docs/authors-guide.md`.
- Przed pracą z Gitem na komputerze zawsze `git pull` (panel commituje wprost na `main`).

## 6. Po rundzie UX (TASK-020…022) — do uzupełnienia ręcznie

- **Wpisy bloga:** nie były zmieniane. Relacje z biegów (np. Rzeźnik, SGS, Grań Tatr) piszesz sam; przy każdym wpisie wybierz „Bieg” w panelu, a pojawi się na karcie biegu w sekcji „Relacja” i przy wpisie jako „Dotyczy biegu”.
- **Miejsce w klasyfikacji** (`place`) przy wynikach osób — wpisz w panelu tam, gdzie znasz (tabela na karcie biegu pokaże wiersz „Miejsce” dopiero po pierwszym wpisie).
- **Link do wyników całego biegu** (`resultsUrl` na poziomie biegu) — sekcja „Oficjalne wyniki” pojawi się po dodaniu.
- **Rok terminu orientacyjnego** (`expectedYear`) — tylko dla biegów, gdzie rok jest pewny (np. „luty 2027”); bez roku strona pokaże „luty (termin orientacyjny)”.
- **Status SGS i Grań Tatr** („Do ustalenia” mimo wyników z 2025) — nadal Twoja decyzja (punkt 2.1); blok „Razem” na karcie tłumaczy, co się stało.
- **Najbliższy start** po dniu startu znika sam (skrypt); nowa data pojawi się po zapisie w panelu (przebudowa strony).

# Lista zadań właściciela (na później)

Stan na 2026-09-21 (sekcje 3–6: TO DO). Nic z tej listy nie blokuje działania strony. Po wykonaniu punktu wystarczy napisać Leadowi, co zrobiłeś (albo co wybrałeś), a on zamknie powiązane zadania.

Nazwy przycisków w Cloudflare i GitHubie bywają zmieniane; szukaj najbardziej podobnej opcji.

## 1. Cloudflare (zalecane przed oficjalnym startem)

### 1.1 Przekierowanie HTTP → HTTPS (wada D-01 z raportu QA, priorytet P1)

**Status (2026-09-21): DO POPRAWKI.** Test `curl -I http://korona.damianwojcicki.com/` nadal zwraca `200 OK`, a nie `301`. Otwarcie adresu w przeglądarce (także w incognito) niczego nie dowodzi: nowe Chrome/Edge same podmieniają `http://` na `https://` przy wpisywanym adresie. Reguła prawdopodobnie nie została zapisana/wdrożona albo ma inny warunek; sprawdź w Rules → Redirect Rules, czy jest na liście ze statusem aktywnym (Enabled/Deployed) i czy wyrażenie zgadza się z poniższym. Do weryfikacji użyj `curl` (Lead sprawdzi po Twoim „zrobione”).

Dziś `http://korona.damianwojcicki.com/` otwiera stronę zamiast przekierować na HTTPS.

**Nie włączaj „Always Use HTTPS” dla całej strefy** `damianwojcicki.com`: ustawienie działa na wszystkie subdomeny i mogłoby zepsuć inne usługi na tej domenie (np. te na mikr.us), które działają po HTTP. Zrób regułę tylko dla tego hosta:

1. dash.cloudflare.com → wybierz domenę `damianwojcicki.com` → **Rules** → **Redirect Rules** → **Create rule** (jest też szablon „Redirect from HTTP to HTTPS”; jeśli go użyjesz, ogranicz go do hosta).
2. Warunek (When): `Hostname` równa się `korona.damianwojcicki.com` **oraz** żądanie nie jest po HTTPS (w edytorze wyrażeń: `(http.host eq "korona.damianwojcicki.com" and not ssl)`).
3. Akcja (Then): przekierowanie dynamiczne na `concat("https://", http.host, http.request.uri.path)`, kod **301**, zaznaczone „Preserve query string”.
4. Zapisz i wdróż (Deploy).
5. Test: `curl -I http://korona.damianwojcicki.com/` powinno zwrócić `301` z adresem `https://...`.

HSTS (nagłówek wymuszający HTTPS w przeglądarce) dodamy dopiero po tej regule, wyłącznie dla tego hosta, bez `includeSubDomains`. Daj znać, gdy reguła działa.

### 1.2 Web Analytics (statystyki odwiedzin, DEC-002)

**Status (2026-09-21):** strony nie ma na liście do wyboru (lista obejmuje tylko hosty z proxowanym rekordem DNS, a Worker z własną domeną tam nie trafia). To normalne. Skrypt statystyk trzeba dodać ręcznie:

1. Cloudflare → **Analytics & Logs** → **Web Analytics** → **Add a site**.
2. Zamiast wybierać z listy **wpisz ręcznie** hostname `korona.damianwojcicki.com` i zapisz.
3. Wejdź w **Manage site** i skopiuj fragment JS (`<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "..."}'>`). Token nie jest sekretem (i tak jest widoczny w kodzie strony), więc możesz go wkleić Leadowi w wiadomości.
4. Lead doda go do układu strony (mała zmiana, jedna linia w `BaseLayout`). Skrypt nie używa ciasteczek i nie zbiera danych osobowych (DEC-002).

Jeśli statystyki Ci niepotrzebne, możesz ten punkt pominąć i zamknąć TASK-009 bez nich.

### 1.3 Adres `workers.dev` (opcjonalnie) — ZROBIONE (2026-09-21)

Właściciel wyłączył `workers.dev`; strona działa pod `korona.damianwojcicki.com`.

Strona jest dostępna także pod domyślnym adresem `ultra-w-duecie.<konto>.workers.dev` (logowanie do panelu tam nie zadziała, to zamierzone). Żeby był tylko jeden adres: Worker → **Settings** → **Domains & Routes** → wyłącz `workers.dev`. Zrób to dopiero po potwierdzeniu, że domena `korona.damianwojcicki.com` działa.

### 1.4 Bezpieczeństwo konta

TO DO: włącz 2FA na koncie Cloudflare (steruje domeną i wdrożeniem).

## 2. Decyzje do podjęcia

1. **Status „Bez planu”** — ZAŁATWIONE rundą UX (2026-09-21): etykieta to teraz „Do ustalenia”; SGS i Grań Tatr pokazują dodatkowo blok „Razem” z wyjaśnieniem, co się stało. Jeśli kiedyś zechcesz inny znacznik dla biegów z wynikami, to osobna decyzja.
2. **SEO** — do decyzji (rekomendacja Leada): dla osobistej kroniki nie potrzebujesz pozycjonowania. Warto tylko **Open Graph** (ładny podgląd linku z tytułem i opisem w Messengerze/WhatsAppie/na Facebooku): ok. 1 h pracy, bez kosztów. Sitemapa i canonical mają tu znikome znaczenie. Napisz „OG tak” albo „pomijamy”.
3. **Czas Damiana w Biegu 7 Dolin** — ZAŁATWIONE: w danych jest czas oficjalny (brutto) 18:43:38, a wpis zawiera czas z zegarka autora (18:43:25); różnica jest zamierzona, nic nie zmieniamy.

## 3. Do sprawdzenia w praktyce (zamknie TASK-011)

1. **Przycisk „Revert” na GitHubie:** repozytorium → **Commits** → wybrany commit z panelu. Czy widzisz przycisk „Revert”? (Z mojej wiedzy jest tylko przy scalonych pull requestach; instrukcja opisuje trzy alternatywy.) Napisz, co widzisz.
2. **„Delete entry” w panelu:** przy usuwaniu wpisu sprawdź w GitHubie, czy commit usuwa cały folder wpisu (razem ze zdjęciami), czy tylko `index.md`.
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

# Lista zadań właściciela (na później)

Stan na 2026-09-20. Nic z tej listy nie blokuje działania strony. Po wykonaniu punktu wystarczy napisać Leadowi, co zrobiłeś (albo co wybrałeś), a on zamknie powiązane zadania.

Nazwy przycisków w Cloudflare i GitHubie bywają zmieniane; szukaj najbardziej podobnej opcji.

## 1. Cloudflare (zalecane przed oficjalnym startem)

### 1.1 Przekierowanie HTTP → HTTPS (wada D-01 z raportu QA, priorytet P1)

Dziś `http://korona.damianwojcicki.com/` otwiera stronę zamiast przekierować na HTTPS.

**Nie włączaj „Always Use HTTPS” dla całej strefy** `damianwojcicki.com`: ustawienie działa na wszystkie subdomeny i mogłoby zepsuć inne usługi na tej domenie (np. te na mikr.us), które działają po HTTP. Zrób regułę tylko dla tego hosta:

1. dash.cloudflare.com → wybierz domenę `damianwojcicki.com` → **Rules** → **Redirect Rules** → **Create rule** (jest też szablon „Redirect from HTTP to HTTPS”; jeśli go użyjesz, ogranicz go do hosta).
2. Warunek (When): `Hostname` równa się `korona.damianwojcicki.com` **oraz** żądanie nie jest po HTTPS (w edytorze wyrażeń: `(http.host eq "korona.damianwojcicki.com" and not ssl)`).
3. Akcja (Then): przekierowanie dynamiczne na `concat("https://", http.host, http.request.uri.path)`, kod **301**, zaznaczone „Preserve query string”.
4. Zapisz i wdróż (Deploy).
5. Test: `curl -I http://korona.damianwojcicki.com/` powinno zwrócić `301` z adresem `https://...`.

HSTS (nagłówek wymuszający HTTPS w przeglądarce) dodamy dopiero po tej regule, wyłącznie dla tego hosta, bez `includeSubDomains`. Daj znać, gdy reguła działa.

### 1.2 Web Analytics (statystyki odwiedzin, DEC-002)

Na produkcji nie ma jeszcze skryptu `static.cloudflareinsights.com`.

1. Cloudflare → **Analytics & Logs** → **Web Analytics** → **Add a site**.
2. Hostname: `korona.damianwojcicki.com`, konfiguracja automatyczna (Cloudflare wstrzykuje skrypt sam).
3. Po kilku minutach otwórz stronę → „Wyświetl źródło strony” i poszukaj `cloudflareinsights`.
4. Jeśli skryptu nie ma, napisz Leadowi: dodamy go ręcznie w kodzie strony (mała zmiana).

### 1.3 Adres `workers.dev` (opcjonalnie)

Strona jest dostępna także pod domyślnym adresem `ultra-w-duecie.<konto>.workers.dev` (logowanie do panelu tam nie zadziała, to zamierzone). Żeby był tylko jeden adres: Worker → **Settings** → **Domains & Routes** → wyłącz `workers.dev`. Zrób to dopiero po potwierdzeniu, że domena `korona.damianwojcicki.com` działa.

### 1.4 Bezpieczeństwo konta

Włącz 2FA na koncie Cloudflare, jeśli jeszcze nie masz (steruje domeną i wdrożeniem).

## 2. Decyzje do podjęcia

1. **Status „Bez planu” przy biegach z wynikami solo/DNF/DNS** (SGS, Ultra Granią Tatr). Znacznik biegu mówi „Bez planu”, mimo że macie wyniki. To Twój wybór statusu w panelu:
   - zostawić (nie planujecie wspólnego podejścia), albo
   - zmienić na „Planowany” tam, gdzie planujecie kolejne podejście.
   Jeśli chcesz automatyczne zachowanie (np. inny znacznik dla biegów z wynikami), to decyzja produktowa: napisz.
2. **SEO po starcie (canonical, Open Graph, sitemapa):** zrobić po oficjalnym starcie czy pominąć? Poprawia to wyświetlanie linków w komunikatorach i indeksowanie. Około 1–2 h pracy agenta.
3. **Czas Damiana w Biegu 7 Dolin:** w danych jest 18:43:38, a w tekście wpisu 18:43:25 (czas brutto/netto?). Wybierz poprawny i popraw w panelu (dane) albo we wpisie.

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

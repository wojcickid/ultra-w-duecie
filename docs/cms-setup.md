# Instrukcja: panel CMS, logowanie przez GitHub i Cloudflare Workers

Dla właściciela strony (bez doświadczenia administracyjnego). Kroki wykonujesz w przeglądarce, w panelach Cloudflare i GitHub. Nie musisz nic instalować ani wpisywać w terminalu.

Decyzja i uzasadnienie: `docs/decisions.md` (DEC-009, sekcja „Aktualizacja”). Opis techniczny: `docs/architecture.md`.

## Jak to działa (w skrócie)

1. Strona jest publikowana w Cloudflare jako **Worker ze statycznymi plikami** (nie jako projekt Cloudflare Pages) z repozytorium GitHub `wojcickid/ultra-w-duecie` (gałąź `main`). Kreator Cloudflare dla nowych projektów tworzy właśnie Workera; kroki poniżej są ułożone pod jego pola.
2. Panel edycji jest pod adresem `https://korona.damianwojcicki.com/admin/` (nie ma linku ze strony; wyszukiwarki go pomijają).
3. Panel loguje Cię przez konto **GitHub**. Zapis wpisu to zwykły commit w repozytorium; Cloudflare sam buduje i publikuje nową wersję strony (zwykle 1-2 minuty).
4. Do logowania potrzebny jest mały skrypt tego samego Workera (`/api/auth` i `/api/callback`, kod w repozytorium: `worker/`). Dane aplikacji GitHub trzyma on jako **Secrets** w Cloudflare; wpisujesz je tylko w panelu Cloudflare, nigdy w repozytorium.

Zapisać zmiany może tylko konto GitHub, które ma prawo zapisu w repozytorium. Zalogować się przez GitHub może każdy, ale bez uprawnień zapisu panel nie pozwoli niczego opublikować.

## Zanim zaczniesz

- Konto GitHub właściciela repozytorium (`wojcickid`) z włączonym uwierzytelnianiem dwuskładnikowym (2FA): GitHub → Settings → Password and authentication.
- Konto Cloudflare, w którym jest domena `damianwojcicki.com`.
- Gałąź `main` zawiera pliki `wrangler.jsonc`, `worker/` i `public/admin/` (po scaleniu zadań TASK-001 i TASK-016). Bez nich Cloudflare nie wdroży Workera z logowaniem.

Nazwy przycisków w panelach bywają zmieniane; jeśli się różnią, szukaj najbardziej podobnej opcji.

## Kolejność kroków (dlaczego taka)

Client ID i sekret aplikacji GitHub wpisujesz w Cloudflare jako Secrets **po pierwszym wdrożeniu**, a nie w repozytorium. Dzięki temu nie musisz nic zmieniać w kodzie przed pierwszym wdrożeniem, a to wdrożenie jest bezpieczne: strona działa od razu, tylko logowanie w `/admin/` pokazuje komunikat „Logowanie nie jest skonfigurowane po stronie serwera”, dopóki nie dodasz sekretów.

1. Krok 1: kreator Workera w Cloudflare (pierwsze wdrożenie).
2. Krok 2: domena `korona.damianwojcicki.com`.
3. Krok 3: aplikacja OAuth w GitHubie (adres zwrotny zależy tylko od domeny, więc nie trzeba czekać na nic z kroku 1).
4. Krok 4: dwa Secrets w Workerze i ewentualne ponowne wdrożenie.
5. Krok 5: Web Analytics.
6. Krok 6: test logowania i zapisu.

Kroki 2 i 3 możesz wykonać w dowolnej kolejności.

## Krok 1. Kreator Workera („Set up your application”)

1. Zaloguj się na https://dash.cloudflare.com i wybierz konto z domeną.
2. Menu po lewej: **Workers & Pages** → **Create application** → wybierz import repozytorium z Gita (**Import a repository** / **Connect Git**), **nie** zakładkę Pages.
3. Wybierz **GitHub**, zaloguj się i zezwól Cloudflare na dostęp (**Install & Authorize**). Najbezpieczniej wybrać dostęp tylko do repozytorium `ultra-w-duecie`.
4. Wybierz repozytorium `wojcickid/ultra-w-duecie`. Na ekranie **Set up your application** (**Configure your Worker project**) ustaw pola dokładnie tak:

   | Pole                                     | Wartość                                                                                                 |
   | ---------------------------------------- | ------------------------------------------------------------------------------------------------------- |
   | **Project name**                         | `ultra-w-duecie` (musi być identyczna jak `name` w `wrangler.jsonc`, inaczej budowa się nie uda)        |
   | **Build command**                        | `npm run build`                                                                                         |
   | **Deploy command**                       | `npx wrangler deploy`                                                                                   |
   | **Non-production branch deploy command** | `npx wrangler versions upload`                                                                          |
   | **Root directory**                       | `/`                                                                                                     |
   | **API token**                            | **Create new token**: pozwól Cloudflare utworzyć token automatycznie (nic nie kopiuj, zapisze się sam) |
   | **Advanced settings**                    | zostaw domyślne (zmienne budowy nie są potrzebne; patrz uwaga o Node poniżej)                           |

5. Zatwierdź (**Save and Deploy** / **Deploy**) i poczekaj na zielony status pierwszej budowy (zwykle 1-3 minuty). Wynik: adres `https://ultra-w-duecie.<twoja-nazwa>.workers.dev`. Otwórz go: strona główna powinna działać.
6. Na tym etapie `/admin/` się otwiera, ale logowanie pokazuje „Logowanie nie jest skonfigurowane po stronie serwera”. To zamierzone: brakuje jeszcze sekretów (krok 4).

**Node.** Domyślna wersja Node w budowie Cloudflare (24.x) działa z projektem (sprawdzone lokalnie na Node 24; projekt wymaga 22.12 lub nowszego). Zmiennej `NODE_VERSION` nie trzeba ustawiać. Jeśli budowa kiedyś zacznie się psuć po zmianie wersji Node przez Cloudflare, w **Settings** → **Build** → **Build Variables and Secrets** dodaj `NODE_VERSION` = `22`.

**Zmienne budowy a zmienne działania.** W Cloudflare to dwa osobne miejsca: **Build Variables and Secrets** (widoczne tylko podczas budowy) i **Variables and Secrets** Workera (widoczne dla działającego Workera). Sekrety logowania wpisujesz w tym drugim (krok 4).

## Krok 2. Domena korona.damianwojcicki.com

1. Cloudflare → **Workers & Pages** → Worker `ultra-w-duecie` → **Settings** → **Domains & Routes** → **Add** → **Custom domain**.
2. Wpisz `korona.damianwojcicki.com` → **Add domain** i potwierdź.
3. Domena jest w Twoim koncie Cloudflare, więc rekord DNS i certyfikat HTTPS dodadzą się automatycznie. Poczekaj, aż status zmieni się na aktywny (od kilku minut do godziny).
4. Sprawdź, że `https://korona.damianwojcicki.com` otwiera stronę.

Uwaga: jeśli w DNS strefy istnieje już wpis (np. CNAME) dla `korona`, dodanie domeny się nie uda. Usuń stary wpis (Cloudflare → domena `damianwojcicki.com` → **DNS** → **Records** → wpis `korona`), potem dodaj domenę ponownie.

Adres jest wpisany w repozytorium w `astro.config.mjs` (pole `site`), `public/admin/config.yml` (`base_url`, `site_url`, `display_url`) i `wrangler.jsonc` (`ALLOWED_ORIGIN`). Jeśli zdecydujesz się na inną subdomenę, trzeba zmienić te miejsca oraz krok 3.

## Krok 3. Aplikacja OAuth w GitHubie

1. Zaloguj się na GitHub kontem właściciela repozytorium.
2. Kliknij swój awatar → **Settings** → na dole lewego menu **Developer settings** → **OAuth Apps** → **New OAuth App** (bezpośrednio: https://github.com/settings/developers).
3. Wypełnij formularz:
   - **Application name**: `Ultra w duecie - panel CMS`
   - **Homepage URL**: `https://korona.damianwojcicki.com`
   - **Application description**: dowolnie lub puste
   - **Authorization callback URL**: `https://korona.damianwojcicki.com/api/callback`
   - **Enable Device Flow**: zostaw niezaznaczone
4. **Register application**.
5. Na stronie aplikacji skopiuj **Client ID**.
6. Kliknij **Generate a new client secret** i skopiuj **sekret** (GitHub pokaże go tylko raz; jeśli zgubisz, wygeneruj nowy).

Client ID i sekret przechowuj tylko w menedżerze haseł. Nie wklejaj ich do czatu, e-maili, repozytorium ani plików w projekcie. Do Cloudflare wpiszesz je w kroku 4.

## Krok 4. Secrets w Workerze (Client ID i sekret)

1. Cloudflare → **Workers & Pages** → Worker `ultra-w-duecie` → **Settings** → **Variables and Secrets** → **Add**.
2. Dodaj dwie pozycje, obie z typem **Secret** (zaszyfrowany; po zapisaniu wartości nie da się już odczytać):

   | Nazwa                  | Typ        | Wartość             |
   | ---------------------- | ---------- | ------------------- |
   | `GITHUB_CLIENT_ID`     | **Secret** | Client ID z kroku 3 |
   | `GITHUB_CLIENT_SECRET` | **Secret** | sekret z kroku 3    |

3. Zapisz i, jeśli panel pokaże przycisk **Deploy**, kliknij go. Nazwy muszą być dokładnie takie (wielkie litery, podkreślniki).
4. Gdyby po zapisaniu logowanie nadal zgłaszało brak konfiguracji, wykonaj kolejne wdrożenie: **Deployments** (lub **Builds**) → przy najnowszej budowie **Retry build**, albo zrób dowolny commit na `main`.

**Co zostaje w repozytorium, a co w panelu.** Jawna zmienna `ALLOWED_ORIGIN` (`https://korona.damianwojcicki.com`) jest w pliku `wrangler.jsonc` i wdraża się razem z kodem. Nie zmieniaj jej w panelu: przy następnym wdrożeniu `npx wrangler deploy` przywróci wartość z pliku (plik jest źródłem prawdy dla zwykłych zmiennych; zwykłe zmienne dodane tylko w panelu byłyby usuwane). Sekrety z panelu **nie** są nadpisywane przez kolejne wdrożenia. Dlatego także `GITHUB_CLIENT_ID` jest Secretem (a nie zwykłą zmienną): przeżywa każde wdrożenie i nie trzeba go wpisywać w kodzie.

## Krok 5. Cloudflare Web Analytics (DEC-002)

W tym wdrożeniu nie ma przełącznika „Enable” z Cloudflare Pages. Statystyki włączasz osobno, dla domeny:

1. Cloudflare → **Analytics & Logs** → **Web Analytics** → **Add a site**.
2. Z listy wybierz **`korona.damianwojcicki.com`** (Hostname) i kliknij **Done**. Domena Workera przechodzi przez serwery Cloudflare (tzw. pomarańczowa chmurka; rekord dodany w kroku 2), więc Cloudflare wstawia skrypt statystyk automatycznie, bez zmiany kodu, bez cookies i bez baneru zgody.
3. Po kilku minutach otwórz stronę, wybierz „Wyświetl źródło strony” i poszukaj `static.cloudflareinsights.com`. Statystyki: **Web Analytics** → wybierz witrynę (dane pojawiają się z opóźnieniem kilkunastu minut).

Jeśli po godzinie skryptu nie ma (dokumentacja Cloudflare nie opisuje wprost automatycznego wstrzykiwania dla Workerów ze static assets; nie działa ono też dla domen bez proxy ani gdy odpowiedź ma nagłówek `Cache-Control: public, no-transform`), użyj metody ręcznej: w **Web Analytics** → **Manage site** skopiuj fragment skryptu (`<script ... data-cf-beacon='{"token": "..."}'>`) i przekaż agentowi frontend, który wstawi go do układu strony (zmiana w kodzie). Token statystyk nie jest sekretem.

## Krok 6. Test logowania i zapisu

1. Otwórz `https://korona.damianwojcicki.com/admin/`.
2. Kliknij **Sign In with GitHub**. Otworzy się okno GitHuba z prośbą o zgodę dla aplikacji „Ultra w duecie - panel CMS” (dostęp do publicznych repozytoriów). Zatwierdź. Okno zamknie się samo, a panel się załaduje.
3. Wybierz kolekcję **Wpisy** → **Nowy wpis** i wypełnij tytuł, datę, autorów oraz treść (opcjonalnie dodaj zdjęcie z opisem). **Save** / **Publish**.
4. W GitHubie (repozytorium → **Commits**) powinien pojawić się nowy commit, a plik `src/content/posts/<nazwa>/index.md` (oraz zdjęcie obok).
5. Po 1-2 minutach wpis widać na `https://korona.damianwojcicki.com/blog`.
6. Usuń wpis testowy: w panelu **Delete entry** (lub usunięciem katalogu w GitHubie).

Test uprawnień (opcjonalnie, dobrze wykonać raz): zaloguj się do panelu w oknie prywatnym kontem GitHub bez dostępu do repozytorium (np. kolegi). Logowanie się uda, ale panel nie pokaże zawartości lub odmówi zapisu (błąd 403/404). Nic nie zostanie zapisane w repozytorium.

Ekran logowania oferuje też **Sign In with Token** (osobisty token dostępu). To metoda awaryjna, opisana w sekcji „Gdy logowanie przez GitHub nie działa”.

## Drugi autor (później)

Drugi autor nie musi mieć konta GitHub na starcie: autor wpisu to pole wpisu, niezależne od konta, które publikuje (DEC-006). Gdy kolega ma założyć konto:

1. Kolega zakłada konto GitHub i włącza 2FA.
2. Ty: repozytorium `ultra-w-duecie` → **Settings** → **Collaborators** → **Add people** → wpisz jego nazwę użytkownika → rola **Write** (zapis). Kolega przyjmuje zaproszenie z e-maila.
3. Kolega loguje się do `/admin/` swoim kontem GitHub. Nic więcej w Cloudflare ani w kodzie nie trzeba zmieniać.

Cofnięcie dostępu: **Settings** → **Collaborators** → usuń osobę.

## Gdy nie działa (typowe problemy)

| Objaw | Prawdopodobna przyczyna i rozwiązanie |
| --- | --- |
| Budowa kończy się błędem o nazwie Workera | **Project name** w kreatorze musi być identyczna jak `name` w `wrangler.jsonc` (`ultra-w-duecie`). Popraw nazwę Workera lub plik. |
| Budowa: „wrangler: not found” albo brak katalogu `dist` | Sprawdź w **Settings** → **Build**: **Build command** to `npm run build`, **Deploy command** to `npx wrangler deploy`, **Root directory** to `/`. `wrangler` jest w `package.json` (devDependencies). |
| Budowa: błąd wersji Node | Dodaj w **Settings** → **Build** → **Build Variables and Secrets** zmienną `NODE_VERSION` = `22`. |
| `/admin/` pokazuje stronę 404 | Zmiany z `public/admin/` nie są jeszcze na `main` albo budowa się nie udała. Sprawdź **Deployments** / **Builds** w Cloudflare. |
| Dodanie domeny się nie udaje (błąd o istniejącym rekordzie) | W DNS strefy jest już wpis dla `korona` (np. CNAME). Usuń go w **DNS** → **Records** i dodaj domenę ponownie (krok 2). |
| Okno logowania pokazuje „Ta domena nie ma prawa korzystać z logowania” | `ALLOWED_ORIGIN` w `wrangler.jsonc` nie zgadza się z adresem, z którego otwierasz panel (musi być `https://korona.damianwojcicki.com`, bez ukośnika na końcu i bez `/admin`). Poprawić w pliku i wdrożyć ponownie. Panel na adresie `*.workers.dev` nie zadziała, to zamierzone. |
| „Logowanie nie jest skonfigurowane po stronie serwera” | Brak Secretów `GITHUB_CLIENT_ID` lub `GITHUB_CLIENT_SECRET` (krok 4), literówka w nazwie albo nie wykonano ponownego wdrożenia. Po budowie gałęzi podglądu sprawdź, czy sekrety nadal są na liście (następny wiersz). |
| Sekrety zniknęły po zmianie na innej gałęzi | Zgłaszano, że budowa gałęzi innych niż `main` (`wrangler versions upload`) potrafi usuwać zmienne z panelu. Wpisz sekrety ponownie. Zapobieganie: w **Settings** → **Build** wyłącz budowanie gałęzi innych niż `main` (jeśli opcja jest dostępna), gdy nie korzystasz z podglądów. |
| GitHub: „redirect_uri is not associated with this application” | **Authorization callback URL** w aplikacji OAuth musi być dokładnie `https://korona.damianwojcicki.com/api/callback`. |
| GitHub pokazuje błąd 404 na stronie `github.com/login/oauth/authorize` | Błędny **Client ID** (literówka, spacje). Wpisz Secret `GITHUB_CLIENT_ID` ponownie. |
| „Logowanie przerwane lub nieprawidłowy parametr state” | Wygasło okno logowania (limit 10 minut) albo przeglądarka blokuje ciasteczka. Spróbuj ponownie, bez blokowania ciasteczek dla tej domeny. |
| „GitHub nie wydał tokenu” | Zły lub nieaktualny **Client Secret** albo kod wygasł. Wygeneruj nowy sekret w GitHubie, zaktualizuj Secret `GITHUB_CLIENT_SECRET` i wdroż ponownie. |
| Okno logowania nie otwiera się | Przeglądarka zablokowała wyskakujące okna. Zezwól dla `korona.damianwojcicki.com`. |
| Po zalogowaniu „repo not found” / brak wpisów | Konto GitHub nie ma dostępu do repozytorium lub nazwa repozytorium w `public/admin/config.yml` jest błędna. |
| Zapis się udał, ale strona się nie zmienia | Sprawdź **Deployments** / **Builds** w Cloudflare (błąd budowy, np. niepoprawne dane wpisu). Komunikat błędu jest w logu budowy. |
| Zapis odrzucony z powodu ochrony gałęzi `main` | Jeśli włączono wymóg pull requesta na `main`, panel nie zapisze wprost. Na MVP zablokuj tylko force-push i usuwanie gałęzi (bez wymogu PR). |
| Brak skryptu statystyk na stronie | Patrz krok 5 (automatyczne wstrzykiwanie tylko dla domen przechodzących przez Cloudflare; awaryjnie ręczny fragment skryptu). |

Logi działania Workera są celowo wyłączone (`observability` w `wrangler.jsonc`), bo adres `/api/callback` zawiera jednorazowy kod z GitHuba; skrypt nie zapisuje też tokenów ani sekretów. Logi budowy: Worker → **Deployments** / **Builds**. Do diagnozy błędu logowania zwykle wystarczą komunikaty w oknie logowania (tabela wyżej).

### Gdy logowanie przez GitHub nie działa: token osobisty

Metoda awaryjna, niezależna od skryptu OAuth (dobra dla jednej osoby):

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**.
2. **Repository access**: **Only select repositories** → `ultra-w-duecie`. **Permissions** → **Contents**: **Read and write**. Ustaw krótki termin ważności (np. 30-90 dni).
3. W panelu na ekranie logowania: **Sign In with Token** → wklej token. Token zapisuje się tylko w przeglądarce.

Tokenu nigdy nie zapisuj w repozytorium ani nie wysyłaj nikomu.

## Lokalny test Workera (dla dewelopera)

Bez logowania do Cloudflare i bez kont:

1. `npm ci`, potem `npm run build` (Worker serwuje katalog `dist/`).
2. Utwórz plik `.dev.vars` w korzeniu repozytorium (jest w `.gitignore`, nie commituj go) z wymyślonymi wartościami testowymi: `GITHUB_CLIENT_ID=TestClientId123` i `GITHUB_CLIENT_SECRET=testowy-sekret`.
3. `npx wrangler dev --local --port 8787 --var ALLOWED_ORIGIN:http://127.0.0.1:8787` (przy zwykłym `npx wrangler dev` `ALLOWED_ORIGIN` to adres produkcyjny z `wrangler.jsonc`).
4. Sprawdź m.in.: `http://127.0.0.1:8787/api/auth?provider=github&site_id=127.0.0.1` (302 na `github.com/login/oauth/authorize`), `/api/callback` bez ciasteczka (`CSRF_DETECTED`), `/`, `/admin/`, `/nieistnieje` (404 ze strony 404), `/api/nieistnieje` (404).
5. Zatrzymaj serwer (Ctrl+C). Nie używaj `wrangler login`, `wrangler deploy` ani `wrangler secret put` z komputera agenta; wdrożenia robi Cloudflare z gałęzi `main`.

## Test panelu lokalnie (bez logowania do GitHuba)

Do sprawdzenia konfiguracji kolekcji (etykiety, pola, walidacja, wygląd zapisanych plików) nie potrzeba konta GitHub ani Cloudflare. Sveltia CMS ma tryb „Work with Local Repository”, w którym panel czyta i zapisuje pliki wprost w katalogu projektu (dokumentacja: https://sveltiacms.app/en/docs/workflows/local).

1. W katalogu projektu uruchom `npm run dev` (serwer Astro na porcie 4321; zostaw go włączonego).
2. W **Chrome lub Edge** (przeglądarki oparte na Chromium; Firefox i Safari nie działają, bo tryb wymaga File System Access API) otwórz `http://localhost:4321/admin/index.html`. Zalecany jest adres z `index.html`, żeby serwer potraktował panel jako zwykły plik.
3. Na ekranie logowania kliknij **Pracuj z lokalnym repozytorium** (**Work with Local Repository**) i wskaż **główny katalog projektu** (ten z `package.json` i ukrytym `.git`). Przeglądarka poprosi o zgodę na odczyt i zapis w tym katalogu; zezwól tylko dla tego katalogu.
4. W panelu widać znacznik „Lokalny”. Edytuj wpisy, biegi i autorów jak zwykle: **Zapisz** zapisuje pliki w `src/content/` (wpisy w `src/content/posts/<slug>/index.md`, biegi i autorzy jako JSON). Podgląd strony: `http://localhost:4321/`.
5. Obejrzyj zmiany poleceniem `git diff` i `git status`. Nic nie jest commitowane ani wysyłane: panel w tym trybie nie wykonuje operacji Git. Zmiany zatwierdzasz sam (commit) albo odrzucasz (`git restore src/content`; nowe pliki usuń lub `git clean -fd src/content` po sprawdzeniu, co zostanie usunięte).

Ograniczenia i uwagi:

- Tryb sprawdza obecność katalogu `.git` w wybranym folderze. W git worktree `.git` jest plikiem, więc wybór katalogu worktree może zostać odrzucony („not a repository root directory”); użyj wtedy głównego klona repozytorium.
- Po zmianie `public/admin/config.yml` oraz po pobraniu zmian z repozytorium odśwież panel (F5). Skrypt panelu ładuje się z CDN (jsDelivr) w przypiętej wersji, więc potrzebne jest połączenie z internetem.
- Tryb lokalny nie sprawdza logowania, uprawnień ani zapisu commitów na GitHubie; to testuje się dopiero na produkcji (Krok 6). Nie sprawdza też reguł łączonych ze schematu (np. co najmniej jeden wynik dla statusu „Ukończony”); wykryje je `npm run build` lub serwer `npm run dev` (komunikat o błędzie treści).
- Panel zapisuje tylko pliki wskazanego katalogu, ale ma w nim pełny zapis: nie wskazuj katalogu nadrzędnego ani całego dysku.

## Aktualizacja panelu (Sveltia CMS)

Wersja panelu jest przypięta w `public/admin/index.html` (adres z numerem wersji oraz suma kontrolna `integrity`). Bez zmiany pliku wersja się nie zmieni. Aktualizacja jest zadaniem dla agenta/dewelopera:

1. Sprawdź nową wersję i jej notatki: https://github.com/sveltia/sveltia-cms/releases (do wersji 1.0 mogą zdarzać się zmiany łamiące konfigurację).
2. Podmień numer wersji w adresie `https://cdn.jsdelivr.net/npm/@sveltia/cms@<wersja>/dist/sveltia-cms.js`.
3. Przelicz sumę: `curl -sL <adres> | openssl dgst -sha384 -binary | openssl base64 -A` i wpisz `sha384-<wynik>` w `integrity`.
4. Przetestuj na podglądzie gałęzi (logowanie działa tylko na domenie produkcyjnej, więc test zapisu wymaga tokenu osobistego) lub po scaleniu.

## Zmiany po stronie GitHuba i Cloudflare, które łamią panel

- Zmiana nazwy lub przeniesienie repozytorium: zaktualizuj `repo` w `public/admin/config.yml` i ponownie połącz repozytorium z Workerem (Worker → **Settings** → **Build**).
- Zmiana nazwy Workera: `name` w `wrangler.jsonc` musi być zgodna z nazwą w Cloudflare.
- Zmiana domeny: zmień `site` w `astro.config.mjs`, `base_url`/`site_url`/`display_url` w `public/admin/config.yml`, `ALLOWED_ORIGIN` w `wrangler.jsonc`, **Authorization callback URL** w GitHubie oraz Custom domain Workera i witrynę w Web Analytics.
- Przekazanie repozytorium do prywatnych: zakres `public_repo` przestanie wystarczać (potrzebny `repo`; zmiana w `worker/oauth.ts` i `auth_scope`).

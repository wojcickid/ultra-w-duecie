# Instrukcja: panel CMS, logowanie przez GitHub i Cloudflare Pages

Dla właściciela strony (bez doświadczenia administracyjnego). Kroki wykonujesz w przeglądarce, w panelach Cloudflare i GitHub. Nie musisz nic instalować ani wpisywać w terminalu.

Decyzja i uzasadnienie: `docs/decisions.md` (DEC-009). Opis techniczny: `docs/architecture.md`.

## Jak to działa (w skrócie)

1. Strona jest publikowana przez **Cloudflare Pages** z repozytorium GitHub `wojcickid/ultra-w-duecie` (gałąź `main`).
2. Panel edycji jest pod adresem `https://korona.damianwojcicki.com/admin/` (nie ma linku ze strony; wyszukiwarki go pomijają).
3. Panel loguje Cię przez konto **GitHub**. Zapis wpisu to zwykły commit w repozytorium; Cloudflare sam buduje i publikuje nową wersję strony (zwykle 1-2 minuty).
4. Do logowania potrzebna jest mała funkcja w Cloudflare (`/api/auth` i `/api/callback`, kod w repozytorium: `functions/`). Trzyma ona sekret aplikacji GitHub; sekret wpisujesz tylko w ustawieniach Cloudflare, nigdy w repozytorium.

Zapisać zmiany może tylko konto GitHub, które ma prawo zapisu w repozytorium. Zalogować się przez GitHub może każdy, ale bez uprawnień zapisu panel nie pozwoli niczego opublikować.

## Zanim zaczniesz

- Konto GitHub właściciela repozytorium (`wojcickid`) z włączonym uwierzytelnianiem dwuskładnikowym (2FA): GitHub → Settings → Password and authentication.
- Konto Cloudflare, w którym jest domena `damianwojcicki.com`.
- Gałąź `main` zawiera pliki `public/admin/` i `functions/` (po scaleniu zmian z zadania TASK-001). Bez tego panel nie będzie istniał.

Nazwy przycisków w panelach bywają zmieniane; jeśli się różnią, szukaj najbardziej podobnej opcji.

## Krok 1. Projekt Cloudflare Pages

1. Zaloguj się na https://dash.cloudflare.com i wybierz konto z domeną.
2. Menu po lewej: **Workers & Pages** → **Create application** → zakładka/opcja **Pages** → **Connect to Git**.
3. Wybierz **GitHub**, zaloguj się i zezwól Cloudflare na dostęp (**Install & Authorize**). Najbezpieczniej wybrać dostęp tylko do repozytorium `ultra-w-duecie`.
4. Wybierz repozytorium `wojcickid/ultra-w-duecie` → **Begin setup**.
5. Ustaw:
   - **Project name**: `ultra-w-duecie` (powstanie adres `ultra-w-duecie.pages.dev`; jeśli zajęty, wybierz inną nazwę),
   - **Production branch**: `main`,
   - **Framework preset**: `Astro`,
   - **Build command**: `npm run build`,
   - **Build output directory**: `dist`.
6. W sekcji **Environment variables (advanced)** dodaj zmienną tekstową `NODE_VERSION` o wartości `22` (projekt wymaga Node 22.12 lub nowszego; domyślnie Cloudflare używa 22.16, wpis chroni przed zmianą domyślnej).
7. **Save and Deploy**. Poczekaj na zielony status pierwszej budowy. Sprawdź, czy otwiera się `https://<nazwa>.pages.dev`.

Funkcje z katalogu `functions/` Cloudflare wykrywa sam, bez dodatkowej konfiguracji.

## Krok 2. Domena korona.damianwojcicki.com

1. Projekt Pages → zakładka **Custom domains** → **Set up a domain**.
2. Wpisz `korona.damianwojcicki.com` → **Continue** → potwierdź.
3. Domena jest w Twoim koncie Cloudflare, więc rekord DNS (CNAME) doda się automatycznie. Poczekaj, aż status zmieni się na **Active** (od kilku minut do godziny; certyfikat HTTPS wystawia się sam).
4. Sprawdź, że `https://korona.damianwojcicki.com` otwiera stronę.

Adres jest wpisany w repozytorium w `astro.config.mjs` (pole `site`) oraz w `public/admin/config.yml` (`base_url`, `site_url`, `display_url`). Jeśli zdecydujesz się na inną subdomenę, trzeba zmienić te miejsca oraz kroki 3 i 4 poniżej.

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
5. Na stronie aplikacji skopiuj **Client ID** (jawny identyfikator).
6. Kliknij **Generate a new client secret** i skopiuj **sekret** (GitHub pokaże go tylko raz; jeśli zgubisz, wygeneruj nowy).

Client ID i sekret przechowuj tylko w menedżerze haseł. Nie wklejaj ich do czatu, e-maili, repozytorium ani plików w projekcie.

## Krok 4. Zmienne środowiskowe w Cloudflare

1. Projekt Pages → **Settings** → **Variables and Secrets** (starsza nazwa: **Environment variables**) → **Add**.
2. W środowisku **Production** dodaj trzy pozycje:

   | Nazwa                 | Typ                         | Wartość                              |
   | --------------------- | --------------------------- | ------------------------------------ |
   | `GITHUB_CLIENT_ID`    | Text                        | Client ID z kroku 3                  |
   | `GITHUB_CLIENT_SECRET`| **Secret** (zaszyfrowany)   | sekret z kroku 3                     |
   | `ALLOWED_ORIGIN`      | Text                        | `https://korona.damianwojcicki.com`  |

3. **Save**. Zmienne działają dopiero po nowym wdrożeniu: zakładka **Deployments** → przy najnowszym wdrożeniu produkcyjnym **Retry deployment** (lub zrób dowolny commit na `main`).

Środowiska **Preview** nie potrzebują zmiennych (panel działa tylko na domenie produkcyjnej).

## Krok 5. Cloudflare Web Analytics (DEC-002)

1. Projekt Pages → **Metrics** → przy Web Analytics wybierz **Enable**.
2. Cloudflare doda skrypt statystyk automatycznie przy następnym wdrożeniu (nie trzeba zmieniać kodu). Bez cookies i bez baneru zgody.
3. Statystyki: menu **Web Analytics** w panelu Cloudflare → wybierz witrynę.

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
| `/admin/` pokazuje stronę 404 | Zmiany z `public/admin/` nie są jeszcze na `main` albo budowa się nie udała. Sprawdź **Deployments** w Cloudflare. |
| Okno logowania pokazuje „Ta domena nie ma prawa korzystać z logowania” | `ALLOWED_ORIGIN` nie zgadza się z adresem, z którego otwierasz panel (musi być `https://korona.damianwojcicki.com`, bez ukośnika na końcu i bez `/admin`). Poprawić i wdrożyć ponownie. Panel na adresie `*.pages.dev` nie zadziała, to zamierzone. |
| „Logowanie nie jest skonfigurowane po stronie serwera” | Brak `GITHUB_CLIENT_ID` lub `GITHUB_CLIENT_SECRET` albo nie wykonano ponownego wdrożenia po ich dodaniu (krok 4). |
| GitHub: „redirect_uri is not associated with this application” | **Authorization callback URL** w aplikacji OAuth musi być dokładnie `https://korona.damianwojcicki.com/api/callback`. |
| GitHub pokazuje błąd 404 na stronie `github.com/login/oauth/authorize` | Błędny **Client ID** (literówka, spacje). Skopiuj ponownie. |
| „Logowanie przerwane lub nieprawidłowy parametr state” | Wygasło okno logowania (limit 10 minut) albo przeglądarka blokuje ciasteczka. Spróbuj ponownie, bez blokowania ciasteczek dla tej domeny. |
| „GitHub nie wydał tokenu” | Zły lub nieaktualny **Client Secret** albo kod wygasł. Wygeneruj nowy sekret w GitHubie, zaktualizuj `GITHUB_CLIENT_SECRET`, wdroż ponownie. |
| Okno logowania nie otwiera się | Przeglądarka zablokowała wyskakujące okna. Zezwól dla `korona.damianwojcicki.com`. |
| Po zalogowaniu „repo not found” / brak wpisów | Konto GitHub nie ma dostępu do repozytorium lub nazwa repozytorium w `public/admin/config.yml` jest błędna. |
| Zapis się udał, ale strona się nie zmienia | Sprawdź **Deployments** w Cloudflare (błąd budowy, np. niepoprawne dane wpisu). Komunikat błędu jest w logu budowy. |
| Zapis odrzucony z powodu ochrony gałęzi `main` | Jeśli włączono wymóg pull requesta na `main`, panel nie zapisze wprost. Na MVP zablokuj tylko force-push i usuwanie gałęzi (bez wymogu PR). |

Logi funkcji: projekt Pages → **Functions** → **Real-time logs** (funkcje celowo nie zapisują tokenów ani sekretów).

### Gdy logowanie przez GitHub nie działa: token osobisty

Metoda awaryjna, niezależna od funkcji OAuth (dobra dla jednej osoby):

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**.
2. **Repository access**: **Only select repositories** → `ultra-w-duecie`. **Permissions** → **Contents**: **Read and write**. Ustaw krótki termin ważności (np. 30-90 dni).
3. W panelu na ekranie logowania: **Sign In with Token** → wklej token. Token zapisuje się tylko w przeglądarce.

Tokenu nigdy nie zapisuj w repozytorium ani nie wysyłaj nikomu.

## Aktualizacja panelu (Sveltia CMS)

Wersja panelu jest przypięta w `public/admin/index.html` (adres z numerem wersji oraz suma kontrolna `integrity`). Bez zmiany pliku wersja się nie zmieni. Aktualizacja jest zadaniem dla agenta/dewelopera:

1. Sprawdź nową wersję i jej notatki: https://github.com/sveltia/sveltia-cms/releases (do wersji 1.0 mogą zdarzać się zmiany łamiące konfigurację).
2. Podmień numer wersji w adresie `https://cdn.jsdelivr.net/npm/@sveltia/cms@<wersja>/dist/sveltia-cms.js`.
3. Przelicz sumę: `curl -sL <adres> | openssl dgst -sha384 -binary | openssl base64 -A` i wpisz `sha384-<wynik>` w `integrity`.
4. Przetestuj na podglądzie gałęzi (logowanie działa tylko na domenie produkcyjnej, więc test zapisu wymaga tokenu osobistego) lub po scaleniu.

## Zmiany po stronie GitHuba, które łamią panel

- Zmiana nazwy lub przeniesienie repozytorium: zaktualizuj `repo` w `public/admin/config.yml`.
- Zmiana domeny: zmień `site` w `astro.config.mjs`, `base_url`/`site_url`/`display_url` w `public/admin/config.yml`, **Authorization callback URL** w GitHubie i `ALLOWED_ORIGIN` w Cloudflare.
- Przekazanie repozytorium do prywatnych: zakres `public_repo` przestanie wystarczać (potrzebny `repo`; zmiana w `functions/_shared/oauth.ts` i `auth_scope`).

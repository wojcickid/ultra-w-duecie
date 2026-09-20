# Project Brief (do uzupełnienia przez właściciela projektu)

> Wypełnij własnymi słowami. Krótkie odpowiedzi w zupełności wystarczą.
> Nie znasz odpowiedzi? Wpisz `nie wiem` albo `zaproponuj` - agent przedstawi opcje z rekomendacją.
> Na podstawie tego pliku zostaną uzupełnione: requirements.md, architecture.md, ui.md, decisions.md oraz plan zadań w tasks/backlog/.

---

## 0. Opis projektu (swobodny)

Opisz w 1-3 akapitach, co masz w głowie: czym jest aplikacja, skąd pomysł, jak ma wyglądać jej użycie.

Chciałbym stworzyć stronę na której będę z Kumplem publikował nasze postępy w dążeniu do zdobycia Korony Ultramaratonów Polskich która została ogłoszona przez redakcję Kingrunera (https://www.kingrunner.com/) 
pomysł powsrał po przebiegnięciu wspólnie biegu rzeźnika w 2024 roku. 
Użycie to ma być strona internetowa, gdzie można będzie przejrzeć postęp poczytać wpisy na temat dązenia do korony, a ja i kumpel powinniśmy mieć dostęp do dodawania wpisów, zmiany w osi czasu postępu itd. (coś jak moderator/administrator/dziennikarz?)

<!-- TUTAJ -->


---

## 1. Cel i użytkownicy  (-> requirements.md)

**Nazwa projektu (roboczo):** Ultra w duecie

**Jaki problem rozwiązuje aplikacja?** daje miejsce gdzie mogę przedstawić swoją historę i postępy w dązeniu do celu jakim jest ukończenie 10 ultramaratonów

**Kim są użytkownicy?** Ja i kolega jako admini/moderatorzy, cały internet będzie mógł przeczytać portal

**Role i uprawnienia** (kto co może robić):

| Rola | Co może robić |
|------|---------------|
|admin|to co może admin na typowym blogu stronie www (jednocześnie ma uprawnienia moderatora)|
|moderator|moze dodawać wpisy na blogu i modyfikować informacje o ukończeniu kolejnych etapów drogi do celu|
|user|czytać wpisy i widzieć stronę -> nie wymaga logowania|

**Jak wygląda sukces?** (po czym poznasz, że wersja 1 jest gotowa)
Jak bedzie gotowa strona z wszystkimi funkcjami.

## 2. Funkcje  (-> requirements.md)

**Wersja 1 (MVP) - musi być:**
- [ ] mieć szkielet z ultramaratonami oraz informacją o tym czy ukońćzone kiedy planowane itd
- [ ] mieć panel do logowania dla moderatora i admina
- [ ] mieć bloga na którym moderator może dodawać wpisy

**Chcę mieć później (nie w pierwszej wersji):**
- sekcję z trenigami do tych ultramaratonów (bo ultramaraton to nie tylko dizeń startu ale cały cykl przygotowań) 

**Poza zakresem (czego NIE robimy):**
- nie do końća rozumiem, zaproponuj


## 3. Ograniczenia  (-> requirements.md)

- **Termin / etapy:** Brak terminu -> projekt hobbystycznty 
- **Budżet / koszty utrzymania:** -> z uwagi na hobbystyczne podejscie do projektu, nie chciał bym aby kosztem było coś wiecej niż opłacenie domeny ($11/rok na http://cloudflare.com/)
- **Wymogi prawne** (RODO, płatności, inne): brak, nie chce zbierać danych userów itp, mniej kompilacji prawnej = lepepiej
- **Integracje z zewnętrznymi systemami** (API, płatności, e-mail, SSO itp.): Jeśłi wymagane będzie logowanie to trzeba jakoś wysłać link do zmiany hasła więc chyba to, ale to minimum (jeśłi potzrebne?)
- **Istniejące dane do zaimportowania:** przebiegliśmy juz 2/10 ale to dodamy jak juz portal będzie w wersji MVP


## 4. Technologia  (-> architecture.md)

Wpisz preferencję lub `zaproponuj`.

- **Frontend** (framework/język): Zaproponuj
- **Backend** (framework/język): Zaproponuj (python?)
- **Baza danych:** z uwagi na rozmiar moze wystarczy SQLite? (zaproponuj w zależności od potrzeb)
- **Narzucone technologie lub zakazane:** nie wiem -> ma być prosto w utrzymaniu 
- **Twoje doświadczenie** (co znasz, co będziesz utrzymywać sam): Postawiłem kiedyś prostą stronnę na mikr.us z domeną na http://cloudflare.com/ ale to nic poważnego.


## 5. Logowanie i bezpieczeństwo  (-> architecture.md)

- **Czy potrzebne logowanie?** tak
- **Sposób logowania** e-mail+hasło ale tylko dla admina i moderatora (user bez logownaia)
- **Dane wrażliwe** (osobowe, płatnicze, zdrowotne - jakie?): nic nie zbieramy nie ma potrzeby
- **Wymagania dot. bezpieczeństwa:** omijajmy wszystko co wymaga z mojej strony jakichś dodatkowych nakładów pracy/środków


## 6. Wdrożenie  (-> architecture.md)

- **Gdzie ma działać?** (lokalnie, własny serwer, chmura - jaka?): dev lokalnie, prod domena http://cloudflare.com/ backend  github / mikr.us (jeśłi potrzebny VPS)
- **Liczba środowisk** (np. dev / test / prod): dev lokalnie (mam proxmoxa na lenovo M720q)
- **Spodziewana liczba użytkowników:** userów z logowaniem 2, bez logowania niewielu, kilka kilkanaście osob
- **Kopie zapasowe, monitoring, logi** (czy potrzebne): bazy wpisów i wszystkiego co nie ma w repo powinniśmy backupować 
- **Analityka / raporty** (czy potrzebne, jakie): potrzebna? GA dla takiego hobbystycznego projektu był by bezpłatny?


## 7. Interfejs  (-> ui.md)

- **Szablon lub wzór wyglądu** (repozytorium, ścieżka, link, zrzuty ekranu - wpisz też, gdzie leżą pliki): brak -> zaproponuj
- **Biblioteka komponentów / CSS** (np. Tailwind, MUI, Bootstrap) lub `zaproponuj`: zaproponuj
- **Urządzenia:** komputer i telefon  jako strona web 
- **Język interfejsu:** polski
- **Dostępność** (np. WCAG, brak wymagań): zaproponuj
- **Główne ekrany, które przychodzą Ci do głowy:** 
  - strona gówna
  - blog
  - logowanie
  - panel admina/moda


## 8. Sposób pracy agentów

- **Hosting repozytorium** (GitHub / GitLab / inne, prywatne?): GitHub
- **Czy agenci mają samodzielnie commitować?** tak / nie (nie wiem zaproponuj)
- **Czy pytać przed każdą większą decyzją, czy tylko przy kluczowych?** Przy kluczowych
- **Język dokumentacji i kodu** (komentarze, nazwy, commit messages): Polski


## 9. Otwarte pytania i wątpliwości

Wszystko, co jest niepewne albo nierozstrzygnięte:
- nie wiem czy coś jeszcze powinienem dostarczyćm, to pierwszy mój taki projekt


## 10. Materiały dodatkowe

Linki, pliki, przykłady podobnych aplikacji, które Ci się podobają (lub nie):
- https://www.kingrunner.com/artykul/korona-polskich-ultramaratonow-40/154 (opis korony)
- https://www.kingrunner.com/artykul/regulamin---korona-polskich-ultramaratonow-40/1109 (regulamin zdobycia)


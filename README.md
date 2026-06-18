# GameName – Generator Nicków Gamingowych

AI-powered generator unikalnych nicków gamingowych. Trzy style: Klasyczny, Leet i Polski.

---

## Wdrożenie na Vercel (krok po kroku)

### 1. Zainstaluj narzędzia

Potrzebujesz [Node.js](https://nodejs.org) (wersja 18+) i [Git](https://git-scm.com).

### 2. Przygotuj projekt lokalnie

```bash
cd gamename
npm install
```

Sprawdź czy działa lokalnie (bez klucza API – generowanie nie zadziała, ale strona powinna się uruchomić):

```bash
npm run dev
```

### 3. Wrzuć na GitHub

```bash
git init
git add .
git commit -m "first commit"
```

Wejdź na [github.com](https://github.com), utwórz nowe repozytorium (np. `gamename`), a potem:

```bash
git remote add origin https://github.com/TWOJ_LOGIN/gamename.git
git branch -M main
git push -u origin main
```

### 4. Połącz z Vercel

1. Wejdź na [vercel.com](https://vercel.com) i zaloguj się (możesz użyć konta GitHub)
2. Kliknij **Add New → Project**
3. Wybierz repozytorium `gamename`
4. Vercel automatycznie wykryje Vite – kliknij **Deploy**

### 5. Dodaj klucz API Anthropic

Po deployu wejdź w ustawienia projektu:

**Vercel Dashboard → Twój projekt → Settings → Environment Variables**

Dodaj zmienną:

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-...` (Twój klucz z [console.anthropic.com](https://console.anthropic.com)) |

Następnie zrób redeploy: **Deployments → ⋯ → Redeploy**

### 6. Gotowe!

Twoja aplikacja jest dostępna pod adresem `https://gamename-xxx.vercel.app` (lub własną domeną).

---

## Struktura projektu

```
gamename/
├── api/
│   └── generate.js      # Serverless proxy – ukrywa klucz API
├── src/
│   ├── main.jsx         # Punkt wejścia React
│   └── App.jsx          # Główny komponent aplikacji
├── index.html
├── vite.config.js
├── vercel.json
└── package.json
```

## Lokalne testowanie z kluczem API

Utwórz plik `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Następnie uruchom przez Vercel CLI (obsługuje funkcje serverless lokalnie):

```bash
npm install -g vercel
vercel dev
```

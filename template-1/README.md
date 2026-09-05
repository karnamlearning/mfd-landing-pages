# template-1

Next.js (App Router) + TypeScript landing-page template. The frontend stack is installed and wired; Route Handler stubs are in place for later.

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

## APIs

Route Handlers exist as empty stubs under `app/api/` for Leads, Blog, News, Calculators, Research, and KYC. **APIs will be wired later.** Backend packages (`zod`, `p-retry`, `p-timeout`, `rate-limiter-flexible`) are installed but unused for now. Native `fetch` is available in Route Handlers when those endpoints are implemented.

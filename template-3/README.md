# template-3

Next.js (App Router) + TypeScript landing page. Copy, services, and firm data match template-2 (Aarohan Wealth). The visual language is a high-contrast black / cream / lime layout.

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

Open [http://localhost:3003](http://localhost:3003).

```bash
npm run build
npm start
```

## APIs

Route Handlers exist as empty stubs under `app/api/` for Leads, Blog, News, Calculators, Research, and KYC. Calculator calls go through `/api/calc/<endpoint>` when keys are set in `.env.local`. See `.env.example`.

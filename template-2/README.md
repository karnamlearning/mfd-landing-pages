# template-2

Next.js (App Router) + TypeScript landing page. Visual language follows [Growth18](https://growth18.framer.website/); copy, services, and firm data match template-1 (Aarohan Wealth).

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

Route Handlers exist as empty stubs under `app/api/` for Leads, Blog, News, Calculators, Research, and KYC. Calculator calls go through `/api/calc/<endpoint>` when keys are set in `.env.local`. See `.env.example`.

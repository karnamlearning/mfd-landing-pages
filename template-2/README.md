# template-2

Next.js (App Router) + TypeScript landing page. Visual language follows [Injuria](https://injuria.framer.website/): cream paper, one deep forest green, Newsreader serif headlines with an italic highlight word, tiny tracked uppercase labels, near-square buttons, and hairlines instead of boxes. Copy, services, and firm data match template-1 (Aarohan Wealth). Photos are the shared Indian Unsplash set in `public/images`, shown in full colour.

Home page sections, top to bottom: hero with a stamped family portrait, a tag marquee, illustrative client outcomes over a ghosted wordmark, a promise strip with a live IST clock, the "What we handle" scroll-revealed statement and dark card carousel, client words, fund houses, a full-bleed photo band, the "Where the money goes" commission ledger, "What people ask first", the journal, and the contact form.

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

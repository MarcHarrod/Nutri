# Nutri

UK-first food literacy app. Scan a packaged food barcode and get a plain-English nutritional profile — no calorie tracking, no moral scores.

Built on Next.js 16 + Tailwind v4. Zero external APIs required out of the box.

## Quick start

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Demo barcodes

| Barcode | Product |
|---|---|
| `5000163058169` | Kellogg's Corn Flakes |
| `5010044006568` | Warburtons Wholemeal Bread |
| `4001686319284` | Haribo Starmix |
| `5038862213000` | Innocent Orange Juice |
| `5053990103649` | Pringles Original |
| `5411188119999` | Alpro Oat Drink |
| `5000168003001` | Bisto Gravy Granules |
| `5000168103013` | McVitie's Digestives |

## Switching to real data

Set `PRODUCT_PROVIDER=off` in `.env.local` to use Open Food Facts live data. No API key needed.

## Deploy

Vercel-ready. No env vars required for mock mode.

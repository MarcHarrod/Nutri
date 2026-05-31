# Nutri

A UK-first food literacy app. Scan a packaged food barcode and get a plain-English explanation of the nutritional profile — no calorie tracking, no moral scores, just useful context.

Built on Next.js 16 (App Router) + Tailwind v4. Zero external APIs required out of the box; real Open Food Facts data is one env-var flip away.

## Quick start

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app opens directly to the scanner.

## Demo barcodes (mock mode)

| Barcode | Product |
|---|---|
| `5000163058169` | Kellogg's Corn Flakes |
| `5010044006568` | Warburtons Wholemeal Bread |
| `4001686319284` | Haribo Starmix |
| `5038862213000` | Innocent Smooth Orange Juice |
| `5053990103649` | Pringles Original |
| `5411188119999` | Alpro Oat Drink |
| `5000168003001` | Bisto Original Gravy Granules |
| `5000168103013` | McVitie's Digestive Biscuits |

## Switching to real data

Set `PRODUCT_PROVIDER=off` in `.env.local`. The app will query Open Food Facts for every barcode scan. No API key needed — just set a descriptive `OFF_USER_AGENT`.

```
PRODUCT_PROVIDER=off
OFF_USER_AGENT=Nutri/0.1 (hello@example.com)
```

Open Food Facts covers the vast majority of UK supermarket products. Check coverage for specific categories before relying on it in production.

## Project layout

```
app/
  (app)/             mobile-first routes (bottom nav)
    scan/            barcode scanner
    result/          product analysis
    history/         recent scans (localStorage)
    compare/         two-product comparison
  api/
    lookup/          GET ?barcode= → ProductAnalysis JSON
    compare/         GET ?a=&b= → CompareResult JSON
    report/          POST → flag incorrect data

lib/
  types.ts           domain types
  utils.ts
  analysis/          nutrition analysis engine
    nutrients.ts     UK FSA traffic-light thresholds
    ingredients.ts   ingredient flag patterns + plain-English explanations
    index.ts         analyseProduct()
  product/           ProductProvider interface + providers
    providers/mock.ts
    providers/open-food-facts.ts

components/
  scanner-view.tsx   camera + ZXing barcode reader + manual entry
  product-result.tsx full result screen
  compare-panel.tsx  side-by-side nutrient comparison
  nutrient-bar.tsx   traffic-light bar with reference %
  ingredient-flag.tsx expandable ingredient flag item
  confidence-badge.tsx
  bottom-nav.tsx
  ...

mocks/
  products.ts        8 realistic UK products for development

supabase/
  migrations/        optional: scan_history + reports tables
```

## Tech

- Next.js 16 (App Router) + TypeScript + Tailwind v4
- `@zxing/browser` for barcode scanning via camera
- `sonner` for toasts
- `lucide-react` for icons
- Recent scan history stored in `localStorage`

## Key design choices

- **UK FSA traffic-light thresholds** applied per 100g: fat (>3g amber, >17.5g red), saturated fat (>1.5g / >5g), sugars (>5g / >22.5g), salt (>0.3g / >1.5g)
- **Balanced language**: no shaming, no absolute "good/bad" verdicts, all watch-outs come with UK NHS/FSA context
- **Prefer uncertainty**: confidence badge clearly shows when data is partial or OCR-derived
- **No auth required**: scan history is local-only; no personal data leaves the device

## Out of scope (MVP)

Calorie tracking, diet plans, medical advice, allergy safety guarantees, restaurant meals, fresh/unpackaged food, supplements. See PRD for full non-goals.

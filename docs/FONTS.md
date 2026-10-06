# Typography & Heading System Documentation

## Overview
KaushalYuva uses a high-efficiency dual typography system designed for government-grade executive clarity and zero layout shift (CLS < 0.02).

## Active Font Stack
| Role | Typeface | Source | Variable | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Display / Headings** | **Barlow Condensed** (Weights 600, 700) | `next/font/google` | `--font-display` | **Active Today (Free OFL Fallback)** |
| **Commercial Upgrade** | **Trade Gothic Next Condensed (Bold)** | Self-hosted or Adobe Fonts Kit | `--font-display` | Documented Drop-in Replacement |
| **UI & Body (Latin)** | **Inter** (Weights 400, 500, 600, 700) | `next/font/google` | `--font-sans` | Active |
| **Numerical & Codes** | **JetBrains Mono** | `next/font/google` | `--font-mono` | Active |
| **Hindi UI & Body** | **Noto Sans Devanagari** (Weights 400, 500, 600, 700, 800) | `next/font/google` | `--font-hi` / `--font-deva-display` | Active |

## How to Switch to Licensed Trade Gothic Next
When licensed woff2 files are acquired:
1. Place `TradeGothicNextCondensed-Bold.woff2` in `frontend/public/fonts/trade-gothic/`.
2. In `frontend/src/fonts/display.ts`, replace `Barlow_Condensed` with `next/font/local`:
```ts
import localFont from 'next/font/local';

export const displayFont = localFont({
  src: [
    {
      path: '../../public/fonts/trade-gothic/TradeGothicNextCondensed-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-display',
  display: 'swap',
  preload: true,
});
```
3. Alternatively via Adobe Fonts kit ID:
Set `NEXT_PUBLIC_ADOBE_KIT_ID` in `.env.local` and load `<link rel="stylesheet" href="https://use.typekit.net/YOUR_ID.css">`.
The rest of the application references `--font-display-stack`, ensuring zero code modifications.

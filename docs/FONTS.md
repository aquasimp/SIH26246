# Typography & Visual Identity Font System Documentation

## Overview
KaushalYuva utilizes a unified "Liquid-Glass Civic Instrument" typography system designed for government-grade executive authority, multilingual legibility, and zero layout shift (CLS < 0.02).

## Active Font Stack
| Role | Typeface | Source | CSS Variable | Weights & Config | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Voice** | **Instrument Sans** | `next/font/google` | `--font-display` | 500, 600, 700 (preload: true) | Authoritative civic headlines (`.hero-bold-title`, `.page-title-editorial`, `.section-title-editorial`). Tight tracking (-0.02em to -0.03em) on display sizes. |
| **Editorial Accent** | **Instrument Serif** | `next/font/google` | `--font-serif` | 400 Italic (preload: false) | Restrained editorial italic accent (`.title-serif-italic`, `.hero-title-highlight`) inheriting body/heading colors with 92% opacity. |
| **UI & Body (Latin)** | **Plus Jakarta Sans** | `next/font/google` | `--font-sans` | 400, 500, 600, 700 (preload: true) | High-legibility UI controls, cards, descriptive paragraphs, and navigation. |
| **Data & Codes** | **JetBrains Mono** | `next/font/google` | `--font-mono` | 400, 500, 600 (preload: true) | Exclusively for telemetry, numbers, NCO/district codes, tabular figures, and chart axis scales. |
| **Devanagari Headings (hi, mr)** | **Khand** | `next/font/google` | `--font-khand` | 600, 700 (preload: false) | Architectural, condensed Devanagari display headings with crisp contrast. |
| **Devanagari Body (hi, mr)** | **Noto Sans Devanagari** | `next/font/google` | `--font-noto-devanagari` | 400, 500, 600, 700 (preload: false) | Natural conjunct rendering, line-height 1.65, zero clipping. |
| **Tamil (ta)** | **Noto Sans Tamil** | `next/font/google` | `--font-ta` | 400, 600 (preload: false) | High-fidelity Tamil script rendering under `:lang(ta)`. |
| **Telugu (te)** | **Noto Sans Telugu** | `next/font/google` | `--font-te` | 400, 600 (preload: false) | Natural Telugu curvature and conjunct spacing under `:lang(te)`. |
| **Kannada (kn)** | **Noto Sans Kannada** | `next/font/google` | `--font-kn` | 400, 600 (preload: false) | Precise Kannada character rendering under `:lang(kn)`. |
| **Bengali (bn)** | **Noto Sans Bengali** | `next/font/google` | `--font-bn` | 400, 600 (preload: false) | Authentic Bengali vowel signs and matra alignment under `:lang(bn)`. |

## Indic Typography Guards & Rules
- All non-English locales (`hi`, `mr`, `ta`, `te`, `kn`, `bn`) automatically enforce:
  - `text-transform: none !important;` (prohibits synthetic uppercase)
  - `letter-spacing: normal !important;` (prevents glyph disjointing)
  - `font-synthesis: none;` (prohibits fake italic/oblique distortions)
  - Eyebrows and table headers scale to ≥ 12.5px with `line-height: 1.35–1.7` to prevent conjunct and vowel mark clipping.
  - `.title-serif-italic` automatically falls back to normal style and script-native fonts under non-English locales where serif italic glyphs do not exist.

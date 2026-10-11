# KaushalYuva (कौशलयुवा) — Frontend Application
### Enterprise Liquid-Glass Intelligence Platform for MSDE (SIH 2026 | PS 26246)

[![Live Platform](https://img.shields.io/badge/Live_Platform-kaushalyuva.vercel.app-00c2cb?style=for-the-badge&logo=vercel&logoColor=white)](https://kaushalyuva.vercel.app/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16_App_Router-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4_CSS-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

**Live Production URL:** [https://kaushalyuva.vercel.app/](https://kaushalyuva.vercel.app/)  
**Main System Repository:** [https://github.com/aquasimp/SIH26246](https://github.com/aquasimp/SIH26246)

---

## 🏛️ Overview

The **KaushalYuva Frontend** is an enterprise-grade national decision-support interface built for the **Ministry of Skill Development and Entrepreneurship (MSDE)**, State Skill Development Missions (SSDMs), and District Skill Committees (DSCs).

### Key Architectural Capabilities:
- **Next.js 16 App Router:** High-performance React server and client components across 31 purpose-built routes.
- **Liquid-Glass Design System:** Ultra-modern government UI with high-contrast tokens, WCAG AA compliance, and native Dark/Light mode switching.
- **100% Bilingual Localization (English & Hindi):** Instant client-side language switching across all metric cards, tables, charts, and policy briefs.
- **Dual-Mode Data Proxy (`apiProxy`):** Automatically routes to live Python FastAPI backend on port 8000, seamlessly falling back to deterministic local fixtures with visible provenance badges if the analytical engine is offline.
- **Interactive Visualizations:** Custom SVG and Canvas choropleth maps of India, forecast uncertainty bands (80%/95% coverage), and Treemap gap distribution charts.
- **Evidence Drawer & Kaushal Copilot:** Audited, grounded explainable AI assistant providing citations from government NCO and LGD databases.

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Verification:
```bash
# Verify static and dynamic compilation
npm run build

# Start production server
npm run start
```

### End-to-End Test Suite:
```bash
# Run Playwright E2E and visual accessibility audit
npm run test:e2e
```

---

## 📁 Frontend Directory Structure

```tree
frontend/
├── messages/               # Bilingual dictionaries (en.json, hi.json, hi.reference.json)
├── public/                 # Static assets, vector icons, logo.png
├── src/
│   ├── app/                # Next.js App Router (31 pages & API proxy handlers)
│   │   ├── overview/       # National intelligence dashboard
│   │   ├── forecasts/      # 3M/6M/12M rolling forecast explorer
│   │   ├── gaps/           # Trade shortage/oversupply analyzer
│   │   ├── scenarios/      # Interactive Scenario Studio & LP Solver
│   │   ├── methodology/    # Mathematical formula & provenance dossier
│   │   └── api/            # REST API interactive documentation & exports
│   ├── components/         # Reusable atomic UI components
│   │   ├── common/         # KPI cards, badges, provenance indicators
│   │   ├── glass/          # Liquid glass containers, buttons, cards
│   │   ├── layout/         # AppShell, Header, Sidebar, Navigation
│   │   ├── maps/           # India choropleth intelligence maps
│   │   └── modals/         # Evidence Drawer, Kaushal Copilot modal
│   └── lib/                # Store (Zustand/Context), API proxy, i18n, types
├── package.json
└── tsconfig.json
```

---

For complete backend configuration, machine learning models, and linear programming solver specifications, see the root [README.md](../README.md).

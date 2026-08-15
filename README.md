# Nigerian Women in the UK (NWUK) — Community & Enterprise Platform

A community, event ticketing, and multi-channel advertising platform built for the **Nigerian Women in the UK (NWUK)** diaspora network. It unites UK-based Nigerian professionals, entrepreneurs, students, and community leaders with event bookings, multi-platform classified broadcasts (WhatsApp, Facebook, Telegram, Email), a verified business directory, AI-powered diaspora spotlights, and an in-app moderation workflow.

This repository is a full implementation of that platform as a self-contained full-stack app (React + Express).

---

## ✨ Features

- **🎟️ Event booking & digital passes** — Browse galas, high-tea meetups, career masterclasses and international retreats across London, Manchester, Birmingham, Leeds and Edinburgh. Book multiple guests with individual dietary preferences, then get a digital pass with a check-in QR code, a printable/Save-as-PDF pass, and `.ics` calendar sync.
- **📢 Multi-channel advertising** — Tiered ad packages (Standard WhatsApp £15, Featured Multi-Channel £35, Elite Community Partner £65) with a live preview card and automatic ASA-compliance checks.
- **🛡️ Admin moderation portal** — Approve (with a confetti broadcast), request revision (with feedback delivered to the member's inbox), or reject ads. Live metrics for ad revenue, broadcast reach and the pending queue.
- **🤖 AI diaspora spotlights** — `POST /api/stories/generate` generates uplifting career spotlights via Google Gemini, with rich curated fallbacks so the UI never breaks when no API key is present.
- **🏢 Verified business directory** — Search and filter diaspora businesses by category and city, see verified badges, and submit star reviews.
- **💳 Member wallet & inbox** — Top up via simulated UK debit card / Apple Pay / bank transfer; balances are deducted for bookings and ads. A transactional in-app inbox delivers receipts, QR passes, and moderation notices with an unread badge.
- **📖 Help & FAQ + editorial guidelines** — Searchable FAQ accordion and ASA-compliant advertising rules.

State is persisted client-side in `localStorage`, so bookings, ads, wallet and inbox survive reloads.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite 6 |
| **Styling** | Tailwind CSS v4, Playfair Display & Plus Jakarta Sans |
| **Icons & animation** | Lucide React, dependency-free confetti & motion helpers |
| **Backend** | Node.js, Express 4.21, Vite dev middleware |
| **AI** | `@google/genai` (Gemini) with structured JSON output + graceful fallback |
| **Persistence** | React state synchronized to `localStorage` |
| **Build** | Vite (client) + `esbuild` (standalone CJS server bundle) |

---

## 📁 Project Structure

```
.
├── server.ts                     # Express server + Gemini story endpoint + Vite middleware
├── index.html                    # HTML template with Google Fonts
├── vite.config.ts                # Vite + Tailwind plugin
├── scripts/build-server.mjs      # esbuild bundling for the production server
├── metadata.json                 # App capabilities & configuration
└── src/
    ├── main.tsx                  # React DOM entry point
    ├── App.tsx                   # Layout, tab router & modal container
    ├── index.css                 # Tailwind theme & global styles
    ├── types/index.ts            # Shared TypeScript interfaces
    ├── context/CommunityContext.tsx   # Global state (user, events, ads, wallet, inbox, reviews)
    ├── data/initialData.ts       # Events, ad tiers, guidelines, FAQs
    ├── data/membersData.ts       # Verified business profiles
    ├── utils/ticketPdfGenerator.ts    # QR, printable HTML/PDF pass & .ics generator
    └── components/               # Navbar, Hero, Events, Ads, Directory, Admin, modals, …
```

---

## 💻 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Install & run
```bash
npm install
npm run dev
```
The app runs at **http://localhost:3000** (Express serving the Vite dev middleware).

> Tip: sign in and toggle **"Sign in as moderator"** to unlock the Admin tab.

### Environment variables

Create a `.env` file (see `.env.example`):

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

| Variable | Description | Required |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini key for AI spotlights. Without it, curated fallbacks are used. | No |
| `PORT` | Server port (default `3000`). | No |

---

## 📦 Production Build & Deployment

```bash
npm run build     # type-check + Vite client build + esbuild server bundle
npm run start     # NODE_ENV=production node dist/server.cjs
```

- Client static assets → `dist/`
- Standalone server bundle → `dist/server.cjs`
- Listens on `0.0.0.0:3000` — container / Cloud Run ready.

---

## 📜 License

Created for the **Nigerian Women in the UK (NWUK)** sisterhood and diaspora community.

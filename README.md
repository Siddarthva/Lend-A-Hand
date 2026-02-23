# Lend-A-Hand 🤝

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react">
  <img src="https://img.shields.io/badge/Vite-7-646cff?style=flat-square&logo=vite">
  <img src="https://img.shields.io/badge/TailwindCSS-4-38bdf8?style=flat-square&logo=tailwindcss">
  <img src="https://img.shields.io/badge/Status-MVP-orange?style=flat-square">
</p>

> A modern home-services marketplace connecting homeowners with trusted local professionals — think booking a cleaner, plumber, or gardener as easily as ordering food.

---

## Features

- **Service Discovery** — Browse and search across categories (Cleaning, Plumbing, Gardening, Electrical, Beauty)
- **Service Detail Pages** — View provider info, ratings, reviews, pricing, and real-time availability slots
- **Smart Booking Flow** — Pick a date & time slot with conflict detection (busy slots are grayed out)
- **User Dashboard** — Track upcoming and past bookings with live status badges
- **Favorites** — Save services for quick access later
- **Messaging / Chat** — Real-time-like chat interface with service providers
- **Auth System** — Login / Register with mock authentication and session persistence via `localStorage`
- **Provider Onboarding** — Modal-based flow for professionals to join the platform
- **Customizable Themes** — 5 accent color themes (Indigo, Rose, Teal, Orange, Violet) + Dark mode
- **Toast Notifications** — Contextual feedback for all user actions
- **Informational Pages** — About, Founder, Open Source, Privacy Policy, Terms of Service
- **SEO-ready** — Structured JSON-LD schema markup baked in

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| State Management | React Context API |
| Routing | Custom in-app router (no external library) |
| Persistence | `localStorage` |
| Data | Mock data (no backend) |

---

## Project Structure

```
Lend-A-Hand/
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Entire app — components, pages, state, routing
│   │   ├── Pages/
│   │   │   └── chatpage.jsx # Standalone chat page
│   │   ├── components/
│   │   │   └── ui/          # Shared UI primitives
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## Getting Started

```bash
# 1. Install dependencies
cd frontend
npm install

# 2. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

**Demo credentials** (any of these work):
| Email | Password |
|---|---|
| `user@demo.com` | `password` |
| *(any email)* | *(any password)* |

> The auth layer is mocked — no real validation occurs.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

---

## Notes

- This is a **portfolio/MVP project** — all data is mocked, there is no backend or real payment processing.
- Bookings, favorites, and theme preferences persist across sessions via `localStorage`.
- The app is structured as a single-file SPA (`App.jsx`) for simplicity at MVP stage.

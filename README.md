# IC-IITP Website Redesign

A complete ground-up redesign and rebuild of the official website for the **Innovation Centre, IIT Patna**. The project replaces the existing static site with a modern, performant, and fully internationalized web application.

---

## Demo

<!-- 
  To embed the video:
  1. Open a new GitHub Issue on this repo
  2. Drag-and-drop the demo .mp4 into the comment box
  3. Wait for the upload to complete and copy the generated URL
  4. Replace the URL below (do NOT submit the issue)
-->

https://github.com/user-attachments/assets/REPLACE_WITH_UPLOADED_VIDEO_URL

---

## Overview

The redesign covers the full public-facing website along with a protected admin panel. It is built with the Next.js App Router, supports English and Hindi via `next-intl`, and features a particle-based 3D hero, animated section reveals, full-text search, and server-side session authentication.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| 3D / WebGL | Three.js, React Three Fiber, Drei |
| Internationalisation | next-intl (en, hi) |
| Search | MiniSearch |
| Auth | iron-session |
| External APIs | Google APIs |

---

## Features

- **Bilingual support** — full English and Hindi translations across all pages
- **3D particle hero** — interactive WebGL scene rendered with Three.js and React Three Fiber
- **Animated reveals** — scroll-triggered entrance animations via Framer Motion
- **Full-text search** — client-side search powered by MiniSearch
- **Admin panel** — protected dashboard with session-based authentication
- **Lab & facilities pages** — photo gallery, specification tables, and equipment listings
- **Programs & startups** — dedicated pages for academic programs, incubated startups, and portfolio companies
- **Events & notifications** — dynamic event listings and a notification system
- **Downloadable resources** — structured downloads page with categorised files
- **Responsive design** — mobile-first layout across all breakpoints
- **Accessibility** — semantic HTML, keyboard navigation, ARIA attributes

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing page with hero, stats, and highlights |
| `/about` | Institute overview and team roster |
| `/programs` | Academic and incubation programs |
| `/facilities` | Lab specifications and photo gallery |
| `/portfolio` | Startups and ventures |
| `/events` | Events listing |
| `/downloads` | Downloadable documents and resources |
| `/notifications` | Announcements |
| `/policies` | Institutional policies |
| `/contact` | Contact form and details |
| `/search` | Full-text search across the site |
| `/admin` | Protected admin dashboard |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/medhxnsh/iciitp-websit.git
cd iciitp-websit
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

---

## Project Structure

```
.
├── app/
│   ├── [locale]/          # Internationalised public routes
│   │   ├── about/
│   │   ├── programs/
│   │   ├── facilities/
│   │   ├── events/
│   │   ├── downloads/
│   │   ├── search/
│   │   └── ...
│   └── admin/             # Protected admin panel
├── components/            # Shared UI components
├── content/               # Static content and data files
├── data/                  # Structured data (programs, team, etc.)
├── i18n/                  # next-intl configuration
├── messages/              # Translation files (en.json, hi.json)
├── lib/                   # Utility functions and helpers
└── public/                # Static assets
```

---

## License

This project is proprietary. All rights reserved — Innovation Centre, IIT Patna.

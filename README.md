# ABG Friend Finder

ABG (Asian Baddie Girl) Friend Finder is a mobile-first social discovery app for finding your vibe tribe. Swipe through profiles, connect social feeds from Instagram, TikTok, X, and Facebook, and rate baddies using snack-themed flavor meters.

## Features

- **Discover** — Swipe to like, pass, or super-like ABG profiles with compatibility scores and shared vibe matching
- **The Sauce** — See which social platform each baddie was spotted on (TikTok FYP, Instagram Explore, X, Facebook)
- **Social Feed** — Aggregated cross-platform feed with per-platform filters
- **Matches** — View mutual connections ranked by vibe compatibility
- **Connect** — Link Instagram, Facebook, X, and TikTok via OAuth (demo mode works without API keys)
- **Snack Flavor Ratings** — Rate profiles on three dimensions:
  - 🧋 **Bubble Tea** → Sweetness (Unsweetened → Diabetic Coma Sweet)
  - 🍜 **Ramen** → Spiciness (Mild → Nuclear Bell Pepper Korean Overload Spicy)
  - 🍵 **Matcha** → Unique Flavor (Basic → Once-in-a-Lifetime Unicorn)

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, Vite, React Router, Zustand |
| Backend | Express 5, better-sqlite3 |
| Language | TypeScript |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
cd abg-friend-finder
npm install
```

### Seed the database

```bash
npm run db:seed
```

Seeds 8 demo profiles with social “sauce” metadata, 12 feed posts, and community flavor ratings.

### Development

```bash
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5174 |
| API | http://localhost:3003 |

### Production build

```bash
npm run build
npm start
```

Serves the built frontend and API from port `3003` (configurable via `PORT`).

## Environment Variables

Copy `.env.example` to `.env` and fill in credentials for live OAuth:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `PORT` | API server port (default `3003`) |
| `APP_URL` | Frontend URL for OAuth redirects |
| `API_URL` | Backend URL |
| `META_APP_ID` / `META_APP_SECRET` | Facebook & Instagram OAuth |
| `X_CLIENT_ID` / `X_CLIENT_SECRET` | X (Twitter) OAuth |
| `TIKTOK_CLIENT_KEY` / `TIKTOK_CLIENT_SECRET` | TikTok OAuth |

Without API keys, the **Connect** tab uses demo mode to simulate linked accounts.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/discover` | List discoverable profiles |
| `GET` | `/api/discover/:id` | Profile detail |
| `POST` | `/api/swipes` | Like, pass, or super-like |
| `GET` | `/api/matches` | List matches |
| `GET` | `/api/feed` | Aggregated social feed |
| `GET` | `/api/flavors/dimensions` | Flavor rating scales |
| `GET` | `/api/flavors/:id` | Profile flavor ratings |
| `POST` | `/api/flavors` | Submit a flavor rating |
| `GET` | `/api/auth/status` | Connected account status |

## Project Structure

```
abg-friend-finder/
├── src/                  # React frontend
│   ├── api/              # API client modules
│   ├── components/       # UI components
│   ├── pages/            # Route pages
│   └── types/            # Shared TypeScript types
├── server/
│   ├── src/
│   │   ├── routes/       # Express route handlers
│   │   ├── services/     # Business logic
│   │   └── seed/         # Demo data
│   └── data/             # SQLite database (gitignored)
├── public/               # Static assets
└── dist/                 # Production build output
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend + API in watch mode |
| `npm run build` | Build client and server for production |
| `npm start` | Run production server |
| `npm run db:seed` | Seed SQLite with demo data |
| `npm run preview` | Preview production frontend build |

## License

[MIT](LICENSE)
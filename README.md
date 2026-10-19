# Top Chess ♟️

**Track the world's best chess players.** Live ratings, rankings, rating history, and player bios, all in one clean app.

Top Chess is a monorepo containing the iOS app, the website and API that powers it, and the shared database package.

> No clutter. No noise. Just rankings, ratings, and the players behind them.

## Repository Structure

```
.
├── apps
│   ├── mobile     # Expo app (Top Chess)
│   └── web        # Next.js website, API, and admin dashboard
└── packages
    └── db         # Shared database setup (Drizzle ORM + Neon)
```

| Folder | Description |
| --- | --- |
| [`apps/mobile`](./apps/mobile) | The Top Chess mobile app, built with Expo. Browse world rankings, player profiles, rating history, and search for players. |
| [`apps/web`](./apps/web) | The Next.js site that acts as the API for the app. It also hosts the Privacy Policy and Support pages required by the iOS App Store, plus an admin dashboard for viewing and updating data. |
| [`packages/db`](./packages/db) | Shared database package with the Drizzle schema, client, and migrations for the Neon database. |

## How It Fits Together

```
2700chess API / Browserbase
          │
          ▼
  Cron route (apps/web)  ◄──  Upstash QStash (schedule)
          │
          ▼
 Neon Postgres (packages/db)
          │
          ├──► API routes (apps/web) ──► Mobile app (apps/mobile)
          └──► Admin dashboard (apps/web)
```

1. Upstash QStash calls a cron route in the website on a schedule.
2. The route pulls fresh player data and stores it in Neon through `packages/db`.
3. The mobile app fetches ratings, rankings, and history from the website's API.
4. Admins can log in to the dashboard to view and edit data directly.

## Tech Stack

- [Expo](https://expo.dev/)
- [Next.js](https://nextjs.org/)
- [Neon](https://neon.tech/) (serverless Postgres)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Vercel](https://vercel.com/) (deployment)
- [Upstash QStash](https://upstash.com/docs/qstash) (scheduled cron calls)
- [Browserbase](https://www.browserbase.com/)
- [2700chess](https://2700chess.com/) API

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- A [Neon](https://neon.tech/) database
- An [Upstash](https://upstash.com/) account with QStash enabled
- A [Browserbase](https://www.browserbase.com/) account

### 1. Install dependencies

```bash
npm install
```

### 2. Set up the database

Add your Neon connection string and push the schema. See the [`packages/db` README](./packages/db/README.md).

### 3. Run the website and API

```bash
cd apps/web
npm run dev
```

See the [`apps/web` README](./apps/web/README.md) for environment variables and cron setup.

### 4. Run the mobile app

```bash
cd apps/mobile
npx expo start
```

Point the app at your local API by setting `EXPO_PUBLIC_API_URL`. See the [`apps/mobile` README](./apps/mobile/README.md).

## Deployment

- **Website and API:** deployed on Vercel from `apps/web`
- **Mobile app:** built and submitted to the App Store with [EAS](https://docs.expo.dev/eas/)

## Documentation

- [Mobile app](./apps/mobile/README.md)
- [Website and API](./apps/web/README.md)
- [Database package](./packages/db/README.md)
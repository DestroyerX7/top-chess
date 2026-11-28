# Top Chess Web

The Next.js website for the **Top Chess** iOS app. It serves several roles:

- **API for the app**: provides the player, rating, ranking, and rating history data used by the Expo app
- **App Store pages**: hosts the Privacy Policy and Support pages required for the iOS App Store
- **Admin dashboard**: lets admins log in to view and update data in the database
- **Scheduled data updates**: a cron route, triggered by Upstash QStash, keeps the database data fresh

## Tech Stack

- [Next.js](https://nextjs.org/)
- [Neon](https://neon.tech/) (serverless Postgres)
- [Drizzle ORM](https://orm.drizzle.team/) (schema and setup live in the shared [`packages/db`](../../packages/db) package)
- [Upstash QStash](https://upstash.com/docs/qstash) (scheduled cron calls)
- [Browserbase](https://www.browserbase.com/) (browser automation)
- [2700chess](https://2700chess.com/) API (rating and ranking data)
- [Vercel](https://vercel.com/) (hosting and deployment)

## How It Works

```
2700chess API / Browserbase
          │
          ▼
  Cron route (/api/cron/...)  ◄──  Upstash QStash (schedule)
          │
          ▼
 Neon Postgres (via Drizzle)
          │
          ├──► Public API routes ──► Top Chess Expo app
          └──► Admin dashboard (login required)
```

1. QStash calls the cron route on a schedule.
2. The route pulls fresh player data and writes it to the Neon database through the shared `packages/db` package.
3. The Expo app reads from the public API routes.
4. Admins can log in to the dashboard to view and edit data manually.

## Pages

| Route      | Description                                 |
| ---------- | ------------------------------------------- |
| `/privacy` | Privacy Policy (required for the App Store) |
| `/support` | Support page (required for the App Store)   |
| `/admin`   | Admin dashboard (login required)            |
| `/api/*`   | API routes used by the mobile app           |

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- A [Neon](https://neon.tech/) database
- An [Upstash](https://upstash.com/) account with QStash enabled
- A [Browserbase](https://www.browserbase.com/) account

### Installation

```bash
cd apps/web
npm install
```

### Environment Variables

Create a `.env.local` file in the `apps/web` directory:

```bash
# Database
NEON_DATABASE_URL=

# Browserbase
BROWSERBASE_API_KEY=

# Admin auth
JWT_SECRET=
HASHED_ADMIN_PASSWORD=

CRON_SECRET=

NEXT_PUBLIC_BASE_URL=
```

### Database

All database setup (Drizzle schema, client, and migrations) lives in the separate [`packages/db`](../../packages/db/) package, so this site doesn't define its own schema. Set up the database from there first. See the [`packages/db` README](../../packages/db/README.md) for details.

### Run Locally

```bash
npm run dev
```

The site will be available at [http://localhost:3000](http://localhost:3000).

## Cron Updates

Database updates are triggered by a cron route that **Upstash QStash** calls on a schedule. Requests to this route should be verified with the QStash signing keys so only QStash can trigger it.

To set it up:

1. Deploy the site to Vercel.
2. In the Upstash console, create a QStash schedule pointing at your deployed cron route URL.
3. Choose how often it should run (for example, daily).

## Deployment

The site is deployed on [Vercel](https://vercel.com/). Add the environment variables above in your Vercel project settings, then push to your main branch to deploy.

## Related

- **Database package:** see [`packages/db`](../../packages/db/)
- **Mobile app:** see the [Expo app](../mobile)

# Top Chess ♟️

**Track the world's best chess players.** Live ratings, rankings, rating history, and player bios, all in one clean app.

Top Chess puts the world's elite chess players at your fingertips. Browse a constantly updated leaderboard of the highest-rated players on the planet, and see exactly where each player stands and how they got there.

Whether you're following your favorite grandmaster, scouting up-and-coming talent, or just curious who's #1 right now, Top Chess gives you a fast, clean way to follow the competitive chess world.

> No clutter. No noise. Just rankings, ratings, and the players behind them.

## Features

- **World Rankings**: Browse top-rated players ranked by current rating
- **Player Profiles**: Tap any player for a detailed breakdown of their rating, world rank, and biography
- **Rating & Rank Changes**: See how a player's rating and ranking have shifted over time
- **Rating History**: Explore a player's full rating trajectory with historical data
- **Player Search**: Quickly find any player by name

## Tech Stack

- [Expo](https://expo.dev/) (React Native)
- Data served by the companion [Next.js API](../web)

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm, yarn, or pnpm
- [Expo Go](https://expo.dev/go) on your device, or an iOS Simulator / Android Emulator

### Installation

```bash
cd apps/mobile
npm install
```

### Configuration

Create a `.env` file in the `apps/mobile` directory and point the app at the API:

```bash
EXPO_PUBLIC_API_URL=http://localhost:3000
```

For production builds, set this to your deployed Next.js website URL.

### Run the app

```bash
npx expo start
```

Then press `i` for the iOS Simulator, `a` for the Android Emulator, or scan the QR code with Expo Go.

## Building for Release

This project can be built and submitted with [EAS](https://docs.expo.dev/eas/):

```bash
npx eas build --platform ios
npx eas submit --platform ios
```

## Related

- **API, Privacy Policy, and Support pages:** see the [Next.js website](../web)

## Download

Download Top Chess and stay on top of the game.

# Free Games Tracker
HEAD


Track free game giveaways and subscription game drops from:

- Epic Games Store
- Steam
- PlayStation Plus
- GG.deals
- IsThereAnyDeal

## What It Does

- Shows games that are free now
- Shows upcoming offers
- Shows ended offers
- Displays offer start and end dates
- Separates subscription offers from true free giveaways
- Deduplicates the same game across multiple sources

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Jest
548ed01 (feat: harden free games tracker and improve repo readiness)

A web app for tracking free game giveaways and subscription game drops from multiple platforms in one place.

HEAD
## Overview

Free Games Tracker collects and normalizes game offers from:

- Epic Games Store
- Steam
- PlayStation Plus
- GG.deals
- IsThereAnyDeal

The app is designed to help users quickly see:

- which games are free right now
- which offers are coming soon
- which offers have already ended
- when each offer starts and ends

It also clearly separates true free giveaways and 100% discount offers from subscription-included games such as PlayStation Plus.

## Features

- Aggregate free game offers from multiple sources
- Show offer status:
  - Active
  - Upcoming
  - Ended
- Show start date and end date for each listing
- Separate subscription-based offers from true free giveaways
- Deduplicate overlapping offers across sources
- Preserve source/store links for each listing
- Highlight ending soon offers
- Highlight upcoming offers
- Manual sync endpoint for refreshing data

## Supported Sources

- **Epic Games Store**
  - Tracks free promotions and giveaway windows
- **Steam**
  - Tracks free promotions and free-to-keep offers when available
- **PlayStation Plus**
  - Tracks subscription-included monthly titles
- **GG.deals**
  - Tracks free and discounted game listings
- **IsThereAnyDeal**
  - Tracks deal aggregation and giveaway-related listings

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Jest

## Project Structure

```text
src/
  app/
    api/sync/route.ts
    page.tsx
    layout.tsx
  components/
    FilterBar.tsx
    GameCard.tsx
    SyncButton.tsx
  lib/
    adapters/
      epic.ts
      steam.ts
      playstation.ts
      ggdeals.ts
      isthereanydeal.ts
      index.ts
    cache.ts
    dedup.ts
    status.ts
    types.ts

__tests__/
  dedup.test.ts
  status.test.ts
=======
Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

```bash
npm run dev
npm run lint
npm run test
npm run build
```

## GitHub Automation

- `CI` runs on pushes and pull requests to `main`
- `Scheduled Sync` runs every 12 hours and can also be triggered manually
- Set `APP_BASE_URL` in GitHub Actions secrets to enable scheduled sync calls
- Set `SYNC_API_KEY` in GitHub Actions secrets if your deployed `/api/sync` endpoint is protected

## Environment Variables

`ITAD_API_KEY`

- Optional
- Used for the IsThereAnyDeal adapter
- If missing, the app skips that source without failing the whole sync

`SYNC_API_KEY`

- Recommended for production
- Protects the manual `/api/sync` refresh endpoint
- Send it with `x-sync-key` or `Authorization: Bearer <key>`

## Notes

- Some sources use public APIs, while others rely on lightweight HTML parsing.
- Source markup may change over time, so adapters should be treated as maintenance points.
- PlayStation Plus entries are intentionally labeled as subscription offers instead of true giveaways.
- The browser sync button is development-only. Public deployments should use protected server-side calls or automation.

## License

MIT
548ed01 (feat: harden free games tracker and improve repo readiness)

# Free Games Tracker

A web app for tracking free game giveaways and subscription game drops from multiple platforms in one place.

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

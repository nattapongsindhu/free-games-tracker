# Free Games Tracker

[![CI](https://github.com/nattapongsindhu/free-games-tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/nattapongsindhu/free-games-tracker/actions/workflows/ci.yml)
[![Scheduled Sync](https://github.com/nattapongsindhu/free-games-tracker/actions/workflows/scheduled-sync.yml/badge.svg)](https://github.com/nattapongsindhu/free-games-tracker/actions/workflows/scheduled-sync.yml)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

Track free game drops like a loot radar.

This app watches free game offers and subscription drops across major storefronts, then puts them into one clean board so you can quickly see:

- what is free right now
- what is coming soon
- what already expired
- which offers are true giveaways vs subscription perks

## Mission

Free Games Tracker is built for players who do not want to miss time-limited drops from:

- Epic Games Store
- Steam
- PlayStation Plus
- GG.deals
- IsThereAnyDeal

The goal is simple: less tab-juggling, more claiming.

## What It Tracks

| Source | What it tracks | Notes |
| --- | --- | --- |
| Epic Games Store | Free promotions and giveaway windows | Best source for weekly free claims |
| Steam | Free-to-keep or 100% discount offers | Availability depends on upstream listing data |
| PlayStation Plus | Subscription monthly games | Labeled separately from true giveaways |
| GG.deals | Free and giveaway-style listings | May be rate-limited upstream |
| IsThereAnyDeal | Aggregated deal data | Requires `ITAD_API_KEY` |

## Core Features

- Shows `Free Now`, `Upcoming`, `Ended`, and `Ending Soon`
- Displays start and end dates for each offer
- Deduplicates the same game across multiple sources
- Preserves source links so you can claim from the right store
- Separates subscription drops from real free giveaways
- Includes manual sync support for development
- Includes GitHub automation for CI and optional scheduled sync

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- Jest

## Quick Start

Install dependencies:

```bash
npm install
```

Start the app:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Scripts

```bash
npm run dev
npm run lint
npm run test
npm run build
```

## Environment Variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `ITAD_API_KEY` | No | Enables IsThereAnyDeal data |
| `SYNC_API_KEY` | Recommended in production | Protects the `/api/sync` endpoint |

Production sync requests can send the key with either:

- `x-sync-key: <value>`
- `Authorization: Bearer <value>`

## Automation

### CI

The `CI` workflow runs on:

- pushes to `main`
- pull requests to `main`
- manual workflow dispatch

It runs:

- lint
- test
- build

### Scheduled Sync

The `Scheduled Sync` workflow runs every 12 hours and can also be triggered manually.

To enable it fully, set these GitHub Actions secrets:

- `APP_BASE_URL`
- `SYNC_API_KEY` if your deployed sync endpoint is protected

If `APP_BASE_URL` is not set, the workflow safely skips itself.

## Notes From The Field

- Some sources use public APIs, others rely on lightweight HTML parsing.
- Upstream sites can change markup or add rate limits without warning.
- GG.deals may occasionally reject requests with `403`.
- If `ITAD_API_KEY` is missing, the app skips that source without breaking the rest of the board.
- In production, the browser sync button is hidden by design.

## Next Quests

- Add persistent storage for historical offer tracking
- Improve adapter resilience against upstream markup changes
- Add richer filtering and store-specific views
- Add alerts for new drops and expiring offers

## License

MIT

# Contributing

Thanks for helping improve Free Games Tracker.

## Ground Rules

- Keep changes small and task-focused.
- Do not commit secrets, API keys, or `.env` files.
- Prefer fixing the specific issue instead of broad refactors.
- Run lint and tests before opening a pull request.

## Branching

Use short-lived branches from `main`:

- `feature/<short-name>`
- `fix/<short-name>`
- `docs/<short-name>`

Examples:

- `feature/itad-cache`
- `fix/ggdeals-backoff`
- `docs/readme-update`

## Commit Messages

Use Conventional Commits where possible:

- `feat: add source-level backoff for upstream 403 responses`
- `fix: keep stale offers when scheduled sync fails`
- `docs: update local setup instructions`

## Local Setup

```bash
npm install
npm run dev
```

Optional environment variables live in `.env.local`:

```bash
ITAD_API_KEY=
SYNC_API_KEY=
```

## Before Opening a PR

Run:

```bash
npm run lint
npm test -- --runInBand
```

If you touch production behavior, also try:

```bash
npm run build
```

## Pull Request Checklist

- The change solves one clear problem.
- I did not include unrelated refactors.
- Lint passes locally.
- Tests pass locally.
- Any new config or env variable is documented.

## Scope Notes

This project relies on public APIs and lightweight HTML parsing from third-party sources. Please avoid changes that increase scraping frequency or make the app depend on live upstream fetches during every page request.

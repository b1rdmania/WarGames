# GIF Intake Workflow

This workflow supports high-volume GIFCities pulls with minimal manual triage.

## Folders

- `public/gifs/inbox`: newly pulled GIFs
- `public/gifs/approved`: auto-accepted GIFs
- `public/gifs/rejected`: invalid/duplicate/oversized GIFs
- `public/gifs/catalog.manifest.json`: machine-readable catalog
- `public/gifs/REVIEW.md`: manual review queue only

## Commands

Pull by theme:

```bash
npm run gifs:pull -- --theme warroom --per-query 6
```

Pull by explicit query list:

```bash
npm run gifs:pull -- --queries "radar,classified,ticker,alien,ufo" --per-query 8
```

Pull from query file (one query per line):

```bash
npm run gifs:pull -- --query-file scripts/gif-queries.txt --per-query 6
```

Catalog inbox and auto-organize:

```bash
npm run gifs:catalog
```

Review full library state without moving files:

```bash
npm run gifs:review
```

## Auto-triage rules

- `reject`: invalid GIF, exact duplicate hash, or over max size (default 1536 KB)
- `needs_review`: unusual dimensions, banner-like ratio, static-like frame count, edge-case quality
- `auto_accept`: passes all checks

## Suggested cadence

1. Pull in batches by page/theme.
2. Run `npm run gifs:catalog`.
3. Review only `public/gifs/REVIEW.md`.
4. Use `public/gifs/catalog.manifest.json` as source for surfacing GIFs in UI.

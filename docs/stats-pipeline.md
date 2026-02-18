# WAR.MARKET Stats Pipeline (v1)

## What is tracked

- `attempted` executions
- `successful` executions
- `failed` executions
- `notional_usd` routed on successful executions
- unique wallets (all-time + per day)
- top markets by successful trades and routed notional

## Event flow

1. Trade ticket executes from `/trade`.
2. Client emits analytics events to `POST /api/stats/events`:
   - `attempted` (before API call)
   - `success` or `failed` (after API response)
3. Server aggregates counters in `src/lib/stats/store.ts`.

## Storage

- Primary: Vercel KV / Upstash Redis via `@vercel/kv` when `KV_REST_API_URL` and `KV_REST_API_TOKEN` are set.
- Fallback: in-memory store (local/dev only, not durable across serverless instances).

## API

- `POST /api/stats/events` — records a trade event
- `GET /api/stats/summary?days=30` — returns aggregate stats

## UI

- `/stats` page displays:
  - KPI totals
  - top markets table
  - daily 30d series

## Notes

- Metrics are from app-routed executions, not direct/manual trades outside WAR.MARKET.
- For production-grade durability and cross-instance consistency, KV must be configured.

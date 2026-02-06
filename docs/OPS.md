# WarGames Ops (API integration)

WarGames consumes a separate backend: **wargames-api**. We keep that repo live and independent, and we do **minimal, repeatable checks** here to ensure data quality.

## Guiding principle
We avoid **mock/simulated** data in user-facing surfaces. If a signal is heuristic or synthetic, we either:
- do not surface it, or
- label it clearly (source/provenance).

Heuristic models are OK **only when they are derived from real signals** (e.g., risk score computed from live inputs).

## Endpoints we trust for live data
These are real external sources (best to prioritize):
- `/live/risk`
- `/live/crypto` (CoinGecko)
- `/live/predictions` (Polymarket)
- `/live/defi` (DefiLlama)
- `/live/pyth` (Pyth)
- `/live/solana` (Solana RPC)
- `/events/enhanced` (if built from real macro inputs)

## Endpoints to treat as heuristic/synthetic
These are likely simulated or partially synthetic (avoid by default unless explicitly accepted):
- `/smart-money/*`
- `/network/health` (simulated in current implementation)
- `/predict/*` (prediction engine uses fixed events / heuristic rules)
- `/arbitrage/*` and `/defi/opportunities/*` (depends on implementation; verify before surfacing)
- `/receipts/on-chain/*` (pending real anchoring)

If we decide to use any of these, we should add a **source label** in the UI (e.g., “Model/Heuristic”).

## Minimal maintenance loop (monthly)
Takes ~10 minutes.

1) **Health check**
   - `GET /health`
   - `GET /live/risk`

2) **External sources sanity**
   - `GET /live/predictions` (Polymarket alive)
   - `GET /live/defi` (DefiLlama alive)
   - `GET /live/solana` (RPC alive)

3) **Latency check**
   - verify responses < ~1s for core endpoints

4) **Dashboard spot-check**
   - `/dashboard/v2` loads

5) **Log errors** (if any)
   - Check deployment logs in the wargames-api hosting provider

## Deployment responsibility
- **WarGames repo:** frontend only
- **wargames-api repo:** backend only

Any changes to data logic live in the API repo. WarGames should treat it as a stable, versioned service.

## Local override (optional)
You can point WarGames to a different API base using:

```
WARGAMES_API_BASE=https://wargames-api.vercel.app
```

Set this in `.env.local` if needed.

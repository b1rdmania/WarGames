# WAR.MARKET — presentation deck template (mid-checkpoint)

## Slide 1 — Title

- WAR.MARKET
- “Bet on narratives that move markets”
- Built for Hyperliquid London Community Hackathon (Pear Execution API track)

## Slide 2 — Problem

- Traders follow narratives (macro, tech, geopolitics) but expressing them is cumbersome.
- Pair trades are powerful but hard to execute and manage manually.
- On-chain UIs often prioritize tickers; users think in “theses.”

## Slide 3 — Solution

- A narrative-first UI: BET UP / BET DOWN on curated narrative markets.
- Under the hood: execute a leveraged long/short pair via Pear Protocol on Hyperliquid.
- Focus: functional, reliable trading UX (not a mock).

## Slide 4 — How it works (user flow)

1. Connect wallet
2. Authenticate with Pear (EIP‑712)
3. Create/approve agent wallet (non-custodial execution)
4. Confirm funded (spot/perp balances + readiness gating)
5. Place bet (open position)
6. Track and close position

## Slide 5 — Technical architecture (high level)

- Frontend: Next.js + TypeScript
- Wallet: wagmi/viem
- Pear API:
  - Auth: `GET /auth/eip712-message` → `POST /auth/login`
  - Agent wallet: `GET/POST /agentWallet`
  - Trading: `POST /positions`, `GET /positions`, `POST /positions/{id}/close`
  - Balances: `GET /vault-wallet/balances`

## Slide 6 — Demo plan (3 minutes)

0:00–0:30: problem + what WAR.MARKET is  
0:30–1:30: connect → authenticate → agent wallet  
1:30–2:30: show balances/readiness → place bet → show P&L  
2:30–3:00: close position + recap why this matters

## Slide 7 — Why it’s interesting / why judges should care

- New behavior: narrative-first trading UX over pair mechanics.
- Executes real trades via Pear Execution API.
- Clear failure modes + recovery (signature rejection, insufficient funds, agent not approved).

## Slide 8 — Links (snappy)

- Live: `https://war-markets.vercel.app`
- Repo: `https://github.com/b1rdmania/WarGames`

## Appendix (optional) — Current status checklist

- [ ] Auth works end-to-end with token refresh
- [ ] Agent wallet create + approve UX
- [ ] Balances + readiness gating
- [ ] Open/close position demo
- [ ] Position display is accurate and readable


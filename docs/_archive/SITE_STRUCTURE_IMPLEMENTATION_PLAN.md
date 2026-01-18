# Site Structure Implementation Plan (MARKETS / TRADE / PORTFOLIO / ABOUT)

Goal: restructure the app into a simple, judge-friendly flow with clear separation of browsing, execution, and account state.

## Information Architecture (IA)

- **`/` (Splash)**
  - Video + music.
  - Single CTA → **TRADE**.

- **`/markets` (MARKETS)**
  - Browse markets table.
  - Market name links → `/markets/[marketId]`.
  - No wallet/account clutter.

- **`/markets/[marketId]` (Market detail)**
  - RiskMarkets-style detail page (already implemented).
  - YES/NO opens BetSlip.

- **`/trade` (TRADE)**
  - “Execution terminal” (fast path).
  - If not authenticated: wallet connect + Pear setup.
  - If authenticated: markets table with YES/NO → BetSlip.
  - Shows minimal status + current USDC perp balance.

- **`/portfolio` (PORTFOLIO)**
  - Active positions + P&L.
  - Balances (perp/spot) relevant to trading collateral.
  - No market browsing.

- **`/about` (ABOUT)**
  - What WAR.MARKET is, how Pear execution works, links/credits.

## UX Principles

- Keep “setup” friction out of browsing; only show setup on TRADE/PORTFOLIO.
- Prefer a consistent terminal shell (RiskShell) everywhere except splash.
- Avoid layout jumps: no “Loading…” panel swaps; show inline “UPDATING…” states.

## Implementation Tasks

### 1) Navigation
- Update terminal nav to: **MARKETS / TRADE / PORTFOLIO / ABOUT**
- Remove/park: STAKE, $RISK (until real).

**Acceptance**
- Nav works across `/markets`, `/trade`, `/portfolio`, `/about`, `/markets/[marketId]`.

### 2) New routes
- Create `src/app/trade/page.tsx` (+ client wrapper) as the execution terminal.
- Create `src/app/portfolio/page.tsx` (+ client wrapper) as the account view.
- Create `src/app/about/page.tsx` as a static explanation page.

**Acceptance**
- Each route renders inside `RiskShell` and loads on Vercel.

### 3) Split responsibilities
- `/markets`: browse-only (no positions block).
- `/trade`: contains the BetSlip-driven trading UI.
- `/portfolio`: contains positions polling + websocket refresh and balances.

**Acceptance**
- Clicking YES/NO on TRADE always opens BetSlip.
- Portfolio positions refresh does not shift the entire page up/down.

### 4) Position refresh logic
- Move the existing positions loading logic (poll + ws refresh) into the PORTFOLIO page.
- Keep refresh silent (no list clearing).

**Acceptance**
- Portfolio shows an “UPDATING…” indicator during refresh and does not jump.

## Smoke Test Checklist (manual)

- `www.war.market/` loads splash; CTA goes to `/trade`.
- `/markets` loads the table and market links work.
- `/markets/[marketId]` loads and YES/NO opens BetSlip.
- `/trade` shows connect/setup when unauthenticated; after setup, YES/NO opens BetSlip.
- `/portfolio` shows balances + positions; refresh does not cause layout jumps.
- Wallet connect defaults to injected wallets (not MetaMask-first).

## Music tracks (top bar selector)

The terminal pages include a **MUSIC** selector in the sticky top bar.

Expected files:
- `public/music/1.mp3`
- `public/music/2.mp3`
- `public/music/3.mp3`
- `public/music/4.mp3`

Notes:
- Music is **disabled on `/`** (splash has its own splash-only audio).
- Music defaults to **muted** until the user selects a track (browser autoplay rules).


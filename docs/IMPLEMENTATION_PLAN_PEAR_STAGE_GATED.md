# WAR.MARKET — Stage-gated implementation plan (Pear-first)

**Goal:** build a functional Pear Protocol trading UX (auth → agent wallet → balances → market view → place/close positions) with *stage gates* and explicit tests, so we never ship UI that isn’t wired.

**Source of truth:** Pear Protocol API docs: [`https://docs.pearprotocol.io/api-integration/api-specification`](https://docs.pearprotocol.io/api-integration/api-specification)

## Principles (how we avoid “fake UX”)

- **Stage gates:** we only move to the next stage when the previous stage is proven via a small test checklist.
- **Thin UI, thick correctness:** early work is about correct token handling, correct payload shapes, and clear error recovery.
- **One state machine:** UX is driven by a single “readiness” state (e.g., NotConnected → NotAuthenticated → AgentWalletPending → Funded → ReadyToTrade).
- **Never guess API shapes:** implement from Pear spec pages and verify responses in network logs.

## Stage 0 — Repo hygiene (judge-proofing)

**Goal:** make the submission story obvious (WAR.MARKET = `war-markets/`) and bury non-submission UX reference code.

- Move `RiskMarkets/` → `archive/RiskMarkets/` and label it clearly as “UX reference only.”
- Make home flow Pear-first (no LI.FI prompts in primary flow).

**Gate (pass/fail):**
- Landing on the repo, a judge can quickly find `war-markets/` and is not distracted by HIP-3 tooling.

---

## Stage 1 — Connectivity + system status panel

**Goal:** user can connect wallet, and the app can display “system status” based on real signals.

**UX requirements:**
- Wallet connect status (address, chain).
- “Pear API status: OK/Down” using `GET /health` ([Health](https://docs.pearprotocol.io/api-integration/api-specification/health)).

**Gate:**
- `GET /health` returns `{"status":"ok",...}` and UI reflects it.

---

## Stage 2 — Authentication (EIP-712) + token lifecycle

**Goal:** auth succeeds and persists; no “random logouts.”

**API spec:** [Authentication](https://docs.pearprotocol.io/api-integration/api-specification/authentication)

**Implementation requirements:**
- `GET /auth/eip712-message` → sign → `POST /auth/login`
- Store: `accessToken`, `refreshToken`, and `tokenExpiryMs`
- **Correct `expiresIn` math:** docs show `expiresIn: 900` (seconds). Store expiry as `Date.now() + expiresIn * 1000`.
- Implement `getValidAccessToken()` that refreshes via `POST /auth/refresh` automatically on expiry or 401.

**UX requirements:**
- Clear signing prompt copy (“Sign to authenticate”).
- Button disables during signing.
- On rejection: friendly toast and return to idle.

**Gate:**
- After auth, reload page: user stays authenticated.
- Force expiry (`tokenExpiryMs=0`): next authenticated call triggers refresh and succeeds.

---

## Stage 3 — Agent wallet creation + approval UX

**Goal:** create/retrieve agent wallet and guide the user to approve it.

**API spec:** [Agent Wallet](https://docs.pearprotocol.io/api-integration/api-specification/agent-wallet)

**Implementation requirements:**
- `GET /agentWallet` returns `{ "agentWalletAddress": "0x..." }` or 404.
- If 404: `POST /agentWallet` returns `{ agentWalletAddress, message }`.

**UX requirements:**
- Show agent wallet address once created.
- Show “Approval required” state until user confirms they’ve approved.
- Provide clear external link to approve in Hyperliquid UI (manual step is fine for MVP).

**Gate:**
- New user can create agent wallet and sees “approval required” instructions.

---

## Stage 4 — UX & Portfolio Data (NEW — balances, readiness, charts)

This stage is specifically to ensure the product is **functional**: users can see balances, understand whether they can trade, and see market context before trading.

### 4A — Account summary (lightweight)

**API spec:** [Accounts](https://docs.pearprotocol.io/api-integration/api-specification/accounts)

Use `GET /accounts` to display:
- `agentWalletAddress` (cross-check with `/agentWallet`)
- activity metrics (e.g., `totalClosedTrades`)
- `lastSyncedAt`

**UX requirements:**
- In a “System / Account” drawer or panel, show last sync + basic account metadata.

**Gate:**
- `GET /accounts` succeeds and UI renders without blocking main trade flow.

### 4B — Balances (spot + perp) + “funding readiness”

**API spec:** Vault wallet endpoints (critical): [Vault Wallet](https://docs.pearprotocol.io/api-integration/api-specification/vault-wallet)

Use `GET /vault-wallet/balances` to display:
- `spotBalances` (USDC, ETH, etc.)
- `perpBalances` (USDC collateral available for perp trading)
- `totalValue`

**UX requirements:**
- Show **Perp USDC** prominently (this determines if “Place bet” should be enabled).
- Show **Spot USDC** (and optionally ETH/SOL) so users understand what can be moved.
- Add a “Minimum bet size” helper (e.g., $1) and disable bet if perp USDC is below required.

**Gate:**
- With real account, the UI correctly shows balances and flips readiness state when perp USDC changes.

### 4C — Balance operations (optional but powerful)

If needed for demo smoothness, use:
- `POST /vault-wallet/spot-to-perp` to move USDC spot → perp
- `POST /vault-wallet/perp-to-spot` to move perp → spot
- `POST /vault-wallet/swap-and-transfer` to swap spot asset → USDC and transfer to perp

**Gate:**
- A small spot→perp transfer succeeds and perp balance updates.

### 4D — Market context + charts decision

We have two viable MVP approaches:

1) **Simple ratio-only view (recommended):**
   - Show the pair/basket composition and narrative.
   - Show latest price ratio and 24h change using `GET /markets` or `GET /markets/active` ([Markets](https://docs.pearprotocol.io/api-integration/api-specification/markets)).
   - Later: upgrade to real-time using WebSocket `market-data` ([Websocket](https://docs.pearprotocol.io/api-integration/websocket)).

2) **Embedded Pear chart (if available as embed):**
   - Only do this if Pear provides a stable embed URL/component; otherwise it risks breaking and blocking.

**Gate:**
- Market page shows *some* real market context (ratio/change) for at least one chosen market and doesn’t rely on hardcoded placeholders.

---

## Stage 5 — Place bet (create position)

**API spec:** [Positions](https://docs.pearprotocol.io/api-integration/api-specification/positions)

**Implementation requirements:**
- `POST /positions` with:
  - `executionType: "MARKET"`
  - `slippage` in range
  - `usdValue` >= 1
  - `longAssets/shortAssets` using `{ asset, weight }` keys (per spec)
- Handle common failures:
  - agent not approved
  - insufficient perp USDC
  - invalid asset symbol

**UX requirements:**
- Bet modal reads “BET UP / BET DOWN”, shows leverage, shows required perp USDC, disables confirm if not funded.

**Gate:**
- User can place a small position and gets an `orderId`.

---

## Stage 6 — Positions panel (view + close)

**API spec:** [Positions](https://docs.pearprotocol.io/api-integration/api-specification/positions)

**Implementation requirements:**
- `GET /positions` render list with:
  - entry/mark ratio
  - unrealized PnL + %
  - legs (longAssets/shortAssets)
- `POST /positions/{positionId}/close`

**UX requirements:**
- Positions list refresh button; optional polling.
- Close button shows progress and handles errors gracefully.

**Gate:**
- User can close a position and it disappears from list.

---

## Stage 7 — Reliability + real-time (optional)

**API spec:** [Websocket](https://docs.pearprotocol.io/api-integration/websocket)

**Goal:** reduce polling; make demo feel “alive.”

- Subscribe to `positions` and `market-data`.
- Reconnect with backoff.

**Gate:**
- PnL updates without page refresh.

---

## Stage 8 — Market validation & indices strategy (after the core is stable)

Now that you have the tradable universe docs:
- `docs/PEAR_TRADABLE_MARKETS_FROM_SCREENSHOTS.md`
- `docs/PEAR_TRADABLE_MARKETS_GROUPED.md`

…you can pick your “dummy” markets first, then iterate toward narrative indices without risking execution failures.


# WAR.MARKET Launch Readiness Report

**Date:** 2026-04-15  
**Reviewer:** GPT-5.4 via Cursor  
**Scope:** Read-only launch review of the primary product repo at `war-markets/` with no code changes.  
**Goal:** Assess whether the app is ready to launch today, identify blockers, and separate core-trading readiness from supporting-surface risk.

## Executive Summary

WAR.MARKET is close to launch for a **desktop-first release**.

The core application is in good shape:

- The Next.js production build succeeds.
- Market configuration validation succeeds.
- The live homepage is up.
- Pear's active markets endpoint is reachable.
- Hyperliquid's upstream API is reachable.

The main launch concerns are not the core trade path itself. They are:

- **Mobile gating is currently broken for iOS users who try to continue past the gate.**
- **The `/intel` experience is degraded because the `wargames-api` dependency appears unavailable or unstable.**
- **Repo-wide lint is red because generated docs assets are being linted, even though app source lint is clean enough to ship.**

## Bottom Line

**Recommended status:** Launchable today for desktop with caveats.  
**Not recommended:** Broad "works everywhere" launch messaging, especially around mobile and live intelligence features, until the blockers below are addressed.

## Product Overview

WAR.MARKET is a Next.js 16 App Router application for trading geopolitical and macro narratives as long/short baskets through Pear Protocol with Hyperliquid settlement.

Primary user flow:

1. `/` landing page
2. `/trade` trading terminal
3. `/markets/[marketId]` market brief / intelligence detail
4. `/portfolio` positions and routed-trade history
5. `/intel` live intelligence dashboard

Primary external dependencies:

- Pear Protocol API at `https://hl-v2.pearprotocol.io`
- Pear WebSocket at `wss://hl-v2.pearprotocol.io/ws`
- Hyperliquid API at `https://api.hyperliquid.xyz/info`
- Wargames API at `https://wargames-api.fly.dev`

## What Was Checked

### Static and Build Checks

- `npm run build`
- `npm run lint`
- `npx eslint src`
- `npm run check:markets`

### Runtime and Dependency Checks

- Fetched live homepage at `https://www.war.market`
- Fetched live `/trade`
- Fetched live `/intel`
- Queried Pear active markets endpoint
- Queried Hyperliquid info API
- Queried `wargames-api.fly.dev`

### Code Review Focus Areas

- App routing and layout
- Mobile middleware behavior
- Pear authentication flow
- Trade execution path
- Portfolio and stats path
- Intel aggregation routes
- Environment assumptions

## Verification Results

### Passed

- `npm run build` completed successfully in production mode.
- `npm run check:markets` passed with `8 markets validated`.
- `npx eslint src` returned **0 errors** and only warnings.
- `https://www.war.market` is live and serves the landing page.
- Pear active markets endpoint returned `200 OK`.
- Hyperliquid info API returned `200 OK`.

### Failed or Degraded

- `npm run lint` failed at the repo level because it includes generated assets under `docs/.vercel/output`.
- `https://www.war.market/intel` loads in a **degraded** state with unknown / empty signals.
- Direct check to `https://wargames-api.fly.dev/live/risk` failed from terminal with `ENOTFOUND`.
- Remote fetch to the same `wargames-api` host timed out.

## Readiness By Area

### 1. Core Trading Path

**Status:** Strong

Why this looks solid:

- Wallet provider and Pear provider are wired at the root layout.
- Trade terminal is explicitly client-only, which fits the wallet-heavy interaction model.
- Pear auth flow includes token refresh handling, chain switching, and agent wallet creation.
- Trade execution includes safety checks that refuse mismatched remapped pairs or baskets.
- Portfolio view supports live refresh and Pear WebSocket-driven position updates.

Residual risk:

- This review did not execute a real trade with a live wallet, so the final unknown is still true end-to-end auth and trade execution in a browser session.

### 2. Market Configuration

**Status:** Good

Signals:

- Market validation script passed.
- The app preserves configured markets in degraded discovery mode rather than blanking the board if advisory market discovery fails.
- Market-hours UX guardrails are present for TradFi-linked assets.

Residual risk:

- Several thematic markets are intentionally marked `paused`, so launch messaging should match the actual live board users see.

### 3. Portfolio and Stats

**Status:** Usable, but not production-hardened

Signals:

- Portfolio surfaces positions, history, routed stats, and protocol snapshot.
- Hyperliquid fills endpoint is implemented and validates wallet input.

Risks:

- Stats durability depends on `KV_REST_API_URL` and `KV_REST_API_TOKEN`.
- Without KV, the app falls back to in-memory aggregation, which is not durable across serverless instances.
- `POST /api/stats/events` is unauthenticated and can be spammed.

### 4. Intel Surface

**Status:** At risk

Signals:

- The `/intel` page currently renders but shows degraded / unknown status in production.
- All intel API routes depend on `WARGAMES_API_BASE`, defaulting to `https://wargames-api.fly.dev`.
- That upstream was not reachable in this review.

Practical effect:

- The app can still launch as a trading product.
- The "live intelligence" story is not dependable enough to headline today without first confirming the API health.

### 5. Mobile Experience

**Status:** Not launch-ready for general users

Problem:

- iOS requests to non-home routes are rewritten to `/ios`.
- The `/ios` page offers an "OPEN ANYWAY" CTA to `/markets`.
- `/markets` is also rewritten back to `/ios`, so users cannot actually continue.

Practical effect:

- Any iPhone or iPad user who tries to go deeper than the splash is effectively stuck unless they manually work around it.

## Key Launch Blockers

### Blocker 1: iOS gate loops users back to itself

Severity: High

Impact:

- Mobile users cannot meaningfully proceed into the app.
- Shared deep links on iOS will not behave like users expect.

Evidence:

- Middleware rewrites any iOS non-home path to `/ios`.
- `/ios` links to `/markets`, which is itself gated and redirected.

### Blocker 2: Intel data dependency appears unavailable

Severity: High

Impact:

- `/intel` and related live-data surfaces are degraded.
- The product narrative around live risk, alerts, and tape is weaker at launch.

Evidence:

- Direct upstream check failed.
- Production `/intel` page showed unknown / empty data.

### Blocker 3: Repo-wide lint is red

Severity: Medium

Impact:

- Could block teams that rely on full lint as a release gate.
- Creates noise during review and reduces confidence.

Important nuance:

- This does **not** appear to be an app-code correctness issue.
- App source lint is clean enough to ship from a functional perspective.

### Blocker 4: Stats are not durable unless KV is configured

Severity: Medium

Impact:

- Routed volume and wallet metrics may reset or fragment across deploy instances.
- Demo numbers can look inconsistent after launch.

## Launch Recommendation

### Recommendation: Launch if the scope is explicitly desktop-first

This is a reasonable launch if all of the following are true:

- You present the app as a desktop or laptop experience.
- You treat `/trade` and `/portfolio` as the primary product.
- You do not overpromise the current `/intel` surface until the backend feed is verified.
- You accept that analytics durability may be limited unless KV is configured.

### Recommendation: Do not present this as fully mobile-ready

Do not message this as "works on phone" or "use anywhere" in its current state.

### Recommendation: Treat intel as a soft feature until verified

The live intel surface currently reads like a degraded feature rather than a dependable launch pillar.

## Suggested Pre-Launch Order of Operations

If you have one hour:

1. Fix the iOS gate loop.
2. Confirm or replace the `wargames-api` backend.
3. Decide whether `/intel` should remain public if the feed is degraded.
4. Confirm KV is configured if routed stats matter for launch optics.

If you have fifteen minutes:

1. Launch as desktop-first.
2. Avoid pushing users to `/intel`.
3. Avoid mobile-heavy distribution.
4. Keep launch copy focused on narrative trading and Pear execution.

## Go / No-Go Call

### Core product

**Go**, with desktop-first positioning.

### Mobile

**No-go** in current form.

### Intel

**Conditional go** only if degraded intel is acceptable, otherwise **no-go** until backend health is confirmed.

## Appendix: Commands and Checks Run

- `npm run build`
- `npm run lint`
- `npx eslint src`
- `npm run check:markets`
- Live fetch of `https://www.war.market`
- Live fetch of `https://www.war.market/trade`
- Live fetch of `https://www.war.market/intel`
- Upstream check of Pear active markets
- Upstream check of Hyperliquid info API
- Upstream check of `https://wargames-api.fly.dev/live/risk`

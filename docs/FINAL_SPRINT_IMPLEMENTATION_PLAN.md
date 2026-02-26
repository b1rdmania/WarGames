# WAR.MARKET Final Sprint Implementation Plan

Last updated: 2026-02-26

## Purpose

This is the execution plan for the final pre-beta sprint.

It is intentionally more technical than `IMPLEMENTATION_PLAN.md` and should be used as the working document for implementation order, file touchpoints, validation steps, and release criteria.

## Sprint Goal (Exit Condition)

WAR.MARKET is ready for a closed beta with:

- reliable execution/position verification UX
- correct stats behavior (`MY` / `PROTOCOL`)
- basic legal/risk pages live
- clear onboarding messaging for first-time users
- a support/contact path and beta feedback intake

## Scope (This Sprint)

### In Scope

- Stats pipeline integrity fix
- `/stats` mode implementation (`MY` / `PROTOCOL`)
- Legal/risk pages and links
- Onboarding/first-trade UX copy pass
- Execution/close failure messaging pass
- Closed-beta support and feedback plumbing (lightweight)

### Out of Scope

- Token design / launch
- Community market creation
- Major architecture rewrites
- Deep charting / analytics redesign

## Working Rules (KISS)

- Ship smallest viable fix first, then polish
- Prefer one source of truth for each concern
- Add acceptance checks as part of each task
- Avoid broad refactors during sprint unless they unblock a blocker

## Sprint Sequence (Recommended Order)

1. Stats integrity (data correctness)
2. Stats modes (`MY` / `PROTOCOL`)
3. Legal/risk pages + links
4. Trade/onboarding messaging pass
5. Close/error messaging pass
6. Beta support + feedback path
7. Final QA pass (desktop + iOS)

## Workstream A: Stats Integrity (Blocker)

### Objective

Ensure stats summary reflects all routed trades consistently.

### Likely Touchpoints

- `src/app/api/stats/summary/*`
- `src/app/api/stats/events/*`
- `src/lib/stats/*`
- `src/lib/stats/client.ts`
- trade event write paths in:
  - `src/app/trade/TradeClient.tsx`
  - any close-position logging paths

### Implementation Steps

1. Baseline mismatch reproduction
- Compare raw events and summary for same date range / wallet
- Record a concrete mismatch example (counts + notional)

2. Trace event write paths
- Confirm `attempted/success/failed` writes are emitted for all execution outcomes
- Confirm close events (if tracked) are consistent and not corrupting summary assumptions

3. Audit summary rollup assumptions
- Date window boundaries (UTC/local)
- Wallet normalization (checksum/lowercase)
- Dedupe keys
- Status filtering logic

4. Fix rollup/store logic
- Patch summary calculation to match raw event source-of-truth expectations

5. Add reconciliation check (dev/admin utility)
- Lightweight script or API check to compare raw totals vs summary totals

### Acceptance Criteria

- Summary totals match raw event totals on recent test window
- No dropped successful trades in summary after new test executions
- Regression check passes after page refresh / reload

### Validation

- Manual: place test trades and compare `/api/stats/events` vs `/api/stats/summary`
- Manual: check `/stats` values update as expected

## Workstream B: Stats Page Modes (`MY` / `PROTOCOL`) (Blocker)

### Objective

Make `/stats` auth-aware and aligned with product decision:

- signed-in default: `MY STATS`
- signed-out default: `PROTOCOL STATS`

### Likely Touchpoints

- `src/app/stats/page.tsx`
- `src/app/stats/stats.module.css`
- wallet/auth state hooks/providers used elsewhere (wallet + Pear auth context)
- stats API endpoints (wallet-scoped query support if missing)

### Implementation Steps

1. Introduce mode model
- `type StatsMode = 'my' | 'protocol'`
- URL query or local state (prefer query if easy for shareability)

2. Determine auth-aware default
- signed-in -> `my`
- signed-out -> `protocol`

3. Build mode switch UI
- terminal-style tabs or segmented control
- visible current mode label in pane/header

4. Implement `my` stats data path
- wallet-scoped fetch using connected wallet (and/or Pear-auth-associated wallet logic)
- signed-out `my` view should show sign-in prompt, not broken/empty data

5. Retain protocol stats as public path
- keep current aggregate behavior for `protocol`

6. Clarify copy
- avoid ambiguity with portfolio quick stats

### Acceptance Criteria

- Signed-out `/stats` lands on protocol view + sign-in CTA
- Signed-in `/stats` lands on my view
- Toggle switches reliably and fetches correct data source
- No mixed labels/copy confusion

### Validation

- Test signed-out and signed-in flows
- Test refresh/deep-link (if query-param mode used)

## Workstream C: Legal / Risk Pages + Wiring (Blocker)

### Objective

Add minimum trust/compliance surfaces before beta.

### Deliverables

- `/terms`
- `/privacy`
- `/risk` (or `/disclaimer`)

### Likely Touchpoints

- `src/app/terms/page.tsx`
- `src/app/privacy/page.tsx`
- `src/app/risk/page.tsx` (or equivalent)
- footer/splash/about link surfaces:
  - `src/components/RiskLanding.tsx`
  - `src/app/about/page.tsx`
  - `src/app/labs/splash-gate/page.tsx` (preview route for now)

### Implementation Steps

1. Create plain but clean page templates
- match current terminal design language
- mobile readable

2. Draft minimum content
- not investment advice
- leverage/slippage/partial fill/execution risk
- third-party execution/settlement (Pear + Hyperliquid)
- privacy basics (what is logged/tracked)

3. Link from visible surfaces
- splash preview
- about
- optional footer/nav

### Acceptance Criteria

- All pages render and are linked
- Copy is explicit and not misleading
- Mobile layout is readable

## Workstream D: Onboarding / First-Trade UX Pass (Blocker)

### Objective

Reduce first-time user confusion around wallet connection, Pear setup, approvals, and funding.

### Likely Touchpoints

- `src/app/trade/TradeClient.tsx`
- `src/components/PearSetupCard.tsx`
- wallet connect helpers / Pear context:
  - `src/contexts/PearContext.tsx`
  - `src/lib/connectWallet.ts`

### Implementation Steps

1. Enumerate first-time states on Trade page
- no wallet connected
- wallet connected, not Pear-authenticated
- Pear auth pending
- approval pending
- insufficient margin
- market not tradable / likely closed

2. Normalize state messaging
- one clear primary action in each state
- concise helper copy
- no conflicting messages at once

3. Add referral-safe onboarding copy
- explain background HL setup behavior without overclaiming

4. Fresh-wallet walkthrough test
- validate state transitions and copy sequence

### Acceptance Criteria

- New user can understand next step at each state
- No hidden requirement surprises before execute
- Referral/onboarding wording is accurate

## Workstream E: Execution / Close Failure Messaging Pass (Blocker)

### Objective

Prevent false confidence and improve clarity during failure/partial completion states.

### Likely Touchpoints

- `src/app/trade/TradeClient.tsx`
- `src/app/portfolio/PortfolioClient.tsx`
- `src/components/PositionCard.tsx`
- `src/integrations/pear/positions.ts`

### Implementation Steps

1. Audit current success/failure toasts and labels
- execute success/fail
- close success/fail
- stale UI vs live HL mismatch

2. Add explicit copy for partial/uncertain outcomes
- encourage refresh/reconcile
- point to HL verification link when relevant

3. Align portfolio status states with reconciliation
- `verified`, `mismatch`, `unavailable`
- ensure wording is consistent across list + detail

### Acceptance Criteria

- No UI state implies “closed” if HL still shows open legs without warning
- Partial/failed outcomes are visibly actionable

## Workstream F: Support + Feedback Path (Beta Ready)

### Objective

Enable a lightweight but real beta support loop.

### Deliverables

- One support channel surfaced in product/docs
- Feedback form link
- Bug report template (Markdown or docs page)

### Likely Touchpoints

- `src/app/about/page.tsx`
- docs pages
- optional `/support` or `/feedback` route

### Implementation Steps

1. Choose primary channel (email / Telegram / Discord)
2. Add visible support link in About and/or footer
3. Add bug report checklist (wallet, market, timestamps, screenshot, HL link)
4. Add beta feedback form link

### Acceptance Criteria

- Testers know where to report issues
- Support request includes enough info to debug

## QA Pass (Before Inviting Testers)

### Functional QA

- [ ] Connect wallet
- [ ] Pear auth/setup flow
- [ ] Execute trade
- [ ] Close trade
- [ ] Verify on Hyperliquid link
- [ ] Portfolio reconciliation status updates
- [ ] Stats load in signed-out mode
- [ ] Stats load in signed-in `MY` mode

### UI QA (Desktop + iOS)

- [ ] Home
- [ ] Trade
- [ ] Portfolio
- [ ] Stats
- [ ] About
- [ ] Splash gate preview (if using)
- [ ] Legal pages

### Copy QA

- [ ] Onboarding states
- [ ] Risk/disclaimer consistency
- [ ] No overclaims about automation/referral behavior

## Deployment / Release Steps (Closed Beta)

1. Merge final sprint changes to `main`
2. Confirm Vercel deploy is `Ready` on expected commit
3. Smoke test production routes
4. Smoke test one real trade path (small size)
5. Invite beta cohort with reporting instructions

## Suggested Task Ownership (Adjustable)

- Engineering (product reliability): Workstreams A, B, E
- Product/UX: Workstreams D + QA pass
- Content/ops: Workstreams C, F
- Founder/GTM: beta recruitment + launch messaging

## Daily Sprint Rhythm (Recommended)

- Start: pick 1 blocker + 1 parallel non-blocker
- Midpoint: verify against acceptance criteria, not just UI “looks right”
- End: update this file with status and next exact step

## Progress Tracking (Update In-Place)

### Current Sprint Status

- [ ] A. Stats integrity
- [ ] B. Stats modes (`MY` / `PROTOCOL`)
- [ ] C. Legal / risk pages
- [ ] D. Onboarding UX pass
- [ ] E. Execution/close messaging pass
- [ ] F. Support + feedback path
- [ ] QA pass

### Notes / Decisions Log

- 2026-02-26: Created final sprint implementation plan as technical execution companion to `IMPLEMENTATION_PLAN.md`.

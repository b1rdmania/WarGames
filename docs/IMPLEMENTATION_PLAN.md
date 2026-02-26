# WAR.MARKET Implementation Plan

Last updated: 2026-02-25

## Goal / Launch Scope

Ship a credible beta of WAR.MARKET for narrative basket trading on Hyperliquid (routed via Pear Protocol), with:

- reliable execution + position verification
- clear onboarding and risk messaging
- usable docs/support paths
- enough market quality/content to test real demand

Out of scope for beta:

- token launch (`$WAR`)
- community market creation
- HIP-3 native WAR indices

## Current Product Decisions (Already Made)

- `/stats` should default to `MY STATS` for signed-in users
- signed-out `/stats` should show `PROTOCOL STATS` + sign-in prompt
- `Portfolio` is operational (positions/history + compact personal snapshot)
- `Stats` is the analytics surface
- Hyperliquid is source-of-truth for open position verification
- position reconciliation/mismatch warnings are implemented and should stay
- canonical GIF library flow is in place and usable (review + placement)

## Status Snapshot

### Done / Substantially Done

- Hyperliquid open-position reconciliation in portfolio
- mismatch indicators and warnings in portfolio UI
- canonical GIF library + review tooling + aliasing
- shareable GIF display page for placements
- major visual cleanup across home/trade/about/stats
- splash gate preview route (prototype only, not wired)

### In Progress / Active

- splash/entry gate concept and copy direction
- final visual placement polish on key pages

### Not Done (Critical)

- stats data integrity fix (missing routed trades in summary)
- `/stats` `MY / PROTOCOL` mode implementation
- legal pages (`Terms`, `Privacy`, `Risk/Disclaimer`)
- onboarding copy/flow clarity for HL + Pear + referral

## Blockers Before Closed Beta (Must Fix)

### 1. Stats Data Integrity [BLOCKER]

Problem:
- `/stats` summary is missing some routed trades

Done when:
- summary totals match raw events for the same time window

Acceptance criteria:
- compare raw events vs summary over recent test trades
- wallet normalization/date filtering confirmed
- no obvious dropped events in normal trade/close flows

Tasks:
- [ ] Compare `/api/stats/events` vs `/api/stats/summary`
- [ ] Identify mismatch source (write path, dedupe, filter, window)
- [ ] Fix rollup/store logic
- [ ] Add a reconciliation check (raw -> summary)

### 2. Stats Page Mode Model [BLOCKER]

Decision:
- signed-in default = `MY STATS`
- signed-out = `PROTOCOL STATS`

Done when:
- `/stats` clearly supports both modes

Acceptance criteria:
- signed-out users see protocol stats + sign-in prompt
- signed-in users land on personal stats by default
- visible mode indicator (`MY` / `PROTOCOL`)

Tasks:
- [ ] Add mode state + UI switch on `/stats`
- [ ] Implement signed-in default logic
- [ ] Add signed-out `MY` state prompt
- [ ] Clarify labels/copy in page header

### 3. Legal / Risk Pages [BLOCKER]

Need:
- `Terms`
- `Privacy`
- `Risk / Disclaimer`

Done when:
- pages exist and are linked in app/footer/splash

Acceptance criteria:
- visible links from splash/about/footer
- clear leverage/execution risk language
- explicit “not investment advice”

Tasks:
- [ ] Create `/terms`
- [ ] Create `/privacy`
- [ ] Create `/risk` (or `/disclaimer`)
- [ ] Add links in app shell/footer/splash

### 4. Onboarding Clarity (HL + Pear + Referral) [BLOCKER]

Done when:
- new users can understand connect -> setup -> approve -> trade

Acceptance criteria:
- clear messages for: no wallet, no Pear auth, approval pending, no margin
- referral path explanation is accurate
- first-time flow tested with fresh wallet

Tasks:
- [ ] Audit first-time user states on trade page
- [ ] Add clear step copy / helper text
- [ ] Confirm referral attribution behavior
- [ ] Test fresh-wallet path end-to-end

### 5. Execution / Close Failure Messaging [BLOCKER]

Done when:
- UI never implies closed/successful state without qualification

Acceptance criteria:
- partial fills and close failures produce explicit warnings
- HL mismatch states remain visible until reconciled

Tasks:
- [ ] Audit close-position success/error states
- [ ] Add clearer copy for partial/failed close outcomes
- [ ] Ensure refresh/reconcile prompts are obvious

## Beta-Ready Checklist (Must Have Before Inviting Testers)

### Reliability / Product

- [ ] Core trade flow tested end-to-end on mainnet path
- [ ] Position verification against Hyperliquid confirmed in real usage
- [ ] Error states reviewed (timeouts, failed execution, failed close)
- [ ] Session-gated market messaging reviewed (US session text)

### Market Quality

- [ ] Initial launch market set finalized
- [ ] Long/short basket labels are clear and human-readable
- [ ] Each market has a basic rationale / thesis quality pass
- [ ] Full Intelligence Brief pages reviewed for top markets

### Docs (Baseline)

- [ ] Getting Started
- [ ] How WAR.MARKET works
- [ ] How execution works (Pear + Hyperliquid)
- [ ] How to verify positions on Hyperliquid
- [ ] FAQ
- [ ] Roadmap
- [ ] Risk page

### UX / Product Presentation

- [ ] Mobile QA on `home`, `trade`, `portfolio`, `stats`, `about`
- [ ] Empty states and zero states reviewed
- [ ] Splash gate direction finalized (or intentionally deferred)
- [ ] Key copy pass (reduce ambiguity, keep tone)

### Support / Ops (Lightweight)

- [ ] One support channel live (email / Telegram / Discord)
- [ ] Bug report format/template defined
- [ ] Basic troubleshooting notes for common wallet/Pear/HL issues

## GTM Prep (Can Run In Parallel)

### Brand / Channels

- [ ] `X` account for WAR.MARKET (bio, branding, links)
- [ ] Pinned explainer post/thread draft
- [ ] Founder voice/positioning copy finalized

### Content

- [ ] Personal article: hackathon + HIP-3 + why WAR.MARKET
- [ ] Product screenshots and clips
- [ ] Short product one-liner + longer explainer copy

### Beta Recruitment

- [ ] Define beta cohort size and tester profile
- [ ] Build shortlist of testers
- [ ] Create invite message
- [ ] Create feedback form
- [ ] Define test tasks (place, close, verify on HL, report friction)

## Can Ship During Beta (Not Beta Blockers)

- [ ] Charts from Hyperliquid
- [ ] Deeper quant rationale per basket
- [ ] Stats visual polish
- [ ] Links/resources page (fun + useful)
- [ ] More market coverage

## Post-Beta / Roadmap (Later)

- [ ] Community market creation
- [ ] HIP-3 native WAR indices on Hyperliquid
- [ ] `$WAR` token (only if product-justified)
- [ ] Advanced sharing/watchlists/social features

## Open Questions / Decisions

- [ ] Splash gate: preview-only, optional, or default entry flow?
- [ ] Which support channel is primary for beta?
- [ ] Beta cohort size and invite criteria?
- [ ] Which exact markets make v1 beta set?

## Immediate Next Tasks (Recommended Order)

1. Fix stats data integrity (`events` vs `summary`)
2. Implement `/stats` `MY / PROTOCOL` mode switch (signed-in default `MY`)
3. Add `Terms`, `Privacy`, and `Risk` pages + links
4. Audit onboarding copy/steps (HL/Pear/referral)
5. Start closed beta with support + feedback loop

## Change Log (Plan)

- 2026-02-25: Initial implementation plan created from current product decisions and pre-prod launch discussion.

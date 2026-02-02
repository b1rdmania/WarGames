# WAR.MARKET Design/UX Audit (Code-Based)

**Date:** February 2, 2026
**Scope:** UI structure, interaction flow, information hierarchy, mobile behavior, and accessibility patterns observed in the current Next.js app code.

Findings are ordered by severity and include file references.

---

## P1 — Critical

### Primary user journey adds unnecessary friction before trading

**Evidence:** Landing CTA sends users to `/markets` (`src/components/RiskLanding.tsx:32-34`), while markets page is explicitly browse-only and instructs users to switch to Trade (`src/app/markets/MarketsClient.tsx:24`).

**UX impact:** Extra step before core action increases drop-off and decision fatigue.

**Recommendation:** Add a clear primary CTA to `/trade` ("Start Trading") on landing; keep `/markets` as secondary CTA ("Browse Narratives").

**Acceptance criteria:** From landing, first-time user can reach an executable trade panel in one click.

---

### Inactive markets still look immediately tradable

**Evidence:** Trade list always shows active YES/NO buttons (`src/components/MarketFeed.tsx:69-88`), but availability is only blocked later in Bet Slip (`src/components/BetSlipPanel.tsx:174-183`, `src/components/BetSlipPanel.tsx:212-220`).

**UX impact:** Users feel "bait-and-switched" when action fails downstream.

**Recommendation:** In market list, disable YES/NO for inactive markets and replace with "Inactive" + tooltip/reason; keep buttons active only for tradable rows.

**Acceptance criteria:** User can determine tradability before attempting selection.

---

## P2 — Important

### Mobile interaction model is table-heavy and high-friction

**Evidence:** Market feed is table-first with horizontal overflow (`src/components/MarketFeed.tsx:29`, `src/components/MarketFeed.module.css:1-8`), and actions compress on small screens (`src/components/MarketFeed.module.css:200-215`).

**UX impact:** On iOS/mobile, scanning and acting on rows is slower and error-prone.

**Recommendation:** Use responsive card/list layout under ~768px; keep table for desktop only.

**Acceptance criteria:** On mobile, each market appears as a vertically stacked card with large tap targets and no horizontal scrolling required for core actions.

---

### Focus and keyboard affordances are inconsistent

**Evidence:** Buttons/links rely mainly on hover styling (`src/app/globals.css:398-414`, `src/components/TerminalTopNav.module.css:19-25`); input focus exists but control focus patterns aren't standardized (`src/app/globals.css:392-396`).

**UX impact:** Keyboard and assistive navigation lacks clear spatial feedback.

**Recommendation:** Add consistent `:focus-visible` styles to `.tm-btn`, nav links, and action controls with 3:1+ contrast ring.

**Acceptance criteria:** Tab navigation clearly indicates active element across header/nav/trade actions.

---

### High-motion/high-media default without reduced-motion path

**Evidence:** Landing autoplays fullscreen video (`src/components/RiskLanding.tsx:12-14`) and includes perpetual motion indicators (`src/components/RiskLanding.module.css:68-75`).

**UX impact:** Potential accessibility/performance discomfort for motion-sensitive users or slower devices.

**Recommendation:** Respect `prefers-reduced-motion`; disable autoplay animation loops and keep static hero fallback.

**Acceptance criteria:** Reduced-motion users see non-animated hero and stable scroll cue behavior.

---

## P3 — Minor

### Top navigation density on smaller viewports risks clarity

**Evidence:** Header contains brand + nav + wallet/music widgets in a sticky bar (`src/components/RiskShell.tsx:23-37`, `src/components/RiskShell.module.css:67-100`), with compact adjustments on small screens (`src/components/RiskShell.module.css:215-225`).

**UX impact:** Priority actions can become visually compressed on mobile.

**Recommendation:** Collapse non-essential header widgets behind a single mobile utility trigger; preserve primary nav clarity.

**Acceptance criteria:** Mobile header consistently shows brand + clear navigation with minimal crowding.

---

### Action language is stylistically strong but inconsistent across journey

**Evidence:** Mixed action semantics ("Launch App", "YES/NO", "SEND IT", "CASH OUT") across landing/trade/positions (`src/components/RiskLanding.tsx:33`, `src/components/MarketFeed.tsx:77-88`, `src/components/BetSlipPanel.tsx:253`, `src/components/PositionCard.tsx:254`).

**UX impact:** Increases cognitive switching cost, especially for new users.

**Recommendation:** Standardize action verbs by stage:
- Entry: "Start Trading"
- Selection: "Buy Thesis / Short Thesis" or keep "YES/NO" consistently with explanatory copy
- Execution: "Place Trade"
- Exit: "Close Position"

**Acceptance criteria:** Terminology map exists and is applied in all primary CTAs.

---

### Design system is tokenized but duplicated in component CSS islands

**Evidence:** Global token layer in `src/app/globals.css:5-95`; separate shell-local token aliases in `src/components/RiskShell.module.css`.

**UX impact:** Risk of gradual visual drift and inconsistent theming.

**Recommendation:** Keep a single source-of-truth token map and avoid redefining brand aliases per module unless strictly needed.

**Acceptance criteria:** Core colors/type/spacing derive from one token source.

---

## What's Working Well (Keep)

- Clear brand voice and coherent visual identity (terminal + macro narrative framing)
- Strong content hierarchy primitives (`tp-*`, `tm-*`) in global styles
- Trade architecture already separates market discovery and execution cleanly in component structure
- Good use of sticky context (header and bet slip) for persistent orientation during task flow

---

## Recommended Implementation Plan (KISS)

### Phase 1 (1–2 days)
- Add direct landing CTA to `/trade`
- Disable/label inactive markets in feed before selection
- Normalize critical CTA text ("Place Trade", "Close Position")

### Phase 2 (2–4 days)
- Mobile-only market card layout replacing table overflow
- Header simplification on small screens

### Phase 3 (1–2 days)
- `:focus-visible` system-wide pass
- `prefers-reduced-motion` handling for hero video/animations

### Phase 4 (optional cleanup)
- Token consolidation between globals and shell CSS

---

## QA Checklist for Signoff

- [ ] First-time user reaches executable trade panel from landing in one click
- [ ] Inactive markets are non-clickable for execution and clearly labeled
- [ ] iPhone viewport can select market + side + amount + submit without horizontal page/table scrolling
- [ ] Keyboard-only flow supports full trade path with visible focus
- [ ] Reduced-motion mode removes autoplay/continuous animation in hero
- [ ] CTA language is consistent across landing, trade, and portfolio exit flows

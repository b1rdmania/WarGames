# Theme Governance Remediation Log (2026-02-16)

This is a handoff log for the active dev agent workflow.

## Scope

- In scope:
  - Theme governance drift in live terminal UI
  - Non-Intel code hygiene blockers
  - iOS home-page structural centering issue
- Out of scope:
  - Intel page/API behavior (explicitly discontinued)
  - Trade auth coupling (already accepted by product decision)

## Changes Applied

### 1) Theme token governance: terminal shell and landing

Goal: stop hardcoded palette drift and route all live terminal styling through semantic tokens.

- Tokenized `src/components/terminal/terminal.module.css`:
  - Removed direct hex palette usage.
  - Replaced with semantic vars (`--bg-deep`, `--bg-warm`, `--border`, `--primary`, `--text-primary`, `--text-secondary`, `--text-muted`, `--secondary`).
- Tokenized `src/components/RiskLanding.module.css`:
  - Same semantic token migration.
  - Added reusable classes for winner row text (`winnerLine`, `winnerText`) to reduce inline style drift.
- Updated `src/components/terminal/TerminalNav.tsx`:
  - Speaker icon stroke colors now use semantic vars (`--primary`, `--text-muted`, `--secondary`, `--loss`).
  - Removed `INTEL` from top nav items because Intel is discontinued.

Result:
- Terminal + landing now inherit theme correctly from tokens.
- Theme switching no longer fights hardcoded color values in these core live surfaces.

### 2) iOS home-page centering / structure fix

Problem:
- Home hero vertical alignment was unstable on iOS due to brittle `100vh - fixed px` height math.

Fix in `src/components/RiskLanding.module.css`:
- Replaced brittle fixed subtraction model with viewport-relative min height:
  - `min-height: 72vh;`
  - `min-height: 72svh;` (iOS-friendly small viewport unit)
- Added `align-items: center`.
- Added safe-area-aware bottom padding:
  - `padding: 40px 20px max(40px, env(safe-area-inset-bottom));`
- Added mobile override:
  - `min-height: 66svh`
  - tighter mobile padding with safe-area handling.

Result:
- Hero block stays centered more reliably across iOS Safari viewport chrome changes.

### 3) Code hygiene blockers (non-Intel)

#### `src/contexts/ThemeContext.tsx`
- Removed `setState` inside mount effect.
- Replaced with lazy state initializer that reads localStorage safely when `window` exists.
- Keeps persistence logic in effect for side-effects only.

#### `src/components/HeaderWalletWidget.tsx`
- Removed mount effect/setState pattern.
- Replaced with `useSyncExternalStore` client-mounted detection.
- Eliminates `react-hooks/set-state-in-effect` lint blocker.

#### `src/lib/connectWallet.ts`
- Removed `any` usage in error/provider paths.
- Added explicit narrow types:
  - `MaybeErrorLike`
  - `ConnectorWithProvider`
  - `Eip1193Provider`

#### `src/integrations/pear/{auth,errors,positions,websocket}.ts` and `src/components/PositionCard.tsx`
- Removed remaining non-Intel `any` usage in active wallet/position paths.
- Added explicit API response narrowing (`Record<string, unknown>` + typed helper parsing).
- Added safer response coercion defaults for partial Pear payloads.
- Removed noisy raw `console.log` position dump from runtime path.

#### `src/app/briefing/page.tsx`
- Removed `require()` usage.
- Switched to normal `import { redirect } from 'next/navigation'`.

#### `src/app/about/page.tsx`
- Fixed unescaped entity lint blockers:
  - `WHO IT&apos;S FOR`
  - `&quot;risk-off&quot;`

#### `eslint.config.mjs`
- Updated archived import guidance message to include all active themes:
  - `terminal, geocities, norad, control-room`
- Added lint ignores for deprecated Intel surface to align tooling with product scope:
  - `src/app/intel/**`
  - `src/app/api/intel/**`

## Follow-up Recommended (next pass)

1. Remove remaining large inline style usage from high-traffic pages (`trade`, `markets`, `about`, `intel`) into CSS modules to reduce drift.
2. Decide whether to:
   - hard-disable `/intel` route, or
   - keep it as a hidden/degraded internal route.
3. Run a focused lint cleanup for non-Intel files to establish a clean baseline CI gate.
4. Archive or remove legacy unused components once confirmed not referenced by current routes.

## Verification commands

Run locally:

```bash
npm run check:theme
npm run build
npm run lint
```

Note:
- Current lint output still includes Intel-path issues by design if Intel files remain in tree.

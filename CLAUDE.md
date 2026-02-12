# WAR.MARKET

## Current Status: POST-HACKATHON / NORAD DESIGN LIVE + THREE-THEME COHERENCE

**Updated:** 2026-02-11
**Live:** https://www.war.market
**Docs:** https://docs.war.market
**Repo:** https://github.com/b1rdmania/WarGames

---

## What It Is

**WAR.MARKET** — Trade narratives, not tickers.

One-click trading terminal for macro narratives on Hyperliquid via Pear Protocol. Pick a thesis, click YES or NO, Pear executes the leveraged basket atomically.

---

## Recent Work (2026-02-06 Session)

### War Room Intel Page — NEW
- `/intel` — Live intelligence dashboard with real data feeds
- API proxy routes for summary, breaking news, markets, ticker, flow, events
- Real-time macro telemetry: risk score, forecast windows, narrative tracking
- Credit spreads, volatility indices, Solana DeFi stats
- Auto-refreshing every 30 seconds with latency tracking

### NORAD Design System — LIVE
- Full NORAD mission-control aesthetic implemented
- Root page now shows Design System Labs (pick DOS/Norton, Bloomberg, or NORAD)
- Trade and Portfolio pages fully migrated to NORAD layout
- Military command center vibes: cyan telemetry, lime execute states, amber warnings

### Components Updated
- **IntelClient** — War Room intelligence dashboard
- **IntelStrip** — Breaking news/intel ticker component
- **PearSetupCard** — NORAD styling (cyan/lime, not orange)
- **BetSlipPanel** — NORAD styling, fixed "Long Leg / Short Leg" display
- **NoradTradeSurface** — Situation Board, Event Log, Mission Console
- **NoradPortfolioSurface** — Position command center
- **World Map** — Real Wikimedia map with CSS filters for cyan tint

### Design System Labs
- `/labs` — Index with three design variants
- `/labs/norad` — NORAD demo (selected as primary)
- `/labs/bloomberg` — Bloomberg terminal demo
- `/labs/dos-norton` — DOS/Norton Commander demo

---

## Three-Theme Coherence Program (2026-02-11 Session)

Implemented a clean architectural governance system to manage three active design themes.

### **What Was Implemented**

**Phase 1: Foundation**
- ✅ Canonical theme registry at `src/themes/index.ts`
- ✅ ThemeContext updated to support all 3 themes (terminal, geocities, norad)
- ✅ DOS/Norton renamed → Terminal (with legacy redirect)
- ✅ Bloomberg archived → `_archive/bloomberg`
- ✅ Labs index derives from `ACTIVE_THEMES` registry

**Phase 2: Token Isolation**
- ✅ Terminal tokens → `src/themes/terminal/tokens.css`
- ✅ GeoCities tokens → `src/themes/geocities/tokens.css`
- ✅ NORAD tokens → `src/themes/norad/tokens.css`
- ✅ Refactored `globals.css` from 663 → 407 lines (pure primitives)
- ✅ All theme-specific colors/fonts isolated to per-theme CSS files

**Phase 3: Enforcement**
- ✅ ESLint rules block archived imports (`_archive/**`)
- ✅ CI script: `scripts/check-theme-coherence.sh` (4 validation checks)
- ✅ PR template with theme coherence checklist
- ✅ npm script: `npm run check:theme`

### **Active Themes**
| Theme ID | Label | Description |
|----------|-------|-------------|
| `terminal` | Terminal | Command-line aesthetic (warm amber/violet) |
| `geocities` | GeoCities | 1998 nostalgia (bright colors, Comic Sans, GIFs) |
| `norad` | NORAD | Mission control (cyan telemetry, lime execute) |

### **Governance Tools**
```bash
# Run theme coherence checks
npm run check:theme

# What it validates:
# ✓ Only allowed theme IDs used (no dos-norton, bloomberg)
# ✓ No imports from _archive directories
# ✓ All theme token files present
# ✓ Theme registry is complete
```

### **Key Files**
| What | Path |
|------|------|
| Theme Registry | `src/themes/index.ts` |
| Terminal Tokens | `src/themes/terminal/tokens.css` |
| GeoCities Tokens | `src/themes/geocities/tokens.css` |
| NORAD Tokens | `src/themes/norad/tokens.css` |
| Globals (primitives) | `src/app/globals.css` |
| Coherence Script | `scripts/check-theme-coherence.sh` |
| Governance Docs | `docs/design-governance/` |

### **Architecture**
- **Single Source of Truth**: `src/themes/index.ts` registry defines all active themes
- **Token Isolation**: Theme-specific colors/fonts in per-theme CSS files (not globals)
- **Data Attributes**: Theme switching via `[data-theme="X"]` CSS selectors
- **Archive Policy**: Inactive themes moved to `_archive/` with import restrictions
- **CI Enforcement**: Automated checks prevent theme violations

---

## Site Map

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Design System Labs picker | No |
| `/intel` | War Room intelligence dashboard | No |
| `/labs/norad` | NORAD design demo | No |
| `/labs/terminal` | Terminal design demo (fka DOS/Norton) | No |
| `/labs/geocities` | GeoCities design demo | No |
| `/labs/dos-norton` | Legacy redirect → `/labs/terminal` | No |
| `/labs/_archive/bloomberg` | Archived Bloomberg demo | No |
| `/markets` | Browse markets (read-only) | No |
| `/markets/[id]` | Market detail | No |
| `/trade` | NORAD trade terminal | Yes |
| `/portfolio` | NORAD portfolio command | Yes |
| `/about` | About page | No |

---

## Design System (NORAD)

### Color Roles
| Role | Color | Use |
|------|-------|-----|
| Telemetry | `#36d4ff` (cyan) | System chrome, labels, section titles |
| Signal/Execute | `#02ff81` (lime) | Armed states, CTAs, success |
| Warning | `#f5a623` (amber) | Alerts, caution states |
| Fault | `#ff6b6b` (red) | Errors, loss, danger |
| Intel | `#cfbeff` (violet) | Meta info, not CTA |

### Background Colors
| Token | Hex | Use |
|-------|-----|-----|
| norad-bg | #070d14 | Page background |
| norad-surface | #0e1822 | Panels |
| norad-panel | #101c28 | Cards, inputs |
| norad-grid | #234055 | Borders, dividers |

### Typography
- **UI:** Inter (600 headings, 400 body)
- **Data/Mono:** JetBrains Mono

### Structural Grammar
- **Situation Board** — Map + market list
- **Event Log** — Timestamped operations feed
- **Mission Console** — Trade execution panel
- **Status Rail** — Footer with system status

---

## Core App Files

```
src/
├── app/
│   ├── page.tsx                    # Root → Design Labs picker
│   ├── intel/
│   │   ├── IntelClient.tsx         # War Room dashboard
│   │   ├── page.tsx                # Intel page wrapper
│   │   └── warroom.module.css      # War Room styling
│   ├── api/intel/                  # Intel API proxy routes
│   │   ├── breaking/route.ts       # Breaking news feed
│   │   ├── events/route.ts         # Market events
│   │   ├── extra/route.ts          # DeFi stats
│   │   ├── flow/route.ts           # Flow data (Solana, credit, vol)
│   │   ├── markets/route.ts        # Market tape
│   │   ├── summary/route.ts        # Risk score, narratives, forecast
│   │   └── ticker/route.ts         # Intel feed
│   ├── trade/
│   │   ├── TradeClient.tsx         # NORAD trade page
│   │   └── trade.module.css
│   ├── portfolio/
│   │   ├── PortfolioClient.tsx     # NORAD portfolio page
│   │   └── portfolio.module.css
│   └── labs/
│       ├── page.tsx                # Labs index (derives from theme registry)
│       ├── terminal/               # Terminal demo (fka DOS/Norton)
│       ├── geocities/              # GeoCities demo
│       ├── norad/                  # NORAD demo
│       ├── dos-norton/             # Legacy redirect → terminal
│       └── _archive/
│           └── bloomberg/          # Archived Bloomberg demo
├── components/
│   ├── NoradTradeSurface.tsx       # Main trade layout
│   ├── NoradTradeSurface.module.css
│   ├── NoradPortfolioSurface.tsx   # Main portfolio layout
│   ├── NoradPortfolioSurface.module.css
│   ├── IntelStrip.tsx              # Intel ticker strip
│   ├── IntelStrip.module.css
│   ├── PearSetupCard.tsx           # Auth card (NORAD styled)
│   ├── PearSetupCard.module.css
│   ├── BetSlipPanel.tsx            # Trade panel (NORAD styled)
│   ├── BetSlipPanel.module.css
│   └── WorldMapSvg.tsx             # (unused, using CSS bg instead)
├── integrations/pear/
│   ├── markets.ts                  # Market definitions
│   ├── auth.ts                     # EIP-712 auth
│   ├── positions.ts                # Trade execution
│   └── agent.ts                    # Agent wallet
├── themes/
│   ├── index.ts                    # Canonical theme registry (single source of truth)
│   ├── terminal/
│   │   └── tokens.css              # Terminal theme tokens (amber/violet)
│   ├── geocities/
│   │   └── tokens.css              # GeoCities theme tokens (bright 90s)
│   └── norad/
│       └── tokens.css              # NORAD theme tokens (cyan/lime)
└── contexts/
    ├── PearContext.tsx             # Auth state
    └── ThemeContext.tsx            # Theme state (supports all 3 themes)
```

---

## Design Resources

### Reference Images
```
terminal_ref/
├── CleanShot 2026-02-03 at 18.44.09@2x.png
├── CleanShot 2026-02-03 at 18.44.24@2x.png
├── CleanShot 2026-02-03 at 18.44.39@2x.png
├── CleanShot 2026-02-03 at 18.44.52@2x.png
├── War-Room-Film-Set-1983-WarGames.webp    # WarGames movie reference
├── vintage-computing-nostalgia-stockcake.webp
└── vintage-terminal-room-stockcake.webp
```

### NORAD Design Specs (start here for design work)
```
docs/design-systems/
├── norad-system.md                 # ← PRIMARY: Full NORAD spec
├── norad-iteration-brief.md        # Iteration notes & refinements
├── archetype-research.md           # DOS/Bloomberg/NORAD research
├── index.md                        # Overview
├── dos-norton-system.md            # DOS/Norton spec
└── bloomberg-system.md             # Bloomberg spec
```

### Key Files for Designers
| What | Path |
|------|------|
| Theme Registry | `src/themes/index.ts` |
| NORAD spec | `docs/design-systems/norad-system.md` |
| NORAD tokens | `src/themes/norad/tokens.css` |
| Terminal tokens | `src/themes/terminal/tokens.css` |
| GeoCities tokens | `src/themes/geocities/tokens.css` |
| Globals (primitives) | `src/app/globals.css` |
| Trade surface CSS | `src/components/NoradTradeSurface.module.css` |
| Portfolio surface CSS | `src/components/NoradPortfolioSurface.module.css` |
| Reference images | `terminal_ref/` |

---

## Commands

```bash
# App
npm run dev              # Local dev
npm run build            # Production build
npm run lint             # ESLint checks

# Theme Coherence
npm run check:theme      # Validate theme architecture (4 checks)

# Docs
npm run docs:dev         # Docs dev server
npm run docs:build       # Build docs

# Deploy (if auto-deploy not working)
vercel --prod --yes      # Deploy to war.market
```

---

## Deployment

- **App:** Vercel project `war-markets` → war.market
- **GitHub:** `b1rdmania/WarGames` repo
- **Auto-deploy:** Pushes to `main` trigger Vercel builds

Manual deploy if needed:
```bash
cd war-markets-brand-test
vercel --prod --yes
```

---

## Current Markets

**Crypto (24/7):**
- The Flippening (ETH vs BTC)
- Solana Surge (SOL vs ETH)
- HYPE Train (HYPE vs BTC)

**Geopolitical (Weekdays 9:30am-4pm ET):**
- Taiwan Strait Crisis
- AI Bubble Pop
- Middle East Oil Shock
- Risk On/Risk Off

---

## Git History (Recent)

- `62b76f2` — Use Wikimedia world map image with CSS filters
- `57039e0` — NORAD styling for PearSetupCard, BetSlipPanel + world map
- `a88cb0a` — Full NORAD styling for trade and portfolio pages
- `af49150` — Move design labs to root page
- `8cd3c4f` — Migrate portfolio flow to NORAD mission-control surface
- `7942b52` — Migrate trade page to NORAD mission-control layout

---

## Links

- **App:** https://www.war.market
- **Docs:** https://docs.war.market
- **Repo:** https://github.com/b1rdmania/WarGames
- **X:** https://x.com/b1rdmania
- **Pear:** https://www.pear.garden

---

## Credits

Made by @b1rdmania
Music made in wario.style

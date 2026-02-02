# WAR.MARKET

## Current Status: POST-HACKATHON / PRODUCTION

**Updated:** 2026-02-02
**Live:** https://www.war.market
**Docs:** https://docs.war.market
**Repo:** https://github.com/b1rdmania/WarGames

---

## What It Is

**WAR.MARKET** — Trade narratives, not tickers.

One-click trading terminal for macro narratives on Hyperliquid via Pear Protocol. Pick a thesis, click YES or NO, Pear executes the leveraged basket atomically.

---

## Recent Work (2026-02-02 Session)

### Brand Redesign — COMPLETE
- Fintech v2 design merged to main and live
- Removed hackathon aesthetic (scan lines, noise, brackets, BETA badges)
- Clean Inter typography, amber for CTAs only
- Premium fintech feel, not startup-y

### Documentation Site — LIVE
- VitePress docs at https://docs.war.market
- Guide: how it works, first trade, markets, risk
- Brand: philosophy, voice (Orwell rules), design system, assets
- Run locally: `npm run docs:dev`

### Commodity Markets Research — DRAFT
- 5 new market proposals for dollar weakness thesis
- Saved in `docs/research/commodity-markets-draft.md`
- Needs quant/hedge fund review before implementation
- Markets: Dollar Debasement, Commodity Supercycle, Energy Crisis, Gold vs Tech, BTC Digital Gold

---

## Key Locations

### Brand Assets
```
/Users/andy/Downloads/warmarket-brand-kit/
├── README.md                    # Quick reference
├── warmarket-philosophy.md      # Voice, principles
├── warmarket-design-guidelines.md
├── FINTECH-V2-GUIDELINES.md     # Latest design system
├── warmarket-mark-final.svg
├── warmarket-wordmark-final.svg
└── warmarket-favicon.png
```

### Documentation
```
docs/
├── index.md                     # Home
├── guide/                       # User guide
│   ├── index.md                 # What is war.market
│   ├── how-it-works.md
│   ├── first-trade.md
│   ├── markets.md
│   ├── markets-geopolitical.md
│   ├── markets-crypto.md
│   ├── trading.md
│   ├── positions.md
│   └── risk.md
├── brand/                       # Brand guidelines
│   ├── index.md                 # Philosophy
│   ├── voice.md                 # Orwell rules
│   ├── design.md                # Design system
│   └── assets.md                # Logo, colors, CSS
└── research/
    └── commodity-markets-draft.md
```

### Core App Files
```
src/
├── integrations/pear/
│   ├── markets.ts               # Market definitions
│   ├── auth.ts                  # EIP-712 auth
│   ├── positions.ts             # Trade execution
│   └── agent.ts                 # Agent wallet
├── components/
│   ├── RiskShell.tsx            # Main layout wrapper
│   ├── RiskLanding.tsx          # Landing page
│   ├── MarketFeed.tsx           # Trading market list
│   ├── MarketFeedReadOnly.tsx   # Browse market list
│   ├── BetSlipPanel.tsx         # Trade panel
│   └── PositionCard.tsx         # Position display
└── contexts/
    └── PearContext.tsx          # Auth state
```

---

## Commands

```bash
# App
npm run dev              # Local dev (warning: may crash machine)
npm run build            # Production build

# Docs
npm run docs:dev         # Docs dev server
npm run docs:build       # Build docs
```

---

## Design System (Fintech V2)

### Colors
| Token | Hex | Use |
|-------|-----|-----|
| bg-deep | #0e0e10 | Page background |
| bg-warm | #18171c | Cards |
| text-primary | #e8e6ed | Headings |
| text-secondary | #a8a3b3 | Body |
| text-muted | #6b6879 | Labels |
| amber | #f97316 | CTAs only |
| profit | #22c55e | Positive P&L |
| loss | #ef4444 | Negative P&L |

### Typography
- **UI:** Inter (600 headings, 400 body)
- **Data:** JetBrains Mono

### Voice Rules (Orwell)
- Short sentences
- Active voice
- No qualifiers
- No marketing speak
- Amber for CTAs only

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

**Proposed (needs quant review):**
- Dollar Debasement Trade
- Commodity Supercycle
- Energy Crisis Returns
- Gold vs Tech
- Bitcoin Digital Gold

---

## Pear Asset Prefixes

| Prefix | Type | Example |
|--------|------|---------|
| (none) | Crypto | BTC, ETH, SOL |
| xyz: | Equities/Commodities | xyz:NVDA, xyz:GOLD, xyz:CL |
| km: | Indices | km:US500 |
| vntl: | Thematic | vntl:SEMIS |

---

## Git Branches

- `main` — Production (deployed to war.market)
- `fintech-v2` — Brand redesign (merged)
- `brand-redesign` — Safety net / rollback point
- `terminal-v1` — Rejected terminal experiment

---

## Deployment

- **App:** Vercel auto-deploys from `main` → war.market
- **Docs:** Manual deploy from `docs/.vitepress/dist` → docs.war.market

To redeploy docs:
```bash
npm run docs:build
cd docs/.vitepress/dist
npx vercel --prod --yes
```

---

## Next Steps

1. [ ] Get quant review on commodity markets
2. [ ] Implement approved markets
3. [ ] Add charts (Hyperliquid integration)
4. [ ] Mobile responsive polish
5. [ ] Marketing site improvements

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

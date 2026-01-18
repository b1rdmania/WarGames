# WAR.MARKET - Hackathon Project Description

## One-Line Pitch
**Trade geopolitical narratives and tech trends through leveraged pair positions on Hyperliquid using Pear Protocol.**

---

## Project Overview

**WAR.MARKET** is a narrative trading platform that lets users bet on macro events and market trends through pair trading mechanics. Instead of complex DeFi interfaces, users get a simple "bet up/down" experience on narratives like "Trump presidency impact on crypto" or "AI vs Crypto adoption by 2027."

---

## How It Works

1. **Connect wallet**
2. **Authenticate** - Sign an EIP-712 message to authenticate with Pear Protocol
3. **Agent wallet** - Create (and approve) a non-custodial agent wallet for execution
4. **Choose a narrative** - Browse markets (7 curated narratives)
5. **Place bets** - Execute leveraged pair trades via Pear (e.g., long ETH / short BTC for \"The Flippening\")
6. **Track positions** - View positions and close them via the API

---

## Technical Stack

**Integrations:**
- **Pear Protocol** - Pair trading execution, agent wallets, position management
- **Hyperliquid** - Settlement layer (via Pear execution engine)
- **Wagmi + Viem** - Wallet connection and EIP-712 signing

**Frontend:**
- Next.js (App Router) with TypeScript
- Terminal-style UI with neon green aesthetics
- Mobile-optimized for Gen Z traders

---

## Hackathon Tracks

### Track 1: Pear Execution API ($3,500)
- ✅ Real trade execution via Pear API
- ✅ Unlocks new behavior: narrative-based trading vs pure technical analysis
- ✅ Target audience: Crypto natives who follow geopolitical/macro trends

### Track 2: Bridging (out of scope)
We are not focusing on bridging for this submission. The demo is a reliable Pear execution flow and a functional trading terminal.

---

## Markets Offered

**Macro Narratives:**
1. **AI Bubble Pop** - Are AI valuations sustainable? (QQQ vs NVDA)
2. **Japan Awakens** - Japanese equities break 30-year stagnation (EWJ vs SPY)
3. **Deglobalization Trade** - Friend-shoring vs China dominance (EWI vs FXI)
4. **GCC Tech Pivot** - Saudi Vision 2030 succeeds vs oil dependence (QQQ vs USO) *← Ultra-niche*

**Tech Trends:**
5. **The Flippening** - Will ETH overtake BTC? (ETH vs BTC)
6. **Space Economy Boom** - Space industry vs legacy aerospace (ARKX vs BA)
7. **VR Metaverse Reality** - VR goes mainstream or stays niche (META vs AAPL)

---

## Key Features

- **EIP-712 Authentication** - Secure wallet-based login via Pear Protocol
- **Agent Wallets** - Automated trading execution without manual approvals
- **Leveraged Positions** - 2-3x leverage on pair trades
- **Functional balances UX** - Show spot/perp balances and enable trading only when funded
- **Mobile-First** - Designed for mobile betting experience
- **Terminal Aesthetic** - Hacker/terminal-style UI with neon green accents

---

## Innovation

**Why it's different:**
- **Narrative-first** instead of asset-first (bet on stories, not just tickers)
- **Pair trading** simplifies complex macro bets into single positions
- **Gen Z UX** - "betting" language instead of "trading" jargon
- **One-click access** - fast setup and clear UX (wallet → Pear auth → trade)

**Target users:**
- Crypto-native traders following geopolitics
- Macro trend speculators
- DeFi users wanting simplified leveraged exposure

---

## Current Status

**Completed:**
- ✅ Pear Protocol API integration (auth, positions, agent wallets)
- ✅ Wallet connection (MetaMask, WalletConnect)
- ✅ UI/UX design (terminal style, mobile-responsive)
- ✅ 7 curated narrative markets (including ultra-niche GCC Tech Pivot)

**In Progress:**
- 🔄 End-to-end testing (auth flow, position execution)
- 🔄 Error handling and edge cases
- 🔄 Demo video recording

**Next Steps:**
- Position execution testing
- Balances + readiness gating (spot/perp USDC) and error handling
- Final polish and deployment

---

## Demo Flow (3 minutes)

1. **Connect wallet** → Click "CONNECT WALLET" (MetaMask)
2. **Authenticate** → Sign EIP-712 message → Agent wallet created
3. **Confirm funded** → Show spot/perp balances and readiness
4. **Browse markets** → Choose "The Flippening" market
5. **Place bet** → Bet "UP" (long ETH/short BTC) → 3x leverage → $50 USDC
6. **View position** → Real-time P&L display in "YOUR BETS" panel
7. **Close position** → One-click close → Realize profit/loss

---

## Links

- **GitHub:** [To be deployed]
- **Live Demo:** [To be deployed on Vercel]
- **Video Demo:** [To be recorded]

---

## Team

Solo developer: Andy (building full-stack)

---

## Why We'll Win

1. **Functional Pear execution demo** - Auth, agent wallet, funded balances, open/close position
2. **Solves real problem** - Makes macro trading accessible to crypto natives
3. **Clean integration** - Proper use of both APIs, not just surface-level
4. **Target audience match** - Built for Hyperliquid's existing trader base
5. **Mobile-optimized** - Works great on phones (most traders are mobile-first)

---

## Tagline for Presentation

> **"Bet on what moves markets, not just what's on the chart."**
> WAR.MARKET - Narrative trading for the crypto generation.

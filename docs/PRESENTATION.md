# WAR.MARKET

## Trade narratives, not tickers

**Hyperliquid London Hackathon | Jan 16-18, 2026**

---

## The Problem

Crypto traders think in narratives:

- "AI bubble will pop"
- "ETH will flip BTC"
- "Taiwan crisis will wreck TSMC-dependent stocks"

But they have to manually construct positions across multiple assets.

**No easy way to express a macro thesis as a single trade.**

---

## The Solution

**Curated narrative markets as pre-built long/short baskets.**

- One click to bet YES or NO on a thesis
- Pear Protocol executes the basket atomically
- Settled on Hyperliquid

---

## Example Markets

| Market | YES (Long) | NO (Short) |
|--------|-----------|------------|
| **The Flippening** | ETH | BTC |
| **Solana Surge** | SOL | ETH |
| **AI Bubble Pop** | GOLD + INTC | NVDA + META |
| **Taiwan Strait Crisis** | US fabs (INTC, AMD) | TSMC-dependent (NVDA, AAPL) |
| **Middle East Oil Shock** | Oil + Gold + BTC | S&P500 + TSLA |

---

## How It Works

```
1. Connect wallet (HyperEVM)
         ↓
2. Authenticate with Pear (creates agent wallet)
         ↓
3. Pick a market, click YES or NO
         ↓
4. Pear executes basket on Hyperliquid
         ↓
5. Track position in Portfolio
```

---

## Tech Stack

| Layer | Tech | Track |
|-------|------|-------|
| **Execution** | Pear Protocol | Pear Execution API |
| **Bridging** | LI.FI | LI.FI Onboarding |
| **Settlement** | Hyperliquid | — |
| **Frontend** | Next.js + wagmi | — |

---

## Pear Integration

- EIP-712 authentication flow
- Agent wallet (non-custodial)
- Basket execution with weighted assets
- Position tracking + close

---

## LI.FI Integration

- Bridge from Ethereum, Arbitrum, Base, Optimism
- Route discovery to HyperEVM
- One-click onboarding for new users

---

## Demo

**Live:** [war.market](https://war.market)

**Flow:**
1. Land on splash → Enter app
2. Connect MetaMask on HyperEVM
3. Authenticate with Pear
4. Pick "The Flippening" → Click YES
5. Confirm trade → See position

---

## What's Next

- **More markets** — User-submitted narratives
- **Resolution mechanics** — Time-bound event markets
- **Social** — Leaderboards, position sharing
- **Mobile** — PWA for trading on the go

---

## Links

- **Live:** [war.market](https://war.market)
- **GitHub:** [github.com/b1rdmania/WarGames](https://github.com/b1rdmania/WarGames)
- **Twitter:** [@b1rdmania](https://x.com/b1rdmania)
- **Music:** [wario.style](https://wario.style)

---

## Built by @b1rdmania

Hyperliquid London Hackathon 2026

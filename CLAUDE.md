# Hyperliquid Hackathon - WAR.MARKET

## Current Status: SUBMISSION READY

**Date:** 2026-01-18 (Day 3 of 3 - Final Day)
**Track:** Pear Execution API
**Live:** https://www.war.market
**Repo:** https://github.com/b1rdmania/WarGames

---

## What We Built

**WAR.MARKET** — Trade narratives, not tickers.

A one-click trading terminal for macro narratives on Hyperliquid via Pear Protocol. Users pick a thesis (e.g., "AI Bubble Pop" or "Taiwan Strait Crisis"), click YES or NO, and Pear executes the leveraged long/short basket atomically.

---

## Key Features Completed

- Full Pear auth flow (EIP-712 + agent wallet creation)
- Real execution on Hyperliquid mainnet
- 7 narrative markets (4 geopolitical + 3 crypto)
- Portfolio tracking with live P&L
- Position close functionality
- HyperEVM chain detection and soft prompts
- Terminal aesthetic UI with custom music

---

## Markets

**Crypto (24/7 trading):**
- The Flippening (ETH vs BTC)
- Solana Surge (SOL vs ETH)
- HYPE Train (HYPE vs BTC)

**Geopolitical (Weekdays 9:30am-4pm ET only):**
- Taiwan Strait Crisis
- AI Bubble Pop
- Middle East Oil Shock
- Risk On/Risk Off

---

## Site Map

- `/` — Splash / landing
- `/markets` — Browse-only market list (geopolitical only)
- `/markets/[id]` — Market dossier
- `/trade` — Trading terminal (auth + execution, all markets)
- `/portfolio` — Positions + P&L
- `/about` — About page with roadmap
- `/deck` — Presentation slides

---

## Tech Stack

- **Frontend:** Next.js 16 (App Router) + TypeScript
- **Wallet:** wagmi + viem
- **Execution:** Pear Protocol API (auth, agent wallets, positions)
- **Settlement:** Hyperliquid (via Pear)
- **Music:** Custom tracks from wario.style

---

## Key Files

**Markets config:** `src/integrations/pear/markets.ts`
- All market definitions with baskets and pairs
- Symbol prefixes: `xyz:` (equities), `km:` (indices), `vntl:` (thematic), none (crypto)

**Pear integration:**
- `src/integrations/pear/auth.ts` — EIP-712 auth flow
- `src/integrations/pear/positions.ts` — Trade execution + position management
- `src/integrations/pear/agent.ts` — Agent wallet creation
- `src/contexts/PearContext.tsx` — Auth state management

**UI components:**
- `src/components/BetSlipPanel.tsx` — Inline trade panel
- `src/components/MarketFeed.tsx` — Market list for trading
- `src/components/MarketFeedReadOnly.tsx` — Browse-only market list
- `src/components/PearSetupCard.tsx` — Auth UI with HyperEVM detection

---

## Known Issues / Notes

- Equity markets (xyz: prefix) only trade Mon-Fri 9:30am-4pm ET
- Error message shows "Market closed fml" for weekend equity trades
- HyperEVM chainId can be 999 or 14601 (both recognized)
- Music mute stops all audio elements on page
- UX is intentionally rough — hackathon MVP

---

## Hackathon Materials

**Presentation deck:** `/deck` route or `docs/PRESENTATION.md`

**Pitch flow (3 mins):**
1. Hook + HIP-3 context (60 secs)
2. Personal angle ("bad at trading, geopolitics nerd")
3. Live demo: markets → trade → auth → bet → portfolio (90 secs)
4. Wrap + links (30 secs)

**Full pitch script:**

> WAR.MARKET. Trade narratives, not tickers.
>
> So HIP-3 is really interesting — it lets you list real-time synthetic markets that just don't work on EVM chains because of oracle latency. Trade.xyz and Ventuals are doing great stuff here. But listing a new HIP-3 market costs around $20 million in stake. That's not happening this weekend.
>
> Pear gives us that exposure now — pair trades on existing Hyperliquid perps. When I saw the Pear API in this hackathon, I knew what I wanted to build.
>
> Here's the thing — I'm bad at trading. But I'm a geopolitics nerd. I can tell you what happens if Taiwan gets blockaded or if AI capex collapses. I just couldn't express that as a trade. So I built this for myself.
>
> WAR.MARKET turns a macro thesis into a one-click leveraged basket. You pick a narrative. You click YES or NO. Pear executes the long/short legs atomically on Hyperliquid. One thesis. One button. One position.
>
> Let me show you.
>
> This is the markets page. Each market is a narrative with a thesis and a breakdown of what's in the basket. Taiwan Strait Crisis — long US fabs like Intel and AMD, short TSMC-dependent names like Nvidia and Apple.
>
> Now I go to trade. Connect my wallet — I'm on HyperEVM. Hit authenticate with Pear. Sign the message — this creates a non-custodial agent wallet. Done.
>
> Now I pick a market. Let's do The Flippening — ETH outperforms BTC. I click YES. Set my size. Confirm.
>
> Portfolio page — there's my position. P&L updates live. When I'm done, I hit close and cash out.
>
> That's it. Thesis to trade in 30 seconds.
>
> Built in 3 days. The equity markets are closed right now because it's the weekend, so I added crypto pairs that work 24/7. UX is rough — I'm not a designer — but the execution works. It's live on Hyperliquid mainnet right now.
>
> Oh, and the music in the app? Made it myself with a Gameboy MIDI emulator I built over Christmas.
>
> Thanks.

---

## Demo Video Script (3 mins)

Same as pitch script above. Keep demo clicks smooth. Use crypto markets (work 24/7).

---

## Submission Details (for form)

**WAR.MARKET** is a one-click trading terminal for macro narratives built on Hyperliquid via Pear Protocol.

**What it does:** Users pick a narrative thesis (e.g., "AI Bubble Pop" or "Taiwan Strait Crisis") and trade it as a leveraged long/short basket with a single click. Pear executes the basket legs atomically. No manual position construction — just pick a side and trade.

**How it works:** Connect wallet on HyperEVM → Authenticate with Pear (EIP-712 signature creates a non-custodial agent wallet) → Select a market → Click YES or NO → Pear executes the basket on Hyperliquid → Monitor P&L and close from the portfolio page.

**Tech stack:** Next.js + wagmi frontend, Pear Execution API for authentication and trade execution, Hyperliquid for settlement.

**Key achievements:**
- Full auth flow with Pear (EIP-712 + agent wallet creation)
- Real execution on mainnet — not a mock
- Multiple narrative markets with weighted baskets (geopolitical + crypto)
- Portfolio tracking with live P&L and close functionality
- Built and shipped in 3 days

**Why it matters:** HIP-3 opens the door to synthetic markets that don't work on EVM chains, but listing new markets requires significant stake. Pear provides that exposure now through pair trades. WAR.MARKET packages this into a degen-friendly interface — one thesis, one button, one position.

---

## Discord Post

My HyperLiquid Hackathon submission (Pear API track)

**WAR.MARKET** — Trade narratives, not tickers.

One-click trading terminal for geo-political macro narratives on Hyperliquid.

Pick a thesis like "AI Bubble Pop" or "Taiwan Strait Crisis", click YES or NO, and Pear executes the basket.

Built in 3 days. Live on HyperLiquid mainnet.

🔗 https://www.war.market
📂 https://github.com/b1rdmania/WarGames

Built with:
⚡ Pear Protocol API — https://www.pear.garden
🎮 Music via wario.style — https://wario.style

---

## Roadmap (on About page)

1. Win hackathon
2. UX redesign for production
3. Audit / codebase review
4. Quant advice on market structures
5. Integrate charts from HL
6. Custom historic charts per market
7. Build GTM team of rabid degens
8. Launch X
9. Go LIVE
10. $WAR token
11. Raise stake for HIP-3 auction
12. HIP-3 markets for novel WAR indices
13. World Peace

---

## Links

- **Live:** https://www.war.market
- **Deck:** https://www.war.market/deck
- **Repo:** https://github.com/b1rdmania/WarGames
- **X:** https://x.com/b1rdmania
- **Music:** https://wario.style
- **Pear:** https://www.pear.garden

---

## Credits

Made by @b1rdmania
Music made in wario.style

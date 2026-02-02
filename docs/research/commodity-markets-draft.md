# Commodity Markets Research — DRAFT

> **Status:** Research phase. Needs quant/hedge fund review before implementation.
> **Date:** 2026-02-02
> **Author:** Claude + Andy
> **Next step:** Get macro PM or quant co-sign on thesis + weights

---

## Thesis: Dollar Weakness / Hard Asset Rotation

Core belief: USD losing purchasing power. Hard assets (commodities, gold, BTC) outperform paper assets (growth stocks, tech).

---

## Available Pear Assets

**Commodities:**
- `xyz:GOLD` — Gold
- `xyz:CL` — Crude oil
- `PAXG` — Tokenized gold (24/7)

**FX:**
- `xyz:EUR` — Euro
- `xyz:JPY` — Yen

**Indices:**
- `km:US500` — S&P 500
- `vntl:SEMIS` — Semiconductors

**Relevant equities:**
- `xyz:MSTR` — MicroStrategy (BTC proxy)
- `xyz:COIN` — Coinbase
- `xyz:NVDA`, `xyz:META`, `xyz:TSLA`, `xyz:GOOGL`, `xyz:AMZN`, `xyz:AAPL`

---

## Proposed Markets

### 1. Dollar Debasement Trade

**Thesis:** "Fed prints. Dollar weakens. Gold and BTC win. Tech paid for with cheap dollars dies."

| Side | Assets | Weights |
|------|--------|---------|
| Long | GOLD, BTC, OIL | 45%, 35%, 20% |
| Short | NVDA, META, TSLA | 40%, 30%, 30% |

**Leverage:** 2x

**Rationale:**
- Gold/BTC negative correlation to real yields
- Dollar weakness = commodity prices rise (USD-denominated)
- High-multiple growth crushed when discount rates rise

**Questions for quant review:**
- [ ] Historical correlation GOLD/BTC in dollar weakness regimes?
- [ ] Optimal weights based on vol-adjusted returns?
- [ ] Should we add EUR long instead of OIL?

---

### 2. Commodity Supercycle

**Thesis:** "Decade of underinvestment. Demand rising. Supply constrained. Real beats paper."

| Side | Assets | Weights |
|------|--------|---------|
| Long | OIL, GOLD, PAXG | 40%, 35%, 25% |
| Short | US500, AMZN | 60%, 40% |

**Leverage:** 2x

**Rationale:**
- Commodity capex collapsed 2014-2020
- ESG restrictions = structural undersupply
- Central banks hoarding gold
- S&P 500 is 30%+ tech

**Questions for quant review:**
- [ ] Is PAXG redundant with GOLD or useful for 24/7 coverage?
- [ ] Better short leg candidates? (financials instead of AMZN?)
- [ ] Historical commodity supercycle duration/magnitude?

---

### 3. Energy Crisis Returns

**Thesis:** "Europe froze. Asia's next. Oil above $100 kills risk assets."

| Side | Assets | Weights |
|------|--------|---------|
| Long | OIL, GOLD, BTC | 60%, 25%, 15% |
| Short | TSLA, US500, AAPL | 45%, 35%, 20% |

**Leverage:** 3x

**Rationale:**
- Energy crisis = stagflation = risk-off
- Tesla vulnerable: high valuation, energy-intensive, demand elastic
- Oil spike crushes consumer spending
- S&P correlation to oil is negative above $100/bbl

**Questions for quant review:**
- [ ] Is 3x too aggressive for this basket?
- [ ] TSLA as short — is there better energy-victim proxy?
- [ ] Should we include nat gas exposure?

---

### 4. Gold vs Tech

**Thesis:** "Central banks buy gold. Retail buys NVDA. One of them is wrong."

| Side | Assets | Weights |
|------|--------|---------|
| Long | GOLD, PAXG, JPY | 60%, 25%, 15% |
| Short | NVDA, GOOGL, SEMIS | 50%, 30%, 20% |

**Leverage:** 2x

**Rationale:**
- Central banks bought 1,000+ tonnes gold in 2022-2023
- NVDA at 50x+ forward earnings
- JPY is classic risk-off currency
- Reversion to mean bet

**Questions for quant review:**
- [ ] JPY exposure — BoJ policy risk?
- [ ] Is SEMIS index redundant with NVDA?
- [ ] What's the historical gold/NVDA correlation?

---

### 5. Bitcoin Digital Gold

**Thesis:** "Boomers hold gold. Zoomers hold BTC. One generation wins."

| Side | Assets | Weights |
|------|--------|---------|
| Long | BTC, MSTR, COIN | 60%, 25%, 15% |
| Short | GOLD, PAXG | 70%, 30% |

**Leverage:** 3x

**Rationale:**
- BTC ETFs saw $30B+ inflows 2024
- Gold ETFs saw outflows
- MSTR is leveraged BTC play
- Generational wealth transfer thesis

**Questions for quant review:**
- [ ] Is shorting gold the right expression? (vs shorting bonds?)
- [ ] MSTR adds leverage on leverage — too risky?
- [ ] 3x appropriate for this vol profile?

---

## Priority Order

1. **Dollar Debasement** — Clearest thesis, most recognizable
2. **Gold vs Tech** — Central bank angle is timely
3. **Energy Crisis** — Pairs with existing Middle East market

---

## Next Steps

1. [ ] Find macro PM / quant to review
2. [ ] Backtest weight allocations
3. [ ] Validate Pear asset availability (especially PAXG, JPY)
4. [ ] Stress test correlation assumptions
5. [ ] Get sign-off on leverage levels
6. [ ] Write narrative copy (Orwell style)
7. [ ] Implement in markets.ts

---

## Potential Partners / Reviewers

- Macro hedge fund PMs
- Crypto quant funds (Paradigm, Jump, Wintermute research)
- TradFi commodity desks
- Academic finance (if time permits)

---

*This is research, not financial advice. Markets need professional review before going live.*

# WARGAMES API - Developer Handoff for War Room Integration

**To:** Wall Markets Trading Aggregator Team  
**Date:** 2026-02-06  
**Deployment:** Live at https://wargames-api.fly.dev  
**Status:** All endpoints serving real data only (no fabricated values)

---

## What Changed

All fake data removed and replaced with real intelligence sources.

Removed (previously fake):
- Static narrative scores (hardcoded values)
- Fabricated event calendar (addDays generators)
- Made-up FOMC dates at "00:00:00"
- Static geopolitical narrative definitions

Now live (real):
- Economic calendar from official Fed + BLS schedules
- Narrative scores calculated from Fear & Greed + Polymarket + crypto prices
- Feeds verified using real APIs (GDELT, FRED, Frankfurter)

---

## Endpoints Ready for Production Integration

### 1) Real Economic Calendar
```http
GET https://wargames-api.fly.dev/events
GET https://wargames-api.fly.dev/events?days=60
GET https://wargames-api.fly.dev/events?high_impact=true
GET https://wargames-api.fly.dev/events/next-critical
```

Sources:
- Federal Reserve official calendar (FOMC)
- BLS release schedules (CPI, NFP, GDP)
- Manual curation from government sources

Coverage:
- All 2026 FOMC meetings
- Monthly CPI releases
- Monthly NFP jobs reports
- Quarterly GDP releases
- Monthly retail sales

---

### 2) Live Narrative Tracking
```http
GET https://wargames-api.fly.dev/narratives
```

Sources:
- Fear & Greed Index
- Polymarket (prediction markets)
- CoinGecko (crypto prices)

Narratives tracked (8):
- Memecoin Mania
- Taiwan Semiconductor
- Fed Pivot
- AI Bubble
- Middle East Oil
- DeFi Contagion
- Regulatory Crackdown
- Institutional Adoption

---

### 3) Breaking News
```http
GET https://wargames-api.fly.dev/live/news
```
Source: GDELT

---

### 4) Geopolitical Events
```http
GET https://wargames-api.fly.dev/live/geo
```
Source: GDELT

---

### 5) Markets (FX + Rates)
```http
GET https://wargames-api.fly.dev/live/markets
```
Sources: FRED + Frankfurter

---

### 6) Volatility & Indices
```http
GET https://wargames-api.fly.dev/live/vol
```
Source: FRED

---

### 7) Commodities
```http
GET https://wargames-api.fly.dev/live/commodities
```
Source: FRED

---

### 8) Credit Spreads
```http
GET https://wargames-api.fly.dev/live/credit
```
Source: FRED

---

### 9) Unified Aggregator
```http
GET https://wargames-api.fly.dev/live/tape
```
Purpose: single call for full snapshot.

---

## Integration Checklist

Immediate use (highest confidence):
- /live/news
- /live/geo
- /live/markets
- /live/vol
- /live/commodities
- /live/credit
- /live/tape

New endpoints (real data, production ready):
- /events
- /events/next-critical
- /narratives

---

## Layout Guidance (War Room)

Top bar:
- Breaking News Ticker (/live/news)

Upper panels:
- Markets (/live/markets)
- Volatility (/live/vol)
- Commodities (/live/commodities)
- Credit (/live/credit)

Middle:
- Geopolitical Events (/live/geo)
- Economic Calendar (/events)

Lower:
- Narrative Heatmap (/narratives)

---

## Data Rules

- No fake data. Ever.
- If a feed is unavailable, return empty arrays or nulls.
- Include freshness metadata (fetchedAt, ttlMs, source).

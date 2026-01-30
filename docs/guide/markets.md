# Understanding markets

## What is a market

A market is a tradeable narrative.

Not a ticker. Not a pair. A thesis about the world expressed as a leveraged long/short basket.

## Structure

Every market has:

| Field | Description |
|-------|-------------|
| Name | The narrative (e.g., "AI Bubble Pop") |
| Description | The thesis in one line |
| Category | `geopolitical` or `crypto` |
| Leverage | 2x or 3x |
| Long leg | Assets that win if thesis is true |
| Short leg | Assets that lose if thesis is true |

## YES vs NO

**YES** = You agree with the thesis. You go long the long leg, short the short leg.

**NO** = You disagree. The legs flip. You short what would be long, long what would be short.

## Example

**Taiwan Strait Crisis**

Thesis: China invades Taiwan. TSMC shuts down. US fabs survive.

| Side | Long | Short |
|------|------|-------|
| YES | INTC, AMD, ORCL | NVDA, AAPL, TSLA |
| NO | NVDA, AAPL, TSLA | INTC, AMD, ORCL |

If you think the invasion happens, click YES. If you think it won't (or TSMC survives), click NO.

## Weights

Baskets have weighted allocations. Not equal weight.

Example composition:
- INTC: 40%
- AMD: 30%
- ORCL: 30%

Your $1000 position becomes:
- $400 INTC
- $300 AMD
- $300 ORCL

The weights reflect the market designer's view on relative importance.

## Categories

### Geopolitical

Macro narratives. Taiwan, oil shocks, AI bubbles. Often involve synthetic equities (AAPL, NVDA, GOLD).

**Trading hours:** Weekdays 9:30am–4pm ET (when equity markets are open).

### Crypto

Pure crypto narratives. ETH vs BTC, SOL surge, HYPE momentum.

**Trading hours:** 24/7.

## Market status

Markets can be:

- **Active** — tradeable now
- **Inactive** — temporarily unavailable

Common reasons for inactive:
- Market hours (equities closed on weekends)
- Liquidity issues
- Maintenance

The UI shows status and reason if unavailable.

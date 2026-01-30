# How it works

## Architecture

war.market is a frontend. The execution layer is Pear Protocol. Settlement happens on Hyperliquid.

```
war.market (UI) → Pear Protocol (execution) → Hyperliquid (settlement)
```

## Authentication

1. Connect wallet on HyperEVM (chainId 999 or 14601)
2. Sign EIP-712 message
3. Pear creates an agent wallet
4. Agent wallet holds your trading funds

The agent wallet is non-custodial. You control it through Pear's API. war.market never touches your funds.

## Baskets

Each market is a basket trade. Example:

**Taiwan Strait Crisis**
- Long: INTC (40%), AMD (30%), ORCL (30%)
- Short: NVDA (40%), AAPL (35%), TSLA (25%)
- Leverage: 3x

When you click YES, Pear executes all six legs atomically. One transaction. One position.

## Execution

Pear uses Hyperliquid perps under the hood. Each leg of the basket is a separate perp position, but Pear manages them as a single unit.

Benefits:
- Atomic execution (all or nothing)
- Single margin requirement
- Unified P&L tracking
- One-click close

## Settlement

All trades settle on Hyperliquid L1. Real-time. No oracle latency issues.

Collateral is held in your Pear agent wallet as USDC. P&L updates continuously.

## Closing positions

From the portfolio page:
1. Select position
2. Click close
3. Pear unwinds all legs
4. Funds return to agent wallet

You can withdraw from agent wallet anytime.

# Placing trades

## The flow

1. Select market
2. Choose side (YES/NO)
3. Enter size
4. Confirm

That's it. Pear handles the rest.

## Sizing

You enter size in USDC. This is your total position value before leverage.

Example:
- Size: $100
- Leverage: 3x
- Actual exposure: $300

The $100 comes from your agent wallet balance. The $200 is borrowed.

## Margin

Your size becomes margin (collateral) for the position. It's locked while the position is open.

If you have $500 in your agent wallet and open a $100 position, you have $400 remaining for other trades.

## Leverage

Leverage is adjustable in the trade ticket.

Each market has a maximum permitted leverage based on its underlying legs. You can choose any value from 1x up to that cap.

| Market type | Typical max leverage |
|-------------|------------------|
| Crypto pairs | 2x |
| Geopolitical | 2–3x |

Higher leverage = higher risk. See [Risk](/guide/risk).

## Confirmation

Before executing, you'll see:
- Market name
- Side (YES/NO)
- Size
- Leverage
- Basket composition

Review carefully. Trades execute immediately.

## Execution

Pear executes all basket legs atomically. Either everything fills or nothing does.

Execution typically takes 1–3 seconds. You'll see a confirmation when complete.

## Failures

Trades can fail for:
- Insufficient balance
- Market closed (equities on weekends)
- Liquidity issues
- Network congestion

If a trade fails, your funds stay in your agent wallet. Nothing is lost.

## Multiple positions

You can have multiple positions open simultaneously.

Each position is independent:
- Separate margin
- Separate P&L
- Close individually

There's no portfolio margining. Each position stands alone.

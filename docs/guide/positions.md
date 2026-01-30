# Managing positions

## Portfolio view

Go to [war.market/portfolio](https://war.market/portfolio) to see open positions.

Each position card shows:
- Market name
- Side (YES/NO)
- Entry price
- Current P&L
- P&L percentage
- Margin used

## Real-time updates

Positions update via WebSocket. P&L changes in real-time as underlying prices move.

Manual refresh available if WebSocket disconnects.

## Closing positions

Click the position → **Close**.

Pear unwinds all legs:
1. Closes long positions
2. Closes short positions
3. Returns margin + P&L to agent wallet

Closing is atomic. All or nothing.

## Partial closes

Not supported. You close the entire position or nothing.

If you want to reduce size, close and re-open smaller.

## P&L calculation

P&L = (Current basket value - Entry basket value) × Leverage

For a YES position:
- Long leg gains → positive P&L
- Short leg gains → negative P&L

Net P&L is the sum across all legs.

## Unrealized vs realized

**Unrealized:** P&L on open positions. Changes constantly.

**Realized:** P&L on closed positions. Locked in when you close.

Portfolio summary shows both.

## Position duration

No time limit. Hold as long as you want.

Costs:
- Funding rates (small, varies by asset)
- Opportunity cost of locked margin

No explicit holding fees.

## Agent wallet

Funds live in your Pear agent wallet, not war.market.

You can:
- Deposit USDC anytime
- Withdraw available balance (margin not locked in positions)
- View balance in the UI

war.market never custodies your funds.

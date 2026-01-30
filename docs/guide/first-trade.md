# Your first trade

## Prerequisites

- Wallet with USDC on HyperEVM
- MetaMask, Rabby, or similar

## Step 1: Connect

Go to [war.market/trade](https://war.market/trade).

Click **Connect**. Select your wallet. Approve the connection.

::: tip Network
Make sure you're on HyperEVM (chainId 999). war.market will prompt you to switch if needed.
:::

## Step 2: Authenticate

Click **Authenticate with Pear**.

Sign the EIP-712 message. This creates your agent wallet.

You only do this once. Future sessions use the same agent wallet.

## Step 3: Fund

Your agent wallet needs USDC to trade.

Transfer USDC from your main wallet to the agent wallet address shown in the UI.

::: warning Minimum
Start with a small amount. Test the flow before sizing up.
:::

## Step 4: Pick a market

Browse the market list. Each card shows:
- Name (the narrative)
- Description (the thesis)
- Leverage
- Composition (long/short legs)

Click a market to see full details.

## Step 5: Trade

From the trade page:
1. Select market
2. Click **YES** or **NO**
3. Enter position size (USDC)
4. Review the basket composition
5. Click **Confirm**

Pear executes. Your position appears in the portfolio.

## Step 6: Monitor

Go to [war.market/portfolio](https://war.market/portfolio).

You'll see:
- Open positions
- Entry price
- Current P&L
- Margin used

Positions update in real-time via WebSocket.

## Step 7: Close

When ready:
1. Click the position
2. Click **Close**
3. Confirm

Pear unwinds all legs. Funds return to your agent wallet.

## What's next

- [Understanding markets](/guide/markets) — how narratives work
- [Managing positions](/guide/positions) — stops, takes, and more
- [Risk](/guide/risk) — leverage and liquidation

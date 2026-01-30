# Risk

Trading is risky. Leveraged trading is riskier. Understand before you trade.

## Leverage

Leverage amplifies gains and losses.

| Leverage | Price move | P&L impact |
|----------|------------|------------|
| 2x | +10% | +20% |
| 2x | -10% | -20% |
| 3x | +10% | +30% |
| 3x | -10% | -30% |

At 3x leverage, a 33% adverse move wipes out your position.

## Liquidation

If losses approach your margin, Pear liquidates the position.

Liquidation threshold varies by asset. Generally around 80–90% of margin consumed.

When liquidated:
- Position closes automatically
- Remaining margin returned (if any)
- You cannot prevent it

## Basket risk

Baskets have correlation risk. If both legs move against you simultaneously, losses compound.

Example: "Risk On/Risk Off" market
- Long: BTC, GOLD
- Short: ETH, SOL, ARB

In a true black swan, everything correlates. Your hedge might not hedge.

## Market hours

Geopolitical markets use equity synthetics. They only trade during US market hours.

**Risk:** Price gaps. Markets can open significantly different from Friday close. Your position might be underwater before you can react.

## Liquidity

Some assets have thinner liquidity. Large positions may experience slippage.

war.market position sizes are capped to reduce this risk.

## Smart contract risk

Pear Protocol is the execution layer. war.market is just a frontend.

Risks:
- Pear smart contract bugs
- Hyperliquid infrastructure issues
- Bridge/oracle failures

war.market has no control over these systems.

## Not financial advice

war.market provides a trading interface. We don't advise, recommend, or suggest trades.

You are responsible for:
- Your own research
- Position sizing
- Risk management
- Tax implications

## Best practices

1. **Start small.** Test with amounts you can afford to lose.
2. **Understand the thesis.** Don't trade markets you don't understand.
3. **Monitor positions.** Set calendar reminders if needed.
4. **Don't over-leverage.** Just because you can use 3x doesn't mean you should.
5. **Have an exit plan.** Know when you'll close, win or lose.

---

::: danger Real money
This is not a game. Losses are real. Only trade what you can afford to lose completely.
:::

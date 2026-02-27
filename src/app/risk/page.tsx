import type { Metadata } from 'next';
import Link from 'next/link';
import { TerminalShell, TerminalMenuBar, TerminalPaneTitle, TerminalSessionBadge, TerminalStatusBar } from '@/components/terminal';

export const metadata: Metadata = {
  title: 'Risk',
  description: 'WAR.MARKET risk disclosure (beta)',
};

export default function RiskPage() {
  return (
    <TerminalShell
      menuBar={<TerminalMenuBar items={[]} right={<TerminalSessionBadge />} />}
      statusBar={<TerminalStatusBar items={[{ label: 'PAGE', value: 'RISK' }, { label: 'STATE', value: 'HIGH' }]} />}
      leftPane={
        <div style={{ display: 'grid', gap: '8px' }}>
          <TerminalPaneTitle>LEGAL</TerminalPaneTitle>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/risk">Risk</Link>
        </div>
      }
      centerPane={
        <div style={{ display: 'grid', gap: '14px' }}>
          <TerminalPaneTitle>RISK DISCLOSURE</TerminalPaneTitle>
          <div style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: 1.7 }}>
            <p>
              WAR.MARKET routes leveraged trades. Leveraged trading is high risk and may result in rapid and total loss
              of funds.
            </p>
            <p>
              Risks include (without limitation): market volatility, slippage, liquidations, partial fills, failed
              execution, stale UI state, API outages, and third-party protocol/infrastructure failures.
            </p>
            <p>
              Basket trades add complexity because multiple legs may not behave as expected under stress. Execution and
              closing outcomes may differ from your expectations, especially during fast markets.
            </p>
            <p>
              Always verify your actual open positions and account state directly on Hyperliquid. WAR.MARKET provides
              tooling and warnings, but the exchange/protocol state is the final source of truth.
            </p>
            <p>
              WAR.MARKET is experimental software. Use only with funds you can afford to lose.
            </p>
          </div>
        </div>
      }
      rightPane={<div style={{ color: 'var(--loss)', fontSize: '11px' }}>HIGH RISK · LEVERAGED TRADING</div>}
    />
  );
}

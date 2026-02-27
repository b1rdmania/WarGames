import type { Metadata } from 'next';
import Link from 'next/link';
import { TerminalShell, TerminalMenuBar, TerminalPaneTitle, TerminalSessionBadge, TerminalStatusBar } from '@/components/terminal';

export const metadata: Metadata = {
  title: 'Terms',
  description: 'WAR.MARKET terms of use (beta)',
};

export default function TermsPage() {
  return (
    <TerminalShell
      menuBar={<TerminalMenuBar items={[]} right={<TerminalSessionBadge />} />}
      statusBar={<TerminalStatusBar items={[{ label: 'PAGE', value: 'TERMS' }, { label: 'STATE', value: 'BETA' }]} />}
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
          <TerminalPaneTitle>TERMS OF USE (BETA)</TerminalPaneTitle>
          <div style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: 1.7 }}>
            <p>
              WAR.MARKET is an experimental software interface for routing leveraged basket trades through third-party
              infrastructure. By using the app, you accept that functionality may change, break, or be unavailable during
              beta.
            </p>
            <p>
              You are solely responsible for your trading decisions, wallet security, and compliance with local laws and
              restrictions. Do not use this product if leveraged trading or related services are restricted where you are.
            </p>
            <p>
              WAR.MARKET does not provide investment, legal, or tax advice. Nothing in the interface, market briefs, or
              content should be treated as a recommendation to buy or sell any asset.
            </p>
            <p>
              Trades are executed and settled via third-party services (including Pear Protocol and Hyperliquid). Those
              services may have their own terms, risks, outages, and limitations.
            </p>
            <p>
              By continuing to use WAR.MARKET, you acknowledge the risks of leverage, slippage, partial fills, execution
              failures, and rapid losses.
            </p>
          </div>
        </div>
      }
      rightPane={<div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>WAR.MARKET BETA LEGAL</div>}
    />
  );
}

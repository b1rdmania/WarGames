import type { Metadata } from 'next';
import Link from 'next/link';
import { TerminalShell, TerminalMenuBar, TerminalPaneTitle, TerminalSessionBadge, TerminalStatusBar } from '@/components/terminal';

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'WAR.MARKET privacy notice (beta)',
};

export default function PrivacyPage() {
  return (
    <TerminalShell
      menuBar={<TerminalMenuBar items={[]} right={<TerminalSessionBadge />} />}
      statusBar={<TerminalStatusBar items={[{ label: 'PAGE', value: 'PRIVACY' }, { label: 'STATE', value: 'BETA' }]} />}
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
          <TerminalPaneTitle>PRIVACY (BETA)</TerminalPaneTitle>
          <div style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: 1.7 }}>
            <p>
              WAR.MARKET is designed to minimize user data collection. We may process wallet addresses, trade metadata,
              usage events, and error logs necessary to operate, debug, and improve the product.
            </p>
            <p>
              We do not custody user funds. Wallet signatures, balances, and trade execution are handled through your
              wallet and third-party protocols/infrastructure.
            </p>
            <p>
              During beta, we may retain operational logs and analytics data (for example, page usage and trade event
              records) to diagnose issues and measure reliability. Do not use WAR.MARKET if you are not comfortable with
              beta-stage telemetry.
            </p>
            <p>
              Third-party services you use through the product (including Pear Protocol and Hyperliquid) may collect data
              under their own privacy policies.
            </p>
          </div>
        </div>
      }
      rightPane={<div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>MINIMAL DATA COLLECTION</div>}
    />
  );
}

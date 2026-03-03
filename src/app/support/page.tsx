import type { Metadata } from 'next';
import Link from 'next/link';
import { TerminalButton, TerminalMenuBar, TerminalPaneTitle, TerminalSessionBadge, TerminalShell, TerminalStatusBar } from '@/components/terminal';

export const metadata: Metadata = {
  title: 'Support',
  description: 'WAR.MARKET beta support status',
};

export default function SupportPage() {
  return (
    <TerminalShell
      menuBar={<TerminalMenuBar items={[]} right={<TerminalSessionBadge />} />}
      statusBar={<TerminalStatusBar items={[{ label: 'PAGE', value: 'SUPPORT' }, { label: 'MODE', value: 'MINIMAL' }]} />}
      leftPane={
        <div style={{ display: 'grid', gap: '10px' }}>
          <TerminalPaneTitle>STATUS</TerminalPaneTitle>
          <div style={{ color: 'var(--text-muted)', fontSize: '11px', lineHeight: 1.65 }}>
            No staffed support desk during this beta pass.
          </div>
        </div>
      }
      centerPane={
        <div style={{ display: 'grid', gap: '14px' }}>
          <TerminalPaneTitle>SUPPORT ROUTING</TerminalPaneTitle>

          <div style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: 1.7 }}>
            For issues, verify directly on Hyperliquid first.
            <br />
            <br />
            Then report only blockers through your direct beta chat with:
            wallet short, market, timestamp, screenshot/video, and Hyperliquid verification.
          </div>

          <Link href="/beta/test-checklist" style={{ textDecoration: 'none' }}>
            <TerminalButton variant="primary" fullWidth>OPEN TEST CHECKLIST</TerminalButton>
          </Link>
        </div>
      }
      rightPane={
        <div style={{ display: 'grid', gap: '10px' }}>
          <TerminalPaneTitle>LEGAL</TerminalPaneTitle>
          <div style={{ color: 'var(--text-secondary)', fontSize: '11px', lineHeight: 1.6 }}>
            <Link href="/risk">Risk</Link>
            <br />
            <Link href="/terms">Terms</Link>
            <br />
            <Link href="/privacy">Privacy</Link>
          </div>
        </div>
      }
    />
  );
}

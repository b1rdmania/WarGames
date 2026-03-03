import type { Metadata } from 'next';
import Link from 'next/link';
import { TerminalButton, TerminalMenuBar, TerminalPaneTitle, TerminalSessionBadge, TerminalShell, TerminalStatusBar } from '@/components/terminal';

export const metadata: Metadata = {
  title: 'Feedback',
  description: 'WAR.MARKET beta feedback status',
};

export default function FeedbackPage() {
  return (
    <TerminalShell
      menuBar={<TerminalMenuBar items={[]} right={<TerminalSessionBadge />} />}
      statusBar={<TerminalStatusBar items={[{ label: 'PAGE', value: 'FEEDBACK' }, { label: 'MODE', value: 'MINIMAL' }]} />}
      leftPane={
        <div style={{ display: 'grid', gap: '10px' }}>
          <TerminalPaneTitle>STATUS</TerminalPaneTitle>
          <div style={{ color: 'var(--text-muted)', fontSize: '11px', lineHeight: 1.65 }}>
            No staffed feedback queue during this beta pass.
          </div>
        </div>
      }
      centerPane={
        <div style={{ display: 'grid', gap: '14px' }}>
          <TerminalPaneTitle>FEEDBACK ROUTING</TerminalPaneTitle>
          <div style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: 1.75 }}>
            Use the test checklist page as the single source of truth for what to run and what to report.
            <br />
            <br />
            If there is a blocker, send it through your direct beta chat with:
            market, wallet short, timestamp, screenshot, and Hyperliquid verification.
          </div>

          <Link href="/beta/test-checklist" style={{ textDecoration: 'none' }}>
            <TerminalButton variant="primary" fullWidth>OPEN TEST CHECKLIST</TerminalButton>
          </Link>
        </div>
      }
      rightPane={<div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>NO SEPARATE FEEDBACK PORTAL IN THIS PHASE</div>}
    />
  );
}

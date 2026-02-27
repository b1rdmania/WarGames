import type { Metadata } from 'next';
import Link from 'next/link';
import { TerminalShell, TerminalMenuBar, TerminalPaneTitle, TerminalSessionBadge, TerminalStatusBar } from '@/components/terminal';

export const metadata: Metadata = {
  title: 'Support',
  description: 'WAR.MARKET beta support',
};

export default function SupportPage() {
  return (
    <TerminalShell
      menuBar={<TerminalMenuBar items={[]} right={<TerminalSessionBadge />} />}
      statusBar={<TerminalStatusBar items={[{ label: 'PAGE', value: 'SUPPORT' }, { label: 'MODE', value: 'BETA' }]} />}
      leftPane={
        <div style={{ display: 'grid', gap: '10px' }}>
          <TerminalPaneTitle>QUICK LINKS</TerminalPaneTitle>
          <div style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: 1.6, display: 'grid', gap: '6px' }}>
            <Link href="/beta">Beta Welcome</Link>
            <Link href="/feedback">Feedback</Link>
            <Link href="/risk">Risk</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
        </div>
      }
      centerPane={
        <div style={{ display: 'grid', gap: '14px' }}>
          <TerminalPaneTitle>SUPPORT / TROUBLESHOOTING</TerminalPaneTitle>

          <div style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: 1.7 }}>
            <p>
              If something looks wrong (especially execution/close status), verify your actual account state directly on
              Hyperliquid first, then report the issue with details.
            </p>
            <p>
              Recommended support channels during beta:
            </p>
            <ul style={{ marginTop: '4px', paddingLeft: '18px' }}>
              <li>Email: add your beta support email here</li>
              <li>Telegram/Discord: add your beta group link here</li>
            </ul>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', color: 'var(--text-secondary)', fontSize: '12px', lineHeight: 1.7 }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
              Bug Report Checklist
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px' }}>
              <li>Wallet address (or short form)</li>
              <li>Market traded</li>
              <li>Approx time (UTC if possible)</li>
              <li>What you expected vs what happened</li>
              <li>Screenshot/video</li>
              <li>Hyperliquid portfolio/position verification screenshot (if execution issue)</li>
            </ul>
          </div>

          <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
            Also see: <Link href="/feedback">Feedback</Link> · <Link href="/risk">Risk</Link> · <Link href="/about">About</Link>
          </div>
        </div>
      }
      rightPane={
        <div style={{ display: 'grid', gap: '10px' }}>
          <TerminalPaneTitle>REPORT FAST</TerminalPaneTitle>
          <div style={{ color: 'var(--text-secondary)', fontSize: '11px', lineHeight: 1.6 }}>
            For execution issues include:
            <br />1) market
            <br />2) wallet short
            <br />3) timestamp
            <br />4) screenshot
            <br />5) HL verification
          </div>
        </div>
      }
    />
  );
}

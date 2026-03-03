import type { Metadata } from 'next';
import Link from 'next/link';
import { TerminalShell, TerminalMenuBar, TerminalPaneTitle, TerminalSessionBadge, TerminalStatusBar, TerminalButton } from '@/components/terminal';

export const metadata: Metadata = {
  title: 'Beta Test Checklist',
  description: 'WAR.MARKET beta test checklist and reporting template',
  robots: 'noindex, nofollow',
};

export default function BetaTestChecklistPage() {
  return (
    <TerminalShell
      menuBar={<TerminalMenuBar items={[]} right={<TerminalSessionBadge />} />}
      statusBar={
        <TerminalStatusBar
          items={[
            { label: 'PAGE', value: 'TEST CHECKLIST' },
            { label: 'MODE', value: 'BETA' },
            { label: 'TARGET', value: 'CRYPTO FLOW' },
          ]}
        />
      }
      leftPane={
        <div style={{ display: 'grid', gap: '10px' }}>
          <TerminalPaneTitle>SCOPE</TerminalPaneTitle>
          <div style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: 1.7 }}>
            <div>Focus: trust + execution.</div>
            <div>Use small size only.</div>
            <div>Target time: 5-10 minutes.</div>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', color: 'var(--text-muted)', fontSize: '11px', lineHeight: 1.6 }}>
            Keep this checklist open and run it top-to-bottom once.
          </div>
        </div>
      }
      centerPane={
        <div style={{ display: 'grid', gap: '14px' }}>
          <TerminalPaneTitle>WHAT TO TEST</TerminalPaneTitle>

          <div style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: 1.8 }}>
            <ol style={{ margin: 0, paddingLeft: '18px' }}>
              <li>Connect wallet on mobile or desktop</li>
              <li>Authenticate with Pear</li>
              <li>Open Hyperliquid via referral and complete first-time approval if prompted</li>
              <li>Open one small crypto position (ETH/BTC, SOL/ETH, HYPE/BTC, or HYPE vs L1 basket)</li>
              <li>Verify the position appears on Hyperliquid</li>
              <li>Close the position and verify it actually closed on Hyperliquid</li>
              <li>Check Portfolio and Stats for consistency</li>
            </ol>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', color: 'var(--text-secondary)', fontSize: '12px', lineHeight: 1.75 }}>
            <div style={{ color: 'var(--primary)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>
              Report Back In This Format
            </div>
            <pre
              style={{
                margin: 0,
                border: '1px solid var(--border)',
                background: 'var(--bg-warm)',
                padding: '10px',
                overflowX: 'auto',
                color: 'var(--text-secondary)',
                fontSize: '11px',
                lineHeight: 1.55,
                whiteSpace: 'pre-wrap',
              }}
            >{`Device + wallet:
Trade attempted (market + side + size):
Did it open on Hyperliquid? (Y/N):
Did it close on Hyperliquid? (Y/N):
Biggest confusion point (1 line):
Screenshot or screen recording:`}</pre>
          </div>

          <Link href="/trade" style={{ textDecoration: 'none' }}>
            <TerminalButton variant="primary" fullWidth>OPEN TRADE TERMINAL</TerminalButton>
          </Link>
          <Link href="/beta" style={{ textDecoration: 'none' }}>
            <TerminalButton fullWidth>BETA WELCOME</TerminalButton>
          </Link>
        </div>
      }
      rightPane={
        <div style={{ display: 'grid', gap: '10px' }}>
          <TerminalPaneTitle>PASS / FAIL</TerminalPaneTitle>
          <div style={{ color: 'var(--text-secondary)', fontSize: '11px', lineHeight: 1.65 }}>
            Pass if:
            <br />1) auth/approval flow is clear
            <br />2) open/close matches Hyperliquid
            <br />3) portfolio/stats feel trustworthy
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
            Voice notes and scrappy feedback are fine.
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', display: 'grid', gap: '6px', fontSize: '12px' }}>
            <Link href="/risk">Risk</Link>
          </div>
        </div>
      }
    />
  );
}

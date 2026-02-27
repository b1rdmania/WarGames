import type { Metadata } from 'next';
import Link from 'next/link';
import { TerminalShell, TerminalMenuBar, TerminalPaneTitle, TerminalSessionBadge, TerminalStatusBar } from '@/components/terminal';

export const metadata: Metadata = {
  title: 'Feedback',
  description: 'WAR.MARKET beta feedback prompts',
};

export default function FeedbackPage() {
  return (
    <TerminalShell
      menuBar={<TerminalMenuBar items={[]} right={<TerminalSessionBadge />} />}
      statusBar={<TerminalStatusBar items={[{ label: 'PAGE', value: 'FEEDBACK' }, { label: 'MODE', value: 'BETA' }]} />}
      leftPane={
        <div style={{ display: 'grid', gap: '8px' }}>
          <TerminalPaneTitle>BETA LINKS</TerminalPaneTitle>
          <Link href="/beta">Beta Welcome</Link>
          <Link href="/support">Support</Link>
          <Link href="/trade">Trade</Link>
        </div>
      }
      centerPane={
        <div style={{ display: 'grid', gap: '14px' }}>
          <TerminalPaneTitle>BETA FEEDBACK</TerminalPaneTitle>

          <div style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: 1.7 }}>
            <p>
              Beta feedback is most useful when it is specific. We care about broken behavior first, then confusing UX,
              then feature requests.
            </p>
            <p>Suggested first-test flow:</p>
            <ol style={{ marginTop: '4px', paddingLeft: '18px' }}>
              <li>Connect wallet and complete setup/auth</li>
              <li>Open one small position</li>
              <li>Verify the position on Hyperliquid</li>
              <li>Close the position</li>
              <li>Check Portfolio and Stats behavior</li>
            </ol>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', color: 'var(--text-secondary)', fontSize: '12px', lineHeight: 1.7 }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
              Feedback Prompt (Copy/Paste)
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
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
              }}
            >{`Wallet (short): 
Market:
What I tried:
What happened:
What I expected:
Severity (blocker / annoying / minor):
Screenshot / HL verification:`}</pre>
          </div>

          <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
            Need help instead? <Link href="/support">Support</Link> · <Link href="/about">About</Link>
          </div>
        </div>
      }
      rightPane={<div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>VOICE NOTES + SCREENSHOTS WELCOME</div>}
    />
  );
}

/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import Link from 'next/link';
import { getGifPath } from '@/lib/gifPaths';
import { TerminalShell, TerminalMenuBar, TerminalPaneTitle, TerminalSessionBadge, TerminalStatusBar, TerminalButton } from '@/components/terminal';

export const metadata: Metadata = {
  title: 'Beta Tester Welcome',
  description: 'WAR.MARKET closed beta onboarding and test instructions',
  robots: 'noindex, nofollow',
};

export default function BetaWelcomePage() {
  const bombGif = getGifPath('bomb', '/gifs/library/threat/bomb.gif');
  const tickerTapeGif = getGifPath('ticker-tape', '/gifs/library/markets/ticker-tape.gif');

  return (
    <TerminalShell
      menuBar={<TerminalMenuBar items={[]} right={<TerminalSessionBadge />} />}
      leftPane={
        <div style={{ display: 'grid', gap: '10px' }}>
          <TerminalPaneTitle>BETA NOTES</TerminalPaneTitle>
          <div style={{ color: 'var(--text-secondary)', fontSize: '11px', lineHeight: 1.6 }}>
            Closed cohort.
            <br />
            Small size only.
            <br />
            Focus: trust + execution.
          </div>
        </div>
      }
      centerPane={
        <div style={{ display: 'grid', gap: '16px' }}>
          <TerminalPaneTitle>BETA TESTER WELCOME</TerminalPaneTitle>

          <div
            aria-hidden="true"
            style={{
              display: 'grid',
              justifyItems: 'center',
              gap: '10px',
              padding: '6px 0 2px',
              minHeight: 'clamp(180px, 28vh, 260px)',
              alignContent: 'center',
            }}
          >
            <img
              src={bombGif}
              alt=""
              width={176}
              height={176}
              style={{
                imageRendering: 'pixelated',
                width: 'clamp(140px, 18vw, 220px)',
                height: 'clamp(140px, 18vw, 220px)',
                objectFit: 'contain',
              }}
            />
            <img
              src={tickerTapeGif}
              alt=""
              width={312}
              height={56}
              style={{
                imageRendering: 'pixelated',
                width: 'clamp(240px, 34vw, 420px)',
                height: 'clamp(42px, 6vw, 72px)',
                objectFit: 'contain',
                opacity: 0.92,
                maxWidth: '100%',
              }}
            />
          </div>

          <div
            style={{
              color: 'var(--text-secondary)',
              fontSize: '13px',
              lineHeight: 1.7,
              display: 'grid',
              gap: '10px',
            }}
          >
            <p style={{ margin: 0 }}>
              Thanks for being a beta tester. WAR.MARKET is an experimental terminal for narrative basket trades routed via
              Pear Protocol and settled on Hyperliquid.
            </p>
            <p style={{ margin: 0 }}>
              Please use small size only. This is high-risk, experimental DeFi. You can lose money quickly, and flows may
              fail or behave unexpectedly while we are testing.
            </p>
          </div>

          <div
            style={{
              borderTop: '1px solid var(--border)',
              paddingTop: '12px',
              display: 'grid',
              gap: '10px',
            }}
          >
            <div style={{ color: 'var(--primary)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              What To Test (5-10 mins)
            </div>
            <ol style={{ margin: 0, paddingLeft: '18px', color: 'var(--text-secondary)', fontSize: '12px', lineHeight: 1.8 }}>
              <li>Connect wallet and complete setup/auth</li>
              <li>Open one small position</li>
              <li>Verify the position on Hyperliquid</li>
              <li>Close the position</li>
              <li>Check Portfolio and Stats</li>
            </ol>
          </div>

          <Link href="/trade" style={{ textDecoration: 'none' }}>
            <TerminalButton variant="primary" fullWidth>ENTER APP</TerminalButton>
          </Link>
        </div>
      }
      rightPane={
        <div style={{ display: 'grid', gap: '10px' }}>
          <TerminalPaneTitle>FEEDBACK</TerminalPaneTitle>
          <div style={{ color: 'var(--text-secondary)', fontSize: '11px', lineHeight: 1.6 }}>
            Voice notes and screenshots are ideal.
            <br />
            Report: confusion, trust gaps, failures.
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
            Need help? <Link href="/support">Support</Link>
          </div>
        </div>
      }
      statusBar={
        <TerminalStatusBar
          items={[
            { label: 'PAGE', value: 'BETA WELCOME' },
            { label: 'MODE', value: 'CLOSED BETA' },
            { label: 'STATE', value: 'EXPERIMENTAL' },
          ]}
        />
      }
    />
  );
}

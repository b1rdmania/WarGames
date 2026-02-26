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
      statusBar={
        <TerminalStatusBar
          items={[
            { label: 'PAGE', value: 'BETA WELCOME' },
            { label: 'MODE', value: 'CLOSED BETA' },
            { label: 'STATE', value: 'EXPERIMENTAL' },
          ]}
        />
      }
    >
      <div
        style={{
          border: '1px solid var(--border)',
          background: 'var(--bg-deep)',
          marginTop: '8px',
          padding: 'clamp(14px, 2vw, 22px)',
          display: 'grid',
          gap: '16px',
        }}
      >
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
            maxWidth: '860px',
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

        <div
          style={{
            borderTop: '1px solid var(--border)',
            paddingTop: '12px',
            display: 'grid',
            gap: '8px',
            color: 'var(--text-secondary)',
            fontSize: '12px',
            lineHeight: 1.7,
          }}
        >
          <div style={{ color: 'var(--primary)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Best Feedback (Messy Is Fine)
          </div>
          <div>Voice notes, screenshots, and scrappy messages are perfect.</div>
          <div>Most useful feedback:</div>
          <ul style={{ margin: 0, paddingLeft: '18px' }}>
            <li>Where you got confused</li>
            <li>What felt untrustworthy / sketchy</li>
            <li>What broke</li>
            <li>What stopped you from trading again</li>
          </ul>
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
            Test Links
          </div>
          <div style={{ display: 'grid', gap: '8px', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            <Link href="/trade" style={{ textDecoration: 'none' }}>
              <TerminalButton variant="primary" fullWidth>Open Trade Terminal</TerminalButton>
            </Link>
            <Link href="/portfolio" style={{ textDecoration: 'none' }}>
              <TerminalButton fullWidth>Portfolio</TerminalButton>
            </Link>
            <Link href="/stats" style={{ textDecoration: 'none' }}>
              <TerminalButton fullWidth>Stats</TerminalButton>
            </Link>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--border)',
            paddingTop: '10px',
            color: 'var(--text-muted)',
            fontSize: '11px',
            lineHeight: 1.6,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <span>Need help or want to report issues?</span>
          <Link href="/support">Support</Link>
          <span>·</span>
          <Link href="/feedback">Feedback Template</Link>
          <span>·</span>
          <Link href="/risk">Risk</Link>
        </div>
      </div>
    </TerminalShell>
  );
}

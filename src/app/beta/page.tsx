/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import Link from 'next/link';
import { getGifPath } from '@/lib/gifPaths';
import { TerminalShell, TerminalMenuBar, TerminalPaneTitle, TerminalSessionBadge, TerminalStatusBar, TerminalButton } from '@/components/terminal';

export const metadata: Metadata = {
  title: 'Beta Tester Welcome',
  description: 'WAR.MARKET single-page beta onboarding and test checklist',
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
          <TerminalPaneTitle>BEFORE YOU START</TerminalPaneTitle>
          <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '11px', lineHeight: 1.65 }}>
            Closed cohort.
            <br />
            Small size only.
            <br />
            Focus: trust + execution quality.
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', fontSize: '11px', lineHeight: 1.6 }}>
            This is experimental DeFi.
            <br />
            You can lose money quickly.
            <br />
            Verify final state on Hyperliquid.
          </div>
        </div>
      }
      centerPane={
        <div style={{ display: 'grid', gap: '14px' }}>
          <TerminalPaneTitle>BETA TESTER WELCOME</TerminalPaneTitle>

          <div
            aria-hidden="true"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '6px 0',
              minHeight: 'clamp(96px, 16vh, 132px)',
            }}
          >
            <img
              src={bombGif}
              alt=""
              width={176}
              height={176}
              style={{
                imageRendering: 'pixelated',
                width: 'clamp(86px, 10vw, 120px)',
                height: 'clamp(86px, 10vw, 120px)',
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
                width: 'clamp(170px, 26vw, 300px)',
                height: 'clamp(30px, 4vw, 52px)',
                objectFit: 'contain',
                opacity: 0.92,
                maxWidth: '100%',
              }}
            />
          </div>

          <div
            style={{
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              lineHeight: 1.65,
            }}
          >
            Thanks for being a beta tester. Run one full trade cycle and tell me how it felt.
          </div>

          <div
            style={{
              borderTop: '1px solid var(--border)',
              paddingTop: '12px',
              display: 'grid',
              gap: '10px',
            }}
          >
            <div style={{ color: 'var(--primary)', fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Quick Test Flow (5-10 mins)
            </div>
            <ol style={{ margin: 0, paddingLeft: '18px', color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '12px', lineHeight: 1.8 }}>
              <li>Connect wallet on mobile or desktop</li>
              <li>Authenticate with Pear</li>
              <li>Open Hyperliquid via referral and complete first-time approval if prompted</li>
              <li>Open one small crypto position</li>
              <li>Verify position on Hyperliquid</li>
              <li>Close the position and verify it actually closed on Hyperliquid</li>
              <li>Check Portfolio and Stats for consistency</li>
            </ol>
          </div>

          <div
            style={{
              borderTop: '1px solid var(--border)',
              paddingTop: '12px',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              lineHeight: 1.75,
            }}
          >
            <div style={{ color: 'var(--primary)', fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>
              Report Back (Any Format)
            </div>
            <div style={{ border: '1px solid var(--border)', background: 'var(--bg-warm)', padding: '10px', display: 'grid', gap: '8px' }}>
              <div>Report back in any format you find easiest.</div>
              <div>I&apos;m happy to receive voice notes, emails, Telegram messages, or tweets.</div>
              <div>
                What you liked, what felt easy, what you hated about the UX, what steps weren&apos;t explained well,
                whether the basket settled, whether you understood what was happening, and whether you&apos;d use it.
              </div>
              <div style={{ marginTop: '2px', borderTop: '1px solid var(--border)', paddingTop: '8px', display: 'grid', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                <a href="mailto:birdandy@me.com">Email: birdandy@me.com</a>
                <a href="https://t.me/birdman1a" target="_blank" rel="noreferrer">Telegram: @birdman1a</a>
                <a href="https://x.com/b1rdmania" target="_blank" rel="noreferrer">X: @b1rdmania</a>
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: '1px solid var(--border)',
              paddingTop: '12px',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-sans)',
              fontSize: '11px',
              lineHeight: 1.6,
            }}
          >
            If blocked, report directly in beta chat with wallet short, market, timestamp, screenshot, and Hyperliquid verification.
          </div>

          <Link href="/trade" style={{ textDecoration: 'none' }}>
            <TerminalButton variant="primary" fullWidth>ENTER APP</TerminalButton>
          </Link>
        </div>
      }
      rightPane={
        <div style={{ display: 'grid', gap: '10px' }}>
          <TerminalPaneTitle>SEND FEEDBACK</TerminalPaneTitle>
          <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '11px', lineHeight: 1.6 }}>
            Email: <a href="mailto:birdandy@me.com">birdandy@me.com</a>
            <br />
            Telegram: <a href="https://t.me/birdman1a" target="_blank" rel="noreferrer">@birdman1a</a>
            <br />
            X: <a href="https://x.com/b1rdmania" target="_blank" rel="noreferrer">@b1rdmania</a>
          </div>
          <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', fontSize: '11px' }}>No staffed support desk in this phase.</div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', display: 'grid', gap: '6px', fontSize: '12px' }}>
            <Link href="/risk">Risk</Link>
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

'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Metadata } from 'next';
import {
  TerminalShell,
  TerminalMenuBar,
  TerminalButton,
  TerminalStatusBar,
} from '@/components/terminal';

const SLIDES = [
  {
    kicker: 'Hyperliquid London Hackathon · Jan 16–18, 2026',
    title: 'WAR.MARKET',
    body: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ fontSize: '32px', fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.06em', lineHeight: 1.2 }}>
          TRADE NARRATIVES.<br />
          <span style={{ color: 'var(--primary)' }}>NOT TICKERS.</span>
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7 }}>
          Pear executes the basket. Hyperliquid settles it.
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
          Live: <span style={{ color: 'var(--text-primary)' }}>https://www.war.market</span>
        </div>
      </div>
    ),
  },
  {
    title: 'WHY BUILD THIS',
    body: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '14px', lineHeight: 1.8 }}>
        <div style={{ color: 'var(--text-secondary)' }}>EVM chains don&apos;t allow coherent trading of synthetic equities.</div>
        <div style={{ color: 'var(--text-secondary)' }}>
          Oracle latency is <span style={{ color: 'var(--loss)' }}>gameable</span>.
        </div>
        <div style={{ color: 'var(--text-muted)' }}>The result is mush. Not a market.</div>
      </div>
    ),
  },
  {
    title: 'WHY HYPERLIQUID',
    body: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px', lineHeight: 1.8 }}>
        <div style={{ color: 'var(--text-secondary)' }}>Hyperliquid does real-time trading.</div>
        <div style={{ color: 'var(--text-secondary)' }}>
          HIP-3 allows new markets (Trade.xyz style, real-time stocks).<br />
          It&apos;s a <span style={{ color: 'var(--primary)' }}>game-changer</span>.
        </div>
        <div style={{ color: 'var(--text-muted)' }}>
          Creating index markets on-chain is expensive.<br />
          Roughly <span style={{ color: 'var(--text-primary)' }}>~$20m stake</span> to do it &ldquo;for real&rdquo;.
        </div>
        <div style={{ color: 'var(--text-muted)' }}>
          Pear API gives an <span style={{ color: 'var(--text-primary)' }}>approximation</span> now.
        </div>
      </div>
    ),
  },
  {
    title: 'WAR.MARKET',
    body: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px' }}>
        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          One-click narrative trade platform. Complex financial architecture made simple.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div style={{ border: '1px solid var(--border)', padding: '12px', background: 'var(--bg-deep)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '10px', letterSpacing: '0.18em', marginBottom: '6px' }}>LONG</div>
            <div style={{ color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.1em' }}>WINNERS</div>
          </div>
          <div style={{ border: '1px solid var(--border)', padding: '12px', background: 'var(--bg-deep)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '10px', letterSpacing: '0.18em', marginBottom: '6px' }}>SHORT</div>
            <div style={{ color: 'var(--loss)', fontWeight: 700, letterSpacing: '0.1em' }}>CASUALTIES</div>
          </div>
        </div>
        <div style={{ border: '1px solid var(--border)', padding: '12px', background: 'var(--bg-deep)' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '10px', letterSpacing: '0.18em', marginBottom: '8px' }}>EXAMPLE BASKET</div>
          <div style={{ color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '4px' }}>TAIWAN STRAIT CRISIS</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '8px' }}>US chip independence vs TSMC supply chain dependency</div>
          <div style={{ fontSize: '11px', lineHeight: 1.8 }}>
            <div><span style={{ color: 'var(--primary)' }}>LONG</span>: INTC (40%) · AMD (30%) · ORCL (30%)</div>
            <div><span style={{ color: 'var(--loss)' }}>SHORT</span>: NVDA (40%) · AAPL (35%) · TSLA (25%)</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'WHY IT MATTERS',
    body: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px', lineHeight: 1.8 }}>
        {[
          'Real execution — not a mock',
          'New behavior: narrative → basket → one position',
          'Tight demo loop: auth → trade → P&L → cash out',
        ].map((line) => (
          <div key={line} style={{ color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--primary)' }}>✓</span> {line}
          </div>
        ))}
        <div style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Built in 3 days. Shipped to mainnet.</div>
        <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.9 }}>
          Repo: <span style={{ color: 'var(--text-secondary)' }}>https://github.com/b1rdmania/WarGames</span><br />
          X: <span style={{ color: 'var(--text-secondary)' }}>https://x.com/b1rdmania</span>
        </div>
      </div>
    ),
  },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function DeckPage() {
  const [idx, setIdx] = useState(0);
  const slide = useMemo(() => SLIDES[idx]!, [idx]);
  const total = SLIDES.length;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        setIdx((i) => clamp(i + 1, 0, total - 1));
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setIdx((i) => clamp(i - 1, 0, total - 1));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [total]);

  return (
    <TerminalShell
      menuBar={<TerminalMenuBar items={['FILE', 'DECK', 'OVERVIEW', 'HELP']} />}
      statusBar={
        <TerminalStatusBar
          items={[
            { label: 'DECK', value: 'WAR.MARKET' },
            { label: 'SLIDE', value: `${idx + 1} / ${total}` },
            { label: 'NAV', value: '← → KEYS' },
          ]}
        />
      }
    >
      <div style={{
        marginTop: '8px',
        border: '1px solid var(--border)',
        minHeight: '62vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px',
        background: 'var(--bg-deep)',
      }}>
        {/* Kicker + slide counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            {slide.kicker ?? 'WAR.MARKET DECK'}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{idx + 1} / {total}</div>
        </div>

        {/* Slide content */}
        <div style={{ flex: 1 }}>
          <div style={{ color: 'var(--primary)', fontSize: '28px', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '24px' }}>
            {slide.title}
          </div>
          {slide.body}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '32px', gap: '12px' }}>
          <TerminalButton onClick={() => setIdx((i) => clamp(i - 1, 0, total - 1))} disabled={idx === 0}>
            ← PREV
          </TerminalButton>
          <div style={{ color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '0.08em' }}>
            USE ← → KEYS
          </div>
          <TerminalButton onClick={() => setIdx((i) => clamp(i + 1, 0, total - 1))} disabled={idx === total - 1}>
            NEXT →
          </TerminalButton>
        </div>
      </div>
    </TerminalShell>
  );
}

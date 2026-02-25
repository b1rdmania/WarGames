/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { getGifPath } from '@/lib/gifPaths';

export default function SplashGatePreviewPage() {
  const [acknowledged, setAcknowledged] = useState(false);
  const bombGif = useMemo(() => getGifPath('bomb', '/gifs/library/threat/bomb.gif'), []);

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#050907',
        color: '#c8ddd1',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <section
        style={{
          width: 'min(100%, 680px)',
          border: '1px solid #16402e',
          background: '#08110d',
          padding: '22px',
          display: 'grid',
          gap: '16px',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.25) inset',
        }}
      >
        <div style={{ color: '#03ff88', letterSpacing: '0.14em', fontSize: '12px' }}>ENTRY GATE (PREVIEW)</div>

        <div
          style={{
            minHeight: '140px',
            border: '1px solid #123424',
            background: '#060d09',
            display: 'grid',
            placeItems: 'center',
            padding: '14px',
          }}
        >
          <img src={bombGif} alt="" width={84} height={84} style={{ imageRendering: 'pixelated' }} />
        </div>

        <div style={{ borderTop: '1px solid #143626', paddingTop: '14px', display: 'grid', gap: '8px' }}>
          <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5 }}>
            WAR.MARKET routes leveraged basket trades via Pear Protocol and Hyperliquid.
          </p>
          <p style={{ margin: 0, fontSize: '12px', lineHeight: 1.5, color: '#93a89c' }}>
            Trades can lose value quickly. Slippage, partial fills, and execution failures can occur. Not investment
            advice.
          </p>
        </div>

        <label
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            border: '1px solid #143626',
            background: '#09120e',
            padding: '12px',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            style={{ marginTop: '2px' }}
          />
          <span style={{ fontSize: '12px', lineHeight: 1.4, color: '#b9cec2' }}>
            I understand this is high-risk leveraged trading and I am responsible for my decisions.
          </span>
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', alignItems: 'center' }}>
          <div style={{ fontSize: '10px', color: '#7d9387', letterSpacing: '0.06em' }}>
            LINKS: <Link href="/terms" style={{ color: '#9bb7a7' }}>TERMS</Link> ·{' '}
            <Link href="/privacy" style={{ color: '#9bb7a7' }}>PRIVACY</Link> ·{' '}
            <Link href="/about" style={{ color: '#9bb7a7' }}>ABOUT</Link>
          </div>
          <Link
            href="/"
            aria-disabled={!acknowledged}
            onClick={(e) => {
              if (!acknowledged) e.preventDefault();
            }}
            style={{
              border: '1px solid #1d4c37',
              background: acknowledged ? '#05f78a' : '#0b1712',
              color: acknowledged ? '#04110a' : '#8ea497',
              textDecoration: 'none',
              padding: '10px 16px',
              letterSpacing: '0.12em',
              fontSize: '12px',
              textTransform: 'uppercase',
              pointerEvents: acknowledged ? 'auto' : 'auto',
            }}
          >
            Enter Terminal
          </Link>
        </div>
      </section>
    </main>
  );
}

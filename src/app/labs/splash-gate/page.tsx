/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { getGifPath } from '@/lib/gifPaths';

export default function SplashGatePreviewPage() {
  const bombGif = useMemo(() => getGifPath('bomb', '/gifs/library/threat/bomb.gif'), []);
  const tickerTapeGif = useMemo(() => getGifPath('ticker-tape', '/gifs/library/markets/ticker-tape.gif'), []);

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
          width: 'min(100%, 760px)',
          padding: '12px',
          display: 'grid',
          gap: '20px',
        }}
      >
        <div style={{ color: '#03ff88', letterSpacing: '0.14em', fontSize: '12px', textAlign: 'center' }}>
          ENTRY GATE (PREVIEW)
        </div>

        <div
          style={{
            minHeight: '250px',
            display: 'grid',
            placeItems: 'center',
            padding: '6px',
            gap: '10px',
          }}
        >
          <div style={{ display: 'grid', justifyItems: 'center', gap: '10px' }}>
            <img src={bombGif} alt="" width={176} height={176} style={{ imageRendering: 'pixelated' }} />
            <img
              src={tickerTapeGif}
              alt=""
              width={312}
              height={56}
              style={{ imageRendering: 'pixelated', opacity: 0.92, objectFit: 'contain' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gap: '10px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.7, color: '#b8cdc1', maxWidth: '760px', justifySelf: 'center', whiteSpace: 'pre-line' }}>
            {`Welcome to WAR.MARKET. Experimental DeFi on Hyperliquid. If you're here you probably know what that means.

This is not investment advice. You can and will lose money. By entering you confirm you understand the risks and you're not accessing from somewhere that says you can't.`}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'center' }}>
          <div style={{ fontSize: '10px', color: '#7d9387', letterSpacing: '0.06em', textAlign: 'left' }}>
            LINKS: <Link href="/terms" style={{ color: '#9bb7a7' }}>TERMS</Link> ·{' '}
            <Link href="/privacy" style={{ color: '#9bb7a7' }}>PRIVACY</Link> ·{' '}
            <Link href="/about" style={{ color: '#9bb7a7' }}>ABOUT</Link>
          </div>
          <Link
            href="/"
            style={{
              border: '1px solid #1d4c37',
              background: '#05f78a',
              color: '#04110a',
              textDecoration: 'none',
              padding: '12px 18px',
              letterSpacing: '0.12em',
              fontSize: '12px',
              textTransform: 'uppercase',
            }}
          >
            Enter App
          </Link>
        </div>
      </section>
    </main>
  );
}

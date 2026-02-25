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
        minHeight: '100svh',
        background: '#050907',
        color: '#c8ddd1',
        display: 'grid',
        placeItems: 'center',
        padding: 'clamp(14px, 3vw, 24px)',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <section
        style={{
          width: 'min(100%, 920px)',
          padding: 'clamp(8px, 2vw, 16px)',
          display: 'grid',
          gap: 'clamp(14px, 2vw, 22px)',
        }}
      >
        <div style={{ color: '#03ff88', letterSpacing: '0.14em', fontSize: '12px', textAlign: 'center' }}>
          ENTRY GATE (PREVIEW)
        </div>

        <div
          style={{
            minHeight: 'clamp(300px, 48svh, 520px)',
            display: 'grid',
            placeItems: 'center',
            padding: '6px',
            gap: '10px',
          }}
        >
          <div style={{ display: 'grid', justifyItems: 'center', gap: 'clamp(10px, 1.8vw, 18px)' }}>
            <img
              src={bombGif}
              alt=""
              width={176}
              height={176}
              style={{
                imageRendering: 'pixelated',
                width: 'clamp(220px, 34vw, 360px)',
                height: 'clamp(220px, 34vw, 360px)',
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
                opacity: 0.92,
                objectFit: 'contain',
                width: 'clamp(340px, 56vw, 620px)',
                height: 'clamp(60px, 10vw, 112px)',
                maxWidth: '100%',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gap: '10px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: 'clamp(13px, 1.45vw, 16px)', lineHeight: 1.7, color: '#b8cdc1', maxWidth: '820px', justifySelf: 'center', whiteSpace: 'pre-line' }}>
            {`Welcome to WAR.MARKET. Experimental DeFi on Hyperliquid. If you're here you probably know what that means.

This is not investment advice. You can and will lose money. By entering you confirm you understand the risks and you're not accessing from somewhere that says you can't.`}
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
          <div style={{ fontSize: '10px', color: '#7d9387', letterSpacing: '0.06em', textAlign: 'left', flex: '1 1 280px' }}>
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
              minWidth: '180px',
              textAlign: 'center',
            }}
          >
            Enter App
          </Link>
        </div>
      </section>
    </main>
  );
}

import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'WAR.MARKET — The Global Tension Terminal';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const BASE = 'https://www.war.market';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#080c09',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'monospace',
          padding: '60px',
          boxSizing: 'border-box',
        }}
      >
        {/* Corner accents */}
        <div style={{ position: 'absolute', top: 20, left: 20, width: 40, height: 40, borderTop: '2px solid #02ff81', borderLeft: '2px solid #02ff81', display: 'flex' }} />
        <div style={{ position: 'absolute', top: 20, right: 20, width: 40, height: 40, borderTop: '2px solid #02ff81', borderRight: '2px solid #02ff81', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: 20, left: 20, width: 40, height: 40, borderBottom: '2px solid #02ff81', borderLeft: '2px solid #02ff81', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: 20, right: 20, width: 40, height: 40, borderBottom: '2px solid #02ff81', borderRight: '2px solid #02ff81', display: 'flex' }} />

        {/* Globe */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${BASE}/gifs/globeLarge.gif`} width={100} height={100} alt="" style={{ marginBottom: 24, opacity: 0.9 }} />

        {/* Title row with flames */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${BASE}/gifs/fire1.gif`} width={60} height={60} alt="" />
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              color: '#02ff81',
              letterSpacing: '0.06em',
              display: 'flex',
            }}
          >
            WAR.MARKET
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${BASE}/gifs/fire1.gif`} width={60} height={60} alt="" />
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 20,
            color: '#8da294',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 40,
            display: 'flex',
          }}
        >
          THE GLOBAL TENSION TERMINAL
        </div>

        {/* Footer */}
        <div
          style={{
            fontSize: 13,
            color: '#4a6355',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            display: 'flex',
          }}
        >
          POWERED BY PEAR PROTOCOL · HYPERLIQUID
        </div>
      </div>
    ),
    { ...size },
  );
}

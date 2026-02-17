import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'WAR.MARKET — The Global Tension Terminal';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

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
          border: '2px solid #1f3e2f',
          padding: '60px',
          boxSizing: 'border-box',
        }}
      >
        {/* Corner borders */}
        <div style={{ position: 'absolute', top: 20, left: 20, width: 40, height: 40, borderTop: '2px solid #02ff81', borderLeft: '2px solid #02ff81', display: 'flex' }} />
        <div style={{ position: 'absolute', top: 20, right: 20, width: 40, height: 40, borderTop: '2px solid #02ff81', borderRight: '2px solid #02ff81', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: 20, left: 20, width: 40, height: 40, borderBottom: '2px solid #02ff81', borderLeft: '2px solid #02ff81', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: 20, right: 20, width: 40, height: 40, borderBottom: '2px solid #02ff81', borderRight: '2px solid #02ff81', display: 'flex' }} />

        {/* Title */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: '#02ff81',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: 16,
            display: 'flex',
          }}
        >
          WAR.MARKET
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 22,
            color: '#8da294',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 48,
            display: 'flex',
          }}
        >
          THE GLOBAL TENSION TERMINAL
        </div>

        {/* Markets row */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 48 }}>
          {['TAIWAN', 'OIL SHOCK', 'AI BUBBLE', 'RISK OFF'].map((label) => (
            <div
              key={label}
              style={{
                border: '1px solid #1f3e2f',
                padding: '8px 16px',
                color: '#a8b4af',
                fontSize: 13,
                letterSpacing: '0.1em',
                display: 'flex',
              }}
            >
              {label}
            </div>
          ))}
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

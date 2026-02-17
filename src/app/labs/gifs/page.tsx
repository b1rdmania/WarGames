import { GC } from '@/app/labs/geocities-gifs';

export default function GifPreviewPage() {
  return (
    <main style={{ background: '#080c09', minHeight: '100vh', padding: '24px', fontFamily: 'monospace' }}>
      <div style={{ color: '#02ff81', fontSize: '11px', letterSpacing: '0.1em', marginBottom: '24px' }}>
        GIF CATALOG — {Object.keys(GC).length} TOTAL
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '16px' }}>
        {Object.entries(GC).map(([key, src]) => (
          <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '12px', border: '1px solid #1f3e2f' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={key} style={{ maxWidth: '80px', maxHeight: '80px', objectFit: 'contain' }} />
            <span style={{ color: '#8da294', fontSize: '10px', letterSpacing: '0.05em', textAlign: 'center', wordBreak: 'break-all' }}>
              {key}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}

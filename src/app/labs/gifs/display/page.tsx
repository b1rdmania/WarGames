/* eslint-disable @next/next/no-img-element */
import { GIF_LIBRARY_BY_CATEGORY } from '@/lib/gif-library';

export default function GifDisplayPage() {
  const categories = Object.entries(GIF_LIBRARY_BY_CATEGORY).sort(([a], [b]) => a.localeCompare(b));

  return (
    <main
      style={{
        background: '#080c09',
        minHeight: '100vh',
        padding: '24px',
        fontFamily: 'monospace',
        color: '#c9dfd2',
      }}
    >
      <div style={{ color: '#02ff81', fontSize: '12px', letterSpacing: '0.1em', marginBottom: '8px' }}>
        GIF DISPLAY BOARD
      </div>
      <div style={{ color: '#8da294', fontSize: '10px', letterSpacing: '0.06em', marginBottom: '18px' }}>
        Canonical library only. Tell me placements as: section + alias (example: `intel / radar`).
      </div>

      {categories.map(([category, items]) => (
        <section key={category} style={{ marginBottom: '22px' }}>
          <div style={{ color: '#8da294', fontSize: '10px', letterSpacing: '0.08em', marginBottom: '10px' }}>
            {category.toUpperCase()} — {items.length}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  border: '1px solid #1f3e2f',
                  background: '#0a1510',
                  padding: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <img src={item.path} alt={item.alias} style={{ maxWidth: '96px', maxHeight: '80px', objectFit: 'contain' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#d2e7db', fontSize: '10px', letterSpacing: '0.05em', wordBreak: 'break-all' }}>{item.alias}</div>
                  <div style={{ color: '#6f8678', fontSize: '9px', marginTop: '3px', wordBreak: 'break-all' }}>{item.id}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}


/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useMemo, useState } from 'react';
import { GC } from '@/app/labs/geocities-gifs';
import { GIF_LIBRARY_BY_CATEGORY } from '@/lib/gif-library';

type Decision = 'approve' | 'reject';
type DecisionMap = Record<string, Decision>;

export default function GifPreviewPage() {
  const [decisions, setDecisions] = useState<DecisionMap>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/gifs/review?ts=' + Date.now(), { cache: 'no-store' });
        if (!res.ok) return;
        const json = (await res.json()) as { decisions?: DecisionMap };
        if (active) setDecisions(json.decisions ?? {});
      } catch {
        // ignore
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(
    () =>
      Object.entries(GIF_LIBRARY_BY_CATEGORY)
        .map(([category, items]) => [
          category,
          items.filter((item) => decisions[item.id] !== 'reject'),
        ] as const)
        .filter(([, items]) => items.length > 0)
        .sort(([a], [b]) => a.localeCompare(b)),
    [decisions]
  );

  const saveDecision = async (id: string, action: 'reject' | 'clear') => {
    setSavingId(id);
    try {
      const res = await fetch('/api/gifs/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      if (!res.ok) return;
      const json = (await res.json()) as { decisions?: DecisionMap };
      setDecisions(json.decisions ?? {});
    } finally {
      setSavingId(null);
    }
  };

  return (
    <main style={{ background: '#080c09', minHeight: '100vh', padding: '24px', fontFamily: 'monospace' }}>
      <div style={{ color: '#02ff81', fontSize: '11px', letterSpacing: '0.1em', marginBottom: '10px' }}>
        ACCEPTED LIBRARY
      </div>
      <div style={{ color: '#8da294', fontSize: '10px', letterSpacing: '0.06em', marginBottom: '14px' }}>
        Rejecting here writes to review decisions and moves files between approved/rejected.
      </div>
      {categories.map(([category, items]) => (
        <section key={category} style={{ marginBottom: '20px' }}>
          <div style={{ color: '#8da294', fontSize: '10px', letterSpacing: '0.08em', marginBottom: '10px' }}>
            {category.toUpperCase()} — {items.length}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
            {items.map((item) => (
              <div key={item.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '10px', border: '1px solid #2a5a3f', background: '#0a1510' }}>
                <img src={item.path} alt={item.alias} style={{ maxWidth: '90px', maxHeight: '80px', objectFit: 'contain' }} />
                <span style={{ color: '#c9dfd2', fontSize: '10px', letterSpacing: '0.05em', textAlign: 'center', wordBreak: 'break-all' }}>
                  {item.alias}
                </span>
                <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
                  <button
                    type="button"
                    onClick={() => void saveDecision(item.id, 'reject')}
                    disabled={savingId === item.id}
                    style={{
                      flex: 1,
                      border: '1px solid #733636',
                      background: '#1a1010',
                      color: '#ff8f8f',
                      fontSize: '10px',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      padding: '5px 6px',
                      cursor: 'pointer',
                    }}
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => void saveDecision(item.id, 'clear')}
                    disabled={savingId === item.id}
                    style={{
                      flex: 1,
                      border: '1px solid #1f3e2f',
                      background: '#0d1612',
                      color: '#8da294',
                      fontSize: '10px',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      padding: '5px 6px',
                      cursor: 'pointer',
                    }}
                  >
                    Undo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <div style={{ borderTop: '1px solid #1f3e2f', margin: '26px 0 18px' }} />
      <div style={{ color: '#02ff81', fontSize: '11px', letterSpacing: '0.1em', marginBottom: '24px' }}>
        GIF CATALOG — {Object.keys(GC).length} TOTAL
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '16px' }}>
        {Object.entries(GC).map(([key, src]) => (
          <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '12px', border: '1px solid #1f3e2f' }}>
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

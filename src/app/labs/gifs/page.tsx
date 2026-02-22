/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useMemo, useState } from 'react';
import { GC } from '@/app/labs/geocities-gifs';
import { GIF_LIBRARY, GIF_LIBRARY_BY_CATEGORY } from '@/lib/gif-library';

type Decision = 'approve' | 'reject';
type DecisionMap = Record<string, Decision>;

function getGifIdFromSrc(src: string, libraryPathToId: Map<string, string>): string | null {
  const clean = src.split('?')[0];
  const libraryId = libraryPathToId.get(clean);
  if (libraryId) return libraryId;
  const file = clean.split('/').pop();
  if (!file) return null;
  return file.toLowerCase().endsWith('.gif') ? file.slice(0, -4) : null;
}

function getCatalogGroup(key: string, src: string): string {
  if (src.startsWith('/gifs/library/')) {
    const parts = src.split('/');
    return `library:${parts[3] ?? 'misc'}`;
  }
  if (key.startsWith('lib_') || key.startsWith('lib')) return 'library:mapped';
  if (src.startsWith('/gifs/')) return 'legacy';
  return 'other';
}

function getAliasFamily(key: string): string {
  const normalized = key.replace(/^lib_/, '').toLowerCase();
  return normalized.replace(/-\d+$/, '');
}

type CatalogCard = {
  key: string;
  src: string;
  aliases: string[];
};

export default function GifPreviewPage() {
  const SHOW_ADVANCED_MIXED_CATALOG = false;
  const [decisions, setDecisions] = useState<DecisionMap>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const libraryPathToId = useMemo(
    () => new Map(GIF_LIBRARY.map((item) => [item.path, item.id] as const)),
    []
  );
  const libraryIds = useMemo(() => new Set(GIF_LIBRARY.map((item) => item.id)), []);

  const refreshDecisions = async () => {
    const res = await fetch('/api/gifs/review?ts=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) return null;
    const json = (await res.json()) as { decisions?: DecisionMap };
    setDecisions(json.decisions ?? {});
    return json.decisions ?? {};
  };

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

  const filteredCatalogEntries = useMemo(
    () =>
      Object.entries(GC).filter(([, src]) => {
        const id = getGifIdFromSrc(src, libraryPathToId);
        const isLegacyRoot = src.startsWith('/gifs/') && !src.startsWith('/gifs/library/');
        if (isLegacyRoot && id && libraryIds.has(id)) {
          // Already promoted into canonical library; hide from mixed catalog.
          return false;
        }
        if (!id) return true;
        return decisions[id] !== 'reject';
      }),
    [decisions, libraryIds, libraryPathToId]
  );

  const dedupedCatalogEntries = useMemo(() => {
    const bySrc = new Map<string, CatalogCard>();
    for (const [key, src] of filteredCatalogEntries) {
      const existing = bySrc.get(src);
      if (existing) {
        existing.aliases.push(key);
        // Prefer non-lib alias as primary key in mixed catalog; otherwise keep first.
        if (existing.key.startsWith('lib') && !key.startsWith('lib')) {
          existing.key = key;
        }
        continue;
      }
      bySrc.set(src, { key, src, aliases: [key] });
    }
    return [...bySrc.values()];
  }, [filteredCatalogEntries]);

  const groupedCatalog = useMemo(
    () =>
      dedupedCatalogEntries
        .reduce<Record<string, CatalogCard[]>>((acc, entry) => {
          const group = getCatalogGroup(entry.key, entry.src);
          (acc[group] ||= []).push(entry);
          return acc;
        }, {})
    ,
    [dedupedCatalogEntries]
  );

  const catalogGroups = useMemo(
    () =>
      Object.entries(groupedCatalog)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([group, items]) => [group, items.sort((a, b) => a.key.localeCompare(b.key))] as const),
    [groupedCatalog]
  );

  const saveDecision = async (id: string, action: 'approve' | 'reject' | 'clear') => {
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

  const saveManyDecisions = async (ids: string[], action: 'approve' | 'reject' | 'clear', key: string) => {
    const uniqueIds = [...new Set(ids.filter(Boolean))];
    if (!uniqueIds.length) return;
    setSavingId(key);
    try {
      for (const id of uniqueIds) {
        await fetch('/api/gifs/review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, action }),
        });
      }
      await refreshDecisions();
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
        Rejecting here writes to review decisions and deletes local GIF files from the active pool.
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

      {SHOW_ADVANCED_MIXED_CATALOG ? (
        <>
          <div style={{ borderTop: '1px solid #1f3e2f', margin: '26px 0 18px' }} />
          <div style={{ color: '#8da294', fontSize: '10px', letterSpacing: '0.06em', marginBottom: '14px' }}>
            Final review is the Accepted Library above. Mixed catalog is hidden below for advanced cleanup only.
          </div>
          <details style={{ border: '1px solid #173327', background: '#08110d', marginBottom: '18px' }}>
        <summary
          style={{
            cursor: 'pointer',
            padding: '10px 12px',
            color: '#02ff81',
            fontSize: '11px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Open Mixed Catalog (Advanced) — {dedupedCatalogEntries.length} unique / {filteredCatalogEntries.length} visible / {Object.keys(GC).length} total
        </summary>
        <div style={{ padding: '0 12px 12px' }}>
          <div style={{ color: '#8da294', fontSize: '10px', letterSpacing: '0.06em', margin: '4px 0 14px' }}>
            Includes legacy site GIFs + library aliases. Use only if you need to clean up non-library leftovers.
          </div>
          {catalogGroups.map(([group, items]) => (
            <section key={group} style={{ marginBottom: '20px' }}>
              <div style={{ color: '#8da294', fontSize: '10px', letterSpacing: '0.08em', marginBottom: '10px' }}>
                {group.toUpperCase()} — {items.length}
              </div>
              {Object.entries(
                items.reduce<Record<string, CatalogCard[]>>((acc, item) => {
                  const family = getAliasFamily(item.key);
                  (acc[family] ||= []).push(item);
                  return acc;
                }, {})
              )
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([family, familyItems]) => (
                  <details
                    key={`${group}:${family}`}
                    open={familyItems.length <= 3}
                    style={{ marginBottom: '10px', border: '1px solid #173327', background: '#08110d' }}
                  >
                {(() => {
                  const familyIds = familyItems
                    .map((item) => getGifIdFromSrc(item.src, libraryPathToId))
                    .filter((id): id is string => Boolean(id));
                  const familyActionKey = `family:${group}:${family}`;
                  const familySaving = savingId === familyActionKey;
                  return (
                <summary
                  style={{
                    cursor: 'pointer',
                    listStyle: 'none',
                    padding: '8px 10px',
                    color: '#9eb4a7',
                    fontSize: '10px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    borderBottom: '1px solid #10271d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                  }}
                >
                  <span>{family} — {familyItems.length}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      void saveManyDecisions(familyIds, 'reject', familyActionKey);
                    }}
                    disabled={!familyIds.length || familySaving}
                    style={{
                      border: '1px solid #733636',
                      background: '#1a1010',
                      color: '#ff8f8f',
                      fontSize: '9px',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      padding: '4px 6px',
                      cursor: familyIds.length ? 'pointer' : 'not-allowed',
                      opacity: familyIds.length ? 1 : 0.5,
                    }}
                  >
                    {familySaving ? 'Rejecting…' : 'Reject Family'}
                  </button>
                </summary>
                  );
                })()}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px', padding: '10px' }}>
                  {familyItems.map(({ key, src, aliases }) => {
                    const id = getGifIdFromSrc(src, libraryPathToId);
                    const isRejected = id ? decisions[id] === 'reject' : false;
                    return (
                      <div
                        key={key}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px',
                          border: '1px solid #1f3e2f',
                          background: '#0a1510',
                          opacity: isRejected ? 0.6 : 1,
                        }}
                      >
                        <img src={src} alt={key} style={{ maxWidth: '90px', maxHeight: '80px', objectFit: 'contain' }} />
                        <span style={{ color: '#c9dfd2', fontSize: '10px', letterSpacing: '0.05em', textAlign: 'center', wordBreak: 'break-all' }}>
                          {key}
                        </span>
                        {aliases.length > 1 ? (
                          <span style={{ color: '#6f8678', fontSize: '9px', letterSpacing: '0.05em', textAlign: 'center' }}>
                            {aliases.length} aliases
                          </span>
                        ) : null}
                        {id ? (
                          <span style={{ color: '#6f8678', fontSize: '9px', letterSpacing: '0.05em', textAlign: 'center', wordBreak: 'break-all' }}>
                            {id}
                          </span>
                        ) : null}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', width: '100%' }}>
                          <button
                            type="button"
                            onClick={() => (id ? void saveDecision(id, 'approve') : undefined)}
                            disabled={!id || savingId === id}
                            style={{
                              border: '1px solid #1f5a3f',
                              background: '#0d1a12',
                              color: '#6df0a8',
                              fontSize: '10px',
                              letterSpacing: '0.06em',
                              textTransform: 'uppercase',
                              padding: '5px 6px',
                              cursor: id ? 'pointer' : 'not-allowed',
                              opacity: id ? 1 : 0.5,
                            }}
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            onClick={() => (id ? void saveDecision(id, 'reject') : undefined)}
                            disabled={!id || savingId === id}
                            style={{
                              border: '1px solid #733636',
                              background: '#1a1010',
                              color: '#ff8f8f',
                              fontSize: '10px',
                              letterSpacing: '0.06em',
                              textTransform: 'uppercase',
                              padding: '5px 6px',
                              cursor: id ? 'pointer' : 'not-allowed',
                              opacity: id ? 1 : 0.5,
                            }}
                          >
                            Reject
                          </button>
                          <button
                            type="button"
                            onClick={() => (id ? void saveDecision(id, 'clear') : undefined)}
                            disabled={!id || savingId === id}
                            style={{
                              border: '1px solid #1f3e2f',
                              background: '#0d1612',
                              color: '#8da294',
                              fontSize: '10px',
                              letterSpacing: '0.06em',
                              textTransform: 'uppercase',
                              padding: '5px 6px',
                              cursor: id ? 'pointer' : 'not-allowed',
                              opacity: id ? 1 : 0.5,
                            }}
                          >
                            Undo
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </details>
            ))}
            </section>
          ))}
        </div>
          </details>
        </>
      ) : null}
    </main>
  );
}

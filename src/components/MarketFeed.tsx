'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { ValidatedMarket } from '@/integrations/pear/marketValidation';
import styles from './MarketFeed.module.css';

function hashSeed(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  // xorshift32
  let x = seed || 1;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 0xffffffff;
  };
}

function formatUsd(n: number) {
  return `$${n.toFixed(2)}`;
}

function formatMillions(n: number) {
  return `$${n.toFixed(2)}M`;
}

export function MarketFeed({
  markets,
  onPick,
}: {
  markets: ValidatedMarket[];
  onPick: (market: ValidatedMarket, side: 'long' | 'short') => void; // long=YES, short=NO
}) {
  // Smoothly update "market data" without layout shifts.
  const [timeBucket, setTimeBucket] = useState(() => Math.floor(Date.now() / 60_000));
  useEffect(() => {
    const interval = window.setInterval(() => setTimeBucket(Math.floor(Date.now() / 60_000)), 30_000);
    return () => window.clearInterval(interval);
  }, []);

  const metricsById = useMemo(() => {
    const out = new Map<
      string,
      { price: string; changePct: string; changeDir: 'up' | 'down'; volume: string }
    >();
    for (const m of markets) {
      const rand = rng(hashSeed(`${m.id}:${timeBucket}`));
      const base = 50 + rand() * 120; // $50 - $170
      const change = (rand() * 6 - 3); // -3% to +3%
      const vol = 0.6 + rand() * 4.6; // $0.6M - $5.2M
      out.set(m.id, {
        price: formatUsd(base),
        changePct: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`,
        changeDir: change >= 0 ? 'up' : 'down',
        volume: formatMillions(vol),
      });
    }
    return out;
  }, [markets, timeBucket]);

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>MARKET</th>
            <th className={styles.th}>PRICE</th>
            <th className={styles.th}>24H</th>
            <th className={styles.th}>SPARKLINE</th>
            <th className={styles.th}>VOLUME</th>
            <th className={styles.th}>THESIS</th>
            <th className={styles.th}>TAGS</th>
            <th className={styles.th} style={{ textAlign: 'right' }}>
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody>
          {markets.map((m) => (
            (() => {
              const metric = metricsById.get(m.id);
              return (
            <tr key={m.id} className={styles.row}>
              <td className={styles.td}>
                <div className={styles.marketName}>
                  <Link className={styles.marketLink} href={`/markets/${m.id}`}>
                    {m.name}
                  </Link>
                </div>
              </td>
              <td className={styles.td}>
                <div className={styles.price}>{metric?.price ?? '—'}</div>
              </td>
              <td className={styles.td}>
                <div className={metric?.changeDir === 'down' ? styles.changeDown : styles.changeUp}>
                  {metric?.changePct ?? '—'}
                </div>
              </td>
              <td className={styles.td}>
                <div className={styles.sparkline} aria-label="Sparkline (demo)" />
              </td>
              <td className={styles.td}>
                <div className={styles.volume}>{metric?.volume ?? '—'}</div>
              </td>
              <td className={styles.td}>
                <div className={styles.marketDesc}>{m.description}</div>
              </td>
              <td className={styles.td}>
                <div className={styles.badges}>
                  <span className="tm-label">{m.category}</span>
                  <span className="tm-label text-pear-lime">{m.leverage}x</span>
                  {m.isRemapped && <span className="tm-label text-yellow-200">DEMO</span>}
                </div>
              </td>
              <td className={styles.td}>
                <div className={styles.actionButtons}>
                  <button
                    type="button"
                    className={styles.btnAction}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPick(m, 'long');
                    }}
                  >
                    YES
                  </button>
                  <button
                    type="button"
                    className={`${styles.btnAction} ${styles.btnShort}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPick(m, 'short');
                    }}
                  >
                    NO
                  </button>
                </div>
              </td>
            </tr>
              );
            })()
          ))}
        </tbody>
      </table>
    </div>
  );
}


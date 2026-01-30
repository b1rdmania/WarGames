'use client';

import Link from 'next/link';
import type { ValidatedMarket } from '@/integrations/pear/marketValidation';
import styles from './MarketFeed.module.css';

function cleanSymbol(s: string) {
  // Pear can return namespaced symbols like "xyz:INTC" or "km:US500".
  return s.split(':').pop()!.trim();
}

export function MarketFeedReadOnly({
  markets,
}: {
  markets: ValidatedMarket[];
}) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Market</th>
            <th className={styles.th}>Thesis</th>
            <th className={styles.th}>Tags</th>
            <th className={styles.th} style={{ textAlign: 'right' }}>Details</th>
          </tr>
        </thead>
        <tbody>
          {markets.map((m) => {
            const pairs = m.resolvedPairs ?? m.pairs;
            const basket = m.resolvedBasket ?? m.basket;
            const punchline = pairs
              ? `${cleanSymbol(pairs.long)} vs ${cleanSymbol(pairs.short)}`
              : basket
                ? `${basket.long.map((x) => cleanSymbol(x.asset)).join(' + ')} vs ${basket.short.map((x) => cleanSymbol(x.asset)).join(' + ')}`
                : '—';

            return (
              <tr key={m.id} className={styles.row}>
                <td className={styles.td}>
                  <div className={styles.marketName}>
                    <Link className={styles.marketLink} href={`/markets/${m.id}`}>
                      {m.name}
                    </Link>
                  </div>
                  <div className={styles.marketMeta}>
                    <span className={styles.metaTag}>{punchline}</span>
                  </div>
                </td>
                <td className={styles.td}>
                  <div className={styles.marketDesc}>{m.description}</div>
                </td>
                <td className={styles.td}>
                  <div className={styles.badges}>
                    <span className="text-xs text-text-muted font-mono">{m.category}</span>
                    <span className="text-xs text-brand-amber font-mono">{m.leverage}x</span>
                    {!m.isTradable && <span className="text-xs text-status-warning font-mono">Inactive</span>}
                  </div>
                </td>
                <td className={styles.td}>
                  <div className={styles.actionButtons}>
                    <Link
                      href={`/markets/${m.id}`}
                      className={styles.btnView}
                    >
                      View
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

'use client';

import Link from 'next/link';
import type { ValidatedMarket } from '@/integrations/pear/marketValidation';
import styles from './MarketFeed.module.css';

function cleanSymbol(s: string) {
  // Pear can return namespaced symbols like "xyz:INTC" or "km:US500".
  return s.split(':').pop()!.trim();
}

function formatBasketShort(assets: { asset: string; weight?: number }[]) {
  return assets
    .slice(0, 4)
    .map((a) => `${cleanSymbol(a.asset)}${typeof a.weight === 'number' ? `(${Math.round(a.weight * 100)})` : ''}`)
    .join(' · ');
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
            <th className={styles.th}>MARKET</th>
            <th className={styles.th}>THESIS</th>
            <th className={styles.th}>TAGS</th>
            <th className={styles.th} style={{ textAlign: 'right' }}>DETAILS</th>
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
                    <span className="tm-label">[{m.category}]</span>
                    <span className="tm-label text-pear-lime">[{m.leverage}X]</span>
                    {m.isRemapped && <span className="tm-label text-yellow-200">[DEMO]</span>}
                  </div>
                </td>
                <td className={styles.td}>
                  <div className={styles.actionButtons}>
                    <Link
                      href={`/markets/${m.id}`}
                      className={styles.btnAction}
                    >
                      VIEW
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

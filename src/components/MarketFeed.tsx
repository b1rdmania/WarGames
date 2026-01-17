'use client';

import Link from 'next/link';
import type { ValidatedMarket } from '@/integrations/pear/marketValidation';
import styles from './MarketFeed.module.css';

function formatBasketShort(assets: { asset: string; weight?: number }[]) {
  return assets
    .slice(0, 4)
    .map((a) => `${a.asset}${typeof a.weight === 'number' ? `(${Math.round(a.weight * 100)})` : ''}`)
    .join(' · ');
}

export function MarketFeed({
  markets,
  onPick,
}: {
  markets: ValidatedMarket[];
  onPick: (market: ValidatedMarket, side: 'long' | 'short') => void; // long=YES, short=NO
}) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>MARKET</th>
            <th className={styles.th}>UNDERLYING</th>
            <th className={styles.th}>LONG</th>
            <th className={styles.th}>SHORT</th>
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
              const pairs = m.resolvedPairs ?? m.pairs;
              const basket = m.resolvedBasket ?? m.basket;
              const underlying = pairs
                ? `${pairs.long} vs ${pairs.short}`
                : basket
                  ? `${basket.long.map((x) => x.asset).join(' + ')} vs ${basket.short.map((x) => x.asset).join(' + ')}`
                  : '—';
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
                <div className={styles.underlying}>{underlying}</div>
              </td>
              <td className={styles.td}>
                <div className={styles.legs}>
                  {pairs ? pairs.long : basket ? formatBasketShort(basket.long) : '—'}
                </div>
              </td>
              <td className={styles.td}>
                <div className={styles.legs}>
                  {pairs ? pairs.short : basket ? formatBasketShort(basket.short) : '—'}
                </div>
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


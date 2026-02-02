'use client';

import Link from 'next/link';
import type { ValidatedMarket } from '@/integrations/pear/marketValidation';
import styles from './MarketFeed.module.css';

function cleanSymbol(s: string) {
  // Pear can return namespaced symbols like "xyz:INTC" or "km:US500".
  return s.split(':').pop()!.trim();
}

function formatBasketCompact(assets: { asset: string; weight?: number }[]) {
  if (assets.length === 1) return cleanSymbol(assets[0].asset);
  if (assets.length <= 2) return assets.map(a => cleanSymbol(a.asset)).join('+');
  return `${cleanSymbol(assets[0].asset)}+${assets.length - 1} more`;
}

export function MarketFeed({
  markets,
  selectedMarketId,
  onPick,
}: {
  markets: ValidatedMarket[];
  selectedMarketId?: string | null;
  onPick: (market: ValidatedMarket, side: 'long' | 'short') => void; // long=YES, short=NO
}) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>MARKET</th>
            <th className={styles.th}>PAIR</th>
            <th className={styles.th} style={{ textAlign: 'right' }}>BET</th>
          </tr>
        </thead>
        <tbody>
          {markets.map((m) => {
            const pairs = m.resolvedPairs ?? m.pairs;
            const basket = m.resolvedBasket ?? m.basket;
            const longLabel = pairs ? cleanSymbol(pairs.long) : basket ? formatBasketCompact(basket.long) : '—';
            const shortLabel = pairs ? cleanSymbol(pairs.short) : basket ? formatBasketCompact(basket.short) : '—';
            return (
              <tr key={m.id} className={`${styles.row} ${selectedMarketId === m.id ? styles.rowSelected : ''}`}>
                <td className={styles.td}>
                  <div className={styles.marketName}>
                    <Link className={styles.marketLink} href={`/markets/${m.id}`}>
                      {m.name}
                    </Link>
                  </div>
                  <div className={styles.marketMeta}>
                    <span className={styles.metaTag}>{m.leverage}x</span>
                    {m.category === 'crypto' ? (
                      <span className={styles.metaTagLive}>24/7</span>
                    ) : (
                      <span className={styles.metaTagClosed} title="Mon-Fri 9:30am-4pm ET only">WEEKDAYS</span>
                    )}
                  </div>
                </td>
                <td className={styles.td}>
                  <div className={styles.pairDisplay}>
                    <span className={styles.longSide}>{longLabel}</span>
                    <span className={styles.vs}>vs</span>
                    <span className={styles.shortSide}>{shortLabel}</span>
                  </div>
                </td>
                <td className={styles.td}>
                  {m.isTradable ? (
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
                  ) : (
                    <div className={styles.inactiveLabel} title={m.unavailableReason}>
                      Inactive
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}


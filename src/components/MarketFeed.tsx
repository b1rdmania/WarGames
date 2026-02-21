'use client';

import Link from 'next/link';
import type { ValidatedMarket } from '@/integrations/pear/marketValidation';
import { formatPairOrBasketSide } from '@/lib/marketDisplay';
import styles from './MarketFeed.module.css';

function MarketCard({
  market,
  isSelected,
  onPick,
}: {
  market: ValidatedMarket;
  isSelected: boolean;
  onPick: (market: ValidatedMarket, side: 'long' | 'short') => void;
}) {
  const longLabel = formatPairOrBasketSide(market, 'long', { compact: true, maxItems: 3 });
  const shortLabel = formatPairOrBasketSide(market, 'short', { compact: true, maxItems: 3 });

  return (
    <div className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}>
      <div className={styles.cardHeader}>
        <Link className={styles.marketLink} href={`/markets/${market.id}`}>
          {market.name}
        </Link>
        <div className={styles.marketMeta}>
          <span className={styles.metaTag}>{market.leverage}x</span>
          {market.category === 'crypto' ? (
            <span className={styles.metaTagLive}>24/7</span>
          ) : (
            <span className={styles.metaTagClosed}>WEEKDAYS</span>
          )}
        </div>
      </div>

      <div className={styles.cardPair}>
        <span className={styles.longSide}>{longLabel}</span>
        <span className={styles.vs}>vs</span>
        <span className={styles.shortSide}>{shortLabel}</span>
      </div>

      {market.isTradable ? (
        <div className={styles.cardActions}>
          <button
            type="button"
            className={styles.btnAction}
            onClick={() => onPick(market, 'long')}
          >
            YES
          </button>
          <button
            type="button"
            className={`${styles.btnAction} ${styles.btnShort}`}
            onClick={() => onPick(market, 'short')}
          >
            NO
          </button>
        </div>
      ) : (
        <div className={styles.cardInactive} title={market.unavailableReason}>
          Inactive
        </div>
      )}
    </div>
  );
}

export function MarketFeed({
  markets,
  selectedMarketId,
  onPick,
}: {
  markets: ValidatedMarket[];
  selectedMarketId?: string | null;
  onPick: (market: ValidatedMarket, side: 'long' | 'short') => void;
}) {
  return (
    <div className={styles.wrapper}>
      {/* Desktop: Table layout */}
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
            const longLabel = formatPairOrBasketSide(m, 'long', { compact: true, maxItems: 3 });
            const shortLabel = formatPairOrBasketSide(m, 'short', { compact: true, maxItems: 3 });
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

      {/* Mobile: Card layout */}
      <div className={styles.cardList}>
        {markets.map((m) => (
          <MarketCard
            key={m.id}
            market={m}
            isSelected={selectedMarketId === m.id}
            onPick={onPick}
          />
        ))}
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import type { ValidatedMarket } from '@/integrations/pear/marketValidation';
import { formatPairOrBasketSide } from '@/lib/marketDisplay';
import styles from './MarketFeed.module.css';

function formatPunchline(m: ValidatedMarket) {
  return `${formatPairOrBasketSide(m, 'long')} vs ${formatPairOrBasketSide(m, 'short')}`;
}

function MarketCardReadOnly({ market }: { market: ValidatedMarket }) {
  const punchline = formatPunchline(market);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <Link className={styles.marketLink} href={`/markets/${market.id}`}>
          {market.name}
        </Link>
        <div className={styles.marketMeta}>
          <span className={styles.metaTag}>{market.leverage}x</span>
          <span className={styles.metaTag}>{market.category}</span>
          {!market.isTradable && <span className={styles.metaTagClosed}>Inactive</span>}
        </div>
      </div>

      <div className={styles.cardDesc}>{market.description}</div>

      <div className={styles.cardPair}>{punchline}</div>

      <Link
        href={`/markets/${market.id}`}
        className={styles.btnViewFull}
      >
        View Details
      </Link>
    </div>
  );
}

export function MarketFeedReadOnly({
  markets,
}: {
  markets: ValidatedMarket[];
}) {
  return (
    <div className={styles.wrapper}>
      {/* Desktop: Table layout */}
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
            const punchline = formatPunchline(m);

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
                    <span className="text-xs font-mono" style={{ color: 'var(--primary)' }}>{m.leverage}x</span>
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

      {/* Mobile: Card layout */}
      <div className={styles.cardList}>
        {markets.map((m) => (
          <MarketCardReadOnly key={m.id} market={m} />
        ))}
      </div>
    </div>
  );
}

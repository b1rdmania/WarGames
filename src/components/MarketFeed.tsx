'use client';

import Link from 'next/link';
import type { ValidatedMarket } from '@/integrations/pear/marketValidation';
import styles from './MarketFeed.module.css';

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
            <th className={styles.th}>THESIS</th>
            <th className={styles.th}>TAGS</th>
            <th className={styles.th} style={{ textAlign: 'right' }}>
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody>
          {markets.map((m) => (
            <tr key={m.id} className={styles.row}>
              <td className={styles.td}>
                <div className={styles.marketName}>
                  <Link className={styles.marketLink} href={`/markets/${m.id}`}>
                    {m.name}
                  </Link>
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
          ))}
        </tbody>
      </table>
    </div>
  );
}


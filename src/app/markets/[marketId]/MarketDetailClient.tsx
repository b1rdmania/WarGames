'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { RiskShell } from '@/components/RiskShell';
import { ControlRoomTopNav } from '@/components/ControlRoomTopNav';
import { getMarketNarrative } from '@/components/MarketDetail';
import { useValidatedMarkets } from '@/hooks/useValidatedMarkets';
import styles from '@/components/MarketDetail.module.css';

function cleanSymbol(s: string) {
  return s.split(':').pop()!.trim();
}

function formatWeight(w: number) {
  return `${Math.round(w * 100)}%`;
}

export default function MarketDetailClient({ marketId }: { marketId: string }) {
  const { markets } = useValidatedMarkets();
  const market = useMemo(() => markets.find((m) => m.id === marketId) ?? null, [markets, marketId]);

  if (!market) {
    return (
      <RiskShell nav={<ControlRoomTopNav />}>
        <div className="text-text-secondary">
          Market not found.{' '}
          <Link href="/markets" className="underline" style={{ color: 'var(--primary)' }}>
            Return to markets
          </Link>
        </div>
      </RiskShell>
    );
  }

  const resolvedPairs = market.resolvedPairs ?? market.pairs;
  const resolvedBasket = market.resolvedBasket ?? market.basket;
  const narrative = getMarketNarrative(market.id);
  const overview = narrative?.overview ?? market.description;

  return (
    <RiskShell nav={<ControlRoomTopNav />}>
      <div className={styles.hero}>
        <h1 className={styles.title}>{market.name}</h1>
        <p className={styles.subtitle}>{market.description}</p>
        {overview !== market.description && (
          <p className={styles.overview}>{overview}</p>
        )}
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Details</div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Category</span>
            <span className={styles.rowValue}>{market.category}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Leverage</span>
            <span className={styles.rowValue}>{market.leverage}x</span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Status</span>
            <span className={styles.rowValue}>
              {market.isTradable ? 'Active' : 'Inactive'}
            </span>
          </div>
          {!market.isTradable && market.unavailableReason && (
            <div className={styles.row}>
              <span className={styles.rowLabel}>Note</span>
              <span className={styles.rowValue}>{market.unavailableReason}</span>
            </div>
          )}
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitle}>Composition</div>
          <div className={styles.composition}>
            {resolvedPairs ? (
              <>
                <div>
                  <span className={styles.rowLabel}>Long: </span>
                  <span className={styles.long}>{cleanSymbol(resolvedPairs.long)}</span>
                </div>
                <div>
                  <span className={styles.rowLabel}>Short: </span>
                  <span className={styles.short}>{cleanSymbol(resolvedPairs.short)}</span>
                </div>
              </>
            ) : resolvedBasket ? (
              <>
                <div>
                  <span className={styles.rowLabel}>Long: </span>
                  <span className={styles.long}>
                    {resolvedBasket.long.map((a, i) => (
                      <span key={a.asset}>
                        {i > 0 && ', '}
                        {cleanSymbol(a.asset)} {formatWeight(a.weight)}
                      </span>
                    ))}
                  </span>
                </div>
                <div>
                  <span className={styles.rowLabel}>Short: </span>
                  <span className={styles.short}>
                    {resolvedBasket.short.map((a, i) => (
                      <span key={a.asset}>
                        {i > 0 && ', '}
                        {cleanSymbol(a.asset)} {formatWeight(a.weight)}
                      </span>
                    ))}
                  </span>
                </div>
              </>
            ) : (
              <span>—</span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.divider} />

      {narrative?.why && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Why this matters</h2>
          <p className={styles.sectionBody}>{narrative.why}</p>
        </section>
      )}

      {narrative?.model && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>How it works</h2>
          <p className={styles.sectionBody}>{narrative.model}</p>
        </section>
      )}

      <Link href="/trade" className={styles.cta}>
        Trade this market
      </Link>

      <div>
        <Link href="/markets" className={styles.backLink}>
          ← Back to markets
        </Link>
      </div>
    </RiskShell>
  );
}

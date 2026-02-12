'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { RiskShell } from '@/components/RiskShell';
import { ControlRoomTopNav } from '@/components/ControlRoomTopNav';
import {
  ControlRoomPanel,
  ControlRoomSectionHeader,
  ControlRoomButton,
} from '@/components/control-room';
import { getMarketNarrative } from '@/components/MarketDetail';
import { useValidatedMarkets } from '@/hooks/useValidatedMarkets';
import styles from './MarketDetailClient.module.css';

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
        <div className={styles.notFound}>
          <ControlRoomPanel title="MARKET NOT FOUND">
            <p className={styles.notFoundText}>
              The requested market does not exist or has been removed.
            </p>
            <Link href="/markets">
              <ControlRoomButton variant="primary">RETURN TO MARKETS</ControlRoomButton>
            </Link>
          </ControlRoomPanel>
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
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.marketCode}>{market.id.toUpperCase().replace(/-/g, '_')}</div>
          <h1 className={styles.title}>{market.name}</h1>
          <p className={styles.subtitle}>{overview}</p>
        </div>

        {/* Grid Layout */}
        <div className={styles.grid}>
          {/* Details Panel */}
          <ControlRoomPanel title="MARKET PARAMETERS">
            <div className={styles.detailsGrid}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>CATEGORY</span>
                <span className={styles.detailValue}>{market.category?.toUpperCase() || 'N/A'}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>LEVERAGE</span>
                <span className={styles.detailValue}>{market.leverage}x</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>STATUS</span>
                <span className={`${styles.detailValue} ${market.isTradable ? styles.statusActive : styles.statusInactive}`}>
                  {market.isTradable ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
              {!market.isTradable && market.unavailableReason && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>NOTE</span>
                  <span className={styles.detailValue}>{market.unavailableReason}</span>
                </div>
              )}
            </div>
          </ControlRoomPanel>

          {/* Composition Panel */}
          <ControlRoomPanel title="INDEX COMPOSITION">
            <div className={styles.compositionGrid}>
              {resolvedPairs ? (
                <>
                  <div className={styles.compositionRow}>
                    <span className={styles.compositionLabel}>LONG</span>
                    <span className={styles.compositionLong}>{cleanSymbol(resolvedPairs.long)}</span>
                  </div>
                  <div className={styles.compositionRow}>
                    <span className={styles.compositionLabel}>SHORT</span>
                    <span className={styles.compositionShort}>{cleanSymbol(resolvedPairs.short)}</span>
                  </div>
                </>
              ) : resolvedBasket ? (
                <>
                  <div className={styles.compositionRow}>
                    <span className={styles.compositionLabel}>LONG</span>
                    <span className={styles.compositionLong}>
                      {resolvedBasket.long.map((a, i) => (
                        <span key={a.asset}>
                          {i > 0 && ' + '}
                          {cleanSymbol(a.asset)} ({formatWeight(a.weight)})
                        </span>
                      ))}
                    </span>
                  </div>
                  <div className={styles.compositionRow}>
                    <span className={styles.compositionLabel}>SHORT</span>
                    <span className={styles.compositionShort}>
                      {resolvedBasket.short.map((a, i) => (
                        <span key={a.asset}>
                          {i > 0 && ' + '}
                          {cleanSymbol(a.asset)} ({formatWeight(a.weight)})
                        </span>
                      ))}
                    </span>
                  </div>
                </>
              ) : (
                <span className={styles.compositionEmpty}>—</span>
              )}
            </div>
          </ControlRoomPanel>
        </div>

        {/* Narrative Sections */}
        {narrative?.why && (
          <ControlRoomPanel title="STRATEGIC RATIONALE">
            <p className={styles.narrativeText}>{narrative.why}</p>
          </ControlRoomPanel>
        )}

        {narrative?.model && (
          <ControlRoomPanel title="EXECUTION MODEL">
            <p className={styles.narrativeText}>{narrative.model}</p>
          </ControlRoomPanel>
        )}

        {/* Actions */}
        <div className={styles.actions}>
          <Link href="/trade">
            <ControlRoomButton variant="primary">TRADE THIS MARKET</ControlRoomButton>
          </Link>
          <Link href="/markets">
            <ControlRoomButton>← BACK TO MARKETS</ControlRoomButton>
          </Link>
        </div>
      </div>
    </RiskShell>
  );
}

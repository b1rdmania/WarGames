'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { RiskShell } from '@/components/RiskShell';
import { ControlRoomTopNav } from '@/components/ControlRoomTopNav';
import {
  ControlRoomPanel,
  ControlRoomButton,
  ControlRoomSectionHeader,
  ControlRoomStatusRail,
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
      <div className={styles.shell}>
        {/* Situation Board - Market Info */}
        <div className={styles.situationBoard}>
          <ControlRoomPanel title="MARKET INTELLIGENCE" subtitle={market.id.toUpperCase().replace(/-/g, '_')}>
            <div className={styles.boardContent}>
              {/* Header */}
              <div className={styles.header}>
                <h1 className={styles.title}>{market.name}</h1>
                <p className={styles.overview}>{overview}</p>
              </div>

              {/* Market Parameters */}
              <div className={styles.section}>
                <div className={styles.sectionLabel}>MARKET PARAMETERS</div>
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
              </div>

              {/* Strategic Rationale */}
              {narrative?.why && (
                <div className={styles.section}>
                  <div className={styles.sectionLabel}>STRATEGIC RATIONALE</div>
                  <p className={styles.narrativeText}>{narrative.why}</p>
                </div>
              )}

              {/* Execution Model */}
              {narrative?.model && (
                <div className={styles.section}>
                  <div className={styles.sectionLabel}>EXECUTION MODEL</div>
                  <p className={styles.narrativeText}>{narrative.model}</p>
                </div>
              )}
            </div>
          </ControlRoomPanel>
        </div>

        {/* Mission Console - Composition & Actions */}
        <div className={styles.missionConsole}>
          <ControlRoomPanel title="MISSION CONSOLE" subtitle="INDEX COMPOSITION">
            <div className={styles.consoleContent}>
              {/* Composition */}
              <div className={styles.composition}>
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
                      <div className={styles.compositionLong}>
                        {resolvedBasket.long.map((a, i) => (
                          <div key={a.asset} className={styles.assetLine}>
                            {cleanSymbol(a.asset)} <span className={styles.weight}>({formatWeight(a.weight)})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={styles.compositionRow}>
                      <span className={styles.compositionLabel}>SHORT</span>
                      <div className={styles.compositionShort}>
                        {resolvedBasket.short.map((a, i) => (
                          <div key={a.asset} className={styles.assetLine}>
                            {cleanSymbol(a.asset)} <span className={styles.weight}>({formatWeight(a.weight)})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <span className={styles.compositionEmpty}>—</span>
                )}
              </div>

              {/* Thesis */}
              <ControlRoomSectionHeader label="THESIS">
                {narrative?.thesis ?? market.description}
              </ControlRoomSectionHeader>

              {/* Actions */}
              <div className={styles.actions}>
                <Link href="/trade">
                  <ControlRoomButton variant="primary" fullWidth>TRADE THIS MARKET</ControlRoomButton>
                </Link>
                <Link href="/markets">
                  <ControlRoomButton fullWidth>← BACK TO MARKETS</ControlRoomButton>
                </Link>
              </div>
            </div>
          </ControlRoomPanel>
        </div>
      </div>

      {/* Status Rail */}
      <ControlRoomStatusRail
        leftItems={[
          { key: 'MARKET', value: market.id.toUpperCase().replace(/-/g, '_') },
          { key: 'LEVERAGE', value: `${market.leverage}x` },
        ]}
        rightItems={[
          { key: 'MODE', value: 'INTELLIGENCE' },
          { key: 'STATUS', value: market.isTradable ? 'ACTIVE' : 'INACTIVE' },
        ]}
      />
    </RiskShell>
  );
}

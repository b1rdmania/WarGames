'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useValidatedMarkets } from '@/hooks/useValidatedMarkets';
import { RiskShell } from '@/components/RiskShell';
import { ControlRoomTopNav } from '@/components/ControlRoomTopNav';
import { getMarketNarrative } from '@/components/MarketDetail';
import {
  ControlRoomPanel,
  ControlRoomTable,
  ControlRoomTableHeader,
  ControlRoomTableBody,
  ControlRoomTableRow,
  ControlRoomTableCell,
  ControlRoomButton,
  ControlRoomSectionHeader,
  ControlRoomStatusRail,
} from '@/components/control-room';
import type { PearMarketConfig } from '@/integrations/pear/types';
import styles from './MarketsClient.module.css';

function cleanSymbol(s: string) {
  return s.split(':').pop()!.trim();
}

function formatWeight(w: number) {
  return `${Math.round(w * 100)}%`;
}

export default function MarketsClient() {
  const { markets: validatedMarkets } = useValidatedMarkets();
  const effectiveMarkets = (validatedMarkets ?? []).filter(m => m.category !== 'crypto');
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null);

  const selectedMarket = effectiveMarkets.find(m => m.id === selectedMarketId) ?? null;

  return (
    <RiskShell nav={<ControlRoomTopNav />}>
      <div className={styles.shell}>
        {/* Situation Board - Market List */}
        <div className={styles.situationBoard}>
          <ControlRoomPanel title="SITUATION BOARD" subtitle="NARRATIVE MARKETS // BROWSE">
            <ControlRoomTable>
              <ControlRoomTableHeader>
                <ControlRoomTableRow>
                  <ControlRoomTableCell header>CODE</ControlRoomTableCell>
                  <ControlRoomTableCell header>THESIS</ControlRoomTableCell>
                  <ControlRoomTableCell header>REGIME</ControlRoomTableCell>
                  <ControlRoomTableCell header>LEV</ControlRoomTableCell>
                </ControlRoomTableRow>
              </ControlRoomTableHeader>
              <ControlRoomTableBody>
                {effectiveMarkets.map((market) => (
                  <ControlRoomTableRow
                    key={market.id}
                    active={selectedMarketId === market.id}
                    onClick={() => setSelectedMarketId(market.id)}
                  >
                    <ControlRoomTableCell mono>{market.id.toUpperCase().replace(/-/g, '_')}</ControlRoomTableCell>
                    <ControlRoomTableCell>{market.name}</ControlRoomTableCell>
                    <ControlRoomTableCell>{market.category?.toUpperCase() || 'N/A'}</ControlRoomTableCell>
                    <ControlRoomTableCell>{market.leverage}x</ControlRoomTableCell>
                  </ControlRoomTableRow>
                ))}
              </ControlRoomTableBody>
            </ControlRoomTable>
          </ControlRoomPanel>
        </div>

        {/* Mission Console - Market Details */}
        <div className={styles.missionConsole}>
          {!selectedMarket ? (
            <ControlRoomPanel title="MISSION CONSOLE" subtitle="MARKET INTELLIGENCE">
              <div className={styles.emptyState}>
                <p className={styles.emptyText}>SELECT A MARKET TO VIEW DETAILS</p>
              </div>
            </ControlRoomPanel>
          ) : (
            <ControlRoomPanel title="MISSION CONSOLE" subtitle={selectedMarket.id.toUpperCase().replace(/-/g, '_')}>
              <div className={styles.consoleContent}>
                <ControlRoomSectionHeader label="THESIS">
                  {selectedMarket.name}
                </ControlRoomSectionHeader>

                <div className={styles.narrative}>
                  <div className={styles.narrativeLabel}>OVERVIEW</div>
                  <p className={styles.narrativeText}>
                    {getMarketNarrative(selectedMarket.id)?.overview ?? selectedMarket.description}
                  </p>
                </div>

                {/* Composition */}
                <div className={styles.composition}>
                  <div className={styles.compositionLabel}>INDEX COMPOSITION</div>
                  {selectedMarket.pairs ? (
                    <div className={styles.compositionGrid}>
                      <div className={styles.compositionRow}>
                        <span className={styles.label}>LONG</span>
                        <span className={styles.longValue}>{cleanSymbol(selectedMarket.pairs.long)}</span>
                      </div>
                      <div className={styles.compositionRow}>
                        <span className={styles.label}>SHORT</span>
                        <span className={styles.shortValue}>{cleanSymbol(selectedMarket.pairs.short)}</span>
                      </div>
                    </div>
                  ) : selectedMarket.basket ? (
                    <div className={styles.compositionGrid}>
                      <div className={styles.compositionRow}>
                        <span className={styles.label}>LONG</span>
                        <span className={styles.longValue}>
                          {selectedMarket.basket.long.map((a, i) => (
                            <span key={a.asset}>
                              {i > 0 && ' + '}
                              {cleanSymbol(a.asset)} ({formatWeight(a.weight)})
                            </span>
                          ))}
                        </span>
                      </div>
                      <div className={styles.compositionRow}>
                        <span className={styles.label}>SHORT</span>
                        <span className={styles.shortValue}>
                          {selectedMarket.basket.short.map((a, i) => (
                            <span key={a.asset}>
                              {i > 0 && ' + '}
                              {cleanSymbol(a.asset)} ({formatWeight(a.weight)})
                            </span>
                          ))}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className={styles.emptyValue}>—</span>
                  )}
                </div>

                {/* Parameters */}
                <div className={styles.parameters}>
                  <div className={styles.paramRow}>
                    <span className={styles.paramLabel}>CATEGORY</span>
                    <span className={styles.paramValue}>{selectedMarket.category?.toUpperCase() || 'N/A'}</span>
                  </div>
                  <div className={styles.paramRow}>
                    <span className={styles.paramLabel}>LEVERAGE</span>
                    <span className={styles.paramValue}>{selectedMarket.leverage}x</span>
                  </div>
                  <div className={styles.paramRow}>
                    <span className={styles.paramLabel}>STATUS</span>
                    <span className={`${styles.paramValue} ${selectedMarket.isTradable ? styles.statusActive : styles.statusInactive}`}>
                      {selectedMarket.isTradable ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                  <Link href={`/markets/${selectedMarket.id}`}>
                    <ControlRoomButton fullWidth>FULL INTELLIGENCE →</ControlRoomButton>
                  </Link>
                  <Link href="/trade">
                    <ControlRoomButton variant="primary" fullWidth>GO TO TRADE</ControlRoomButton>
                  </Link>
                </div>
              </div>
            </ControlRoomPanel>
          )}
        </div>
      </div>

      {/* Status Rail */}
      <ControlRoomStatusRail
        leftItems={[
          { key: 'MARKETS', value: effectiveMarkets.length.toString() },
          { key: 'SELECTED', value: selectedMarket?.name || 'NONE' },
        ]}
        rightItems={[
          { key: 'MODE', value: 'BROWSE' },
          { key: 'STATE', value: 'ARMED' },
        ]}
      />
    </RiskShell>
  );
}

'use client';

import { useMemo } from 'react';
import type { PearPosition } from '@/integrations/pear/types';
import { PortfolioSummary } from '@/components/PortfolioSummary';
import { PositionCard } from '@/components/PositionCard';
import { WarMark } from '@/components/WarMark';
import styles from './ControlRoomPortfolioSurface.module.css';

type LogLevel = 'INFO' | 'ALERT' | 'EXEC';

type LogItem = {
  at: string;
  level: LogLevel;
  text: string;
};

function stamp(date = new Date()) {
  return date.toTimeString().slice(0, 8);
}

function shortAddr(address?: string) {
  if (!address) return 'UNKNOWN';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function ControlRoomPortfolioSurface({
  positions,
  balance,
  loadingPositions,
  refreshingPositions,
  hasLoadedPositions,
  detailsOpen,
  accessToken,
  operatorAddress,
  onToggleDetails,
  onRefresh,
  onPositionClosed,
}: {
  positions: PearPosition[];
  balance: string | null;
  loadingPositions: boolean;
  refreshingPositions: boolean;
  hasLoadedPositions: boolean;
  detailsOpen: boolean;
  accessToken: string;
  operatorAddress?: string;
  onToggleDetails: () => void;
  onRefresh: () => Promise<void>;
  onPositionClosed: () => void;
}) {
  const totalPnl = useMemo(() => positions.reduce((sum, pos) => sum + Number(pos.pnl), 0), [positions]);
  const riskRegime = positions.length >= 4 ? 'ELEVATED' : positions.length > 0 ? 'ACTIVE' : 'LOW';
  const operator = shortAddr(operatorAddress);

  const logItems = useMemo<LogItem[]>(() => {
    const logs: LogItem[] = [
      { at: stamp(), level: 'INFO', text: `Operator session active (${operator}).` },
      { at: stamp(), level: 'INFO', text: `Portfolio sync ${refreshingPositions ? 'in progress' : 'nominal'}.` },
      { at: stamp(), level: 'INFO', text: `Open positions: ${positions.length}.` },
    ];

    if (positions.length > 0) {
      logs.push({
        at: stamp(),
        level: totalPnl >= 0 ? 'EXEC' : 'ALERT',
        text: `Portfolio PnL ${totalPnl >= 0 ? 'positive' : 'negative'} at $${totalPnl.toFixed(2)}.`,
      });
    }

    if (!hasLoadedPositions && loadingPositions) {
      logs.push({ at: stamp(), level: 'INFO', text: 'Initial position snapshot loading.' });
    }

    if (positions.length === 0 && hasLoadedPositions) {
      logs.push({ at: stamp(), level: 'ALERT', text: 'No active positions. Exposure is flat.' });
    }

    return logs.slice(0, 8);
  }, [hasLoadedPositions, loadingPositions, operator, positions.length, refreshingPositions, totalPnl]);

  return (
    <section className={styles.root}>
      <div className={styles.grid}>
        <section className={styles.board}>
          <div className={styles.sectionTitle}>Situation Board</div>
          <div className={styles.metrics}>
            <div className={styles.metric}>
              <span>OPEN</span>
              <strong>{positions.length}</strong>
            </div>
            <div className={styles.metric}>
              <span>PNL</span>
              <strong className={totalPnl >= 0 ? styles.good : styles.bad}>
                {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
              </strong>
            </div>
            <div className={styles.metric}>
              <span>RISK REGIME</span>
              <strong>{riskRegime}</strong>
            </div>
            <div className={styles.metric}>
              <span>AVAILABLE</span>
              <strong>${balance ? Number(balance).toFixed(2) : '0.00'}</strong>
            </div>
          </div>

          <div className={styles.summaryToggle}>
            <button type="button" onClick={onToggleDetails}>
              {detailsOpen ? 'HIDE SUMMARY' : 'SHOW SUMMARY'}
            </button>
          </div>

          {detailsOpen ? (
            <div className={styles.summaryWrap}>
              <PortfolioSummary positions={positions} balance={balance} />
            </div>
          ) : null}
        </section>

        <section className={styles.log}>
          <div className={styles.sectionTitle}>Event Log</div>
          <div className={styles.logList}>
            {logItems.map((item) => (
              <div key={`${item.at}-${item.level}-${item.text}`} className={styles.logRow}>
                <span className={styles.logAt}>{item.at}</span>
                <span
                  className={`${styles.logLevel} ${
                    item.level === 'ALERT' ? styles.logAlert : item.level === 'EXEC' ? styles.logExec : styles.logInfo
                  }`}
                >
                  {item.level}
                </span>
                <span className={styles.logText}>{item.text}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.console}>
          <div className={styles.sectionTitle}>Mission Console</div>
          <div className={styles.consoleMeta}>
            <span>MODE: MONITOR</span>
            <span>INTEL: SIGMA-PURPLE</span>
          </div>
          <button
            type="button"
            onClick={() => {
              onRefresh().catch(() => {
                // No-op: caller handles toast state.
              });
            }}
            disabled={refreshingPositions || !accessToken}
            className={styles.refresh}
          >
            {refreshingPositions ? 'SYNCING...' : 'REFRESH POSITIONS'}
          </button>
          <div className={styles.consoleHint}>Execution and unwind controls remain in each position ticket.</div>
        </section>
      </div>

      <section className={styles.positions}>
        <div className={styles.sectionTitle}>Active Positions</div>
        {loadingPositions && !hasLoadedPositions ? (
          <div className={styles.emptyState}>
            <WarMark size={40} animate />
            <span>Loading positions...</span>
          </div>
        ) : positions.length === 0 ? (
          <div className={styles.emptyState}>
            <WarMark size={40} className="opacity-40" />
            <span>No active positions.</span>
          </div>
        ) : (
          <div className={styles.positionList}>
            {positions.map((pos) => (
              <PositionCard key={pos.id} position={pos} accessToken={accessToken} onClose={onPositionClosed} />
            ))}
          </div>
        )}
      </section>

      <div className={styles.rail}>
        <span>STATUS: {refreshingPositions ? 'SYNCING' : 'STABLE'}</span>
        <span>OPERATOR: {operator}</span>
        <span>RISK: {riskRegime}</span>
        <span>OPEN: {positions.length}</span>
      </div>
    </section>
  );
}

'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import {
  TerminalShell,
  TerminalMenuBar,
  TerminalPaneTitle,
  TerminalCommandBar,
  TerminalKV,
  TerminalKVRow,
  TerminalStatusBar,
  TerminalSessionBadge,
} from '@/components/terminal';
import type { StatsSummary } from '@/lib/stats/types';
import { getGifPath } from '@/lib/gifPaths';
import { MARKETS } from '@/integrations/pear/markets';
import styles from './stats.module.css';

function num(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function pct(value: number) {
  return `${Math.max(0, Math.min(100, value)).toFixed(1)}%`;
}

export default function StatsPage() {
  const [data, setData] = useState<StatsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/stats/summary?days=30', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load stats');
      const json = (await res.json()) as StatsSummary;
      setData(json);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  const successRate = data && data.totals.attempted > 0
    ? (data.totals.successful / data.totals.attempted) * 100
    : 0;

  const activeDays = data
    ? data.daily.filter((d) => d.successful > 0 || d.notionalUsd > 0).length
    : 0;

  const avgDailyNotional = activeDays > 0 && data
    ? data.daily.reduce((sum, d) => sum + d.notionalUsd, 0) / activeDays
    : 0;

  const marketCategory = new Map(MARKETS.map((m) => [m.id, m.category]));
  const categoryTotals = { macro: 0, geopolitical: 0, crypto: 0, tech: 0 };
  if (data) {
    for (const row of data.topMarkets) {
      const cat = marketCategory.get(row.marketId) ?? 'macro';
      if (cat in categoryTotals) {
        categoryTotals[cat as keyof typeof categoryTotals] += row.notionalUsd;
      }
    }
  }
  const totalCategoryNotional = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  const goals = data
    ? [
        { label: 'First 25 trades', current: data.totals.successful, target: 25 },
        { label: 'First $10k routed', current: data.totals.notionalUsd, target: 10_000 },
        { label: 'First 10 wallets', current: data.totals.uniqueWallets, target: 10 },
      ]
    : [];

  const pulseWindow = (data?.daily ?? []).slice(-7);
  const maxPulse = Math.max(1, ...pulseWindow.map((d) => d.successful));
  const matrixNumbersGif = getGifPath('matrix-numbers', '/gifs/library/markets/matrix-numbers.gif');
  const lineChartGif = getGifPath('line-chart', '/gifs/library/markets/line-chart.gif');
  const countdownGif = getGifPath('countdown', '/gifs/library/markets/countdown.gif');

  return (
    <TerminalShell
      menuBar={<TerminalMenuBar items={[]} right={<TerminalSessionBadge />} />}
      leftPane={
        <div className={styles.pane}>
          <TerminalPaneTitle>ROUTING PROOF</TerminalPaneTitle>
          <div className={styles.gifRow}>
            <Image
              src={matrixNumbersGif}
              width={86}
              height={28}
              alt="Animated matrix numbers"
              unoptimized
              className={styles.gifBadge}
            />
          </div>
          <div className={styles.hero}>{data ? `$${num(data.totals.notionalUsd)}` : '$0'}</div>
          <div className={styles.heroLabel}>TOTAL NOTIONAL ROUTED</div>
          <div className={styles.divider} />
          {loading ? <div className={styles.muted}>LOADING…</div> : null}
          {error ? <div className={styles.error}>{error}</div> : null}
          <TerminalKV>
            <TerminalKVRow label="SUCCESS RATE" value={pct(successRate)} />
            <TerminalKVRow label="SUCCESSFUL TRADES" value={num(data?.totals.successful ?? 0)} />
            <TerminalKVRow label="UNIQUE WALLETS" value={num(data?.totals.uniqueWallets ?? 0)} />
            <TerminalKVRow label="ACTIVE DAYS" value={num(activeDays)} />
            <TerminalKVRow label="AVG DAILY NOTIONAL" value={`$${num(avgDailyNotional)}`} />
            <TerminalKVRow
              label="ATTEMPTS / FAILED"
              value={`${num(data?.totals.attempted ?? 0)} / ${num(data?.totals.failed ?? 0)}`}
            />
          </TerminalKV>
        </div>
      }
      centerPane={
        <div className={styles.pane}>
          <TerminalPaneTitle>MARKET ACTIVITY</TerminalPaneTitle>
          <div className={styles.gifRow}>
            <Image
              src={lineChartGif}
              width={72}
              height={34}
              alt="Animated line chart"
              unoptimized
              className={styles.gifBadge}
            />
          </div>
          <div className={styles.mix}>
            {(data?.topMarkets ?? []).slice(0, 5).map((m) => {
              const w = (data?.totals.notionalUsd ?? 0) > 0 ? (m.notionalUsd / (data?.totals.notionalUsd ?? 1)) * 100 : 0;
              return (
                <div key={m.marketId} className={styles.mixRow}>
                  <div className={styles.mixLabel}>
                    <span>{m.marketId.toUpperCase()}</span>
                    <span>{num(m.successfulTrades)} trades · ${num(m.notionalUsd)}</span>
                  </div>
                  <div className={styles.mixBar}>
                    <div className={styles.mixFill} style={{ width: `${Math.min(100, Math.max(2, w))}%` }} />
                  </div>
                </div>
              );
            })}
            {(data?.topMarkets.length ?? 0) === 0 ? <div className={styles.muted}>NO ROUTED TRADES YET.</div> : null}
          </div>

          <div className={styles.subsection}>
            <div className={styles.subhead}>CATEGORY MIX</div>
            <TerminalKV>
              {[
                { key: 'macro', label: 'MACRO' },
                { key: 'geopolitical', label: 'GEOPOLITICS' },
                { key: 'crypto', label: 'CRYPTO' },
                { key: 'tech', label: 'DEGEN' },
              ].map((c) => {
                const value = categoryTotals[c.key as keyof typeof categoryTotals];
                const share = totalCategoryNotional > 0 ? (value / totalCategoryNotional) * 100 : 0;
                return <TerminalKVRow key={c.key} label={c.label} value={pct(share)} />;
              })}
            </TerminalKV>
          </div>

          <div className={styles.subsection}>
            <div className={styles.subhead}>7-DAY PULSE</div>
            <div className={styles.pulse}>
              {pulseWindow.map((d) => {
                const heightPct = Math.max(4, Math.round((d.successful / maxPulse) * 100));
                const day = new Date(`${d.date}T00:00:00Z`).toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 1);
                return (
                  <div key={d.date} className={styles.pulseWrap}>
                    <div className={styles.pulseBar} style={{ height: `${heightPct}%` }} />
                    <div className={styles.pulseLabel}>{day}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      }
      rightPane={
        <div className={styles.pane}>
          <TerminalPaneTitle>TARGETS & HISTORY</TerminalPaneTitle>
          <div className={styles.gifRow}>
            <Image
              src={countdownGif}
              width={74}
              height={31}
              alt="Animated countdown display"
              unoptimized
              className={styles.gifBadge}
            />
          </div>
          <button
            type="button"
            className={styles.refreshBtn}
            onClick={() => void loadStats()}
          >
            REFRESH DATA
          </button>
          <div className={styles.subhead}>WARM-UP TARGETS</div>
          <div className={styles.goals}>
            {goals.map((g) => {
              const progress = g.target > 0 ? (g.current / g.target) * 100 : 0;
              return (
                <div key={g.label} className={styles.goal}>
                  <div className={styles.goalHead}>
                    <span>{g.label.toUpperCase()}</span>
                    <span>{num(g.current)} / {num(g.target)}</span>
                  </div>
                  <div className={styles.goalBar}>
                    <div className={styles.goalFill} style={{ width: `${Math.min(100, progress)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.subsection}>
            <div className={styles.subhead}>DAILY LOG</div>
            <div className={styles.table}>
              <div className={styles.head}>
                <span>DATE</span>
                <span>OK</span>
                <span>$</span>
              </div>
              {(data?.daily ?? []).slice(-7).map((d) => (
                <div key={d.date} className={styles.row}>
                  <span>{d.date.slice(5)}</span>
                  <span>{num(d.successful)}</span>
                  <span>${num(d.notionalUsd)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
      commandBar={
        <TerminalCommandBar
          commands={[
            { key: 'F1', label: 'HELP' },
            { key: 'F2', label: 'MARKETS' },
            { key: 'F3', label: 'TRADE' },
            { key: 'F4', label: 'PORTFOLIO' },
            { key: 'F5', label: 'INTEL' },
            { key: 'F9', label: 'REFRESH' },
          ]}
        />
      }
      statusBar={
        <TerminalStatusBar
          items={[
            { label: 'PAGE', value: 'STATS' },
            { label: 'WINDOW', value: '30D' },
            { label: 'SOURCE', value: data?.storage?.toUpperCase() ?? '—' },
            { label: 'STATE', value: loading ? 'LOADING' : error ? 'ERROR' : 'LIVE' },
          ]}
        />
      }
    />
  );
}

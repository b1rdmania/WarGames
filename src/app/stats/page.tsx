'use client';

import { useEffect, useState } from 'react';
import {
  TerminalShell,
  TerminalMenuBar,
  TerminalPaneTitle,
  TerminalStatusBar,
  TerminalSessionBadge,
} from '@/components/terminal';
import type { StatsSummary } from '@/lib/stats/types';
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

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch('/api/stats/summary?days=30', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load stats');
        const json = (await res.json()) as StatsSummary;
        setData(json);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

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

  return (
    <TerminalShell
      menuBar={<TerminalMenuBar items={[]} right={<TerminalSessionBadge />} />}
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
    >
      <div className={styles.wrap}>
        <section className={styles.panel}>
          <TerminalPaneTitle>ROUTING PROOF</TerminalPaneTitle>
          {loading ? <div className={styles.muted}>LOADING…</div> : null}
          {error ? <div className={styles.error}>{error}</div> : null}
          {data ? (
            <div className={styles.kpis}>
              <div className={styles.kpi}><span>NOTIONAL ROUTED</span><strong>${num(data.totals.notionalUsd)}</strong></div>
              <div className={styles.kpi}><span>SUCCESS RATE</span><strong>{pct(successRate)}</strong></div>
              <div className={styles.kpi}><span>SUCCESSFUL TRADES</span><strong>{num(data.totals.successful)}</strong></div>
              <div className={styles.kpi}><span>UNIQUE WALLETS</span><strong>{num(data.totals.uniqueWallets)}</strong></div>
              <div className={styles.kpi}><span>ACTIVE DAYS</span><strong>{num(activeDays)}</strong></div>
              <div className={styles.kpi}><span>AVG DAILY NOTIONAL</span><strong>${num(avgDailyNotional)}</strong></div>
              <div className={styles.kpi}><span>ATTEMPTS / FAILED</span><strong>{num(data.totals.attempted)} / {num(data.totals.failed)}</strong></div>
              <div className={styles.kpi}><span>ATTRIBUTION</span><strong>CLIENTID</strong></div>
            </div>
          ) : null}
        </section>

        <section className={styles.panel}>
          <TerminalPaneTitle>MARKET MIX</TerminalPaneTitle>
          {data ? (
            <div className={styles.mix}>
              {(data.topMarkets ?? []).slice(0, 5).map((m) => {
                const w = data.totals.notionalUsd > 0 ? (m.notionalUsd / data.totals.notionalUsd) * 100 : 0;
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
              {data.topMarkets.length === 0 ? <div className={styles.muted}>NO ROUTED TRADES YET.</div> : null}
            </div>
          ) : null}
          <div className={styles.categoryGrid}>
            {[
              { key: 'macro', label: 'MACRO' },
              { key: 'geopolitical', label: 'GEOPOLITICS' },
              { key: 'crypto', label: 'CRYPTO' },
              { key: 'tech', label: 'DEGEN' },
            ].map((c) => {
              const value = categoryTotals[c.key as keyof typeof categoryTotals];
              const share = totalCategoryNotional > 0 ? (value / totalCategoryNotional) * 100 : 0;
              return (
                <div key={c.key} className={styles.categoryCard}>
                  <span>{c.label}</span>
                  <strong>{pct(share)}</strong>
                </div>
              );
            })}
          </div>
        </section>

        <section className={styles.panel}>
          <TerminalPaneTitle>WARM-UP TARGETS</TerminalPaneTitle>
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
        </section>

        <section className={styles.panel}>
          <TerminalPaneTitle>LAST 7 DAYS</TerminalPaneTitle>
          <div className={styles.table}>
            <div className={styles.head}><span>DATE</span><span>SUCCESS</span><span>NOTIONAL</span></div>
            {(data?.daily ?? []).slice(-7).map((d) => (
              <div key={d.date} className={styles.row}>
                <span>{d.date}</span>
                <span>{num(d.successful)}</span>
                <span>${num(d.notionalUsd)}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </TerminalShell>
  );
}

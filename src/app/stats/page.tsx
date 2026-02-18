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
import styles from './stats.module.css';

function num(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
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
          <TerminalPaneTitle>ROUTED USAGE</TerminalPaneTitle>
          {loading ? <div className={styles.muted}>LOADING…</div> : null}
          {error ? <div className={styles.error}>{error}</div> : null}
          {data ? (
            <div className={styles.kpis}>
              <div className={styles.kpi}><span>NOTIONAL ROUTED</span><strong>${num(data.totals.notionalUsd)}</strong></div>
              <div className={styles.kpi}><span>SUCCESSFUL TRADES</span><strong>{num(data.totals.successful)}</strong></div>
              <div className={styles.kpi}><span>ATTEMPTS</span><strong>{num(data.totals.attempted)}</strong></div>
              <div className={styles.kpi}><span>UNIQUE WALLETS</span><strong>{num(data.totals.uniqueWallets)}</strong></div>
            </div>
          ) : null}
        </section>

        <section className={styles.panel}>
          <TerminalPaneTitle>TOP MARKETS</TerminalPaneTitle>
          <div className={styles.table}>
            <div className={styles.head}><span>MARKET</span><span>TRADES</span><span>NOTIONAL</span></div>
            {(data?.topMarkets ?? []).map((m) => (
              <div key={m.marketId} className={styles.row}>
                <span>{m.marketId.toUpperCase()}</span>
                <span>{num(m.successfulTrades)}</span>
                <span>${num(m.notionalUsd)}</span>
              </div>
            ))}
            {data && data.topMarkets.length === 0 ? <div className={styles.muted}>NO TRADE DATA YET.</div> : null}
          </div>
        </section>

        <section className={styles.panel}>
          <TerminalPaneTitle>DAILY SERIES (30D)</TerminalPaneTitle>
          <div className={styles.table}>
            <div className={styles.head}><span>DATE</span><span>SUCCESS</span><span>NOTIONAL</span></div>
            {(data?.daily ?? []).map((d) => (
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

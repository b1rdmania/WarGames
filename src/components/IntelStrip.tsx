'use client';

import { useEffect, useState } from 'react';
import styles from './IntelStrip.module.css';

type IntelSummary = {
  risk?: { score?: number; bias?: string };
  forecast?: { overallRiskScore?: number; recommendation?: string; windows?: Array<{ windowStart: string; eventName: string; expectedVolatility: number }> };
  narratives?: { narratives?: Array<{ id: string; name: string; score: number; trend?: string }> };
  nextEvent?: { title?: string; date?: string; predicted_impact?: number };
};

export function IntelStrip() {
  const [data, setData] = useState<IntelSummary | null>(null);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        const res = await fetch('/api/intel/summary');
        if (!res.ok) return;
        const json = await res.json();
        if (!active) return;
        setData(json);
      } catch {
        // ignore
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60_000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const riskScore = data?.risk?.score ?? '—';
  const bias = data?.risk?.bias ?? 'unknown';
  const nextWindow = data?.forecast?.windows?.[0];
  const nextEvent = data?.nextEvent?.title || nextWindow?.eventName || 'No critical events';
  const narrative = data?.narratives?.narratives?.[0]?.name || 'No active narrative';

  return (
    <div className={styles.strip}>
      <div className={styles.label}>INTEL</div>
      <div className={styles.item}>
        <span className={styles.k}>RISK</span>
        <span className={styles.v}>{riskScore}</span>
        <span className={styles.muted}>{bias}</span>
      </div>
      <div className={styles.item}>
        <span className={styles.k}>NEXT</span>
        <span className={styles.v}>{nextEvent}</span>
      </div>
      <div className={styles.item}>
        <span className={styles.k}>NARRATIVE</span>
        <span className={styles.v}>{narrative}</span>
      </div>
      <div className={styles.cta}>
        <a href="/intel">Open War Room →</a>
      </div>
    </div>
  );
}

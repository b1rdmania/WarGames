'use client';

import { useEffect, useMemo, useState } from 'react';
import { RiskShell } from '@/components/RiskShell';
import { ControlRoomTopNav } from '@/components/ControlRoomTopNav';
import {
  ControlRoomPanel,
  ControlRoomSectionHeader,
  ControlRoomStatusRail,
} from '@/components/control-room';
import styles from './IntelClient.module.css';

type Summary = {
  risk?: { score?: number; bias?: string; components?: any; drivers?: string[] };
  forecast?: { windows?: Array<{ windowStart: string; eventName: string; expectedVolatility: number }>; recommendation?: string };
  narratives?: { narratives?: Array<{ id: string; name: string; score: number; trend?: string; drivers?: string[] }> };
  regime?: { regime?: string; confidence?: number; note?: string };
  nextEvent?: { title?: string; date?: string; predicted_impact?: number; confidence?: number };
  posture?: { overallRecommendation?: string; windowPostures?: Array<{ positionMultiplier: number; maxLeverage: number; stablecoinAllocationTarget: number; hedgeRecommended: boolean; doNotTradeWindow: boolean; windowStart: string }> };
};

type TickerItem = {
  id: string;
  title: string;
  probability?: number | null;
  tag: string;
  source: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
};

type BreakingItem = {
  id: string;
  title: string;
  tag: string;
  source: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
};

type MarketTapeItem = {
  id: string;
  category: string;
  label: string;
  value: number;
  change?: number | null;
  note?: string;
  unit?: string;
  source: string;
};

type Flow = {
  solana?: any;
  vol?: any;
  credit?: any;
};

type Events = {
  events?: { events?: Array<{ event: string; date: string; time?: string; impact?: string; description?: string }> };
  predict?: { predictions?: Array<{ type: string; impact: number | null; time_to_event_readable: string; recommended_action: string }> };
};

type Extra = {
  defi?: {
    total_tvl_formatted?: string;
    protocol_count?: number;
    categories?: Array<{ category: string; total_tvl: number }>;
    top_protocols?: Array<{ name: string; tvl_formatted?: string; change_1d?: number }>;
  };
};

function severityClass(s: string) {
  if (s === 'critical') return styles.critical;
  if (s === 'high') return styles.high;
  if (s === 'medium') return styles.medium;
  return styles.low;
}

export default function IntelClient() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [breaking, setBreaking] = useState<BreakingItem[]>([]);
  const [markets, setMarkets] = useState<MarketTapeItem[]>([]);
  const [ticker, setTicker] = useState<TickerItem[]>([]);
  const [flow, setFlow] = useState<Flow | null>(null);
  const [events, setEvents] = useState<Events | null>(null);
  const [extra, setExtra] = useState<Extra | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    const fetchAll = async () => {
      const start = performance.now();
      try {
        const safeFetch = async (url: string) => {
          try {
            const res = await fetch(url);
            if (!res.ok) return null;
            return await res.json();
          } catch {
            return null;
          }
        };

        const [
          summaryData,
          breakingData,
          marketsData,
          tickerData,
          flowData,
          eventsData,
          extraData,
        ] = await Promise.all([
          safeFetch('/api/intel/summary'),
          safeFetch('/api/intel/breaking'),
          safeFetch('/api/intel/markets'),
          safeFetch('/api/intel/ticker'),
          safeFetch('/api/intel/flow'),
          safeFetch('/api/intel/events'),
          safeFetch('/api/intel/extra'),
        ]);

        if (!active) return;
        if (summaryData) setSummary(summaryData);
        if (breakingData) setBreaking(breakingData.items || []);
        if (marketsData) setMarkets(marketsData.items || []);
        if (tickerData) setTicker(tickerData.items || []);
        if (flowData) setFlow(flowData);
        if (eventsData) setEvents(eventsData);
        if (extraData) setExtra(extraData);
      } catch {
        // ignore
      } finally {
        if (active) setLatencyMs(Math.round(performance.now() - start));
      }
    };

    fetchAll();
    const interval = setInterval(fetchAll, 30_000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const topNarratives = useMemo(() => {
    const list = summary?.narratives?.narratives || [];
    return [...list].sort((a, b) => b.score - a.score).slice(0, 4);
  }, [summary]);

  const forecastWindows = summary?.forecast?.windows?.slice(0, 3) || [];
  const riskScore = summary?.risk?.score ?? '—';
  const riskBias = summary?.risk?.bias ?? 'unknown';
  const nextEvent = summary?.nextEvent?.title || 'No critical events';
  const posture = summary?.posture?.overallRecommendation || 'Posture pending';
  const predictions = events?.predict?.predictions || [];
  const solana = flow?.solana;
  const credit = flow?.credit;
  const vol = flow?.vol;
  const defi = extra?.defi;

  return (
    <RiskShell nav={<ControlRoomTopNav />}>
      <div className={styles.shell}>
        {/* Situation Board - Data Feeds */}
        <div className={styles.situationBoard}>
          <ControlRoomPanel title="SITUATION BOARD" subtitle="INTELLIGENCE FEEDS // LIVE">
            <div className={styles.boardContent}>
              {/* Breaking News */}
              <div className={styles.feedSection}>
                <div className={styles.feedLabel}>BREAKING</div>
                <div className={styles.feedList}>
                  {breaking.length === 0 ? (
                    <div className={styles.feedItem}>Monitoring geopolitical feeds…</div>
                  ) : (
                    breaking.slice(0, 6).map((b) => (
                      <div key={b.id} className={`${styles.feedItem} ${severityClass(b.severity)}`}>
                        <span className={styles.tag}>[{b.tag}]</span>
                        <span className={styles.headline}>{b.title}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Market Tape */}
              <div className={styles.feedSection}>
                <div className={styles.feedLabel}>MARKET TAPE</div>
                <div className={styles.marketGrid}>
                  {markets.length === 0 ? (
                    <div className={styles.feedItem}>Loading prices…</div>
                  ) : (
                    markets.slice(0, 8).map((m) => (
                      <div key={m.id} className={styles.marketRow}>
                        <span className={styles.marketSymbol}>{m.label}</span>
                        <span className={styles.marketValue}>
                          {m.value.toLocaleString()}{m.unit ? ` ${m.unit}` : ''}
                        </span>
                        {typeof m.change === 'number' && (
                          <span className={`${styles.marketChange} ${m.change < 0 ? styles.marketChangeNeg : ''}`}>
                            {m.change > 0 ? '+' : ''}{m.change.toFixed(2)}%
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Intel Feed */}
              <div className={styles.feedSection}>
                <div className={styles.feedLabel}>INTEL FEED</div>
                <div className={styles.feedList}>
                  {ticker.length === 0 ? (
                    <div className={styles.feedItem}>Awaiting telemetry…</div>
                  ) : (
                    ticker.slice(0, 10).map((t) => (
                      <div key={t.id} className={`${styles.feedItem} ${severityClass(t.severity)}`}>
                        <span className={styles.headline}>{t.title}</span>
                        {typeof t.probability === 'number' && (
                          <span className={styles.prob}>{t.probability.toFixed(1)}%</span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Top Narratives */}
              <div className={styles.feedSection}>
                <div className={styles.feedLabel}>ACTIVE NARRATIVES</div>
                <div className={styles.narrativeList}>
                  {topNarratives.length === 0 ? (
                    <div className={styles.feedItem}>No narratives available</div>
                  ) : (
                    topNarratives.map((n) => (
                      <div key={n.id} className={styles.narrativeItem}>
                        <div className={styles.narrativeHeader}>
                          <span className={styles.narrativeName}>{n.name}</span>
                          <span className={styles.narrativeScore}>{n.score}</span>
                        </div>
                        <div className={styles.narrativeBar}>
                          <div className={styles.narrativeFill} style={{ width: `${n.score}%` }} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </ControlRoomPanel>
        </div>

        {/* Mission Console - Analysis & Metrics */}
        <div className={styles.missionConsole}>
          <ControlRoomPanel title="MISSION CONSOLE" subtitle="RISK ANALYSIS // EXECUTION POSTURE">
            <div className={styles.consoleContent}>
              {/* Global Risk Score */}
              <ControlRoomSectionHeader label="GLOBAL RISK SCORE">
                {riskScore}
              </ControlRoomSectionHeader>

              <div className={styles.metrics}>
                <div className={styles.metricRow}>
                  <span className={styles.metricLabel}>BIAS</span>
                  <span className={styles.metricValue}>{String(riskBias).toUpperCase()}</span>
                </div>
                <div className={styles.metricRow}>
                  <span className={styles.metricLabel}>REGIME</span>
                  <span className={styles.metricValue}>{summary?.regime?.regime || 'UNKNOWN'}</span>
                </div>
                <div className={styles.metricRow}>
                  <span className={styles.metricLabel}>NEXT EVENT</span>
                  <span className={styles.metricValue}>{nextEvent}</span>
                </div>
              </div>

              {/* 48H Forecast */}
              <div className={styles.section}>
                <div className={styles.sectionLabel}>48H FORECAST WINDOWS</div>
                <div className={styles.forecastList}>
                  {forecastWindows.length === 0 ? (
                    <div className={styles.emptyText}>No forecast windows loaded</div>
                  ) : (
                    forecastWindows.map((w) => (
                      <div key={w.windowStart} className={styles.forecastRow}>
                        <span className={styles.forecastEvent}>{w.eventName}</span>
                        <span className={styles.forecastVol}>{w.expectedVolatility} VOL</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Predictive Alerts */}
              <div className={styles.section}>
                <div className={styles.sectionLabel}>PREDICTIVE ALERTS</div>
                <div className={styles.alertList}>
                  {predictions.length === 0 ? (
                    <div className={styles.emptyText}>No alerts detected</div>
                  ) : (
                    predictions.slice(0, 4).map((p, idx) => (
                      <div key={`${p.type}-${idx}`} className={styles.alertRow}>
                        <span className={styles.alertTime}>{p.time_to_event_readable}</span>
                        <span className={styles.alertText}>{p.recommended_action}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Execution Posture */}
              <div className={styles.section}>
                <div className={styles.sectionLabel}>EXECUTION POSTURE</div>
                <p className={styles.postureText}>{posture}</p>
                <div className={styles.postureGrid}>
                  <div className={styles.postureRow}>
                    <span className={styles.postureLabel}>TPS</span>
                    <span className={styles.postureValue}>{solana?.performance?.tps ?? '—'}</span>
                  </div>
                  <div className={styles.postureRow}>
                    <span className={styles.postureLabel}>VIX</span>
                    <span className={styles.postureValue}>{vol?.data?.volatility?.[0]?.value ?? '—'}</span>
                  </div>
                  <div className={styles.postureRow}>
                    <span className={styles.postureLabel}>CREDIT</span>
                    <span className={styles.postureValue}>{credit?.data?.summary?.regime || '—'}</span>
                  </div>
                </div>
              </div>
            </div>
          </ControlRoomPanel>
        </div>
      </div>

      {/* Status Rail */}
      <ControlRoomStatusRail
        leftItems={[
          { key: 'MODE', value: 'LIVE' },
          { key: 'BIAS', value: String(riskBias).toUpperCase() },
        ]}
        rightItems={[
          { key: 'FRESHNESS', value: '30s' },
          { key: 'LATENCY', value: latencyMs !== null ? `${latencyMs}ms` : '—' },
        ]}
      />
    </RiskShell>
  );
}

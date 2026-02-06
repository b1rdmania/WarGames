'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './warroom.module.css';

type Summary = {
  risk?: { score?: number; bias?: string; components?: any; drivers?: string[] };
  forecast?: { windows?: Array<{ windowStart: string; eventName: string; expectedVolatility: number }> };
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
  predict?: { predictions?: Array<{ type: string; impact: string; time_to_event_readable: string; recommended_action: string }> };
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
        const [summaryRes, breakingRes, marketsRes, tickerRes, flowRes, eventsRes, extraRes] = await Promise.all([
          fetch('/api/intel/summary'),
          fetch('/api/intel/breaking'),
          fetch('/api/intel/markets'),
          fetch('/api/intel/ticker'),
          fetch('/api/intel/flow'),
          fetch('/api/intel/events'),
          fetch('/api/intel/extra'),
        ]);

        if (!active) return;
        if (summaryRes.ok) setSummary(await summaryRes.json());
        if (breakingRes.ok) setBreaking((await breakingRes.json()).items || []);
        if (marketsRes.ok) setMarkets((await marketsRes.json()).items || []);
        if (tickerRes.ok) setTicker((await tickerRes.json()).items || []);
        if (flowRes.ok) setFlow(await flowRes.json());
        if (eventsRes.ok) setEvents(await eventsRes.json());
        if (extraRes.ok) setExtra(await extraRes.json());
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
  const posture = summary?.posture?.overallRecommendation || summary?.forecast?.recommendation || 'Posture pending';
  const predictions = events?.predict?.predictions || [];
  const solana = flow?.solana;
  const credit = flow?.credit;
  const vol = flow?.vol;
  const defi = extra?.defi;

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>WAR ROOM // NORAD INTELLIGENCE</div>
          <div className={styles.subtitle}>Macro telemetry · Prediction windows · Execution posture</div>
        </div>
        <div className={styles.statusPill}>
          <span className={styles.pulse} />
          LIVE
        </div>
      </div>

      <div className={styles.breaking}>
        <div className={styles.breakingLabel}>BREAKING</div>
        <div className={styles.breakingTrack}>
          {breaking.length === 0 ? (
            <div className={styles.breakingItem}>Monitoring geopolitical feeds…</div>
          ) : (
            breaking.slice(0, 6).map((b) => (
              <div key={b.id} className={`${styles.breakingItem} ${severityClass(b.severity)}`}>
                <span className={styles.tag}>{b.tag}</span>
                <span className={styles.headline}>{b.title}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className={styles.marketTape}>
        <div className={styles.marketLabel}>MARKET TAPE</div>
        <div className={styles.marketTrack}>
          {markets.length === 0 ? (
            <div className={styles.marketItem}>Loading prices…</div>
          ) : (
            markets.map((m) => (
              <div key={m.id} className={styles.marketItem}>
                <span className={styles.marketCategory}>{m.category}</span>
                <span className={styles.marketSymbol}>{m.label}</span>
                <span className={styles.marketValue}>
                  {m.value.toLocaleString()}
                  {m.unit ? ` ${m.unit}` : ''}
                </span>
                {typeof m.change === 'number' ? (
                  <span className={styles.marketChange}>
                    {m.change > 0 ? '+' : ''}
                    {m.change.toFixed(2)}%
                  </span>
                ) : m.note ? (
                  <span className={styles.marketNote}>{m.note}</span>
                ) : null}
                <span className={styles.marketSource}>{m.source}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className={styles.ticker}>
        <div className={styles.tickerLabel}>INTEL FEED</div>
        <div className={styles.tickerTrack}>
          {ticker.length === 0 ? (
            <div className={styles.tickerItem}>Awaiting telemetry…</div>
          ) : (
            ticker.slice(0, 12).map((t) => (
              <div key={t.id} className={`${styles.tickerItem} ${severityClass(t.severity)}`}>
                <span className={styles.headline}>{t.title}</span>
                {typeof t.probability === 'number' ? (
                  <span className={styles.prob}>{t.probability.toFixed(1)}%</span>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>

      <div className={styles.wall}>
        <section className={`${styles.panel} ${styles.heroPanel}`}>
          <div className={styles.heroHeader}>
            Global Risk Score <span className={styles.badge}>LIVE</span>
          </div>
          <div className={styles.heroBody}>
            <div className={styles.metricPrimary}>
              <div className={styles.metricValue}>{riskScore}</div>
              <div className={styles.metricLabel}>{String(riskBias).toUpperCase()}</div>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.dataRow}>
                <span>Next Critical Event</span>
                <span>{nextEvent}</span>
              </div>
              <div className={styles.dataRow}>
                <span>Market Regime</span>
                <span>{summary?.regime?.regime || 'unknown'}</span>
              </div>
              <div className={styles.dataRow}>
                <span>Latency</span>
                <span>{latencyMs !== null ? `${latencyMs}ms` : '—'}</span>
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.panel} ${styles.forecastPanel}`}>
          <div className={styles.panelHeader}>
            48H Forecast <span className={styles.badge}>WINDOWS</span>
          </div>
          <div className={styles.panelBody}>
            {forecastWindows.length === 0 ? (
              <div className={styles.empty}>No forecast windows loaded</div>
            ) : (
              forecastWindows.map((w) => (
                <div key={w.windowStart} className={styles.dataRow}>
                  <span>{w.eventName}</span>
                  <span>{w.expectedVolatility} VOL</span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className={`${styles.panel} ${styles.narrativesPanel}`}>
          <div className={styles.panelHeader}>
            Active Narratives <span className={styles.badge}>TOP 8</span>
          </div>
          <div className={styles.panelBody}>
            {topNarratives.length === 0 ? (
              <div className={styles.empty}>No narratives available</div>
            ) : (
              topNarratives.map((n) => (
                <div key={n.id} className={styles.narrativeRow}>
                  <div className={styles.narrativeHeader}>
                    <span>{n.name}</span>
                    <span>{n.score}</span>
                  </div>
                  <div className={styles.narrativeBar}>
                    <div className={styles.narrativeFill} style={{ width: `${n.score}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className={`${styles.panel} ${styles.eventPanel}`}>
          <div className={styles.panelHeader}>
            Event Log <span className={styles.badge}>ALERTS</span>
          </div>
          <div className={styles.panelBody}>
            {(events?.events?.events || []).slice(0, 8).map((e: any) => (
              <div key={e.event} className={styles.logRow}>
                <span className={styles.logStamp}>{e.time || e.date}</span>
                <span className={styles.logText}>{e.event}</span>
                <span className={styles.logBadge}>{e.impact || '—'}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={`${styles.panel} ${styles.alertsPanel}`}>
          <div className={styles.panelHeader}>
            Predictive Alerts <span className={styles.badge}>AUTO</span>
          </div>
          <div className={styles.panelBody}>
            {predictions.length === 0 ? (
              <div className={styles.empty}>No alerts detected</div>
            ) : (
              predictions.slice(0, 4).map((p) => (
                <div key={p.type} className={`${styles.logRow} ${styles.logAlert}`}>
                  <span className={styles.logStamp}>{p.time_to_event_readable}</span>
                  <span className={styles.logText}>{p.recommended_action}</span>
                  <span className={styles.logBadge}>{p.impact}</span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className={`${styles.panel} ${styles.consolePanel}`}>
          <div className={styles.panelHeader}>
            Execution Console <span className={styles.badge}>POSTURE</span>
          </div>
          <div className={styles.panelBody}>
            <div className={styles.consoleState}>
              <span className={styles.stateLabel}>STATE</span>
              <span className={styles.stateValue}>{solana?.performance?.health?.toUpperCase() || 'ARMED'}</span>
            </div>
            <div className={styles.consoleText}>{posture}</div>
            <div className={styles.consoleGrid}>
              <div className={styles.dataRow}>
                <span>TPS</span>
                <span>{solana?.performance?.tps ?? '—'}</span>
              </div>
              <div className={styles.dataRow}>
                <span>Validators</span>
                <span>{solana?.validators?.active ?? '—'}</span>
              </div>
              <div className={styles.dataRow}>
                <span>VIX</span>
                <span>{vol?.data?.volatility?.[0]?.value ?? '—'}</span>
              </div>
              <div className={styles.dataRow}>
                <span>Credit</span>
                <span>{credit?.data?.summary?.regime || '—'}</span>
              </div>
            </div>
          </div>
        </section>

        <details className={`${styles.panel} ${styles.flowsPanel} ${styles.panelDetails}`} open>
          <summary className={styles.panelSummary}>
            Credit Spreads <span className={styles.badge}>OAS</span>
          </summary>
          <div className={styles.panelBody}>
            <div className={styles.dataRow}>
              <span>IG</span>
              <span>{credit?.data?.spreads?.find((s: any) => s.type === 'IG')?.oas ?? '—'}</span>
            </div>
            <div className={styles.dataRow}>
              <span>HY</span>
              <span>{credit?.data?.spreads?.find((s: any) => s.type === 'HY')?.oas ?? '—'}</span>
            </div>
            <div className={styles.dataRow}>
              <span>Stress</span>
              <span>{credit?.data?.summary?.systemic_stress ?? '—'}</span>
            </div>
          </div>
        </details>

        <details className={`${styles.panel} ${styles.proofPanel} ${styles.panelDetails}`}>
          <summary className={styles.panelSummary}>
            Volatility <span className={styles.badge}>INDEX</span>
          </summary>
          <div className={styles.panelBody}>
            <div className={styles.dataRow}>
              <span>VIX</span>
              <span>{vol?.data?.volatility?.[0]?.value ?? '—'}</span>
            </div>
            <div className={styles.dataRow}>
              <span>SPX</span>
              <span>{vol?.data?.indices?.[0]?.change_24h?.toFixed?.(2) ?? '—'}%</span>
            </div>
            <div className={styles.dataRow}>
              <span>NDX</span>
              <span>{vol?.data?.indices?.[1]?.change_24h?.toFixed?.(2) ?? '—'}%</span>
            </div>
            <div className={styles.dataRow}>
              <span>Regime</span>
              <span>{vol?.data?.summary?.regime || '—'}</span>
            </div>
          </div>
        </details>

        <details className={`${styles.panel} ${styles.defiPanel} ${styles.panelDetails}`}>
          <summary className={styles.panelSummary}>
            Solana DeFi <span className={styles.badge}>TVL</span>
          </summary>
          <div className={styles.panelBody}>
            <div className={styles.dataRow}>
              <span>Total TVL</span>
              <span>{defi?.total_tvl_formatted || '—'}</span>
            </div>
            <div className={styles.dataRow}>
              <span>Protocols</span>
              <span>{defi?.protocol_count ?? '—'}</span>
            </div>
            <div className={styles.dataRow}>
              <span>Top</span>
              <span>{defi?.top_protocols?.[0]?.name || '—'}</span>
            </div>
            <div className={styles.dataRow}>
              <span>Top TVL</span>
              <span>{defi?.top_protocols?.[0]?.tvl_formatted || '—'}</span>
            </div>
          </div>
        </details>
      </div>

      <div className={styles.footerRail}>
        <div>MODE: LIVE</div>
        <div>BIAS: {String(riskBias).toUpperCase()}</div>
        <div>FRESHNESS: 30s</div>
        <div>LATENCY: {latencyMs !== null ? `${latencyMs}ms` : '—'}</div>
      </div>
    </div>
  );
}

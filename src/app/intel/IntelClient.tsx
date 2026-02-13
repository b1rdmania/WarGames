'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  TerminalShell,
  TerminalHeader,
  TerminalMenuBar,
  TerminalPaneTitle,
  TerminalCommandBar,
  TerminalStatusBar,
  TerminalTitle,
  TerminalKV,
  TerminalKVRow,
} from '@/components/terminal';

type Summary = {
  risk?: { score?: number; bias?: string; components?: any; drivers?: string[] };
  forecast?: { windows?: Array<{ windowStart: string; eventName: string; expectedVolatility: number }>; recommendation?: string };
  narratives?: { narratives?: Array<{ id: string; name: string; score: number; trend?: string; drivers?: string[] }> };
  regime?: { regime?: string; confidence?: number; note?: string };
  nextEvent?: { title?: string; date?: string; predicted_impact?: number; confidence?: number };
  posture?: { overallRecommendation?: string };
};

type BreakingItem = {
  id: string;
  title: string;
  tag: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
};

type MarketTapeItem = {
  id: string;
  label: string;
  value: number;
  change?: number | null;
  unit?: string;
};

type Flow = {
  solana?: any;
  vol?: any;
  credit?: any;
};

export default function IntelClient() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [breaking, setBreaking] = useState<BreakingItem[]>([]);
  const [markets, setMarkets] = useState<MarketTapeItem[]>([]);
  const [flow, setFlow] = useState<Flow | null>(null);
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

        const [summaryData, breakingData, marketsData, flowData] = await Promise.all([
          safeFetch('/api/intel/summary'),
          safeFetch('/api/intel/breaking'),
          safeFetch('/api/intel/markets'),
          safeFetch('/api/intel/flow'),
        ]);

        if (!active) return;
        if (summaryData) setSummary(summaryData);
        if (breakingData) setBreaking(breakingData.items || []);
        if (marketsData) setMarkets(marketsData.items || []);
        if (flowData) setFlow(flowData);
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
  const solana = flow?.solana;
  const credit = flow?.credit;
  const vol = flow?.vol;

  return (
    <TerminalShell
      header={<TerminalHeader title="WAR.MARKET // INTELLIGENCE TERMINAL" backHref="/" backLabel="← HOME" />}
      menuBar={<TerminalMenuBar items={['FILE', 'FEEDS', 'ANALYSIS', 'ALERTS', 'MONITOR', 'HELP']} />}
      leftPane={
        <>
          <TerminalPaneTitle>INTELLIGENCE FEEDS</TerminalPaneTitle>

          {/* Breaking */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ color: '#02ff81', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
              BREAKING
            </div>
            {breaking.length === 0 ? (
              <div style={{ color: '#8da294', fontSize: '11px' }}>Monitoring feeds...</div>
            ) : (
              <div style={{ display: 'grid', gap: '4px' }}>
                {breaking.slice(0, 5).map((b) => (
                  <div key={b.id} style={{ color: '#a8b4af', fontSize: '11px', lineHeight: '1.4' }}>
                    <span style={{ color: '#02ff81' }}>[{b.tag}]</span> {b.title}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Market Tape */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ color: '#02ff81', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
              MARKET TAPE
            </div>
            {markets.length === 0 ? (
              <div style={{ color: '#8da294', fontSize: '11px' }}>Loading prices...</div>
            ) : (
              <div style={{ display: 'grid', gap: '2px' }}>
                {markets.slice(0, 8).map((m) => (
                  <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                    <span style={{ color: '#02ff81' }}>{m.label}</span>
                    <span style={{ color: '#dfe9e4' }}>
                      {m.value.toLocaleString()}{m.unit ? ` ${m.unit}` : ''}
                      {typeof m.change === 'number' && (
                        <span style={{ color: m.change >= 0 ? '#02ff81' : '#ff4444', marginLeft: '6px' }}>
                          {m.change > 0 ? '+' : ''}{m.change.toFixed(2)}%
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Narratives */}
          <div>
            <div style={{ color: '#02ff81', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
              TOP NARRATIVES
            </div>
            {topNarratives.length === 0 ? (
              <div style={{ color: '#8da294', fontSize: '11px' }}>No narratives available</div>
            ) : (
              <div style={{ display: 'grid', gap: '8px' }}>
                {topNarratives.map((n) => (
                  <div key={n.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                      <span style={{ color: '#a8b4af' }}>{n.name}</span>
                      <span style={{ color: '#02ff81' }}>{n.score}</span>
                    </div>
                    <div style={{ height: '3px', background: '#1f3e2f', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${n.score}%`, height: '100%', background: '#02ff81', transition: 'width 0.3s' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      }
      centerPane={
        <>
          <TerminalPaneTitle>RISK ANALYSIS</TerminalPaneTitle>
          <TerminalTitle style={{ marginBottom: '8px' }}>GLOBAL RISK SCORE</TerminalTitle>
          <div style={{ fontSize: '32px', color: '#02ff81', fontWeight: 600, marginBottom: '16px' }}>
            {riskScore}
          </div>

          <TerminalKV>
            <TerminalKVRow label="BIAS" value={String(riskBias).toUpperCase()} />
            <TerminalKVRow label="REGIME" value={summary?.regime?.regime || 'UNKNOWN'} />
            <TerminalKVRow label="NEXT EVENT" value={nextEvent} />
          </TerminalKV>

          {/* 48H Forecast */}
          <div style={{ marginTop: '20px' }}>
            <div style={{ color: '#02ff81', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
              48H FORECAST WINDOWS
            </div>
            {forecastWindows.length === 0 ? (
              <div style={{ color: '#8da294', fontSize: '11px' }}>No forecast windows loaded</div>
            ) : (
              <div style={{ display: 'grid', gap: '4px' }}>
                {forecastWindows.map((w) => (
                  <div key={w.windowStart} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                    <span style={{ color: '#a8b4af' }}>{w.eventName}</span>
                    <span style={{ color: '#ffff00' }}>{w.expectedVolatility} VOL</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      }
      rightPane={
        <>
          <TerminalPaneTitle>EXECUTION POSTURE</TerminalPaneTitle>
          <div style={{ color: '#a8b4af', fontSize: '12px', lineHeight: '1.5', marginBottom: '16px' }}>
            {posture}
          </div>

          <TerminalKV>
            <TerminalKVRow label="TPS" value={solana?.performance?.tps ?? '—'} />
            <TerminalKVRow label="VALIDATORS" value={solana?.validators?.active ?? '—'} />
            <TerminalKVRow label="VIX" value={vol?.data?.volatility?.[0]?.value ?? '—'} />
            <TerminalKVRow label="CREDIT" value={credit?.data?.summary?.regime || '—'} />
            <TerminalKVRow label="STRESS" value={credit?.data?.summary?.systemic_stress ?? '—'} />
          </TerminalKV>
        </>
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
            { label: 'MODE', value: 'LIVE' },
            { label: 'BIAS', value: String(riskBias).toUpperCase() },
            { label: 'FRESHNESS', value: '30s' },
            { label: 'LATENCY', value: latencyMs !== null ? `${latencyMs}ms` : '—' },
          ]}
        />
      }
    />
  );
}

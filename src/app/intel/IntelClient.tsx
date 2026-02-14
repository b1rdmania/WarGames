'use client';

import { useEffect, useState } from 'react';
import {
  TerminalShell,
  TerminalMenuBar,
  TerminalPaneTitle,
  TerminalCommandBar,
  TerminalStatusBar,
  TerminalTitle,
  TerminalKV,
  TerminalKVRow,
} from '@/components/terminal';
import type { IntelCommandPayload } from '@/types/intelCommand';

const FALLBACK: IntelCommandPayload = {
  timestamp: new Date(0).toISOString(),
  regime: {
    risk_score: null,
    bias: 'UNKNOWN',
    band: 'UNKNOWN',
    regime: 'unknown',
    confidence: null,
    as_of: new Date(0).toISOString(),
    freshness: 'unknown',
  },
  event_window: {
    next_event: 'No critical events',
    event_date: null,
    hours_to_event: null,
    windows: [],
    as_of: new Date(0).toISOString(),
    freshness: 'unknown',
  },
  alerts: [],
  tape: [],
  drivers: [],
  posture: {
    action: 'UNKNOWN',
    recommendation: 'Signal unavailable.',
    checks: [],
    as_of: new Date(0).toISOString(),
    freshness: 'unknown',
  },
  metrics: {
    tps: null,
    validators: null,
    vix: null,
    credit_regime: 'unknown',
    systemic_stress: null,
  },
  health: {
    degraded_mode: true,
    sources: [],
  },
};

export default function IntelClient() {
  const [intel, setIntel] = useState<IntelCommandPayload>(FALLBACK);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    const fetchCommand = async () => {
      const started = performance.now();
      try {
        const res = await fetch('/api/intel/command');
        if (!res.ok) return;
        const json = (await res.json()) as IntelCommandPayload;
        if (active) setIntel(json);
      } catch {
        // Keep last known-good payload in UI.
      } finally {
        if (active) setLatencyMs(Math.round(performance.now() - started));
      }
    };

    fetchCommand();
    const interval = setInterval(fetchCommand, 30_000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <TerminalShell
      menuBar={<TerminalMenuBar items={['FILE', 'FEEDS', 'ANALYSIS', 'ALERTS', 'MONITOR', 'HELP']} />}
      leftPane={
        <>
          <TerminalPaneTitle>LIVE WIRE</TerminalPaneTitle>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ color: '#02ff81', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
              ALERTS
            </div>
            {intel.alerts.length === 0 ? (
              <div style={{ color: '#8da294', fontSize: '11px' }}>No actionable alerts</div>
            ) : (
              <div style={{ display: 'grid', gap: '4px' }}>
                {intel.alerts.map((a) => (
                  <div key={a.id} style={{ color: '#a8b4af', fontSize: '11px', lineHeight: '1.4' }}>
                    <span style={{ color: '#02ff81' }}>[{a.tag}]</span> {a.title}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ color: '#02ff81', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
              MARKET TAPE
            </div>
            {intel.tape.length === 0 ? (
              <div style={{ color: '#8da294', fontSize: '11px' }}>Loading tape...</div>
            ) : (
              <div style={{ display: 'grid', gap: '2px' }}>
                {intel.tape.slice(0, 8).map((t) => (
                  <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                    <span style={{ color: '#02ff81' }}>{t.label}</span>
                    <span style={{ color: '#dfe9e4' }}>
                      {t.value.toLocaleString()}
                      {t.unit ? ` ${t.unit}` : ''}
                      {typeof t.change === 'number' && (
                        <span style={{ color: t.change >= 0 ? '#02ff81' : '#ff4444', marginLeft: '6px' }}>
                          {t.change > 0 ? '+' : ''}
                          {t.change.toFixed(2)}%
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div style={{ color: '#02ff81', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
              TOP DRIVERS
            </div>
            {intel.drivers.length === 0 ? (
              <div style={{ color: '#8da294', fontSize: '11px' }}>No active drivers</div>
            ) : (
              <div style={{ display: 'grid', gap: '4px' }}>
                {intel.drivers.map((driver) => (
                  <div key={driver} style={{ color: '#a8b4af', fontSize: '11px' }}>
                    ▸ {driver}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      }
      centerPane={
        <>
          <TerminalPaneTitle>SIGNAL STACK</TerminalPaneTitle>
          <TerminalTitle style={{ marginBottom: '8px' }}>GLOBAL RISK SCORE</TerminalTitle>
          <div style={{ fontSize: '32px', color: '#02ff81', fontWeight: 600, marginBottom: '16px' }}>
            {typeof intel.regime.risk_score === 'number' ? intel.regime.risk_score : '—'}
          </div>

          <TerminalKV>
            <TerminalKVRow label="BIAS" value={intel.regime.bias} />
            <TerminalKVRow label="RISK BAND" value={intel.regime.band} />
            <TerminalKVRow label="REGIME" value={intel.regime.regime} />
            <TerminalKVRow label="CONFIDENCE" value={intel.regime.confidence !== null ? `${intel.regime.confidence}%` : '—'} />
            <TerminalKVRow label="FRESHNESS" value={intel.regime.freshness.toUpperCase()} />
          </TerminalKV>

          <div style={{ marginTop: '20px' }}>
            <div style={{ color: '#02ff81', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
              EVENT WINDOW
            </div>
            <TerminalKV>
              <TerminalKVRow label="NEXT EVENT" value={intel.event_window.next_event} />
              <TerminalKVRow label="EVENT TIME" value={intel.event_window.event_date ?? '—'} />
              <TerminalKVRow
                label="T-MINUS"
                value={
                  typeof intel.event_window.hours_to_event === 'number'
                    ? `${intel.event_window.hours_to_event}h`
                    : '—'
                }
              />
            </TerminalKV>
            {intel.event_window.windows.length === 0 ? (
              <div style={{ color: '#8da294', fontSize: '11px', marginTop: '8px' }}>No forecast windows loaded</div>
            ) : (
              <div style={{ display: 'grid', gap: '4px', marginTop: '8px' }}>
                {intel.event_window.windows.map((w) => (
                  <div key={`${w.window_start}-${w.event_name}`} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                    <span style={{ color: '#a8b4af' }}>{w.event_name}</span>
                    <span style={{ color: '#ffff00' }}>{w.expected_volatility} VOL</span>
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
          <TerminalTitle style={{ marginBottom: '8px' }}>{intel.posture.action}</TerminalTitle>
          <div style={{ color: '#a8b4af', fontSize: '12px', lineHeight: '1.5', marginBottom: '16px' }}>
            {intel.posture.recommendation}
          </div>

          <TerminalKV>
            <TerminalKVRow label="TPS" value={intel.metrics.tps !== null ? String(intel.metrics.tps) : '—'} />
            <TerminalKVRow label="VALIDATORS" value={intel.metrics.validators !== null ? String(intel.metrics.validators) : '—'} />
            <TerminalKVRow label="VIX" value={intel.metrics.vix !== null ? String(intel.metrics.vix) : '—'} />
            <TerminalKVRow label="CREDIT" value={intel.metrics.credit_regime} />
            <TerminalKVRow
              label="STRESS"
              value={intel.metrics.systemic_stress !== null ? String(intel.metrics.systemic_stress) : '—'}
            />
          </TerminalKV>

          <div style={{ marginTop: '20px' }}>
            <div style={{ color: '#02ff81', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
              DECISION CHECKS
            </div>
            <div style={{ display: 'grid', gap: '4px', fontSize: '11px', color: '#a8b4af' }}>
              {intel.posture.checks.map((check) => (
                <div key={check}>• {check}</div>
              ))}
            </div>
          </div>
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
            { label: 'MODE', value: intel.health.degraded_mode ? 'DEGRADED' : 'LIVE' },
            { label: 'BIAS', value: intel.regime.bias },
            { label: 'RISK', value: intel.regime.band },
            { label: 'FRESHNESS', value: intel.regime.freshness.toUpperCase() },
            { label: 'LATENCY', value: latencyMs !== null ? `${latencyMs}ms` : '—' },
          ]}
        />
      }
    />
  );
}

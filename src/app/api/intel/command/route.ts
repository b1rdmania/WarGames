import { NextResponse } from 'next/server';
import type { IntelCommandPayload, IntelFreshness, IntelHealthSource, IntelAlertItem, IntelTapeItem } from '@/types/intelCommand';

const WARGAMES_API_BASE = process.env.WARGAMES_API_BASE || 'https://wargames-api.fly.dev';

async function safeFetchJson(url: string, revalidate: number, timeoutMs = 7000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { next: { revalidate }, signal: controller.signal });
    if (!res.ok) return { ok: false as const, data: null };
    return { ok: true as const, data: await res.json() };
  } catch {
    return { ok: false as const, data: null };
  } finally {
    clearTimeout(timer);
  }
}

function riskBand(score: number | null): 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN' {
  if (typeof score !== 'number') return 'UNKNOWN';
  if (score >= 70) return 'HIGH';
  if (score >= 40) return 'MEDIUM';
  return 'LOW';
}

function postureFromRisk(score: number | null): { action: 'REDUCE' | 'HOLD' | 'ADD' | 'UNKNOWN'; recommendation: string } {
  if (typeof score !== 'number') {
    return { action: 'UNKNOWN', recommendation: 'Signal unavailable. Stay defensive until regime is confirmed.' };
  }
  if (score >= 70) {
    return { action: 'REDUCE', recommendation: 'Reduce exposure, tighten stops, and avoid new leverage ahead of volatility windows.' };
  }
  if (score <= 30) {
    return { action: 'ADD', recommendation: 'Selective add-on posture. Favor high-conviction setups with tight invalidation levels.' };
  }
  return { action: 'HOLD', recommendation: 'Maintain balanced posture and wait for clearer regime confirmation.' };
}

function freshnessFromAgeMs(ageMs: number): IntelFreshness {
  if (ageMs <= 5 * 60_000) return 'realtime';
  if (ageMs <= 60 * 60_000) return 'intraday';
  if (ageMs <= 24 * 60 * 60_000) return 'eod';
  return 'stale';
}

function toTimestamp(value: unknown): string | null {
  if (typeof value !== 'string' || !value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function sourceStatus(name: string, ok: boolean, freshness: IntelFreshness): IntelHealthSource {
  if (!ok) return { name, status: 'unavailable', freshness: 'unknown' };
  return { name, status: freshness === 'stale' ? 'degraded' : 'ok', freshness };
}

function severityFromIntensity(intensity?: number): IntelAlertItem['severity'] {
  if (typeof intensity !== 'number') return 'low';
  if (intensity >= 90) return 'critical';
  if (intensity >= 70) return 'high';
  if (intensity >= 50) return 'medium';
  return 'low';
}

function isMostlyAscii(text: string): boolean {
  if (!text) return false;
  const nonAscii = text.replace(/[\x00-\x7F]/g, '').length;
  return nonAscii / text.length < 0.2;
}

function isRecentEnough(timestamp: unknown, maxHours: number): boolean {
  if (typeof timestamp !== 'string' || !timestamp) return false;
  const d = new Date(timestamp);
  if (Number.isNaN(d.getTime())) return false;
  const ageHours = (Date.now() - d.getTime()) / (1000 * 60 * 60);
  return ageHours <= maxHours;
}

function normalizeTape(tape: any): IntelTapeItem[] {
  const out: IntelTapeItem[] = [];
  for (const group of tape?.data?.tape || []) {
    for (const entry of (group.items || []).slice(0, 5)) {
      const label = entry.symbol || entry.type || entry.name;
      const value = entry.value ?? entry.oas ?? entry.rate ?? entry.price;
      if (typeof label !== 'string' || typeof value !== 'number') continue;
      if (label === 'MOVE' || label === 'EM') continue;
      if (entry.timestamp && !isRecentEnough(entry.timestamp, 96)) continue;
      const normalizedUnit = entry.unit === 'ratio' ? undefined : entry.unit;
      out.push({
        id: `${group.category}-${label}`,
        label,
        value,
        change: typeof entry.change_24h === 'number' ? entry.change_24h : null,
        unit: typeof normalizedUnit === 'string' ? normalizedUnit : undefined,
        category: String(group.category || 'MARKET').toUpperCase(),
      });
    }
  }
  return out.slice(0, 10);
}

export async function GET() {
  const startedAt = Date.now();
  try {
    const [riskRes, narrativesRes, nextEventRes, eventsRes, newsRes, geoRes, tapeRes, solanaRes, volRes, creditRes] = await Promise.all([
      safeFetchJson(`${WARGAMES_API_BASE}/live/risk`, 60),
      safeFetchJson(`${WARGAMES_API_BASE}/narratives`, 300),
      safeFetchJson(`${WARGAMES_API_BASE}/events/next-critical`, 300),
      safeFetchJson(`${WARGAMES_API_BASE}/events?days=7`, 300),
      safeFetchJson(`${WARGAMES_API_BASE}/live/news`, 60),
      safeFetchJson(`${WARGAMES_API_BASE}/live/geo`, 120),
      safeFetchJson(`${WARGAMES_API_BASE}/live/tape`, 120),
      safeFetchJson(`${WARGAMES_API_BASE}/live/solana`, 120),
      safeFetchJson(`${WARGAMES_API_BASE}/live/vol`, 300),
      safeFetchJson(`${WARGAMES_API_BASE}/live/credit`, 300),
    ]);

    const now = new Date();
    const nowMs = now.getTime();
    const nowIso = now.toISOString();

    const riskScore = typeof riskRes.data?.score === 'number' ? riskRes.data.score : null;
    const riskBias = String(riskRes.data?.bias || 'unknown').toUpperCase();
    const topNarratives = Array.isArray(narrativesRes.data?.narratives)
      ? [...narrativesRes.data.narratives]
          .filter((n: any) => typeof n?.name === 'string' && typeof n?.score === 'number')
          .sort((a: any, b: any) => b.score - a.score)
          .slice(0, 4)
      : [];

    const narrativeDrivers = topNarratives.map((n: any) => `${n.name} (${n.score})`);
    const riskDrivers = Array.isArray(riskRes.data?.drivers)
      ? riskRes.data.drivers
          .filter((d: unknown) => typeof d === 'string')
          .map((d: string) => d.trim())
          .filter((d: string) => d.length > 8 && !/no active|unknown|pending/i.test(d))
      : [];

    const drivers = [...new Set([...narrativeDrivers, ...riskDrivers])].slice(0, 4);

    const nextEventTitle =
      nextEventRes.data?.event?.event ||
      eventsRes.data?.events?.[0]?.event ||
      'No critical events';
    const nextEventDateRaw =
      nextEventRes.data?.event?.date ||
      eventsRes.data?.events?.[0]?.date ||
      null;
    const nextEventDate = toTimestamp(nextEventDateRaw);
    const hoursToEvent =
      nextEventDate ? Math.round((new Date(nextEventDate).getTime() - nowMs) / (60 * 60 * 1000)) : null;

    const forecastWindows = Array.isArray(eventsRes.data?.events)
      ? eventsRes.data.events.slice(0, 3).map((event: any) => ({
          event_name: String(event?.event || 'Macro event'),
          window_start: String(event?.date || nowIso),
          expected_volatility:
            event?.impact === 'critical'
              ? 90
              : event?.impact === 'high'
              ? 80
              : event?.impact === 'medium'
              ? 55
              : 30,
        }))
      : [];

    const alerts: IntelAlertItem[] = [];
    for (const item of (newsRes.data?.data?.breaking || []).slice(0, 3)) {
      const title = item.headline || 'Breaking update';
      if (!isMostlyAscii(title)) continue;
      alerts.push({
        id: item.url || item.headline || `news-${alerts.length}`,
        title,
        tag: String(item.category || 'NEWS').toUpperCase(),
        severity:
          typeof item.importance === 'number'
            ? item.importance >= 70
              ? 'critical'
              : item.importance >= 50
              ? 'high'
              : item.importance >= 30
              ? 'medium'
              : 'low'
            : 'medium',
        source: item.source || 'GDELT',
        timestamp: toTimestamp(item.timestamp) || nowIso,
      });
    }
    for (const item of (geoRes.data?.data?.events || []).slice(0, 3)) {
      const title = item.headline || 'Geopolitical update';
      if (!isMostlyAscii(title)) continue;
      alerts.push({
        id: item.url || item.headline || `geo-${alerts.length}`,
        title,
        tag: String(item.event_type || item.region || 'GEO').toUpperCase(),
        severity: severityFromIntensity(item.intensity),
        source: item.source || 'GDELT',
        timestamp: toTimestamp(item.timestamp) || nowIso,
      });
    }

    const normalizedTape = normalizeTape(tapeRes.data);
    const { action, recommendation } = postureFromRisk(riskScore);

    const riskUpdated = toTimestamp(riskRes.data?.updated) || nowIso;
    const riskFreshness = freshnessFromAgeMs(nowMs - new Date(riskUpdated).getTime());

    const solanaUpdated = toTimestamp(solanaRes.data?.updated) || nowIso;
    const volUpdated = toTimestamp(volRes.data?.metadata?.fetchedAt) || nowIso;
    const creditUpdated = toTimestamp(creditRes.data?.metadata?.fetchedAt) || nowIso;

    const sources: IntelHealthSource[] = [
      sourceStatus('risk', riskRes.ok, riskFreshness),
      sourceStatus('events', nextEventRes.ok || eventsRes.ok, nextEventDate ? freshnessFromAgeMs(Math.max(0, nowMs - new Date(nextEventDate).getTime())) : 'unknown'),
      sourceStatus('news', newsRes.ok, 'realtime'),
      sourceStatus('geo', geoRes.ok, 'intraday'),
      sourceStatus('tape', tapeRes.ok, 'intraday'),
      sourceStatus('solana', solanaRes.ok, freshnessFromAgeMs(nowMs - new Date(solanaUpdated).getTime())),
      sourceStatus('vol', volRes.ok, freshnessFromAgeMs(nowMs - new Date(volUpdated).getTime())),
      sourceStatus('credit', creditRes.ok, freshnessFromAgeMs(nowMs - new Date(creditUpdated).getTime())),
    ];

    const degradedMode = sources.some((s) => s.status !== 'ok');

    const payload: IntelCommandPayload = {
      timestamp: nowIso,
      regime: {
        risk_score: riskScore,
        bias: riskBias,
        band: riskBand(riskScore),
        regime: String(creditRes.data?.data?.summary?.regime || volRes.data?.data?.summary?.regime || 'unknown'),
        confidence: typeof riskScore === 'number' ? Math.max(0, Math.min(100, 100 - Math.abs(50 - riskScore))) : null,
        as_of: riskUpdated,
        freshness: riskFreshness,
      },
      event_window: {
        next_event: String(nextEventTitle),
        event_date: nextEventDate,
        hours_to_event: hoursToEvent,
        windows: forecastWindows,
        as_of: nextEventDate || nowIso,
        freshness: nextEventDate ? freshnessFromAgeMs(Math.max(0, nowMs - new Date(nextEventDate).getTime())) : 'unknown',
      },
      alerts: alerts.slice(0, 3),
      tape: normalizedTape,
      drivers,
      posture: {
        action,
        recommendation,
        checks: [
          'Risk score and bias aligned with position sizing',
          'Next event window reviewed before execution',
          'Vol/credit regime confirms direction',
          'Narrative concentration is not over-extended',
        ],
        as_of: nowIso,
        freshness: 'intraday',
      },
      metrics: {
        tps: typeof solanaRes.data?.performance?.tps === 'number' ? solanaRes.data.performance.tps : null,
        validators: typeof solanaRes.data?.validators?.active === 'number' ? solanaRes.data.validators.active : null,
        vix: typeof volRes.data?.data?.volatility?.[0]?.value === 'number' ? volRes.data.data.volatility[0].value : null,
        credit_regime: String(creditRes.data?.data?.summary?.regime || 'unknown'),
        systemic_stress:
          typeof creditRes.data?.data?.summary?.systemic_stress === 'number'
            ? creditRes.data.data.summary.systemic_stress
            : null,
      },
      health: {
        degraded_mode: degradedMode,
        sources,
      },
    };

    return NextResponse.json(payload, {
      headers: {
        'x-intel-latency-ms': String(Date.now() - startedAt),
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch intel command payload' }, { status: 500 });
  }
}

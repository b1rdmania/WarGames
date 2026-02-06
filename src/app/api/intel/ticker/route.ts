import { NextResponse } from 'next/server';

const WARGAMES_API_BASE = process.env.WARGAMES_API_BASE || 'https://wargames-api.fly.dev';

type TickerItem = {
  id: string;
  title: string;
  probability?: number | null;
  tag: string;
  source: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
};

function tagFromTitle(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('rate') || t.includes('fed') || t.includes('cpi') || t.includes('inflation')) {
    return 'RATES';
  }
  if (t.includes('china') || t.includes('taiwan') || t.includes('iran') || t.includes('israel') || t.includes('war')) {
    return 'GEO';
  }
  if (t.includes('recession') || t.includes('gdp') || t.includes('jobs') || t.includes('unemployment')) {
    return 'MACRO';
  }
  return 'MACRO';
}

function severityFromProb(prob?: number | null): TickerItem['severity'] {
  if (prob === null || prob === undefined) return 'low';
  if (prob >= 70) return 'critical';
  if (prob >= 50) return 'high';
  if (prob >= 30) return 'medium';
  return 'low';
}

export async function GET() {
  try {
    const predictionsRes = await fetch(`${WARGAMES_API_BASE}/live/predictions`, {
      next: { revalidate: 120 },
    });

    const eventsRes = await fetch(`${WARGAMES_API_BASE}/events?days=14`, {
      next: { revalidate: 300 },
    });

    const [predictions, events] = await Promise.all([
      predictionsRes.ok ? predictionsRes.json() : null,
      eventsRes.ok ? eventsRes.json() : null,
    ]);

    const items: TickerItem[] = [];

    if (predictions?.markets?.length) {
      for (const market of predictions.markets.slice(0, 10)) {
        const prob = typeof market.probability === 'number' ? market.probability : null;
        items.push({
          id: market.id || market.slug || market.question,
          title: market.question,
          probability: prob,
          tag: tagFromTitle(market.question || ''),
          source: 'POLYMARKET',
          timestamp: new Date().toISOString(),
          severity: severityFromProb(prob),
        });
      }
    }

    if (events?.events?.length) {
      for (const event of events.events.slice(0, 6)) {
        const impact =
          event.risk_impact === 'high'
            ? 80
            : event.risk_impact === 'medium'
              ? 55
              : event.risk_impact === 'low'
                ? 30
                : null;
        items.push({
          id: event.id || event.event,
          title: event.event,
          probability: impact,
          tag: tagFromTitle(event.event || ''),
          source: 'WARGAMES',
          timestamp: event.date || new Date().toISOString(),
          severity: severityFromProb(impact),
        });
      }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      items,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch intel ticker' },
      { status: 500 }
    );
  }
}

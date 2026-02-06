import { NextResponse } from 'next/server';

const WARGAMES_API_BASE = process.env.WARGAMES_API_BASE || 'https://wargames-api.fly.dev';

type BreakingItem = {
  id: string;
  title: string;
  tag: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  source: string;
};

function severityFromHotspot(level?: string, odds?: number): BreakingItem['severity'] {
  if (typeof odds === 'number') {
    if (odds >= 35) return 'critical';
    if (odds >= 20) return 'high';
    if (odds >= 10) return 'medium';
    return 'low';
  }
  const l = (level || '').toLowerCase();
  if (l.includes('critical')) return 'critical';
  if (l.includes('elevated') || l.includes('high')) return 'high';
  if (l.includes('watch') || l.includes('moderate')) return 'medium';
  return 'low';
}

function severityFromIntensity(intensity?: number): BreakingItem['severity'] {
  if (typeof intensity !== 'number') return 'low';
  if (intensity >= 90) return 'critical';
  if (intensity >= 70) return 'high';
  if (intensity >= 50) return 'medium';
  return 'low';
}

export async function GET() {
  try {
    const [newsRes, geoRes] = await Promise.all([
      fetch(`${WARGAMES_API_BASE}/live/news`, { next: { revalidate: 60 } }),
      fetch(`${WARGAMES_API_BASE}/live/geo`, { next: { revalidate: 120 } }),
    ]);
    const news = newsRes.ok ? await newsRes.json() : null;
    const geo = geoRes.ok ? await geoRes.json() : null;

    const items: BreakingItem[] = [];

    const breakingNews = news?.data?.breaking || news?.data?.breaking_news || [];
    for (const item of breakingNews.slice(0, 6)) {
      items.push({
        id: item.url || item.headline,
        title: item.headline,
        tag: (item.category || 'NEWS').toString().toUpperCase(),
        severity: severityFromHotspot(undefined, item.importance),
        timestamp: item.timestamp || new Date().toISOString(),
        source: item.source || 'GDELT',
      });
    }

    const geoEvents = geo?.data?.events || [];
    for (const event of geoEvents.slice(0, Math.max(0, 6 - items.length))) {
      items.push({
        id: event.url || event.headline,
        title: event.headline,
        tag: (event.event_type || event.region || 'GEO').toString().toUpperCase(),
        severity: severityFromIntensity(event.intensity),
        timestamp: event.timestamp || new Date().toISOString(),
        source: event.source || 'GDELT',
      });
    }

    if (items.length < 4) {
      const hotspots = geo?.data?.hotspots || [];
      for (const risk of hotspots.slice(0, 4 - items.length)) {
        items.push({
          id: risk.region || 'HOTSPOT',
          title: `${risk.region || 'HOTSPOT'}: ${risk.event_count} events`,
          tag: 'RISK',
          severity: 'medium',
          timestamp: geo?.metadata?.fetchedAt || new Date().toISOString(),
          source: 'WARGAMES',
        });
      }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      items,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch breaking intel' },
      { status: 500 }
    );
  }
}

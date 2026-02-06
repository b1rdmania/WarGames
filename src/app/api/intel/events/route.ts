import { NextResponse } from 'next/server';

const WARGAMES_API_BASE = process.env.WARGAMES_API_BASE || 'https://wargames-api.fly.dev';

export async function GET() {
  try {
    const [eventsRes, geoRes] = await Promise.all([
      fetch(`${WARGAMES_API_BASE}/events?days=14`, { next: { revalidate: 300 } }),
      fetch(`${WARGAMES_API_BASE}/live/geo`, { next: { revalidate: 120 } }),
    ]);
    const events = eventsRes.ok ? await eventsRes.json() : null;
    const geo = geoRes.ok ? await geoRes.json() : null;

    const predictions = (geo?.data?.events || []).slice(0, 4).map((event: any) => ({
      type: event.event_type || event.region || 'geo',
      impact: `${event.intensity ?? '—'}`,
      time_to_event_readable: event.timestamp ? 'active' : 'live',
      recommended_action: event.headline || 'Monitor geopolitical flashpoints',
    }));

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      events,
      predict: { predictions },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch intel events' },
      { status: 500 }
    );
  }
}

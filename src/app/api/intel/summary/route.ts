import { NextResponse } from 'next/server';

const WARGAMES_API_BASE = process.env.WARGAMES_API_BASE || 'https://wargames-api.fly.dev';

export async function GET() {
  try {
    const [riskRes, narrativesRes, eventsRes, nextEventRes, volRes, creditRes, geoRes] = await Promise.all([
      fetch(`${WARGAMES_API_BASE}/live/risk`, { next: { revalidate: 60 } }),
      fetch(`${WARGAMES_API_BASE}/narratives`, { next: { revalidate: 300 } }),
      fetch(`${WARGAMES_API_BASE}/events?days=7`, { next: { revalidate: 300 } }),
      fetch(`${WARGAMES_API_BASE}/events/next-critical`, { next: { revalidate: 300 } }),
      fetch(`${WARGAMES_API_BASE}/live/vol`, { next: { revalidate: 300 } }),
      fetch(`${WARGAMES_API_BASE}/live/credit`, { next: { revalidate: 300 } }),
      fetch(`${WARGAMES_API_BASE}/live/geo`, { next: { revalidate: 180 } }),
    ]);

    const [risk, narratives, events, nextCritical, vol, credit, geo] = await Promise.all([
      riskRes.ok ? riskRes.json() : null,
      narrativesRes.ok ? narrativesRes.json() : null,
      eventsRes.ok ? eventsRes.json() : null,
      nextEventRes.ok ? nextEventRes.json() : null,
      volRes.ok ? volRes.json() : null,
      creditRes.ok ? creditRes.json() : null,
      geoRes.ok ? geoRes.json() : null,
    ]);

    const eventList = events?.events || [];
    const forecast = {
      windows: eventList.slice(0, 3).map((event: any) => ({
        windowStart: event.date,
        eventName: event.event,
        expectedVolatility:
          event.impact === 'critical'
            ? 90
            : event.impact === 'high'
              ? 80
              : event.impact === 'medium'
                ? 55
                : 30,
      })),
    };

    const nextEvent =
      nextCritical?.event
        ? { title: nextCritical.event.event, date: nextCritical.event.date }
        : eventList.length
          ? { title: eventList[0].event, date: eventList[0].date }
          : null;

    const regime = {
      regime: credit?.data?.summary?.regime || vol?.data?.summary?.regime || 'unknown',
      confidence: null,
      note: credit?.data?.summary?.note || vol?.data?.summary?.vix_level,
    };

    const posture =
      typeof risk?.score === 'number'
        ? {
            overallRecommendation:
              risk.score >= 70
                ? 'Reduce exposure, prioritize hedges, wait for volatility to pass.'
                : risk.score <= 30
                  ? 'Increase exposure selectively; conditions favor risk-on.'
                  : 'Maintain balanced posture; keep dry powder and tighten stops.',
          }
        : null;

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      risk,
      forecast,
      narratives,
      regime,
      nextEvent,
      posture,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch intel summary' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';

const WARGAMES_API_BASE = process.env.WARGAMES_API_BASE || 'https://wargames-api.fly.dev';

export async function GET() {
  try {
    const defiRes = await fetch(`${WARGAMES_API_BASE}/live/defi`, { next: { revalidate: 300 } });
    const defi = defiRes.ok ? await defiRes.json() : null;

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      defi,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch intel extra' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';

const WARGAMES_API_BASE = process.env.WARGAMES_API_BASE || 'https://wargames-api.fly.dev';

export async function GET() {
  try {
    const [solanaRes, volRes, creditRes] = await Promise.all([
      fetch(`${WARGAMES_API_BASE}/live/solana`, { next: { revalidate: 120 } }),
      fetch(`${WARGAMES_API_BASE}/live/vol`, { next: { revalidate: 300 } }),
      fetch(`${WARGAMES_API_BASE}/live/credit`, { next: { revalidate: 300 } }),
    ]);

    const [solana, vol, credit] = await Promise.all([
      solanaRes.ok ? solanaRes.json() : null,
      volRes.ok ? volRes.json() : null,
      creditRes.ok ? creditRes.json() : null,
    ]);

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      solana,
      vol,
      credit,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch intel flow' },
      { status: 500 }
    );
  }
}

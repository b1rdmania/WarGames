import { NextResponse } from 'next/server';

const WARGAMES_API_BASE = process.env.WARGAMES_API_BASE || 'https://wargames-api.fly.dev';

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

export async function GET() {
  try {
    const tapeRes = await fetch(`${WARGAMES_API_BASE}/live/tape`, { next: { revalidate: 120 } });
    const tape = tapeRes.ok ? await tapeRes.json() : null;

    const items: MarketTapeItem[] = [];

    const tapeGroups = tape?.data?.tape || [];
    for (const group of tapeGroups) {
      const category = (group.category || 'MARKET').toString().toUpperCase();
      for (const [idx, entry] of (group.items || []).slice(0, 6).entries()) {
        const label = entry.symbol || entry.type || entry.name || category;
        const value = entry.value ?? entry.oas ?? entry.rate ?? entry.price ?? null;
        if (typeof value !== 'number') continue;
        items.push({
          id: `${category}-${label}-${idx}`,
          category,
          label,
          value,
          change: entry.change_24h ?? null,
          note: entry.note,
          unit: entry.unit,
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
      { error: 'Failed to fetch market tape' },
      { status: 500 }
    );
  }
}

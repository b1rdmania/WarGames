import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type HyperliquidFill = {
  coin?: string;
  px?: string;
  sz?: string;
  side?: string;
  dir?: string;
  time?: number;
  timestamp?: number;
  hash?: string;
  oid?: number;
};

function toNumber(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function mapSide(fill: HyperliquidFill): 'YES' | 'NO' {
  const dir = (fill.dir ?? '').toLowerCase();
  if (dir.includes('long')) return 'YES';
  if (dir.includes('short')) return 'NO';
  const side = (fill.side ?? '').toUpperCase();
  return side === 'B' ? 'YES' : 'NO';
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const wallet = (url.searchParams.get('wallet') ?? '').trim();
    if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
      return NextResponse.json({ ok: false, error: 'Valid wallet is required' }, { status: 400 });
    }

    const limit = Math.max(1, Math.min(200, Number(url.searchParams.get('limit') ?? 60)));
    const response = await fetch('https://api.hyperliquid.xyz/info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'userFills',
        user: wallet,
        aggregateByTime: true,
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, error: `Hyperliquid API error (${response.status})` },
        { status: 502 }
      );
    }

    const fillsRaw = await response.json().catch(() => []);
    const fills = Array.isArray(fillsRaw) ? (fillsRaw as HyperliquidFill[]) : [];

    const events = fills
      .slice(0, limit)
      .map((fill) => {
        const px = toNumber(fill.px);
        const sz = toNumber(fill.sz);
        const ts = Number.isFinite(fill.time) ? Number(fill.time) : Number(fill.timestamp ?? Date.now());
        return {
          source: 'hyperliquid' as const,
          ts,
          wallet,
          marketId: String(fill.coin ?? 'UNKNOWN').trim() || 'UNKNOWN',
          side: mapSide(fill),
          status: 'success' as const,
          sizeUsd: sz,
          leverage: 1,
          notionalUsd: Math.abs(px * sz),
          orderId: fill.hash ?? (fill.oid !== undefined ? String(fill.oid) : undefined),
        };
      });

    return NextResponse.json({ ok: true, events });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message || 'Failed to load Hyperliquid fills' },
      { status: 500 }
    );
  }
}


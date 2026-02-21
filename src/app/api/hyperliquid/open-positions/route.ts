import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type HyperliquidPosition = {
  coin?: string;
  szi?: string | number;
  positionValue?: string | number;
  unrealizedPnl?: string | number;
  entryPx?: string | number;
  leverage?: { value?: string | number } | string | number;
};

type HyperliquidAssetPosition = {
  type?: string;
  position?: HyperliquidPosition;
};

type HyperliquidClearinghouseState = {
  assetPositions?: HyperliquidAssetPosition[];
};

function toNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function normalizeCoin(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const s = raw.split(':').pop()?.trim();
  if (!s) return null;
  return s.toUpperCase();
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const wallet = (url.searchParams.get('wallet') ?? '').trim();
    if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
      return NextResponse.json({ ok: false, error: 'Valid wallet is required' }, { status: 400 });
    }

    const response = await fetch('https://api.hyperliquid.xyz/info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'clearinghouseState',
        user: wallet,
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, error: `Hyperliquid API error (${response.status})` },
        { status: 502 }
      );
    }

    const raw = (await response.json().catch(() => ({}))) as HyperliquidClearinghouseState;
    const assetPositions = Array.isArray(raw.assetPositions) ? raw.assetPositions : [];

    const positions = assetPositions
      .map((row) => row?.position)
      .filter((position): position is HyperliquidPosition => Boolean(position && normalizeCoin(position.coin)))
      .map((position) => {
        const coin = normalizeCoin(position.coin) as string;
        const size = toNumber(position.szi);
        const side: 'long' | 'short' | 'flat' = size > 0 ? 'long' : size < 0 ? 'short' : 'flat';
        const absSize = Math.abs(size);
        const entryPrice = toNumber(position.entryPx);
        const positionValue = Math.abs(toNumber(position.positionValue));
        const pnl = toNumber(position.unrealizedPnl);
        const leverage =
          typeof position.leverage === 'object'
            ? toNumber(position.leverage?.value)
            : toNumber(position.leverage);

        return {
          coin,
          side,
          size: absSize,
          entryPrice,
          positionValue,
          pnl,
          leverage,
        };
      })
      .filter((position) => position.side !== 'flat' && position.size > 0);

    const longCoins = Array.from(new Set(positions.filter((p) => p.side === 'long').map((p) => p.coin))).sort();
    const shortCoins = Array.from(new Set(positions.filter((p) => p.side === 'short').map((p) => p.coin))).sort();

    return NextResponse.json({
      ok: true,
      wallet,
      fetchedAt: Date.now(),
      longCoins,
      shortCoins,
      positions,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message || 'Failed to load Hyperliquid open positions' },
      { status: 500 }
    );
  }
}


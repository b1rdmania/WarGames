import { NextResponse } from 'next/server';
import { recordTradeStatEvent } from '@/lib/stats/store';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const marketId = String((body as { marketId?: string }).marketId ?? '').trim();
    const status = String((body as { status?: string }).status ?? '').trim();
    const side = String((body as { side?: string }).side ?? '').trim();
    const validStatus = status === 'attempted' || status === 'success' || status === 'failed';
    const validSide = side === 'YES' || side === 'NO';
    if (!marketId || !validStatus || !validSide) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await recordTradeStatEvent({
      ts: Number((body as { ts?: number }).ts ?? Date.now()),
      wallet: typeof (body as { wallet?: string }).wallet === 'string' ? (body as { wallet?: string }).wallet : undefined,
      marketId,
      side: side as 'YES' | 'NO',
      sizeUsd: Number((body as { sizeUsd?: number }).sizeUsd ?? 0),
      leverage: Number((body as { leverage?: number }).leverage ?? 1),
      notionalUsd: Number((body as { notionalUsd?: number }).notionalUsd ?? 0),
      status: status as 'attempted' | 'success' | 'failed',
      orderId: typeof (body as { orderId?: string }).orderId === 'string' ? (body as { orderId?: string }).orderId : undefined,
      error: typeof (body as { error?: string }).error === 'string' ? (body as { error?: string }).error : undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message || 'Failed to record event' },
      { status: 500 }
    );
  }
}

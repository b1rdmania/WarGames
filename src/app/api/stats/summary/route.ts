import { NextResponse } from 'next/server';
import { getStatsSummary } from '@/lib/stats/store';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const days = Number(searchParams.get('days') ?? 30);
    const summary = await getStatsSummary(days);
    return NextResponse.json(summary);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to load stats' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { PEAR_CONFIG } from '@/integrations/pear/config';

export async function GET(req: NextRequest) {
  const qs = req.nextUrl.searchParams.toString();
  const upstreamUrl = `${PEAR_CONFIG.apiUrl}/markets${qs ? `?${qs}` : ''}`;

  const upstream = await fetch(upstreamUrl, {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('content-type') ?? 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

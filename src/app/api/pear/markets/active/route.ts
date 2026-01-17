import { NextResponse } from 'next/server';
import { PEAR_CONFIG } from '@/integrations/pear/config';

// Spec reference: docs/pear-docs (Markets page not yet extracted; endpoint used by app for validation only)
export async function GET() {
  const upstream = await fetch(`${PEAR_CONFIG.apiUrl}/markets/active`, {
    headers: { 'Content-Type': 'application/json' },
    // avoid Next caching surprises during hackathon debugging
    cache: 'no-store',
  });

  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('content-type') ?? 'application/json',
      // keep it simple; our origin is trusted
      'Cache-Control': 'no-store',
    },
  });
}


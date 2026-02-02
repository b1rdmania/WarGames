import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isIOSUserAgent(ua: string) {
  // iOS + iPadOS (iPadOS sometimes reports as Macintosh with Mobile)
  return /(iPhone|iPad|iPod)/i.test(ua) || (/Macintosh/i.test(ua) && /Mobile/i.test(ua));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only gate normal pages. Never gate Next internals, assets, or API routes.
  // GTM page is allowed on mobile for partner calls.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/ios') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/music') ||
    pathname.startsWith('/splash') ||
    pathname.startsWith('/gtm')
  ) {
    return NextResponse.next();
  }

  const ua = req.headers.get('user-agent') ?? '';
  if (!ua) return NextResponse.next();

  // Let iOS users see the splash, but gate everything else behind /ios.
  if (isIOSUserAgent(ua) && pathname !== '/') {
    const url = req.nextUrl.clone();
    url.pathname = '/ios';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|ios|favicon.ico).*)'],
};


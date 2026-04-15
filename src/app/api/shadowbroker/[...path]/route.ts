import { NextRequest, NextResponse } from 'next/server';

const STRIP_REQUEST = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade',
  'host',
]);

const STRIP_RESPONSE = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade',
  'content-encoding',
  'content-length',
]);

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, max-age=0',
  Pragma: 'no-cache',
};

function isNoStorePath(pathSegments: string[]) {
  const joined = pathSegments.join('/');
  return joined.startsWith('live-data') || joined === 'layers' || joined === 'viewport';
}

async function proxy(req: NextRequest, pathSegments: string[]) {
  const configuredBaseUrl = process.env.SHADOWBROKER_BACKEND_URL;
  if (!configuredBaseUrl) {
    return NextResponse.json(
      { error: 'Shadowbroker backend not configured' },
      { status: 503, headers: NO_STORE_HEADERS },
    );
  }

  const baseUrl = configuredBaseUrl;
  const targetUrl = new URL(`/api/${pathSegments.join('/')}`, baseUrl);
  targetUrl.search = req.nextUrl.search;

  const requestHeaders = new Headers();
  req.headers.forEach((value, key) => {
    if (!STRIP_REQUEST.has(key.toLowerCase())) {
      requestHeaders.set(key, value);
    }
  });

  const isBodyless = req.method === 'GET' || req.method === 'HEAD';
  const requestInit: RequestInit & { duplex?: 'half' } = {
    method: req.method,
    headers: requestHeaders,
    cache: 'no-store',
  };

  if (!isBodyless) {
    requestInit.body = req.body;
    requestInit.duplex = 'half';
  }

  let upstream: Response;
  try {
    upstream = await fetch(targetUrl, requestInit);
  } catch {
    return NextResponse.json(
      { error: 'Shadowbroker backend unavailable', upstream: targetUrl.toString() },
      { status: 502, headers: NO_STORE_HEADERS },
    );
  }

  const responseHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    if (!STRIP_RESPONSE.has(key.toLowerCase())) {
      responseHeaders.set(key, value);
    }
  });

  if (isNoStorePath(pathSegments)) {
    Object.entries(NO_STORE_HEADERS).forEach(([key, value]) => responseHeaders.set(key, value));
  }

  if (upstream.status === 304) {
    return new NextResponse(null, { status: 304, headers: responseHeaders });
  }

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path);
}

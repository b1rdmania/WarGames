import { PEAR_CONFIG } from './config';

/**
 * Pear market payload shapes vary a bit across environments/versions.
 * We only need one thing: a set of tradable asset symbols (coins/tickers).
 */
export async function getActiveAssetSymbols(): Promise<Set<string>> {
  // Browser CORS can block direct calls to Pear. Proxy through our Next.js API route.
  const res = await fetch(`/api/pear/markets/active`, {
    headers: { 'Content-Type': 'application/json' },
  }).catch(() => null);

  // If this endpoint ever changes / becomes unavailable, we still want the app to work.
  // Return an empty set and let the caller fall back to safe defaults.
  if (!res || !res.ok) return new Set();

  const data = await res.json().catch(() => null);
  if (!data) return new Set();

  const out = new Set<string>();

  const add = (v: unknown) => {
    if (typeof v !== 'string') return;
    const s = v.trim();
    if (!s) return;
    // Keep it conservative: only collect "ticker-like" strings.
    if (!/^[A-Za-z0-9._-]{2,16}$/.test(s)) return;
    out.add(s);
  };

  const scan = (node: unknown) => {
    if (!node) return;
    if (Array.isArray(node)) {
      for (const it of node) scan(it);
      return;
    }
    if (typeof node !== 'object') return;

    const obj = node as Record<string, unknown>;

    // Common keys we’ve seen: coin / asset / symbol
    add(obj.coin);
    add(obj.asset);
    add(obj.symbol);
    add(obj.ticker);

    // Common arrays: longAssets/shortAssets/legs/assets
    scan(obj.longAssets);
    scan(obj.shortAssets);
    scan(obj.legs);
    scan(obj.assets);
  };

  scan(data);
  return out;
}


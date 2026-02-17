/**
 * Pear market payload shapes vary a bit across environments/versions.
 * We only need one thing: a set of tradable asset symbols (coins/tickers).
 */
export type ActiveMarketDiscovery = {
  symbols: Set<string>;
  maxLeverageBySymbol: Map<string, number>;
};

function normalizeSymbol(raw: string): string {
  return raw.trim().toUpperCase();
}

function baseSymbol(raw: string): string {
  return normalizeSymbol(raw).split(':').pop() ?? normalizeSymbol(raw);
}

function readLeverage(value: unknown): number | null {
  const n = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  if (!Number.isFinite(n)) return null;
  if (n < 1 || n > 200) return null;
  return n;
}

export async function getActiveMarketDiscovery(): Promise<ActiveMarketDiscovery> {
  // Browser CORS can block direct calls to Pear. Proxy through our Next.js API route.
  const res = await fetch(`/api/pear/markets/active`, {
    headers: { 'Content-Type': 'application/json' },
  }).catch(() => null);

  // If this endpoint ever changes / becomes unavailable, we still want the app to work.
  // Return empty discovery and let caller use safe defaults.
  if (!res || !res.ok) return { symbols: new Set(), maxLeverageBySymbol: new Map() };

  const data = await res.json().catch(() => null);
  if (!data) return { symbols: new Set(), maxLeverageBySymbol: new Map() };

  const symbols = new Set<string>();
  const maxLeverageBySymbol = new Map<string, number>();

  const addSymbol = (v: unknown): string | null => {
    if (typeof v !== 'string') return null;
    const s = v.trim();
    if (!s) return null;
    // Keep it conservative: only collect "ticker-like" strings.
    // Allow colons for prefixed symbols (xyz:NVDA, vntl:MAG7, km:US500, etc.)
    if (!/^[A-Za-z0-9._:-]{2,20}$/.test(s)) return null;
    const normalized = normalizeSymbol(s);
    const base = baseSymbol(s);
    symbols.add(normalized);
    symbols.add(base);
    return normalized;
  };

  const applyLeverage = (symbol: string, lev: number | null) => {
    if (!lev) return;
    const base = baseSymbol(symbol);
    // Conservative policy: keep the lowest seen cap for a symbol.
    const currentExact = maxLeverageBySymbol.get(symbol);
    maxLeverageBySymbol.set(symbol, currentExact ? Math.min(currentExact, lev) : lev);
    const currentBase = maxLeverageBySymbol.get(base);
    maxLeverageBySymbol.set(base, currentBase ? Math.min(currentBase, lev) : lev);
  };

  const scan = (node: unknown) => {
    if (!node) return;
    if (Array.isArray(node)) {
      for (const it of node) scan(it);
      return;
    }
    if (typeof node !== 'object') return;

    const obj = node as Record<string, unknown>;
    const symbol =
      addSymbol(obj.coin) ??
      addSymbol(obj.asset) ??
      addSymbol(obj.symbol) ??
      addSymbol(obj.ticker);

    if (symbol) {
      const lev =
        readLeverage(obj.maxLeverage) ??
        readLeverage(obj.max_leverage) ??
        readLeverage(obj.maxLev) ??
        readLeverage(obj.max_lev) ??
        readLeverage(obj.leverage);
      applyLeverage(symbol, lev);
    }

    // Common arrays: longAssets/shortAssets/legs/assets/active
    scan(obj.longAssets);
    scan(obj.shortAssets);
    scan(obj.legs);
    scan(obj.assets);
    scan(obj.active); // Pear API wraps markets in "active" array
  };

  scan(data);
  console.log(`[activeMarkets] Found ${symbols.size} symbols, ${maxLeverageBySymbol.size} leverage caps`);
  return { symbols, maxLeverageBySymbol };
}

export async function getActiveAssetSymbols(): Promise<Set<string>> {
  const discovery = await getActiveMarketDiscovery();
  return discovery.symbols;
}

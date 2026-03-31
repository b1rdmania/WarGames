/**
 * Pear market payload shapes vary a bit across environments/versions.
 * We only need one thing: a set of tradable asset symbols (coins/tickers).
 */
export type ActiveMarketDiscovery = {
  symbols: Set<string>;
  maxLeverageBySymbol: Map<string, number>;
};

type PearMarketListResponse = {
  markets?: Array<{ name?: string }>;
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

function parseSymbolsFromMarketName(name: string): string[] {
  // Example format: "L:ETH|S:BTC,ETH"
  const out: string[] = [];
  const parts = name.split('|');
  for (const part of parts) {
    const sidePayload = part.replace(/^\s*[LS]\s*:\s*/i, '').trim();
    if (!sidePayload) continue;
    for (const token of sidePayload.split(',')) {
      const sym = token.trim();
      if (!sym) continue;
      out.push(sym);
    }
  }
  return out;
}

async function fetchPagedMarketNames(limitPages = 6): Promise<string[]> {
  const names: string[] = [];
  for (let page = 1; page <= limitPages; page += 1) {
    const res = await fetch(`/api/pear/markets?page=${page}&pageSize=100&active=true`, {
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => null);
    if (!res || !res.ok) break;
    const data = (await res.json().catch(() => null)) as PearMarketListResponse | null;
    const rows = data?.markets ?? [];
    if (!rows.length) break;
    for (const row of rows) {
      if (typeof row?.name === 'string' && row.name.trim()) names.push(row.name.trim());
    }
    if (rows.length < 100) break;
  }
  return names;
}

export async function getActiveMarketDiscovery(): Promise<ActiveMarketDiscovery> {
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
    scan(obj.active); // Pear API wraps active markets in "active" array
  };

  // Primary source: active feed (includes explicit longAssets/shortAssets + leverage caps).
  const activeRes = await fetch(`/api/pear/markets/active`, {
    headers: { 'Content-Type': 'application/json' },
  }).catch(() => null);

  if (activeRes?.ok) {
    const activeData = await activeRes.json().catch(() => null);
    if (activeData) scan(activeData);
  }

  // Secondary source: paged /markets names. This catches symbols absent from the active subset.
  const names = await fetchPagedMarketNames().catch(() => []);
  for (const name of names) {
    for (const token of parseSymbolsFromMarketName(name)) addSymbol(token);
  }

  console.log(`[activeMarkets] Found ${symbols.size} symbols, ${maxLeverageBySymbol.size} leverage caps`);
  return { symbols, maxLeverageBySymbol };
}

export async function getActiveAssetSymbols(): Promise<Set<string>> {
  const discovery = await getActiveMarketDiscovery();
  return discovery.symbols;
}

import type { PearMarketConfig, ResolvedPairs } from './types';

export type ValidatedMarket = PearMarketConfig & {
  resolvedPairs: ResolvedPairs;
  isRemapped: boolean;
  remapReason?: string;
};

function pickFallbackPair(symbols: Set<string>): ResolvedPairs {
  // Best default for a hackathon demo: almost always available.
  if (symbols.has('BTC') && symbols.has('ETH')) return { long: 'BTC', short: 'ETH' };
  if (symbols.has('ETH') && symbols.has('BTC')) return { long: 'ETH', short: 'BTC' };

  const list = Array.from(symbols);
  if (list.length >= 2) return { long: list[0], short: list[1] };

  // Absolute last resort. Even if validation failed, this keeps the UI coherent.
  return { long: 'BTC', short: 'ETH' };
}

export function validateNarrativeMarkets(
  markets: PearMarketConfig[],
  activeSymbols: Set<string>
): ValidatedMarket[] {
  const fallback = pickFallbackPair(activeSymbols);

  return markets.map((m) => {
    const longOk = activeSymbols.has(m.pairs.long);
    const shortOk = activeSymbols.has(m.pairs.short);
    const ok = longOk && shortOk;

    if (ok) {
      return {
        ...m,
        resolvedPairs: { ...m.pairs },
        isRemapped: false,
      };
    }

    const missing = [
      ...(longOk ? [] : [`${m.pairs.long}`]),
      ...(shortOk ? [] : [`${m.pairs.short}`]),
    ];

    return {
      ...m,
      resolvedPairs: fallback,
      isRemapped: true,
      remapReason: missing.length ? `Unsupported ticker(s): ${missing.join(', ')}` : 'Unsupported pair',
    };
  });
}


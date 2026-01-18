import type { PearMarketConfig, ResolvedBasket, ResolvedPairs } from './types';

export type ValidatedMarket = PearMarketConfig & {
  isRemapped: boolean;
  remapReason?: string;
  resolvedPairs?: ResolvedPairs;
  resolvedBasket?: ResolvedBasket;
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

  // Normalize symbol set ONCE outside the loop
  const activeUpper = activeSymbols.size
    ? new Set(Array.from(activeSymbols).map((s) => s.toUpperCase()))
    : new Set<string>();

  return markets.map((m) => {

    // Basket markets: validate each leg, remap to a safe fallback pair-as-basket if needed.
    if (m.basket) {
      const missing: string[] = [];
      for (const a of m.basket.long) {
        if (!activeUpper.has(a.asset.toUpperCase())) missing.push(a.asset);
      }
      for (const a of m.basket.short) {
        if (!activeUpper.has(a.asset.toUpperCase())) missing.push(a.asset);
      }

      const ok = missing.length === 0;
      if (ok) {
        return {
          ...m,
          resolvedBasket: { ...m.basket },
          isRemapped: false,
        };
      }

      // Safe demo behavior: collapse to a tradable 1v1 basket using the fallback pair.
      const resolvedBasket: ResolvedBasket = {
        long: [{ asset: fallback.long, weight: 1.0 }],
        short: [{ asset: fallback.short, weight: 1.0 }],
      };

      return {
        ...m,
        resolvedBasket,
        isRemapped: true,
        remapReason: `Unsupported basket ticker(s): ${Array.from(new Set(missing)).join(', ')}`,
      };
    }

    // Pair markets (backward compatible)
    if (m.pairs) {
      const longOk = activeUpper.has(m.pairs.long.toUpperCase());
      const shortOk = activeUpper.has(m.pairs.short.toUpperCase());
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
    }

    // No pairs/basket: remap to fallback pair.
    return {
      ...m,
      resolvedPairs: fallback,
      isRemapped: true,
      remapReason: 'Invalid market config (no pairs/basket)',
    };
  });
}


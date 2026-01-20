import type { PearMarketConfig, ResolvedBasket, ResolvedPairs } from './types';

export type ValidatedMarket = PearMarketConfig & {
  isTradable: boolean;
  unavailableReason?: string;
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
  // Normalize symbol set ONCE outside the loop
  const activeUpper = activeSymbols.size
    ? new Set(Array.from(activeSymbols).map((s) => s.toUpperCase()))
    : new Set<string>();

  return markets.map((m) => {
    // Basket markets: validate each leg. IMPORTANT: never swap the basket to a fallback,
    // since that can cause users to trade the wrong underlying.
    if (m.basket) {
      const missing: string[] = [];
      for (const a of m.basket.long) {
        if (!activeUpper.has(a.asset.toUpperCase())) missing.push(a.asset);
      }
      for (const a of m.basket.short) {
        if (!activeUpper.has(a.asset.toUpperCase())) missing.push(a.asset);
      }

      const ok = missing.length === 0;
      return {
        ...m,
        resolvedBasket: { ...m.basket },
        isTradable: ok,
        unavailableReason: ok ? undefined : `Inactive/unsupported leg(s): ${Array.from(new Set(missing)).join(', ')}`,
      };
    }

    // Pair markets (backward compatible)
    if (m.pairs) {
      const longOk = activeUpper.has(m.pairs.long.toUpperCase());
      const shortOk = activeUpper.has(m.pairs.short.toUpperCase());
      const ok = longOk && shortOk;

      const missing = [
        ...(longOk ? [] : [`${m.pairs.long}`]),
        ...(shortOk ? [] : [`${m.pairs.short}`]),
      ];

      return {
        ...m,
        resolvedPairs: { ...m.pairs },
        isTradable: ok,
        unavailableReason: ok ? undefined : (missing.length ? `Inactive/unsupported leg(s): ${missing.join(', ')}` : 'Inactive/unsupported pair'),
      };
    }

    // No pairs/basket: invalid config
    return {
      ...m,
      isTradable: false,
      unavailableReason: 'Invalid market config (no pairs/basket)',
    };
  });
}


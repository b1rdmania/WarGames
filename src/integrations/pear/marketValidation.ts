import type { PearMarketConfig, ResolvedBasket, ResolvedPairs } from './types';

export type ValidatedMarket = PearMarketConfig & {
  isTradable: boolean;
  unavailableReason?: string;
  resolvedPairs?: ResolvedPairs;
  resolvedBasket?: ResolvedBasket;
  maxAllowedLeverage?: number;
  effectiveLeverage: number;
};

function normalized(symbol: string): string {
  return symbol.trim().toUpperCase();
}

function base(symbol: string): string {
  return normalized(symbol).split(':').pop() ?? normalized(symbol);
}

function lookupCap(symbol: string, leverageCaps: Map<string, number>): number | undefined {
  return leverageCaps.get(normalized(symbol)) ?? leverageCaps.get(base(symbol));
}

function isValidWeight(w: number): boolean {
  return Number.isFinite(w) && w >= 0.01 && w <= 1;
}

function sideWeightSum(side: Array<{ asset: string; weight: number }>): number {
  return side.reduce((sum, leg) => sum + leg.weight, 0);
}

function basketConfigError(marketId: string, basket: { long: Array<{ asset: string; weight: number }>; short: Array<{ asset: string; weight: number }> }): string | undefined {
  if (!basket.long.length || !basket.short.length) {
    return `Invalid basket config for ${marketId}: both long and short legs are required`;
  }

  const badLong = basket.long.find((leg) => !isValidWeight(leg.weight));
  if (badLong) return `Invalid long weight for ${marketId}: ${badLong.asset}=${badLong.weight}`;

  const badShort = basket.short.find((leg) => !isValidWeight(leg.weight));
  if (badShort) return `Invalid short weight for ${marketId}: ${badShort.asset}=${badShort.weight}`;

  const longSum = sideWeightSum(basket.long);
  const shortSum = sideWeightSum(basket.short);
  const eps = 0.001;
  if (Math.abs(longSum - 1) > eps || Math.abs(shortSum - 1) > eps) {
    return `Invalid basket weights for ${marketId}: long=${longSum.toFixed(3)} short=${shortSum.toFixed(3)} (expected 1.000 each side)`;
  }

  return undefined;
}

export function validateNarrativeMarkets(
  markets: PearMarketConfig[],
  activeSymbols: Set<string>,
  leverageCaps: Map<string, number> = new Map()
): ValidatedMarket[] {
  const activeUpper = activeSymbols.size
    ? new Set(
        Array.from(activeSymbols).flatMap((s) => {
          const up = s.toUpperCase();
          return [up, up.split(':').pop() ?? up];
        })
      )
    : new Set<string>();

  return markets.map((m) => {
    if (m.basket) {
      const configError = basketConfigError(m.id, m.basket);
      if (configError) {
        return {
          ...m,
          resolvedBasket: { ...m.basket },
          isTradable: false,
          unavailableReason: configError,
          effectiveLeverage: m.leverage,
        };
      }

      // Active feed is advisory (top/active markets), not a full tradability registry.
      // Do not hard-disable configured markets just because a leg is absent there.
      const ok = true;
      const legs = [...m.basket.long.map((a) => a.asset), ...m.basket.short.map((a) => a.asset)];
      const perLegCaps = legs
        .map((s) => lookupCap(s, leverageCaps))
        .filter((v): v is number => typeof v === 'number');
      const maxAllowedLeverage = perLegCaps.length === legs.length ? Math.max(1, Math.floor(Math.min(...perLegCaps))) : undefined;
      const effectiveLeverage = maxAllowedLeverage ? Math.min(m.leverage, maxAllowedLeverage) : m.leverage;

      return {
        ...m,
        resolvedBasket: { ...m.basket },
        isTradable: ok,
        unavailableReason: undefined,
        maxAllowedLeverage,
        effectiveLeverage,
      };
    }

    if (m.pairs) {
      const longOk = activeUpper.has(m.pairs.long.toUpperCase()) || activeUpper.has(base(m.pairs.long));
      const shortOk = activeUpper.has(m.pairs.short.toUpperCase()) || activeUpper.has(base(m.pairs.short));
      // Active feed is advisory (top/active markets), not a full tradability registry.
      // Do not hard-disable configured markets just because a leg is absent there.
      const ok = true;

      const longCap = lookupCap(m.pairs.long, leverageCaps);
      const shortCap = lookupCap(m.pairs.short, leverageCaps);
      const maxAllowedLeverage =
        typeof longCap === 'number' && typeof shortCap === 'number'
          ? Math.max(1, Math.floor(Math.min(longCap, shortCap)))
          : undefined;
      const effectiveLeverage = maxAllowedLeverage ? Math.min(m.leverage, maxAllowedLeverage) : m.leverage;

      return {
        ...m,
        resolvedPairs: { ...m.pairs },
        isTradable: ok,
        unavailableReason: undefined,
        maxAllowedLeverage,
        effectiveLeverage,
      };
    }

    return {
      ...m,
      isTradable: false,
      unavailableReason: 'Invalid market config (no pairs/basket)',
      effectiveLeverage: m.leverage,
    };
  });
}

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
      const missing: string[] = [];
      for (const a of m.basket.long) {
        if (!activeUpper.has(a.asset.toUpperCase()) && !activeUpper.has(base(a.asset))) missing.push(a.asset);
      }
      for (const a of m.basket.short) {
        if (!activeUpper.has(a.asset.toUpperCase()) && !activeUpper.has(base(a.asset))) missing.push(a.asset);
      }

      const ok = missing.length === 0;
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
        unavailableReason: ok ? undefined : `Inactive/unsupported leg(s): ${Array.from(new Set(missing)).join(', ')}`,
        maxAllowedLeverage,
        effectiveLeverage,
      };
    }

    if (m.pairs) {
      const longOk = activeUpper.has(m.pairs.long.toUpperCase()) || activeUpper.has(base(m.pairs.long));
      const shortOk = activeUpper.has(m.pairs.short.toUpperCase()) || activeUpper.has(base(m.pairs.short));
      const ok = longOk && shortOk;

      const missing = [
        ...(longOk ? [] : [`${m.pairs.long}`]),
        ...(shortOk ? [] : [`${m.pairs.short}`]),
      ];

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
        unavailableReason: ok ? undefined : (missing.length ? `Inactive/unsupported leg(s): ${missing.join(', ')}` : 'Inactive/unsupported pair'),
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

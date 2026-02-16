'use client';

import { useEffect, useMemo, useState } from 'react';
import { MARKETS } from '@/integrations/pear/markets';
import { getActiveAssetSymbols } from '@/integrations/pear/activeMarkets';
import { validateNarrativeMarkets, type ValidatedMarket } from '@/integrations/pear/marketValidation';

function buildConfiguredAssetSet(): Set<string> {
  const out = new Set<string>();
  for (const m of MARKETS) {
    if (m.pairs) {
      out.add(m.pairs.long);
      out.add(m.pairs.short);
    }
    if (m.basket) {
      for (const a of m.basket.long) out.add(a.asset);
      for (const a of m.basket.short) out.add(a.asset);
    }
  }
  return out;
}

export function useValidatedMarkets() {
  const [activeSymbols, setActiveSymbols] = useState<Set<string> | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    getActiveAssetSymbols()
      .then((s) => {
        if (!mounted) return;
        // Degraded mode: if discovery returns empty, keep configured markets tradable
        // instead of hard-disabling the whole board.
        setActiveSymbols(s.size > 0 ? s : buildConfiguredAssetSet());
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e as Error);
        // Degraded mode on discovery failure: preserve canonical configured markets.
        setActiveSymbols(buildConfiguredAssetSet());
      });
    return () => {
      mounted = false;
    };
  }, []);

  const markets: ValidatedMarket[] = useMemo(() => {
    // Important: avoid flashing the fallback pair (BTC/ETH) while we are still
    // loading active symbols. We only remap once we have a real symbol set.
    if (activeSymbols === null) {
      // Optimistic default: show canonical baskets/pairs immediately; tradability is unknown until validated.
      return MARKETS.map((m) => ({ ...m, isTradable: true })) as ValidatedMarket[];
    }
    return validateNarrativeMarkets(MARKETS, activeSymbols);
  }, [activeSymbols]);

  return {
    markets,
    activeSymbols,
    error,
    isValidating: activeSymbols === null,
  };
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import { MARKETS } from '@/integrations/pear/markets';
import { getActiveAssetSymbols } from '@/integrations/pear/activeMarkets';
import { validateNarrativeMarkets, type ValidatedMarket } from '@/integrations/pear/marketValidation';

export function useValidatedMarkets() {
  const [activeSymbols, setActiveSymbols] = useState<Set<string> | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    getActiveAssetSymbols()
      .then((s) => {
        if (!mounted) return;
        setActiveSymbols(s);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e as Error);
        setActiveSymbols(new Set()); // still allow fallback behavior
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


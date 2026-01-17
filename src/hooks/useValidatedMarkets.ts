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
    return validateNarrativeMarkets(MARKETS, activeSymbols ?? new Set());
  }, [activeSymbols]);

  return {
    markets,
    activeSymbols,
    error,
    isValidating: activeSymbols === null,
  };
}


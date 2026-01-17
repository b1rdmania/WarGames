'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getVaultBalances, type VaultBalances } from '@/integrations/pear/vaultWallet';

export function useVaultBalances(accessToken: string | null) {
  const [balances, setBalances] = useState<VaultBalances | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const b = await getVaultBalances(accessToken);
      setBalances(b);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) {
      setBalances(null);
      setError(null);
      setLoading(false);
      return;
    }
    refresh();
  }, [accessToken, refresh]);

  const spotUsdc = useMemo(() => balances?.spotBalances?.USDC ?? null, [balances]);
  const perpUsdc = useMemo(() => balances?.perpBalances?.USDC ?? null, [balances]);

  return {
    balances,
    spotUsdc,
    perpUsdc,
    loading,
    error,
    refresh,
  };
}


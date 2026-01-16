'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { discoverRoutes } from '@/integrations/lifi/routes';
import { executeBridge } from '@/integrations/lifi/execute';
import type { BridgeRoute, BridgeStatus } from '@/integrations/lifi/types';

export function useBridge() {
  const { address, chainId } = useAccount();
  const [routes, setRoutes] = useState<BridgeRoute[]>([]);
  const [status, setStatus] = useState<BridgeStatus['status']>('idle');
  const [txHash, setTxHash] = useState<string>();
  const [error, setError] = useState<Error>();

  async function fetchRoutes(amount: string, fromToken: string) {
    if (!address || !chainId) {
      throw new Error('Wallet not connected');
    }

    setStatus('fetching-routes');
    setError(undefined);

    try {
      const discovered = await discoverRoutes({
        fromChainId: chainId,
        fromTokenAddress: fromToken,
        amount,
        userAddress: address,
      });

      setRoutes(discovered);
      setStatus('ready');
    } catch (err) {
      setError(err as Error);
      setStatus('error');
    }
  }

  async function execute(route: BridgeRoute['route']) {
    setStatus('executing');
    setError(undefined);
    setTxHash(undefined);

    // Save route for resume capability
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeRoute', JSON.stringify(route));
    }

    await executeBridge(route, {
      onStatusUpdate: (statusText) => {
        console.log('Status:', statusText);
      },
      onTxHash: (hash) => {
        setTxHash(hash);
      },
      onSuccess: () => {
        setStatus('success');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('activeRoute');
        }
      },
      onError: (err) => {
        setError(err);
        setStatus('error');
      },
    });
  }

  function reset() {
    setStatus('idle');
    setRoutes([]);
    setTxHash(undefined);
    setError(undefined);
  }

  return {
    routes,
    status,
    txHash,
    error,
    fetchRoutes,
    execute,
    reset,
  };
}

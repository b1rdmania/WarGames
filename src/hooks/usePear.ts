'use client';

import { useState, useEffect } from 'react';
import { useAccount, useSignTypedData } from 'wagmi';
import {
  authenticateWithPear,
  saveAuthTokens,
  getAccessToken,
  clearAuthTokens,
  isAuthenticated
} from '@/integrations/pear/auth';
import { getAgentWallet, createAgentWallet } from '@/integrations/pear/agent';

export function usePear() {
  const { address, isConnected } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [agentWallet, setAgentWallet] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<Error>();

  // Load token on mount
  useEffect(() => {
    if (isConnected && typeof window !== 'undefined') {
      const token = getAccessToken();
      if (token) {
        setAccessToken(token);
        // Fetch agent wallet
        loadAgentWallet(token);
      }
    }
  }, [isConnected]);

  async function loadAgentWallet(token: string) {
    try {
      const wallet = await getAgentWallet(token);
      if (wallet.exists) {
        setAgentWallet(wallet.address);
      }
    } catch (err) {
      console.error('Failed to load agent wallet:', err);
    }
  }

  async function authenticate() {
    if (!address || !isConnected) {
      throw new Error('Wallet not connected');
    }

    setIsAuthenticating(true);
    setError(undefined);

    try {
      const result = await authenticateWithPear(address, signTypedDataAsync);

      setAccessToken(result.accessToken);
      saveAuthTokens(result.accessToken, result.refreshToken);

      // Check/create agent wallet
      let wallet = await getAgentWallet(result.accessToken);
      if (!wallet.exists) {
        wallet = await createAgentWallet(result.accessToken);
      }
      setAgentWallet(wallet.address);

      setIsAuthenticating(false);
    } catch (err) {
      setError(err as Error);
      setIsAuthenticating(false);
      throw err;
    }
  }

  function disconnect() {
    setAccessToken(null);
    setAgentWallet(null);
    clearAuthTokens();
  }

  return {
    accessToken,
    agentWallet,
    isAuthenticated: (typeof window !== 'undefined' && isAuthenticated() && isConnected) || false,
    isAuthenticating,
    error,
    authenticate,
    disconnect,
  };
}

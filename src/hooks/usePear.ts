'use client';

import { useState, useEffect } from 'react';
import { useAccount, useSignTypedData } from 'wagmi';
import {
  authenticateWithPear,
  saveAuthToken,
  getAuthToken,
  clearAuthToken,
  isAuthenticated
} from '@/integrations/pear/auth';

export function usePear() {
  const { address, isConnected } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();

  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [agentWallet, setAgentWallet] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<Error>();

  // Load token on mount
  useEffect(() => {
    if (isConnected) {
      const token = getAuthToken();
      if (token) {
        setJwtToken(token);
        // TODO: Verify token and fetch agent wallet
      }
    }
  }, [isConnected]);

  async function authenticate() {
    if (!address || !isConnected) {
      throw new Error('Wallet not connected');
    }

    setIsAuthenticating(true);
    setError(undefined);

    try {
      const result = await authenticateWithPear(address, signTypedDataAsync);

      setJwtToken(result.jwtToken);
      setAgentWallet(result.agentWalletAddress);
      saveAuthToken(result.jwtToken);

      setIsAuthenticating(false);
    } catch (err) {
      setError(err as Error);
      setIsAuthenticating(false);
      throw err;
    }
  }

  function disconnect() {
    setJwtToken(null);
    setAgentWallet(null);
    clearAuthToken();
  }

  return {
    jwtToken,
    agentWallet,
    isAuthenticated: isAuthenticated() && isConnected,
    isAuthenticating,
    error,
    authenticate,
    disconnect,
  };
}

'use client';

import { useState, useEffect } from 'react';
import { useAccount, useSignTypedData } from 'wagmi';
import {
  authenticateWithPear,
  saveAuthTokens,
  getValidAccessToken,
  clearAuthTokens,
  isAuthenticated
} from '@/integrations/pear/auth';
import { getAgentWallet, createAgentWallet } from '@/integrations/pear/agent';
import { PearApiError } from '@/integrations/pear/errors';

export function usePear() {
  const { address, isConnected } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [agentWallet, setAgentWallet] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<Error>();
  const [lastApiError, setLastApiError] = useState<PearApiError | null>(null);
  const [statusLine, setStatusLine] = useState<string>('IDLE');

  // Load token on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isConnected || !address) {
      setAccessToken(null);
      setAgentWallet(null);
      clearAuthTokens();
      return;
    }

    // Pull a valid token (auto-refresh if near-expiry). If we can't, clear local state.
    (async () => {
      const token = await getValidAccessToken(address);
      if (!token) {
        setAccessToken(null);
        setAgentWallet(null);
        clearAuthTokens();
        return;
      }

      setAccessToken(token);
      await loadAgentWallet(token);
    })().catch((err) => {
      console.error('Failed to initialize Pear auth:', err);
    });
  }, [isConnected, address]);

  async function loadAgentWallet(token: string) {
    try {
      const wallet = await getAgentWallet(token);
      if (wallet.exists) {
        setAgentWallet(wallet.address);
      }
    } catch (err) {
      console.error('Failed to load agent wallet:', err);
      if (err instanceof PearApiError) setLastApiError(err);
    }
  }

  async function runSetup(createIfMissing: boolean = true) {
    if (!address || !isConnected) throw new Error('Wallet not connected');
    if (isAuthenticating) return;

    setIsAuthenticating(true);
    setError(undefined);
    setLastApiError(null);

    try {
      setStatusLine('AUTH: /auth/eip712-message');
      const result = await authenticateWithPear(address, signTypedDataAsync);
      setStatusLine('AUTH: TOKEN RECEIVED');

      setAccessToken(result.accessToken);
      saveAuthTokens(result.accessToken, result.refreshToken, result.expiresIn, address);

      setStatusLine('AGENT: /agentWallet (GET)');
      let wallet = await getAgentWallet(result.accessToken);

      if (!wallet.exists && createIfMissing) {
        setStatusLine('AGENT: /agentWallet (POST)');
        wallet = await createAgentWallet(result.accessToken);
      }

      setAgentWallet(wallet.address || null);
      setStatusLine('READY');
    } catch (err) {
      setStatusLine('ERROR');
      setError(err as Error);
      if (err instanceof PearApiError) setLastApiError(err);
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  }

  async function authenticate() {
    if (!address || !isConnected) {
      throw new Error('Wallet not connected');
    }

    // Fix #4: Prevent concurrent auth attempts
    if (isAuthenticating) {
      console.log('Authentication already in progress');
      return;
    }

    setIsAuthenticating(true);
    setError(undefined);
    setLastApiError(null);
    setStatusLine('AUTHENTICATING');

    try {
      const result = await authenticateWithPear(address, signTypedDataAsync);

      setAccessToken(result.accessToken);
      saveAuthTokens(result.accessToken, result.refreshToken, result.expiresIn, address);

      // Check/create agent wallet
      let wallet = await getAgentWallet(result.accessToken);
      if (!wallet.exists) {
        wallet = await createAgentWallet(result.accessToken);
      }
      setAgentWallet(wallet.address);

      setIsAuthenticating(false);
      setStatusLine('READY');
    } catch (err) {
      setError(err as Error);
      if (err instanceof PearApiError) setLastApiError(err);
      setIsAuthenticating(false);
      setStatusLine('ERROR');
      throw err;
    }
  }

  function disconnect() {
    setAccessToken(null);
    setAgentWallet(null);
    setLastApiError(null);
    setStatusLine('IDLE');
    clearAuthTokens();
  }

  return {
    accessToken,
    agentWallet,
    isAuthenticated: (typeof window !== 'undefined' && isAuthenticated() && isConnected) || false,
    isAuthenticating,
    error,
    authenticate,
    runSetup,
    lastApiError,
    statusLine,
    disconnect,
  };
}

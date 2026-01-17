'use client';

import { useState, useEffect } from 'react';
import { useAccount, useChainId, useSignTypedData, useSwitchChain } from 'wagmi';
import { arbitrum } from 'wagmi/chains';
import {
  authenticateWithPear,
  getAuthEip712Message,
  loginWithEip712Signature,
  saveAuthTokens,
  getValidAccessToken,
  clearAuthTokens,
  isAuthenticated
} from '@/integrations/pear/auth';
import { getAgentWallet, createAgentWallet } from '@/integrations/pear/agent';
import { PearApiError } from '@/integrations/pear/errors';
import { emitDebugLog } from '@/lib/debugLog';

export function usePear() {
  const { address, isConnected } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();
  const activeChainId = useChainId();
  const { switchChainAsync } = useSwitchChain();

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [agentWallet, setAgentWallet] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<Error>();
  const [lastApiError, setLastApiError] = useState<PearApiError | null>(null);
  const [statusLine, setStatusLine] = useState<string>('IDLE');
  const [requiredChainId, setRequiredChainId] = useState<number | null>(null);

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
    setRequiredChainId(null);

    try {
      emitDebugLog({ level: 'info', scope: 'setup', message: 'RUN SETUP start' });
      setStatusLine('AUTH: /auth/eip712-message');
      const { eip712Data, clientId } = await getAuthEip712Message(address);
      emitDebugLog({
        level: 'info',
        scope: 'auth',
        message: 'EIP712 message fetched',
        data: { clientId, domainChainId: eip712Data?.domain?.chainId },
      });
      const domainChainId = Number(eip712Data?.domain?.chainId);
      if (Number.isFinite(domainChainId)) {
        setRequiredChainId(domainChainId);
        // Pear currently returns chainId=42161 for auth (Arbitrum).
        // Spec: docs/pear-docs/AUTHENTICATION.md
        if (activeChainId !== domainChainId) {
          setStatusLine(`SWITCH CHAIN: ${domainChainId}`);
          emitDebugLog({ level: 'warn', scope: 'chain', message: 'Switching for auth signing', data: { from: activeChainId, to: domainChainId } });
          if (!switchChainAsync) {
            throw new Error(`Please switch your wallet network to chainId ${domainChainId} and retry.`);
          }
          await switchChainAsync({ chainId: domainChainId });
        }
      }

      setStatusLine('AUTH: SIGN EIP-712');
      const signature = await signTypedDataAsync({
        domain: eip712Data.domain,
        types: eip712Data.types,
        primaryType: eip712Data.primaryType,
        message: eip712Data.message,
      });
      emitDebugLog({ level: 'info', scope: 'auth', message: 'EIP712 signature obtained' });

      setStatusLine('AUTH: /auth/login');
      const result = await loginWithEip712Signature({
        address,
        clientId,
        signature,
        timestamp: eip712Data.message.timestamp,
      });
      setStatusLine('AUTH: TOKEN RECEIVED');
      emitDebugLog({ level: 'info', scope: 'auth', message: 'Auth ok (token received)', data: { expiresIn: result.expiresIn } });

      setAccessToken(result.accessToken);
      saveAuthTokens(result.accessToken, result.refreshToken, result.expiresIn, address);

      setStatusLine('AGENT: /agentWallet (GET)');
      emitDebugLog({ level: 'info', scope: 'agent', message: 'GET /agentWallet' });
      let wallet = await getAgentWallet(result.accessToken);

      if (!wallet.exists && createIfMissing) {
        setStatusLine('AGENT: /agentWallet (POST)');
        emitDebugLog({ level: 'info', scope: 'agent', message: 'POST /agentWallet' });
        wallet = await createAgentWallet(result.accessToken);
      }

      setAgentWallet(wallet.address || null);

      // Keep user on Arbitrum (where they signed) - no need to switch chains
      // Trading happens server-side via Pear API regardless of MetaMask chain

      setStatusLine('READY');
      emitDebugLog({ level: 'info', scope: 'setup', message: 'RUN SETUP ready' });
    } catch (err) {
      setStatusLine('ERROR');
      setError(err as Error);
      if (err instanceof PearApiError) setLastApiError(err);
      emitDebugLog({ level: 'error', scope: 'setup', message: 'RUN SETUP failed', data: { message: (err as Error)?.message } });
      // Map the common viem chainId mismatch into an actionable instruction.
      if (
        err instanceof Error &&
        err.message?.includes('Provided chainId') &&
        err.message?.includes('must match the active chainId')
      ) {
        setError(new Error(`Wallet network mismatch. Pear auth signing requires Arbitrum (chainId ${arbitrum.id}). Please switch and retry.`));
      }
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
    isAuthenticated: !!(accessToken && isConnected),
    isAuthenticating,
    error,
    authenticate,
    runSetup,
    lastApiError,
    statusLine,
    requiredChainId,
    disconnect,
  };
}

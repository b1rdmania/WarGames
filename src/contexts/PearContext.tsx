'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount, useChainId, useSignTypedData, useSwitchChain } from 'wagmi';
import { arbitrum } from 'wagmi/chains';
import {
  getAuthEip712Message,
  loginWithEip712Signature,
  saveAuthTokens,
  getValidAccessToken,
  clearAuthTokens,
} from '@/integrations/pear/auth';
import { getAgentWallet, createAgentWallet } from '@/integrations/pear/agent';
import { PearApiError } from '@/integrations/pear/errors';
import { emitDebugLog } from '@/lib/debugLog';

interface PearContextValue {
  accessToken: string | null;
  agentWallet: string | null;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  error: Error | undefined;
  lastApiError: PearApiError | null;
  statusLine: string;
  requiredChainId: number | null;
  runSetup: (createIfMissing?: boolean) => Promise<void>;
  disconnect: () => void;
}

const PearContext = createContext<PearContextValue | undefined>(undefined);

export function PearProvider({ children }: { children: ReactNode }) {
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
      console.log('🔑 Token set successfully');

      setStatusLine('AGENT: /agentWallet (GET)');
      emitDebugLog({ level: 'info', scope: 'agent', message: 'GET /agentWallet' });
      let wallet = await getAgentWallet(result.accessToken);

      if (!wallet.exists && createIfMissing) {
        setStatusLine('AGENT: /agentWallet (POST)');
        emitDebugLog({ level: 'info', scope: 'agent', message: 'POST /agentWallet' });
        wallet = await createAgentWallet(result.accessToken);
      }

      setAgentWallet(wallet.address || null);
      setStatusLine('READY');
      emitDebugLog({ level: 'info', scope: 'setup', message: 'RUN SETUP ready' });
    } catch (err) {
      setStatusLine('ERROR');
      setError(err as Error);
      if (err instanceof PearApiError) setLastApiError(err);
      emitDebugLog({ level: 'error', scope: 'setup', message: 'RUN SETUP failed', data: { message: (err as Error)?.message } });
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

  function disconnect() {
    setAccessToken(null);
    setAgentWallet(null);
    setLastApiError(null);
    setStatusLine('IDLE');
    clearAuthTokens();
  }

  const value: PearContextValue = {
    accessToken,
    agentWallet,
    isAuthenticated: !!(accessToken && isConnected),
    isAuthenticating,
    error,
    lastApiError,
    statusLine,
    requiredChainId,
    runSetup,
    disconnect,
  };

  return <PearContext.Provider value={value}>{children}</PearContext.Provider>;
}

export function usePear() {
  const context = useContext(PearContext);
  if (!context) {
    throw new Error('usePear must be used within PearProvider');
  }
  return context;
}

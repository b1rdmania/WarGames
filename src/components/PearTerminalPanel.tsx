'use client';

import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { arbitrum } from 'wagmi/chains';
import { usePear } from '@/hooks/usePear';
import { PEAR_CONFIG } from '@/integrations/pear/config';
import toast from 'react-hot-toast';

export function PearTerminalPanel({
  onRequestConnect,
}: {
  onRequestConnect: () => void;
}) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { runSetup, disconnect, isAuthenticating, statusLine, lastApiError, agentWallet, isAuthenticated, requiredChainId } = usePear();

  return (
    <div className="bg-war-panel neon-border p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-war-green font-mono">[ PEAR TERMINAL ]</div>
          <div className="text-xs text-gray-500 mt-1">
            api={PEAR_CONFIG.apiUrl} clientId={PEAR_CONFIG.clientId} net={PEAR_CONFIG.network}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              disconnect();
              toast.success('Cleared Pear session');
            }}
            className="neon-border text-war-green px-3 py-2 text-xs hover:neon-glow"
          >
            RESET
          </button>
        </div>
      </div>

      <div className="mt-4 text-xs space-y-2">
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">WALLET</span>
          <span className="text-white">
            {isConnected && address ? `${address.slice(0, 6)}…${address.slice(-4)}` : 'DISCONNECTED'}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">CHAIN</span>
          <span className={`${chainId === arbitrum.id ? 'text-war-green' : 'text-yellow-400'}`}>
            {chainId === arbitrum.id ? `${chainId} (Arbitrum ✓)` : `${chainId}`}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">AUTH</span>
          <span className="text-white">{isAuthenticated ? 'OK' : 'NO'}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">AGENT WALLET</span>
          <span className="text-white">{agentWallet ? `${agentWallet.slice(0, 6)}…${agentWallet.slice(-4)}` : '—'}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">STATUS</span>
          <span className="text-war-green">{statusLine}</span>
        </div>
      </div>

      {lastApiError && (
        <div className="mt-4 border border-red-500/40 p-3 text-xs text-red-300">
          <div className="font-mono mb-1">
            ERROR {lastApiError.status} {lastApiError.endpoint}
          </div>
          <div>{lastApiError.message}</div>
        </div>
      )}

      {/* Keep users on Arbitrum (where Pear auth signing happens) */}
      {isConnected && chainId !== arbitrum.id && (
        <div className="mt-4 border border-yellow-500/40 p-3 text-xs text-yellow-200">
          <div className="font-mono mb-2">WRONG NETWORK</div>
          <div className="text-gray-200">
            Please switch to <span className="text-white font-bold">Arbitrum (chainId {arbitrum.id})</span> for Pear auth.
            You are currently on chainId <span className="text-white font-bold">{chainId}</span>.
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => {
                (async () => {
                  try {
                    if (!switchChainAsync) throw new Error('Wallet does not support chain switching');
                    await switchChainAsync({ chainId: arbitrum.id });
                    toast.success('Switched to Arbitrum');
                  } catch (e) {
                    console.error(e);
                    toast.error((e as Error).message || 'Failed to switch chain');
                  }
                })();
              }}
              className="bg-war-green text-war-dark font-bold px-3 py-2 text-xs hover:opacity-80"
            >
              SWITCH TO ARBITRUM
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {!isConnected ? (
          <button
            onClick={onRequestConnect}
            className="bg-war-green text-war-dark font-bold px-4 py-2 text-sm hover:opacity-80"
          >
            CONNECT
          </button>
        ) : (
          <button
            onClick={() => {
              runSetup(true).catch((e) => {
                console.error(e);
                toast.error((e as Error).message || 'Setup failed');
              });
            }}
            disabled={isAuthenticating}
            className="bg-war-green text-war-dark font-bold px-4 py-2 text-sm hover:opacity-80 disabled:opacity-50"
          >
            {isAuthenticating ? 'RUNNING…' : 'RUN SETUP'}
          </button>
        )}
      </div>

      <div className="mt-3 text-[11px] text-gray-500">
        Spec refs: `docs/pear-docs/AUTHENTICATION.md`, `docs/pear-docs/AGENT_WALLET.md`
      </div>
    </div>
  );
}


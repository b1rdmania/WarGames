'use client';

import { usePear } from '@/contexts/PearContext';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { hyperEVM } from '@/lib/wagmi';

// Known chain names for display
const CHAIN_NAMES: Record<number, string> = {
  1: 'Ethereum',
  42161: 'Arbitrum',
  8453: 'Base',
  10: 'Optimism',
  999: 'HyperEVM',
  14601: 'HyperEVM',
};

export function PearSetupCard({
  variant = 'default',
}: {
  variant?: 'default' | 'portfolio' | 'trade';
}) {
  const { address, isConnected } = useAccount();
  const { runSetup, isAuthenticating, statusLine, agentWallet, error, lastApiError } = usePear();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const isOnHyperEVM = chainId === 999 || chainId === 14601;
  const chainName = CHAIN_NAMES[chainId] || `Chain ${chainId}`;
  const isCompact = variant === 'portfolio';
  const showHyperEvmRecommend = variant !== 'portfolio';
  const hasError = Boolean(error || lastApiError || statusLine === 'ERROR');

  return (
    <div className="pear-border bg-black/40 p-6">
      <div className="space-y-6">
        {isCompact ? (
          <div className="space-y-2">
            <div className="text-sm font-mono text-gray-300">[ PORTFOLIO ACCESS ]</div>
            <div className="text-sm font-mono text-gray-400 leading-relaxed">
              Authenticate with Pear to show your trading portfolio. This is a hackathon build — quick, loud, and a bit feral.
            </div>
            {hasError ? (
              <div className="text-xs font-mono text-red-300">
                ERROR. Open Advanced for details.
              </div>
            ) : null}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm font-mono text-gray-300">[ SETUP STATUS ]</div>
              {isAuthenticating && <div className="w-2 h-2 bg-pear-lime rounded-full animate-pulse" />}
            </div>

            <div className="font-mono text-sm text-gray-400">
              {isAuthenticating ? (
                <span className="text-pear-lime">Authenticating…</span>
              ) : statusLine && statusLine !== 'IDLE' && statusLine !== 'READY' ? (
                statusLine
              ) : (
                'Ready to authenticate'
              )}
            </div>
          </>
        )}

        {!isCompact || advancedOpen ? (
          <>
            {/* Info cards */}
            <div className="pear-border bg-black/20">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-4 border-b md:border-b-0 md:border-r border-pear-lime/20">
                  <div className="text-xs font-mono text-gray-500 mb-2">YOUR WALLET</div>
                  <div className="text-sm text-white font-mono">
                    {address ? `${address.slice(0, 8)}...${address.slice(-6)}` : '—'}
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-xs font-mono text-gray-500 mb-2">AGENT WALLET</div>
                  <div className="text-sm text-white font-mono">
                    {agentWallet ? (
                      `${agentWallet.slice(0, 8)}...${agentWallet.slice(-6)}`
                    ) : (
                      <span className="text-gray-500">Not created yet</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Helper text */}
            <div className="pear-border bg-black/20 p-4">
              <p className="text-sm text-gray-400 leading-relaxed">
                Sign a message to create your trading session with Pear Protocol. Your agent wallet will be created automatically.
              </p>
              <div className="mt-2 text-xs font-mono text-gray-500">
                Detected chainId: <span className="text-white">{chainId}</span>
                {isOnHyperEVM ? (
                  <span className="text-pear-lime"> ({chainName} ✓)</span>
                ) : (
                  <span className="text-gray-400"> ({chainName})</span>
                )}
              </div>
              {(error || lastApiError) ? (
                <div className="mt-2 text-xs font-mono text-red-300 whitespace-pre-wrap">
                  {(lastApiError ? `${lastApiError.status} ${lastApiError.endpoint}: ${lastApiError.message}` : error?.message) ?? ''}
                </div>
              ) : null}
            </div>

            {showHyperEvmRecommend && isConnected && !isOnHyperEVM ? (
              <div className="border border-pear-lime/30 p-4 text-xs text-gray-300">
                <div className="font-mono mb-2 text-pear-lime">RECOMMENDED: HYPEREVM</div>
                <div className="text-gray-400">
                  For the best experience, switch to <span className="text-white font-bold">HyperEVM</span>.
                </div>
                <div className="mt-3">
                  <button
                    type="button"
                    className="tm-btn"
                    onClick={() => {
                      (async () => {
                        try {
                          if (!switchChainAsync) throw new Error('Wallet does not support chain switching');
                          await switchChainAsync({ chainId: hyperEVM.id });
                          toast.success('Switched to HyperEVM');
                        } catch (e) {
                          console.error(e);
                          toast.error((e as Error).message || 'Failed to switch - add HyperEVM to your wallet');
                        }
                      })();
                    }}
                  >
                    SWITCH TO HYPEREVM
                  </button>
                </div>
              </div>
            ) : null}
          </>
        ) : null}

        {/* Action button */}
        <button
          onClick={() => {
            runSetup(true).catch((e) => {
              console.error(e);
              toast.error((e as Error).message || 'Setup failed');
            });
          }}
          disabled={isAuthenticating || !isConnected}
          className="w-full tm-btn disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAuthenticating ? (
            'AUTHENTICATING…'
          ) : (
            'AUTHENTICATE WITH PEAR'
          )}
        </button>

        {isCompact ? (
          <button
            type="button"
            className="tm-btn w-full text-[10px] text-gray-300"
            onClick={() => setAdvancedOpen((v) => !v)}
          >
            {advancedOpen ? 'HIDE ADVANCED' : 'ADVANCED'}
          </button>
        ) : null}
      </div>
    </div>
  );
}

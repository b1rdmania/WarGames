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
    <div className="tm-box">
      <div className="space-y-6">
        {isCompact ? (
          <div className="space-y-2">
            <div className="text-sm font-semibold text-brand-amber">Portfolio Access</div>
            <div className="text-sm text-text-secondary leading-relaxed">
              Authenticate with Pear to show your trading portfolio. This is a hackathon build — quick, loud, and a bit feral.
            </div>
            {hasError ? (
              <div className="text-xs font-mono text-status-loss">
                ERROR. Open Advanced for details.
              </div>
            ) : null}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm font-semibold text-brand-amber">Setup Status</div>
              {isAuthenticating && <div className="w-2 h-2 bg-brand-amber rounded-full animate-pulse" />}
            </div>

            <div className="text-sm text-text-secondary">
              {isAuthenticating ? (
                <span className="text-brand-amber">Authenticating…</span>
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
            <div className="border border-border rounded-md overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-4 border-b md:border-b-0 md:border-r border-border-subtle">
                  <div className="tm-k mb-2">Your Wallet</div>
                  <div className="text-sm text-text-primary font-mono">
                    {address ? `${address.slice(0, 8)}...${address.slice(-6)}` : '—'}
                  </div>
                </div>
                <div className="p-4">
                  <div className="tm-k mb-2">Agent Wallet</div>
                  <div className="text-sm text-text-primary font-mono">
                    {agentWallet ? (
                      `${agentWallet.slice(0, 8)}...${agentWallet.slice(-6)}`
                    ) : (
                      <span className="text-text-muted">Not created yet</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Helper text */}
            <div className="border border-border rounded-md p-4">
              <p className="text-sm text-text-secondary leading-relaxed">
                Sign a message to create your trading session with Pear Protocol. Your agent wallet will be created automatically.
              </p>
              <div className="mt-2 text-xs font-mono text-text-muted">
                Detected chainId: <span className="text-text-primary">{chainId}</span>
                {isOnHyperEVM ? (
                  <span className="text-brand-amber"> ({chainName} ✓)</span>
                ) : (
                  <span className="text-text-muted"> ({chainName})</span>
                )}
              </div>
              {(error || lastApiError) ? (
                <div className="mt-2 text-xs font-mono text-status-loss whitespace-pre-wrap">
                  {(lastApiError ? `${lastApiError.status} ${lastApiError.endpoint}: ${lastApiError.message}` : error?.message) ?? ''}
                </div>
              ) : null}
            </div>

            {showHyperEvmRecommend && isConnected && !isOnHyperEVM ? (
              <div className="border border-brand-amber/30 rounded-md p-4">
                <div className="font-semibold text-sm mb-2 text-brand-amber">Recommended: HyperEVM</div>
                <div className="text-sm text-text-secondary">
                  For the best experience, switch to <span className="text-text-primary font-semibold">HyperEVM</span>.
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
                    Switch to HyperEVM
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
          className="w-full tm-btn tm-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAuthenticating ? (
            'Authenticating…'
          ) : (
            'Authenticate with Pear'
          )}
        </button>

        {isCompact ? (
          <button
            type="button"
            className="tm-btn w-full text-xs text-text-secondary"
            onClick={() => setAdvancedOpen((v) => !v)}
          >
            {advancedOpen ? 'Hide Advanced' : 'Advanced'}
          </button>
        ) : null}
      </div>
    </div>
  );
}

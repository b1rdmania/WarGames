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

type StatusState = 'ready' | 'authing' | 'error';

function StatusPill({ status }: { status: StatusState }) {
  const styles = {
    ready: 'bg-profit/15 text-profit',
    authing: 'bg-primary/15 text-primary',
    error: 'bg-loss/15 text-loss',
  };
  const labels = {
    ready: 'Ready',
    authing: 'Authenticating',
    error: 'Error',
  };

  return (
    <span className={`px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide rounded ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function WalletStat({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="bg-bg-surface/60 rounded-md px-3 py-2.5">
      <div className="text-[11px] uppercase tracking-wide text-text-muted mb-1">{label}</div>
      <div className="text-sm font-medium text-text-primary font-mono">
        {value || <span className="text-text-muted">—</span>}
      </div>
    </div>
  );
}

export function PearSetupCard({
  variant = 'default',
}: {
  variant?: 'default' | 'portfolio' | 'trade';
}) {
  const { address, isConnected } = useAccount();
  const { runSetup, isAuthenticating, statusLine, agentWallet, error, lastApiError } = usePear();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const [showDetails, setShowDetails] = useState(false);

  const isOnHyperEVM = chainId === 999 || chainId === 14601;
  const chainName = CHAIN_NAMES[chainId] || `Chain ${chainId}`;
  const isCompact = variant === 'portfolio';
  const hasError = Boolean(error || lastApiError || statusLine === 'ERROR');

  // Determine status
  const status: StatusState = isAuthenticating ? 'authing' : hasError ? 'error' : 'ready';

  // Format addresses
  const formatAddr = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  // Build error message
  const errorMessage = lastApiError
    ? `${lastApiError.status} ${lastApiError.endpoint}: ${lastApiError.message}`
    : error?.message || null;

  return (
    <div className="tm-box">
      {/* Header: Title + Status Pill */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="text-sm font-semibold text-text-primary">
          {isCompact ? 'Portfolio Access' : 'Pear Setup'}
        </div>
        <StatusPill status={status} />
      </div>

      {/* Wallet Stats Row */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <WalletStat
          label="Your wallet"
          value={address ? formatAddr(address) : null}
        />
        <WalletStat
          label="Agent wallet"
          value={agentWallet ? formatAddr(agentWallet) : null}
        />
      </div>

      {/* Guidance + Chain Info */}
      <div className="border-t border-border-subtle pt-4 mb-4">
        <p className="text-sm text-text-secondary leading-relaxed">
          Sign once to create your trading session.
          {!isOnHyperEVM && isConnected && (
            <span className="text-text-muted"> For best results, switch to HyperEVM.</span>
          )}
        </p>
        <p className="text-[11px] text-text-muted mt-2">
          Connected to {chainName}
          {isOnHyperEVM && <span className="text-profit ml-1">✓</span>}
        </p>
      </div>

      {/* Error Details (collapsible) */}
      {hasError && (
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-[11px] text-text-muted hover:text-text-secondary transition-colors"
          >
            {showDetails ? '▾ Hide details' : '▸ Show details'}
          </button>
          {showDetails && errorMessage && (
            <div className="mt-2 p-3 bg-loss/10 rounded-md">
              <p className="text-xs font-mono text-loss/90 break-all">{errorMessage}</p>
            </div>
          )}
        </div>
      )}

      {/* Actions Row */}
      <div className="flex gap-3">
        <button
          onClick={() => {
            runSetup(true).catch((e) => {
              console.error(e);
              toast.error((e as Error).message || 'Setup failed');
            });
          }}
          disabled={isAuthenticating || !isConnected}
          className="flex-1 tm-btn tm-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAuthenticating ? 'Authenticating...' : 'Authenticate'}
        </button>

        {!isOnHyperEVM && isConnected && (
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
                  toast.error((e as Error).message || 'Failed to switch');
                }
              })();
            }}
          >
            Switch Chain
          </button>
        )}
      </div>
    </div>
  );
}

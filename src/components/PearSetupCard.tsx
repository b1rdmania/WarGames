'use client';

import { usePear } from '@/contexts/PearContext';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { hyperEVM } from '@/lib/wagmi';
import { getHyperliquidOnboardingUrl } from '@/integrations/pear/links';
import styles from './PearSetupCard.module.css';

const CHAIN_NAMES: Record<number, string> = {
  1: 'Ethereum',
  42161: 'Arbitrum',
  8453: 'Base',
  10: 'Optimism',
  999: 'HyperEVM',
  14601: 'HyperEVM',
};

type StatusState = 'ready' | 'authing' | 'error';

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

  const status: StatusState = isAuthenticating ? 'authing' : hasError ? 'error' : 'ready';

  const formatAddr = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const errorMessage = lastApiError
    ? `${lastApiError.status} ${lastApiError.endpoint}: ${lastApiError.message}`
    : error?.message || null;

  const statusStyles = {
    ready: styles.statusReady,
    authing: styles.statusAuthing,
    error: styles.statusError,
  };

  const statusLabels = {
    ready: 'READY',
    authing: 'AUTHENTICATING',
    error: 'ERROR',
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>
          {isCompact ? 'Portfolio Access' : 'Pear Setup'}
        </div>
        <span className={`${styles.statusPill} ${statusStyles[status]}`}>
          {statusLabels[status]}
        </span>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statBox}>
          <div className={styles.statLabel}>Your Wallet</div>
          <div className={styles.statValue}>
            {address ? formatAddr(address) : <span className={styles.statEmpty}>—</span>}
          </div>
        </div>
        <div className={styles.statBox}>
          <div className={styles.statLabel}>Agent Wallet</div>
          <div className={styles.statValue}>
            {agentWallet ? formatAddr(agentWallet) : <span className={styles.statEmpty}>—</span>}
          </div>
        </div>
      </div>

      <div className={styles.guidance}>
        <p className={styles.guidanceText}>
          Sign once to create your trading session.
          {!isOnHyperEVM && isConnected && (
            <span className={styles.guidanceHint}> For best results, switch to HyperEVM.</span>
          )}
        </p>
        <p className={styles.chainInfo}>
          First trade only: approve agent wallet on Hyperliquid to activate execution.
        </p>
        <p className={styles.chainInfo}>
          Connected to {chainName}
          {isOnHyperEVM && <span className={styles.chainOk}>✓</span>}
        </p>
      </div>

      {hasError && (
        <div>
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className={styles.errorToggle}
          >
            {showDetails ? '▾ Hide details' : '▸ Show details'}
          </button>
          {showDetails && errorMessage && (
            <div className={styles.errorBox}>
              <p className={styles.errorText}>{errorMessage}</p>
            </div>
          )}
        </div>
      )}

      <div className={styles.actions}>
        <button
          onClick={() => {
            runSetup(true).catch((e) => {
              console.error(e);
              toast.error((e as Error).message || 'Setup failed');
            });
          }}
          disabled={isAuthenticating || !isConnected}
          className={styles.btnPrimary}
        >
          {isAuthenticating ? 'Authenticating...' : 'Authenticate'}
        </button>

        {!isOnHyperEVM && isConnected && (
          <button
            type="button"
            className={styles.btnSecondary}
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
        <a
          href={getHyperliquidOnboardingUrl()}
          target="_blank"
          rel="noreferrer"
          className={styles.btnSecondary}
        >
          Open Hyperliquid (Referral)
        </a>
      </div>
    </div>
  );
}

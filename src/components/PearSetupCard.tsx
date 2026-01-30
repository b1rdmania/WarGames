'use client';

import { usePear } from '@/contexts/PearContext';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { hyperEVM } from '@/lib/wagmi';

const CHAIN_NAMES: Record<number, string> = {
  1: 'ETHEREUM',
  42161: 'ARBITRUM',
  8453: 'BASE',
  10: 'OPTIMISM',
  999: 'HYPEREVM',
  14601: 'HYPEREVM',
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
  const chainName = CHAIN_NAMES[chainId] || `CHAIN ${chainId}`;
  const isCompact = variant === 'portfolio';
  const showHyperEvmRecommend = variant !== 'portfolio';
  const hasError = Boolean(error || lastApiError || statusLine === 'ERROR');

  return (
    <div className="panel">
      <div className="panel-header">PEAR AUTHENTICATION</div>

      {/* Status */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', color: isAuthenticating ? 'var(--amber)' : hasError ? 'var(--red)' : 'var(--text-secondary)' }}>
            {isAuthenticating ? 'AUTHENTICATING...' : hasError ? 'ERROR' : statusLine && statusLine !== 'IDLE' && statusLine !== 'READY' ? statusLine : 'READY'}
          </span>
          {isAuthenticating && (
            <span style={{ width: '6px', height: '6px', background: 'var(--amber)', animation: 'pulse 1s infinite' }} />
          )}
        </div>
      </div>

      {(!isCompact || advancedOpen) && (
        <>
          {/* Wallet Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--border)', marginBottom: '16px' }}>
            <div style={{ padding: '12px', background: 'var(--bg-input)' }}>
              <div className="label" style={{ marginBottom: '4px' }}>YOUR WALLET</div>
              <div style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
                {address ? `${address.slice(0, 8)}...${address.slice(-6)}` : '—'}
              </div>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-input)' }}>
              <div className="label" style={{ marginBottom: '4px' }}>AGENT WALLET</div>
              <div style={{ fontSize: '12px', color: agentWallet ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {agentWallet ? `${agentWallet.slice(0, 8)}...${agentWallet.slice(-6)}` : 'NOT CREATED'}
              </div>
            </div>
          </div>

          {/* Chain Info */}
          <div style={{ padding: '12px', background: 'var(--bg-input)', border: '1px solid var(--border)', marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
              CHAIN: <span style={{ color: isOnHyperEVM ? 'var(--green)' : 'var(--text-primary)' }}>{chainName}</span>
              {isOnHyperEVM && <span style={{ color: 'var(--green)' }}> ✓</span>}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Sign message to create trading session. Agent wallet created automatically.
            </div>
          </div>

          {/* Error Display */}
          {(error || lastApiError) && (
            <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--red-dim)', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--red)', wordBreak: 'break-word' }}>
                {lastApiError ? `${lastApiError.status} ${lastApiError.endpoint}: ${lastApiError.message}` : error?.message}
              </div>
            </div>
          )}

          {/* HyperEVM Recommendation */}
          {showHyperEvmRecommend && isConnected && !isOnHyperEVM && (
            <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid var(--amber-dim)', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--amber)', marginBottom: '8px' }}>
                RECOMMENDED: SWITCH TO HYPEREVM
              </div>
              <button
                type="button"
                onClick={() => {
                  (async () => {
                    try {
                      if (!switchChainAsync) throw new Error('CHAIN SWITCH NOT SUPPORTED');
                      await switchChainAsync({ chainId: hyperEVM.id });
                      toast.success('SWITCHED TO HYPEREVM');
                    } catch (e) {
                      console.error(e);
                      toast.error((e as Error).message || 'SWITCH FAILED');
                    }
                  })();
                }}
                style={{
                  padding: '8px 12px',
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  background: 'transparent',
                  border: '1px solid var(--amber)',
                  color: 'var(--amber)',
                  cursor: 'pointer',
                }}
              >
                SWITCH CHAIN
              </button>
            </div>
          )}
        </>
      )}

      {/* Auth Button */}
      <button
        onClick={() => {
          runSetup(true).catch((e) => {
            console.error(e);
            toast.error((e as Error).message || 'SETUP FAILED');
          });
        }}
        disabled={isAuthenticating || !isConnected}
        className="btn btn-primary"
        style={{ width: '100%', padding: '12px', opacity: isAuthenticating || !isConnected ? 0.5 : 1 }}
      >
        {isAuthenticating ? 'AUTHENTICATING...' : 'AUTHENTICATE WITH PEAR'}
      </button>

      {/* Advanced Toggle (compact mode) */}
      {isCompact && (
        <button
          type="button"
          onClick={() => setAdvancedOpen((v) => !v)}
          style={{
            width: '100%',
            marginTop: '8px',
            padding: '8px',
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '0.06em',
            background: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          {advancedOpen ? 'HIDE DETAILS' : 'SHOW DETAILS'}
        </button>
      )}
    </div>
  );
}

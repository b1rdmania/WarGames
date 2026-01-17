'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAccount } from 'wagmi';
import { usePear } from '@/hooks/usePear';
import { PositionsPanel } from '@/components/PositionsPanel';
import { BalancesPanel } from '@/components/BalancesPanel';
import { useVaultBalances } from '@/hooks/useVaultBalances';
import { useValidatedMarkets } from '@/hooks/useValidatedMarkets';
import { WalletConnectModal } from '@/components/WalletConnectModal';
import { PearTerminalPanel } from '@/components/PearTerminalPanel';
import { TradeTerminal } from '@/components/TradeTerminal';
import { MARKETS } from '@/integrations/pear/markets';
import { DebugConsole } from '@/components/DebugConsole';

export default function MarketsPage() {
  const { isConnected } = useAccount();
  const { accessToken, isAuthenticated, isAuthenticating, authenticate } = usePear();
  const { perpUsdc } = useVaultBalances(accessToken);
  const { markets: validatedMarkets } = useValidatedMarkets();
  const [positionsRefreshKey, setPositionsRefreshKey] = useState(0);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  const effectiveMarkets = validatedMarkets?.length ? validatedMarkets : MARKETS;

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold neon-text mb-2">Markets</h1>
          <p className="text-sm text-gray-400">
            {isAuthenticated ? 'Select a market and place your bet' : 'Connect wallet to start trading'}
          </p>
        </div>
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="text-xs neon-border px-3 py-2 text-gray-400 hover:text-war-green"
        >
          {showDebug ? '[ HIDE DEBUG ]' : '[ SHOW DEBUG ]'}
        </button>
      </div>

      {/* Debug Panels (Collapsible) */}
      {showDebug && (
        <div className="mb-6 space-y-4 border-l-2 border-war-green/30 pl-4">
          <PearTerminalPanel onRequestConnect={() => setConnectModalOpen(true)} />
          <DebugConsole />
          {isAuthenticated && <BalancesPanel accessToken={accessToken} />}
        </div>
      )}

      {/* Main Content */}
      {isAuthenticated ? (
        <div className="space-y-8">
          {/* Active Positions */}
          {accessToken && (
            <div>
              <h2 className="text-xl font-bold text-war-green mb-4">Your Active Positions</h2>
              <PositionsPanel accessToken={accessToken} refreshKey={positionsRefreshKey} />
            </div>
          )}

          {/* Place Bet */}
          <div>
            <h2 className="text-xl font-bold text-war-green mb-4">Place New Bet</h2>
            {accessToken && (
              <TradeTerminal
                accessToken={accessToken}
                markets={effectiveMarkets}
                perpUsdc={perpUsdc}
                onPlaced={() => setPositionsRefreshKey((k) => k + 1)}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="bg-war-panel neon-border p-12 text-center">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold neon-text mb-4">Get Started</h2>
            <p className="text-gray-400 mb-6">
              Connect your wallet and authenticate to start trading narrative markets
            </p>
            {!isConnected ? (
              <button
                onClick={() => setConnectModalOpen(true)}
                className="bg-war-green text-war-dark font-bold px-8 py-3 text-lg hover:opacity-80"
              >
                CONNECT WALLET
              </button>
            ) : (
              <div className="text-sm text-gray-500">
                <p className="mb-4">Wallet connected! Click "SHOW DEBUG" above, then "RUN SETUP" to authenticate.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <WalletConnectModal isOpen={connectModalOpen} onClose={() => setConnectModalOpen(false)} />
    </main>
  );
}

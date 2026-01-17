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
  const { accessToken, isAuthenticated } = usePear();
  const { perpUsdc } = useVaultBalances(accessToken);
  const { markets: validatedMarkets } = useValidatedMarkets();
  const [positionsRefreshKey, setPositionsRefreshKey] = useState(0);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  const effectiveMarkets = validatedMarkets?.length ? validatedMarkets : MARKETS;

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Debug Toggle */}
          <div className="mb-4 text-right">
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="text-xs px-3 py-1 border border-gray-700 text-gray-400 hover:text-war-green hover:border-war-green"
            >
              {showDebug ? 'HIDE DEBUG' : 'SHOW DEBUG'}
            </button>
          </div>

          {/* Debug Panel */}
          {showDebug && (
            <div className="mb-6 space-y-4">
              <PearTerminalPanel onRequestConnect={() => setConnectModalOpen(true)} />
              <DebugConsole />
            </div>
          )}

          {/* Welcome Card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-lg p-12 text-center shadow-2xl">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              WAR.MARKET
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Trade narrative markets with leverage
            </p>

            {!isConnected ? (
              <div>
                <p className="text-gray-400 mb-6">
                  Connect your wallet to start trading
                </p>
                <button
                  onClick={() => setConnectModalOpen(true)}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg"
                >
                  Connect Wallet
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-400 mb-4">
                  Wallet connected! Now authenticate with Pear Protocol.
                </p>
                <button
                  onClick={() => setShowDebug(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-lg text-lg transition-colors"
                >
                  Show Setup Panel
                </button>
              </div>
            )}
          </div>
        </div>
        <WalletConnectModal isOpen={connectModalOpen} onClose={() => setConnectModalOpen(false)} />
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Markets</h1>
          <p className="text-gray-400">Manage your positions and place new bets</p>
        </div>
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="text-xs px-4 py-2 border border-gray-700 text-gray-400 hover:text-war-green hover:border-war-green rounded"
        >
          {showDebug ? 'HIDE DEBUG' : 'SHOW DEBUG'}
        </button>
      </div>

      {/* Debug Panels */}
      {showDebug && (
        <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-900 border border-gray-700 rounded-lg">
          <PearTerminalPanel onRequestConnect={() => setConnectModalOpen(true)} />
          <div className="space-y-4">
            <BalancesPanel accessToken={accessToken} />
            <DebugConsole />
          </div>
        </div>
      )}

      {/* Main Content: 2 Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Active Positions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Active Positions
            </h2>
            {accessToken && <PositionsPanel accessToken={accessToken} refreshKey={positionsRefreshKey} />}
          </div>
        </div>

        {/* Right: Place Bet */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border border-green-700/30 rounded-lg p-6 sticky top-6">
            <h2 className="text-xl font-bold text-green-400 mb-4">Place New Bet</h2>
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
      </div>

      <WalletConnectModal isOpen={connectModalOpen} onClose={() => setConnectModalOpen(false)} />
    </main>
  );
}

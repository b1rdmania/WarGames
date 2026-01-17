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
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          {/* Welcome Card */}
          <div className="bg-gradient-to-br from-pear-panel to-pear-panel-light border border-pear-lime/30 rounded-2xl p-12 text-center shadow-2xl">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pear-lime to-pear-lime-light bg-clip-text text-transparent">
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
                  className="bg-pear-lime hover:bg-pear-lime-light text-pear-dark font-bold px-8 py-4 rounded-lg text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Connect Wallet
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-400 mb-2">
                  Wallet connected! Now authenticate with Pear Protocol.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Click below to sign a message and create your trading session
                </p>
                <button
                  onClick={() => setShowDebug(true)}
                  className="bg-pear-lime hover:bg-pear-lime-light text-pear-dark font-bold px-8 py-4 rounded-lg text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Authenticate
                </button>
              </div>
            )}
          </div>

          {/* Debug toggle - subtle, bottom right */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="text-xs text-gray-600 hover:text-pear-lime transition-colors"
            >
              {showDebug ? '▼ Hide Debug' : '▲ Show Debug'}
            </button>
          </div>

          {/* Debug Panel - slides in */}
          {showDebug && (
            <div className="mt-6 space-y-4 animate-in slide-in-from-bottom">
              <PearTerminalPanel onRequestConnect={() => setConnectModalOpen(true)} />
              <DebugConsole />
            </div>
          )}
        </div>
        <WalletConnectModal isOpen={connectModalOpen} onClose={() => setConnectModalOpen(false)} />
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto p-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Markets</h1>
          <p className="text-gray-400">Manage your positions and place new bets</p>
        </div>
      </div>

      {/* Main Content: 2 Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Active Positions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-pear-lime rounded-full animate-pulse"></span>
              Active Positions
            </h2>
            {accessToken && <PositionsPanel accessToken={accessToken} refreshKey={positionsRefreshKey} />}
          </div>
        </div>

        {/* Right: Place Bet */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-pear-panel to-pear-panel-light border border-pear-lime/30 rounded-lg p-6 sticky top-6">
            <h2 className="text-xl font-bold text-pear-lime mb-4">Place New Bet</h2>
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

      {/* Debug Drawer - Fixed to bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        {showDebug && (
          <div className="bg-pear-panel border-t border-pear-lime/30 shadow-2xl animate-in slide-in-from-bottom">
            <div className="max-w-7xl mx-auto p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <PearTerminalPanel onRequestConnect={() => setConnectModalOpen(true)} />
                <div className="space-y-4">
                  <BalancesPanel accessToken={accessToken} />
                  <DebugConsole />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Debug Toggle - Floating Button */}
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="absolute bottom-4 right-4 bg-pear-panel border border-pear-lime/30 text-pear-lime px-4 py-2 rounded-full text-xs hover:bg-pear-panel-light transition-all shadow-lg"
        >
          {showDebug ? '▼ Hide Debug' : '▲ Debug'}
        </button>
      </div>

      <WalletConnectModal isOpen={connectModalOpen} onClose={() => setConnectModalOpen(false)} />
    </main>
  );
}

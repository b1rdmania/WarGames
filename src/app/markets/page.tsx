'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { usePear } from '@/hooks/usePear';
import { useVaultBalances } from '@/hooks/useVaultBalances';
import { useValidatedMarkets } from '@/hooks/useValidatedMarkets';
import { WalletConnectModal } from '@/components/WalletConnectModal';
import { PearSetupCard } from '@/components/PearSetupCard';
import { TradingPanel } from '@/components/TradingPanel';
import { PositionCard } from '@/components/PositionCard';
import { MARKETS } from '@/integrations/pear/markets';
import { getActivePositions } from '@/integrations/pear/positions';
import type { PearPosition } from '@/integrations/pear/types';

export default function MarketsPage() {
  const { isConnected } = useAccount();
  const { accessToken, isAuthenticated } = usePear();
  const { perpUsdc } = useVaultBalances(accessToken);
  const { markets: validatedMarkets } = useValidatedMarkets();
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [positions, setPositions] = useState<PearPosition[]>([]);
  const [loadingPositions, setLoadingPositions] = useState(false);

  const effectiveMarkets = validatedMarkets?.length ? validatedMarkets : MARKETS;

  // Load positions
  useEffect(() => {
    if (!accessToken) return;

    const loadPositions = async () => {
      setLoadingPositions(true);
      try {
        const pos = await getActivePositions(accessToken);
        setPositions(pos);
      } catch (err) {
        console.error('Failed to load positions:', err);
      } finally {
        setLoadingPositions(false);
      }
    };

    loadPositions();
    const interval = setInterval(loadPositions, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, [accessToken]);

  // Unauthenticated view
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-xl w-full space-y-8">
          {/* Welcome */}
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-3">
              WAR.MARKET
            </h1>
            <p className="text-lg text-gray-400">
              Trade narrative markets with leverage
            </p>
          </div>

          {/* Auth card */}
          {!isConnected ? (
            <div className="bg-gradient-to-br from-pear-panel via-pear-panel-light to-pear-panel rounded-2xl p-8 border border-pear-lime/20 text-center">
              <p className="text-gray-300 mb-6">
                Connect your wallet to start trading
              </p>
              <button
                onClick={() => setConnectModalOpen(true)}
                className="bg-pear-lime hover:bg-pear-lime-light text-pear-dark font-bold px-8 py-4 rounded-lg text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 w-full"
              >
                Connect Wallet
              </button>
            </div>
          ) : (
            <PearSetupCard />
          )}
        </div>
        <WalletConnectModal isOpen={connectModalOpen} onClose={() => setConnectModalOpen(false)} />
      </main>
    );
  }

  // Authenticated view
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Markets</h1>
          <p className="text-gray-400">Manage your positions and place new bets</p>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Positions */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-pear-lime rounded-full animate-pulse" />
                Active Positions
              </h2>

              {loadingPositions ? (
                <div className="bg-pear-panel-light border border-pear-lime/20 rounded-xl p-12 text-center">
                  <div className="w-8 h-8 border-2 border-pear-lime border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-400">Loading positions...</p>
                </div>
              ) : positions.length === 0 ? (
                <div className="bg-pear-panel-light border border-pear-lime/20 rounded-xl p-12 text-center">
                  <p className="text-gray-400 mb-2">No active positions</p>
                  <p className="text-sm text-gray-500">Place your first bet to get started</p>
                </div>
              ) : accessToken ? (
                <div className="space-y-4">
                  {positions.map((pos) => (
                    <PositionCard
                      key={pos.id}
                      position={pos}
                      accessToken={accessToken}
                      onClose={() => {
                        // Refresh positions
                        getActivePositions(accessToken).then(setPositions);
                      }}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {/* Right: Trading */}
          <div className="lg:col-span-1">
            {accessToken && (
              <TradingPanel
                accessToken={accessToken}
                markets={effectiveMarkets}
                balance={perpUsdc}
                onPlaced={() => {
                  // Refresh positions
                  getActivePositions(accessToken).then(setPositions);
                }}
              />
            )}
          </div>
        </div>
      </div>

      <WalletConnectModal isOpen={connectModalOpen} onClose={() => setConnectModalOpen(false)} />
    </main>
  );
}

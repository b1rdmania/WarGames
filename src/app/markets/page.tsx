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

  // Debug logging
  console.log('MarketsPage:', { isAuthenticated, accessToken: !!accessToken, isConnected });

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
      <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-pear-dark via-pear-dark to-pear-panel">
        <div className="max-w-2xl w-full space-y-10">
          {/* Welcome */}
          <div className="text-center space-y-4">
            <h1 className="text-6xl font-bold text-white mb-4">
              WAR.MARKET
            </h1>
            <p className="text-xl text-gray-300">
              Trade narrative markets with leverage
            </p>
          </div>

          {/* Auth card */}
          {!isConnected ? (
            <div className="bg-gradient-to-br from-pear-panel via-pear-panel-light to-pear-panel rounded-2xl p-10 border border-pear-lime/30 shadow-2xl text-center space-y-6">
              <p className="text-lg text-gray-300">
                Connect your wallet to start trading
              </p>
              <button
                onClick={() => setConnectModalOpen(true)}
                className="bg-pear-lime hover:bg-pear-lime-light text-pear-dark font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 w-full"
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
    <main className="min-h-screen p-6 bg-gradient-to-b from-pear-dark via-pear-dark to-pear-panel/50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">Markets</h1>
          <p className="text-lg text-gray-300">Manage your positions and place new bets</p>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Positions */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-pear-lime rounded-full animate-pulse shadow-lg shadow-pear-lime/50" />
                Active Positions
              </h2>

              {loadingPositions ? (
                <div className="bg-gradient-to-br from-pear-panel-light to-pear-panel border border-pear-lime/20 rounded-2xl p-16 text-center">
                  <div className="w-12 h-12 border-3 border-pear-lime border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                  <p className="text-lg text-gray-300">Loading positions...</p>
                </div>
              ) : positions.length === 0 ? (
                <div className="bg-gradient-to-br from-pear-panel-light to-pear-panel border border-pear-lime/20 rounded-2xl p-16 text-center space-y-3">
                  <div className="text-5xl mb-4">📊</div>
                  <p className="text-xl text-gray-300 font-semibold">No active positions</p>
                  <p className="text-base text-gray-400">Place your first bet to get started →</p>
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

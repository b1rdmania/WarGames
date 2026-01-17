'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAccount } from 'wagmi';
import { usePear } from '@/hooks/usePear';
import { executePosition } from '@/integrations/pear/positions';
import { MarketCard } from '@/components/MarketCard';
import { BetModal } from '@/components/BetModal';
import { PositionsPanel } from '@/components/PositionsPanel';
import { BalancesPanel } from '@/components/BalancesPanel';
import { useVaultBalances } from '@/hooks/useVaultBalances';
import { useValidatedMarkets } from '@/hooks/useValidatedMarkets';
import type { ResolvedPairs } from '@/integrations/pear/types';
import { WalletConnectModal } from '@/components/WalletConnectModal';
import { PearTerminalPanel } from '@/components/PearTerminalPanel';

export default function MarketsPage() {
  const { isConnected } = useAccount();
  const { accessToken, isAuthenticated, isAuthenticating, authenticate } = usePear();
  const { perpUsdc } = useVaultBalances(accessToken);
  const { markets: validatedMarkets } = useValidatedMarkets();
  const [positionsRefreshKey, setPositionsRefreshKey] = useState(0);
  const [connectModalOpen, setConnectModalOpen] = useState(false);

  const [betModalOpen, setBetModalOpen] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null);
  const [selectedSide, setSelectedSide] = useState<'long' | 'short' | null>(null);
  const [selectedResolvedPairs, setSelectedResolvedPairs] = useState<ResolvedPairs | null>(null);
  const [activeTab, setActiveTab] = useState<'geopolitical' | 'tech' | 'all'>('all');

  const handleBet = (marketId: string, side: 'long' | 'short', resolvedPairs?: ResolvedPairs) => {
    if (!isAuthenticated) {
      if (!isConnected) {
        setConnectModalOpen(true);
        return;
      }
      // Fix #1: Show user-friendly error messages
      authenticate().catch(err => {
        console.error('Auth failed:', err);
        // Check if user rejected signature
        if (err.message?.includes('User rejected') || err.message?.includes('denied')) {
          toast.error('Signature rejected. Please try again.');
        } else if (err.message?.includes('Wallet not connected')) {
          toast.error('Please connect your wallet first.');
        } else {
          toast.error(err.message || 'Authentication failed. Please try again.');
        }
      });
      return;
    }

    setSelectedMarket(marketId);
    setSelectedSide(side);
    setSelectedResolvedPairs(resolvedPairs ?? null);
    setBetModalOpen(true);
  };

  const handleConfirmBet = async (marketId: string, side: 'long' | 'short', amount: string) => {
    if (!accessToken) {
      throw new Error('Not authenticated');
    }

    await executePosition(accessToken, {
      marketId,
      side,
      amount,
      leverage: 3, // Default leverage
      resolvedPairs: selectedResolvedPairs ?? undefined,
    });

    setBetModalOpen(false);
    setSelectedMarket(null);
    setSelectedSide(null);
    setSelectedResolvedPairs(null);
    setPositionsRefreshKey((k) => k + 1);
    toast.success('Bet placed');
  };

  const filteredMarkets = activeTab === 'all'
    ? validatedMarkets
    : validatedMarkets.filter(m => m.category === activeTab);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold neon-text mb-1">TERMINAL</h1>
        <p className="text-sm text-gray-500">Minimal flow for debugging: connect → run setup → bet</p>
      </div>

      <div className="mb-6">
        <PearTerminalPanel onRequestConnect={() => setConnectModalOpen(true)} />
      </div>

      {/* Positions Panel */}
      {isAuthenticated && (
        <div className="mb-6 space-y-4">
          <BalancesPanel accessToken={accessToken} />
          <div>
            <div className="text-sm text-war-green mb-3 font-mono">[ YOUR BETS ]</div>
            <PositionsPanel accessToken={accessToken} refreshKey={positionsRefreshKey} />
          </div>
        </div>
      )}

      {/* Market Filter Tabs */}
      <div className="flex gap-2 mb-4 text-xs">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1 border ${
            activeTab === 'all'
              ? 'border-war-green text-war-green'
              : 'border-gray-700 text-gray-500 hover:text-gray-400'
          }`}
        >
          ALL
        </button>
        <button
          onClick={() => setActiveTab('geopolitical')}
          className={`px-3 py-1 border ${
            activeTab === 'geopolitical'
              ? 'border-war-green text-war-green'
              : 'border-gray-700 text-gray-500 hover:text-gray-400'
          }`}
        >
          GEO
        </button>
        <button
          onClick={() => setActiveTab('tech')}
          className={`px-3 py-1 border ${
            activeTab === 'tech'
              ? 'border-war-green text-war-green'
              : 'border-gray-700 text-gray-500 hover:text-gray-400'
          }`}
        >
          TECH
        </button>
      </div>

      {/* Markets Grid */}
      {isAuthenticated ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredMarkets.map((market) => (
            <MarketCard
              key={market.id}
              market={market}
              onBet={handleBet}
            />
          ))}
        </div>
      ) : (
        <div className="bg-war-panel neon-border p-6 text-sm text-gray-400">
          Authenticate first (use the terminal panel above) to enable trading.
        </div>
      )}

      {/* Bet Modal */}
      <BetModal
        isOpen={betModalOpen}
        marketId={selectedMarket}
        side={selectedSide}
        perpUsdc={perpUsdc}
        onClose={() => setBetModalOpen(false)}
        onConfirm={handleConfirmBet}
      />

      <WalletConnectModal isOpen={connectModalOpen} onClose={() => setConnectModalOpen(false)} />
    </main>
  );
}

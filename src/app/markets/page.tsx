'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { usePear } from '@/hooks/usePear';
import { MARKETS } from '@/integrations/pear/markets';
import { executePosition } from '@/integrations/pear/positions';
import { MarketCard } from '@/components/MarketCard';
import { BetModal } from '@/components/BetModal';
import { PositionsPanel } from '@/components/PositionsPanel';
import { BalancesPanel } from '@/components/BalancesPanel';
import { useVaultBalances } from '@/hooks/useVaultBalances';

export default function MarketsPage() {
  const { accessToken, isAuthenticated, isAuthenticating, authenticate } = usePear();
  const { perpUsdc } = useVaultBalances(accessToken);
  const [positionsRefreshKey, setPositionsRefreshKey] = useState(0);

  const [betModalOpen, setBetModalOpen] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null);
  const [selectedSide, setSelectedSide] = useState<'long' | 'short' | null>(null);
  const [activeTab, setActiveTab] = useState<'geopolitical' | 'tech' | 'all'>('all');

  const handleBet = (marketId: string, side: 'long' | 'short') => {
    if (!isAuthenticated) {
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
    });

    setBetModalOpen(false);
    setSelectedMarket(null);
    setSelectedSide(null);
    setPositionsRefreshKey((k) => k + 1);
    toast.success('Bet placed');
  };

  const filteredMarkets = activeTab === 'all'
    ? MARKETS
    : MARKETS.filter(m => m.category === activeTab);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold neon-text mb-1">MARKETS</h1>
        <p className="text-sm text-gray-500">Bet on narratives that move markets</p>
      </div>

      {/* Authentication */}
      {!isAuthenticated && (
        <div className="border border-war-green/50 p-4 mb-6 bg-war-dark">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-war-green font-mono mb-1">⚠ AUTHENTICATION REQUIRED</div>
              <p className="text-xs text-gray-500">
                Click to sign message and create agent wallet
              </p>
            </div>
            <button
              onClick={() => {
                authenticate().catch(err => {
                  console.error('Auth failed:', err);
                  if (err.message?.includes('User rejected') || err.message?.includes('denied')) {
                    toast.error('Signature rejected. Please try again.');
                  } else if (err.message?.includes('Wallet not connected')) {
                    toast.error('Please connect your wallet first.');
                  } else {
                    toast.error(err.message || 'Authentication failed. Please try again.');
                  }
                });
              }}
              disabled={isAuthenticating}
              className="bg-war-green text-black font-bold px-4 py-2 text-sm hover:opacity-80 disabled:opacity-50"
            >
              {isAuthenticating ? '[ SIGNING... ]' : 'AUTHENTICATE →'}
            </button>
          </div>
        </div>
      )}

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
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredMarkets.map((market) => (
          <MarketCard
            key={market.id}
            market={market}
            onBet={handleBet}
          />
        ))}
      </div>

      {/* Bet Modal */}
      <BetModal
        isOpen={betModalOpen}
        marketId={selectedMarket}
        side={selectedSide}
        perpUsdc={perpUsdc}
        onClose={() => setBetModalOpen(false)}
        onConfirm={handleConfirmBet}
      />
    </main>
  );
}

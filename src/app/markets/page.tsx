'use client';

import { useState } from 'react';
import { usePear } from '@/hooks/usePear';
import { MARKETS } from '@/integrations/pear/markets';
import { executePosition } from '@/integrations/pear/positions';
import { MarketCard } from '@/components/MarketCard';
import { BetModal } from '@/components/BetModal';
import { PositionsPanel } from '@/components/PositionsPanel';

export default function MarketsPage() {
  const { jwtToken, isAuthenticated, isAuthenticating, authenticate } = usePear();

  const [betModalOpen, setBetModalOpen] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null);
  const [selectedSide, setSelectedSide] = useState<'long' | 'short' | null>(null);
  const [activeTab, setActiveTab] = useState<'geopolitical' | 'tech' | 'all'>('all');

  const handleBet = (marketId: string, side: 'long' | 'short') => {
    if (!isAuthenticated) {
      alert('Please authenticate with Pear Protocol first');
      return;
    }

    setSelectedMarket(marketId);
    setSelectedSide(side);
    setBetModalOpen(true);
  };

  const handleConfirmBet = async (marketId: string, side: 'long' | 'short', amount: string) => {
    if (!jwtToken) {
      throw new Error('Not authenticated');
    }

    await executePosition(jwtToken, {
      marketId,
      side,
      amount,
      leverage: 3, // Default leverage
    });

    // Refresh positions after execution
    window.location.reload(); // Simple refresh for now
  };

  const filteredMarkets = activeTab === 'all'
    ? MARKETS
    : MARKETS.filter(m => m.category === activeTab);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold neon-text mb-2">NARRATIVE MARKETS</h1>
        <p className="text-gray-400">Bet on the narratives that move markets</p>
      </div>

      {/* Authentication */}
      {!isAuthenticated && (
        <div className="bg-war-panel neon-border p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold neon-text mb-1">AUTHENTICATE WITH PEAR PROTOCOL</h3>
              <p className="text-sm text-gray-400">
                Sign a message to create your non-custodial trading agent
              </p>
            </div>
            <button
              onClick={authenticate}
              disabled={isAuthenticating}
              className="bg-war-green text-war-dark font-bold px-6 py-3 hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              {isAuthenticating ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
            </button>
          </div>
        </div>
      )}

      {/* Positions Panel */}
      {isAuthenticated && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold neon-text mb-4">YOUR BETS</h2>
          <PositionsPanel jwtToken={jwtToken} />
        </div>
      )}

      {/* Market Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 font-bold transition-all ${
            activeTab === 'all'
              ? 'bg-war-green text-war-dark'
              : 'bg-war-panel neon-border text-gray-400 hover:text-white'
          }`}
        >
          ALL MARKETS
        </button>
        <button
          onClick={() => setActiveTab('geopolitical')}
          className={`px-4 py-2 font-bold transition-all ${
            activeTab === 'geopolitical'
              ? 'bg-war-green text-war-dark'
              : 'bg-war-panel neon-border text-gray-400 hover:text-white'
          }`}
        >
          GEOPOLITICAL
        </button>
        <button
          onClick={() => setActiveTab('tech')}
          className={`px-4 py-2 font-bold transition-all ${
            activeTab === 'tech'
              ? 'bg-war-green text-war-dark'
              : 'bg-war-panel neon-border text-gray-400 hover:text-white'
          }`}
        >
          TECH/INDUSTRY
        </button>
      </div>

      {/* Markets Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        onClose={() => setBetModalOpen(false)}
        onConfirm={handleConfirmBet}
      />
    </main>
  );
}

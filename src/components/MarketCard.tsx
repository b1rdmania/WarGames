'use client';

import type { PearMarketConfig } from '@/integrations/pear/types';

interface MarketCardProps {
  market: PearMarketConfig;
  onBet: (marketId: string, side: 'long' | 'short') => void;
}

export function MarketCard({ market, onBet }: MarketCardProps) {
  const categoryColors = {
    geopolitical: 'bg-red-900/20 border-red-500/30',
    tech: 'bg-blue-900/20 border-blue-500/30',
  };

  const categoryLabels = {
    geopolitical: 'GEOPOLITICAL',
    tech: 'TECH/INDUSTRY',
  };

  return (
    <div className="bg-war-dark border border-war-green/30 p-4 hover:border-war-green transition-colors">
      {/* Header */}
      <div className="flex justify-between items-start mb-3 text-xs">
        <span className="text-gray-500">{categoryLabels[market.category]}</span>
        <span className="text-war-green">{market.leverage}x</span>
      </div>

      {/* Market Name */}
      <h3 className="text-sm font-bold text-war-green mb-2">
        {market.name}
      </h3>

      {/* Description */}
      <p className="text-xs text-gray-500 mb-3">
        {market.description}
      </p>

      {/* Pair Display */}
      <div className="border border-gray-700 p-2 mb-3 text-xs">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-green-400">↑ {market.pairs.long}</div>
          </div>
          <div className="text-gray-600">vs</div>
          <div className="text-right">
            <div className="text-red-400">↓ {market.pairs.short}</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onBet(market.id, 'long')}
          className="bg-green-600 hover:bg-green-500 text-white text-sm font-bold py-2"
        >
          UP ↑
        </button>
        <button
          onClick={() => onBet(market.id, 'short')}
          className="bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2"
        >
          DOWN ↓
        </button>
      </div>
    </div>
  );
}

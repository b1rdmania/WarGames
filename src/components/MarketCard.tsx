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
    <div className="bg-war-panel neon-border p-6 hover:neon-glow transition-all">
      {/* Category Badge */}
      <div className="flex justify-between items-start mb-4">
        <span className={`text-xs px-3 py-1 rounded ${categoryColors[market.category]}`}>
          {categoryLabels[market.category]}
        </span>
        <span className="text-xs text-gray-500">
          {market.leverage}x LEVERAGE
        </span>
      </div>

      {/* Market Name */}
      <h3 className="text-xl font-bold neon-text mb-2">
        {market.name}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-400 mb-4">
        {market.description}
      </p>

      {/* Pair Display */}
      <div className="bg-war-dark p-3 mb-4 rounded border border-gray-700">
        <div className="flex justify-between items-center text-sm">
          <div className="flex-1">
            <div className="text-green-400 font-bold mb-1">↑ BET UP</div>
            <div className="text-gray-500">{market.pairs.long}</div>
          </div>
          <div className="text-gray-600 mx-2">VS</div>
          <div className="flex-1 text-right">
            <div className="text-red-400 font-bold mb-1">↓ BET DOWN</div>
            <div className="text-gray-500">{market.pairs.short}</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onBet(market.id, 'long')}
          className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 transition-colors"
        >
          BET UP ↑
        </button>
        <button
          onClick={() => onBet(market.id, 'short')}
          className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 transition-colors"
        >
          BET DOWN ↓
        </button>
      </div>
    </div>
  );
}

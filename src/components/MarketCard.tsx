'use client';

import type { PearMarketConfig, ResolvedPairs } from '@/integrations/pear/types';

interface MarketCardProps {
  market: PearMarketConfig & {
    resolvedPairs?: ResolvedPairs;
    isRemapped?: boolean;
    remapReason?: string;
  };
  onBet: (marketId: string, side: 'long' | 'short', resolvedPairs?: ResolvedPairs) => void;
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
    <div className="bg-pear-dark border border-pear-lime/30 p-4 hover:border-pear-lime transition-colors">
      {/* Header */}
      <div className="flex justify-between items-start mb-3 text-xs">
        <span className="text-gray-500">{categoryLabels[market.category]}</span>
        <span className="text-pear-lime">{market.leverage}x</span>
      </div>

      {/* Market Name */}
      <h3 className="text-sm font-bold text-pear-lime mb-2">
        {market.name}
      </h3>

      {/* Description */}
      <p className="text-xs text-gray-500 mb-3">
        {market.description}
      </p>

      {/* Pair Display */}
      <div className="border border-gray-700 p-2 mb-3 text-xs">
        {market.isRemapped && (
          <div className="text-[10px] text-yellow-500 mb-2">
            REMAPPED UNDERLYING (demo safety): {market.remapReason}
          </div>
        )}
        <div className="flex justify-between items-center">
          <div>
            <div className="text-green-400">↑ {(market.resolvedPairs ?? market.pairs).long}</div>
          </div>
          <div className="text-gray-600">vs</div>
          <div className="text-right">
            <div className="text-red-400">↓ {(market.resolvedPairs ?? market.pairs).short}</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onBet(market.id, 'long', market.resolvedPairs ?? market.pairs)}
          className="bg-green-600 hover:bg-green-500 text-white text-sm font-bold py-2"
        >
          UP ↑
        </button>
        <button
          onClick={() => onBet(market.id, 'short', market.resolvedPairs ?? market.pairs)}
          className="bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2"
        >
          DOWN ↓
        </button>
      </div>
    </div>
  );
}

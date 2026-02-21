'use client';

import type { PearMarketConfig, ResolvedPairs } from '@/integrations/pear/types';
import { formatPairOrBasketSide } from '@/lib/marketDisplay';

interface MarketCardProps {
  market: PearMarketConfig & {
    resolvedPairs?: ResolvedPairs;
    isTradable?: boolean;
    unavailableReason?: string;
  };
  onBet: (marketId: string, side: 'long' | 'short', resolvedPairs?: ResolvedPairs) => void;
}

export function MarketCard({ market, onBet }: MarketCardProps) {
  const categoryLabels = {
    geopolitical: 'GEOPOLITICAL',
    tech: 'TECH/INDUSTRY',
    macro: 'MACRO',
    crypto: 'CRYPTO',
  };
  const longLabel = formatPairOrBasketSide(market, 'long', { compact: true, maxItems: 3 });
  const shortLabel = formatPairOrBasketSide(market, 'short', { compact: true, maxItems: 3 });

  return (
    <div className="bg-black/40 pear-border p-4 hover:pear-glow transition-colors">
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
      <div className="pear-border bg-black/20 p-2 mb-3 text-xs font-mono">
        {market.isTradable === false && (
          <div className="text-[10px] text-yellow-500 mb-2">
            INACTIVE: {market.unavailableReason ?? 'Not currently tradable'}
          </div>
        )}
        <div className="flex justify-between items-center">
          <div>
            <div className="text-green-400">↑ {longLabel}</div>
          </div>
          <div className="text-gray-600">vs</div>
          <div className="text-right">
            <div className="text-red-400">↓ {shortLabel}</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onBet(market.id, 'long', market.resolvedPairs ?? market.pairs)}
          disabled={market.isTradable === false}
          className="pear-border bg-pear-lime/10 text-pear-lime text-sm font-mono py-2 hover:pear-glow"
        >
          UP ↑
        </button>
        <button
          onClick={() => onBet(market.id, 'short', market.resolvedPairs ?? market.pairs)}
          disabled={market.isTradable === false}
          className="border border-red-400/30 bg-red-500/10 text-red-300 text-sm font-mono py-2 hover:shadow-[0_0_10px_rgba(239,68,68,0.15)]"
        >
          DOWN ↓
        </button>
      </div>
    </div>
  );
}

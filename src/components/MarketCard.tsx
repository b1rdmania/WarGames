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
    macro: 'bg-amber-900/10 border-amber-500/25',
  };

  const categoryLabels = {
    geopolitical: 'GEOPOLITICAL',
    tech: 'TECH/INDUSTRY',
    macro: 'MACRO',
  };

  const pairs = market.resolvedPairs ?? market.pairs;

  const formatBasketLabel = (assets: { asset: string }[]) => {
    const names = assets.map((a) => a.asset).filter(Boolean);
    if (names.length === 0) return 'BASKET';
    const shown = names.slice(0, 4);
    const suffix = names.length > shown.length ? '…' : '';
    return `${shown.join('+')}${suffix}`;
  };

  const longLabel = pairs?.long ?? (market.basket ? formatBasketLabel(market.basket.long) : '—');
  const shortLabel = pairs?.short ?? (market.basket ? formatBasketLabel(market.basket.short) : '—');

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
        {market.isRemapped && (
          <div className="text-[10px] text-yellow-500 mb-2">
            REMAPPED UNDERLYING (demo safety): {market.remapReason}
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
          className="pear-border bg-pear-lime/10 text-pear-lime text-sm font-mono py-2 hover:pear-glow"
        >
          UP ↑
        </button>
        <button
          onClick={() => onBet(market.id, 'short', market.resolvedPairs ?? market.pairs)}
          className="border border-red-400/30 bg-red-500/10 text-red-300 text-sm font-mono py-2 hover:shadow-[0_0_10px_rgba(239,68,68,0.15)]"
        >
          DOWN ↓
        </button>
      </div>
    </div>
  );
}

'use client';

import type { PearMarketConfig } from '@/integrations/pear/types';

export function MarketDetail({ market }: { market: PearMarketConfig }) {
  const isBasket = !!market.basket;

  return (
    <div className="tm-box">
      <div className="mb-4">
        <div className="text-xs font-mono text-gray-300 mb-2">[ MARKET ]</div>
        <div className="text-lg font-mono text-white mb-2">{market.name}</div>
        <div className="text-xs font-mono text-gray-400 mb-4">{market.description}</div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono px-2 py-1 border border-pear-lime/30 text-pear-lime uppercase">
            {market.category}
          </span>
          <span className="text-xs font-mono text-gray-500">
            {market.leverage}x Leverage
          </span>
        </div>
      </div>

      {isBasket ? (
        <>
          <div className="text-xs font-mono text-gray-300 mb-3">[ BASKET STRUCTURE ]</div>

          {/* Long Basket */}
          <div className="mb-4">
            <div className="text-xs font-mono text-pear-lime mb-2">↑ Long Side (BET UP)</div>
            <div className="space-y-2">
              {market.basket!.long.map((asset, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">•</span>
                    <span className="text-white font-bold">{asset.asset}</span>
                  </div>
                  <span className="text-gray-400">{(asset.weight * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Short Basket */}
          <div>
            <div className="text-xs font-mono text-red-400 mb-2">↓ Short Side (BET DOWN)</div>
            <div className="space-y-2">
              {market.basket!.short.map((asset, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">•</span>
                    <span className="text-white font-bold">{asset.asset}</span>
                  </div>
                  <span className="text-gray-400">{(asset.weight * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="text-xs font-mono text-gray-300 mb-3">[ PAIR STRUCTURE ]</div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-mono text-pear-lime mb-2">↑ Long (BET UP)</div>
              <div className="text-sm font-mono text-white font-bold">{market.pairs!.long}</div>
            </div>
            <div>
              <div className="text-xs font-mono text-red-400 mb-2">↓ Short (BET DOWN)</div>
              <div className="text-sm font-mono text-white font-bold">{market.pairs!.short}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

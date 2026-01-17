'use client';

import { useLiveMarketData } from '@/hooks/useLiveMarketData';
import { useAccount } from 'wagmi';

export function AssetPriceTicker() {
  const { address } = useAccount();
  const { prices, isConnected } = useLiveMarketData(address);

  return (
    <div className="bg-gradient-to-r from-black/40 via-black/30 to-black/40 border-y border-pear-lime/10 py-3 mb-6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-8 overflow-x-auto scrollbar-hide">
          {/* Live connection indicator */}
          {isConnected && (
            <div className="flex items-center gap-1.5 pr-4 border-r border-pear-lime/20">
              <div className="w-1.5 h-1.5 bg-pear-lime rounded-full animate-pulse" />
              <span className="text-xs font-mono text-pear-lime uppercase">Live</span>
            </div>
          )}

          {prices.map((asset) => (
            <div key={asset.symbol} className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-xs font-mono font-bold text-gray-400">{asset.symbol}</span>
              <span className="text-sm font-mono text-white">
                ${typeof asset.price === 'number' ? asset.price.toLocaleString() : asset.price}
              </span>
              <span
                className={`text-xs font-mono font-semibold ${
                  asset.change24h >= 0 ? 'text-pear-lime' : 'text-red-400'
                }`}
              >
                {asset.change24h >= 0 ? '+' : ''}
                {asset.change24h.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

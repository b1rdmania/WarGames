'use client';

import { useLiveMarketData } from '@/hooks/useLiveMarketData';
import { useAccount } from 'wagmi';

export function AssetPriceTicker() {
  const { address } = useAccount();
  const { prices, isConnected } = useLiveMarketData(address);

  return (
    <div className="tm-box py-2.5 overflow-hidden">
      <div className="flex items-center gap-8 overflow-x-auto scrollbar-hide px-2">
          {/* Live connection indicator */}
          {isConnected && (
            <div className="flex items-center gap-1.5 pr-4 border-r border-border">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--primary)' }} />
              <span className="text-xs font-mono" style={{ color: 'var(--primary)' }}>LIVE</span>
            </div>
          )}

          {prices.map((asset) => (
            <div key={asset.symbol} className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-xs font-mono font-bold text-text-muted">{asset.symbol}</span>
              <span className="text-sm font-mono text-text-primary">
                ${typeof asset.price === 'number' ? asset.price.toLocaleString() : asset.price}
              </span>
              <span
                className={`text-xs font-mono font-semibold ${
                  asset.change24h >= 0 ? 'text-status-profit' : 'text-status-loss'
                }`}
              >
                {asset.change24h >= 0 ? '+' : ''}
                {asset.change24h.toFixed(1)}%
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

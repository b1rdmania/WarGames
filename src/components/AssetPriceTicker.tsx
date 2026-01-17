'use client';

import { useState, useEffect } from 'react';

interface AssetPrice {
  symbol: string;
  price: string;
  change24h: number;
}

export function AssetPriceTicker() {
  const [prices, setPrices] = useState<AssetPrice[]>([
    { symbol: 'BTC', price: '95,420', change24h: 2.3 },
    { symbol: 'ETH', price: '3,210', change24h: 1.8 },
    { symbol: 'SOL', price: '143', change24h: -0.5 },
    { symbol: 'HYPE', price: '28.5', change24h: 5.2 },
    { symbol: 'ARB', price: '0.82', change24h: -1.2 },
  ]);

  // TODO: Fetch real prices from Hyperliquid API or CoinGecko
  // For now using placeholder data
  useEffect(() => {
    // Simulate price updates every 30s with small random changes
    const interval = setInterval(() => {
      setPrices(prev =>
        prev.map(p => ({
          ...p,
          change24h: p.change24h + (Math.random() - 0.5) * 0.2,
        }))
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-black/40 via-black/30 to-black/40 border-y border-pear-lime/10 py-3 mb-6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-8 overflow-x-auto scrollbar-hide">
          {prices.map((asset) => (
            <div key={asset.symbol} className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-xs font-bold text-gray-400">{asset.symbol}</span>
              <span className="text-sm font-mono text-white">${asset.price}</span>
              <span
                className={`text-xs font-semibold ${
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

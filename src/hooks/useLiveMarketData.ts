'use client';

import { useState, useEffect } from 'react';
import { connectPearWebsocket } from '@/integrations/pear/websocket';
import { emitDebugLog } from '@/lib/debugLog';

export interface AssetPrice {
  symbol: string;
  price: number;
  change24h: number;
}

type WsMarketDataMessage = {
  prices?: Record<string, AssetPrice>;
};

function hasPriceMap(data: unknown): data is WsMarketDataMessage {
  return typeof data === 'object' && data !== null && 'prices' in data;
}

export function useLiveMarketData(address: string | undefined) {
  const [prices, setPrices] = useState<Record<string, AssetPrice>>({
    BTC: { symbol: 'BTC', price: 95420, change24h: 2.3 },
    ETH: { symbol: 'ETH', price: 3210, change24h: 1.8 },
    SOL: { symbol: 'SOL', price: 143, change24h: -0.5 },
    HYPE: { symbol: 'HYPE', price: 28.5, change24h: 5.2 },
    ARB: { symbol: 'ARB', price: 0.82, change24h: -1.2 },
  });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!address) return;

    const ws = connectPearWebsocket({
      address,
      channels: ['market-data'],
      onMessage: (data) => {
        emitDebugLog({ level: 'info', scope: 'market-data', message: 'received', data });

        // Update prices from WebSocket data
        if (hasPriceMap(data) && data.prices) {
          setPrices(prev => ({
            ...prev,
            ...data.prices,
          }));
        }
      },
      onError: () => {
        setIsConnected(false);
      },
    });

    // Mark as connected once WebSocket opens
    ws.addEventListener('open', () => setIsConnected(true));
    ws.addEventListener('close', () => setIsConnected(false));

    return () => {
      ws.close();
      setIsConnected(false);
    };
  }, [address]);

  return {
    prices: Object.values(prices),
    isConnected,
  };
}

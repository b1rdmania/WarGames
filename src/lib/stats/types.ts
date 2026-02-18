export type TradeEventStatus = 'attempted' | 'success' | 'failed';

export interface TradeStatEvent {
  ts?: number;
  wallet?: string;
  marketId: string;
  side: 'YES' | 'NO';
  sizeUsd: number;
  leverage: number;
  notionalUsd: number;
  status: TradeEventStatus;
  orderId?: string;
  error?: string;
}

export interface DailyUsagePoint {
  date: string;
  attempted: number;
  successful: number;
  failed: number;
  notionalUsd: number;
  uniqueWallets: number;
}

export interface MarketUsagePoint {
  marketId: string;
  successfulTrades: number;
  notionalUsd: number;
}

export interface StatsSummary {
  totals: {
    attempted: number;
    successful: number;
    failed: number;
    notionalUsd: number;
    uniqueWallets: number;
  };
  daily: DailyUsagePoint[];
  topMarkets: MarketUsagePoint[];
  storage: 'kv' | 'memory';
}

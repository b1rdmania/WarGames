export interface PearAuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface PearMarketConfig {
  id: string;
  name: string;
  description: string;
  category: 'geopolitical' | 'tech';
  pairs: {
    long: string;  // Token symbol for long side
    short: string; // Token symbol for short side
  };
  leverage: number;
}

export interface ResolvedPairs {
  long: string;
  short: string;
}

export interface PearPosition {
  id: string;
  marketId: string;
  side: 'long' | 'short';
  size: string;
  entryPrice: string;
  currentPrice: string;
  pnl: string;
  pnlPercent: string;
  timestamp: number;
  longAsset?: string;
  shortAsset?: string;
  // Enhanced fields from API
  marginUsed?: string;
  stopLoss?: {
    type: 'PERCENTAGE' | 'DOLLAR' | 'POSITION_VALUE';
    value: number;
  };
  takeProfit?: {
    type: 'PERCENTAGE' | 'DOLLAR' | 'POSITION_VALUE';
    value: number;
  };
  longAssets?: Array<{
    coin: string;
    entryPrice: number;
    size: number;
    leverage: number;
    fundingPaid: number;
  }>;
  shortAssets?: Array<{
    coin: string;
    entryPrice: number;
    size: number;
    leverage: number;
    fundingPaid: number;
  }>;
}

export interface ExecutePositionParams {
  marketId: string;
  side: 'long' | 'short';
  amount: string;
  leverage: number;
  resolvedPairs?: ResolvedPairs;
}

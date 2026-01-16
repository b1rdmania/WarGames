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
}

export interface ExecutePositionParams {
  marketId: string;
  side: 'long' | 'short';
  amount: string;
  leverage: number;
}

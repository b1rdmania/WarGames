import { PEAR_CONFIG } from './config';
import { getMarketById } from './markets';
import type { PearPosition, ExecutePositionParams } from './types';

export async function executePosition(
  accessToken: string,
  params: ExecutePositionParams
): Promise<{ orderId: string }> {
  const market = getMarketById(params.marketId);
  if (!market) {
    throw new Error('Market not found');
  }

  const requestBody = {
    slippage: 0.01, // 1%
    executionType: 'MARKET',
    leverage: params.leverage,
    usdValue: parseFloat(params.amount),
    longAssets: [
      {
        symbol: params.side === 'long' ? market.pairs.long : market.pairs.short,
        weight: 1.0,
      },
    ],
    shortAssets: [
      {
        symbol: params.side === 'long' ? market.pairs.short : market.pairs.long,
        weight: 1.0,
      },
    ],
  };

  const response = await fetch(`${PEAR_CONFIG.apiUrl}/positions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to execute position');
  }

  return await response.json();
}

export async function getActivePositions(accessToken: string): Promise<PearPosition[]> {
  const response = await fetch(`${PEAR_CONFIG.apiUrl}/positions`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to fetch positions');
  }

  const positions = await response.json();

  // Transform API response to our format
  return positions.map((pos: any) => ({
    id: pos.positionId,
    marketId: 'unknown', // We'll need to derive this from assets
    side: pos.longAssets.length > 0 ? 'long' : 'short',
    size: pos.positionValue.toString(),
    entryPrice: pos.entryRatio.toString(),
    currentPrice: pos.markRatio.toString(),
    pnl: pos.unrealizedPnl.toString(),
    pnlPercent: pos.unrealizedPnlPercentage.toString(),
    timestamp: new Date(pos.createdAt).getTime(),
  }));
}

export async function closePosition(
  accessToken: string,
  positionId: string
): Promise<{ orderId: string }> {
  const response = await fetch(`${PEAR_CONFIG.apiUrl}/positions/${positionId}/close`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      executionType: 'MARKET',
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to close position');
  }

  return await response.json();
}

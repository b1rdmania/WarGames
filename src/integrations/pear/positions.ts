import { PEAR_CONFIG } from './config';
import { getMarketById, MARKETS } from './markets';
import type { PearPosition, ExecutePositionParams } from './types';
import { emitDebugLog } from '@/lib/debugLog';

export async function executePosition(
  accessToken: string,
  params: ExecutePositionParams
): Promise<{ orderId: string }> {
  const market = getMarketById(params.marketId);
  if (!market) {
    throw new Error('Market not found');
  }

  const pairs = params.resolvedPairs ?? market.pairs;

  const requestBody = {
    slippage: 0.01, // 1%
    executionType: 'MARKET',
    leverage: params.leverage,
    usdValue: parseFloat(params.amount),
    longAssets: [
      {
        // Pear API spec uses `asset` key.
        asset: params.side === 'long' ? pairs.long : pairs.short,
        weight: 1.0,
      },
    ],
    shortAssets: [
      {
        asset: params.side === 'long' ? pairs.short : pairs.long,
        weight: 1.0,
      },
    ],
  };

  // Log request for debugging
  emitDebugLog({
    level: 'info',
    scope: 'trade',
    message: 'POST /positions REQUEST',
    data: { url: `${PEAR_CONFIG.apiUrl}/positions`, body: requestBody }
  });

  const response = await fetch(`${PEAR_CONFIG.apiUrl}/positions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  const responseData = await response.json().catch(() => ({}));

  // Log response for debugging
  emitDebugLog({
    level: response.ok ? 'info' : 'error',
    scope: 'trade',
    message: `POST /positions RESPONSE (${response.status})`,
    data: responseData
  });

  if (!response.ok) {
    throw new Error(responseData.error || responseData.message || `HTTP ${response.status}: ${JSON.stringify(responseData)}`);
  }

  return responseData;
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
    throw new Error(error.error || error.message || 'Failed to fetch positions');
  }

  const positions = await response.json();

  // Debug: Log raw position data
  console.log('📊 Raw positions from Pear API:', JSON.stringify(positions, null, 2));

  const deriveMarket = (pos: any): { marketId: string; side: 'long' | 'short' } => {
    const longCoin = pos?.longAssets?.[0]?.coin;
    const shortCoin = pos?.shortAssets?.[0]?.coin;
    if (!longCoin || !shortCoin) return { marketId: 'unknown', side: 'long' };

    // Match against configured markets (simple 1v1 pairs only).
    // If the legs match pairs.long/pairs.short, we call it BET UP (side: long).
    // If swapped, it's BET DOWN (side: short).
    for (const m of MARKETS) {
      if (m.pairs.long === longCoin && m.pairs.short === shortCoin) {
        return { marketId: m.id, side: 'long' };
      }
      if (m.pairs.long === shortCoin && m.pairs.short === longCoin) {
        return { marketId: m.id, side: 'short' };
      }
    }

    return { marketId: 'unknown', side: 'long' };
  };

  // Transform API response to our format
  return positions.map((pos: any) => ({
    id: pos.positionId,
    ...deriveMarket(pos),
    longAsset: pos?.longAssets?.[0]?.coin,
    shortAsset: pos?.shortAssets?.[0]?.coin,
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
    throw new Error(error.error || error.message || 'Failed to close position');
  }

  return await response.json();
}

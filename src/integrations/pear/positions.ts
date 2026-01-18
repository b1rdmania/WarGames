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

  let longAssets, shortAssets;

  // Handle basket markets
  if (params.resolvedBasket || market.basket) {
    const basket = params.resolvedBasket ?? market.basket!;
    longAssets = params.side === 'long' ? basket.long : basket.short;
    shortAssets = params.side === 'long' ? basket.short : basket.long;
  }
  // Handle simple pair markets (backward compatible)
  else {
    const pairs = params.resolvedPairs ?? market.pairs!;
    longAssets = [{ asset: params.side === 'long' ? pairs.long : pairs.short, weight: 1.0 }];
    shortAssets = [{ asset: params.side === 'long' ? pairs.short : pairs.long, weight: 1.0 }];
  }

  const requestBody = {
    slippage: 0.01, // 1%
    executionType: 'MARKET',
    leverage: params.leverage,
    usdValue: parseFloat(params.amount),
    longAssets,
    shortAssets,
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
    const hasTradFiAssets = [...longAssets, ...shortAssets].some(
      (a: any) => a.asset?.startsWith('xyz:') || a.asset?.startsWith('km:') || a.asset?.startsWith('vntl:')
    );

    const rawMsg =
      responseData?.error ||
      responseData?.message ||
      responseData?.detail ||
      response.statusText ||
      `HTTP ${response.status}`;

    const msg = String(rawMsg || '').toLowerCase();
    const looksLikeMarketHours =
      msg.includes('market closed') ||
      msg.includes('closed') ||
      msg.includes('trading hours') ||
      msg.includes('outside') ||
      msg.includes('session');

    // Pear can surface market-hours errors in different shapes/status codes.
    if (hasTradFiAssets && looksLikeMarketHours && [400, 403, 500].includes(response.status)) {
      throw new Error(
        'Markets closed. TradFi only trades Mon–Fri during regular hours (US session). Try a 24/7 crypto market.'
      );
    }

    throw new Error(rawMsg);
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
    const posLongCoins = (pos?.longAssets ?? []).map((a: any) => a.coin).filter(Boolean);
    const posShortCoins = (pos?.shortAssets ?? []).map((a: any) => a.coin).filter(Boolean);

    if (posLongCoins.length === 0 || posShortCoins.length === 0) {
      return { marketId: 'unknown', side: 'long' };
    }

    // Helper to check if arrays have significant overlap (>50% match)
    const hasOverlap = (arr1: string[], arr2: string[]): boolean => {
      const set2 = new Set(arr2);
      const matches = arr1.filter(x => set2.has(x)).length;
      return matches >= Math.min(arr1.length, arr2.length) * 0.5;
    };

    // Check against all configured markets (both pairs AND baskets)
    for (const m of MARKETS) {
      // Simple pairs
      if (m.pairs) {
        if (m.pairs.long === posLongCoins[0] && m.pairs.short === posShortCoins[0]) {
          return { marketId: m.id, side: 'long' };
        }
        if (m.pairs.long === posShortCoins[0] && m.pairs.short === posLongCoins[0]) {
          return { marketId: m.id, side: 'short' };
        }
      }

      // Basket markets
      if (m.basket) {
        const basketLongCoins = m.basket.long.map(a => a.asset);
        const basketShortCoins = m.basket.short.map(a => a.asset);

        // Check if position matches market's long side
        if (hasOverlap(posLongCoins, basketLongCoins) && hasOverlap(posShortCoins, basketShortCoins)) {
          return { marketId: m.id, side: 'long' };
        }
        // Check if position matches market's short side (inverted)
        if (hasOverlap(posLongCoins, basketShortCoins) && hasOverlap(posShortCoins, basketLongCoins)) {
          return { marketId: m.id, side: 'short' };
        }
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
    // Enhanced fields
    marginUsed: pos.marginUsed?.toString(),
    stopLoss: pos.stopLoss,
    takeProfit: pos.takeProfit,
    longAssets: pos.longAssets,
    shortAssets: pos.shortAssets,
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

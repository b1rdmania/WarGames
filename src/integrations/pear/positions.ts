import { PEAR_CONFIG } from './config';
import { getMarketById, MARKETS } from './markets';
import type { PearPosition, ExecutePositionParams } from './types';
import { emitDebugLog } from '@/lib/debugLog';

type PearApiAsset = {
  coin?: string;
  size?: number;
};

type PearApiPosition = {
  positionId?: string;
  positionValue?: number;
  entryRatio?: number;
  markRatio?: number;
  unrealizedPnl?: number;
  unrealizedPnlPercentage?: number;
  createdAt?: string;
  marginUsed?: number;
  stopLoss?: PearPosition['stopLoss'];
  takeProfit?: PearPosition['takeProfit'];
  longAssets?: PearApiAsset[];
  shortAssets?: PearApiAsset[];
};

function readErrorMessage(value: unknown, fallback: string): string {
  if (!value || typeof value !== 'object') return fallback;
  const record = value as Record<string, unknown>;
  if (typeof record.error === 'string') return record.error;
  if (typeof record.message === 'string') return record.message;
  if (typeof record.detail === 'string') return record.detail;
  return fallback;
}

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
    // Safety: refuse "remapped" baskets that don't match the canonical market config.
    // This prevents silently trading the wrong assets due to any future validation/remap logic.
    if (params.resolvedBasket && market.basket) {
      const canonical = new Set([...market.basket.long, ...market.basket.short].map((a) => a.asset.toUpperCase()));
      const proposed = new Set([...basket.long, ...basket.short].map((a) => a.asset.toUpperCase()));
      const allProposedAreCanonical = Array.from(proposed).every((s) => canonical.has(s));
      if (!allProposedAreCanonical) {
        throw new Error('Refusing to execute: basket legs do not match this market (safety check).');
      }
    }
    longAssets = params.side === 'long' ? basket.long : basket.short;
    shortAssets = params.side === 'long' ? basket.short : basket.long;
  }
  // Handle simple pair markets (backward compatible)
  else {
    const pairs = params.resolvedPairs ?? market.pairs!;
    // Safety: refuse remapped pairs that don't match canonical market config.
    if (params.resolvedPairs && market.pairs) {
      const canon = new Set([market.pairs.long.toUpperCase(), market.pairs.short.toUpperCase()]);
      const prop = new Set([pairs.long.toUpperCase(), pairs.short.toUpperCase()]);
      const ok = Array.from(prop).every((s) => canon.has(s));
      if (!ok) {
        throw new Error('Refusing to execute: pair legs do not match this market (safety check).');
      }
    }
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
      (a) => a.asset?.startsWith('xyz:') || a.asset?.startsWith('km:') || a.asset?.startsWith('vntl:')
    );

    const rawMsg = readErrorMessage(responseData, response.statusText || `HTTP ${response.status}`);

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
    throw new Error(readErrorMessage(error, 'Failed to fetch positions'));
  }

  const positionsRaw = await response.json();
  const positions = Array.isArray(positionsRaw) ? positionsRaw as PearApiPosition[] : [];

  const normCoin = (raw: unknown): string | null => {
    if (typeof raw !== 'string') return null;
    const s = raw.split(':').pop()!.trim();
    if (!s) return null;
    return s.toUpperCase();
  };

  const deriveMarket = (pos: PearApiPosition): { marketId: string; side: 'long' | 'short' } => {
    const posLongCoins = (pos.longAssets ?? []).map((a) => normCoin(a.coin)).filter(Boolean) as string[];
    const posShortCoins = (pos.shortAssets ?? []).map((a) => normCoin(a.coin)).filter(Boolean) as string[];

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
        const pLong = normCoin(m.pairs.long);
        const pShort = normCoin(m.pairs.short);
        if (pLong && pShort && pLong === posLongCoins[0] && pShort === posShortCoins[0]) {
          return { marketId: m.id, side: 'long' };
        }
        if (pLong && pShort && pLong === posShortCoins[0] && pShort === posLongCoins[0]) {
          return { marketId: m.id, side: 'short' };
        }
      }

      // Basket markets
      if (m.basket) {
        const basketLongCoins = m.basket.long.map((a) => normCoin(a.asset)).filter(Boolean) as string[];
        const basketShortCoins = m.basket.short.map((a) => normCoin(a.asset)).filter(Boolean) as string[];

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
  return positions.map((pos) => ({
    id: String(pos.positionId ?? 'unknown'),
    ...deriveMarket(pos),
    longAsset: pos.longAssets?.[0]?.coin,
    shortAsset: pos.shortAssets?.[0]?.coin,
    size: String(pos.positionValue ?? 0),
    entryPrice: String(pos.entryRatio ?? 0),
    currentPrice: String(pos.markRatio ?? 0),
    pnl: String(pos.unrealizedPnl ?? 0),
    pnlPercent: String(pos.unrealizedPnlPercentage ?? 0),
    timestamp: new Date(pos.createdAt ?? Date.now()).getTime(),
    // Enhanced fields
    marginUsed: pos.marginUsed !== undefined ? String(pos.marginUsed) : undefined,
    stopLoss: pos.stopLoss,
    takeProfit: pos.takeProfit,
    longAssets: pos.longAssets
      ?.filter((asset): asset is Required<PearApiAsset> => Boolean(asset.coin && typeof asset.size === 'number'))
      .map((asset) => ({
        coin: asset.coin,
        size: asset.size,
        entryPrice: 0,
        leverage: 0,
        fundingPaid: 0,
      })),
    shortAssets: pos.shortAssets
      ?.filter((asset): asset is Required<PearApiAsset> => Boolean(asset.coin && typeof asset.size === 'number'))
      .map((asset) => ({
        coin: asset.coin,
        size: asset.size,
        entryPrice: 0,
        leverage: 0,
        fundingPaid: 0,
      })),
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
    throw new Error(readErrorMessage(error, 'Failed to close position'));
  }

  return await response.json();
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function isPositionStillOpen(accessToken: string, positionId: string): Promise<boolean> {
  const response = await fetch(`${PEAR_CONFIG.apiUrl}/positions`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(readErrorMessage(error, 'Failed to verify close status'));
  }

  const positionsRaw = await response.json();
  const positions = Array.isArray(positionsRaw) ? positionsRaw as PearApiPosition[] : [];
  return positions.some((p) => String(p.positionId ?? '') === positionId);
}

export async function closePositionVerified(
  accessToken: string,
  positionId: string,
  opts?: { timeoutMs?: number; pollMs?: number }
): Promise<{ orderId: string; verifiedClosed: boolean }> {
  const timeoutMs = Math.max(3000, opts?.timeoutMs ?? 15000);
  const pollMs = Math.max(500, opts?.pollMs ?? 1200);

  const closeResult = await closePosition(accessToken, positionId);

  const startedAt = Date.now();
  let verifiedClosed = false;

  while (Date.now() - startedAt < timeoutMs) {
    const stillOpen = await isPositionStillOpen(accessToken, positionId);
    if (!stillOpen) {
      verifiedClosed = true;
      break;
    }
    await sleep(pollMs);
  }

  return {
    orderId: closeResult.orderId,
    verifiedClosed,
  };
}

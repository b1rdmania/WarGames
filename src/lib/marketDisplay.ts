import type { BasketAsset, PearMarketConfig, ResolvedBasket, ResolvedPairs } from '@/integrations/pear/types';

const ASSET_NAMES: Record<string, string> = {
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
  SOL: 'Solana',
  AVAX: 'Avalanche',
  SUI: 'Sui',
  APT: 'Aptos',
  HYPE: 'Hyperliquid',
  INTC: 'Intel',
  AMD: 'Advanced Micro Devices',
  ORCL: 'Oracle',
  NVDA: 'NVIDIA',
  AAPL: 'Apple',
  TSLA: 'Tesla',
  GOLD: 'Gold',
  COIN: 'Coinbase',
  MSTR: 'MicroStrategy',
  META: 'Meta',
  GOOGL: 'Alphabet',
  CL: 'Crude Oil',
  US500: 'S&P 500',
  USTECH: 'Nasdaq 100',
};

type MarketLegShape = {
  pairs?: ResolvedPairs | PearMarketConfig['pairs'];
  basket?: ResolvedBasket | PearMarketConfig['basket'];
  resolvedPairs?: ResolvedPairs;
  resolvedBasket?: ResolvedBasket;
};

export function symbol(raw: string): string {
  return raw.split(':').pop()!.trim().toUpperCase();
}

export function symbolWithName(raw: string): string {
  const s = symbol(raw);
  const name = ASSET_NAMES[s];
  return name && name.toUpperCase() !== s ? `${s} (${name})` : s;
}

function sideSum(assets: BasketAsset[]): number {
  return assets.reduce((sum, leg) => sum + (Number.isFinite(leg.weight) ? leg.weight : 0), 0);
}

export function sideBalanceLabel(market: MarketLegShape): { long: string; short: string } {
  const pairs = market.resolvedPairs ?? market.pairs;
  const basket = market.resolvedBasket ?? market.basket;

  if (pairs) return { long: 'LONG (50%)', short: 'SHORT (50%)' };
  if (!basket) return { long: 'LONG', short: 'SHORT' };

  const longSum = sideSum(basket.long);
  const shortSum = sideSum(basket.short);
  const total = longSum + shortSum;
  if (total <= 0) return { long: 'LONG', short: 'SHORT' };

  const longPct = Math.round((longSum / total) * 100);
  const shortPct = Math.round((shortSum / total) * 100);
  return {
    long: `LONG (${longPct}%)`,
    short: `SHORT (${shortPct}%)`,
  };
}

export function formatPairOrBasketSide(
  market: MarketLegShape,
  side: 'long' | 'short',
  opts?: { compact?: boolean; maxItems?: number }
): string {
  const pairs = market.resolvedPairs ?? market.pairs;
  const basket = market.resolvedBasket ?? market.basket;
  const compact = opts?.compact ?? false;
  const maxItems = opts?.maxItems ?? 4;

  if (pairs) {
    return symbolWithName(side === 'long' ? pairs.long : pairs.short);
  }

  if (!basket) return '—';

  const legs = (side === 'long' ? basket.long : basket.short) ?? [];
  const names = legs.map((a) => symbolWithName(a.asset));
  if (!compact) return names.join(' + ');
  if (names.length <= maxItems) return names.join(' + ');
  return `${names.slice(0, maxItems - 1).join(' + ')} + ${names.length - (maxItems - 1)} more`;
}

import type { PearMarketConfig } from './types';

// Pear Protocol symbol prefixes:
// - xyz: = traditional equities/commodities (xyz:NVDA, xyz:GOLD, etc.) - WEEKDAYS ONLY
// - vntl: = thematic indices (vntl:MAG7, vntl:SEMIS, etc.) - WEEKDAYS ONLY
// - km: = market indices (km:US500, km:USTECH, etc.) - WEEKDAYS ONLY
// - No prefix = native crypto (BTC, ETH, SOL, etc.) - 24/7

export const MARKETS: PearMarketConfig[] = [
  // === GEOPOLITICAL/MACRO (WEEKDAYS ONLY) ===

  {
    id: 'taiwan-strait-crisis',
    name: 'Taiwan Strait Crisis',
    description: 'US chip independence vs TSMC supply chain dependency',
    category: 'geopolitical',
    basket: {
      long: [
        { asset: 'xyz:INTC', weight: 0.40 },
        { asset: 'xyz:AMD', weight: 0.30 },
        { asset: 'xyz:ORCL', weight: 0.30 },
      ],
      short: [
        { asset: 'xyz:NVDA', weight: 0.40 },
        { asset: 'xyz:AAPL', weight: 0.35 },
        { asset: 'xyz:TSLA', weight: 0.25 },
      ],
    },
    leverage: 3,
    status: 'paused',
  },

  {
    id: 'ai-bubble-pop',
    name: 'AI Bubble Pop',
    description: 'Value plays vs AI hype concentration risk',
    category: 'geopolitical',
    basket: {
      long: [
        { asset: 'xyz:GOLD', weight: 0.35 },
        { asset: 'xyz:INTC', weight: 0.30 },
        { asset: 'xyz:COIN', weight: 0.20 },
        { asset: 'xyz:MSTR', weight: 0.15 },
      ],
      short: [
        { asset: 'xyz:NVDA', weight: 0.55 },
        { asset: 'xyz:META', weight: 0.25 },
        { asset: 'xyz:GOOGL', weight: 0.20 },
      ],
    },
    leverage: 2,
    status: 'paused',
  },

  {
    id: 'middle-east-oil-shock',
    name: 'Middle East Oil Shock',
    description: 'Regional conflict drives oil spike and capital flight',
    category: 'geopolitical',
    basket: {
      long: [
        { asset: 'xyz:CL', weight: 0.50 },
        { asset: 'xyz:GOLD', weight: 0.30 },
        { asset: 'BTC', weight: 0.20 },
      ],
      short: [
        { asset: 'km:US500', weight: 0.60 },
        { asset: 'xyz:TSLA', weight: 0.40 },
      ],
    },
    leverage: 3,
    status: 'paused',
  },

  {
    id: 'risk-on-risk-off',
    name: 'Risk On/Risk Off',
    description: 'High beta tech vs safe haven assets',
    category: 'macro',
    basket: {
      long: [
        { asset: 'xyz:NVDA', weight: 0.40 },
        { asset: 'xyz:TSLA', weight: 0.30 },
        { asset: 'xyz:COIN', weight: 0.30 },
      ],
      short: [
        { asset: 'xyz:GOLD', weight: 0.60 },
        { asset: 'BTC', weight: 0.40 },
      ],
    },
    leverage: 3,
    status: 'paused',
  },

  // === CRYPTO (24/7 TRADING) ===

  {
    id: 'eth-vs-btc',
    name: 'The Flippening',
    description: 'ETH overtakes BTC as dominant crypto asset',
    category: 'crypto',
    pairs: {
      long: 'ETH',
      short: 'BTC',
    },
    leverage: 3,
    status: 'live',
  },

  {
    id: 'sol-vs-eth',
    name: 'Solana Surge',
    description: 'Solana outperforms Ethereum on speed and adoption',
    category: 'crypto',
    pairs: {
      long: 'SOL',
      short: 'ETH',
    },
    leverage: 3,
    status: 'live',
  },

  {
    id: 'hype-vs-btc',
    name: 'HYPE Train',
    description: 'Hyperliquid native token vs Bitcoin',
    category: 'crypto',
    pairs: {
      long: 'HYPE',
      short: 'BTC',
    },
    leverage: 3,
    status: 'live',
  },

  {
    id: 'hype-vs-l1s',
    name: 'HYPE vs L1 Basket',
    description: 'Hyperliquid token momentum vs broad L1 majors',
    category: 'crypto',
    basket: {
      long: [{ asset: 'HYPE', weight: 1.0 }],
      short: [
        { asset: 'ETH', weight: 0.20 },
        { asset: 'SOL', weight: 0.20 },
        { asset: 'AVAX', weight: 0.20 },
        { asset: 'SUI', weight: 0.20 },
        { asset: 'APT', weight: 0.20 },
      ],
    },
    leverage: 3,
    status: 'live',
  },

];

export function getMarketById(id: string): PearMarketConfig | undefined {
  return MARKETS.find(m => m.id === id);
}

export function getMarketsByCategory(category: 'geopolitical' | 'tech' | 'macro' | 'crypto'): PearMarketConfig[] {
  return MARKETS.filter(m => m.category === category);
}

export function getMarketByAssets(longAsset: string, shortAsset: string): PearMarketConfig | undefined {
  if (!longAsset || !shortAsset) return undefined;

  // Try to match simple pairs first
  const pairMatch = MARKETS.find(m =>
    m.pairs &&
    m.pairs.long.toUpperCase() === longAsset.toUpperCase() &&
    m.pairs.short.toUpperCase() === shortAsset.toUpperCase()
  );

  if (pairMatch) return pairMatch;

  // Try to match single-asset baskets (for positions that come back from API)
  return MARKETS.find(m => {
    if (!m.basket) return false;
    const hasMatchingLong = m.basket.long.length === 1 && m.basket.long[0].asset.toUpperCase() === longAsset.toUpperCase();
    const hasMatchingShort = m.basket.short.length === 1 && m.basket.short[0].asset.toUpperCase() === shortAsset.toUpperCase();
    return hasMatchingLong && hasMatchingShort;
  });
}

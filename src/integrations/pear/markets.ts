import type { PearMarketConfig } from './types';

export const MARKETS: PearMarketConfig[] = [
  // === GEOPOLITICAL NARRATIVES ===

  {
    id: 'gulf-tech-pivot',
    name: 'Gulf Tech Pivot',
    description: 'Saudi Vision 2030 - will Gulf states escape oil dependency?',
    category: 'geopolitical',
    pairs: {
      long: 'NVDA',  // Tech proxy (no QQQ on Pear)
      short: 'OIL',
    },
    leverage: 3,
  },
  {
    id: 'brics-de-dollarization',
    name: 'BRICS De-Dollarization',
    description: 'Gold-backed BRICS currency threatens USD hegemony',
    category: 'geopolitical',
    pairs: {
      long: 'GOLD',
      short: 'SPX',  // USD proxy (no UUP on Pear)
    },
    leverage: 2,
  },
  {
    id: 'chip-sovereignty',
    name: 'Chip Sovereignty',
    description: 'US/EU reshoring vs Taiwan semiconductor dominance',
    category: 'geopolitical',
    pairs: {
      long: 'INTC',  // US chip manufacturing
      short: 'NVDA', // Taiwan TSMC-dependent
    },
    leverage: 3,
  },
  {
    id: 'resource-nationalism',
    name: 'Resource Nationalism',
    description: 'Lithium triangle controls EV supply chains',
    category: 'geopolitical',
    pairs: {
      long: 'GOLD',  // Resource commodity proxy
      short: 'TSLA', // EV industry at risk
    },
    leverage: 3,
  },
  {
    id: 'digital-gold-war',
    name: 'Digital Gold War',
    description: 'Bitcoin vs gold as crisis store of value',
    category: 'geopolitical',
    pairs: {
      long: 'BTC',
      short: 'GOLD',
    },
    leverage: 3,
  },

  // === MACRO / TECH NARRATIVES ===

  {
    id: 'ai-bubble',
    name: 'AI Bubble',
    description: 'Is NVDA overvalued vs the market?',
    category: 'macro',
    pairs: {
      long: 'NVDA',
      short: 'SPX',
    },
    leverage: 3,
  },
  {
    id: 'mag7-reign',
    name: 'Mag 7 Reign',
    description: 'Big Tech concentration vs diversification',
    category: 'macro',
    basket: {
      long: [
        { asset: 'AAPL', weight: 0.15 },
        { asset: 'MSFT', weight: 0.15 },
        { asset: 'GOOGL', weight: 0.15 },
        { asset: 'META', weight: 0.15 },
        { asset: 'NVDA', weight: 0.15 },
        { asset: 'AMZN', weight: 0.15 },
        { asset: 'TSLA', weight: 0.10 },
      ],
      short: [{ asset: 'SPX', weight: 1.0 }],
    },
    leverage: 2,
  },
  {
    id: 'safe-haven-flight',
    name: 'Safe Haven Flight',
    description: 'Gold vs equities in market turmoil',
    category: 'macro',
    pairs: {
      long: 'GOLD',
      short: 'SPX',
    },
    leverage: 2,
  },

  // === CRYPTO NARRATIVES ===

  {
    id: 'the-flippening',
    name: 'The Flippening',
    description: 'Will ETH overtake BTC?',
    category: 'tech',
    pairs: {
      long: 'ETH',
      short: 'BTC',
    },
    leverage: 3,
  },
  {
    id: 'alt-season',
    name: 'Alt Season',
    description: 'Alts vs Bitcoin dominance',
    category: 'tech',
    basket: {
      long: [
        { asset: 'SOL', weight: 0.35 },
        { asset: 'ETH', weight: 0.35 },
        { asset: 'HYPE', weight: 0.30 },
      ],
      short: [{ asset: 'BTC', weight: 1.0 }],
    },
    leverage: 3,
  },
];

export function getMarketById(id: string): PearMarketConfig | undefined {
  return MARKETS.find(m => m.id === id);
}

export function getMarketsByCategory(category: 'geopolitical' | 'tech' | 'macro'): PearMarketConfig[] {
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

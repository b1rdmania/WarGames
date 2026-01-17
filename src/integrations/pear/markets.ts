import type { PearMarketConfig } from './types';

export const MARKETS: PearMarketConfig[] = [
  // === MACRO / TRADFI NARRATIVES ===
  {
    id: 'ai-bubble-pop',
    name: 'AI Bubble Pop',
    description: 'Is AI overvalued? NVDA vs the broad market',
    category: 'macro',
    pairs: {
      long: 'NVDA',
      short: 'SPX',
    },
    leverage: 3,
  },
  {
    id: 'mag7-dominance',
    name: 'Mag 7 Dominance',
    description: 'Big Tech concentration vs market diversification',
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
    id: 'chip-war',
    name: 'Chip War',
    description: 'AI chip leaders vs Intel legacy',
    category: 'macro',
    basket: {
      long: [
        { asset: 'NVDA', weight: 0.6 },
        { asset: 'AMD', weight: 0.4 },
      ],
      short: [{ asset: 'INTC', weight: 1.0 }],
    },
    leverage: 3,
  },
  {
    id: 'digital-gold',
    name: 'Digital Gold',
    description: 'Bitcoin vs traditional store of value',
    category: 'macro',
    pairs: {
      long: 'BTC',
      short: 'GOLD',
    },
    leverage: 3,
  },
  {
    id: 'tech-concentration',
    name: 'Tech Concentration Risk',
    description: 'Top 3 tech giants vs S&P 500',
    category: 'macro',
    basket: {
      long: [
        { asset: 'NVDA', weight: 0.4 },
        { asset: 'MSFT', weight: 0.3 },
        { asset: 'AAPL', weight: 0.3 },
      ],
      short: [{ asset: 'SPX', weight: 1.0 }],
    },
    leverage: 2,
  },
  {
    id: 'safe-haven',
    name: 'Safe Haven Flight',
    description: 'Gold in times of market turmoil',
    category: 'macro',
    pairs: {
      long: 'GOLD',
      short: 'SPX',
    },
    leverage: 2,
  },
  {
    id: 'ev-revolution',
    name: 'EV Revolution',
    description: 'Tesla mobility vs Apple devices',
    category: 'macro',
    pairs: {
      long: 'TSLA',
      short: 'AAPL',
    },
    leverage: 3,
  },
  {
    id: 'semiconductor-boom',
    name: 'Semiconductor Boom',
    description: 'Chip industry vs broad market',
    category: 'macro',
    pairs: {
      long: 'SEMIS',
      short: 'SPX',
    },
    leverage: 3,
  },

  // === CRYPTO NARRATIVES ===
  {
    id: 'the-flippening',
    name: 'The Flippening',
    description: 'Will ETH overtake BTC in market dominance?',
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
    description: 'Diversified alts vs Bitcoin dominance',
    category: 'tech',
    basket: {
      long: [
        { asset: 'SOL', weight: 0.3 },
        { asset: 'ETH', weight: 0.3 },
        { asset: 'ARB', weight: 0.2 },
        { asset: 'HYPE', weight: 0.2 },
      ],
      short: [{ asset: 'BTC', weight: 1.0 }],
    },
    leverage: 3,
  },
  {
    id: 'hype-momentum',
    name: 'HYPE Momentum',
    description: 'Hyperliquid token vs Ethereum - the new DeFi leader?',
    category: 'tech',
    pairs: {
      long: 'HYPE',
      short: 'ETH',
    },
    leverage: 3,
  },
  {
    id: 'eth-l2-boom',
    name: 'ETH L2 Boom',
    description: 'Arbitrum gains vs Ethereum base layer',
    category: 'tech',
    pairs: {
      long: 'ARB',
      short: 'ETH',
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

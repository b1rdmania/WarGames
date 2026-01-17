import type { PearMarketConfig } from './types';

export const MARKETS: PearMarketConfig[] = [
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
    id: 'sol-season',
    name: 'Solana Season',
    description: 'Can Solana outperform Ethereum in 2026?',
    category: 'tech',
    pairs: {
      long: 'SOL',
      short: 'ETH',
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
    id: 'btc-dominance',
    name: 'Bitcoin Dominance',
    description: 'Digital gold crushes the alt season',
    category: 'tech',
    pairs: {
      long: 'BTC',
      short: 'SOL',
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
  {
    id: 'alt-season',
    name: 'Alt Season',
    description: 'Alts (SOL) outperform Bitcoin',
    category: 'tech',
    pairs: {
      long: 'SOL',
      short: 'BTC',
    },
    leverage: 3,
  },
  {
    id: 'store-of-value',
    name: 'Store of Value',
    description: 'Bitcoin vs everything else',
    category: 'tech',
    pairs: {
      long: 'BTC',
      short: 'ETH',
    },
    leverage: 3,
  },
];

export function getMarketById(id: string): PearMarketConfig | undefined {
  return MARKETS.find(m => m.id === id);
}

export function getMarketsByCategory(category: 'geopolitical' | 'tech'): PearMarketConfig[] {
  return MARKETS.filter(m => m.category === category);
}

export function getMarketByAssets(longAsset: string, shortAsset: string): PearMarketConfig | undefined {
  if (!longAsset || !shortAsset) return undefined;
  return MARKETS.find(m =>
    m.pairs.long.toUpperCase() === longAsset.toUpperCase() &&
    m.pairs.short.toUpperCase() === shortAsset.toUpperCase()
  );
}

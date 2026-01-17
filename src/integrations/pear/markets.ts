import type { PearMarketConfig } from './types';

export const MARKETS: PearMarketConfig[] = [
  // SAFE DEMO MARKETS (mainnet): use highly liquid crypto majors so we can reliably place bets.
  // Narrative indices come later; for now, we’re proving the execution stack end-to-end.
  {
    id: 'sol-vs-eth',
    name: 'SOL > ETH',
    description: 'Safe demo pair: long SOL vs short ETH',
    category: 'tech',
    pairs: {
      long: 'SOL',
      short: 'ETH',
    },
    leverage: 3,
  },
  {
    id: 'eth-vs-btc',
    name: 'ETH > BTC',
    description: 'Safe demo pair: long ETH vs short BTC',
    category: 'tech',
    pairs: {
      long: 'ETH',
      short: 'BTC',
    },
    leverage: 3,
  },
  {
    id: 'btc-vs-sol',
    name: 'BTC > SOL',
    description: 'Safe demo pair: long BTC vs short SOL',
    category: 'tech',
    pairs: {
      long: 'BTC',
      short: 'SOL',
    },
    leverage: 3,
  },
  {
    id: 'hype-vs-eth',
    name: 'HYPE > ETH',
    description: 'Safe demo pair: long HYPE vs short ETH',
    category: 'geopolitical',
    pairs: {
      long: 'HYPE',
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

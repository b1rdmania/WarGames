import type { PearMarketConfig } from './types';

export const MARKETS: PearMarketConfig[] = [
  // Geopolitical Markets
  {
    id: 'trump-crypto-impact',
    name: 'Trump 2024 Crypto Impact',
    description: 'Will Trump presidency accelerate crypto adoption vs traditional finance?',
    category: 'geopolitical',
    pairs: {
      long: 'BTC',    // Crypto upside
      short: 'SPY',   // Traditional finance downside
    },
    leverage: 3,
  },
  {
    id: 'ukraine-reconstruction',
    name: 'Ukraine Reconstruction Boom',
    description: 'European construction vs global defense spending post-conflict',
    category: 'geopolitical',
    pairs: {
      long: 'EWU',    // UK/Europe ETF
      short: 'LMT',   // Lockheed Martin (defense)
    },
    leverage: 2,
  },
  {
    id: 'middle-east-energy',
    name: 'Middle East Energy Shift',
    description: 'Renewable energy surge vs traditional oil dependence',
    category: 'geopolitical',
    pairs: {
      long: 'ICLN',   // Clean energy ETF
      short: 'USO',   // Oil ETF
    },
    leverage: 2,
  },

  // Tech/Industry Markets
  {
    id: 'ai-vs-crypto',
    name: 'AI vs Crypto',
    description: 'Will AI adoption outpace crypto by 2027?',
    category: 'tech',
    pairs: {
      long: 'NVDA',   // AI hardware
      short: 'BTC',   // Crypto
    },
    leverage: 3,
  },
  {
    id: 'quantum-threat',
    name: 'Quantum Computing Threat',
    description: 'Quantum computing breaks crypto before mass adoption',
    category: 'tech',
    pairs: {
      long: 'IBM',    // Quantum leader
      short: 'ETH',   // Crypto at risk
    },
    leverage: 2,
  },
  {
    id: 'social-media-shift',
    name: 'Decentralized Social Media',
    description: 'Web3 social platforms vs traditional social media giants',
    category: 'tech',
    pairs: {
      long: 'LENS',   // Web3 social token
      short: 'META',  // Facebook/Meta
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

import type { PearMarketConfig } from './types';

export const MARKETS: PearMarketConfig[] = [
  // Macro Markets
  {
    id: 'ai-bubble-pop',
    name: 'AI Bubble Pop',
    description: 'Are AI valuations sustainable or headed for correction vs traditional tech?',
    category: 'geopolitical',
    pairs: {
      long: 'QQQ',    // Nasdaq (traditional tech)
      short: 'NVDA',  // AI hype leader
    },
    leverage: 3,
  },
  {
    id: 'japan-awakens',
    name: 'Japan Awakens',
    description: 'Japanese equities break 30-year stagnation vs US market dominance',
    category: 'geopolitical',
    pairs: {
      long: 'EWJ',    // Japan ETF
      short: 'SPY',   // S&P 500
    },
    leverage: 2,
  },
  {
    id: 'deglobalization',
    name: 'Deglobalization Trade',
    description: 'Friend-shoring and onshoring vs China manufacturing dominance',
    category: 'geopolitical',
    pairs: {
      long: 'EWI',    // Italy/Europe manufacturing
      short: 'FXI',   // China large cap
    },
    leverage: 2,
  },
  {
    id: 'gcc-tech-pivot',
    name: 'GCC Tech Pivot',
    description: 'Saudi Vision 2030 & UAE NEOM tech diversification succeeds vs oil dependence',
    category: 'geopolitical',
    pairs: {
      long: 'QQQ',    // Global tech (beneficiary of Gulf investment)
      short: 'USO',   // Oil (what they\'re pivoting from)
    },
    leverage: 2,
  },

  // Tech/Industry Markets
  {
    id: 'crypto-flippening',
    name: 'The Flippening',
    description: 'Will Ethereum flip Bitcoin as the dominant crypto asset?',
    category: 'tech',
    pairs: {
      long: 'ETH',    // Ethereum
      short: 'BTC',   // Bitcoin
    },
    leverage: 3,
  },
  {
    id: 'space-economy',
    name: 'Space Economy Boom',
    description: 'Space industry scales faster than traditional aerospace',
    category: 'tech',
    pairs: {
      long: 'ARKX',   // Space exploration ETF
      short: 'BA',    // Boeing (legacy aerospace)
    },
    leverage: 2,
  },
  {
    id: 'vr-metaverse',
    name: 'VR Metaverse Reality',
    description: 'VR/AR goes mainstream vs remaining niche tech',
    category: 'tech',
    pairs: {
      long: 'META',   // Meta (VR investment)
      short: 'AAPL',  // Apple (slower VR adoption)
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

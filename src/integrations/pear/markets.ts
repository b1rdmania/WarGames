import type { PearMarketConfig } from './types';

export const MARKETS: PearMarketConfig[] = [
  // === GEOPOLITICAL BASKETS ===

  {
    id: 'taiwan-strait-crisis',
    name: 'Taiwan Strait Crisis',
    description: 'US chip independence vs TSMC supply chain dependency',
    category: 'geopolitical',
    basket: {
      long: [
        { asset: 'INTC', weight: 0.40 },  // US fab buildout
        { asset: 'AMD', weight: 0.30 },   // US chip design
        { asset: 'ORCL', weight: 0.30 },  // US infrastructure
      ],
      short: [
        { asset: 'NVDA', weight: 0.40 },  // 100% TSMC reliant
        { asset: 'AAPL', weight: 0.35 },  // iPhone chips from Taiwan
        { asset: 'TSLA', weight: 0.25 },  // Auto chips from Taiwan
      ],
    },
    leverage: 3,
  },

  {
    id: 'ai-bubble-pop',
    name: 'AI Bubble Pop',
    description: 'Value plays vs AI hype concentration risk',
    category: 'geopolitical',
    basket: {
      long: [
        { asset: 'GOLD', weight: 0.35 },   // Safe haven
        { asset: 'INTC', weight: 0.30 },   // Cheap valuation
        { asset: 'COIN', weight: 0.20 },   // Alternative tech narrative
        { asset: 'MSTR', weight: 0.15 },   // Bitcoin corporate play
      ],
      short: [
        { asset: 'NVDA', weight: 0.55 },   // H100 bubble, 50x P/E
        { asset: 'META', weight: 0.25 },   // AI capex burn, no ROI
        { asset: 'GOOGL', weight: 0.20 },  // AI arms race spending
      ],
    },
    leverage: 2,
  },

  {
    id: 'middle-east-oil-shock',
    name: 'Middle East Oil Shock',
    description: 'Regional conflict drives oil spike and capital flight',
    category: 'geopolitical',
    basket: {
      long: [
        { asset: 'OIL', weight: 0.50 },    // Supply disruption
        { asset: 'GOLD', weight: 0.30 },   // Safe haven flight
        { asset: 'BTC', weight: 0.20 },    // Capital preservation
      ],
      short: [
        { asset: 'SPX', weight: 0.50 },    // Risk-off selloff
        { asset: 'TSLA', weight: 0.30 },   // Oil spike kills EV economics
        { asset: 'BABA', weight: 0.20 },   // EM contagion
      ],
    },
    leverage: 3,
  },

  // === MACRO BASKETS ===

  {
    id: 'mag7-concentration',
    name: 'Mag 7 Concentration',
    description: 'Big Tech dominance vs market diversification',
    category: 'macro',
    basket: {
      long: [
        { asset: 'AAPL', weight: 0.143 },
        { asset: 'MSFT', weight: 0.143 },
        { asset: 'GOOGL', weight: 0.143 },
        { asset: 'AMZN', weight: 0.143 },
        { asset: 'NVDA', weight: 0.143 },
        { asset: 'META', weight: 0.143 },
        { asset: 'TSLA', weight: 0.142 },
      ],
      short: [
        { asset: 'SPX', weight: 1.0 },     // Broad market diversification
      ],
    },
    leverage: 2,
  },

  {
    id: 'risk-on-risk-off',
    name: 'Risk On/Risk Off',
    description: 'High beta tech vs safe haven assets',
    category: 'macro',
    basket: {
      long: [
        { asset: 'NVDA', weight: 0.40 },   // Ultimate risk-on
        { asset: 'TSLA', weight: 0.30 },   // Volatile growth
        { asset: 'COIN', weight: 0.30 },   // Crypto proxy
      ],
      short: [
        { asset: 'GOLD', weight: 0.60 },   // Classic safe haven
        { asset: 'BTC', weight: 0.40 },    // Digital safe haven
      ],
    },
    leverage: 3,
  },

  // === CRYPTO BASKETS ===

  {
    id: 'crypto-infrastructure-war',
    name: 'Crypto Infrastructure War',
    description: 'Smart contract platforms vs Bitcoin maximalism',
    category: 'tech',
    basket: {
      long: [
        { asset: 'ETH', weight: 0.25 },    // Dominant L1
        { asset: 'SOL', weight: 0.25 },    // High performance
        { asset: 'AVAX', weight: 0.25 },   // Subnet architecture
        { asset: 'SUI', weight: 0.25 },    // Move-based L1
      ],
      short: [
        { asset: 'BTC', weight: 1.0 },     // Store of value maximalism
      ],
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

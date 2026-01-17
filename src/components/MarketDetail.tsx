'use client';

import type { PearMarketConfig } from '@/integrations/pear/types';

const MARKET_NARRATIVES: Record<string, {
  thesis: string;
  overview?: string;
  why?: string;
  model?: string;
  poweredBy?: string;
  longLabel: string;
  shortLabel: string;
}> = {
  'taiwan-strait-crisis': {
    thesis: 'China invades Taiwan. TSMC shuts down. Everything dependent on Taiwan chips dies overnight. US fabs survive.',
    overview: 'A Taiwan shock is a supply-chain nuke. This market expresses “US self-reliance wins” vs “Taiwan-dependent complex gets wrecked.”',
    why: 'Chip supply is the bloodstream of the global economy. If it snaps, second-order effects cascade across every risk asset.',
    model: 'Execution is a neutral long/short basket via Pear. You’re betting on relative performance, not absolute direction.',
    poweredBy: 'Pear execution + Hyperliquid settlement. Non-custodial agent wallet, you keep control.',
    longLabel: '🇺🇸 HOMELAND FABS',
    shortLabel: '🇹🇼 TSMC HOSTAGES',
  },
  'ai-bubble-pop': {
    thesis: 'NVDA trades at 50x earnings. H100 demand crashes. AI hype was bullshit. Value plays and safe havens win.',
    overview: 'A mean-reversion trade for when AI narrative breaks. Defensive/value legs vs crowded AI beta.',
    why: 'When a concentration bubble pops, correlation goes to 1. This market targets the unwind rather than one ticker.',
    model: 'Basket expresses “defensive/value rotation” vs “AI capex/hype complex.”',
    poweredBy: 'Pear execution + Hyperliquid settlement.',
    longLabel: '🛡️ BUNKER ASSETS',
    shortLabel: '🤖 AI HYPE VICTIMS',
  },
  'middle-east-oil-shock': {
    thesis: 'Regional war closes Strait of Hormuz. Oil hits $150. Risk assets get slaughtered. Commodities moon.',
    overview: 'Geopolitical supply shock: energy/hedges up, risk beta down.',
    why: 'Oil is upstream for everything. A spike hits inflation, growth, and multiples at the same time.',
    model: 'Long shock beneficiaries (energy/hedges) vs short broad risk.',
    poweredBy: 'Pear execution + Hyperliquid settlement.',
    longLabel: '⚔️ WAR WINNERS',
    shortLabel: '💀 COLLATERAL DAMAGE',
  },
  'mag7-concentration': {
    thesis: '7 tech stocks control the entire market. When they roll over, everyone holding them gets rekt.',
    overview: 'Concentration risk trade: mega-cap empire vs broad market.',
    why: 'When leadership cracks, passive flows reverse. This isolates the regime shift in index leadership.',
    model: 'Long Mag7 basket vs short broad index exposure.',
    poweredBy: 'Pear execution + Hyperliquid settlement.',
    longLabel: '👑 THE EMPIRE',
    shortLabel: '📉 THE PLEBS',
  },
  'risk-on-risk-off': {
    thesis: 'Markets panic. High beta tech bleeds out. Money runs to gold and Bitcoin. Flight to safety.',
    overview: 'Classic regime switch: degen risk-on vs safety trade.',
    why: 'Risk sentiment flips fast. This expresses the rotation without caring about overall market direction.',
    model: 'Long high-beta complex vs short safe-havens (or vice-versa depending on YES/NO).',
    poweredBy: 'Pear execution + Hyperliquid settlement.',
    longLabel: '🎰 DEGEN PLAYS',
    shortLabel: '🏦 BOOMER SAFETY',
  },
  'crypto-infrastructure-war': {
    thesis: 'Smart contracts eat everything. ETH, SOL, AVAX, SUI build the future. Bitcoin is just digital gold for boomers.',
    overview: 'Bet on smart-contract throughput and app ecosystems vs “store-of-value only.”',
    why: 'If usage wins, infra tokens outperform. If macro fear wins, BTC dominance rises.',
    model: 'Long multi-L1 basket vs short BTC dominance.',
    poweredBy: 'Pear execution + Hyperliquid settlement.',
    longLabel: '⚡ SMART CONTRACT ARMY',
    shortLabel: '💤 BOOMER COIN',
  },
};

export function getMarketNarrative(marketId: string) {
  return MARKET_NARRATIVES[marketId];
}

export function MarketDetail({ market }: { market: PearMarketConfig }) {
  const isBasket = !!market.basket;
  const narrative = MARKET_NARRATIVES[market.id];

  // Fallback to generic labels if no custom narrative
  const longLabel = narrative?.longLabel ?? '↑ LONG SIDE';
  const shortLabel = narrative?.shortLabel ?? '↓ SHORT SIDE';
  const thesis = narrative?.thesis ?? market.description;

  return (
    <div className="tm-box">
      <div className="mb-4">
        <div className="text-xs font-mono text-gray-300 mb-2">[ BATTLE PLAN ]</div>
        <div className="text-lg font-mono text-white mb-2">{market.name}</div>

        {/* Bespoke Thesis */}
        <div className="text-xs font-mono text-gray-400 mb-4 leading-relaxed">
          {thesis}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono px-2 py-1 border border-pear-lime/30 text-pear-lime uppercase">
            {market.category}
          </span>
          <span className="text-xs font-mono text-gray-500">
            {market.leverage}x Leverage
          </span>
        </div>
      </div>

      {isBasket ? (
        <>
          <div className="text-xs font-mono text-gray-300 mb-3">[ ASSET DEPLOYMENT ]</div>

          {/* Long Basket */}
          <div className="mb-4">
            <div className="text-xs font-mono text-pear-lime mb-2">{longLabel}</div>
            <div className="space-y-2">
              {market.basket!.long.map((asset, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">▸</span>
                    <span className="text-white font-bold">{asset.asset}</span>
                  </div>
                  <span className="text-gray-400">{(asset.weight * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Short Basket */}
          <div>
            <div className="text-xs font-mono text-red-400 mb-2">{shortLabel}</div>
            <div className="space-y-2">
              {market.basket!.short.map((asset, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">▸</span>
                    <span className="text-white font-bold">{asset.asset}</span>
                  </div>
                  <span className="text-gray-400">{(asset.weight * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="text-xs font-mono text-gray-300 mb-3">[ COMBATANTS ]</div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-mono text-pear-lime mb-2">{longLabel}</div>
              <div className="text-sm font-mono text-white font-bold">{market.pairs!.long}</div>
            </div>
            <div>
              <div className="text-xs font-mono text-red-400 mb-2">{shortLabel}</div>
              <div className="text-sm font-mono text-white font-bold">{market.pairs!.short}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

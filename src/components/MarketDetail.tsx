'use client';

import type { PearMarketConfig } from '@/integrations/pear/types';
import { symbolWithName } from '@/lib/marketDisplay';

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
  'risk-on-risk-off': {
    thesis: 'Markets panic. High beta tech bleeds out. Money runs to gold and Bitcoin. Flight to safety.',
    overview: 'Classic regime switch: degen risk-on vs safety trade.',
    why: 'Risk sentiment flips fast. This expresses the rotation without caring about overall market direction.',
    model: 'Long high-beta complex vs short safe-havens (or vice-versa depending on YES/NO).',
    poweredBy: 'Pear execution + Hyperliquid settlement.',
    longLabel: '🎰 DEGEN PLAYS',
    shortLabel: '🏦 BOOMER SAFETY',
  },
  'semiconductor-stranglehold': {
    thesis: 'Chip supply gets weaponized. Capacity winners squeeze valuation tourists.',
    overview: 'Semiconductor power rotation under supply-chain and policy pressure.',
    why: 'When chip access tightens, regional exposure and inventory quality matter more than narrative momentum.',
    model: 'Long resilient/onshore chip beta vs short crowded frontier chip + broad tech beta.',
    poweredBy: 'Pear execution + Hyperliquid settlement.',
    longLabel: '🧱 SUPPLY CONTROL',
    shortLabel: '⚠️ CROWDED CHIP BETA',
  },
  'api-armageddon': {
    thesis: 'One major API stack goes dark and everyone remembers concentration risk exists.',
    overview: 'Hard-money hedge basket vs platform dependency complex.',
    why: 'If cloud/app infra trust cracks, mega-cap platform multiples reprice first.',
    model: 'Long gold + resilient crypto rails vs short concentrated cloud/platform names.',
    poweredBy: 'Pear execution + Hyperliquid settlement.',
    longLabel: '🛡️ RESILIENCE',
    shortLabel: '☁️ PLATFORM DEPENDENCY',
  },
  'grid-down': {
    thesis: 'Grid stress is real economy pain. Capital rotates to defense, fuel, and hard hedges.',
    overview: 'Infrastructure stress trade: real-world security winners vs broad equity beta.',
    why: 'Extended outages hit productivity and confidence while hard-asset demand rises.',
    model: 'Long defense/energy hedge basket vs short broad index + platform beta.',
    poweredBy: 'Pear execution + Hyperliquid settlement.',
    longLabel: '⚡ HARD INFRA',
    shortLabel: '📉 FRAGILE BETA',
  },
  'internet-shutdown': {
    thesis: 'Fragmented internet means lower ad reach, weaker cloud confidence, and higher censorship premium.',
    overview: 'Connectivity-fracture trade: censorship-resistant rails vs ad-platform concentration.',
    why: 'When connectivity reliability drops, revenue models built on constant reach get punished.',
    model: 'Long BTC/XMR/HYPE resilience basket vs short ad + platform megacaps.',
    poweredBy: 'Pear execution + Hyperliquid settlement.',
    longLabel: '🔒 OFF-GRID RAILS',
    shortLabel: '📡 PLATFORM DEPENDENTS',
  },
  'sovereign-debt-spiral': {
    thesis: 'Sovereign confidence cracks fast. FX and risk assets bleed while hard hedges catch flows.',
    overview: 'Debt-stress spread: flight-to-safety assets vs euro/broad equity risk.',
    why: 'Refinancing stress and currency weakness usually land together in sovereign episodes.',
    model: 'Long gold/JPY/BTC defensive basket vs short EUR and broad equity beta.',
    poweredBy: 'Pear execution + Hyperliquid settlement.',
    longLabel: '🧯 FLIGHT TO SAFETY',
    shortLabel: '🧨 SOVEREIGN RISK',
  },
  'eth-vs-btc': {
    thesis: 'ETH wants to be global settlement. BTC wants to be digital gold. One ships apps, one sits there looking expensive.',
    overview: 'Execution and utility beta versus pure store-of-value reflex.',
    why: 'When risk appetite and onchain activity rise, ETH usually catches a stronger bid than BTC.',
    model: 'Simple relative-value pair: long ETH, short BTC.',
    poweredBy: 'Pear execution + Hyperliquid settlement.',
    longLabel: '⚙️ APP LAYER',
    shortLabel: '🪙 HARD MONEY',
  },
  'sol-vs-eth': {
    thesis: 'SOL is the speed degen chain. ETH is the institution chain. This is throughput hype versus blue-chip gravity.',
    overview: 'High-velocity alt beta against larger-cap smart-contract beta.',
    why: 'Narrative rotation between "fast and cheap" and "trusted and deep liquidity" drives this spread.',
    model: 'Simple relative-value pair: long SOL, short ETH.',
    poweredBy: 'Pear execution + Hyperliquid settlement.',
    longLabel: '⚡ SPEED LANE',
    shortLabel: '🏛️ OLD GUARD',
  },
  'hype-vs-btc': {
    thesis: 'HYPE is reflexive growth beta. BTC is macro reserve beta. Pick your religion.',
    overview: 'Exchange-native momentum versus the market benchmark.',
    why: 'When speculative flow is hot, HYPE can outrun BTC; when fear hits, BTC usually regains dominance.',
    model: 'Simple relative-value pair: long HYPE, short BTC.',
    poweredBy: 'Pear execution + Hyperliquid settlement.',
    longLabel: '🚀 REFLEXIVE BETA',
    shortLabel: '🛟 SAFETY BID',
  },
  'hype-vs-l1s': {
    thesis: 'HYPE keeps taking mindshare while legacy L1 beta fragments. Relative momentum stays with Hyperliquid.',
    overview: 'Single-conviction long vs diversified L1 short basket.',
    why: 'When one venue captures attention and flow, relative performance can diverge hard vs broad chain beta.',
    model: 'Long HYPE vs short ETH/SOL/AVAX/SUI/APT with equal weights on the short side.',
    poweredBy: 'Pear execution + Hyperliquid settlement.',
    longLabel: '🚀 HYPE CONVICTION',
    shortLabel: '🧺 L1 INDEX SHORT',
  },
  'defi-wars': {
    thesis: 'Morpho goes full efficiency mode while Aave carries the legacy premium. New rails versus incumbent gravity.',
    overview: 'A direct DeFi lender showdown: MORPHO momentum against AAVE durability.',
    why: 'When the market rewards capital efficiency and growth, MORPHO can re-rate faster than legacy lending beta.',
    model: 'Long MORPHO vs short AAVE as a 50/50 relative-value expression.',
    poweredBy: 'Pear execution + Hyperliquid settlement.',
    longLabel: '🧪 NEW SCHOOL',
    shortLabel: '🏦 LEGACY LENDER',
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
                    <span className="text-white font-bold">{symbolWithName(asset.asset)}</span>
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
                    <span className="text-white font-bold">{symbolWithName(asset.asset)}</span>
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
              <div className="text-sm font-mono text-white font-bold">{symbolWithName(market.pairs!.long)}</div>
            </div>
            <div>
              <div className="text-xs font-mono text-red-400 mb-2">{shortLabel}</div>
              <div className="text-sm font-mono text-white font-bold">{symbolWithName(market.pairs!.short)}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

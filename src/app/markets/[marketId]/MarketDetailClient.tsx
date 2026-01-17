'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { RiskShell } from '@/components/RiskShell';
import { TerminalTopNav } from '@/components/TerminalTopNav';
import { getMarketNarrative } from '@/components/MarketDetail';
import { useValidatedMarkets } from '@/hooks/useValidatedMarkets';

function titleCase(s: string) {
  return s
    .split(/[-_ ]+/g)
    .filter(Boolean)
    .map((p) => p.slice(0, 1).toUpperCase() + p.slice(1))
    .join(' ');
}

function formatBasket(assets: { asset: string; weight?: number }[]) {
  return assets
    .map((a) => {
      const sym = a.asset.includes(':') ? a.asset.split(':').pop()! : a.asset;
      return `${sym}${typeof a.weight === 'number' ? ` (${Math.round(a.weight * 100)}%)` : ''}`;
    })
    .join(' · ');
}

function cleanSymbol(s: string) {
  // Pear can return namespaced symbols like "xyz:INTC" or "km:US500".
  return s.split(':').pop()!.trim();
}

export default function MarketDetailClient({ marketId }: { marketId: string }) {
  const { markets } = useValidatedMarkets();
  const market = useMemo(() => markets.find((m) => m.id === marketId) ?? null, [markets, marketId]);
  const pageTitle = market ? `${titleCase(market.id)} — ${market.name.toUpperCase()}` : 'MARKET';

  if (!market) {
    return (
      <RiskShell subtitle="MARKET" nav={<TerminalTopNav />}>
        <div className="pear-border bg-black/40 p-6 font-mono text-sm text-gray-400">
          Market not found.{' '}
          <Link href="/markets" className="text-pear-lime underline">
            Return to markets
          </Link>
          .
        </div>
      </RiskShell>
    );
  }

  const resolvedPairs = market.resolvedPairs ?? market.pairs;
  const resolvedBasket = market.resolvedBasket ?? market.basket;
  const narrative = getMarketNarrative(market.id);

  return (
    <RiskShell
      subtitle="MARKET"
      nav={<TerminalTopNav />}
    >
      <div className="mb-6">
        <div className="text-3xl md:text-5xl font-mono font-bold tracking-widest text-pear-lime">
          {pageTitle}
        </div>
        <div className="mt-2 text-sm font-mono text-gray-500">{market.description}</div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="pear-border bg-black/40 p-6">
          <div className="text-sm font-mono text-gray-300 mb-4">[ LIVE METRICS ]</div>
          <div className="tm-box">
            <div className="tm-row">
              <div className="tm-k">Category</div>
              <div className="tm-v">{market.category}</div>
            </div>
            <div className="tm-row">
              <div className="tm-k">Leverage</div>
              <div className="tm-v text-pear-lime">{market.leverage}x</div>
            </div>
            <div className="tm-row">
              <div className="tm-k">Underlying</div>
              <div className="tm-v">
                {resolvedPairs
                  ? `${cleanSymbol(resolvedPairs.long)} vs ${cleanSymbol(resolvedPairs.short)}`
                  : resolvedBasket
                    ? `${resolvedBasket.long.map((x) => cleanSymbol(x.asset)).join(' + ')} vs ${resolvedBasket.short.map((x) => cleanSymbol(x.asset)).join(' + ')}`
                    : '—'}
              </div>
            </div>
            {market.isRemapped ? (
              <div className="tm-row">
                <div className="tm-k">Mode</div>
                <div className="tm-v text-yellow-200">DEMO REMAP</div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="pear-border bg-black/40 p-6">
          <div className="text-sm font-mono text-gray-300 mb-4">[ PLACE BET ]</div>
          <div className="text-xs font-mono text-gray-400 mb-4">
            Ready to trade this narrative? Head to the TRADE page to connect your wallet and execute.
          </div>

          <Link
            href="/trade"
            className="block text-center tm-btn w-full py-4"
          >
            GO TO TRADE
          </Link>
        </div>
      </div>

      <div className="mt-8 space-y-8">
        <section>
          <div className="text-pear-lime font-mono font-bold tracking-widest mb-3">OVERVIEW</div>
          <div className="text-sm font-mono text-gray-400 leading-relaxed">
            {narrative?.overview ?? `${market.name} expresses the narrative: ${market.description}.`}
          </div>
        </section>

        <section>
          <div className="text-pear-lime font-mono font-bold tracking-widest mb-3">WHY THIS INDEX MATTERS</div>
          <div className="text-sm font-mono text-gray-400 leading-relaxed">
            {narrative?.why ??
              'You’re not guessing “up or down” on one ticker — you’re taking a view on relative performance. This reduces direction noise and keeps the bet anchored to the narrative.'}
          </div>
        </section>

        <section>
          <div className="text-pear-lime font-mono font-bold tracking-widest mb-3">TRADING MODEL</div>
          <div className="text-sm font-mono text-gray-400 leading-relaxed">
            {narrative?.model ??
              `Execution runs through Pear Protocol’s agent wallet flow and places the underlying long/short legs on Hyperliquid. Leverage is fixed at ${market.leverage}x for this market.`}
          </div>
        </section>

        <section>
          <div className="text-pear-lime font-mono font-bold tracking-widest mb-3">INDEX COMPOSITION</div>
          <div className="pear-border bg-black/30 p-5 font-mono text-sm text-gray-300">
            {resolvedPairs ? (
              <div>
                Long: <span className="text-pear-lime">{cleanSymbol(resolvedPairs.long)}</span> · Short:{' '}
                <span className="text-red-300">{cleanSymbol(resolvedPairs.short)}</span>
              </div>
            ) : resolvedBasket ? (
              <div className="space-y-2">
                <div>
                  Long:{' '}
                  <span className="text-pear-lime">{formatBasket(resolvedBasket.long)}</span>
                </div>
                <div>
                  Short:{' '}
                  <span className="text-red-300">{formatBasket(resolvedBasket.short)}</span>
                </div>
              </div>
            ) : (
              <div>—</div>
            )}
          </div>
        </section>

        <section>
          <div className="text-pear-lime font-mono font-bold tracking-widest mb-3">POWERED BY</div>
          <div className="text-sm font-mono text-gray-400 leading-relaxed">
            {narrative?.poweredBy ? (
              narrative.poweredBy
            ) : (
              <>
                Built on <span className="text-pear-lime">Pear Protocol</span> execution with settlement on{' '}
                <span className="text-pear-lime">Hyperliquid</span>.
              </>
            )}
          </div>
        </section>

        <div>
          <Link href="/markets" className="text-pear-lime font-mono hover:underline">
            ← RETURN TO MARKETS
          </Link>
        </div>
      </div>
    </RiskShell>
  );
}


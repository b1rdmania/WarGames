'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { RiskShell } from '@/components/RiskShell';
import { TerminalTopNav } from '@/components/TerminalTopNav';
import { getMarketNarrative } from '@/components/MarketDetail';
import { useValidatedMarkets } from '@/hooks/useValidatedMarkets';
import styles from '@/components/MarketDetail.module.css';

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
  const pageTitle = market ? market.name.toUpperCase() : 'MARKET';
  const pageKicker = market ? titleCase(market.id) : '';

  if (!market) {
    return (
      <RiskShell nav={<TerminalTopNav />}>
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
  const overview = narrative?.overview ?? `${market.name} expresses the narrative: ${market.description}.`;

  return (
    <RiskShell nav={<TerminalTopNav />}>
      <div className={styles.hero}>
        <div className={styles.kicker}>SYSTEM STATUS: OPERATIONAL · MARKET DOSSIER</div>
        <div className={styles.title}>{pageTitle}</div>
        <div className={styles.subline}>
          <span className="text-gray-400">{pageKicker}</span>
          <span className="text-gray-600"> · </span>
          <span>{market.description}</span>
        </div>
        <div className={styles.callout}>
          <div className={styles.calloutLabel}>OVERVIEW</div>
          {overview}
        </div>
      </div>

      <div className={styles.grid}>
        <div className="pear-border bg-black/40 p-6">
          <div className={styles.panelTitle}>[ LIVE METRICS ]</div>
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
            {!market.isTradable ? (
              <>
                <div className="tm-row">
                  <div className="tm-k">Status</div>
                  <div className="tm-v text-yellow-200">INACTIVE</div>
                </div>
                {market.unavailableReason ? (
                  <div className="tm-row">
                    <div className="tm-k">Why</div>
                    <div className="tm-v text-yellow-200">{market.unavailableReason}</div>
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
        </div>

        <div className="pear-border bg-black/40 p-6">
          <div className={styles.panelTitle}>[ INDEX COMPOSITION ]</div>
          <div className={styles.compositionBox}>
            {resolvedPairs ? (
              <div>
                Long: <span className={styles.long}>{cleanSymbol(resolvedPairs.long)}</span> · Short:{' '}
                <span className={styles.short}>{cleanSymbol(resolvedPairs.short)}</span>
              </div>
            ) : resolvedBasket ? (
              <div className="space-y-2">
                <div>
                  Long: <span className={styles.long}>{formatBasket(resolvedBasket.long)}</span>
                </div>
                <div>
                  Short: <span className={styles.short}>{formatBasket(resolvedBasket.short)}</span>
                </div>
              </div>
            ) : (
              <div>—</div>
            )}
          </div>
          <div className="mt-4 text-xs font-mono text-gray-500">
            Browse-only page. Trading happens in the terminal.
          </div>
        </div>
      </div>

      <div className={styles.divider} />

      <div>
        <section className={styles.section}>
          <div className={styles.sectionTitle}>WHY THIS INDEX MATTERS</div>
          <div className={styles.sectionBody}>
            {narrative?.why ??
              'You’re not guessing “up or down” on one ticker — you’re taking a view on relative performance. This reduces direction noise and keeps the bet anchored to the narrative.'}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionTitle}>TRADING MODEL</div>
          <div className={styles.sectionBody}>
            {narrative?.model ??
              `Execution runs through Pear Protocol’s agent wallet flow and places the underlying long/short legs on Hyperliquid. Leverage is fixed at ${market.leverage}x for this market.`}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionTitle}>POWERED BY</div>
          <div className={styles.sectionBody}>
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

        <Link href="/markets" className={styles.backLink}>
          ← RETURN TO MARKETS
        </Link>
      </div>
    </RiskShell>
  );
}


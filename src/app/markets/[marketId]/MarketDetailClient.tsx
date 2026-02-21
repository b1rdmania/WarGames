'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useValidatedMarkets } from '@/hooks/useValidatedMarkets';
import { getMarketNarrative } from '@/components/MarketDetail';
import { formatPairOrBasketSide, sideBalanceLabel, symbolWithName } from '@/lib/marketDisplay';
import {
  TerminalShell,
  TerminalMenuBar,
  TerminalPaneTitle,
  TerminalCommandBar,
  TerminalStatusBar,
  TerminalButton,
  TerminalTitle,
  TerminalThesis,
  TerminalKV,
  TerminalKVRow,
  TerminalSessionBadge,
} from '@/components/terminal';

function formatWeight(w: number) {
  return `${Math.round(w * 100)}%`;
}

export default function MarketDetailClient({ marketId }: { marketId: string }) {
  const { markets } = useValidatedMarkets();
  const market = useMemo(() => markets.find((m) => m.id === marketId) ?? null, [markets, marketId]);

  if (!market) {
    return (
      <TerminalShell
        statusBar={<TerminalStatusBar items={[{ label: 'STATE', value: 'ERROR' }]} />}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center', maxWidth: '420px' }}>
            <TerminalTitle>MARKET NOT FOUND</TerminalTitle>
            <p style={{ color: '#a8b4af', marginTop: '16px', marginBottom: '24px' }}>
              The requested market does not exist or has been removed.
            </p>
            <Link href="/markets">
              <TerminalButton variant="primary" fullWidth>RETURN TO MARKETS</TerminalButton>
            </Link>
          </div>
        </div>
      </TerminalShell>
    );
  }

  const resolvedPairs = market.resolvedPairs ?? market.pairs;
  const resolvedBasket = market.resolvedBasket ?? market.basket;
  const sideLabels = sideBalanceLabel(market);
  const narrative = getMarketNarrative(market.id);
  const overview = narrative?.overview ?? market.description;

  return (
    <TerminalShell
      menuBar={<TerminalMenuBar items={[]} right={<TerminalSessionBadge />} />}
      leftPane={
        <>
          <TerminalPaneTitle>MARKET INTELLIGENCE</TerminalPaneTitle>
          <TerminalTitle>{market.name}</TerminalTitle>
          <TerminalThesis>{overview}</TerminalThesis>
          <TerminalKV>
            <TerminalKVRow label="CATEGORY" value={market.category?.toUpperCase() || 'N/A'} />
            <TerminalKVRow label="LEVERAGE" value={`${market.effectiveLeverage ?? market.leverage}x`} />
            <TerminalKVRow label="STATUS" value={market.isTradable ? 'LIVE' : 'PAUSED'} />
          </TerminalKV>
          {narrative?.why && (
            <>
              <div style={{ marginTop: '20px', color: '#02ff81', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                STRATEGIC RATIONALE
              </div>
              <TerminalThesis>{narrative.why}</TerminalThesis>
            </>
          )}
        </>
      }
      centerPane={
        <>
          <TerminalPaneTitle>INDEX COMPOSITION</TerminalPaneTitle>
          {resolvedPairs ? (
            <TerminalKV>
              <TerminalKVRow label={sideLabels.long} value={formatPairOrBasketSide(market, 'long')} />
              <TerminalKVRow label={sideLabels.short} value={formatPairOrBasketSide(market, 'short')} />
            </TerminalKV>
          ) : resolvedBasket ? (
            <>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ color: '#02ff81', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  {sideLabels.long}
                </div>
                {resolvedBasket.long.map((a) => (
                  <div key={a.asset} style={{ color: '#dfe9e4', fontSize: '12px', marginBottom: '4px' }}>
                    {symbolWithName(a.asset)} ({formatWeight(a.weight)})
                  </div>
                ))}
              </div>
              <div>
                <div style={{ color: '#02ff81', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  {sideLabels.short}
                </div>
                {resolvedBasket.short.map((a) => (
                  <div key={a.asset} style={{ color: '#dfe9e4', fontSize: '12px', marginBottom: '4px' }}>
                    {symbolWithName(a.asset)} ({formatWeight(a.weight)})
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ color: '#8da294' }}>—</div>
          )}
          {narrative?.model && (
            <>
              <div style={{ marginTop: '20px', color: '#02ff81', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                EXECUTION MODEL
              </div>
              <TerminalThesis>{narrative.model}</TerminalThesis>
            </>
          )}
        </>
      }
      rightPane={
        <>
          <TerminalPaneTitle>ACTIONS</TerminalPaneTitle>
          <Link href="/trade">
            <TerminalButton variant="primary" fullWidth>TRADE THIS MARKET</TerminalButton>
          </Link>
          <Link href="/markets">
            <TerminalButton fullWidth>← BACK TO MARKETS</TerminalButton>
          </Link>
        </>
      }
      commandBar={
        <TerminalCommandBar
          commands={[
            { key: 'F1', label: 'HELP' },
            { key: 'F2', label: 'MARKETS' },
            { key: 'F3', label: 'TRADE' },
            { key: 'F4', label: 'PORTFOLIO' },
            { key: 'F9', label: 'BACK' },
            { key: 'F10', label: 'EXECUTE' },
          ]}
        />
      }
      statusBar={
        <TerminalStatusBar
          items={[
            { label: 'MARKET', value: market.id.toUpperCase().replace(/-/g, '_') },
            { label: 'LEVERAGE', value: `${market.effectiveLeverage ?? market.leverage}x` },
            { label: 'MODE', value: 'INTEL' },
            { label: 'STATUS', value: market.isTradable ? 'LIVE' : 'PAUSED' },
          ]}
        />
      }
    />
  );
}

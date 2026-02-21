'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useValidatedMarkets } from '@/hooks/useValidatedMarkets';
import { getMarketNarrative } from '@/components/MarketDetail';
import { GC } from '@/app/labs/geocities-gifs';
import { formatPairOrBasketSide, sideBalanceLabel } from '@/lib/marketDisplay';
import {
  TerminalShell,
  TerminalMenuBar,
  TerminalPaneTitle,
  TerminalCommandBar,
  TerminalStatusBar,
  TerminalButton,
  TerminalMarketList,
  TerminalMarketRow,
  TerminalTitle,
  TerminalThesis,
  TerminalKV,
  TerminalKVRow,
  TerminalSessionBadge,
} from '@/components/terminal';

export default function MarketsClient() {
  const { markets: validatedMarkets } = useValidatedMarkets();
  const effectiveMarkets = (validatedMarkets ?? []).filter(m => m.category !== 'crypto');
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(effectiveMarkets[0]?.id ?? null);

  const selectedMarket = effectiveMarkets.find(m => m.id === selectedMarketId) ?? null;
  const narrative = selectedMarket ? getMarketNarrative(selectedMarket.id) : null;

  return (
    <TerminalShell
      menuBar={<TerminalMenuBar items={[]} right={<TerminalSessionBadge />} />}
      leftPane={
        <>
          <TerminalPaneTitle>
            <img src={GC.earthSpin} width={20} height={20} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            MARKET DIRECTORY
          </TerminalPaneTitle>
          <TerminalMarketList>
            {effectiveMarkets.map((market) => (
              <TerminalMarketRow
                key={market.id}
                code={market.id.toUpperCase().replace(/-/g, '_')}
                status={market.isTradable ? 'LIVE' : 'PAUSED'}
                active={selectedMarketId === market.id}
                onClick={() => setSelectedMarketId(market.id)}
              />
            ))}
          </TerminalMarketList>
        </>
      }
      centerPane={
        <>
          <TerminalPaneTitle>
            MARKET DETAILS
          </TerminalPaneTitle>
          {selectedMarket ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <img src={GC.explosion} width={32} height={32} alt="" />
                <TerminalTitle style={{ margin: 0 }}>{selectedMarket.name}</TerminalTitle>
              </div>
              <TerminalThesis>{narrative?.overview ?? selectedMarket.description}</TerminalThesis>
              <TerminalKV>
                <TerminalKVRow
                  label="CATEGORY"
                  value={selectedMarket.category?.toUpperCase() || 'N/A'}
                />
                <TerminalKVRow
                  label="LEVERAGE"
                  value={`${selectedMarket.effectiveLeverage ?? selectedMarket.leverage}x`}
                />
                <TerminalKVRow
                  label="STATUS"
                  value={selectedMarket.isTradable ? 'LIVE' : 'PAUSED'}
                />
                <TerminalKVRow
                  label={sideBalanceLabel(selectedMarket).long}
                  value={formatPairOrBasketSide(selectedMarket, 'long')}
                />
                <TerminalKVRow
                  label={sideBalanceLabel(selectedMarket).short}
                  value={formatPairOrBasketSide(selectedMarket, 'short')}
                />
              </TerminalKV>
            </>
          ) : (
            <div style={{ color: '#8da294', marginTop: '20px' }}>SELECT A MARKET TO VIEW DETAILS</div>
          )}
        </>
      }
      rightPane={
        <>
          <TerminalPaneTitle>
            <img src={GC.sparkle1} width={20} height={20} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            ACTIONS
          </TerminalPaneTitle>
          {selectedMarket && (
            <>
              <Link href={`/markets/${selectedMarket.id}`}>
                <TerminalButton fullWidth>
                  FULL INTELLIGENCE →
                </TerminalButton>
              </Link>
              <Link href="/trade">
                <TerminalButton variant="primary" fullWidth>
                  <img src={GC.fire1} width={18} height={18} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                  GO TO TRADE
                </TerminalButton>
              </Link>
            </>
          )}
        </>
      }
      commandBar={
        <TerminalCommandBar
          commands={[
            { key: 'F1', label: 'HELP' },
            { key: 'F2', label: 'MARKETS' },
            { key: 'F3', label: 'TRADE' },
            { key: 'F4', label: 'PORTFOLIO' },
            { key: 'F5', label: 'INTEL' },
            { key: 'F10', label: 'DETAIL' },
          ]}
        />
      }
      statusBar={
        <TerminalStatusBar
          items={[
            { label: 'MARKETS', value: effectiveMarkets.length.toString() },
            { label: 'SELECTED', value: selectedMarket?.name || 'NONE' },
            { label: 'MODE', value: 'BROWSE' },
            { label: 'STATE', value: 'ARMED' },
          ]}
        />
      }
    />
  );
}

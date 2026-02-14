'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useValidatedMarkets } from '@/hooks/useValidatedMarkets';
import { getMarketNarrative } from '@/components/MarketDetail';
import { GC } from '@/app/labs/geocities-gifs';
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
} from '@/components/terminal';

function cleanSymbol(s: string) {
  return s.split(':').pop()!.trim();
}

export default function MarketsClient() {
  const { markets: validatedMarkets } = useValidatedMarkets();
  const effectiveMarkets = (validatedMarkets ?? []).filter(m => m.category !== 'crypto');
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(effectiveMarkets[0]?.id ?? null);

  const selectedMarket = effectiveMarkets.find(m => m.id === selectedMarketId) ?? null;
  const narrative = selectedMarket ? getMarketNarrative(selectedMarket.id) : null;

  return (
    <TerminalShell
      menuBar={<TerminalMenuBar items={['FILE', 'BROWSE', 'DETAIL', 'INTEL', 'HELP']} />}
      leftPane={
        <>
          <TerminalPaneTitle>
            <img src={GC.danger} width={18} height={18} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            <img src={GC.globeSmall} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            MARKET DIRECTORY
            <img src={GC.oilFire} width={18} height={18} alt="" style={{ verticalAlign: 'middle', marginLeft: '6px' }} />
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
            <img src={GC.alert} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            MARKET DETAILS
            <img src={GC.alert} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginLeft: '6px' }} />
          </TerminalPaneTitle>
          {selectedMarket ? (
            <>
              <TerminalTitle>
                <img src={GC.blast} width={18} height={18} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                {selectedMarket.name}
                <img src={GC.blast} width={18} height={18} alt="" style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
              </TerminalTitle>
              <TerminalThesis>{narrative?.overview ?? selectedMarket.description}</TerminalThesis>
              <TerminalKV>
                <TerminalKVRow
                  label={<><img src={GC.warning} width={12} height={12} alt="" style={{ verticalAlign: 'middle', marginRight: '4px' }} />CATEGORY</>}
                  value={selectedMarket.category?.toUpperCase() || 'N/A'}
                />
                <TerminalKVRow
                  label={<><img src={GC.danger} width={12} height={12} alt="" style={{ verticalAlign: 'middle', marginRight: '4px' }} />LEVERAGE</>}
                  value={`${selectedMarket.leverage}x`}
                />
                <TerminalKVRow
                  label={<><img src={GC.impact} width={12} height={12} alt="" style={{ verticalAlign: 'middle', marginRight: '4px' }} />STATUS</>}
                  value={selectedMarket.isTradable ? 'ACTIVE' : 'INACTIVE'}
                />
                <TerminalKVRow
                  label="LONG"
                  value={
                    selectedMarket.pairs
                      ? cleanSymbol(selectedMarket.pairs.long)
                      : selectedMarket.basket
                      ? selectedMarket.basket.long.map(a => cleanSymbol(a.asset)).join('+')
                      : '—'
                  }
                />
                <TerminalKVRow
                  label="SHORT"
                  value={
                    selectedMarket.pairs
                      ? cleanSymbol(selectedMarket.pairs.short)
                      : selectedMarket.basket
                      ? selectedMarket.basket.short.map(a => cleanSymbol(a.asset)).join('+')
                      : '—'
                  }
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
            <img src={GC.missile} width={18} height={18} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            <img src={GC.starBurst} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            ACTIONS
            <img src={GC.alert} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginLeft: '6px' }} />
          </TerminalPaneTitle>
          {selectedMarket && (
            <>
              <Link href={`/markets/${selectedMarket.id}`}>
                <TerminalButton fullWidth>
                  <img src={GC.signal} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                  <img src={GC.explosion} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                  FULL INTELLIGENCE →
                </TerminalButton>
              </Link>
              <Link href="/trade">
                <TerminalButton variant="primary" fullWidth>
                  <img src={GC.cash} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                  <img src={GC.stock} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                  GO TO TRADE
                  <img src={GC.fire1} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginLeft: '6px' }} />
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

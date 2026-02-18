'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { PearSetupCard } from '@/components/PearSetupCard';
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
  TerminalSegment,
  TerminalSessionBadge,
} from '@/components/terminal';
import { usePear } from '@/contexts/PearContext';
import { useValidatedMarkets } from '@/hooks/useValidatedMarkets';
import { useVaultBalances } from '@/hooks/useVaultBalances';
import { getMarketNarrative } from '@/components/MarketDetail';
import { connectWalletSafely } from '@/lib/connectWallet';
import { GC } from '@/app/labs/geocities-gifs';
import { executePosition } from '@/integrations/pear/positions';
import { logTradeStatEvent } from '@/lib/stats/client';

function cleanSymbol(s: string) {
  return s.split(':').pop()!.trim();
}

const MARKET_GROUP_ORDER = ['macro', 'geopolitical', 'commodities', 'crypto', 'tech'] as const;
type MarketGroup = (typeof MARKET_GROUP_ORDER)[number];
const MARKET_GROUP_LABEL: Record<MarketGroup, string> = {
  macro: 'MACRO',
  geopolitical: 'GEOPOLITICS',
  commodities: 'COMMODITIES',
  crypto: 'CRYPTO',
  tech: 'DEGEN',
};

function marketGroupKey(market: { id: string; category: string; basket?: { long: Array<{ asset: string }> } }): MarketGroup {
  if (market.id === 'taiwan-strait-crisis' || market.id === 'middle-east-oil-shock') return 'geopolitical';
  if (market.category === 'macro') return 'macro';
  if (market.category === 'geopolitical') return 'geopolitical';
  if (market.category === 'crypto') return 'crypto';
  return 'tech';
}

export default function TradeClient() {
  const { isConnected, address } = useAccount();
  const { connectAsync, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { accessToken, isAuthenticated } = usePear();
  const { perpUsdc } = useVaultBalances(accessToken);
  const { markets: effectiveMarkets } = useValidatedMarkets();

  const [selectedMarketId, setSelectedMarketId] = useState<string | null>('risk-on-risk-off');
  const [side, setSide] = useState<'YES' | 'NO'>('YES');
  const [size, setSize] = useState(50);
  const [leverage, setLeverage] = useState(
    effectiveMarkets?.[0]?.effectiveLeverage ?? effectiveMarkets?.[0]?.leverage ?? 1
  );
  const [isExecuting, setIsExecuting] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<MarketGroup, boolean>>({
    macro: false,
    geopolitical: false,
    commodities: false,
    crypto: false,
    tech: false,
  });

  const selectedMarket = effectiveMarkets?.find((m) => m.id === selectedMarketId) ?? null;
  const narrative = selectedMarket ? getMarketNarrative(selectedMarket.id) : null;
  const availableMargin = isAuthenticated && perpUsdc ? Math.max(0, Number(perpUsdc)) : null;
  const maxPermittedLeverage = selectedMarket
    ? (selectedMarket.maxAllowedLeverage ?? selectedMarket.effectiveLeverage ?? selectedMarket.leverage)
    : 1;
  const notional = Number.isFinite(size * leverage) ? size * leverage : 0;
  const canExecute =
    Boolean(selectedMarket && selectedMarket.isTradable) &&
    size > 0 &&
    (availableMargin === null || size <= availableMargin);
  const groupedMarkets = useMemo(() => {
    const groups: Record<MarketGroup, typeof effectiveMarkets> = {
      macro: [],
      geopolitical: [],
      commodities: [],
      crypto: [],
      tech: [],
    };
    for (const market of effectiveMarkets ?? []) {
      const key = marketGroupKey(market);
      groups[key].push(market);
    }
    return groups;
  }, [effectiveMarkets]);

  const handleExecute = async () => {
    if (!accessToken || !selectedMarket || !canExecute || isExecuting) return;
    const clampedLeverage = Math.max(1, Math.min(leverage, maxPermittedLeverage));
    const notionalUsd = size * clampedLeverage;

    await logTradeStatEvent({
      wallet: address,
      marketId: selectedMarket.id,
      side,
      sizeUsd: size,
      leverage: clampedLeverage,
      notionalUsd,
      status: 'attempted',
    });

    try {
      setIsExecuting(true);
      const result = await executePosition(accessToken, {
        marketId: selectedMarket.id,
        side: side === 'YES' ? 'long' : 'short',
        amount: String(size),
        leverage: clampedLeverage,
        resolvedPairs: selectedMarket.resolvedPairs,
        resolvedBasket: selectedMarket.resolvedBasket,
      });

      await logTradeStatEvent({
        wallet: address,
        marketId: selectedMarket.id,
        side,
        sizeUsd: size,
        leverage: clampedLeverage,
        notionalUsd,
        status: 'success',
        orderId: result.orderId,
      });
      toast.success('Position executed');
    } catch (e) {
      const message = (e as Error).message || 'Execution failed';
      await logTradeStatEvent({
        wallet: address,
        marketId: selectedMarket.id,
        side,
        sizeUsd: size,
        leverage: clampedLeverage,
        notionalUsd,
        status: 'failed',
        error: message,
      });
      toast.error(message);
    } finally {
      setIsExecuting(false);
    }
  };

  // Right pane content based on auth state
  const renderRightPane = () => {
    if (!isConnected) {
      return (
        <>
          <TerminalPaneTitle>EXECUTION TICKET</TerminalPaneTitle>
          <div style={{ padding: '20px 0', textAlign: 'center' }}>
            <TerminalTitle style={{ fontSize: '16px', marginBottom: '12px' }}>AUTHENTICATION REQUIRED</TerminalTitle>
            <p style={{ color: '#a8b4af', marginBottom: '20px', lineHeight: '1.5', fontSize: '14px' }}>
              Connect your wallet to execute trades.
            </p>
            <TerminalButton
              variant="primary"
              fullWidth
              disabled={isPending}
              onClick={() => {
                (async () => {
                  try {
                    await connectWalletSafely({ connectors, connectAsync, disconnect });
                  } catch (e) {
                    console.error(e);
                    toast.error((e as Error).message || 'Failed to connect wallet');
                  }
                })();
              }}
            >
              {isPending ? 'CONNECTING…' : 'CONNECT WALLET'}
            </TerminalButton>
          </div>
        </>
      );
    }

    if (!isAuthenticated) {
      return (
        <>
          <TerminalPaneTitle>EXECUTION TICKET</TerminalPaneTitle>
          <div style={{ padding: '20px 0' }}>
            <PearSetupCard />
          </div>
        </>
      );
    }

    // Fully authenticated - show execution ticket
    return (
      <>
        <TerminalPaneTitle>EXECUTION TICKET</TerminalPaneTitle>
        <div style={{ color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
          DIRECTION
        </div>
        <TerminalSegment
          options={[
            { value: 'YES', label: 'YES / THESIS' },
            { value: 'NO', label: 'NO / FADE' },
          ]}
          value={side}
          onChange={(v) => setSide(v as 'YES' | 'NO')}
        />
        <div style={{ marginTop: '10px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
            <span>SIZE ${size.toFixed(0)}</span>
            <span>AVAIL {availableMargin !== null ? `$${availableMargin.toFixed(2)}` : '—'}</span>
          </div>
          <input
            type="range"
            min={1}
            step={1}
            max={Math.max(1, Math.floor(availableMargin ?? 1000))}
            value={Number.isFinite(size) ? size : 50}
            onChange={(e) => {
              const next = Number(e.target.value);
              if (!Number.isFinite(next)) {
                setSize(50);
                return;
              }
              setSize(Math.max(1, Math.round(next)));
            }}
            style={{
              width: '100%',
              accentColor: 'var(--primary)',
            }}
          />
        </div>
        {selectedMarket && (
          <div style={{ marginTop: '10px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
              LEVERAGE {leverage}x
            </div>
            <input
              type="range"
              min={1}
              max={maxPermittedLeverage}
              step={1}
              value={leverage}
              onChange={(e) => setLeverage(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)' }}
            />
          </div>
        )}
        <div style={{ marginTop: '10px', color: 'var(--text-muted)', fontSize: '10px', lineHeight: 1.5 }}>
          <div>
            NOTIONAL ${notional.toFixed(2)} · MAX {maxPermittedLeverage}x
          </div>
          {availableMargin !== null && size > availableMargin ? (
            <div style={{ color: 'var(--loss)' }}>INSUFFICIENT MARGIN FOR THIS SIZE</div>
          ) : null}
        </div>
        <TerminalButton
          variant="primary"
          fullWidth
          disabled={!selectedMarket || !canExecute || isExecuting}
          onClick={handleExecute}
        >
          {isExecuting ? 'EXECUTING…' : 'EXECUTE POSITION'}
        </TerminalButton>
      </>
    );
  };

  // 3-pane layout always visible
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
            {MARKET_GROUP_ORDER.map((category) => {
              const markets = groupedMarkets[category] ?? [];
              if (markets.length === 0) return null;
              const expanded = expandedGroups[category] ?? true;
              return (
                <div key={category}>
                  <button
                    type="button"
                    onClick={() => setExpandedGroups((prev) => ({ ...prev, [category]: !expanded }))}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      border: '1px solid var(--border)',
                      background: 'var(--bg-warm)',
                      color: 'var(--text-secondary)',
                      padding: '8px 10px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      marginTop: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    {expanded ? '▾' : '▸'} {MARKET_GROUP_LABEL[category]}
                  </button>
                  {expanded
                    ? markets.map((market) => (
                        <TerminalMarketRow
                          key={market.id}
                          code={market.id.toUpperCase().replace(/-/g, '_')}
                          status={market.isTradable ? 'LIVE' : 'PAUSED'}
                          active={selectedMarketId === market.id}
                          onClick={() => {
                            setSelectedMarketId(market.id);
                            setLeverage(market.effectiveLeverage ?? market.leverage);
                          }}
                        />
                      ))
                    : null}
                </div>
              );
            })}
          </TerminalMarketList>
        </>
      }
      centerPane={
        <>
          <TerminalPaneTitle>THESIS CONSOLE</TerminalPaneTitle>
          {selectedMarket ? (
            <>
              <TerminalTitle>{selectedMarket.name}</TerminalTitle>
              <TerminalThesis>{narrative?.thesis ?? selectedMarket.description}</TerminalThesis>
              <TerminalKV>
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
                <TerminalKVRow label="LEVERAGE" value={`${selectedMarket.effectiveLeverage ?? selectedMarket.leverage}x`} />
                <TerminalKVRow label="CATEGORY" value={selectedMarket.category?.toUpperCase() || 'N/A'} />
              </TerminalKV>
              <div style={{ marginTop: '16px' }}>
                <Link href={`/markets/${selectedMarket.id}`}>
                  <TerminalButton fullWidth>
                    <img src={GC.signal} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                    FULL INTELLIGENCE →
                  </TerminalButton>
                </Link>
              </div>
            </>
          ) : (
            <div style={{ color: '#8da294', marginTop: '20px' }}>SELECT A MARKET TO VIEW DETAILS</div>
          )}
        </>
      }
      rightPane={renderRightPane()}
      commandBar={
        <TerminalCommandBar
          commands={[
            { key: 'F1', label: 'HELP' },
            { key: 'F2', label: 'MARKETS' },
            { key: 'F3', label: 'TRADE' },
            { key: 'F4', label: 'PORTFOLIO' },
            { key: 'F9', label: 'ARM' },
            { key: 'F10', label: 'EXECUTE' },
          ]}
        />
      }
      statusBar={
        <TerminalStatusBar
          items={[
            { label: 'SESSION', value: isAuthenticated ? 'OPERATOR' : 'BROWSE' },
            { label: 'BALANCE', value: isAuthenticated && perpUsdc ? `$${Number(perpUsdc).toFixed(2)}` : '—' },
            { label: 'STATE', value: isAuthenticated ? (side === 'YES' ? 'THESIS ARMED' : 'FADE MODE') : 'READ-ONLY' },
            { label: 'OPERATOR', value: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'GUEST' },
          ]}
        />
      }
    />
  );
}

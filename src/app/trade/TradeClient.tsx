'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { getGifPath } from '@/lib/gifPaths';
import { closePositionVerified, executePosition, getActivePositions } from '@/integrations/pear/positions';
import type { PearPosition } from '@/integrations/pear/types';
import { logTradeStatEvent } from '@/lib/stats/client';
import { getHyperliquidPortfolioUrl, getPearPositionUrl } from '@/integrations/pear/links';
import { formatPairOrBasketSide, sideBalanceLabel } from '@/lib/marketDisplay';

const SESSION_GATED_PREFIXES = ['xyz:', 'vntl:', 'km:'];

function isSessionGatedAsset(asset: string): boolean {
  const normalized = asset.trim().toLowerCase();
  return SESSION_GATED_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}

function isLikelyUsSessionOpenNow(): boolean {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour12: false,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).formatToParts(new Date());

  const weekday = parts.find((p) => p.type === 'weekday')?.value ?? 'Mon';
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? '0');
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? '0');
  const isWeekday = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(weekday);
  if (!isWeekday) return false;
  const minutes = hour * 60 + minute;
  return minutes >= 9 * 60 + 30 && minutes < 16 * 60;
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
  const { accessToken, isAuthenticated, agentWalletApproval } = usePear();
  const { perpUsdc } = useVaultBalances(accessToken);
  const { markets: effectiveMarkets } = useValidatedMarkets();

  const [selectedMarketId, setSelectedMarketId] = useState<string | null>('risk-on-risk-off');
  const [side, setSide] = useState<'YES' | 'NO'>('YES');
  const [size, setSize] = useState(50);
  const [leverage, setLeverage] = useState(
    effectiveMarkets?.[0]?.effectiveLeverage ?? effectiveMarkets?.[0]?.leverage ?? 1
  );
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [openPositions, setOpenPositions] = useState<PearPosition[]>([]);
  const [loadingOpenPositions, setLoadingOpenPositions] = useState(false);
  const [closingPositionId, setClosingPositionId] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Record<MarketGroup, boolean>>({
    macro: false,
    geopolitical: false,
    commodities: false,
    crypto: false,
    tech: false,
  });

  const selectedMarket = effectiveMarkets?.find((m) => m.id === selectedMarketId) ?? null;
  const selectedSideLabels = selectedMarket ? sideBalanceLabel(selectedMarket) : { long: 'LONG', short: 'SHORT' };
  const narrative = selectedMarket ? getMarketNarrative(selectedMarket.id) : null;
  const selectedAssets = selectedMarket
    ? selectedMarket.pairs
      ? [selectedMarket.pairs.long, selectedMarket.pairs.short]
      : [
          ...(selectedMarket.basket?.long.map((a) => a.asset) ?? []),
          ...(selectedMarket.basket?.short.map((a) => a.asset) ?? []),
        ]
    : [];
  const isSessionGatedMarket = selectedAssets.some((asset) => isSessionGatedAsset(asset));
  const isLikelySessionOpen = isSessionGatedMarket ? isLikelyUsSessionOpenNow() : true;
  const availableMargin = isAuthenticated && perpUsdc ? Math.max(0, Number(perpUsdc)) : null;
  const maxPermittedLeverage = selectedMarket
    ? (selectedMarket.maxAllowedLeverage ?? selectedMarket.effectiveLeverage ?? selectedMarket.leverage)
    : 1;
  const notional = Number.isFinite(size * leverage) ? size * leverage : 0;
  const canExecute =
    Boolean(selectedMarket && selectedMarket.isTradable) &&
    size > 0 &&
    (availableMargin === null || size <= availableMargin) &&
    agentWalletApproval !== 'pending';
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
  const earthSpinGif = getGifPath('earth-spin', GC.earthSpin);
  const nuclearGif = getGifPath('nuclear', GC.nuclear);
  const satelliteFiveGif = getGifPath('satellite-5', '/gifs/library/intel/satellite-5.gif');
  const dollarGif = getGifPath('dollar-2', '/gifs/library/markets/dollar-2.gif');

  useEffect(() => {
    if (!accessToken) {
      setOpenPositions([]);
      return;
    }
    let cancelled = false;
    const load = async (silent = false) => {
      try {
        if (!silent) setLoadingOpenPositions(true);
        const positions = await getActivePositions(accessToken);
        if (cancelled) return;
        setOpenPositions(positions);
      } catch (e) {
        if (!silent) {
          toast.error((e as Error).message || 'Failed to load open positions');
        }
      } finally {
        if (!silent && !cancelled) setLoadingOpenPositions(false);
      }
    };
    void load(false);
    const timer = window.setInterval(() => {
      void load(true);
    }, 45000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [accessToken]);

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
      try {
        const positions = await getActivePositions(accessToken);
        setOpenPositions(positions);
      } catch {
        // Non-blocking; status toast already shown for execution.
      }
      toast.success('Position executed');
      setExecutionError(null);
    } catch (e) {
      const message = (e as Error).message || 'Execution failed';
      setExecutionError(message);
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

  const handleClosePosition = async (positionId: string) => {
    if (!accessToken || closingPositionId) return;
    try {
      setClosingPositionId(positionId);
      const result = await closePositionVerified(accessToken, positionId);
      const positions = await getActivePositions(accessToken);
      setOpenPositions(positions);
      if (result.verifiedClosed) {
        toast.success('Position closed');
      } else {
        toast.error('Close submitted but position still appears open. Please refresh and verify on Hyperliquid.');
      }
    } catch (e) {
      toast.error((e as Error).message || 'Failed to close position');
    } finally {
      setClosingPositionId(null);
    }
  };

  const switchToCryptoMarket = () => {
    const firstCrypto = (effectiveMarkets ?? []).find((m) => m.category === 'crypto');
    if (!firstCrypto) return;
    setExpandedGroups((prev) => ({ ...prev, crypto: true }));
    setSelectedMarketId(firstCrypto.id);
    setLeverage(firstCrypto.effectiveLeverage ?? firstCrypto.leverage);
    setExecutionError(null);
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

    if (!isAuthenticated || agentWalletApproval === 'pending') {
      return (
        <>
          <TerminalPaneTitle>EXECUTION TICKET</TerminalPaneTitle>
          <div style={{ padding: '20px 0' }}>
            {agentWalletApproval === 'pending' ? (
              <div style={{ color: 'var(--loss)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
                Approval pending: complete Hyperliquid agent-wallet approval first.
              </div>
            ) : null}
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
          <div style={{ marginBottom: '8px', color: 'var(--text-muted)', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {isSessionGatedMarket
              ? `TRADING HOURS: WEEKDAYS (US SESSION) · ${isLikelySessionOpen ? 'OPEN NOW' : 'LIKELY CLOSED NOW'}`
              : 'TRADING HOURS: 24/7'}
          </div>
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
        {executionError ? (
          <div
            style={{
              marginTop: '8px',
              border: '1px solid var(--border)',
              background: 'var(--bg-deep)',
              padding: '8px',
              fontSize: '10px',
              lineHeight: 1.5,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            <div style={{ color: 'var(--loss)' }}>EXECUTION MESSAGE: {executionError}</div>
            {isSessionGatedMarket ? (
              <button
                type="button"
                onClick={switchToCryptoMarket}
                style={{
                  marginTop: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-warm)',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  padding: '6px 8px',
                  cursor: 'pointer',
                }}
              >
                Switch to 24/7 Markets
              </button>
            ) : null}
          </div>
        ) : null}
        <TerminalButton
          variant="primary"
          fullWidth
          disabled={!selectedMarket || !canExecute || isExecuting}
          onClick={handleExecute}
        >
          {isExecuting ? 'EXECUTING…' : 'EXECUTE POSITION'}
        </TerminalButton>
        <div
          aria-hidden="true"
          style={{
            marginTop: '14px',
            paddingTop: '12px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            opacity: 0.9,
          }}
        >
          <span
            style={{
              width: '54px',
              height: '40px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={dollarGif}
              width={44}
              height={32}
              alt=""
              style={{ imageRendering: 'pixelated', display: 'block', objectFit: 'contain' }}
            />
          </span>
        </div>
      </>
    );
  };

  // 3-pane layout always visible
  return (
    <TerminalShell
      menuBar={<TerminalMenuBar items={[]} right={<TerminalSessionBadge />} />}
      leftPane={
        <>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
              <TerminalPaneTitle>
                <span
                  style={{
                    width: '20px',
                    height: '20px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    verticalAlign: 'middle',
                    marginRight: '8px',
                  }}
                >
                  <img src={earthSpinGif} width={20} height={20} alt="" style={{ display: 'block' }} />
                </span>
                MARKET DIRECTORY
              </TerminalPaneTitle>
              <span
                style={{
                  width: '20px',
                  height: '20px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.9,
                }}
              >
                <img
                  src={nuclearGif}
                  width={20}
                  height={20}
                  alt=""
                  style={{ imageRendering: 'pixelated', maxWidth: '100%', maxHeight: '100%', display: 'block' }}
                />
              </span>
            </div>
            <div style={{ marginBottom: '10px' }} />
            <TerminalMarketList>
              {MARKET_GROUP_ORDER.map((category) => {
                const markets = groupedMarkets[category] ?? [];
                if (markets.length === 0) return null;
                const expanded = expandedGroups[category] ?? true;
                return (
                  <div
                    key={category}
                    style={{
                      marginTop: '10px',
                      border: '1px solid var(--border)',
                      background: 'var(--bg-deep)',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedGroups((prev) => ({ ...prev, [category]: !expanded }))}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        border: 'none',
                        borderBottom: expanded ? '1px solid var(--border)' : 'none',
                        background: 'var(--bg-deep)',
                        color: 'var(--text-secondary)',
                        padding: '10px 12px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
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
                              setExecutionError(null);
                            }}
                          />
                        ))
                      : null}
                  </div>
                );
              })}
            </TerminalMarketList>
            <div style={{ flex: 1 }} />
            <div
              aria-hidden="true"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '72px',
                paddingBottom: '8px',
                opacity: 0.92,
              }}
            >
              <img
                src={satelliteFiveGif}
                width={80}
                height={48}
                alt=""
                style={{ imageRendering: 'pixelated', display: 'block' }}
              />
            </div>
          </div>
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
                  label={selectedSideLabels.long}
                  value={formatPairOrBasketSide(selectedMarket, 'long')}
                />
                <TerminalKVRow
                  label={selectedSideLabels.short}
                  value={formatPairOrBasketSide(selectedMarket, 'short')}
                />
                <TerminalKVRow label="LEVERAGE" value={`${selectedMarket.effectiveLeverage ?? selectedMarket.leverage}x`} />
                <TerminalKVRow label="CATEGORY" value={selectedMarket.category?.toUpperCase() || 'N/A'} />
              </TerminalKV>
              <div style={{ marginTop: '16px' }}>
                <Link href={`/markets/${selectedMarket.id}`}>
                  <TerminalButton fullWidth>
                    <img src={GC.signal} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                    FULL INTELLIGENCE BRIEF →
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
      bottomPane={
        <>
          <TerminalPaneTitle>OPEN POSITIONS</TerminalPaneTitle>
          {!isAuthenticated ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
              CONNECT + AUTHENTICATE TO MONITOR AND CLOSE LIVE POSITIONS.
            </div>
          ) : loadingOpenPositions ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>LOADING OPEN POSITIONS…</div>
          ) : openPositions.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>NO OPEN POSITIONS</div>
          ) : (
            <div style={{ border: '1px solid var(--border)', background: 'var(--bg-warm)', overflowX: 'auto' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.5fr 0.7fr 0.8fr 0.8fr 1.1fr',
                  gap: '8px',
                  minWidth: '760px',
                  padding: '8px 10px',
                  borderBottom: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                <span>Market</span>
                <span>Side</span>
                <span>Size</span>
                <span>PnL</span>
                <span style={{ textAlign: 'right' }}>Action</span>
              </div>
              {openPositions.slice(0, 6).map((position) => {
                const pnl = Number(position.pnl);
                return (
                  <div
                    key={position.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.5fr 0.7fr 0.8fr 0.8fr 1.1fr',
                      gap: '8px',
                      minWidth: '760px',
                      padding: '8px 10px',
                      borderBottom: '1px solid var(--border)',
                      alignItems: 'center',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {position.marketId.replace(/-/g, '_')}
                    </span>
                    <span style={{ color: 'var(--text-primary)' }}>{position.side === 'long' ? 'YES' : 'NO'}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>${Number(position.size).toFixed(0)}</span>
                    <span style={{ color: pnl >= 0 ? 'var(--primary)' : 'var(--loss)' }}>
                      {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                    </span>
                    <div style={{ justifySelf: 'end', display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <a
                        href={getHyperliquidPortfolioUrl()}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          border: '1px solid var(--border)',
                          background: 'var(--bg-deep)',
                          color: 'var(--text-secondary)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '10px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          padding: '5px 8px',
                          textDecoration: 'none',
                        }}
                      >
                        HYPER
                      </a>
                      <a
                        href={getPearPositionUrl(position.id)}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          border: '1px solid var(--border)',
                          background: 'var(--bg-deep)',
                          color: 'var(--text-secondary)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '10px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          padding: '5px 8px',
                          textDecoration: 'none',
                        }}
                      >
                        PEAR
                      </a>
                      <button
                        type="button"
                        onClick={() => handleClosePosition(position.id)}
                        disabled={closingPositionId === position.id}
                        style={{
                          border: '1px solid var(--border)',
                          background: 'var(--bg-deep)',
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          padding: '5px 10px',
                          cursor: closingPositionId === position.id ? 'not-allowed' : 'pointer',
                          opacity: closingPositionId === position.id ? 0.5 : 1,
                        }}
                      >
                        {closingPositionId === position.id ? 'CLOSING…' : 'CLOSE'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
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
            { label: 'STATE', value: isAuthenticated ? (agentWalletApproval === 'pending' ? 'APPROVAL PENDING' : side === 'YES' ? 'THESIS ARMED' : 'FADE MODE') : 'READ-ONLY' },
            { label: 'OPERATOR', value: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'GUEST' },
          ]}
        />
      }
    />
  );
}

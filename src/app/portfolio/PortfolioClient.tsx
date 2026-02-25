'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { GC } from '@/app/labs/geocities-gifs';
import { PearSetupCard } from '@/components/PearSetupCard';
import { PositionCard } from '@/components/PositionCard';
import type { HyperliquidReconciliation } from '@/components/PositionCard';
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
  TerminalKV,
  TerminalKVRow,
  TerminalSessionBadge,
} from '@/components/terminal';
import { usePear } from '@/contexts/PearContext';
import { useVaultBalances } from '@/hooks/useVaultBalances';
import { getActivePositions } from '@/integrations/pear/positions';
import type { PearPosition } from '@/integrations/pear/types';
import { connectPearWebsocket } from '@/integrations/pear/websocket';
import { emitDebugLog } from '@/lib/debugLog';
import { connectWalletSafely } from '@/lib/connectWallet';
import { getHyperliquidPortfolioUrl, getPearDashboardUrl } from '@/integrations/pear/links';

type HyperliquidOpenPositionsResponse = {
  ok: boolean;
  wallet?: string;
  fetchedAt?: number;
  longCoins?: string[];
  shortCoins?: string[];
  error?: string;
};

function normalizeCoin(raw?: string): string | null {
  if (!raw) return null;
  const s = raw.split(':').pop()?.trim().replace(/^[^A-Za-z0-9]+/, '');
  if (!s || s === '-' || s === '—') return null;
  return s.toUpperCase();
}

export default function PortfolioClient() {
  const { isConnected, address } = useAccount();
  const { connectAsync, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { accessToken, isAuthenticated, agentWallet } = usePear();
  const { perpUsdc } = useVaultBalances(accessToken);

  const [positions, setPositions] = useState<PearPosition[]>([]);
  const [loadingPositions, setLoadingPositions] = useState(false);
  const [refreshingPositions, setRefreshingPositions] = useState(false);
  const [positionsError, setPositionsError] = useState<string | null>(null);
  const [hasLoadedPositions, setHasLoadedPositions] = useState(false);
  const [hlOpen, setHlOpen] = useState<{
    wallet: string;
    source: 'agent' | 'wallet';
    longCoins: string[];
    shortCoins: string[];
    fetchedAt: number;
    error?: string;
  } | null>(null);
  const [loadingHlOpen, setLoadingHlOpen] = useState(false);
  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(null);
  const [portfolioTab, setPortfolioTab] = useState<'positions' | 'history'>('positions');
  const [historyScope, setHistoryScope] = useState<'wallet' | 'all' | 'hyperliquid'>('wallet');
  const [historyRows, setHistoryRows] = useState<Array<{
    source?: 'war' | 'hyperliquid';
    ts: number;
    marketId: string;
    side: 'YES' | 'NO';
    status: 'attempted' | 'success' | 'failed';
    sizeUsd: number;
    leverage: number;
    notionalUsd: number;
    wallet?: string;
    orderId?: string;
    error?: string;
  }>>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [myRoutedEvents, setMyRoutedEvents] = useState<Array<{
    ts: number;
    marketId: string;
    side: 'YES' | 'NO';
    status: 'attempted' | 'success' | 'failed';
    sizeUsd: number;
    leverage: number;
    notionalUsd: number;
    wallet?: string;
    orderId?: string;
    error?: string;
  }>>([]);
  const [protocolTotals, setProtocolTotals] = useState<{ notionalUsd: number; uniqueWallets: number } | null>(null);
  const hlWallet = agentWallet ?? address ?? null;
  const hlWalletSource: 'agent' | 'wallet' = agentWallet ? 'agent' : 'wallet';

  const loadHyperliquidOpen = useCallback(async () => {
    if (!hlWallet) {
      setHlOpen(null);
      return;
    }
    setLoadingHlOpen(true);
    try {
      const res = await fetch(`/api/hyperliquid/open-positions?wallet=${encodeURIComponent(hlWallet)}`, {
        cache: 'no-store',
      });
      const json = (await res.json()) as HyperliquidOpenPositionsResponse;
      if (!res.ok || !json.ok) {
        throw new Error(json.error || 'Failed to load Hyperliquid open positions');
      }
      setHlOpen({
        wallet: json.wallet || hlWallet,
        source: hlWalletSource,
        longCoins: Array.isArray(json.longCoins) ? json.longCoins : [],
        shortCoins: Array.isArray(json.shortCoins) ? json.shortCoins : [],
        fetchedAt: Number(json.fetchedAt ?? Date.now()),
      });
    } catch (err) {
      setHlOpen({
        wallet: hlWallet,
        source: hlWalletSource,
        longCoins: [],
        shortCoins: [],
        fetchedAt: Date.now(),
        error: (err as Error).message || 'Failed to load Hyperliquid open positions',
      });
    } finally {
      setLoadingHlOpen(false);
    }
  }, [hlWallet, hlWalletSource]);

  useEffect(() => {
    if (!accessToken) return;

    const loadPositions = async (opts?: { silent?: boolean }) => {
      const silent = Boolean(opts?.silent);
      if (!silent) setLoadingPositions(true);
      else setRefreshingPositions(true);

      try {
        const pos = await getActivePositions(accessToken);
        setPositions(pos);
        setPositionsError(null);
        setHasLoadedPositions(true);
        await loadHyperliquidOpen();
      } catch (err) {
        console.error('Failed to load positions:', err);
        setPositionsError((err as Error).message || 'Failed to load positions');
        emitDebugLog({ level: 'error', scope: 'positions', message: 'load failed', data: { message: (err as Error).message } });
      } finally {
        if (!silent) setLoadingPositions(false);
        setRefreshingPositions(false);
      }
    };

    loadPositions({ silent: false });
    const interval = setInterval(() => loadPositions({ silent: true }), 60000);
    return () => clearInterval(interval);
  }, [accessToken, loadHyperliquidOpen]);

  useEffect(() => {
    if (!accessToken || !address) return;

    let timer: number | null = null;
    const triggerRefresh = () => {
      if (timer) return;
      timer = window.setTimeout(async () => {
        timer = null;
        try {
          setRefreshingPositions(true);
          const pos = await getActivePositions(accessToken);
          setPositions(pos);
          setPositionsError(null);
          setHasLoadedPositions(true);
          await loadHyperliquidOpen();
          emitDebugLog({ level: 'info', scope: 'positions', message: 'refreshed from ws' });
        } catch (e) {
          setPositionsError((e as Error).message || 'Failed to refresh positions');
          emitDebugLog({ level: 'warn', scope: 'positions', message: 'ws refresh failed', data: { message: (e as Error).message } });
        } finally {
          setRefreshingPositions(false);
        }
      }, 750);
    };

    const ws = connectPearWebsocket({
      address,
      channels: ['positions'],
      onMessage: () => triggerRefresh(),
    });

    return () => {
      if (timer) window.clearTimeout(timer);
      ws.close();
    };
  }, [accessToken, address, loadHyperliquidOpen]);

  useEffect(() => {
    if (!isAuthenticated) return;
    let mounted = true;
    const loadHistory = async () => {
      setLoadingHistory(true);
      try {
        const params = new URLSearchParams({ limit: '60' });
        let endpoint = '/api/stats/events';
        if (historyScope === 'wallet' && address) params.set('wallet', address);
        if (historyScope === 'hyperliquid') {
          if (!address) throw new Error('Wallet address required for Hyperliquid history');
          endpoint = '/api/hyperliquid/fills';
          params.set('wallet', address);
        }
        const res = await fetch(`${endpoint}?${params.toString()}`, { cache: 'no-store' });
        const json = (await res.json()) as { ok: boolean; events?: typeof historyRows; error?: string };
        if (!res.ok || !json.ok) throw new Error(json.error || 'Failed to load trade history');
        if (!mounted) return;
        setHistoryRows(Array.isArray(json.events) ? json.events : []);
        setHistoryError(null);
      } catch (e) {
        if (!mounted) return;
        setHistoryError((e as Error).message || 'Failed to load trade history');
      } finally {
        if (mounted) setLoadingHistory(false);
      }
    };
    void loadHistory();
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, historyScope, address]);

  useEffect(() => {
    if (!isAuthenticated || !address) return;
    let mounted = true;
    const loadMyRouted = async () => {
      try {
        const params = new URLSearchParams({ limit: '200', wallet: address });
        const res = await fetch(`/api/stats/events?${params.toString()}`, { cache: 'no-store' });
        const json = (await res.json()) as { ok: boolean; events?: typeof myRoutedEvents; error?: string };
        if (!res.ok || !json.ok) throw new Error(json.error || 'Failed to load routed stats');
        if (!mounted) return;
        setMyRoutedEvents(Array.isArray(json.events) ? json.events : []);
      } catch {
        if (!mounted) return;
        setMyRoutedEvents([]);
      }
    };
    void loadMyRouted();
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, address]);

  useEffect(() => {
    if (!isAuthenticated) return;
    let mounted = true;
    const loadProtocolTotals = async () => {
      try {
        const res = await fetch('/api/stats/summary?days=30', { cache: 'no-store' });
        const json = (await res.json()) as {
          totals?: { notionalUsd?: number; uniqueWallets?: number };
        };
        if (!res.ok) return;
        if (!mounted) return;
        setProtocolTotals({
          notionalUsd: Number(json.totals?.notionalUsd ?? 0),
          uniqueWallets: Number(json.totals?.uniqueWallets ?? 0),
        });
      } catch {
        if (!mounted) return;
        setProtocolTotals(null);
      }
    };
    void loadProtocolTotals();
    return () => {
      mounted = false;
    };
  }, [isAuthenticated]);

  const totalPnl = positions.reduce((sum, pos) => sum + Number(pos.pnl), 0);
  const selectedPosition = positions.find(p => p.id === selectedPositionId) ?? null;
  const getPositionHyperliquidCheck = (position: PearPosition): HyperliquidReconciliation => {
    if (!hlWallet) {
      return {
        state: 'unavailable',
        source: hlWalletSource,
        note: 'No wallet available for HL reconciliation.',
      };
    }

    if (loadingHlOpen && !hlOpen) {
      return { state: 'loading', wallet: hlWallet, source: hlWalletSource };
    }

    if (!hlOpen || hlOpen.error) {
      return {
        state: 'unavailable',
        wallet: hlWallet,
        source: hlWalletSource,
        note: hlOpen?.error || 'HL data unavailable.',
      };
    }

    const expectedLong = Array.from(
      new Set(
        (position.longAssets ?? [])
          .map((asset) => normalizeCoin(asset.coin))
          .filter((coin): coin is string => Boolean(coin))
      )
    );
    const expectedShort = Array.from(
      new Set(
        (position.shortAssets ?? [])
          .map((asset) => normalizeCoin(asset.coin))
          .filter((coin): coin is string => Boolean(coin))
      )
    );

    const fallbackLong = normalizeCoin(position.longAsset);
    const fallbackShort = normalizeCoin(position.shortAsset);
    if (expectedLong.length === 0 && fallbackLong) expectedLong.push(fallbackLong);
    if (expectedShort.length === 0 && fallbackShort) expectedShort.push(fallbackShort);

    if (expectedLong.length === 0 && expectedShort.length === 0) {
      return {
        state: 'unavailable',
        wallet: hlOpen.wallet,
        source: hlOpen.source,
        note: 'No leg data returned from position feed.',
      };
    }

    const hlLongSet = new Set(hlOpen.longCoins);
    const hlShortSet = new Set(hlOpen.shortCoins);
    const matchedLong = expectedLong.filter((coin) => hlLongSet.has(coin));
    const matchedShort = expectedShort.filter((coin) => hlShortSet.has(coin));
    const missingLong = expectedLong.filter((coin) => !hlLongSet.has(coin));
    const missingShort = expectedShort.filter((coin) => !hlShortSet.has(coin));
    const verified = missingLong.length === 0 && missingShort.length === 0;

    return {
      state: verified ? 'verified' : 'mismatch',
      wallet: hlOpen.wallet,
      source: hlOpen.source,
      matchedLong,
      matchedShort,
      missingLong,
      missingShort,
      note: `Wallet ${hlOpen.wallet.slice(0, 6)}...${hlOpen.wallet.slice(-4)} checked against live HL positions.`,
    };
  };
  const positiveOpen = positions.filter((p) => Number(p.pnl) >= 0).length;
  const openWinRate = positions.length > 0 ? (positiveOpen / positions.length) * 100 : 0;
  const successfulMyTrades = myRoutedEvents.filter((e) => e.status === 'success');
  const totalMyRoutedNotional = successfulMyTrades.reduce((sum, e) => sum + Number(e.notionalUsd || 0), 0);
  const myWarPoints = Math.floor(totalMyRoutedNotional);
  const pendingWarPoints = Math.floor(
    myRoutedEvents
      .filter((e) => e.status === 'attempted')
      .reduce((sum, e) => sum + Number(e.notionalUsd || 0), 0)
  );
  const fmtUsd = (n: number) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  const hyperliquidUrl = getHyperliquidPortfolioUrl();
  const pearUrl = getPearDashboardUrl();

  // Auth screen
  if (!isAuthenticated) {
    return (
      <TerminalShell
        statusBar={<TerminalStatusBar items={[{ label: 'STATE', value: 'AUTH REQUIRED' }]} />}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', minHeight: '60vh' }}>
          {!isConnected ? (
            <div style={{ maxWidth: '420px', width: '100%', textAlign: 'center' }}>
              <TerminalTitle>OPERATOR AUTHENTICATION</TerminalTitle>
              <p style={{ color: '#a8b4af', marginTop: '16px', marginBottom: '24px', lineHeight: '1.5' }}>
                Connect wallet to access portfolio.
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
          ) : (
            <div style={{ maxWidth: '420px', width: '100%' }}>
              <PearSetupCard variant="portfolio" />
            </div>
          )}
        </div>
      </TerminalShell>
    );
  }

  // Portfolio interface
  return (
    <TerminalShell
      menuBar={<TerminalMenuBar items={[]} right={<TerminalSessionBadge />} />}
      leftPane={
        <>
          <TerminalPaneTitle>POSITION DIRECTORY</TerminalPaneTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '10px' }}>
            <button
              type="button"
              onClick={() => setPortfolioTab('positions')}
              style={{
                border: '1px solid var(--border)',
                background: portfolioTab === 'positions' ? 'var(--primary)' : 'var(--bg-warm)',
                color: portfolioTab === 'positions' ? 'var(--bg-deep)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                padding: '7px 8px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              OPEN POSITIONS
            </button>
            <button
              type="button"
              onClick={() => setPortfolioTab('history')}
              style={{
                border: '1px solid var(--border)',
                background: portfolioTab === 'history' ? 'var(--primary)' : 'var(--bg-warm)',
                color: portfolioTab === 'history' ? 'var(--bg-deep)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                padding: '7px 8px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              TRADE HISTORY
            </button>
          </div>
          {positionsError ? (
            <div style={{ color: 'var(--loss)', marginTop: '10px', marginBottom: '10px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              POSITION FEED ERROR: {positionsError}
            </div>
          ) : null}
          {portfolioTab === 'positions' && loadingPositions && !hasLoadedPositions ? (
            <div style={{ color: '#8da294', marginTop: '20px' }}>LOADING POSITIONS...</div>
          ) : portfolioTab === 'positions' && positions.length === 0 ? (
            <div
              style={{
                marginTop: '20px',
                minHeight: '220px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '14px',
              }}
            >
              <div style={{ color: '#8da294' }}>NO ACTIVE POSITIONS</div>
              <img
                src={GC.worldMap}
                width={96}
                height={44}
                alt=""
                style={{ imageRendering: 'pixelated', opacity: 0.9 }}
              />
            </div>
          ) : portfolioTab === 'positions' ? (
            <TerminalMarketList>
              {positions.map((position) => {
                const check = getPositionHyperliquidCheck(position);
                const mismatch = check.state === 'mismatch';
                return (
                  <TerminalMarketRow
                    key={position.id}
                    code={position.marketId.toUpperCase().replace(/-/g, '_')}
                    status={`${mismatch ? '! ' : ''}${Number(position.pnl) >= 0 ? '+' : ''}$${Number(position.pnl).toFixed(2)}`}
                    statusTone={mismatch ? 'danger' : 'default'}
                    active={selectedPositionId === position.id}
                    onClick={() => setSelectedPositionId(position.id)}
                  />
                );
              })}
            </TerminalMarketList>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '11px', lineHeight: 1.7, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Use center panel for history feed. Scope toggle shows wallet-only routed trades, all routed War.Market flow, or full Hyperliquid fills.
            </div>
          )}
        </>
      }
      centerPane={
        <>
          <TerminalPaneTitle>{portfolioTab === 'positions' ? 'POSITION DETAILS' : 'TRADE HISTORY'}</TerminalPaneTitle>
          {portfolioTab === 'positions' ? (
            selectedPosition ? (
              <div style={{ marginTop: '-10px' }}>
                <PositionCard
                  position={selectedPosition}
                  accessToken={accessToken ?? ''}
                  hyperliquidCheck={getPositionHyperliquidCheck(selectedPosition)}
                  onClose={async () => {
                    if (!accessToken) return;
                    const pos = await getActivePositions(accessToken);
                    setPositions(pos);
                    setHasLoadedPositions(true);
                    await loadHyperliquidOpen();
                    setSelectedPositionId((current) => {
                      if (!current) return null;
                      return pos.some((p) => p.id === current) ? current : null;
                    });
                  }}
                />
              </div>
            ) : (
              <div style={{ color: '#8da294', marginTop: '20px' }}>SELECT A POSITION TO VIEW DETAILS</div>
            )
          ) : (
            <div style={{ marginTop: '-2px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <button
                  type="button"
                  onClick={() => setHistoryScope('wallet')}
                  style={{
                    border: '1px solid var(--border)',
                    background: historyScope === 'wallet' ? 'var(--primary)' : 'var(--bg-warm)',
                    color: historyScope === 'wallet' ? 'var(--bg-deep)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    padding: '6px 10px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  My Wallet
                </button>
                <button
                  type="button"
                  onClick={() => setHistoryScope('all')}
                  style={{
                    border: '1px solid var(--border)',
                    background: historyScope === 'all' ? 'var(--primary)' : 'var(--bg-warm)',
                    color: historyScope === 'all' ? 'var(--bg-deep)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    padding: '6px 10px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  All Routed
                </button>
                <button
                  type="button"
                  onClick={() => setHistoryScope('hyperliquid')}
                  style={{
                    border: '1px solid var(--border)',
                    background: historyScope === 'hyperliquid' ? 'var(--primary)' : 'var(--bg-warm)',
                    color: historyScope === 'hyperliquid' ? 'var(--bg-deep)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    padding: '6px 10px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  All Hyperliquid
                </button>
              </div>

              {loadingHistory ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>LOADING TRADE HISTORY…</div>
              ) : historyError ? (
                <div style={{ color: 'var(--loss)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  HISTORY ERROR: {historyError}
                </div>
              ) : historyRows.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                  {historyScope === 'hyperliquid' ? 'NO HYPERLIQUID FILLS FOUND FOR THIS WALLET.' : 'NO ROUTED TRADES IN THIS SCOPE.'}
                </div>
              ) : (
                <div style={{ border: '1px solid var(--border)', background: 'var(--bg-warm)', overflowX: 'auto' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '0.75fr 0.9fr 1.2fr 0.55fr 0.8fr 0.6fr 0.85fr 1fr 0.8fr', minWidth: '1120px', gap: '8px', padding: '8px 10px', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    <span>Source</span><span>Time</span><span>Market</span><span>Side</span><span>Status</span><span>Lev</span><span>Notional</span><span>Trade ID</span><span>Links</span>
                  </div>
                  {historyRows.map((row, idx) => (
                    <div key={`${row.ts}-${row.marketId}-${idx}`} style={{ display: 'grid', gridTemplateColumns: '0.75fr 0.9fr 1.2fr 0.55fr 0.8fr 0.6fr 0.85fr 1fr 0.8fr', minWidth: '1120px', gap: '8px', padding: '8px 10px', borderBottom: '1px solid var(--border)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
                      <span style={{ color: row.source === 'hyperliquid' ? 'var(--secondary)' : 'var(--primary)' }}>
                        {row.source === 'hyperliquid' ? 'HL' : 'WAR'}
                      </span>
                      <span>{new Date(row.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>{row.marketId.replace(/-/g, '_')}</span>
                      <span style={{ color: row.side === 'YES' ? 'var(--primary)' : 'var(--loss)' }}>{row.side}</span>
                      <span style={{ color: row.status === 'success' ? 'var(--primary)' : row.status === 'failed' ? 'var(--loss)' : 'var(--text-muted)' }}>{row.status}</span>
                      <span>{row.leverage}x</span>
                      <span>${Number(row.notionalUsd).toFixed(2)}</span>
                      <span>{row.orderId ? `${String(row.orderId).slice(0, 8)}...` : '—'}</span>
                      <span style={{ display: 'inline-flex', gap: '8px' }}>
                        <a href={hyperliquidUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--secondary)', textDecoration: 'none' }}>HL ↗</a>
                        <a href={pearUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>PEAR ↗</a>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      }
      rightPane={
        <>
          <TerminalPaneTitle>MY STATS</TerminalPaneTitle>
          <TerminalKV>
            <TerminalKVRow
              label="TOTAL P&L"
              value={
                <span style={{ color: totalPnl >= 0 ? '#02ff81' : '#ff4444' }}>
                  {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
                </span>
              }
            />
            <TerminalKVRow label="OPEN WIN RATE" value={`${openWinRate.toFixed(0)}%`} />
            <TerminalKVRow label="MY ROUTED NOTIONAL" value={fmtUsd(totalMyRoutedNotional)} />
          </TerminalKV>

          <div style={{ marginTop: '10px' }}>
            <TerminalPaneTitle>WAR POINTS</TerminalPaneTitle>
            <TerminalKV>
              <TerminalKVRow label="TOTAL POINTS" value={myWarPoints.toLocaleString()} />
              <TerminalKVRow label="PENDING" value={pendingWarPoints.toLocaleString()} />
              <TerminalKVRow label="SUCCESSFUL TRADES" value={successfulMyTrades.length.toString()} />
            </TerminalKV>
          </div>

          <div style={{ marginTop: '10px' }}>
            <TerminalPaneTitle>PROTOCOL SNAPSHOT</TerminalPaneTitle>
            <TerminalKV>
              <TerminalKVRow
                label="30D ROUTED VOLUME"
                value={protocolTotals ? fmtUsd(protocolTotals.notionalUsd) : '—'}
              />
              <TerminalKVRow
                label="ACTIVE WALLETS"
                value={protocolTotals ? protocolTotals.uniqueWallets.toString() : '—'}
              />
              <TerminalKVRow label="OPEN POSITIONS" value={positions.length.toString()} />
            </TerminalKV>
          </div>

          <div style={{ marginTop: '10px' }}>
            <TerminalPaneTitle>PORTFOLIO ACTIONS</TerminalPaneTitle>
          </div>
          <TerminalKV>
            <TerminalKVRow label="BALANCE" value={perpUsdc ? `$${Number(perpUsdc).toFixed(2)}` : '$0.00'} />
          </TerminalKV>
          <TerminalButton
            fullWidth
            disabled={refreshingPositions}
            onClick={async () => {
              if (!accessToken || refreshingPositions) return;
              setRefreshingPositions(true);
              try {
                const pos = await getActivePositions(accessToken);
                setPositions(pos);
                setPositionsError(null);
                setHasLoadedPositions(true);
                await loadHyperliquidOpen();
                toast.success('Refreshed');
              } catch {
                setPositionsError('Manual refresh failed');
                toast.error('Failed to refresh');
              } finally {
                setRefreshingPositions(false);
              }
            }}
          >
            {refreshingPositions ? 'SYNCING...' : 'REFRESH POSITIONS'}
          </TerminalButton>
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <img src={GC.coin} width={48} height={48} alt="" />
          </div>
        </>
      }
      commandBar={
        <TerminalCommandBar
          commands={[
            { key: 'F1', label: 'HELP' },
            { key: 'F2', label: 'MARKETS' },
            { key: 'F3', label: 'TRADE' },
            { key: 'F4', label: 'PORTFOLIO' },
            { key: 'F9', label: 'REFRESH' },
            { key: 'F10', label: 'CLOSE' },
          ]}
        />
      }
      statusBar={
        <TerminalStatusBar
          items={[
            { label: 'POSITIONS', value: positions.length.toString() },
            { label: 'P&L', value: `${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)}` },
            { label: 'MODE', value: 'MONITOR' },
            { label: 'OPERATOR', value: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'NONE' },
          ]}
        />
      }
    />
  );
}

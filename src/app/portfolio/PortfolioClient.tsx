'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { GC } from '@/app/labs/geocities-gifs';
import { PearSetupCard } from '@/components/PearSetupCard';
import { PositionCard } from '@/components/PositionCard';
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

export default function PortfolioClient() {
  const { isConnected, address } = useAccount();
  const { connectAsync, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { accessToken, isAuthenticated } = usePear();
  const { perpUsdc } = useVaultBalances(accessToken);

  const [positions, setPositions] = useState<PearPosition[]>([]);
  const [loadingPositions, setLoadingPositions] = useState(false);
  const [refreshingPositions, setRefreshingPositions] = useState(false);
  const [positionsError, setPositionsError] = useState<string | null>(null);
  const [hasLoadedPositions, setHasLoadedPositions] = useState(false);
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
  }, [accessToken]);

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
  }, [accessToken, address]);

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

  const totalPnl = positions.reduce((sum, pos) => sum + Number(pos.pnl), 0);
  const selectedPosition = positions.find(p => p.id === selectedPositionId) ?? null;

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
            <div style={{ color: '#8da294', marginTop: '20px' }}>NO ACTIVE POSITIONS</div>
          ) : portfolioTab === 'positions' ? (
            <TerminalMarketList>
              {positions.map((position) => (
                <TerminalMarketRow
                  key={position.id}
                  code={position.marketId.toUpperCase().replace(/-/g, '_')}
                  status={`${Number(position.pnl) >= 0 ? '+' : ''}$${Number(position.pnl).toFixed(2)}`}
                  active={selectedPositionId === position.id}
                  onClick={() => setSelectedPositionId(position.id)}
                />
              ))}
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
                  onClose={async () => {
                    if (!accessToken) return;
                    const pos = await getActivePositions(accessToken);
                    setPositions(pos);
                    setHasLoadedPositions(true);
                    setSelectedPositionId(null);
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
                  <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1fr 1.2fr 0.6fr 0.8fr 0.7fr 0.9fr', minWidth: '860px', gap: '8px', padding: '8px 10px', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    <span>Source</span><span>Time</span><span>Market</span><span>Side</span><span>Status</span><span>Lev</span><span>Notional</span>
                  </div>
                  {historyRows.map((row, idx) => (
                    <div key={`${row.ts}-${row.marketId}-${idx}`} style={{ display: 'grid', gridTemplateColumns: '0.8fr 1fr 1.2fr 0.6fr 0.8fr 0.7fr 0.9fr', minWidth: '860px', gap: '8px', padding: '8px 10px', borderBottom: '1px solid var(--border)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
                      <span style={{ color: row.source === 'hyperliquid' ? 'var(--secondary)' : 'var(--primary)' }}>
                        {row.source === 'hyperliquid' ? 'HL' : 'WAR'}
                      </span>
                      <span>{new Date(row.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>{row.marketId.replace(/-/g, '_')}</span>
                      <span style={{ color: row.side === 'YES' ? 'var(--primary)' : 'var(--loss)' }}>{row.side}</span>
                      <span style={{ color: row.status === 'success' ? 'var(--primary)' : row.status === 'failed' ? 'var(--loss)' : 'var(--text-muted)' }}>{row.status}</span>
                      <span>{row.leverage}x</span>
                      <span>${Number(row.notionalUsd).toFixed(2)}</span>
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
          <TerminalPaneTitle>PORTFOLIO SUMMARY</TerminalPaneTitle>
          <TerminalKV>
            <TerminalKVRow
              label="TOTAL P&L"
              value={
                <span style={{ color: totalPnl >= 0 ? '#02ff81' : '#ff4444' }}>
                  {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
                </span>
              }
            />
            <TerminalKVRow label="OPEN POSITIONS" value={positions.length.toString()} />
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

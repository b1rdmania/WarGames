'use client';

// NOTE: This file is rendered client-only via next/dynamic({ ssr: false }) from `page.tsx`
// to avoid hydration mismatches caused by wallet extensions/wagmi connection state.

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { usePear } from '@/contexts/PearContext';
import { useVaultBalances } from '@/hooks/useVaultBalances';
import { useValidatedMarkets } from '@/hooks/useValidatedMarkets';
import { PearSetupCard } from '@/components/PearSetupCard';
import { MarketFeed } from '@/components/MarketFeed';
import { BetSlip } from '@/components/BetSlip';
import { PositionCard } from '@/components/PositionCard';
import { PortfolioSummary } from '@/components/PortfolioSummary';
import { PortfolioLine } from '@/components/PortfolioLine';
import { AssetPriceTicker } from '@/components/AssetPriceTicker';
import { RiskShell } from '@/components/RiskShell';
import { TerminalTopNav } from '@/components/TerminalTopNav';
import { getActivePositions } from '@/integrations/pear/positions';
import type { PearPosition } from '@/integrations/pear/types';
import { connectPearWebsocket } from '@/integrations/pear/websocket';
import { emitDebugLog } from '@/lib/debugLog';

export default function MarketsClient() {
  const { isConnected, address } = useAccount();
  const { connectAsync, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { accessToken, isAuthenticated } = usePear();
  const { perpUsdc } = useVaultBalances(accessToken);
  const { markets: validatedMarkets } = useValidatedMarkets();
  const [positions, setPositions] = useState<PearPosition[]>([]);
  const [loadingPositions, setLoadingPositions] = useState(false);
  const [refreshingPositions, setRefreshingPositions] = useState(false);
  const [hasLoadedPositions, setHasLoadedPositions] = useState(false);
  const [portfolioDetailsOpen, setPortfolioDetailsOpen] = useState(false);
  const [betSlipOpen, setBetSlipOpen] = useState(false);
  const [betSlipMarketId, setBetSlipMarketId] = useState<string | null>(null);
  const [betSlipSide, setBetSlipSide] = useState<'long' | 'short' | null>(null);

  // Always prefer validated markets (includes baskets + safe remaps).
  const effectiveMarkets = validatedMarkets ?? [];

  // Load positions
  useEffect(() => {
    if (!accessToken) return;

    const loadPositions = async (opts?: { silent?: boolean }) => {
      const silent = Boolean(opts?.silent);
      if (!silent) setLoadingPositions(true);
      else setRefreshingPositions(true);
      try {
        const pos = await getActivePositions(accessToken);
        setPositions(pos);
        setHasLoadedPositions(true);
      } catch (err) {
        console.error('Failed to load positions:', err);
        emitDebugLog({ level: 'error', scope: 'positions', message: 'load failed', data: { message: (err as Error).message } });
      } finally {
        if (!silent) setLoadingPositions(false);
        setRefreshingPositions(false);
      }
    };

    // Initial load: show a loading state. Subsequent refreshes are silent to avoid layout jumps.
    loadPositions({ silent: false });

    // Fallback polling: keep it slow since we also refresh via WebSocket.
    const interval = setInterval(() => loadPositions({ silent: true }), 60000);
    return () => clearInterval(interval);
  }, [accessToken]);

  // WebSocket: trigger faster refreshes on position events (still keep polling as fallback).
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
          setHasLoadedPositions(true);
          emitDebugLog({ level: 'info', scope: 'positions', message: 'refreshed from ws' });
        } catch (e) {
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

  // WebSocket: notifications for real-time alerts
  useEffect(() => {
    if (!accessToken || !address) return;

    const ws = connectPearWebsocket({
      address,
      channels: ['notifications'],
      onMessage: (data) => {
        emitDebugLog({ level: 'info', scope: 'notifications', message: 'received', data });

        // Show toast notifications based on event type
        if (data.type === 'position_filled' || data.event === 'fill') {
          toast.success('Position filled!', {
            icon: '✅',
            style: {
              background: '#000',
              color: '#02ff81',
              border: '1px solid #02ff8133',
              fontFamily: 'monospace',
            },
          });
        } else if (data.type === 'stop_loss_triggered' || data.event === 'stop_loss') {
          toast.error('Stop loss triggered', {
            icon: '⚠️',
            style: {
              background: '#000',
              color: '#ef4444',
              border: '1px solid #ef444433',
              fontFamily: 'monospace',
            },
          });
        } else if (data.type === 'take_profit_hit' || data.event === 'take_profit') {
          toast.success('Take profit hit!', {
            icon: '🎯',
            style: {
              background: '#000',
              color: '#02ff81',
              border: '1px solid #02ff8133',
              fontFamily: 'monospace',
            },
          });
        } else if (data.type === 'liquidation' || data.event === 'liquidation') {
          toast.error('Position liquidated', {
            icon: '💥',
            style: {
              background: '#000',
              color: '#ef4444',
              border: '1px solid #ef444433',
              fontFamily: 'monospace',
            },
          });
        }
      },
    });

    return () => ws.close();
  }, [accessToken, address]);

  // Unauthenticated view
  if (!isAuthenticated) {
    return (
      <RiskShell
        subtitle="SETUP"
        nav={<TerminalTopNav />}
        right={
          isConnected && address ? (
            <button
              onClick={() => disconnect()}
              className="pear-border text-pear-lime px-3 py-2 text-xs font-mono hover:pear-glow"
              title="Disconnect"
            >
              {address.slice(0, 6)}…{address.slice(-4)}
            </button>
          ) : (
            <div className="text-xs font-mono text-gray-500">NOT CONNECTED</div>
          )
        }
      >
        {!isConnected ? (
          <div className="pear-border bg-black/40 p-6">
            <div className="text-sm font-mono text-gray-300 mb-3">[ CONNECT WALLET ]</div>
            <div className="text-sm text-gray-400 mb-4">
              Connect your wallet to authenticate with Pear and create an agent wallet.
            </div>
            <button
              disabled={isPending}
              onClick={() => {
                (async () => {
                  try {
                    const metaMaskConn = connectors.find((c) => c.id === 'metaMask');
                    const injectedConn = connectors.find((c) => c.id === 'injected');
                    // Prefer generic injected wallets (Rabby/Coinbase/etc). Only fall back to MetaMask if it's the only option.
                    const chosen = injectedConn ?? metaMaskConn;

                    if (!chosen) {
                      toast.error('No wallet connector available');
                      return;
                    }

                    await connectAsync({ connector: chosen });
                  } catch (e) {
                    console.error(e);
                    toast.error((e as Error).message || 'Failed to connect wallet');
                  }
                })();
              }}
              className="tm-btn w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'CONNECTING…' : 'CONNECT WALLET'}
            </button>
          </div>
        ) : (
          <PearSetupCard />
        )}
      </RiskShell>
    );
  }

  // Authenticated view
  return (
    <RiskShell
      subtitle="MARKETS"
      nav={<TerminalTopNav />}
      right={
        isConnected && address ? (
          <button
            onClick={() => disconnect()}
            className="pear-border text-pear-lime px-3 py-2 text-xs font-mono hover:pear-glow"
            title="Disconnect"
          >
            {address.slice(0, 6)}…{address.slice(-4)}
          </button>
        ) : (
          <div className="text-xs font-mono text-gray-500">—</div>
        )
      }
    >
      <div className="-mt-2 mb-4">
        <AssetPriceTicker />
      </div>

      <div className="mb-6">
        <div className="text-3xl font-mono font-bold tracking-widest text-pear-lime">MARKETS</div>
        <div className="mt-2 text-sm font-mono text-gray-500">
          Trade synthetic macro-volatility indices built from neutral feeds.
        </div>
      </div>

      <PortfolioLine
        positions={positions}
        balance={perpUsdc}
        detailsOpen={portfolioDetailsOpen}
        onToggleDetails={() => setPortfolioDetailsOpen((v) => !v)}
      />
      {portfolioDetailsOpen && positions.length > 0 && (
        <div className="mt-4">
          <PortfolioSummary positions={positions} balance={perpUsdc} />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div>
            <div className="flex items-center justify-between text-sm font-mono text-gray-300 mb-3">
              <div>[ ACTIVE POSITIONS ]</div>
              {hasLoadedPositions && refreshingPositions ? (
                <div className="text-[10px] text-gray-500">UPDATING…</div>
              ) : null}
            </div>

            {loadingPositions && !hasLoadedPositions ? (
              <div className="pear-border bg-black/40 p-6 font-mono text-sm text-gray-400">
                Loading…
              </div>
            ) : positions.length === 0 ? (
              <div className="pear-border bg-black/40 p-6 font-mono text-sm text-gray-400">
                No active positions.
              </div>
            ) : accessToken ? (
              <div className="space-y-4">
                {positions.map((pos) => (
                  <PositionCard
                    key={pos.id}
                    position={pos}
                    accessToken={accessToken}
                    onClose={() => {
                      // Silent refresh so we don't cause the page to jump.
                      getActivePositions(accessToken).then((next) => {
                        setPositions(next);
                        setHasLoadedPositions(true);
                      });
                    }}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="lg:col-span-1">
          {accessToken && (
            <MarketFeed
              markets={effectiveMarkets}
              onPick={(m, s) => {
                setBetSlipMarketId(m.id);
                setBetSlipSide(s);
                setBetSlipOpen(true);
              }}
            />
          )}
        </div>
      </div>

      <BetSlip
        isOpen={betSlipOpen}
        market={effectiveMarkets.find((m: any) => m.id === betSlipMarketId) ?? null}
        side={betSlipSide}
        balance={perpUsdc}
        accessToken={accessToken ?? ''}
        onClose={() => {
          setBetSlipOpen(false);
          setBetSlipMarketId(null);
          setBetSlipSide(null);
        }}
        onPlaced={() => {
          if (!accessToken) return;
          getActivePositions(accessToken).then((next) => {
            setPositions(next);
            setHasLoadedPositions(true);
          });
        }}
      />
    </RiskShell>
  );
}


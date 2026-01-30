'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { RiskShell } from '@/components/RiskShell';
import { TerminalTopNav } from '@/components/TerminalTopNav';
import { PearSetupCard } from '@/components/PearSetupCard';
import { PortfolioSummary } from '@/components/PortfolioSummary';
import { PortfolioLine } from '@/components/PortfolioLine';
import { PositionCard } from '@/components/PositionCard';
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
  const [hasLoadedPositions, setHasLoadedPositions] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(true);

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

  if (!isAuthenticated) {
    return (
      <RiskShell
        subtitle="Setup"
        nav={<TerminalTopNav />}
      >
        {!isConnected ? (
          <div className="tp-wrap">
            <div className="tp-frame">
              <div className="tp-h">Connect Wallet</div>
              <div className="tp-body">Connect your wallet to view your portfolio.</div>
              <div className="mt-4">
                <button
                  disabled={isPending}
                  type="button"
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
                  className="tm-btn tm-btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? 'Connecting…' : 'Connect Wallet'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <PearSetupCard variant="portfolio" />
        )}
      </RiskShell>
    );
  }

  return (
    <RiskShell
      subtitle="Portfolio"
      nav={<TerminalTopNav />}
    >
      <div className="tp-wrap">
        <div className="tp-hero">
          <div className="tp-title">Portfolio</div>
          <div className="tp-lede">Positions, P&L, and collateral.</div>
        </div>
        <div className="tp-rule" />

        <div className="mt-6">
          <PortfolioLine
            positions={positions}
            balance={perpUsdc}
            detailsOpen={detailsOpen}
            onToggleDetails={() => setDetailsOpen((v) => !v)}
          />
        </div>

        {detailsOpen && (
          <div className="mt-4">
            <PortfolioSummary positions={positions} balance={perpUsdc} />
          </div>
        )}

        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-3">
            <div className="font-semibold text-brand-amber">Active Positions</div>
            <div className="flex items-center gap-3">
              {hasLoadedPositions && refreshingPositions ? (
                <div className="text-[10px] text-text-muted">Updating…</div>
              ) : null}
              <button
                onClick={async () => {
                  if (!accessToken || refreshingPositions) return;
                  setRefreshingPositions(true);
                  try {
                    const pos = await getActivePositions(accessToken);
                    setPositions(pos);
                    setHasLoadedPositions(true);
                    toast.success('Refreshed');
                  } catch (err) {
                    toast.error('Failed to refresh');
                  } finally {
                    setRefreshingPositions(false);
                  }
                }}
                disabled={refreshingPositions || !accessToken}
                className="tm-btn px-3 py-1 text-xs disabled:opacity-50"
              >
                {refreshingPositions ? '...' : 'Refresh'}
              </button>
            </div>
          </div>

          {loadingPositions && !hasLoadedPositions ? (
            <div className="tm-box p-6 text-sm text-text-muted">Loading…</div>
          ) : positions.length === 0 ? (
            <div className="tm-box p-6 text-sm text-text-muted">No active positions.</div>
          ) : accessToken ? (
            <div className="space-y-4">
              {positions.map((pos) => (
                <PositionCard
                  key={pos.id}
                  position={pos}
                  accessToken={accessToken}
                  onClose={() => {
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
    </RiskShell>
  );
}


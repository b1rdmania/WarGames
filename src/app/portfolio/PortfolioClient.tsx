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
            <div className="text-sm text-gray-400 mb-4">Connect your wallet to view your portfolio.</div>
            <button
              disabled={isPending}
              type="button"
              onClick={() => {
                (async () => {
                  try {
                    const connector = connectors[0];
                    if (!connector) {
                      toast.error('No wallet connector available');
                      return;
                    }
                    await connectAsync({ connector });
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

  return (
    <RiskShell
      subtitle="PORTFOLIO"
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
      <div className="mb-6">
        <div className="text-3xl font-mono font-bold tracking-widest text-pear-lime">PORTFOLIO</div>
        <div className="mt-2 text-sm font-mono text-gray-500">Positions, P&L, and collateral.</div>
      </div>

      <PortfolioLine
        positions={positions}
        balance={perpUsdc}
        detailsOpen={detailsOpen}
        onToggleDetails={() => setDetailsOpen((v) => !v)}
      />

      {detailsOpen && (
        <div className="mt-4">
          <PortfolioSummary positions={positions} balance={perpUsdc} />
        </div>
      )}

      <div className="mt-6">
        <div className="flex items-center justify-between text-sm font-mono text-gray-300 mb-3">
          <div>[ ACTIVE POSITIONS ]</div>
          <div className="flex items-center gap-3">
            {hasLoadedPositions && refreshingPositions ? (
              <div className="text-[10px] text-gray-500">UPDATING…</div>
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
              className="tm-btn px-3 py-1 text-[10px] disabled:opacity-50"
            >
              {refreshingPositions ? '...' : 'REFRESH'}
            </button>
          </div>
        </div>

        {loadingPositions && !hasLoadedPositions ? (
          <div className="pear-border bg-black/40 p-6 font-mono text-sm text-gray-400">Loading…</div>
        ) : positions.length === 0 ? (
          <div className="pear-border bg-black/40 p-6 font-mono text-sm text-gray-400">No active positions.</div>
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
    </RiskShell>
  );
}


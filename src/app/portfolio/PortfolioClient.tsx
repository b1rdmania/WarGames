'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { RiskShell } from '@/components/RiskShell';
import { ControlRoomTopNav } from '@/components/ControlRoomTopNav';
import { PearSetupCard } from '@/components/PearSetupCard';
import { ControlRoomPortfolioSurface } from '@/components/ControlRoomPortfolioSurface';
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

  return (
    <RiskShell nav={<ControlRoomTopNav />}>
      {!isAuthenticated ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          {!isConnected ? (
            <div className="tm-box" style={{ maxWidth: '420px', width: '100%', textAlign: 'center', padding: '32px' }}>
              <div style={{ color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>
                OPERATOR AUTHENTICATION REQUIRED
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>
                Connect your wallet to access your portfolio.
              </p>
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
                className="tm-btn"
                style={{ width: '100%' }}
              >
                {isPending ? 'CONNECTING…' : 'CONNECT WALLET'}
              </button>
            </div>
          ) : (
            <div className="tm-box" style={{ maxWidth: '420px', width: '100%' }}>
              <PearSetupCard variant="portfolio" />
            </div>
          )}
        </div>
      ) : (
        <ControlRoomPortfolioSurface
          positions={positions}
          balance={perpUsdc}
          loadingPositions={loadingPositions}
          refreshingPositions={refreshingPositions}
          hasLoadedPositions={hasLoadedPositions}
          detailsOpen={detailsOpen}
          accessToken={accessToken ?? ''}
          operatorAddress={address}
          onToggleDetails={() => setDetailsOpen((v) => !v)}
          onRefresh={async () => {
            if (!accessToken || refreshingPositions) return;
            setRefreshingPositions(true);
            try {
              const pos = await getActivePositions(accessToken);
              setPositions(pos);
              setHasLoadedPositions(true);
              toast.success('Refreshed');
            } catch {
              toast.error('Failed to refresh');
            } finally {
              setRefreshingPositions(false);
            }
          }}
          onPositionClosed={() => {
            if (!accessToken) return;
            getActivePositions(accessToken).then((next) => {
              setPositions(next);
              setHasLoadedPositions(true);
            });
          }}
        />
      )}
    </RiskShell>
  );
}

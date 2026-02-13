'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { RiskShell } from '@/components/RiskShell';
import { ControlRoomTopNav } from '@/components/ControlRoomTopNav';
import { PearSetupCard } from '@/components/PearSetupCard';
import {
  ControlRoomPanel,
  ControlRoomButton,
  ControlRoomSectionHeader,
  ControlRoomEventLog,
  ControlRoomStatusRail,
  type ControlRoomEvent,
} from '@/components/control-room';
import { PositionCard } from '@/components/PositionCard';
import { usePear } from '@/contexts/PearContext';
import { useVaultBalances } from '@/hooks/useVaultBalances';
import { getActivePositions } from '@/integrations/pear/positions';
import type { PearPosition } from '@/integrations/pear/types';
import { connectPearWebsocket } from '@/integrations/pear/websocket';
import { emitDebugLog } from '@/lib/debugLog';
import { connectWalletSafely } from '@/lib/connectWallet';
import styles from './PortfolioClient.module.css';

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
  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(null);
  const [events, setEvents] = useState<ControlRoomEvent[]>([
    { time: new Date().toLocaleTimeString(), message: 'PORTFOLIO MONITORING INITIALIZED', type: 'success' },
  ]);

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
        if (!silent) {
          setEvents((prev) => [
            { time: new Date().toLocaleTimeString(), message: `LOADED ${pos.length} ACTIVE POSITIONS`, type: 'success' },
            ...prev,
          ]);
        }
      } catch (err) {
        console.error('Failed to load positions:', err);
        emitDebugLog({ level: 'error', scope: 'positions', message: 'load failed', data: { message: (err as Error).message } });
        setEvents((prev) => [
          { time: new Date().toLocaleTimeString(), message: 'POSITION LOAD FAILED', type: 'error' },
          ...prev,
        ]);
      } finally {
        if (!silent) setLoadingPositions(false);
        setRefreshingPositions(false);
      }
    };

    loadPositions({ silent: false });
    const interval = setInterval(() => loadPositions({ silent: true }), 60000);
    return () => clearInterval(interval);
  }, [accessToken]);

  // WebSocket updates
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
          setEvents((prev) => [
            { time: new Date().toLocaleTimeString(), message: 'POSITION UPDATE RECEIVED', type: 'info' },
            ...prev,
          ]);
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

  const totalPnl = positions.reduce((sum, pos) => sum + Number(pos.pnl), 0);
  const selectedPosition = positions.find(p => p.id === selectedPositionId) ?? null;

  // Auth screen
  if (!isAuthenticated) {
    return (
      <RiskShell nav={<ControlRoomTopNav />}>
        <div className={styles.authWrapper}>
          <ControlRoomPanel title="OPERATOR AUTHENTICATION" subtitle="Connect wallet to access portfolio">
            {!isConnected ? (
              <>
                <p className={styles.authText}>Wallet connection required for portfolio access.</p>
                <ControlRoomButton
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
                </ControlRoomButton>
              </>
            ) : (
              <PearSetupCard variant="portfolio" />
            )}
          </ControlRoomPanel>
        </div>
      </RiskShell>
    );
  }

  // Authenticated: Portfolio view
  return (
    <RiskShell nav={<ControlRoomTopNav />}>
      <div className={styles.shell}>
        {/* Situation Board - Position List */}
        <div className={styles.situationBoard}>
          <ControlRoomPanel title="SITUATION BOARD" subtitle="ACTIVE POSITIONS">
            {loadingPositions && !hasLoadedPositions ? (
              <div className={styles.loading}>
                <p className={styles.loadingText}>LOADING POSITIONS...</p>
              </div>
            ) : positions.length === 0 ? (
              <div className={styles.empty}>
                <p className={styles.emptyText}>NO ACTIVE POSITIONS</p>
                <p className={styles.emptyHint}>Navigate to /trade to open positions</p>
              </div>
            ) : (
              <div className={styles.positionList}>
                {positions.map((position) => (
                  <div
                    key={position.id}
                    className={`${styles.positionRow} ${selectedPositionId === position.id ? styles.positionRowActive : ''}`}
                    onClick={() => setSelectedPositionId(position.id)}
                  >
                    <div className={styles.positionHeader}>
                      <span className={styles.positionMarket}>{position.marketId.toUpperCase().replace(/-/g, '_')}</span>
                      <span className={`${styles.positionPnl} ${Number(position.pnl) >= 0 ? styles.pnlPositive : styles.pnlNegative}`}>
                        {Number(position.pnl) >= 0 ? '+' : ''}${Number(position.pnl).toFixed(2)}
                      </span>
                    </div>
                    <div className={styles.positionMeta}>
                      <span className={styles.positionSide}>{position.side.toUpperCase()}</span>
                      <span className={styles.positionSize}>${Number(position.size).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ControlRoomPanel>
        </div>

        {/* Mission Console - Position Details */}
        <div className={styles.missionConsole}>
          {!selectedPosition ? (
            <ControlRoomPanel title="MISSION CONSOLE" subtitle="PORTFOLIO MANAGEMENT">
              <div className={styles.consoleContent}>
                <ControlRoomSectionHeader label="PORTFOLIO SUMMARY">
                  {positions.length} POSITIONS
                </ControlRoomSectionHeader>

                <div className={styles.metrics}>
                  <div className={styles.metricRow}>
                    <span className={styles.metricLabel}>TOTAL P&L</span>
                    <span className={`${styles.metricValue} ${totalPnl >= 0 ? styles.pnlPositive : styles.pnlNegative}`}>
                      {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
                    </span>
                  </div>
                  <div className={styles.metricRow}>
                    <span className={styles.metricLabel}>OPEN POSITIONS</span>
                    <span className={styles.metricValue}>{positions.length}</span>
                  </div>
                  <div className={styles.metricRow}>
                    <span className={styles.metricLabel}>AVAILABLE BALANCE</span>
                    <span className={styles.metricValue}>${perpUsdc ? Number(perpUsdc).toFixed(2) : '0.00'}</span>
                  </div>
                </div>

                <ControlRoomButton
                  fullWidth
                  disabled={refreshingPositions}
                  onClick={async () => {
                    if (!accessToken || refreshingPositions) return;
                    setRefreshingPositions(true);
                    try {
                      const pos = await getActivePositions(accessToken);
                      setPositions(pos);
                      setHasLoadedPositions(true);
                      toast.success('Positions refreshed');
                      setEvents((prev) => [
                        { time: new Date().toLocaleTimeString(), message: 'MANUAL REFRESH COMPLETE', type: 'success' },
                        ...prev,
                      ]);
                    } catch {
                      toast.error('Failed to refresh');
                      setEvents((prev) => [
                        { time: new Date().toLocaleTimeString(), message: 'REFRESH FAILED', type: 'error' },
                        ...prev,
                      ]);
                    } finally {
                      setRefreshingPositions(false);
                    }
                  }}
                >
                  {refreshingPositions ? 'SYNCING...' : 'REFRESH POSITIONS'}
                </ControlRoomButton>
              </div>

              <ControlRoomEventLog events={events.slice(0, 10)} />
            </ControlRoomPanel>
          ) : (
            <ControlRoomPanel title="MISSION CONSOLE" subtitle={selectedPosition.marketId.toUpperCase().replace(/-/g, '_')}>
              <div className={styles.consoleContent}>
                <PositionCard
                  position={selectedPosition}
                  accessToken={accessToken ?? ''}
                  onClose={async () => {
                    if (!accessToken) return;
                    const pos = await getActivePositions(accessToken);
                    setPositions(pos);
                    setHasLoadedPositions(true);
                    setSelectedPositionId(null);
                    setEvents((prev) => [
                      { time: new Date().toLocaleTimeString(), message: `POSITION CLOSED: ${selectedPosition.marketId}`, type: 'success' },
                      ...prev,
                    ]);
                  }}
                />
              </div>
            </ControlRoomPanel>
          )}
        </div>
      </div>

      {/* Status Rail */}
      <ControlRoomStatusRail
        leftItems={[
          { key: 'POSITIONS', value: positions.length.toString() },
          { key: 'P&L', value: `${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)}` },
        ]}
        rightItems={[
          { key: 'MODE', value: 'MONITOR' },
          { key: 'OPERATOR', value: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'NONE' },
        ]}
      />
    </RiskShell>
  );
}

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
  const [hasLoadedPositions, setHasLoadedPositions] = useState(false);
  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(null);

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
      menuBar={<TerminalMenuBar items={['FILE', 'POSITIONS', 'ANALYTICS', 'CLOSE', 'MONITOR', 'HELP']} right={<TerminalSessionBadge />} />}
      leftPane={
        <>
          <TerminalPaneTitle>POSITION DIRECTORY</TerminalPaneTitle>
          {loadingPositions && !hasLoadedPositions ? (
            <div style={{ color: '#8da294', marginTop: '20px' }}>LOADING POSITIONS...</div>
          ) : positions.length === 0 ? (
            <div style={{ color: '#8da294', marginTop: '20px' }}>NO ACTIVE POSITIONS</div>
          ) : (
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
          )}
        </>
      }
      centerPane={
        <>
          <TerminalPaneTitle>POSITION DETAILS</TerminalPaneTitle>
          {selectedPosition ? (
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
                setHasLoadedPositions(true);
                toast.success('Refreshed');
              } catch {
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

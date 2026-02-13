'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { RiskShell } from '@/components/RiskShell';
import { ControlRoomTopNav } from '@/components/ControlRoomTopNav';
import { PearSetupCard } from '@/components/PearSetupCard';
import {
  ControlRoomPanel,
  ControlRoomTable,
  ControlRoomTableHeader,
  ControlRoomTableBody,
  ControlRoomTableRow,
  ControlRoomTableCell,
  ControlRoomButton,
  ControlRoomInput,
  ControlRoomSectionHeader,
  ControlRoomEventLog,
  ControlRoomStatusRail,
  type ControlRoomEvent,
} from '@/components/control-room';
import { usePear } from '@/contexts/PearContext';
import { useValidatedMarkets } from '@/hooks/useValidatedMarkets';
import { useVaultBalances } from '@/hooks/useVaultBalances';
import { connectWalletSafely } from '@/lib/connectWallet';
import styles from './TradeClient.module.css';

export default function TradeClient() {
  const { isConnected, address } = useAccount();
  const { connectAsync, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { accessToken, isAuthenticated } = usePear();
  const { perpUsdc } = useVaultBalances(accessToken);
  const { markets: effectiveMarkets } = useValidatedMarkets();

  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null);
  const [positionSize, setPositionSize] = useState('100');
  const [events, setEvents] = useState<ControlRoomEvent[]>([
    { time: new Date().toLocaleTimeString(), message: 'SYSTEM INITIALIZED', type: 'success' },
  ]);

  const selectedMarket = effectiveMarkets?.find((m) => m.id === selectedMarketId);

  const handleExecute = (side: 'long' | 'short') => {
    const timestamp = new Date().toLocaleTimeString();
    setEvents((prev) => [
      { time: timestamp, message: `POSITION OPENED: ${side.toUpperCase()} ${selectedMarket?.name || 'UNKNOWN'} $${positionSize}`, type: 'success' },
      ...prev,
    ]);
    toast.success(`Position opened: ${side.toUpperCase()}`);
  };

  // Auth screen
  if (!isAuthenticated) {
    return (
      <RiskShell nav={<ControlRoomTopNav />}>
        <div className={styles.authWrapper}>
          <ControlRoomPanel title="OPERATOR AUTHENTICATION" subtitle="Connect wallet to access trade terminal">
            {!isConnected ? (
              <>
                <p className={styles.authText}>Wallet connection required for trade execution.</p>
                <ControlRoomButton
                  variant="primary"
                  fullWidth
                  disabled={isPending}
                  onClick={() => {
                    (async () => {
                      try {
                        await connectWalletSafely({ connectors, connectAsync, disconnect });
                        setEvents((prev) => [
                          { time: new Date().toLocaleTimeString(), message: `WALLET CONNECTED: ${address?.slice(0, 10)}...`, type: 'success' },
                          ...prev,
                        ]);
                      } catch (e) {
                        console.error(e);
                        toast.error((e as Error).message || 'Failed to connect wallet');
                        setEvents((prev) => [
                          { time: new Date().toLocaleTimeString(), message: 'WALLET CONNECTION FAILED', type: 'error' },
                          ...prev,
                        ]);
                      }
                    })();
                  }}
                >
                  {isPending ? 'CONNECTING…' : 'CONNECT WALLET'}
                </ControlRoomButton>
              </>
            ) : (
              <PearSetupCard />
            )}
          </ControlRoomPanel>
        </div>
      </RiskShell>
    );
  }

  // Authenticated: Control Room interface
  return (
    <RiskShell nav={<ControlRoomTopNav />}>
      <div className={styles.shell}>
        {/* Situation Board - Market List */}
        <div className={styles.situationBoard}>
          <ControlRoomPanel title="SITUATION BOARD" subtitle="NARRATIVE MARKETS // LIVE FEED">
            <ControlRoomTable>
              <ControlRoomTableHeader>
                <ControlRoomTableRow>
                  <ControlRoomTableCell header>CODE</ControlRoomTableCell>
                  <ControlRoomTableCell header>THESIS</ControlRoomTableCell>
                  <ControlRoomTableCell header>REGIME</ControlRoomTableCell>
                  <ControlRoomTableCell header>LEV</ControlRoomTableCell>
                </ControlRoomTableRow>
              </ControlRoomTableHeader>
              <ControlRoomTableBody>
                {(effectiveMarkets ?? []).map((market) => (
                  <ControlRoomTableRow
                    key={market.id}
                    active={selectedMarketId === market.id}
                    onClick={() => {
                      setSelectedMarketId(market.id);
                      setEvents((prev) => [
                        { time: new Date().toLocaleTimeString(), message: `MARKET SELECTED: ${market.name}`, type: 'info' },
                        ...prev,
                      ]);
                    }}
                  >
                    <ControlRoomTableCell mono>{market.id.toUpperCase().replace(/-/g, '_')}</ControlRoomTableCell>
                    <ControlRoomTableCell>{market.name}</ControlRoomTableCell>
                    <ControlRoomTableCell>{market.category?.toUpperCase() || 'N/A'}</ControlRoomTableCell>
                    <ControlRoomTableCell>{market.leverage}x</ControlRoomTableCell>
                  </ControlRoomTableRow>
                ))}
              </ControlRoomTableBody>
            </ControlRoomTable>
          </ControlRoomPanel>
        </div>

        {/* Mission Console - Trade Form */}
        <div className={styles.missionConsole}>
          <ControlRoomPanel title="MISSION CONSOLE" subtitle="TRADE EXECUTION">
            <div className={styles.consoleContent}>
              <ControlRoomSectionHeader label="SELECTED MARKET">
                {selectedMarket?.name || 'NONE'}
              </ControlRoomSectionHeader>

              <ControlRoomInput
                label="POSITION SIZE (USDC)"
                type="number"
                value={positionSize}
                onChange={(e) => setPositionSize(e.target.value)}
                placeholder="100"
              />

              <div className={styles.directionSection}>
                <div className={styles.sectionLabel}>DIRECTION</div>
                <div className={styles.buttonGroup}>
                  <ControlRoomButton
                    fullWidth
                    disabled={!selectedMarketId}
                    onClick={() => handleExecute('long')}
                  >
                    YES / THESIS
                  </ControlRoomButton>
                  <ControlRoomButton
                    fullWidth
                    disabled={!selectedMarketId}
                    onClick={() => handleExecute('short')}
                  >
                    NO / HEDGE
                  </ControlRoomButton>
                </div>
              </div>

              <ControlRoomButton
                variant="primary"
                fullWidth
                disabled={!selectedMarketId || !positionSize}
                onClick={() => handleExecute('long')}
              >
                EXECUTE POSITION
              </ControlRoomButton>
            </div>
          </ControlRoomPanel>

          {/* Event Log */}
          <ControlRoomEventLog events={events.slice(0, 10)} />
        </div>
      </div>

      {/* Status Rail */}
      <ControlRoomStatusRail
        leftItems={[
          { key: 'SESSION', value: 'OPERATOR' },
          { key: 'BALANCE', value: perpUsdc ? `$${Number(perpUsdc).toFixed(2)}` : '$0.00' },
        ]}
        rightItems={[
          { key: 'STATE', value: 'ARMED' },
          { key: 'OPERATOR', value: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'NONE' },
        ]}
      />
    </RiskShell>
  );
}

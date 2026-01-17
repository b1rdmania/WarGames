'use client';

// NOTE: This file is rendered client-only via next/dynamic({ ssr: false }) from `page.tsx`
// to avoid hydration mismatches caused by wallet extensions/wagmi connection state.

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { usePear } from '@/contexts/PearContext';
import { useVaultBalances } from '@/hooks/useVaultBalances';
import { useValidatedMarkets } from '@/hooks/useValidatedMarkets';
import { WalletConnectModal } from '@/components/WalletConnectModal';
import { PearSetupCard } from '@/components/PearSetupCard';
import { TradingPanel } from '@/components/TradingPanel';
import { PositionCard } from '@/components/PositionCard';
import { PortfolioSummary } from '@/components/PortfolioSummary';
import { AssetPriceTicker } from '@/components/AssetPriceTicker';
import { RiskShell } from '@/components/RiskShell';
import { MARKETS } from '@/integrations/pear/markets';
import { getActivePositions } from '@/integrations/pear/positions';
import type { PearPosition } from '@/integrations/pear/types';
import { connectPearWebsocket } from '@/integrations/pear/websocket';
import { emitDebugLog } from '@/lib/debugLog';

export default function MarketsClient() {
  const { isConnected, address } = useAccount();
  const { accessToken, isAuthenticated } = usePear();
  const { perpUsdc } = useVaultBalances(accessToken);
  const { markets: validatedMarkets } = useValidatedMarkets();
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [positions, setPositions] = useState<PearPosition[]>([]);
  const [loadingPositions, setLoadingPositions] = useState(false);

  const effectiveMarkets = validatedMarkets?.length ? validatedMarkets : MARKETS;

  // Load positions
  useEffect(() => {
    if (!accessToken) return;

    const loadPositions = async () => {
      setLoadingPositions(true);
      try {
        const pos = await getActivePositions(accessToken);
        setPositions(pos);
      } catch (err) {
        console.error('Failed to load positions:', err);
        emitDebugLog({ level: 'error', scope: 'positions', message: 'load failed', data: { message: (err as Error).message } });
      } finally {
        setLoadingPositions(false);
      }
    };

    loadPositions();
    const interval = setInterval(loadPositions, 10000);
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
          const pos = await getActivePositions(accessToken);
          setPositions(pos);
          emitDebugLog({ level: 'info', scope: 'positions', message: 'refreshed from ws' });
        } catch (e) {
          emitDebugLog({ level: 'warn', scope: 'positions', message: 'ws refresh failed', data: { message: (e as Error).message } });
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

  // Unauthenticated view
  if (!isAuthenticated) {
    return (
      <RiskShell
        subtitle="SETUP"
        right={
          <div className="text-xs font-mono text-gray-400">
            {address ? `${address.slice(0, 6)}…${address.slice(-4)}` : 'NOT CONNECTED'}
          </div>
        }
      >
        {!isConnected ? (
          <div className="border border-pear-lime/20 bg-black/40 p-6">
            <div className="text-sm font-mono text-gray-300 mb-3">[ CONNECT WALLET ]</div>
            <div className="text-sm text-gray-400 mb-4">
              Connect your wallet to authenticate with Pear and create an agent wallet.
            </div>
            <button
              onClick={() => setConnectModalOpen(true)}
              className="w-full pear-border pear-text py-3 font-mono text-sm hover:pear-glow"
            >
              CONNECT WALLET
            </button>
          </div>
        ) : (
          <PearSetupCard />
        )}

        <WalletConnectModal isOpen={connectModalOpen} onClose={() => setConnectModalOpen(false)} />
      </RiskShell>
    );
  }

  // Authenticated view
  return (
    <RiskShell
      subtitle="MARKETS"
      right={
        <div className="text-xs font-mono text-gray-400">
          {address ? `${address.slice(0, 6)}…${address.slice(-4)}` : '—'}
        </div>
      }
    >
      <div className="-mt-2 mb-4">
        <AssetPriceTicker />
      </div>

      {/* Portfolio Summary */}
      {positions.length > 0 && <PortfolioSummary positions={positions} balance={perpUsdc} />}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div>
            <div className="text-sm font-mono text-gray-300 mb-3">[ ACTIVE POSITIONS ]</div>

            {loadingPositions ? (
              <div className="border border-pear-lime/20 bg-black/40 p-6 font-mono text-sm text-gray-400">
                Loading…
              </div>
            ) : positions.length === 0 ? (
              <div className="border border-pear-lime/20 bg-black/40 p-6 font-mono text-sm text-gray-400">
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
                      getActivePositions(accessToken).then(setPositions);
                    }}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="lg:col-span-1">
          {accessToken && (
            <TradingPanel
              accessToken={accessToken}
              markets={effectiveMarkets}
              balance={perpUsdc}
              onPlaced={() => {
                getActivePositions(accessToken).then(setPositions);
              }}
            />
          )}
        </div>
      </div>

      <WalletConnectModal isOpen={connectModalOpen} onClose={() => setConnectModalOpen(false)} />
    </RiskShell>
  );
}


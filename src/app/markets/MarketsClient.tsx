'use client';

// NOTE: This file is rendered client-only via next/dynamic({ ssr: false }) from `page.tsx`
// to avoid hydration mismatches caused by wallet extensions/wagmi connection state.

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { usePear } from '@/contexts/PearContext';
import { useValidatedMarkets } from '@/hooks/useValidatedMarkets';
import { PearSetupCard } from '@/components/PearSetupCard';
import { MarketFeed } from '@/components/MarketFeed';
import { BetSlip } from '@/components/BetSlip';
import { AssetPriceTicker } from '@/components/AssetPriceTicker';
import { RiskShell } from '@/components/RiskShell';
import { TerminalTopNav } from '@/components/TerminalTopNav';
import { connectPearWebsocket } from '@/integrations/pear/websocket';
import { emitDebugLog } from '@/lib/debugLog';

export default function MarketsClient() {
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const { connectAsync, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { accessToken, isAuthenticated } = usePear();
  const { markets: validatedMarkets } = useValidatedMarkets();
  const [betSlipOpen, setBetSlipOpen] = useState(false);
  const [betSlipMarketId, setBetSlipMarketId] = useState<string | null>(null);
  const [betSlipSide, setBetSlipSide] = useState<'long' | 'short' | null>(null);

  // Always prefer validated markets (includes baskets + safe remaps).
  const effectiveMarkets = validatedMarkets ?? [];

  // Note: positions + balances live on /portfolio now.

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

  // MARKETS is browse-first; setup/auth lives on /trade.
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
          Browse tradable narratives. Execute on the TRADE tab.
        </div>
      </div>

      <div className="mt-6">
        <MarketFeed
          markets={effectiveMarkets}
          onPick={(m, s) => {
            if (!isAuthenticated || !accessToken) {
              toast('Go to TRADE to connect + authenticate first.');
              router.push('/trade');
              return;
            }
            setBetSlipMarketId(m.id);
            setBetSlipSide(s);
            setBetSlipOpen(true);
          }}
        />
      </div>

      <BetSlip
        isOpen={betSlipOpen}
        market={effectiveMarkets.find((m: any) => m.id === betSlipMarketId) ?? null}
        side={betSlipSide}
        balance={null}
        accessToken={accessToken ?? ''}
        onClose={() => {
          setBetSlipOpen(false);
          setBetSlipMarketId(null);
          setBetSlipSide(null);
        }}
        onPlaced={() => {
          // Portfolio lives on /portfolio
        }}
      />
    </RiskShell>
  );
}


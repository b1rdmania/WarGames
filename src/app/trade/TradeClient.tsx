'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { RiskShell } from '@/components/RiskShell';
import { TerminalTopNav } from '@/components/TerminalTopNav';
import { PearSetupCard } from '@/components/PearSetupCard';
import { MarketFeed } from '@/components/MarketFeed';
import { BetSlipPanel } from '@/components/BetSlipPanel';
import { PortfolioLine } from '@/components/PortfolioLine';
import { usePear } from '@/contexts/PearContext';
import { useValidatedMarkets } from '@/hooks/useValidatedMarkets';
import { useVaultBalances } from '@/hooks/useVaultBalances';

export default function TradeClient() {
  const { isConnected, address } = useAccount();
  const { connectAsync, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { accessToken, isAuthenticated } = usePear();
  const { perpUsdc } = useVaultBalances(accessToken);
  const { markets: effectiveMarkets } = useValidatedMarkets();

  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null);
  const [selectedSide, setSelectedSide] = useState<'long' | 'short' | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <RiskShell
        subtitle="SETUP"
        nav={<TerminalTopNav />}
      >
        {!isConnected ? (
          <div className="pear-border bg-black/40 p-6">
            <div className="text-sm font-mono text-gray-300 mb-3">[ CONNECT WALLET ]</div>
            <div className="text-sm text-gray-400 mb-4">Connect your wallet to authenticate with Pear.</div>
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
      subtitle="TRADE"
      nav={<TerminalTopNav />}
    >
      <div className="mb-6">
        <div className="text-3xl font-mono font-bold tracking-widest text-pear-lime">TRADE</div>
        <div className="mt-2 text-sm font-mono text-gray-500">Pick a narrative and place a YES/NO bet.</div>
      </div>

      <PortfolioLine
        positions={[]}
        balance={perpUsdc}
        detailsOpen={detailsOpen}
        onToggleDetails={() => setDetailsOpen((v) => !v)}
      />

      <div className="mt-6 grid lg:grid-cols-[1fr_380px] gap-6">
        <div className="min-w-0">
          <MarketFeed
            markets={effectiveMarkets ?? []}
            selectedMarketId={selectedMarketId}
            onPick={(m, s) => {
              setSelectedMarketId(m.id);
              setSelectedSide(s);
            }}
          />
        </div>

        <div className="lg:sticky lg:top-4 self-start">
          <BetSlipPanel
            market={(effectiveMarkets ?? []).find((m) => m.id === selectedMarketId) ?? null}
            side={selectedSide}
            balance={perpUsdc}
            accessToken={accessToken ?? ''}
            onSideChange={(s) => setSelectedSide(s)}
            onClear={() => {
              setSelectedMarketId(null);
              setSelectedSide(null);
            }}
            onPlaced={() => {
              // Keep market selected after placing, user can place again or clear
            }}
          />
        </div>
      </div>
    </RiskShell>
  );
}


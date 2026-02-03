'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { RiskShell } from '@/components/RiskShell';
import { TerminalTopNav } from '@/components/TerminalTopNav';
import { PearSetupCard } from '@/components/PearSetupCard';
import { PortfolioLine } from '@/components/PortfolioLine';
import { NoradTradeSurface } from '@/components/NoradTradeSurface';
import { usePear } from '@/contexts/PearContext';
import { useValidatedMarkets } from '@/hooks/useValidatedMarkets';
import { useVaultBalances } from '@/hooks/useVaultBalances';
import { connectWalletSafely } from '@/lib/connectWallet';

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
      <RiskShell nav={<TerminalTopNav />}>
        {!isConnected ? (
          <div className="tp-wrap">
            <div className="tp-frame">
              <div className="tp-h">Connect Wallet</div>
              <div className="tp-body">Connect your wallet to authenticate with Pear.</div>
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
                  className="tm-btn w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? 'Connecting…' : 'Connect Wallet'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <PearSetupCard />
        )}
      </RiskShell>
    );
  }

  return (
    <RiskShell nav={<TerminalTopNav />}>
      <div className="tp-wrap">
        <div className="tp-hero">
          <div className="tp-title">Trade</div>
          <div className="tp-lede">Pick a narrative and place a YES/NO bet.</div>
        </div>
        <div className="tp-rule" />

        <div className="mt-6">
          <PortfolioLine
            positions={[]}
            balance={perpUsdc}
            detailsOpen={detailsOpen}
            onToggleDetails={() => setDetailsOpen((v) => !v)}
          />
        </div>

        <NoradTradeSurface
          markets={effectiveMarkets ?? []}
          selectedMarketId={selectedMarketId}
          selectedSide={selectedSide}
          balance={perpUsdc}
          accessToken={accessToken ?? ''}
          operatorAddress={address}
          onSelectMarket={(id) => setSelectedMarketId(id)}
          onSelectSide={(s) => setSelectedSide(s)}
          onClearSelection={() => {
            setSelectedMarketId(null);
            setSelectedSide(null);
          }}
          onPlaced={() => {
            // Keep selection after execution so users can re-enter quickly.
          }}
        />
      </div>
    </RiskShell>
  );
}

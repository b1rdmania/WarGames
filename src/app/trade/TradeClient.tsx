'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { RiskShell } from '@/components/RiskShell';
import { TerminalTopNav } from '@/components/TerminalTopNav';
import { PearSetupCard } from '@/components/PearSetupCard';
import { MarketFeed } from '@/components/MarketFeed';
import { BetSlip } from '@/components/BetSlip';
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

  const [betSlipOpen, setBetSlipOpen] = useState(false);
  const [betSlipMarketId, setBetSlipMarketId] = useState<string | null>(null);
  const [betSlipSide, setBetSlipSide] = useState<'long' | 'short' | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

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
            <div className="text-sm text-gray-400 mb-4">Connect your wallet to authenticate with Pear.</div>
            <button
              disabled={isPending}
              type="button"
              onClick={() => {
                (async () => {
                  try {
                    const metaMaskConn = connectors.find((c) => c.id === 'metaMask');
                    const injectedConn = connectors.find((c) => c.id === 'injected');
                    const chosen = injectedConn ?? metaMaskConn;
                    if (!chosen) {
                      toast.error('No wallet connector available');
                      return;
                    }
                    await connectAsync({ connector: chosen });
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
        <div className="text-3xl font-mono font-bold tracking-widest text-pear-lime">TRADE</div>
        <div className="mt-2 text-sm font-mono text-gray-500">Pick a narrative and place a YES/NO bet.</div>
      </div>

      <PortfolioLine
        positions={[]}
        balance={perpUsdc}
        detailsOpen={detailsOpen}
        onToggleDetails={() => setDetailsOpen((v) => !v)}
      />

      <div className="mt-6">
        <MarketFeed
          markets={effectiveMarkets ?? []}
          onPick={(m, s) => {
            setBetSlipMarketId(m.id);
            setBetSlipSide(s);
            setBetSlipOpen(true);
          }}
        />
      </div>

      <BetSlip
        isOpen={betSlipOpen}
        market={(effectiveMarkets ?? []).find((m: any) => m.id === betSlipMarketId) ?? null}
        side={betSlipSide}
        balance={perpUsdc}
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


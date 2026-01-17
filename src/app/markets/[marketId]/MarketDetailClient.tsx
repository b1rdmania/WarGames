'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { RiskShell } from '@/components/RiskShell';
import { TerminalTopNav } from '@/components/TerminalTopNav';
import { PearSetupCard } from '@/components/PearSetupCard';
import { BetSlip } from '@/components/BetSlip';
import { usePear } from '@/contexts/PearContext';
import { useValidatedMarkets } from '@/hooks/useValidatedMarkets';
import { useVaultBalances } from '@/hooks/useVaultBalances';

function titleCase(s: string) {
  return s
    .split(/[-_ ]+/g)
    .filter(Boolean)
    .map((p) => p.slice(0, 1).toUpperCase() + p.slice(1))
    .join(' ');
}

function formatBasket(assets: { asset: string; weight?: number }[]) {
  return assets
    .map((a) => `${a.asset}${typeof a.weight === 'number' ? ` (${Math.round(a.weight * 100)}%)` : ''}`)
    .join(' · ');
}

export default function MarketDetailClient({ marketId }: { marketId: string }) {
  const { isConnected, address } = useAccount();
  const { connectAsync, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { accessToken, isAuthenticated } = usePear();
  const { perpUsdc } = useVaultBalances(accessToken);
  const { markets } = useValidatedMarkets();

  const market = useMemo(() => markets.find((m) => m.id === marketId) ?? null, [markets, marketId]);

  const [betSlipOpen, setBetSlipOpen] = useState(false);
  const [betSlipSide, setBetSlipSide] = useState<'long' | 'short' | null>(null);

  const pageTitle = market ? `${titleCase(market.id)} — ${market.name.toUpperCase()}` : 'MARKET';

  // Unauthenticated view (same flow as /markets)
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
            <div className="text-sm text-gray-400 mb-4">Connect your wallet to trade.</div>
            <button
              disabled={isPending}
              onClick={() => {
                (async () => {
                  try {
                    const metaMaskConn = connectors.find((c) => c.id === 'metaMask');
                    const injectedConn = connectors.find((c) => c.id === 'injected');
                    // Prefer generic injected wallets (Rabby/Coinbase/etc). Only fall back to MetaMask if it's the only option.
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

  if (!market) {
    return (
      <RiskShell subtitle="MARKET" nav={<TerminalTopNav />}>
        <div className="pear-border bg-black/40 p-6 font-mono text-sm text-gray-400">
          Market not found.{' '}
          <Link href="/markets" className="text-pear-lime underline">
            Return to markets
          </Link>
          .
        </div>
      </RiskShell>
    );
  }

  const resolvedPairs = market.resolvedPairs ?? market.pairs;
  const resolvedBasket = market.resolvedBasket ?? market.basket;

  return (
    <RiskShell
      subtitle="MARKET"
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
        <div className="text-3xl md:text-5xl font-mono font-bold tracking-widest text-pear-lime">
          {pageTitle}
        </div>
        <div className="mt-2 text-sm font-mono text-gray-500">{market.description}</div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="pear-border bg-black/40 p-6">
          <div className="text-sm font-mono text-gray-300 mb-4">[ LIVE METRICS ]</div>
          <div className="tm-box">
            <div className="tm-row">
              <div className="tm-k">Category</div>
              <div className="tm-v">{market.category}</div>
            </div>
            <div className="tm-row">
              <div className="tm-k">Leverage</div>
              <div className="tm-v text-pear-lime">{market.leverage}x</div>
            </div>
            <div className="tm-row">
              <div className="tm-k">Underlying</div>
              <div className="tm-v">
                {resolvedPairs
                  ? `${resolvedPairs.long} vs ${resolvedPairs.short}`
                  : resolvedBasket
                    ? `${resolvedBasket.long.map((x) => x.asset).join(' + ')} vs ${resolvedBasket.short.map((x) => x.asset).join(' + ')}`
                    : '—'}
              </div>
            </div>
            {market.isRemapped ? (
              <div className="tm-row">
                <div className="tm-k">Mode</div>
                <div className="tm-v text-yellow-200">DEMO REMAP</div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="pear-border bg-black/40 p-6">
          <div className="text-sm font-mono text-gray-300 mb-4">[ ORDER ]</div>
          <div className="text-xs font-mono text-gray-500 mb-2">Stake (USDC)</div>
          <div className="text-xs font-mono text-gray-500 mb-4">Available perp: {perpUsdc ? `$${Number(perpUsdc).toFixed(2)}` : '—'}</div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="tm-btn w-full py-4"
              onClick={() => {
                setBetSlipSide('long');
                setBetSlipOpen(true);
              }}
            >
              YES
            </button>
            <button
              type="button"
              className="tm-btn tm-btn-danger w-full py-4"
              onClick={() => {
                setBetSlipSide('short');
                setBetSlipOpen(true);
              }}
            >
              NO
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-8">
        <section>
          <div className="text-pear-lime font-mono font-bold tracking-widest mb-3">OVERVIEW</div>
          <div className="text-sm font-mono text-gray-400 leading-relaxed">
            {market.name} expresses the narrative: {market.description}. It packages the thesis into a single bettable instrument
            using a neutral long/short basket executed via Pear.
          </div>
        </section>

        <section>
          <div className="text-pear-lime font-mono font-bold tracking-widest mb-3">WHY THIS INDEX MATTERS</div>
          <div className="text-sm font-mono text-gray-400 leading-relaxed">
            You’re not guessing “up or down” on one ticker — you’re taking a view on relative performance. This reduces direction
            noise and keeps the bet anchored to the narrative.
          </div>
        </section>

        <section>
          <div className="text-pear-lime font-mono font-bold tracking-widest mb-3">TRADING MODEL</div>
          <div className="text-sm font-mono text-gray-400 leading-relaxed">
            Execution runs through Pear Protocol’s agent wallet flow and places the underlying long/short legs on Hyperliquid.
            Leverage is fixed at {market.leverage}x for this market.
          </div>
        </section>

        <section>
          <div className="text-pear-lime font-mono font-bold tracking-widest mb-3">INDEX COMPOSITION</div>
          <div className="pear-border bg-black/30 p-5 font-mono text-sm text-gray-300">
            {resolvedPairs ? (
              <div>
                Long: <span className="text-pear-lime">{resolvedPairs.long}</span> · Short:{' '}
                <span className="text-red-300">{resolvedPairs.short}</span>
              </div>
            ) : resolvedBasket ? (
              <div className="space-y-2">
                <div>
                  Long:{' '}
                  <span className="text-pear-lime">{formatBasket(resolvedBasket.long)}</span>
                </div>
                <div>
                  Short:{' '}
                  <span className="text-red-300">{formatBasket(resolvedBasket.short)}</span>
                </div>
              </div>
            ) : (
              <div>—</div>
            )}
          </div>
        </section>

        <section>
          <div className="text-pear-lime font-mono font-bold tracking-widest mb-3">POWERED BY</div>
          <div className="text-sm font-mono text-gray-400 leading-relaxed">
            Built on <span className="text-pear-lime">Pear Protocol</span> execution with settlement on <span className="text-pear-lime">Hyperliquid</span>.
          </div>
        </section>

        <div>
          <Link href="/markets" className="text-pear-lime font-mono hover:underline">
            ← RETURN TO MARKETS
          </Link>
        </div>
      </div>

      <BetSlip
        isOpen={betSlipOpen}
        market={market}
        side={betSlipSide}
        balance={perpUsdc}
        accessToken={accessToken ?? ''}
        onClose={() => {
          setBetSlipOpen(false);
          setBetSlipSide(null);
        }}
        onPlaced={() => {
          // No-op here; the positions list lives on /markets.
        }}
      />
    </RiskShell>
  );
}


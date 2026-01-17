'use client';

// NOTE: This file is rendered client-only via next/dynamic({ ssr: false }) from `page.tsx`
// to avoid hydration mismatches caused by wallet extensions/wagmi connection state.

import { useValidatedMarkets } from '@/hooks/useValidatedMarkets';
import { RiskShell } from '@/components/RiskShell';
import { TerminalTopNav } from '@/components/TerminalTopNav';
import { MarketFeedReadOnly } from '@/components/MarketFeedReadOnly';

export default function MarketsClient() {
  const { markets: validatedMarkets } = useValidatedMarkets();
  // Markets page shows only geopolitical/macro markets (the key narratives)
  // Crypto markets are available on the /trade page
  const effectiveMarkets = (validatedMarkets ?? []).filter(m => m.category !== 'crypto');

  // MARKETS is pure browse - no wallet connection, no trading
  // All trading happens on /trade
  return (
    <RiskShell
      subtitle="MARKETS"
      nav={<TerminalTopNav />}
    >
      <div className="mb-6">
        <div className="text-3xl font-mono font-bold tracking-widest text-pear-lime">MARKETS</div>
        <div className="mt-2 text-sm font-mono text-gray-500">
          Browse available narratives. Click any market for details, or go to TRADE to place bets.
        </div>
      </div>

      <div className="mt-6">
        <MarketFeedReadOnly markets={effectiveMarkets} />
      </div>
    </RiskShell>
  );
}


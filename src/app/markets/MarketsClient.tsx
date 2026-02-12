'use client';

// NOTE: This file is rendered client-only via next/dynamic({ ssr: false }) from `page.tsx`
// to avoid hydration mismatches caused by wallet extensions/wagmi connection state.

import { useValidatedMarkets } from '@/hooks/useValidatedMarkets';
import { RiskShell } from '@/components/RiskShell';
import { ControlRoomTopNav } from '@/components/ControlRoomTopNav';
import { MarketFeedReadOnly } from '@/components/MarketFeedReadOnly';

export default function MarketsClient() {
  const { markets: validatedMarkets } = useValidatedMarkets();
  // Markets page shows only geopolitical/macro markets (the key narratives)
  // Crypto markets are available on the /trade page
  const effectiveMarkets = (validatedMarkets ?? []).filter(m => m.category !== 'crypto');

  // MARKETS is pure browse - no wallet connection, no trading
  // All trading happens on /trade
  return (
    <RiskShell nav={<ControlRoomTopNav />}>
      <div className="mb-6">
        <div className="text-3xl font-sans font-semibold tracking-tight text-text-primary">Markets</div>
        <div className="mt-2 text-sm font-sans text-text-muted">
          Browse available narratives. Click any market for details, or go to Trade to place bets.
        </div>
      </div>

      <div className="mt-6">
        <MarketFeedReadOnly markets={effectiveMarkets} />
      </div>
    </RiskShell>
  );
}


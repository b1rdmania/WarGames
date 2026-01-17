'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAccount } from 'wagmi';
import { usePear } from '@/hooks/usePear';
import { PositionsPanel } from '@/components/PositionsPanel';
import { BalancesPanel } from '@/components/BalancesPanel';
import { useVaultBalances } from '@/hooks/useVaultBalances';
import { useValidatedMarkets } from '@/hooks/useValidatedMarkets';
import { WalletConnectModal } from '@/components/WalletConnectModal';
import { PearTerminalPanel } from '@/components/PearTerminalPanel';
import { TradeTerminal } from '@/components/TradeTerminal';
import { MARKETS } from '@/integrations/pear/markets';
import { DebugConsole } from '@/components/DebugConsole';

export default function MarketsPage() {
  const { isConnected } = useAccount();
  const { accessToken, isAuthenticated, isAuthenticating, authenticate } = usePear();
  const { perpUsdc } = useVaultBalances(accessToken);
  // Still validate in background (avoids CORS now via /api proxy), but we keep UX slim.
  // If validation fails, we still can trade on the base MARKETS list.
  const { markets: validatedMarkets } = useValidatedMarkets();
  const [positionsRefreshKey, setPositionsRefreshKey] = useState(0);
  const [connectModalOpen, setConnectModalOpen] = useState(false);

  const effectiveMarkets = validatedMarkets?.length ? validatedMarkets : MARKETS;

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold neon-text mb-1">TERMINAL</h1>
        <p className="text-sm text-gray-500">Minimal flow for debugging: connect → run setup → bet</p>
      </div>

      <div className="mb-6">
        <PearTerminalPanel onRequestConnect={() => setConnectModalOpen(true)} />
      </div>

      <div className="mb-6">
        <DebugConsole />
      </div>

      {/* Positions Panel */}
      {isAuthenticated && (
        <div className="mb-6 space-y-4">
          <BalancesPanel accessToken={accessToken} />
          {accessToken && (
            <TradeTerminal
              accessToken={accessToken}
              markets={effectiveMarkets}
              perpUsdc={perpUsdc}
              onPlaced={() => setPositionsRefreshKey((k) => k + 1)}
            />
          )}
          <div>
            <div className="text-sm text-war-green mb-3 font-mono">[ YOUR BETS ]</div>
            <PositionsPanel accessToken={accessToken} refreshKey={positionsRefreshKey} />
          </div>
        </div>
      )}

      {!isAuthenticated && (
        <div className="bg-war-panel neon-border p-6 text-sm text-gray-400">
          Authenticate first (use the terminal panel above) to enable trading.
        </div>
      )}

      <WalletConnectModal isOpen={connectModalOpen} onClose={() => setConnectModalOpen(false)} />
    </main>
  );
}

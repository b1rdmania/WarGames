'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { RiskShell } from '@/components/RiskShell';
import { ControlRoomTopNav } from '@/components/ControlRoomTopNav';
import { PearSetupCard } from '@/components/PearSetupCard';
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

  return (
    <RiskShell nav={<ControlRoomTopNav />}>
      {!isAuthenticated ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          {!isConnected ? (
            <div className="tm-box" style={{ maxWidth: '420px', width: '100%', textAlign: 'center', padding: '32px' }}>
              <div style={{ color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>
                OPERATOR AUTHENTICATION REQUIRED
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>
                Connect your wallet to access the trade terminal.
              </p>
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
                className="tm-btn"
                style={{ width: '100%' }}
              >
                {isPending ? 'CONNECTING…' : 'CONNECT WALLET'}
              </button>
            </div>
          ) : (
            <div className="tm-box" style={{ maxWidth: '420px', width: '100%' }}>
              <PearSetupCard />
            </div>
          )}
        </div>
      ) : (
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
          onPlaced={() => {}}
        />
      )}
    </RiskShell>
  );
}

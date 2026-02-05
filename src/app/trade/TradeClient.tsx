'use client';

import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { PearSetupCard } from '@/components/PearSetupCard';
import { NoradTradeSurface } from '@/components/NoradTradeSurface';
import { usePear } from '@/contexts/PearContext';
import { useValidatedMarkets } from '@/hooks/useValidatedMarkets';
import { useVaultBalances } from '@/hooks/useVaultBalances';
import { connectWalletSafely } from '@/lib/connectWallet';
import styles from './trade.module.css';

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
    <main className={styles.page}>
      <div className={styles.header}>
        <div className={styles.title}>WAR.MARKET // TRADE TERMINAL</div>
        <div className={styles.headerRight}>
          <span>MODE: {isAuthenticated ? 'OPERATOR' : 'GUEST'}</span>
          <span>STATUS: {isAuthenticated ? 'ARMED' : 'STANDBY'}</span>
          <Link href="/" className={styles.back}>EXIT</Link>
        </div>
      </div>

      {!isAuthenticated ? (
        <div className={styles.authWrap}>
          {!isConnected ? (
            <div className={styles.authCard}>
              <div className={styles.authTitle}>OPERATOR AUTHENTICATION REQUIRED</div>
              <p className={styles.authText}>Connect your wallet to access the trade terminal.</p>
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
                className={styles.authButton}
              >
                {isPending ? 'CONNECTING…' : 'CONNECT WALLET'}
              </button>
            </div>
          ) : (
            <div className={styles.authCard}>
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

      <div className={styles.footerRail}>
        <span>STATUS: {isAuthenticated ? 'ONLINE' : 'OFFLINE'}</span>
        <span>OPERATOR: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'NONE'}</span>
        <span>SYSTEM: HYPERLIQUID</span>
      </div>
    </main>
  );
}

'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering wallet state until mounted
  if (!mounted) {
    return (
      <button className="px-6 py-2.5 bg-pear-lime text-pear-dark font-bold hover:bg-pear-lime-light transition-all rounded-lg">
        Connect Wallet
      </button>
    );
  }

  if (isConnected && address) {
    return (
      <button
        onClick={() => disconnect()}
        className="px-4 py-2 pear-border pear-text hover:pear-glow transition-all rounded-lg font-mono text-sm"
      >
        {address.slice(0, 6)}...{address.slice(-4)}
      </button>
    );
  }

  return (
    <button
      disabled={isPending}
      onClick={() => {
        (async () => {
          try {
            const eth: any = (window as any).ethereum;
            const isMetaMask =
              Boolean(eth?.isMetaMask) ||
              (Array.isArray(eth?.providers) && eth.providers.some((p: any) => Boolean(p?.isMetaMask)));

            const metaMaskConn = connectors.find((c) => c.id === 'metaMask');
            const injectedConn = connectors.find((c) => c.id === 'injected');
            const chosen = (isMetaMask && metaMaskConn) ? metaMaskConn : injectedConn ?? metaMaskConn;

            if (!chosen) {
              toast.error('No wallet connector available');
              return;
            }

            await connectAsync({ connector: chosen });
            toast.success('Wallet connected');
          } catch (e) {
            console.error(e);
            toast.error((e as Error).message || 'Failed to connect wallet');
          }
        })();
      }}
      className="px-6 py-2.5 bg-pear-lime text-pear-dark font-bold hover:bg-pear-lime-light transition-all rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? 'Connecting…' : 'Connect Wallet'}
    </button>
  );
}

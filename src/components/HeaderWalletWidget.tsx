'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export function HeaderWalletWidget() {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button type="button" className="tm-btn px-3 py-2 text-[10px]" disabled>
        WALLET
      </button>
    );
  }

  if (isConnected && address) {
    return (
      <button
        type="button"
        onClick={() => disconnect()}
        className="tm-btn px-3 py-2 text-[10px]"
        title="Disconnect"
      >
        {address.slice(0, 6)}…{address.slice(-4)}
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={isPending}
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
            toast.error((e as Error).message || 'Failed to connect wallet');
          }
        })();
      }}
      className="tm-btn px-3 py-2 text-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
      title="Connect Wallet"
    >
      {isPending ? 'CONNECTING…' : 'CONNECT'}
    </button>
  );
}


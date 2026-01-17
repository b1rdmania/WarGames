'use client';

import toast from 'react-hot-toast';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <button
        onClick={() => disconnect()}
        className="px-4 py-2 neon-border neon-text hover:neon-glow transition-all"
      >
        {address.slice(0, 6)}...{address.slice(-4)}
      </button>
    );
  }

  const metaMaskConnector = connectors.find((c) => c.id === 'metaMask') ?? connectors[0];

  return (
    <button
      onClick={() => {
        (async () => {
          try {
            await connectAsync({ connector: metaMaskConnector });
          } catch (e) {
            console.error(e);
            toast.error((e as Error).message || 'Failed to connect MetaMask');
          }
        })();
      }}
      disabled={isPending}
      className="px-4 py-2 bg-war-green text-war-dark font-bold hover:opacity-80 transition-opacity disabled:opacity-50"
    >
      {isPending ? 'CONNECTING…' : 'CONNECT WALLET'}
    </button>
  );
}

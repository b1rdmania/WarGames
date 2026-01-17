'use client';

import { useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { WalletConnectModal } from './WalletConnectModal';

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [open, setOpen] = useState(false);

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

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-war-green text-war-dark font-bold hover:opacity-80 transition-opacity"
      >
        CONNECT WALLET
      </button>
      <WalletConnectModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}

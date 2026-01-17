'use client';

import { useState, useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { WalletConnectModal } from './WalletConnectModal';

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [open, setOpen] = useState(false);
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
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-6 py-2.5 bg-pear-lime text-pear-dark font-bold hover:bg-pear-lime-light transition-all rounded-lg"
      >
        Connect Wallet
      </button>
      <WalletConnectModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}

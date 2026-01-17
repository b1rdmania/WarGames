'use client';

import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useConnect } from 'wagmi';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletConnectModal({ isOpen, onClose }: WalletConnectModalProps) {
  const { connectAsync, connectors, isPending } = useConnect();

  const hasEthereum = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return Boolean((window as any).ethereum);
  }, []);

  // With our current wagmi config we only have `injected()`.
  // If MetaMask is installed, injected -> MetaMask.
  const injectedConnector = connectors[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-war-dark neon-border max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-sm text-war-green font-mono">[ CONNECT WALLET ]</div>
            <div className="text-xs text-gray-500 mt-1">Use MetaMask to continue.</div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            ✕
          </button>
        </div>

        {!hasEthereum && (
          <div className="border border-yellow-500/40 p-3 text-xs text-yellow-300 mb-4">
            MetaMask not detected in this browser. Install it, then refresh.
          </div>
        )}

        <div className="space-y-3">
          <button
            disabled={!hasEthereum || isPending || !injectedConnector}
            onClick={() => {
              (async () => {
                try {
                  await connectAsync({ connector: injectedConnector });
                  toast.success('Wallet connected');
                  onClose();
                } catch (e) {
                  console.error(e);
                  toast.error((e as Error).message || 'Failed to connect wallet');
                }
              })();
            }}
            className="w-full bg-war-green text-war-dark font-bold py-3 hover:opacity-80 disabled:opacity-40"
          >
            {isPending ? 'CONNECTING…' : 'CONNECT METAMASK'}
          </button>

          <button
            onClick={onClose}
            className="w-full neon-border text-war-green py-3 text-sm hover:neon-glow"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}


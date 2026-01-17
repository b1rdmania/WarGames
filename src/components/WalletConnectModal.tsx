'use client';

import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useConnect } from 'wagmi';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function labelForConnector(id: string, name: string) {
  if (id === 'metaMask') return 'MetaMask';
  if (id === 'injected') return name || 'Injected Wallets';
  return name || id;
}

export function WalletConnectModal({ isOpen, onClose }: WalletConnectModalProps) {
  const { connectAsync, connectors, isPending } = useConnect();

  const isMetaMaskDetected = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const eth: any = (window as any).ethereum;
    if (!eth) return false;
    if (eth.isMetaMask) return true;
    if (Array.isArray(eth.providers)) {
      return eth.providers.some((p: any) => Boolean(p?.isMetaMask));
    }
    return false;
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-pear-dark pear-border max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-sm text-pear-lime font-mono">[ CONNECT WALLET ]</div>
            <div className="text-xs text-gray-500 mt-1">
              Choose a wallet. MetaMask is available alongside other injected wallets.
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            ✕
          </button>
        </div>

        <div className="space-y-2">
          {connectors
            .filter((c) => c.id === 'metaMask' || c.id === 'injected')
            .map((connector) => (
              <button
                key={connector.uid}
                disabled={isPending || (connector.id === 'metaMask' && !isMetaMaskDetected)}
                onClick={() => {
                  (async () => {
                    try {
                      await connectAsync({ connector });
                      toast.success(`Connected: ${labelForConnector(connector.id, connector.name)}`);
                      onClose();
                    } catch (e) {
                      console.error(e);
                      toast.error((e as Error).message || 'Failed to connect wallet');
                    }
                  })();
                }}
                className="w-full flex items-center justify-between pear-border text-pear-lime px-4 py-3 text-sm hover:pear-glow disabled:opacity-50"
              >
                <span>{labelForConnector(connector.id, connector.name)}</span>
                <span className="text-xs text-gray-500">
                  {connector.id === 'injected'
                    ? 'Rabby/Phantom/etc'
                    : (isMetaMaskDetected ? 'Detected' : 'Not installed')}
                </span>
              </button>
            ))}
        </div>

        {!isMetaMaskDetected && (
          <div className="mt-3 text-xs text-gray-500">
            MetaMask will only appear as a connectable option if the MetaMask extension is installed/enabled in this browser profile.
          </div>
        )}

        <div className="mt-4">
          <button
            onClick={onClose}
            className="w-full pear-border text-gray-300 py-2 text-sm font-mono hover:pear-glow"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}


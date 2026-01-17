'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useBridge } from '@/hooks/useBridge';
import type { BridgeRoute } from '@/integrations/lifi/types';

interface BridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BridgeModal({ isOpen, onClose }: BridgeModalProps) {
  const { chainId } = useAccount();
  const { routes, status, txHash, error, fetchRoutes, execute, reset } = useBridge();

  const [amount, setAmount] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<BridgeRoute>();

  if (!isOpen) return null;

  const handleFindRoutes = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      return;
    }

    // Use native token (ETH/MATIC/etc) - easier for demo
    const tokenAddress = '0x0000000000000000000000000000000000000000';

    await fetchRoutes(amount, tokenAddress);
  };

  const handleExecute = async (route: BridgeRoute) => {
    setSelectedRoute(route);
    await execute(route.route);
  };

  const handleClose = () => {
    reset();
    setAmount('');
    setSelectedRoute(undefined);
    onClose();
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-pear-dark pear-border max-w-lg w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold pear-text">BRIDGE → HYPEREVM</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-pear-lime text-xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Amount Input */}
          <div>
            <div className="text-xs text-gray-500 mb-2">AMOUNT (in native token: ETH/MATIC/etc)</div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.01"
              className="w-full bg-black border border-pear-lime/30 px-3 py-2 text-pear-lime font-mono focus:outline-none focus:border-pear-lime"
              disabled={status === 'executing'}
              step="0.01"
            />
          </div>

          {/* Find Routes Button */}
          {status === 'idle' && (
            <button
              onClick={handleFindRoutes}
              disabled={!amount || parseFloat(amount) <= 0}
              className="w-full bg-pear-lime text-black font-bold py-2 hover:opacity-80 disabled:opacity-30"
            >
              → FIND ROUTES
            </button>
          )}

          {/* Loading State */}
          {status === 'fetching-routes' && (
            <div className="border border-pear-lime/30 p-4 text-center">
              <p className="text-pear-lime font-mono">[ SEARCHING ROUTES... ]</p>
            </div>
          )}

          {/* Routes Display */}
          {status === 'ready' && routes.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs text-gray-500">
                {routes.length} ROUTE{routes.length > 1 ? 'S' : ''} FOUND
              </div>
              {routes.slice(0, 3).map((route, index) => (
                <button
                  key={index}
                  onClick={() => handleExecute(route)}
                  className="w-full border border-pear-lime/30 hover:border-pear-lime p-3 text-left"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-pear-lime font-mono">
                        {(parseFloat(route.toAmount) / 1e6).toFixed(4)} USDC
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        ~{formatTime(route.estimatedTime)} • ${parseFloat(route.gasCost).toFixed(2)} gas
                      </div>
                    </div>
                    <div className="text-pear-lime">→</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Executing State */}
          {status === 'executing' && (
            <div className="border border-pear-lime p-4">
              <p className="text-pear-lime font-mono mb-2">[ EXECUTING... ]</p>
              <p className="text-xs text-gray-500">Do not close this window</p>
              {txHash && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-xs text-gray-500 mb-1">TX:</p>
                  <p className="text-xs text-pear-lime font-mono break-all">
                    {txHash.slice(0, 20)}...
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="border border-pear-lime p-4">
              <p className="text-pear-lime font-bold mb-2">✓ COMPLETE</p>
              <p className="text-xs text-gray-500 mb-4">Funds bridged to HyperEVM</p>
              {txHash && (
                <p className="text-xs text-pear-lime font-mono break-all mb-4">
                  {txHash.slice(0, 20)}...
                </p>
              )}
              <button
                onClick={handleClose}
                className="w-full bg-pear-lime text-black font-bold py-2"
              >
                CLOSE
              </button>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && error && (
            <div className="border border-red-500/50 p-4">
              <p className="text-red-400 font-bold mb-2">✗ FAILED</p>
              <p className="text-xs text-gray-400 mb-4">
                {error.message}
              </p>
              <button
                onClick={() => {
                  reset();
                  setSelectedRoute(undefined);
                }}
                className="w-full bg-pear-lime text-black font-bold py-2"
              >
                RETRY
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

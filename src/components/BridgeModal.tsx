'use client';

import { useState } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { useBridge } from '@/hooks/useBridge';
import type { BridgeRoute } from '@/integrations/lifi/types';

interface BridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BridgeModal({ isOpen, onClose }: BridgeModalProps) {
  const { chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { routes, status, txHash, error, fetchRoutes, execute, reset } = useBridge();

  const [amount, setAmount] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<BridgeRoute>();

  if (!isOpen) return null;

  const handleFindRoutes = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      return;
    }

    // Use USDC on all chains - 0x0000000000000000000000000000000000000000 for native token
    const tokenAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'; // USDC on mainnet

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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-war-panel neon-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-war-green/20">
          <h2 className="text-2xl font-bold neon-text">BRIDGE TO HYPEREVM</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Amount Input */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              AMOUNT (USDC)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-war-dark neon-border px-4 py-3 text-white text-lg focus:outline-none focus:neon-glow transition-all"
              disabled={status === 'executing'}
            />
          </div>

          {/* Find Routes Button */}
          {status === 'idle' && (
            <button
              onClick={handleFindRoutes}
              disabled={!amount || parseFloat(amount) <= 0}
              className="w-full bg-war-green text-war-dark font-bold py-3 hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              FIND ROUTES
            </button>
          )}

          {/* Loading State */}
          {status === 'fetching-routes' && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-war-green border-t-transparent"></div>
              <p className="mt-4 text-gray-400">Discovering routes...</p>
            </div>
          )}

          {/* Routes Display */}
          {status === 'ready' && routes.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-400">
                Found {routes.length} route{routes.length > 1 ? 's' : ''}:
              </p>
              {routes.slice(0, 3).map((route, index) => (
                <div
                  key={index}
                  onClick={() => handleExecute(route)}
                  className="bg-war-dark neon-border p-4 cursor-pointer hover:neon-glow transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="text-sm text-gray-400">
                        Route {index + 1}
                      </div>
                      <div className="text-lg neon-text font-bold mt-1">
                        {(parseFloat(route.toAmount) / 1e6).toFixed(2)} USDC
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">
                        ~{formatTime(route.estimatedTime)}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        ${parseFloat(route.gasCost).toFixed(2)} gas
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Click to execute
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Executing State */}
          {status === 'executing' && selectedRoute && (
            <div className="bg-war-dark neon-border p-6 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-war-green border-t-transparent mb-4"></div>
              <p className="neon-text font-bold mb-2">EXECUTING BRIDGE</p>
              <p className="text-gray-400 text-sm">
                Do not close this window...
              </p>
              {txHash && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-xs text-gray-500 mb-1">Transaction Hash:</p>
                  <p className="text-xs text-war-green font-mono break-all">
                    {txHash}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="bg-war-dark neon-border p-6 text-center">
              <div className="text-5xl mb-4">✓</div>
              <p className="neon-text font-bold text-xl mb-2">BRIDGE COMPLETE</p>
              <p className="text-gray-400 text-sm mb-4">
                Your funds are now on HyperEVM
              </p>
              {txHash && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Transaction Hash:</p>
                  <p className="text-xs text-war-green font-mono break-all">
                    {txHash}
                  </p>
                </div>
              )}
              <button
                onClick={handleClose}
                className="bg-war-green text-war-dark font-bold px-6 py-2 hover:opacity-80 transition-opacity"
              >
                CLOSE
              </button>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && error && (
            <div className="bg-red-900/20 border border-red-500/50 p-6 rounded">
              <p className="text-red-400 font-bold mb-2">BRIDGE FAILED</p>
              <p className="text-sm text-gray-400 mb-4">
                {error.message}
              </p>
              <button
                onClick={() => {
                  reset();
                  setSelectedRoute(undefined);
                }}
                className="bg-war-green text-war-dark font-bold px-6 py-2 hover:opacity-80 transition-opacity"
              >
                TRY AGAIN
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

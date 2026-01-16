'use client';

import { useState } from 'react';
import { getMarketById } from '@/integrations/pear/markets';
import type { PearMarketConfig } from '@/integrations/pear/types';

interface BetModalProps {
  isOpen: boolean;
  marketId: string | null;
  side: 'long' | 'short' | null;
  onClose: () => void;
  onConfirm: (marketId: string, side: 'long' | 'short', amount: string) => Promise<void>;
}

export function BetModal({ isOpen, marketId, side, onClose, onConfirm }: BetModalProps) {
  const [amount, setAmount] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string>();

  if (!isOpen || !marketId || !side) return null;

  const market = getMarketById(marketId);
  if (!market) return null;

  const sideConfig = {
    long: {
      label: 'BET UP',
      color: 'text-green-400',
      bgColor: 'bg-green-600',
      token: market.pairs.long,
    },
    short: {
      label: 'BET DOWN',
      color: 'text-red-400',
      bgColor: 'bg-red-600',
      token: market.pairs.short,
    },
  };

  const config = sideConfig[side];

  const handleConfirm = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Enter a valid bet amount');
      return;
    }

    setIsExecuting(true);
    setError(undefined);

    try {
      await onConfirm(marketId, side, amount);
      handleClose();
    } catch (err) {
      setError((err as Error).message);
      setIsExecuting(false);
    }
  };

  const handleClose = () => {
    setAmount('');
    setError(undefined);
    setIsExecuting(false);
    onClose();
  };

  const leverage = market.leverage;
  const effectiveExposure = amount ? (parseFloat(amount) * leverage).toFixed(2) : '0.00';

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-war-panel neon-border rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-war-green/20">
          <h2 className="text-xl font-bold neon-text">PLACE BET</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
            disabled={isExecuting}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Market Info */}
          <div>
            <h3 className="font-bold mb-2">{market.name}</h3>
            <div className={`text-lg font-bold ${config.color}`}>
              {config.label} on {config.token}
            </div>
          </div>

          {/* Bet Amount */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              BET AMOUNT (USDC)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-war-dark neon-border px-4 py-3 text-white text-lg focus:outline-none focus:neon-glow transition-all"
              disabled={isExecuting}
            />
          </div>

          {/* Leverage Info */}
          <div className="bg-war-dark p-4 rounded border border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Leverage:</span>
              <span className="text-war-green font-bold">{leverage}x</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Effective Exposure:</span>
              <span className="text-white font-bold">${effectiveExposure}</span>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-900/20 border border-yellow-500/30 p-3 rounded">
            <p className="text-xs text-yellow-400">
              ⚠️ Leveraged positions can result in significant losses. Only bet what you can afford to lose.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 p-3 rounded">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              disabled={isExecuting}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 transition-colors disabled:opacity-50"
            >
              CANCEL
            </button>
            <button
              onClick={handleConfirm}
              disabled={isExecuting || !amount || parseFloat(amount) <= 0}
              className={`flex-1 ${config.bgColor} hover:opacity-80 text-white font-bold py-3 transition-opacity disabled:opacity-50`}
            >
              {isExecuting ? 'PLACING BET...' : 'CONFIRM BET'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

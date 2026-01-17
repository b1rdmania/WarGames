'use client';

import { useState } from 'react';
import { getMarketById } from '@/integrations/pear/markets';
import type { PearMarketConfig } from '@/integrations/pear/types';

interface BetModalProps {
  isOpen: boolean;
  marketId: string | null;
  side: 'long' | 'short' | null;
  perpUsdc?: string | null;
  onClose: () => void;
  onConfirm: (marketId: string, side: 'long' | 'short', amount: string) => Promise<void>;
}

export function BetModal({ isOpen, marketId, side, perpUsdc, onClose, onConfirm }: BetModalProps) {
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

  const perpUsdcNum = perpUsdc ? Number(perpUsdc) : null;
  const amountNum = amount ? Number(amount) : null;
  const hasSufficientPerpUsdc =
    perpUsdcNum === null || !Number.isFinite(perpUsdcNum) || amountNum === null
      ? true
      : perpUsdcNum >= amountNum;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-pear-dark pear-border max-w-md w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold pear-text">PLACE BET</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-pear-lime"
            disabled={isExecuting}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Market Info */}
          <div className="border-b border-gray-700 pb-3">
            <div className="text-sm text-gray-500 mb-1">{market.name}</div>
            <div className={`font-mono ${config.color}`}>
              {config.label} {config.token}
            </div>
          </div>

          {/* Bet Amount */}
          <div>
            <div className="text-xs text-gray-500 mb-2">BET AMOUNT (USDC)</div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="10"
              className="w-full bg-black border border-pear-lime/30 px-3 py-2 text-pear-lime font-mono focus:outline-none focus:border-pear-lime"
              disabled={isExecuting}
            />
          </div>

          {/* Leverage Info */}
          <div className="border border-gray-700 p-3 text-xs">
            <div className="flex justify-between mb-1">
              <span className="text-gray-500">Leverage:</span>
              <span className="text-pear-lime">{leverage}x</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Exposure:</span>
              <span className="text-white">${effectiveExposure}</span>
            </div>
          </div>

          {/* Funding / readiness */}
          <div className="border border-gray-700 p-3 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Perp USDC available:</span>
              <span className="text-white">
                {perpUsdc ? `$${Number(perpUsdc).toFixed(2)}` : '—'}
              </span>
            </div>
            {!hasSufficientPerpUsdc && (
              <div className="mt-2 text-yellow-500">
                Insufficient perp USDC for this bet amount. Fund perp collateral before betting.
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="border border-red-500/50 p-2 text-xs text-red-400">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleClose}
              disabled={isExecuting}
              className="flex-1 border border-gray-700 text-gray-400 py-2 text-sm hover:border-gray-500 disabled:opacity-30"
            >
              CANCEL
            </button>
            <button
              onClick={handleConfirm}
              disabled={isExecuting || !amount || parseFloat(amount) <= 0 || !hasSufficientPerpUsdc}
              className={`flex-1 ${config.bgColor} text-white font-bold py-2 text-sm hover:opacity-80 disabled:opacity-30`}
            >
              {isExecuting ? 'EXECUTING...' : 'CONFIRM'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

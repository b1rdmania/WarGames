'use client';

import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import type { PearMarketConfig } from '@/integrations/pear/types';
import { executePosition } from '@/integrations/pear/positions';
import { emitDebugLog } from '@/lib/debugLog';

export function TradeTerminal({
  accessToken,
  markets,
  perpUsdc,
  onPlaced,
}: {
  accessToken: string;
  markets: PearMarketConfig[];
  perpUsdc: string | null;
  onPlaced: () => void;
}) {
  const [marketId, setMarketId] = useState(markets[0]?.id ?? '');
  const [side, setSide] = useState<'long' | 'short'>('long');
  const [amount, setAmount] = useState('10');
  const [submitting, setSubmitting] = useState(false);

  const market = useMemo(() => markets.find((m) => m.id === marketId) ?? null, [markets, marketId]);
  const perpNum = perpUsdc ? Number(perpUsdc) : null;
  const amountNum = amount ? Number(amount) : null;
  const canAfford =
    perpNum === null || !Number.isFinite(perpNum) || amountNum === null ? true : perpNum >= amountNum;

  if (!market) return null;

  return (
    <div className="bg-war-panel neon-border p-8">
      {/* Market Selection */}
      <div className="mb-6">
        <label className="text-sm font-bold text-gray-400 mb-2 block">SELECT MARKET</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {markets.map((m) => (
            <button
              key={m.id}
              onClick={() => setMarketId(m.id)}
              className={`p-4 border-2 text-left transition-all ${
                marketId === m.id
                  ? 'border-war-green bg-war-green/10 text-war-green'
                  : 'border-gray-700 text-gray-300 hover:border-gray-500'
              }`}
            >
              <div className="font-bold text-sm">{m.name}</div>
              <div className="text-xs text-gray-500 mt-1">{m.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Side Selection */}
      <div className="mb-6">
        <label className="text-sm font-bold text-gray-400 mb-2 block">BET DIRECTION</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setSide('long')}
            className={`p-6 border-2 transition-all ${
              side === 'long'
                ? 'border-green-500 bg-green-500/20 text-white'
                : 'border-gray-700 text-gray-300 hover:border-gray-500'
            }`}
          >
            <div className="text-2xl font-bold mb-1">BET UP ↑</div>
            <div className="text-xs text-gray-400">
              Long {market.pairs.long} / Short {market.pairs.short}
            </div>
          </button>
          <button
            onClick={() => setSide('short')}
            className={`p-6 border-2 transition-all ${
              side === 'short'
                ? 'border-red-500 bg-red-500/20 text-white'
                : 'border-gray-700 text-gray-300 hover:border-gray-500'
            }`}
          >
            <div className="text-2xl font-bold mb-1">BET DOWN ↓</div>
            <div className="text-xs text-gray-400">
              Long {market.pairs.short} / Short {market.pairs.long}
            </div>
          </button>
        </div>
      </div>

      {/* Amount Input */}
      <div className="mb-6">
        <label className="text-sm font-bold text-gray-400 mb-2 block">BET AMOUNT (USDC)</label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-war-dark border-2 border-gray-700 px-4 py-4 text-2xl font-bold text-white focus:border-war-green focus:outline-none"
            placeholder="10"
            inputMode="decimal"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">USDC</div>
        </div>
        {perpUsdc && (
          <div className="mt-2 text-sm text-gray-400">
            Available: ${Number(perpUsdc).toFixed(2)} USDC
          </div>
        )}
        {!canAfford && (
          <div className="mt-2 text-sm text-yellow-400">⚠️ Insufficient balance</div>
        )}
      </div>

      {/* Summary */}
      <div className="mb-6 bg-war-dark border border-gray-700 p-4">
        <div className="text-xs text-gray-500 mb-2">POSITION SUMMARY</div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Market:</span>
            <span className="text-white font-bold">{market.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Direction:</span>
            <span className={side === 'long' ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
              {side === 'long' ? 'BET UP ↑' : 'BET DOWN ↓'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Amount:</span>
            <span className="text-white font-bold">${amount} USDC</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Leverage:</span>
            <span className="text-war-green font-bold">{market.leverage}x</span>
          </div>
          <div className="flex justify-between border-t border-gray-700 pt-2 mt-2">
            <span className="text-gray-400">Notional Value:</span>
            <span className="text-white font-bold">
              ${amountNum && market.leverage ? (amountNum * market.leverage).toFixed(2) : '0.00'}
            </span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        disabled={submitting || !amount || Number(amount) <= 0 || !canAfford}
        onClick={() => {
          (async () => {
            setSubmitting(true);
            try {
              await executePosition(accessToken, {
                marketId: market.id,
                side,
                amount,
                leverage: market.leverage,
              });
              emitDebugLog({
                level: 'info',
                scope: 'trade',
                message: 'Position submitted',
                data: { marketId: market.id, side, amount, leverage: market.leverage },
              });
              toast.success('Position opened successfully! 🎉');
              setAmount('10'); // Reset
              onPlaced();
            } catch (e) {
              console.error(e);
              emitDebugLog({ level: 'error', scope: 'trade', message: 'Position submit failed', data: { message: (e as Error).message } });
              toast.error((e as Error).message || 'Failed to place bet');
            } finally {
              setSubmitting(false);
            }
          })();
        }}
        className="w-full bg-war-green text-war-dark font-bold px-8 py-4 text-xl hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {submitting ? 'PLACING BET...' : 'PLACE BET'}
      </button>
    </div>
  );
}

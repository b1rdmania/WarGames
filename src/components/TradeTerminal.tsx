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
    <div className="space-y-4">
      {/* Market Selector */}
      <div>
        <label className="block text-xs text-gray-400 mb-2">MARKET</label>
        <select
          value={marketId}
          onChange={(e) => setMarketId(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
        >
          {markets.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">{market.description}</p>
      </div>

      {/* Direction */}
      <div>
        <label className="block text-xs text-gray-400 mb-2">DIRECTION</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setSide('long')}
            className={`py-3 rounded font-bold transition-all ${
              side === 'long'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            ↑ BET UP
          </button>
          <button
            onClick={() => setSide('short')}
            className={`py-3 rounded font-bold transition-all ${
              side === 'short'
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            ↓ BET DOWN
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {side === 'long' ? (
            <>Long {market.pairs.long} / Short {market.pairs.short}</>
          ) : (
            <>Long {market.pairs.short} / Short {market.pairs.long}</>
          )}
        </p>
      </div>

      {/* Amount */}
      <div>
        <label className="block text-xs text-gray-400 mb-2">AMOUNT (USDC)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-lg font-bold focus:border-green-500 focus:outline-none"
          placeholder="10"
        />
        {perpUsdc && (
          <p className="text-xs text-gray-500 mt-1">
            Available: ${Number(perpUsdc).toFixed(2)}
          </p>
        )}
        {!canAfford && (
          <p className="text-xs text-yellow-500 mt-1">⚠️ Insufficient balance</p>
        )}
      </div>

      {/* Summary */}
      <div className="bg-gray-800/50 border border-gray-700 rounded p-3 text-xs space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-400">Leverage:</span>
          <span className="text-green-400 font-bold">{market.leverage}x</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Notional:</span>
          <span className="text-white font-bold">
            ${amountNum && market.leverage ? (amountNum * market.leverage).toFixed(2) : '0.00'}
          </span>
        </div>
      </div>

      {/* Submit */}
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
              toast.success('Position opened! 🎉');
              setAmount('10');
              onPlaced();
            } catch (e) {
              console.error(e);
              toast.error((e as Error).message || 'Failed to place bet');
            } finally {
              setSubmitting(false);
            }
          })();
        }}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors shadow-lg"
      >
        {submitting ? 'PLACING...' : 'PLACE BET'}
      </button>
    </div>
  );
}

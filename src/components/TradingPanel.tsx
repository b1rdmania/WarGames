'use client';

import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import type { PearMarketConfig } from '@/integrations/pear/types';
import { executePosition } from '@/integrations/pear/positions';

export function TradingPanel({
  accessToken,
  markets,
  balance,
  onPlaced,
}: {
  accessToken: string;
  markets: PearMarketConfig[];
  balance: string | null;
  onPlaced: () => void;
}) {
  const [marketId, setMarketId] = useState(markets[0]?.id ?? '');
  const [side, setSide] = useState<'long' | 'short'>('long');
  const [amount, setAmount] = useState('10');
  const [submitting, setSubmitting] = useState(false);

  const market = useMemo(() => markets.find((m) => m.id === marketId) ?? null, [markets, marketId]);
  const balanceNum = balance ? Number(balance) : null;
  const amountNum = amount ? Number(amount) : null;
  const canAfford = balanceNum === null || !Number.isFinite(balanceNum) || amountNum === null ? true : balanceNum >= amountNum;

  if (!market) return null;

  return (
    <div className="bg-gradient-to-br from-pear-panel via-pear-panel-light to-pear-panel rounded-2xl p-6 border border-pear-lime/30 sticky top-6">
      <h2 className="text-2xl font-bold text-white mb-6">Place Bet</h2>

      <div className="space-y-6">
        {/* Market selector */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Market</label>
          <select
            value={marketId}
            onChange={(e) => setMarketId(e.target.value)}
            className="w-full bg-black/30 border border-pear-lime/20 rounded-lg px-4 py-3 text-white focus:border-pear-lime focus:outline-none focus:ring-2 focus:ring-pear-lime/20"
          >
            {markets.map((m) => (
              <option key={m.id} value={m.id} className="bg-pear-dark">
                {m.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-2">{market.description}</p>
        </div>

        {/* Direction */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Direction</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSide('long')}
              className={`py-4 rounded-lg font-bold transition-all ${
                side === 'long'
                  ? 'bg-pear-lime text-pear-dark shadow-lg shadow-pear-lime/30'
                  : 'bg-black/30 text-gray-400 hover:bg-black/50 border border-pear-lime/10'
              }`}
            >
              ↑ BET UP
            </button>
            <button
              onClick={() => setSide('short')}
              className={`py-4 rounded-lg font-bold transition-all ${
                side === 'short'
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                  : 'bg-black/30 text-gray-400 hover:bg-black/50 border border-pear-lime/10'
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
          <label className="block text-sm font-medium text-gray-400 mb-2">Amount (USDC)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-black/30 border border-pear-lime/20 rounded-lg px-4 py-3 text-white text-xl font-bold focus:border-pear-lime focus:outline-none focus:ring-2 focus:ring-pear-lime/20"
            placeholder="10"
          />
          {balance && (
            <p className="text-xs text-gray-500 mt-2">
              Available: ${Number(balance).toFixed(2)}
            </p>
          )}
          {!canAfford && (
            <p className="text-xs text-red-400 mt-2">⚠️ Insufficient balance</p>
          )}
        </div>

        {/* Summary */}
        <div className="bg-black/30 rounded-lg p-4 border border-pear-lime/10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Leverage</span>
            <span className="text-pear-lime font-bold">{market.leverage}x</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-400">Notional Value</span>
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
          className="w-full bg-pear-lime hover:bg-pear-lime-light disabled:bg-gray-700 disabled:cursor-not-allowed text-pear-dark font-bold py-4 rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:scale-100 disabled:shadow-none text-lg"
        >
          {submitting ? 'Placing Bet...' : 'Place Bet'}
        </button>
      </div>
    </div>
  );
}

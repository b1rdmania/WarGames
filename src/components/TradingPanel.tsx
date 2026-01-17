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
    <div className="pear-border bg-black/40 p-6 sticky top-6">
      <div className="text-sm font-mono text-gray-300 mb-4">[ PLACE BET ]</div>

      <div className="space-y-6">
        {/* Market selector */}
        <div>
          <label className="block tm-label mb-2">Market</label>
          <select
            value={marketId}
            onChange={(e) => setMarketId(e.target.value)}
            className="tm-control"
          >
            {markets.map((m) => (
              <option key={m.id} value={m.id} className="bg-pear-dark">
                {m.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-2 font-mono">{market.description}</p>
        </div>

        {/* Market Info */}
        <div className="pear-border bg-black/20 p-3">
          <div className="text-xs text-gray-500 mb-2 font-mono uppercase tracking-wider">Trading Pair</div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-mono text-white">
              {market.pairs.long} / {market.pairs.short}
            </div>
            <div className="text-xs text-pear-lime font-mono">
              {market.leverage}x Leverage
            </div>
          </div>
        </div>

        {/* Direction */}
        <div>
          <label className="block tm-label mb-2">Direction</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSide('long')}
              className={`tm-btn w-full ${
                side === 'long'
                  ? ''
                  : 'text-gray-400 border-pear-lime/20'
              }`}
            >
              ↑ BET UP
            </button>
            <button
              onClick={() => setSide('short')}
              className={`tm-btn tm-btn-danger w-full ${
                side === 'short'
                  ? ''
                  : 'text-gray-400 border-pear-lime/20'
              }`}
            >
              ↓ BET DOWN
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 font-mono">
            {side === 'long' ? (
              <>Long {market.pairs.long} / Short {market.pairs.short}</>
            ) : (
              <>Long {market.pairs.short} / Short {market.pairs.long}</>
            )}
          </p>
        </div>

        {/* Amount */}
        <div>
          <label className="block tm-label mb-2">Amount (USDC)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="tm-control"
            placeholder="10"
          />
          {balance && (
            <p className="text-xs text-gray-500 mt-2 font-mono">
              Available: ${Number(balance).toFixed(2)}
            </p>
          )}
          {!canAfford && (
            <p className="text-xs text-red-400 mt-2 font-mono">INSUFFICIENT BALANCE</p>
          )}
        </div>

        {/* Summary */}
        <div className="bg-black/20 p-4 pear-border">
          <div className="flex items-center justify-between text-sm font-mono">
            <span className="text-gray-400">LEVERAGE</span>
            <span className="text-pear-lime">{market.leverage}x</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2 font-mono">
            <span className="text-gray-400">NOTIONAL</span>
            <span className="text-white">
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
          className="w-full pear-border pear-text py-3 font-mono text-sm hover:pear-glow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'PLACING…' : 'PLACE BET'}
        </button>
      </div>
    </div>
  );
}

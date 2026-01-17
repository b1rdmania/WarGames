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
    <div className="bg-war-panel neon-border p-6">
      <div className="text-sm text-war-green font-mono mb-3">[ PLACE BET ]</div>

      <div className="grid md:grid-cols-3 gap-3 items-end">
        <div>
          <div className="text-xs text-gray-500 mb-1">MARKET</div>
          <select
            value={marketId}
            onChange={(e) => setMarketId(e.target.value)}
            className="w-full bg-war-dark border border-gray-700 px-3 py-2 text-sm"
          >
            {markets.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="text-xs text-gray-500 mb-1">SIDE</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSide('long')}
              className={`py-2 text-sm font-bold border ${
                side === 'long' ? 'bg-green-600 border-green-500 text-white' : 'border-gray-700 text-gray-300'
              }`}
            >
              UP ↑
            </button>
            <button
              onClick={() => setSide('short')}
              className={`py-2 text-sm font-bold border ${
                side === 'short' ? 'bg-red-600 border-red-500 text-white' : 'border-gray-700 text-gray-300'
              }`}
            >
              DOWN ↓
            </button>
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500 mb-1">AMOUNT (USD)</div>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-war-dark border border-gray-700 px-3 py-2 text-sm"
            inputMode="decimal"
          />
          {!canAfford && (
            <div className="mt-1 text-[11px] text-yellow-400">Insufficient perp USDC for this amount.</div>
          )}
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-400">
        UNDERLYING: ↑ {side === 'long' ? market.pairs.long : market.pairs.short} vs ↓{' '}
        {side === 'long' ? market.pairs.short : market.pairs.long} (lev {market.leverage}x)
      </div>

      <div className="mt-4">
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
                toast.success('Bet placed');
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
          className="bg-war-green text-war-dark font-bold px-4 py-2 text-sm hover:opacity-80 disabled:opacity-50"
        >
          {submitting ? 'SENDING…' : 'SUBMIT'}
        </button>
      </div>
    </div>
  );
}


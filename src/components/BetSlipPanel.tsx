'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import type { ValidatedMarket } from '@/integrations/pear/marketValidation';
import { executePosition } from '@/integrations/pear/positions';

function formatBasketLabel(assets: { asset: string; weight?: number }[]) {
  const names = assets.map((a) => a.asset).filter(Boolean);
  if (names.length === 0) return 'BASKET';
  return names.join(' + ');
}

export function BetSlipPanel({
  market,
  side,
  balance,
  accessToken,
  yoloCapUsd = 50,
  onSideChange,
  onClear,
  onPlaced,
}: {
  market: ValidatedMarket | null;
  side: 'long' | 'short' | null;
  balance: string | null;
  accessToken: string;
  yoloCapUsd?: number;
  onSideChange: (side: 'long' | 'short') => void;
  onClear: () => void;
  onPlaced: () => void;
}) {
  const [amount, setAmount] = useState('10');
  const [submitting, setSubmitting] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Clear error when market changes
  useEffect(() => {
    setLastError(null);
  }, [market?.id]);

  const balanceNum = balance ? Number(balance) : null;
  const presets = useMemo(() => [5, 10, 25], []);

  const yoloAmount = useMemo(() => {
    const cap = yoloCapUsd;
    if (balanceNum === null || !Number.isFinite(balanceNum)) return cap;
    return Math.max(1, Math.min(balanceNum, cap));
  }, [balanceNum, yoloCapUsd]);

  const canAfford = useMemo(() => {
    const a = Number(amount);
    if (!Number.isFinite(a) || a <= 0) return false;
    if (balanceNum === null || !Number.isFinite(balanceNum)) return true;
    return balanceNum >= a;
  }, [amount, balanceNum]);

  // Empty state
  if (!market) {
    return (
      <div className="tm-box">
        <div className="text-sm font-semibold text-brand-amber mb-4">Bet Slip</div>
        <div className="text-center py-8">
          <div className="text-text-muted text-sm">
            Select a market and click YES or NO to place a bet
          </div>
        </div>
      </div>
    );
  }

  const resolvedPairs = market.resolvedPairs ?? market.pairs;
  const resolvedBasket = market.resolvedBasket ?? market.basket;

  const longLeg =
    resolvedPairs?.long ?? (resolvedBasket ? formatBasketLabel(resolvedBasket.long) : '—');
  const shortLeg =
    resolvedPairs?.short ?? (resolvedBasket ? formatBasketLabel(resolvedBasket.short) : '—');

  return (
    <div className="tm-box">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="text-sm font-semibold text-brand-amber">Bet Slip</div>
          <div className="mt-1 text-text-primary font-medium">{market.name}</div>
        </div>
        <button onClick={onClear} className="tm-btn px-2 py-1 text-[10px]" title="Clear selection">
          Clear
        </button>
      </div>

      <div className="text-xs text-gray-400 font-mono mb-4">{market.description}</div>

      {/* Direction Toggle */}
      <div className="mb-4">
        <div className="tm-label mb-2">Direction</div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onSideChange('long')}
            className={`tm-btn w-full py-3 ${side === 'long' ? 'bg-pear-lime/20 border-pear-lime' : ''}`}
          >
            YES (LONG)
          </button>
          <button
            onClick={() => onSideChange('short')}
            className={`tm-btn tm-btn-danger w-full py-3 ${side === 'short' ? 'bg-red-500/20 border-red-400' : ''}`}
          >
            NO (SHORT)
          </button>
        </div>
        {side && (
          <div className="mt-2 text-xs text-gray-500 font-mono">
            {side === 'long' ? `Betting ${longLeg} outperforms ${shortLeg}` : `Betting ${shortLeg} outperforms ${longLeg}`}
          </div>
        )}
      </div>

      {/* Stake Input */}
      <div className="mb-4">
        <div className="tm-label mb-2">Size (USDC)</div>
        <div className="grid grid-cols-4 gap-2 mb-2">
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => setAmount(String(p))}
              className={`tm-btn w-full text-xs ${amount === String(p) ? 'bg-pear-lime/20' : ''}`}
              disabled={submitting}
            >
              ${p}
            </button>
          ))}
          <button
            onClick={() => setAmount(String(Math.floor(yoloAmount)))}
            className="tm-btn tm-btn-danger w-full text-xs"
            disabled={submitting}
            title={`YOLO capped at $${yoloCapUsd}`}
          >
            YOLO
          </button>
        </div>
        <input
          className="tm-control w-full"
          inputMode="decimal"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="10"
          disabled={submitting}
        />
        {balance && (
          <div className="mt-2 text-xs text-gray-500 font-mono">
            Available: ${Number(balance).toFixed(2)}
          </div>
        )}
        {!canAfford && (
          <div className="mt-2 text-xs text-red-300 font-mono">INSUFFICIENT BALANCE</div>
        )}
      </div>

      {/* Details */}
      <div className="mb-4 tm-box text-xs">
        <div className="tm-row">
          <div className="tm-k">Underlying</div>
          <div className="tm-v">{longLeg} / {shortLeg}</div>
        </div>
        {!market.isTradable && (
          <div className="tm-row">
            <div className="tm-k">Status</div>
            <div className="tm-v text-yellow-200">INACTIVE</div>
          </div>
        )}
        {!market.isTradable && market.unavailableReason && (
          <div className="tm-row">
            <div className="tm-k">Why</div>
            <div className="tm-v text-yellow-200">{market.unavailableReason}</div>
          </div>
        )}
        <div className="tm-row">
          <div className="tm-k">Leverage</div>
          <div className="tm-v text-pear-lime">{market.leverage}x</div>
        </div>
        <div className="tm-row">
          <div className="tm-k">Slippage</div>
          <div className="tm-v">1% max</div>
        </div>
      </div>

      {/* Error display */}
      {lastError && (
        <div className="mb-4 tm-box border-red-400/30 bg-red-500/10">
          <div className="text-xs font-mono text-red-300 mb-2">ERROR: {lastError}</div>
          <button
            className="tm-btn tm-btn-danger w-full text-xs"
            onClick={() => setLastError(null)}
          >
            DISMISS
          </button>
        </div>
      )}

      {/* Submit Button */}
      <button
        className={`tm-btn w-full py-4 ${side === 'short' ? 'tm-btn-danger' : ''}`}
        disabled={submitting || !canAfford || !side || !!lastError || !market.isTradable}
        onClick={async () => {
          if (!side) {
            toast.error('Select YES or NO');
            return;
          }
          if (!market.isTradable) {
            toast.error('This market is currently inactive');
            return;
          }
          setSubmitting(true);
          setLastError(null);
          try {
            await executePosition(accessToken, {
              marketId: market.id,
              side,
              amount,
              leverage: market.leverage,
              resolvedPairs: market.resolvedPairs,
              resolvedBasket: market.resolvedBasket,
            });
            if (!mountedRef.current) return;
            toast.success('Position opened!');
            onPlaced();
          } catch (e) {
            if (!mountedRef.current) return;
            const errMsg = (e as Error).message || 'Failed to execute';
            if (errMsg.includes('401') || errMsg.includes('unauthorized') || errMsg.includes('token')) {
              setLastError('Session expired. Please re-authenticate.');
              toast.error('Session expired');
            } else {
              setLastError(errMsg);
              toast.error(errMsg);
            }
          } finally {
            if (mountedRef.current) {
              setSubmitting(false);
            }
          }
        }}
      >
        {submitting ? 'SENDING...' : !side ? 'SELECT YES OR NO' : 'SEND IT'}
      </button>
    </div>
  );
}

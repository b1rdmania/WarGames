'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import type { ValidatedMarket } from '@/integrations/pear/marketValidation';
import { executePosition } from '@/integrations/pear/positions';

function formatBasketLabel(assets: { asset: string; weight?: number }[]) {
  const names = assets.map((a) => a.asset.split(':').pop()).filter(Boolean);
  if (names.length === 0) return 'Basket';
  if (names.length <= 3) return names.join(' + ');
  return `${names.slice(0, 2).join(' + ')} +${names.length - 2}`;
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
  const [showError, setShowError] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setLastError(null);
    setShowError(false);
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
        <div className="text-sm font-semibold text-text-primary mb-2">Trade</div>
        <div className="text-center py-8">
          <div className="text-text-muted text-sm">
            Select a market to start
          </div>
        </div>
      </div>
    );
  }

  const resolvedPairs = market.resolvedPairs ?? market.pairs;
  const resolvedBasket = market.resolvedBasket ?? market.basket;

  const longLeg = resolvedPairs?.long ?? (resolvedBasket ? formatBasketLabel(resolvedBasket.long) : '—');
  const shortLeg = resolvedPairs?.short ?? (resolvedBasket ? formatBasketLabel(resolvedBasket.short) : '—');

  return (
    <div className="tm-box">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-text-primary truncate">{market.name}</div>
          <div className="text-xs text-text-muted mt-0.5">{market.leverage}x leverage</div>
        </div>
        <button
          onClick={onClear}
          className="text-[11px] text-text-muted hover:text-text-secondary transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Direction */}
      <div className="mb-4">
        <div className="text-[11px] uppercase tracking-wide text-text-muted mb-2">Direction</div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onSideChange('long')}
            className={`py-3 rounded-md text-sm font-medium transition-all ${
              side === 'long'
                ? 'bg-profit/15 text-profit border border-profit/30'
                : 'bg-bg-surface/60 text-text-secondary border border-transparent hover:border-border'
            }`}
          >
            YES
          </button>
          <button
            onClick={() => onSideChange('short')}
            className={`py-3 rounded-md text-sm font-medium transition-all ${
              side === 'short'
                ? 'bg-loss/15 text-loss border border-loss/30'
                : 'bg-bg-surface/60 text-text-secondary border border-transparent hover:border-border'
            }`}
          >
            NO
          </button>
        </div>
        {side && (
          <div className="mt-2 text-xs text-text-muted">
            {side === 'long' ? (
              <><span className="text-profit">{longLeg}</span> outperforms <span className="text-loss">{shortLeg}</span></>
            ) : (
              <><span className="text-loss">{shortLeg}</span> outperforms <span className="text-profit">{longLeg}</span></>
            )}
          </div>
        )}
      </div>

      {/* Size */}
      <div className="mb-4">
        <div className="text-[11px] uppercase tracking-wide text-text-muted mb-2">Size (USDC)</div>
        <div className="grid grid-cols-4 gap-2 mb-2">
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => setAmount(String(p))}
              disabled={submitting}
              className={`py-2 rounded-md text-xs font-medium transition-all ${
                amount === String(p)
                  ? 'bg-primary/15 text-primary border border-primary/30'
                  : 'bg-bg-surface/60 text-text-secondary border border-transparent hover:border-border'
              }`}
            >
              ${p}
            </button>
          ))}
        </div>
        <input
          className="w-full bg-bg-surface/60 border border-border rounded-md px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
          inputMode="decimal"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          disabled={submitting}
        />
        <div className="flex items-center justify-between mt-2 text-xs">
          {balance && (
            <span className="text-text-muted">
              Available: <span className="text-text-primary font-mono">${Number(balance).toFixed(2)}</span>
            </span>
          )}
          {!canAfford && (
            <span className="text-loss">Insufficient balance</span>
          )}
        </div>
      </div>

      {/* Trade Info */}
      <div className="bg-bg-surface/40 rounded-md p-3 mb-4 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-text-muted">Underlying</span>
          <span className="text-text-primary">{longLeg} / {shortLeg}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-text-muted">Slippage</span>
          <span className="text-text-primary">1% max</span>
        </div>
        {!market.isTradable && (
          <div className="flex justify-between text-xs">
            <span className="text-text-muted">Status</span>
            <span className="text-warning">Inactive</span>
          </div>
        )}
      </div>

      {/* Error (collapsible) */}
      {lastError && (
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowError(!showError)}
            className="text-[11px] text-loss hover:text-loss/80 transition-colors"
          >
            {showError ? '▾ Hide error' : '▸ Show error'}
          </button>
          {showError && (
            <div className="mt-2 p-3 bg-loss/10 rounded-md">
              <p className="text-xs text-loss/90 break-all">{lastError}</p>
              <button
                className="mt-2 text-[11px] text-text-muted hover:text-text-secondary"
                onClick={() => {
                  setLastError(null);
                  setShowError(false);
                }}
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      )}

      {/* Submit */}
      <button
        className={`w-full py-3 rounded-md font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
          side === 'short'
            ? 'bg-loss text-white hover:bg-loss/90'
            : 'bg-primary text-bg-deep hover:bg-primary-hover'
        }`}
        disabled={submitting || !canAfford || !side || !!lastError || !market.isTradable}
        onClick={async () => {
          if (!side) {
            toast.error('Select YES or NO');
            return;
          }
          if (!market.isTradable) {
            toast.error('Market is inactive');
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
            toast.success('Position opened');
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
        {submitting ? 'Placing...' : !side ? 'Select direction' : 'Place Trade'}
      </button>
    </div>
  );
}

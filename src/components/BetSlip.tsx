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

export function BetSlip({
  isOpen,
  market,
  side,
  balance,
  accessToken,
  yoloCapUsd = 50,
  onClose,
  onPlaced,
}: {
  isOpen: boolean;
  market: ValidatedMarket | null;
  side: 'long' | 'short' | null; // long=YES, short=NO
  balance: string | null;
  accessToken: string;
  yoloCapUsd?: number;
  onClose: () => void;
  onPlaced: () => void;
}) {
  const [amount, setAmount] = useState('10');
  const [submitting, setSubmitting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  // Track mounted state to prevent state updates after unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Clear error when modal reopens
  useEffect(() => {
    if (isOpen) {
      setLastError(null);
    }
  }, [isOpen]);

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

  if (!isOpen || !market || !side) return null;

  const directionLabel = side === 'long' ? 'YES' : 'NO';
  const directionHint = side === 'long' ? 'Betting UP (long)' : 'Betting DOWN (short)';

  const resolvedPairs = market.resolvedPairs ?? market.pairs;
  const resolvedBasket = market.resolvedBasket ?? market.basket;

  const longLeg =
    resolvedPairs?.long ?? (resolvedBasket ? formatBasketLabel(resolvedBasket.long) : '—');
  const shortLeg =
    resolvedPairs?.short ?? (resolvedBasket ? formatBasketLabel(resolvedBasket.short) : '—');

  return (
    <div className="fixed inset-0 z-[1000] bg-black/80 flex items-end md:items-center justify-center p-3">
      <div className="w-full max-w-xl bg-pear-dark pear-border p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm text-pear-lime font-mono">[ BET SLIP ]</div>
            <div className="mt-1 text-white font-mono text-lg">{market.name}</div>
            <div className="mt-1 text-xs text-gray-400 font-mono">{market.description}</div>
          </div>
          <button onClick={onClose} className="tm-btn px-3 py-2">
            ✕
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="tm-label">Direction</div>
          <div className="flex gap-2">
            <div className={`tm-btn ${side === 'short' ? 'tm-btn-danger' : ''}`}>
              {directionLabel}
            </div>
            <div className="text-xs text-gray-500 font-mono self-center">{directionHint}</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="tm-label mb-2">Size (USDC)</div>
          <div className="grid grid-cols-4 gap-2">
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => setAmount(String(p))}
                className="tm-btn w-full"
                disabled={submitting}
              >
                ${p}
              </button>
            ))}
            <button
              onClick={() => setAmount(String(Math.floor(yoloAmount)))}
              className="tm-btn tm-btn-danger w-full"
              disabled={submitting}
              title={`YOLO capped at $${yoloCapUsd}`}
            >
              YOLO
            </button>
          </div>
          <div className="mt-2">
            <input
              className="tm-control"
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
        </div>

        <div className="mt-4">
          <button
            onClick={() => setShowDetails((v) => !v)}
            className="tm-btn w-full text-gray-300"
          >
            {showDetails ? 'HIDE DETAILS' : 'DETAILS'}
          </button>
          {showDetails && (
            <div className="mt-3 tm-box">
              <div className="tm-row">
                <div className="tm-k">Underlying</div>
                <div className="tm-v">{longLeg} / {shortLeg}</div>
              </div>
              <div className="tm-row">
                <div className="tm-k">Leverage</div>
                <div className="tm-v text-pear-lime">{market.leverage}x</div>
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
                <div className="tm-k">Slippage</div>
                <div className="tm-v">1% max</div>
              </div>
            </div>
          )}
        </div>

        {/* Error display with retry */}
        {lastError && (
          <div className="mt-4 tm-box border-red-400/30 bg-red-500/10">
            <div className="text-xs font-mono text-red-300 mb-2">ERROR: {lastError}</div>
            <button
              className="tm-btn tm-btn-danger w-full"
              onClick={() => setLastError(null)}
            >
              DISMISS & RETRY
            </button>
          </div>
        )}

        <div className="mt-4">
          <button
            className={`tm-btn w-full ${side === 'short' ? 'tm-btn-danger' : ''}`}
            disabled={submitting || !canAfford || !!lastError || !market.isTradable}
            onClick={async () => {
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
                toast.success('Locked in.');
                onPlaced();
                onClose();
              } catch (e) {
                if (!mountedRef.current) return;
                const errMsg = (e as Error).message || 'Failed to execute';
                // Check for auth-related errors
                if (errMsg.includes('401') || errMsg.includes('unauthorized') || errMsg.includes('token')) {
                  setLastError('Session expired. Please re-authenticate on the Trade page.');
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
            {submitting ? 'SENDING…' : 'SEND IT'}
          </button>
        </div>
      </div>
    </div>
  );
}


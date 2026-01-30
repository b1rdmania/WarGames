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
      <div className="panel">
        <div className="panel-header">BET SLIP</div>
        <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
          SELECT MARKET + DIRECTION
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
    <div className="panel">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '12px', borderBottom: '1px solid var(--border)', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '4px' }}>BET SLIP</div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{market.name}</div>
        </div>
        <button
          onClick={onClear}
          style={{
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '0.06em',
            padding: '4px 8px',
            background: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          CLEAR
        </button>
      </div>

      {/* Description */}
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
        {market.description}
      </div>

      {/* Direction Toggle */}
      <div style={{ marginBottom: '16px' }}>
        <div className="label" style={{ marginBottom: '8px' }}>DIRECTION</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button
            onClick={() => onSideChange('long')}
            style={{
              padding: '12px',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              background: side === 'long' ? 'rgba(34, 197, 94, 0.15)' : 'transparent',
              border: `1px solid ${side === 'long' ? 'var(--green)' : 'var(--border)'}`,
              color: side === 'long' ? 'var(--green)' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            YES (LONG)
          </button>
          <button
            onClick={() => onSideChange('short')}
            style={{
              padding: '12px',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              background: side === 'short' ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
              border: `1px solid ${side === 'short' ? 'var(--red)' : 'var(--border)'}`,
              color: side === 'short' ? 'var(--red)' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            NO (SHORT)
          </button>
        </div>
        {side && (
          <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
            {side === 'long' ? `${longLeg} OUTPERFORMS ${shortLeg}` : `${shortLeg} OUTPERFORMS ${longLeg}`}
          </div>
        )}
      </div>

      {/* Size Input */}
      <div style={{ marginBottom: '16px' }}>
        <div className="label" style={{ marginBottom: '8px' }}>SIZE (USDC)</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', marginBottom: '8px' }}>
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => setAmount(String(p))}
              disabled={submitting}
              style={{
                padding: '8px',
                fontSize: '11px',
                fontWeight: 500,
                background: amount === String(p) ? 'var(--bg-hover)' : 'transparent',
                border: `1px solid ${amount === String(p) ? 'var(--border-strong)' : 'var(--border)'}`,
                color: 'var(--text-secondary)',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.5 : 1,
              }}
            >
              ${p}
            </button>
          ))}
        </div>
        <input
          className="input"
          inputMode="decimal"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="10"
          disabled={submitting}
        />
        {balance && (
          <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
            AVAILABLE: ${Number(balance).toFixed(2)}
          </div>
        )}
        {!canAfford && (
          <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--red)' }}>
            INSUFFICIENT BALANCE
          </div>
        )}
      </div>

      {/* Details */}
      <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--bg-input)', border: '1px solid var(--border)' }}>
        <div className="data-row">
          <span className="data-label">UNDERLYING</span>
          <span className="data-value">{longLeg} / {shortLeg}</span>
        </div>
        <div className="data-row">
          <span className="data-label">LEVERAGE</span>
          <span className="data-value" style={{ color: 'var(--amber)' }}>{market.leverage}x</span>
        </div>
        <div className="data-row">
          <span className="data-label">SLIPPAGE</span>
          <span className="data-value">1% MAX</span>
        </div>
        {!market.isTradable && (
          <>
            <div className="data-row">
              <span className="data-label">STATUS</span>
              <span className="data-value" style={{ color: 'var(--amber)' }}>INACTIVE</span>
            </div>
            {market.unavailableReason && (
              <div className="data-row">
                <span className="data-label">REASON</span>
                <span className="data-value" style={{ color: 'var(--amber)' }}>{market.unavailableReason}</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Error */}
      {lastError && (
        <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--red-dim)' }}>
          <div style={{ fontSize: '11px', color: 'var(--red)', marginBottom: '8px' }}>ERROR: {lastError}</div>
          <button
            onClick={() => setLastError(null)}
            style={{
              width: '100%',
              padding: '8px',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              background: 'transparent',
              border: '1px solid var(--red)',
              color: 'var(--red)',
              cursor: 'pointer',
            }}
          >
            DISMISS
          </button>
        </div>
      )}

      {/* Submit */}
      <button
        disabled={submitting || !canAfford || !side || !!lastError || !market.isTradable}
        onClick={async () => {
          if (!side) {
            toast.error('SELECT DIRECTION');
            return;
          }
          if (!market.isTradable) {
            toast.error('MARKET INACTIVE');
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
            toast.success('POSITION OPENED');
            onPlaced();
          } catch (e) {
            if (!mountedRef.current) return;
            const errMsg = (e as Error).message || 'EXECUTION FAILED';
            if (errMsg.includes('401') || errMsg.includes('unauthorized') || errMsg.includes('token')) {
              setLastError('SESSION EXPIRED');
              toast.error('SESSION EXPIRED');
            } else {
              setLastError(errMsg.toUpperCase());
              toast.error(errMsg);
            }
          } finally {
            if (mountedRef.current) {
              setSubmitting(false);
            }
          }
        }}
        style={{
          width: '100%',
          padding: '14px',
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '0.06em',
          background: side === 'short' ? 'var(--red)' : 'var(--amber)',
          border: 'none',
          color: 'var(--bg-base)',
          cursor: submitting || !canAfford || !side || !!lastError || !market.isTradable ? 'not-allowed' : 'pointer',
          opacity: submitting || !canAfford || !side || !!lastError || !market.isTradable ? 0.5 : 1,
        }}
      >
        {submitting ? 'EXECUTING...' : !side ? 'SELECT DIRECTION' : 'EXECUTE'}
      </button>
    </div>
  );
}

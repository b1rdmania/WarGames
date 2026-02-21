'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import type { ValidatedMarket } from '@/integrations/pear/marketValidation';
import { executePosition } from '@/integrations/pear/positions';
import { formatPairOrBasketSide } from '@/lib/marketDisplay';
import styles from './BetSlipPanel.module.css';

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

  const canAfford = useMemo(() => {
    const a = Number(amount);
    if (!Number.isFinite(a) || a <= 0) return false;
    if (balanceNum === null || !Number.isFinite(balanceNum)) return true;
    return balanceNum >= a;
  }, [amount, balanceNum]);

  if (!market) {
    return (
      <div className={styles.card}>
        <div className={styles.emptyState}>
          <div className={styles.emptyText}>Select a market to start</div>
        </div>
      </div>
    );
  }

  const leverage = market.effectiveLeverage ?? market.leverage;
  const longLeg = formatPairOrBasketSide(market, 'long', { compact: true, maxItems: 3 });
  const shortLeg = formatPairOrBasketSide(market, 'short', { compact: true, maxItems: 3 });

  const submitBtnClass = !side
    ? styles.submitBtnNeutral
    : side === 'short'
    ? styles.submitBtnShort
    : styles.submitBtnLong;

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <div className={styles.marketName}>{market.name}</div>
          <div className={styles.leverage}>{leverage}x leverage</div>
        </div>
        <button onClick={onClear} className={styles.clearBtn}>
          Clear
        </button>
      </div>

      {/* Direction */}
      <div className={styles.sectionLabel}>Direction</div>
      <div className={styles.directionRow}>
        <button
          onClick={() => onSideChange('long')}
          className={`${styles.dirBtn} ${side === 'long' ? styles.dirBtnYes : ''}`}
        >
          YES
        </button>
        <button
          onClick={() => onSideChange('short')}
          className={`${styles.dirBtn} ${side === 'short' ? styles.dirBtnNo : ''}`}
        >
          NO
        </button>
      </div>
      {side && (
        <div className={styles.directionHint}>
          {side === 'long' ? (
            <>
              <span className={styles.long}>{longLeg}</span> outperforms{' '}
              <span className={styles.short}>{shortLeg}</span>
            </>
          ) : (
            <>
              <span className={styles.short}>{shortLeg}</span> outperforms{' '}
              <span className={styles.long}>{longLeg}</span>
            </>
          )}
        </div>
      )}

      {/* Size */}
      <div className={styles.sizeSection}>
        <div className={styles.sectionLabel}>Size (USDC)</div>
        <div className={styles.presets}>
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => setAmount(String(p))}
              disabled={submitting}
              className={`${styles.presetBtn} ${amount === String(p) ? styles.presetBtnActive : ''}`}
            >
              ${p}
            </button>
          ))}
        </div>
        <input
          className={styles.sizeInput}
          inputMode="decimal"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          disabled={submitting}
        />
        <div className={styles.balanceRow}>
          {balance && (
            <span className={styles.balanceLabel}>
              Available: <span className={styles.balanceValue}>${Number(balance).toFixed(2)}</span>
            </span>
          )}
          {!canAfford && <span className={styles.insufficient}>Insufficient balance</span>}
        </div>
      </div>

      {/* Trade Info */}
      <div className={styles.infoBox}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Long Leg</span>
          <span className={styles.infoValue}>{longLeg}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Short Leg</span>
          <span className={styles.infoValue}>{shortLeg}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Slippage</span>
          <span className={styles.infoValue}>1% max</span>
        </div>
        {!market.isTradable && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Status</span>
            <span className={styles.infoWarning}>INACTIVE</span>
          </div>
        )}
      </div>

      {/* Error */}
      {lastError && (
        <div>
          <button
            type="button"
            onClick={() => setShowError(!showError)}
            className={styles.errorToggle}
          >
            {showError ? '▾ Hide error' : '▸ Show error'}
          </button>
          {showError && (
            <div className={styles.errorBox}>
              <p className={styles.errorText}>{lastError}</p>
              <button
                className={styles.errorDismiss}
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
        className={`${styles.submitBtn} ${submitBtnClass}`}
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
              leverage,
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
        {submitting ? 'Placing...' : !side ? 'Select direction' : 'Execute Position'}
      </button>
    </div>
  );
}

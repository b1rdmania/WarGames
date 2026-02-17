'use client';

import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import type { PearMarketConfig, ResolvedBasket, ResolvedPairs } from '@/integrations/pear/types';
import { executePosition } from '@/integrations/pear/positions';
import { MarketDetail } from '@/components/MarketDetail';

export function TradingPanel({
  accessToken,
  markets,
  balance,
  onPlaced,
}: {
  accessToken: string;
  markets: Array<
    PearMarketConfig & {
      resolvedPairs?: ResolvedPairs;
      resolvedBasket?: ResolvedBasket;
      isTradable?: boolean;
      unavailableReason?: string;
      effectiveLeverage?: number;
      maxAllowedLeverage?: number;
    }
  >;
  balance: string | null;
  onPlaced: () => void;
}) {
  const [marketId, setMarketId] = useState(markets[0]?.id ?? '');
  const [side, setSide] = useState<'long' | 'short'>('long');
  const [amount, setAmount] = useState('10');
  const [submitting, setSubmitting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const market = useMemo(() => markets.find((m) => m.id === marketId) ?? null, [markets, marketId]);
  const balanceNum = balance ? Number(balance) : null;
  const amountNum = amount ? Number(amount) : null;
  const canAfford = balanceNum === null || !Number.isFinite(balanceNum) || amountNum === null ? true : balanceNum >= amountNum;

  if (!market) return null;

  const formatBasketLabel = (assets: { asset: string }[]) => {
    const names = assets.map((a) => a.asset).filter(Boolean);
    if (names.length === 0) return 'BASKET';
    const shown = names.slice(0, 4);
    const suffix = names.length > shown.length ? '…' : '';
    return `${shown.join('+')}${suffix}`;
  };

  const effectivePairs = market.resolvedPairs ?? market.pairs;
  const effectiveBasket = market.resolvedBasket ?? market.basket;
  const leverage = market.effectiveLeverage ?? market.leverage;

  const longLabel =
    effectivePairs?.long ?? (effectiveBasket ? formatBasketLabel(effectiveBasket.long) : '—');
  const shortLabel =
    effectivePairs?.short ?? (effectiveBasket ? formatBasketLabel(effectiveBasket.short) : '—');

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

          {/* View Details Toggle */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs font-mono text-pear-lime hover:underline mt-2"
          >
            {showDetails ? '▼ Hide Details' : '▶ View Market Details'}
          </button>
        </div>

        {/* Market Details (Expandable) */}
        {showDetails && (
          <div className="animate-fadeIn">
            <MarketDetail market={market} />
          </div>
        )}

        {/* Market Info */}
        <div className="tm-box">
          <div className="tm-row">
            <div className="tm-k">Trading Pair</div>
            <div className="tm-v">{longLabel} / {shortLabel}</div>
          </div>
          <div className="tm-row">
            <div className="tm-k">Leverage</div>
            <div className="tm-v text-pear-lime">{leverage}x</div>
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
              <>Long {longLabel} / Short {shortLabel}</>
            ) : (
              <>Long {shortLabel} / Short {longLabel}</>
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
        <div className="tm-box">
          <div className="tm-row">
            <div className="tm-k">Notional</div>
            <div className="tm-v">
              ${amountNum && leverage ? (amountNum * leverage).toFixed(2) : '0.00'}
            </div>
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
                  leverage,
                  resolvedPairs: market.resolvedPairs,
                  resolvedBasket: market.resolvedBasket,
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

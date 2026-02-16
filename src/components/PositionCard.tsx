'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { closePosition } from '@/integrations/pear/positions';
import { getMarketById } from '@/integrations/pear/markets';
import type { PearPosition } from '@/integrations/pear/types';

function cleanCoin(raw?: string): string | null {
  if (!raw) return null;
  const s = raw.split(':').pop()!.trim().replace(/^[^A-Za-z0-9]+/, '');
  if (!s || s === '-' || s === '—') return null;
  return s;
}

function compactCoins(list?: Array<{ coin?: string; asset?: string }>, max = 3): string | null {
  if (!list || list.length === 0) return null;
  const coins = list
    .map((a) => cleanCoin(a.coin ?? a.asset))
    .filter((x): x is string => Boolean(x));
  if (coins.length === 0) return null;
  if (coins.length <= max) return coins.join('+');
  return `${coins.slice(0, max).join('+')}+${coins.length - max}`;
}

function StatBlock({ label, value, accent }: { label: string; value: string; accent?: 'profit' | 'loss' }) {
  const valueColor = accent === 'profit' ? 'text-profit' : accent === 'loss' ? 'text-loss' : 'text-text-primary';
  return (
    <div className="bg-bg-surface/60 rounded-md px-3 py-2.5">
      <div className="text-[11px] uppercase tracking-wide text-text-muted mb-1">{label}</div>
      <div className={`text-sm font-medium font-mono ${valueColor}`}>{value}</div>
    </div>
  );
}

export function PositionCard({
  position,
  accessToken,
  onClose,
}: {
  position: PearPosition;
  accessToken: string;
  onClose: () => void;
}) {
  const [closing, setClosing] = useState(false);
  const [showComposition, setShowComposition] = useState(false);

  const pnl = Number(position.pnl);
  const pnlPercent = Number(position.pnlPercent);
  const isProfitable = pnl >= 0;

  // Map position assets to our narrative market
  const actualLong = compactCoins(position.longAssets) ?? cleanCoin(position.longAsset) ?? '—';
  const actualShort = compactCoins(position.shortAssets) ?? cleanCoin(position.shortAsset) ?? '—';
  const market = position.marketId && position.marketId !== 'unknown' ? getMarketById(position.marketId) : undefined;
  const displayName = market?.name || (actualLong !== '—' && actualShort !== '—' ? `${actualLong}/${actualShort}` : 'Position');

  // Performance indicators
  const entryPrice = Number(position.entryPrice);
  const currentPrice = Number(position.currentPrice);
  const priceChange = entryPrice > 0 ? ((currentPrice - entryPrice) / entryPrice) * 100 : 0;
  const timeInPosition = position.timestamp
    ? Math.floor((Date.now() - position.timestamp) / (1000 * 60 * 60 * 24))
    : 0;
  const timeDisplay = timeInPosition === 0 ? 'Today' : `${timeInPosition}d`;

  const hasBasketComposition = position.longAssets && position.longAssets.length > 1;

  return (
    <div className="tm-box">
      {/* Header: Name + P&L */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div className="text-base font-semibold text-text-primary truncate">{displayName}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-profit text-xs">{actualLong}</span>
            <span className="text-text-muted text-xs">vs</span>
            <span className="text-loss text-xs">{actualShort}</span>
          </div>
        </div>
        <div className={`text-right px-3 py-1.5 rounded-md ${isProfitable ? 'bg-profit/10' : 'bg-loss/10'}`}>
          <div className={`text-lg font-semibold font-mono ${isProfitable ? 'text-profit' : 'text-loss'}`}>
            {isProfitable ? '+' : ''}${pnl.toFixed(2)}
          </div>
          <div className={`text-[11px] font-mono ${isProfitable ? 'text-profit/80' : 'text-loss/80'}`}>
            {isProfitable ? '+' : ''}{pnlPercent.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <StatBlock label="Size" value={`$${Number(position.size).toFixed(2)}`} />
        <StatBlock label="Entry" value={entryPrice.toFixed(4)} />
        <StatBlock
          label="Change"
          value={`${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)}%`}
          accent={priceChange >= 0 ? 'profit' : 'loss'}
        />
      </div>

      {/* Risk Parameters (if set) */}
      {(position.marginUsed || position.stopLoss || position.takeProfit) && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {position.marginUsed && (
            <StatBlock label="Margin" value={`$${Number(position.marginUsed).toFixed(2)}`} />
          )}
          {position.stopLoss && (
            <StatBlock
              label="Stop Loss"
              value={position.stopLoss.type === 'PERCENTAGE' ? `${position.stopLoss.value}%` : `$${position.stopLoss.value}`}
              accent="loss"
            />
          )}
          {position.takeProfit && (
            <StatBlock
              label="Take Profit"
              value={position.takeProfit.type === 'PERCENTAGE' ? `${position.takeProfit.value}%` : `$${position.takeProfit.value}`}
              accent="profit"
            />
          )}
        </div>
      )}

      {/* Basket Composition (collapsible) */}
      {hasBasketComposition && (
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowComposition(!showComposition)}
            className="text-[11px] text-text-muted hover:text-text-secondary transition-colors"
          >
            {showComposition ? '▾ Hide composition' : '▸ Show composition'}
          </button>
          {showComposition && (
            <div className="mt-3 bg-bg-surface/40 rounded-md p-3 space-y-3">
              {/* Long Side */}
              <div>
                <div className="text-[11px] uppercase tracking-wide text-profit mb-2">Long</div>
                <div className="space-y-1">
                  {position.longAssets!.map((asset, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-text-primary font-medium">{asset.coin}</span>
                        <span className="text-text-muted">
                          {(asset.size / position.longAssets!.reduce((sum, a) => sum + a.size, 0) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <span className="text-text-muted font-mono">${asset.size.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Short Side */}
              {position.shortAssets && position.shortAssets.length > 0 && (
                <div className="border-t border-border-subtle pt-3">
                  <div className="text-[11px] uppercase tracking-wide text-loss mb-2">Short</div>
                  <div className="space-y-1">
                    {position.shortAssets.map((asset, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-text-primary font-medium">{asset.coin}</span>
                          <span className="text-text-muted">
                            {(asset.size / position.shortAssets!.reduce((sum, a) => sum + a.size, 0) * 100).toFixed(0)}%
                          </span>
                        </div>
                        <span className="text-text-muted font-mono">${asset.size.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Meta line */}
      <div className="flex items-center justify-between text-[11px] text-text-muted mb-4 border-t border-border-subtle pt-3">
        <span>Opened {timeDisplay}</span>
        <a
          href="https://app.pear.garden/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          View on Pear ↗
        </a>
      </div>

      {/* Close button */}
      <button
        onClick={async () => {
          setClosing(true);
          try {
            await closePosition(accessToken, position.id);
            toast.success('Position closed');
            onClose();
          } catch (e) {
            console.error(e);
            toast.error((e as Error).message || 'Failed to close');
          } finally {
            setClosing(false);
          }
        }}
        disabled={closing}
        className="w-full tm-btn disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {closing ? 'Closing...' : 'Close Position'}
      </button>
    </div>
  );
}

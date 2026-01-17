'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { closePosition } from '@/integrations/pear/positions';
import { getMarketByAssets } from '@/integrations/pear/markets';
import type { PearPosition } from '@/integrations/pear/types';

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
  const pnl = Number(position.pnl);
  const pnlPercent = Number(position.pnlPercent);
  const isProfitable = pnl >= 0;

  // Map position assets to our narrative market
  const longAsset = position.longAsset ?? '—';
  const shortAsset = position.shortAsset ?? '—';
  const market =
    position.longAsset && position.shortAsset
      ? getMarketByAssets(position.longAsset, position.shortAsset)
      : undefined;
  const displayName = market?.name || `${longAsset}/${shortAsset}`;
  const displayDescription =
    market?.description || `${position.side === 'long' ? 'Long' : 'Short'} ${longAsset} vs ${shortAsset}`;

  // Performance indicators
  const entryPrice = Number(position.entryPrice);
  const currentPrice = Number(position.currentPrice);
  const priceChange = entryPrice > 0 ? ((currentPrice - entryPrice) / entryPrice) * 100 : 0;
  const timeInPosition = position.timestamp
    ? Math.floor((Date.now() - position.timestamp) / (1000 * 60 * 60 * 24))
    : 0;
  const timeDisplay = timeInPosition === 0 ? 'Today' : `${timeInPosition}d ago`;

  return (
    <div className="border border-pear-lime/20 bg-black/40 p-6">
      <div className="flex items-start justify-between mb-5">
        <div className="flex-1">
          <div className="text-sm font-mono text-gray-300 mb-2">[ POSITION ]</div>
          <div className="text-lg font-mono text-white mb-1">{displayName}</div>
          <div className="text-xs font-mono text-gray-500 mb-3">{displayDescription}</div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-mono px-3 py-1 border ${
              position.side === 'long'
                ? 'bg-pear-lime/10 text-pear-lime border-pear-lime/30'
                : 'bg-red-500/10 text-red-300 border-red-400/30'
            }`}>
              {position.side === 'long' ? '↑ BET UP' : '↓ BET DOWN'}
            </span>
            <span className="text-xs text-gray-400 font-mono">
              {longAsset}/{shortAsset}
            </span>
          </div>
        </div>

        <div className="text-right border border-pear-lime/10 bg-black/20 px-4 py-2">
          <div className={`text-xl font-mono ${isProfitable ? 'text-pear-lime' : 'text-red-400'}`}>
            {isProfitable ? '+' : ''}${pnl.toFixed(2)}
          </div>
          <div className={`text-xs font-mono ${isProfitable ? 'text-pear-lime/80' : 'text-red-400/80'}`}>
            {isProfitable ? '+' : ''}{pnlPercent.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-black/20 p-4 border border-pear-lime/10">
          <div className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Position Size</div>
          <div className="text-sm text-white font-mono">${Number(position.size).toFixed(2)}</div>
        </div>
        <div className="bg-black/20 p-4 border border-pear-lime/10">
          <div className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Entry Price</div>
          <div className="text-sm text-white font-mono">{Number(position.entryPrice).toFixed(4)}</div>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="flex items-center justify-between text-xs font-mono text-gray-500 mb-4 px-1">
        <div className="flex items-center gap-4">
          <span>
            Ratio moved{' '}
            <span className={priceChange >= 0 ? 'text-pear-lime' : 'text-red-400'}>
            {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
            </span>
          </span>
          <span>Opened {timeDisplay}</span>
        </div>
        <div className="text-gray-500">
          Current: {currentPrice.toFixed(4)}
        </div>
      </div>

      {/* View on Pear Protocol */}
      <a
        href="https://app.pear.garden/dashboard"
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center text-xs font-mono text-pear-lime hover:text-pear-lime-light mb-4 transition-colors"
      >
        View on Pear Dashboard ↗
      </a>

      {/* Close button */}
      <button
        onClick={async () => {
          setClosing(true);
          try {
            await closePosition(accessToken, position.id);
            toast.success('Position closed!');
            onClose();
          } catch (e) {
            console.error(e);
            toast.error((e as Error).message || 'Failed to close position');
          } finally {
            setClosing(false);
          }
        }}
        disabled={closing}
        className="w-full pear-border text-pear-lime py-3 font-mono text-sm hover:pear-glow disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {closing ? (
          'CLOSING…'
        ) : (
          'CLOSE POSITION'
        )}
      </button>
    </div>
  );
}

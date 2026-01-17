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

  return (
    <div className="bg-gradient-to-br from-pear-panel-light to-pear-panel border border-pear-lime/20 rounded-2xl p-7 hover:border-pear-lime/40 hover:shadow-xl hover:shadow-pear-lime/5 transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white mb-2">
            {displayName}
          </h3>
          <p className="text-sm text-gray-400 mb-3">{displayDescription}</p>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
              position.side === 'long'
                ? 'bg-pear-lime/20 text-pear-lime border border-pear-lime/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {position.side === 'long' ? '↑ BET UP' : '↓ BET DOWN'}
            </span>
            <span className="text-sm text-gray-400 font-mono">
              {longAsset}/{shortAsset}
            </span>
          </div>
        </div>

        {/* P&L Badge */}
        <div className={`text-right px-4 py-2 rounded-xl ${
          isProfitable
            ? 'bg-pear-lime/10 border border-pear-lime/30'
            : 'bg-red-500/10 border border-red-500/30'
        }`}>
          <div className={`text-3xl font-bold ${isProfitable ? 'text-pear-lime' : 'text-red-400'}`}>
            {isProfitable ? '+' : ''}{pnl.toFixed(2)}
          </div>
          <div className={`text-sm font-semibold ${isProfitable ? 'text-pear-lime/80' : 'text-red-400/80'}`}>
            {isProfitable ? '+' : ''}{pnlPercent.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-black/20 rounded-lg p-4">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Position Size</div>
          <div className="text-base text-white font-mono font-semibold">${Number(position.size).toFixed(2)}</div>
        </div>
        <div className="bg-black/20 rounded-lg p-4">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Entry Price</div>
          <div className="text-base text-white font-mono font-semibold">{Number(position.entryPrice).toFixed(4)}</div>
        </div>
      </div>

      {/* View on Pear Protocol */}
      <a
        href={`https://www.pear.garden/position/${position.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center text-sm text-pear-lime hover:text-pear-lime-light mb-4 transition-colors font-medium"
      >
        View on Pear Protocol ↗
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
        className="w-full bg-gray-800/50 hover:bg-gray-700 disabled:bg-gray-900/50 border border-gray-700 hover:border-gray-600 text-white font-bold py-3.5 rounded-xl transition-all group-hover:bg-gray-800"
      >
        {closing ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Closing...
          </span>
        ) : (
          'Close Position'
        )}
      </button>
    </div>
  );
}

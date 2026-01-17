'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { closePosition } from '@/integrations/pear/positions';
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

  return (
    <div className="bg-pear-panel-light border border-pear-lime/20 rounded-xl p-6 hover:border-pear-lime/40 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">
            {position.marketId.replace(/-/g, ' ').toUpperCase()}
          </h3>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${
              position.side === 'long'
                ? 'bg-pear-lime/20 text-pear-lime'
                : 'bg-red-500/20 text-red-400'
            }`}>
              {position.side === 'long' ? '↑ BET UP' : '↓ BET DOWN'}
            </span>
            <span className="text-xs text-gray-500 font-mono">
              {position.longAsset}/{position.shortAsset}
            </span>
          </div>
        </div>

        {/* P&L Badge */}
        <div className={`text-right ${isProfitable ? 'text-pear-lime' : 'text-red-400'}`}>
          <div className="text-2xl font-bold">
            {isProfitable ? '+' : ''}{pnl.toFixed(2)}
          </div>
          <div className="text-sm">
            {isProfitable ? '+' : ''}{pnlPercent.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-gray-500 mb-1">Position Size</div>
          <div className="text-sm text-white font-mono">${Number(position.size).toFixed(2)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Entry Price</div>
          <div className="text-sm text-white font-mono">{Number(position.entryPrice).toFixed(4)}</div>
        </div>
      </div>

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
        className="w-full bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 text-white font-bold py-3 rounded-lg transition-all"
      >
        {closing ? 'Closing...' : 'Close Position'}
      </button>
    </div>
  );
}

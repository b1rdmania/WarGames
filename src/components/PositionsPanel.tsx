'use client';

import { useState, useEffect } from 'react';
import { getActivePositions, closePosition } from '@/integrations/pear/positions';
import { getMarketById } from '@/integrations/pear/markets';
import type { PearPosition } from '@/integrations/pear/types';

interface PositionsPanelProps {
  jwtToken: string | null;
}

export function PositionsPanel({ jwtToken }: PositionsPanelProps) {
  const [positions, setPositions] = useState<PearPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [closingId, setClosingId] = useState<string>();

  useEffect(() => {
    if (jwtToken) {
      loadPositions();
    }
  }, [jwtToken]);

  const loadPositions = async () => {
    if (!jwtToken) return;

    setLoading(true);
    try {
      const data = await getActivePositions(jwtToken);
      setPositions(data);
    } catch (error) {
      console.error('Failed to load positions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async (positionId: string) => {
    if (!jwtToken) return;

    setClosingId(positionId);
    try {
      await closePosition(jwtToken, positionId);
      await loadPositions(); // Reload positions
    } catch (error) {
      console.error('Failed to close position:', error);
      alert('Failed to close position: ' + (error as Error).message);
    } finally {
      setClosingId(undefined);
    }
  };

  if (!jwtToken) {
    return (
      <div className="bg-war-panel neon-border p-6 text-center">
        <p className="text-gray-400">Connect wallet and authenticate to view positions</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-war-panel neon-border p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-war-green border-t-transparent"></div>
      </div>
    );
  }

  if (positions.length === 0) {
    return (
      <div className="bg-war-panel neon-border p-6 text-center">
        <p className="text-gray-400">No active positions</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {positions.map((position) => {
        const market = getMarketById(position.marketId);
        const pnl = parseFloat(position.pnl);
        const pnlPercent = parseFloat(position.pnlPercent);
        const isProfitable = pnl >= 0;

        return (
          <div
            key={position.id}
            className="bg-war-panel neon-border p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold neon-text mb-1">
                  {market?.name || 'Unknown Market'}
                </h3>
                <div className={`text-sm font-bold ${
                  position.side === 'long' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {position.side === 'long' ? '↑ BET UP' : '↓ BET DOWN'}
                </div>
              </div>
              <button
                onClick={() => handleClose(position.id)}
                disabled={closingId === position.id}
                className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold px-4 py-2 transition-colors disabled:opacity-50"
              >
                {closingId === position.id ? 'CLOSING...' : 'CLOSE'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">BET SIZE</div>
                <div className="text-white font-bold">${position.size}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">ENTRY PRICE</div>
                <div className="text-white">${position.entryPrice}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">CURRENT PRICE</div>
                <div className="text-white">${position.currentPrice}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">P&L</div>
                <div className={`font-bold ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                  {isProfitable ? '+' : ''}{pnl.toFixed(2)} ({pnlPercent.toFixed(2)}%)
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

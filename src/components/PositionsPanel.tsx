'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getActivePositions, closePosition } from '@/integrations/pear/positions';
import { getMarketById } from '@/integrations/pear/markets';
import type { PearPosition } from '@/integrations/pear/types';

interface PositionsPanelProps {
  accessToken: string | null;
  refreshKey?: number;
}

export function PositionsPanel({ accessToken, refreshKey }: PositionsPanelProps) {
  const [positions, setPositions] = useState<PearPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [closingId, setClosingId] = useState<string>();

  const loadPositions = useCallback(async () => {
    if (!accessToken) return;

    setLoading(true);
    try {
      const data = await getActivePositions(accessToken);
      setPositions(data);
    } catch (error) {
      console.error('Failed to load positions:', error);
      toast.error((error as Error).message || 'Failed to load positions');
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) {
      loadPositions();
    }
  }, [accessToken, loadPositions, refreshKey]);

  // Lightweight "realtime": poll positions so the demo feels alive without WebSocket.
  useEffect(() => {
    if (!accessToken) return;
    const interval = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      loadPositions().catch(() => {});
    }, 15_000);
    return () => window.clearInterval(interval);
  }, [accessToken, loadPositions]);

  const handleClose = async (positionId: string) => {
    if (!accessToken) return;

    setClosingId(positionId);
    try {
      await closePosition(accessToken, positionId);
      await loadPositions(); // Reload positions
      toast.success('Position closed');
    } catch (error) {
      console.error('Failed to close position:', error);
      toast.error('Failed to close position: ' + (error as Error).message);
    } finally {
      setClosingId(undefined);
    }
  };

  if (!accessToken) {
    return (
      <div className="bg-pear-panel pear-border p-6 text-center">
        <p className="text-gray-400">Connect wallet and authenticate to view positions</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-pear-panel pear-border p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-pear-lime border-t-transparent"></div>
      </div>
    );
  }

  if (positions.length === 0) {
    return (
      <div className="bg-pear-panel pear-border p-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-gray-400">No active positions</p>
          <button
            onClick={() => loadPositions()}
            disabled={loading}
            className="pear-border text-pear-lime px-3 py-2 text-xs hover:pear-glow disabled:opacity-50"
          >
            REFRESH
          </button>
        </div>
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
            className="bg-pear-panel border-2 border-pear-lime/30 p-6 hover:border-pear-lime/50 transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold pear-text mb-2">
                  {market?.name || (position.longAsset && position.shortAsset ? `${position.longAsset} vs ${position.shortAsset}` : 'Unknown Market')}
                </h3>
                <div className={`inline-block px-3 py-1 text-sm font-bold ${
                  position.side === 'long' ? 'bg-green-500/20 text-green-400 border border-green-500' : 'bg-red-500/20 text-red-400 border border-red-500'
                }`}>
                  {position.side === 'long' ? '↑ BET UP' : '↓ BET DOWN'}
                </div>
              </div>
              <button
                onClick={() => handleClose(position.id)}
                disabled={closingId === position.id}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 transition-colors disabled:opacity-50 text-sm"
              >
                {closingId === position.id ? 'CLOSING...' : 'CLOSE POSITION'}
              </button>
            </div>

            {/* P&L Banner */}
            <div className={`mb-4 p-4 border-2 ${
              isProfitable ? 'bg-green-500/10 border-green-500' : 'bg-red-500/10 border-red-500'
            }`}>
              <div className="text-xs text-gray-400 mb-1">PROFIT & LOSS</div>
              <div className={`text-3xl font-bold ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                {isProfitable ? '+' : ''}${pnl.toFixed(2)} USDC
                <span className="text-lg ml-2">({isProfitable ? '+' : ''}{pnlPercent.toFixed(2)}%)</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">BET SIZE</div>
                <div className="text-white font-bold text-lg">${position.size}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">ENTRY PRICE</div>
                <div className="text-white text-lg">${position.entryPrice}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">CURRENT PRICE</div>
                <div className="text-white text-lg">${position.currentPrice}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

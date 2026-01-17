'use client';

import type { PearPosition } from '@/integrations/pear/types';

export function PortfolioSummary({
  positions,
  balance,
}: {
  positions: PearPosition[];
  balance: string | null;
}) {
  // Calculate portfolio metrics
  const totalPnl = positions.reduce((sum, pos) => sum + Number(pos.pnl), 0);
  const totalCapital = positions.reduce((sum, pos) => sum + Number(pos.size), 0);
  const avgPnlPercent = positions.length > 0
    ? positions.reduce((sum, pos) => sum + Number(pos.pnlPercent), 0) / positions.length
    : 0;
  const isProfitable = totalPnl >= 0;
  const profitableCount = positions.filter(p => Number(p.pnl) >= 0).length;

  return (
    <div className="border border-pear-lime/20 bg-black/40 p-6 mb-6">
      <div className="text-sm font-mono text-gray-300 mb-4">[ PORTFOLIO ]</div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total P&L */}
        <div className="bg-black/20 p-4 border border-pear-lime/10">
          <div className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
            Total P&L
          </div>
          <div className={`text-xl font-mono ${isProfitable ? 'text-pear-lime' : 'text-red-400'}`}>
            {isProfitable ? '+' : ''}${totalPnl.toFixed(2)}
          </div>
          <div className={`text-xs font-mono mt-1 ${isProfitable ? 'text-pear-lime/80' : 'text-red-400/80'}`}>
            {isProfitable ? '+' : ''}{avgPnlPercent.toFixed(2)}%
          </div>
        </div>

        {/* Open Positions */}
        <div className="bg-black/20 p-4 border border-pear-lime/10">
          <div className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
            Positions
          </div>
          <div className="text-xl font-mono text-white">
            {positions.length}
          </div>
          <div className="text-xs font-mono text-gray-400 mt-1">
            {profitableCount} winning
          </div>
        </div>

        {/* Capital Deployed */}
        <div className="bg-black/20 p-4 border border-pear-lime/10">
          <div className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
            Deployed
          </div>
          <div className="text-xl font-mono text-white">
            ${totalCapital.toFixed(2)}
          </div>
          <div className="text-xs font-mono text-gray-400 mt-1">
            across {positions.length} bets
          </div>
        </div>

        {/* Available Balance */}
        <div className="bg-black/20 p-4 border border-pear-lime/10">
          <div className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
            Available
          </div>
          <div className="text-xl font-mono text-white">
            ${balance ? Number(balance).toFixed(2) : '0.00'}
          </div>
          <div className="text-xs font-mono text-gray-400 mt-1">
            USDC balance
          </div>
        </div>
      </div>
    </div>
  );
}

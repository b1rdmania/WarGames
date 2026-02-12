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
    <div className="tm-box mb-6">
      <div className="text-sm font-semibold mb-4" style={{ color: 'var(--primary)' }}>Portfolio</div>

      {/* Quadrant layout */}
      <div className="border border-border rounded-md overflow-hidden">
        <div className="grid grid-cols-2">
          <div className="p-4 border-b border-r border-border-subtle">
            <div className="tm-k mb-2">Total P&L</div>
            <div className={`tm-v text-lg ${isProfitable ? 'text-status-profit' : 'text-status-loss'}`}>
              {isProfitable ? '+' : ''}${totalPnl.toFixed(2)}
            </div>
            <div className={`text-xs font-mono mt-1 ${isProfitable ? 'text-status-profit/80' : 'text-status-loss/80'}`}>
              {isProfitable ? '+' : ''}{avgPnlPercent.toFixed(2)}%
            </div>
          </div>

          <div className="p-4 border-b border-border-subtle">
            <div className="tm-k mb-2">Positions</div>
            <div className="tm-v text-lg">{positions.length}</div>
            <div className="text-xs font-mono text-text-muted mt-1">{profitableCount} winning</div>
          </div>

          <div className="p-4 border-r border-border-subtle">
            <div className="tm-k mb-2">Deployed</div>
            <div className="tm-v text-lg">${totalCapital.toFixed(2)}</div>
            <div className="text-xs font-mono text-text-muted mt-1">across {positions.length} bets</div>
          </div>

          <div className="p-4">
            <div className="tm-k mb-2">Available</div>
            <div className="tm-v text-lg">${balance ? Number(balance).toFixed(2) : '0.00'}</div>
            <div className="text-xs font-mono text-text-muted mt-1">USDC balance</div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import type { PearPosition } from '@/integrations/pear/types';

export function PortfolioLine({
  positions,
  balance,
  onToggleDetails,
  detailsOpen,
}: {
  positions: PearPosition[];
  balance: string | null;
  onToggleDetails: () => void;
  detailsOpen: boolean;
}) {
  const pnl = positions.reduce((sum, p) => sum + Number(p.pnl), 0);
  const open = positions.length;
  const bal = balance ? Number(balance) : 0;
  const isProfitable = pnl >= 0;

  return (
    <div className="tm-box py-3 px-4 flex items-center justify-between gap-4">
      <div className="font-mono text-sm text-text-secondary">
        BAL <span className="text-text-primary">${bal.toFixed(2)}</span>{' '}
        <span className="text-text-muted">·</span>{' '}
        OPEN <span className="text-text-primary">{open}</span>{' '}
        <span className="text-text-muted">·</span>{' '}
        PNL{' '}
        <span className={isProfitable ? 'text-status-profit' : 'text-status-loss'}>
          {isProfitable ? '+' : ''}${pnl.toFixed(2)}
        </span>
      </div>
      <button className="tm-btn text-text-secondary text-xs" onClick={onToggleDetails}>
        {detailsOpen ? 'Hide' : 'Details'}
      </button>
    </div>
  );
}

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
    <div className="pear-border bg-black/40 p-4 flex items-center justify-between gap-4">
      <div className="font-mono text-sm text-gray-300">
        BAL <span className="text-white">${bal.toFixed(2)}</span>{' '}
        <span className="text-gray-600">•</span>{' '}
        OPEN <span className="text-white">{open}</span>{' '}
        <span className="text-gray-600">•</span>{' '}
        PNL{' '}
        <span className={isProfitable ? 'text-pear-lime' : 'text-red-300'}>
          {isProfitable ? '+' : ''}${pnl.toFixed(2)}
        </span>
      </div>
      <button className="tm-btn text-gray-300" onClick={onToggleDetails}>
        {detailsOpen ? 'HIDE' : 'DETAILS'}
      </button>
    </div>
  );
}


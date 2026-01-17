'use client';

import type { ValidatedMarket } from '@/integrations/pear/marketValidation';

export function MarketFeed({
  markets,
  onPick,
}: {
  markets: ValidatedMarket[];
  onPick: (market: ValidatedMarket, side: 'long' | 'short') => void; // long=YES, short=NO
}) {
  return (
    <div className="pear-border bg-black/40 p-6">
      <div className="text-sm font-mono text-gray-300 mb-4">[ MARKETS ]</div>
      <div className="space-y-3">
        {markets.map((m) => (
          <div key={m.id} className="pear-border bg-black/20 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-white font-mono">{m.name}</div>
                <div className="text-xs text-gray-500 font-mono mt-1">{m.description}</div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="tm-label">{m.category}</span>
                  <span className="tm-label text-pear-lime">{m.leverage}x</span>
                  {m.isRemapped && <span className="tm-label text-yellow-200">DEMO</span>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="tm-btn" onClick={() => onPick(m, 'long')}>
                  YES
                </button>
                <button className="tm-btn tm-btn-danger" onClick={() => onPick(m, 'short')}>
                  NO
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


'use client';

import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useVaultBalances } from '@/hooks/useVaultBalances';

function formatAmount(v: string | null) {
  if (v === null) return '—';
  const n = Number(v);
  if (!Number.isFinite(n)) return v;
  return n.toFixed(2);
}

export function BalancesPanel({ accessToken }: { accessToken: string | null }) {
  const { balances, spotUsdc, perpUsdc, loading, error, refresh } = useVaultBalances(accessToken);

  const totalValue = useMemo(() => (balances?.totalValue ?? null), [balances]);

  if (!accessToken) return null;

  return (
    <div className="bg-pear-panel pear-border p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="text-sm text-pear-lime font-mono mb-1">[ BALANCES ]</div>
          <div className="text-xs text-gray-500">
            These are Pear spot/perp balances (used to gate betting readiness).
          </div>
        </div>
        <button
          onClick={() => {
            refresh().catch((e) => {
              console.error(e);
              toast.error((e as Error).message || 'Failed to refresh balances');
            });
          }}
          disabled={loading}
          className="pear-border text-pear-lime px-3 py-2 text-xs hover:pear-glow disabled:opacity-50"
        >
          {loading ? 'REFRESHING…' : 'REFRESH'}
        </button>
      </div>

      {error && (
        <div className="border border-red-500/50 p-3 text-xs text-red-400 mb-4">
          Failed to load balances: {error.message}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="bg-pear-dark pear-border p-3">
          <div className="text-xs text-gray-500 mb-1">SPOT USDC</div>
          <div className="text-white font-bold">${formatAmount(spotUsdc)}</div>
        </div>
        <div className="bg-pear-dark pear-border p-3">
          <div className="text-xs text-gray-500 mb-1">PERP USDC</div>
          <div className="text-white font-bold">${formatAmount(perpUsdc)}</div>
        </div>
        <div className="bg-pear-dark pear-border p-3">
          <div className="text-xs text-gray-500 mb-1">TOTAL VALUE</div>
          <div className="text-white font-bold">${formatAmount(totalValue)}</div>
        </div>
      </div>
    </div>
  );
}


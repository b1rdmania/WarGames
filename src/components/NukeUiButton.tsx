'use client';

import { useSearchParams } from 'next/navigation';
import { applyUiMode, setStoredUiMode } from '@/lib/uiMode';

export function NukeUiButton() {
  const params = useSearchParams();
  const debug = params.get('debug') === '1';
  if (!debug) return null;

  return (
    <button
      onClick={() => {
        // Force terminal mode everywhere and reload to ensure styles re-resolve cleanly.
        setStoredUiMode('terminal');
        applyUiMode('terminal');
        window.location.reload();
      }}
      className="pear-border text-pear-lime px-3 py-2 text-xs font-mono hover:pear-glow"
      title="Force terminal UI mode"
    >
      NUKE UI
    </button>
  );
}


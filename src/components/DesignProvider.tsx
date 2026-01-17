'use client';

import { useEffect } from 'react';
import { applyUiMode, getStoredUiMode, setStoredUiMode, type UiMode } from '@/lib/uiMode';

export function DesignProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const stored = getStoredUiMode();
    const mode: UiMode = stored ?? 'terminal';
    if (!stored) setStoredUiMode(mode);
    applyUiMode(mode);
  }, []);

  return children;
}


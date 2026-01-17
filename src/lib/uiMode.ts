export type UiMode = 'pear' | 'terminal';

const KEY = 'wm_ui_mode';

export function getStoredUiMode(): UiMode | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(KEY);
  if (raw === 'pear' || raw === 'terminal') return raw;
  return null;
}

export function setStoredUiMode(mode: UiMode) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, mode);
}

export function applyUiMode(mode: UiMode) {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.ui = mode;
}


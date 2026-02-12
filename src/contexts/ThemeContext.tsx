'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type Theme = 'terminal' | 'geocities';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  isGeoCities: boolean;
}

const ThemeContext = createContext<ThemeState | undefined>(undefined);

const STORAGE_KEY = 'wm_theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('terminal');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'geocities') setTheme('geocities');
    } catch {
      /* ignore */
    }
  }, []);

  // Sync data-theme attribute to <html> and persist
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'terminal' ? 'geocities' : 'terminal'));
  }, []);

  const value = useMemo<ThemeState>(
    () => ({ theme, toggleTheme, isGeoCities: theme === 'geocities' }),
    [theme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

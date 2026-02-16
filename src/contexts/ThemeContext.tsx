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
import { type ThemeId, DEFAULT_THEME, isValidThemeId } from '@/themes';

interface ThemeState {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  toggleTheme: () => void;
  isGeoCities: boolean;
  isTerminal: boolean;
  isNorad: boolean;
  isControlRoom: boolean;
}

const ThemeContext = createContext<ThemeState | undefined>(undefined);

const STORAGE_KEY = 'wm_theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    if (typeof window === 'undefined') return DEFAULT_THEME;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored && isValidThemeId(stored) ? stored : DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  });

  // Sync data-theme attribute to <html> and persist
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const setTheme = useCallback((newTheme: ThemeId) => {
    if (isValidThemeId(newTheme)) {
      setThemeState(newTheme);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      // Cycle through: terminal -> geocities -> norad -> control-room -> terminal
      if (prev === 'terminal') return 'geocities';
      if (prev === 'geocities') return 'norad';
      if (prev === 'norad') return 'control-room';
      return 'terminal';
    });
  }, []);

  const value = useMemo<ThemeState>(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      isGeoCities: theme === 'geocities',
      isTerminal: theme === 'terminal',
      isNorad: theme === 'norad',
      isControlRoom: theme === 'control-room',
    }),
    [theme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

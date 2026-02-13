/**
 * Canonical Theme Registry for WAR.MARKET
 *
 * This is the single source of truth for active themes.
 * All theme selection, routing, and UI must derive from this registry.
 *
 * Active themes: terminal, geocities, norad, control-room
 */

export type ThemeId = 'terminal' | 'geocities' | 'norad' | 'control-room';

export interface ThemeMeta {
  id: ThemeId;
  label: string;
  description: string;
  route: `/labs/${string}`;
  status: 'active';
}

export const THEMES: Record<ThemeId, ThemeMeta> = {
  terminal: {
    id: 'terminal',
    label: 'Terminal',
    description: 'Command-line aesthetic with function-key bars and keyboard-first navigation.',
    route: '/labs/terminal',
    status: 'active',
  },
  geocities: {
    id: 'geocities',
    label: 'GeoCities',
    description: 'Pure 1998 nostalgia with fire borders, Comic Sans, animated GIFs, and marquees.',
    route: '/labs/geocities',
    status: 'active',
  },
  norad: {
    id: 'norad',
    label: 'NORAD',
    description: 'Mission control aesthetic with situation board, event log, and explicit risk states.',
    route: '/labs/norad',
    status: 'active',
  },
  'control-room': {
    id: 'control-room',
    label: 'Control Room',
    description: 'NORAD mission control structure with classic Terminal green aesthetic.',
    route: '/labs/control-room',
    status: 'active',
  },
} as const;

export const DEFAULT_THEME: ThemeId = 'terminal';

export const ACTIVE_THEMES = Object.values(THEMES);

/**
 * Validate a theme ID against the registry
 */
export function isValidThemeId(id: string): id is ThemeId {
  return id in THEMES;
}

/**
 * Get theme metadata, with fallback to default
 */
export function getTheme(id: string): ThemeMeta {
  return isValidThemeId(id) ? THEMES[id] : THEMES[DEFAULT_THEME];
}

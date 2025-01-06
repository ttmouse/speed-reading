export const THEME_MODES = {
  LIGHT: 'LIGHT',
  DARK: 'DARK'
} as const;

export const THEME_COLORS = {
  light: {
    background: '#ffffff',
    text: '#1a202c',
    dimmed: '#94a3b8',
  },
  dark: {
    background: '#1a202c',
    text: '#f8fafc',
    dimmed: '#475569',
  }
} as const;

export type ThemeMode = keyof typeof THEME_MODES; 
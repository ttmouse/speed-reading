'use client';

import React from 'react';
import { THEME_MODES, ThemeMode } from '@/app/constants/themes';

interface ThemeSettingsProps {
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

export const ThemeSettings: React.FC<ThemeSettingsProps> = ({
  currentTheme,
  onThemeChange,
}) => {
  return (
    <div className="flex items-center justify-between p-2">
      <span className="text-sm">主题模式</span>
      <select
        value={currentTheme}
        onChange={(e) => onThemeChange(e.target.value as ThemeMode)}
        className="ml-2 p-1 rounded border text-sm"
      >
        <option value={THEME_MODES.LIGHT}>浅色</option>
        <option value={THEME_MODES.DARK}>深色</option>
      </select>
    </div>
  );
}; 
'use client';

import React from 'react';
import { ReadingSettings, DisplayMode } from '@/app/types';
import { ReadingModeControl } from './ReadingModeControl';
import { ThemeToggle } from '../ThemeToggle';

interface ControlsProps {
  settings: ReadingSettings;
  onSettingChange: (updates: Partial<ReadingSettings>) => void;
  enabled?: boolean;
}

// 统一的图标样式
const getIconClass = (isActive: boolean) => 
  `w-5 h-5 ${isActive ? 'stroke-white' : 'stroke-gray-700 dark:stroke-gray-300'}`;

export function Controls({ settings, onSettingChange }: ControlsProps) {
  const handleModeChange = (mode: DisplayMode) => {
    onSettingChange({ displayMode: mode });
  };

  return (
    <div className="flex gap-4 items-center justify-center mb-4">
      {/* 主题切换 */}
      <div className="flex flex-col items-center">
        <ThemeToggle
          currentTheme={settings.theme}
          onThemeChange={theme => onSettingChange({ theme })}
        />
        <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">
          {settings.theme === 'DARK' ? '深色模式' : '浅色模式'}
        </span>
      </div>

      {/* 阅读模式控制 */}
      <ReadingModeControl
        currentMode={settings.displayMode || 'serial'}
        onChange={handleModeChange}
        enabled={true}
      />
    </div>
  );
} 
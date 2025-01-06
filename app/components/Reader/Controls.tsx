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

      {/* 进度显示切换 */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => onSettingChange({ showProgress: !settings.showProgress })}
          className={`p-2 rounded-lg transition-all transform active:scale-95 ${
            settings.showProgress ? 'bg-gray-900 text-white' : 'bg-gray-200 dark:bg-gray-700'
          }`}
          title={settings.showProgress ? '隐藏进度' : '显示进度'}
        >
          <svg className={getIconClass(settings.showProgress)} fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">
          {settings.showProgress ? '隐藏进度' : '显示进度'}
        </span>
      </div>
    </div>
  );
} 
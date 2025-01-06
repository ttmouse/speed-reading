import React from 'react';
import { ReadingMode, ReadingSettings, HighlightStyle } from '../../types';
import { ThemeToggle } from '../ThemeToggle';

interface ControlsProps {
  settings: ReadingSettings;
  onSettingChange: (updates: Partial<ReadingSettings>) => void;
}

// 统一的图标样式
const getIconClass = (isActive: boolean) => `w-5 h-5 ${isActive ? 'stroke-white' : 'stroke-gray-700 dark:stroke-gray-300'}`;

export function Controls({ settings, onSettingChange }: ControlsProps) {
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

      {/* 阅读模式切换 */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => onSettingChange({ readingMode: settings.readingMode === 'serial' ? 'highlight' : 'serial' })}
          className={`p-2 rounded-lg transition-all transform active:scale-95 ${
            settings.readingMode === 'serial' ? 'bg-gray-900 text-white' : 'bg-gray-200 dark:bg-gray-700'
          }`}
          title={settings.readingMode === 'serial' ? '串行模式' : '高亮模式'}
        >
          {settings.readingMode === 'serial' ? (
            <svg className={getIconClass(settings.readingMode === 'serial')} fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6h12M6 12h12M6 18h12" />
            </svg>
          ) : (
            <svg className={getIconClass(settings.readingMode === 'serial')} fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
        <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">
          {settings.readingMode === 'serial' ? '串行模式' : '高亮模式'}
        </span>
      </div>

      {/* 高亮模式下的显示方式切换 */}
      {settings.readingMode === 'highlight' && (
        <div className="flex flex-col items-center">
          <button
            onClick={() => onSettingChange({ highlightStyle: settings.highlightStyle === 'scroll' ? 'page' : 'scroll' })}
            className={`p-2 rounded-lg transition-all transform active:scale-95 ${
              settings.highlightStyle === 'page' ? 'bg-gray-900 text-white' : 'bg-gray-200 dark:bg-gray-700'
            }`}
            title={settings.highlightStyle === 'scroll' ? '滚动式' : '分页式'}
          >
            {settings.highlightStyle === 'scroll' ? (
              <svg className={getIconClass(settings.highlightStyle === 'page')} fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5h8a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V7a2 2 0 012-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9h8M8 13h6M8 17h4" />
              </svg>
            ) : (
              <svg className={getIconClass(settings.highlightStyle === 'page')} fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M5 14h9M5 10h7M5 18h11" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 9l3 3m0 0l3-3m-3 3V4" />
              </svg>
            )}
          </button>
          <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">
            {settings.highlightStyle === 'scroll' ? '滚动式' : '分页式'}
          </span>
        </div>
      )}

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
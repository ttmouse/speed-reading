import React from 'react';
import { ReadingMode, ReadingSettings, HighlightStyle } from '@/app/types';

interface ControlsProps {
  settings: ReadingSettings;
  onSettingChange: (key: keyof ReadingSettings, value: any) => void;
}

export function Controls({ settings, onSettingChange }: ControlsProps) {
  return (
    <div className="flex gap-4 items-center justify-center mb-4">
      {/* 阅读模式切换 */}
      <button
        onClick={() => onSettingChange('readingMode', settings.readingMode === 'serial' ? 'highlight' : 'serial')}
        className={`p-2 rounded-lg transition-colors ${
          settings.readingMode === 'serial' ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
        title={settings.readingMode === 'serial' ? '串行模式' : '高亮模式'}
      >
        {settings.readingMode === 'serial' ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm12 0H5v10h10V5z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* 高亮模式下的显示方式切换 */}
      {settings.readingMode === 'highlight' && (
        <button
          onClick={() => onSettingChange('highlightStyle', settings.highlightStyle === 'scroll' ? 'page' : 'scroll')}
          className={`p-2 rounded-lg transition-colors ${
            settings.highlightStyle === 'page' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          title={settings.highlightStyle === 'scroll' ? '滚动式' : '分页式'}
        >
          {settings.highlightStyle === 'scroll' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 3a1 1 0 000 2h14a1 1 0 100-2H3zM3 7a1 1 0 000 2h14a1 1 0 100-2H3zM3 11a1 1 0 100 2h14a1 1 0 100-2H3zM3 15a1 1 0 100 2h14a1 1 0 100-2H3z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      )}

      {/* 焦点位置切换 */}
      <button
        onClick={() => {
          const focusPoints: Array<'left' | 'center' | 'right'> = ['left', 'center', 'right'];
          const currentIndex = focusPoints.indexOf(settings.focusPoint);
          const nextIndex = (currentIndex + 1) % focusPoints.length;
          onSettingChange('focusPoint', focusPoints[nextIndex]);
        }}
        className={`p-2 rounded-lg transition-colors bg-gray-200 hover:bg-gray-300`}
        title={`焦点位置: ${settings.focusPoint === 'left' ? '左' : settings.focusPoint === 'center' ? '中' : '右'}`}
      >
        {settings.focusPoint === 'left' ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        ) : settings.focusPoint === 'center' ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* 进度显示切换 */}
      <button
        onClick={() => onSettingChange('showProgress', !settings.showProgress)}
        className={`p-2 rounded-lg transition-colors ${
          settings.showProgress ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
        title={settings.showProgress ? '隐藏进度' : '显示进度'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
        </svg>
      </button>
    </div>
  );
} 
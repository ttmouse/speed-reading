import React from 'react';
import { ReadingMode, ReadingSettings, HighlightStyle } from '../../types';

interface ControlsProps {
  settings: ReadingSettings;
  onSettingChange: (key: keyof ReadingSettings, value: any) => void;
}

export function Controls({ settings, onSettingChange }: ControlsProps) {
  return (
    <div className="flex gap-4 items-center justify-center mb-4">
      {/* 阅读模式切换 */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => onSettingChange('readingMode', settings.readingMode === 'serial' ? 'highlight' : 'serial')}
          className={`p-2 rounded-lg transition-colors ${
            settings.readingMode === 'serial' ? 'bg-gray-900 text-white' : 'bg-gray-200'
          }`}
          title={settings.readingMode === 'serial' ? '串行模式' : '高亮模式'}
        >
          {settings.readingMode === 'serial' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
          )}
        </button>
        <span className="text-xs mt-1 text-gray-500">
          {settings.readingMode === 'serial' ? '串行模式' : '高亮模式'}
        </span>
      </div>

      {/* 高亮模式下的显示方式切换 */}
      {settings.readingMode === 'highlight' && (
        <div className="flex flex-col items-center">
          <button
            onClick={() => onSettingChange('highlightStyle', settings.highlightStyle === 'scroll' ? 'page' : 'scroll')}
            className={`p-2 rounded-lg transition-colors ${
              settings.highlightStyle === 'page' ? 'bg-gray-900 text-white' : 'bg-gray-200'
            }`}
            title={settings.highlightStyle === 'scroll' ? '滚动式' : '分页式'}
          >
            {settings.highlightStyle === 'scroll' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 100 2h4a1 1 0 100-2H8zm5-4a1 1 0 100 2H8a1 1 0 100-2h5z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          <span className="text-xs mt-1 text-gray-500">
            {settings.highlightStyle === 'scroll' ? '滚动式' : '分页式'}
          </span>
        </div>
      )}

      {/* 进度显示切换 */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => onSettingChange('showProgress', !settings.showProgress)}
          className={`p-2 rounded-lg transition-colors ${
            settings.showProgress ? 'bg-gray-900 text-white' : 'bg-gray-200'
          }`}
          title={settings.showProgress ? '隐藏进度' : '显示进度'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
          </svg>
        </button>
        <span className="text-xs mt-1 text-gray-500">
          {settings.showProgress ? '隐藏进度' : '显示进度'}
        </span>
      </div>
    </div>
  );
} 
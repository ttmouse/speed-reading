'use client';

import React from 'react';
import { DisplayMode } from '@/app/types';

interface ReadingModeControlProps {
  currentMode: DisplayMode;
  onChange: (mode: DisplayMode) => void;
  enabled?: boolean;  // 是否启用新模式
}

// 统一的图标样式
const getIconClass = (isActive: boolean) => 
  `w-5 h-5 ${isActive ? 'stroke-white' : 'stroke-gray-700 dark:stroke-gray-300'}`;

export function ReadingModeControl({ 
  currentMode, 
  onChange,
  enabled = false  // 默认不启用
}: ReadingModeControlProps) {
  if (!enabled) return null;

  return (
    <div className="flex gap-4 items-center">
      {/* 串行模式 */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => onChange('serial')}
          className={`p-2 rounded-lg transition-all transform active:scale-95 ${
            currentMode === 'serial' ? 'bg-gray-900 text-white' : 'bg-gray-200 dark:bg-gray-700'
          }`}
          title="串行模式"
        >
          <svg className={getIconClass(currentMode === 'serial')} fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6h12M6 12h12M6 18h12" />
          </svg>
        </button>
        <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">串行模式</span>
      </div>

      {/* 滚动模式 */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => onChange('scroll')}
          className={`p-2 rounded-lg transition-all transform active:scale-95 ${
            currentMode === 'scroll' ? 'bg-gray-900 text-white' : 'bg-gray-200 dark:bg-gray-700'
          }`}
          title="滚动模式"
        >
          <svg className={getIconClass(currentMode === 'scroll')} fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
          </svg>
        </button>
        <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">滚动模式</span>
      </div>

      {/* 分页模式 */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => onChange('page')}
          className={`p-2 rounded-lg transition-all transform active:scale-95 ${
            currentMode === 'page' ? 'bg-gray-900 text-white' : 'bg-gray-200 dark:bg-gray-700'
          }`}
          title="分页模式"
        >
          <svg className={getIconClass(currentMode === 'page')} fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M5 14h9M5 10h7M5 18h11" />
          </svg>
        </button>
        <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">分页模式</span>
      </div>
    </div>
  );
} 
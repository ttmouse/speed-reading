import React from 'react';
import type { ReadingSettings, ReadingMode, HighlightStyle } from '@/app/types';

interface SettingsPanelProps {
  settings: ReadingSettings;
  onSettingChange: (key: keyof ReadingSettings, value: any) => void;
  onClose: () => void;
  visible: boolean;
}

export function SettingsPanel({ settings, onSettingChange, onClose, visible }: SettingsPanelProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg w-[500px] max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">设置</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 阅读模式 */}
          <div>
            <h3 className="text-lg font-medium mb-2">阅读模式</h3>
            <select
              value={settings.readingMode}
              onChange={(e) => onSettingChange('readingMode', e.target.value as ReadingMode)}
              className="w-full p-2 border rounded"
            >
              <option value="serial">串行模式</option>
              <option value="highlight">高亮模式</option>
            </select>
          </div>

          {/* 高亮模式设置 */}
          {settings.readingMode === 'highlight' && (
            <>
              <div>
                <label className="block text-sm mb-1">显示方式</label>
                <select
                  value={settings.highlightStyle}
                  onChange={(e) => onSettingChange('highlightStyle', e.target.value as HighlightStyle)}
                  className="w-full p-2 border rounded mb-4"
                >
                  <option value="scroll">滚动式</option>
                  <option value="page">分页式</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">
                  {settings.highlightStyle === 'scroll' ? '上下文行数' : '每页行数'} 
                  ({settings.highlightStyle === 'scroll' ? settings.contextLines : settings.pageSize})
                </label>
                <input
                  type="range"
                  value={settings.highlightStyle === 'scroll' ? settings.contextLines : settings.pageSize}
                  onChange={(e) => onSettingChange(
                    settings.highlightStyle === 'scroll' ? 'contextLines' : 'pageSize',
                    parseInt(e.target.value)
                  )}
                  min={settings.highlightStyle === 'scroll' ? 1 : 3}
                  max={settings.highlightStyle === 'scroll' ? 5 : 10}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">背景文本颜色</label>
                <input
                  type="color"
                  value={settings.dimmedTextColor}
                  onChange={(e) => onSettingChange('dimmedTextColor', e.target.value)}
                  className="w-full h-8"
                />
              </div>
            </>
          )}

          {/* 视觉辅助 */}
          <div>
            <h3 className="text-lg font-medium mb-2">视觉辅助</h3>
            <div className="space-y-2">
              <select 
                value={settings.focusPoint}
                onChange={(e) => onSettingChange('focusPoint', e.target.value)}
                className="w-full p-2 border rounded mb-2"
              >
                <option value="left">左侧注视点</option>
                <option value="center">中心注视点</option>
                <option value="right">右侧注视点</option>
              </select>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.highlightFocus}
                  onChange={(e) => onSettingChange('highlightFocus', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">高亮焦点词</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.showProgress}
                  onChange={(e) => onSettingChange('showProgress', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">显示进度条</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
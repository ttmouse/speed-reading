'use client';

import React from 'react';
import { DisplayMode } from '@/app/types';
import { RangeSlider } from '@/app/components/common/RangeSlider';

interface ReadingModeSettingsProps {
  mode: DisplayMode;
  contextLines: number;
  pageSize: number;
  onSettingChange: (key: string, value: number | string) => void;
  enabled?: boolean;
}

export function ReadingModeSettings({
  mode,
  contextLines,
  pageSize,
  onSettingChange,
  enabled = false
}: ReadingModeSettingsProps) {
  if (!enabled) return null;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">阅读模式</label>
        <select
          value={mode}
          onChange={e => onSettingChange('displayMode', e.target.value as DisplayMode)}
          className="w-full p-2 border rounded"
        >
          <option value="serial">串行模式</option>
          <option value="scroll">滚动模式</option>
          <option value="page">分页模式</option>
        </select>
      </div>

      {mode !== 'serial' && (
        <div>
          <label className="block text-sm font-medium mb-1">
            {mode === 'scroll' ? '上下文行数' : '每页行数'} 
            ({mode === 'scroll' ? contextLines : pageSize})
          </label>
          <RangeSlider
            min={mode === 'scroll' ? 0 : 3}
            max={mode === 'scroll' ? 5 : 10}
            value={mode === 'scroll' ? contextLines : pageSize}
            onChange={value => onSettingChange(
              mode === 'scroll' ? 'contextLines' : 'pageSize',
              value
            )}
          />
        </div>
      )}
    </div>
  );
} 
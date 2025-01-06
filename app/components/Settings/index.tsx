'use client';

import React from 'react';
import { ReadingSettings } from '@/app/types';
import { ReadingModeSettings } from './ReadingModeSettings';

interface SettingsPanelProps {
  settings: ReadingSettings;
  onUpdate: (updates: Partial<ReadingSettings>) => void;
}

export default function SettingsPanel({ settings, onUpdate }: SettingsPanelProps) {
  const handleSettingChange = (key: string, value: number | string) => {
    onUpdate({ [key]: value });
  };

  return (
    <div className="fixed top-0 right-0 w-[320px] h-full bg-white dark:bg-gray-800 border-l p-4 overflow-y-auto">
      <div className="space-y-6">
        <div className="text-xl font-bold mb-4">设置</div>

        {/* 新的阅读模式设置（默认不启用） */}
        <ReadingModeSettings
          mode={settings.displayMode || 'serial'}
          contextLines={settings.contextLines}
          pageSize={settings.pageSize}
          onSettingChange={handleSettingChange}
          enabled={false}
        />

        {/* 保持现有的设置项 */}
        {/* ... 其他设置项 ... */}
      </div>
    </div>
  );
} 
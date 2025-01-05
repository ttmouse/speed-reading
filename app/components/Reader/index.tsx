'use client'

import React from 'react';
import { useReader } from '@/app/hooks/useReader';
import { SettingsPanel } from '../SettingsPanel';
import { Display } from './Display';
import { Controls } from './Controls';
import { SpeedControls } from './SpeedControls';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import { StatsDisplay } from './StatsDisplay';

export default function Reader(): JSX.Element {
  const {
    text,
    speed,
    chunkSize,
    display,
    isPlaying,
    stats,
    settings,
    state,
    handleTextChange,
    handleSpeedChange,
    handleChunkSizeChange,
    updateSettings,
    handleKeyDown
  } = useReader();

  // 移除设置面板的显示状态管理，因为现在是固定显示的
  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // 包装 updateSettings 函数以适配不同的接口
  const handleSettingChange = React.useCallback(
    (key: keyof typeof settings, value: any) => {
      updateSettings({ [key]: value });
    },
    [updateSettings]
  );

  return (
    <div className="flex">
      {/* 主内容区域 */}
      <div className="flex-1 p-4 pr-[340px]"> {/* 320px侧边栏 + 20px间距 */}
        <div className="max-w-4xl mx-auto">
          <Controls settings={settings} onSettingChange={handleSettingChange} />
          
          <SpeedControls
            speed={speed}
            chunkSize={chunkSize}
            onSpeedChange={handleSpeedChange}
            onChunkSizeChange={handleChunkSizeChange}
          />

          <Display settings={settings} state={state} display={display} />

          <div className="mt-8">
            <textarea
              id="text-input"
              value={text}
              onChange={(e): void => handleTextChange(e.target.value)}
              placeholder="在此粘贴要阅读的文本..."
              className="w-full h-32 p-4 border rounded"
            />
          </div>

          <StatsDisplay
            wordsRead={stats.wordsRead}
            currentWpm={stats.currentWpm}
            timeRemaining={stats.timeRemaining}
          />

          <KeyboardShortcuts />
        </div>
      </div>

      {/* 设置面板 */}
      <SettingsPanel
        settings={settings}
        onUpdate={updateSettings}
      />
    </div>
  );
} 
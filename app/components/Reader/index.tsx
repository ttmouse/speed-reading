'use client'

import React from 'react';
import dynamic from 'next/dynamic';
import { useReader } from '@/app/hooks/useReader';
import { Controls } from './Controls';
import { SpeedControls } from './SpeedControls';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import { StatsDisplay } from './StatsDisplay';
import { Display } from './Display/index';
import { ProgressBar } from './ProgressBar';

// 动态导入SettingsPanel，禁用SSR
const SettingsPanel = dynamic(() => import('../SettingsPanel'), {
  ssr: false
});

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

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleSettingChange = React.useCallback(
    (key: keyof typeof settings, value: any) => {
      updateSettings({ [key]: value });
    },
    [updateSettings]
  );

  return (
    <div className="flex">
      {/* 主内容区域 */}
      <div className="flex-1 p-4 pr-[340px]">
        <div className="w-full">
          <Controls settings={settings} onSettingChange={handleSettingChange} />
          
          <SpeedControls
            speed={speed}
            chunkSize={chunkSize}
            onSpeedChange={handleSpeedChange}
            onChunkSizeChange={handleChunkSizeChange}
          />

          <Display settings={settings} state={state} display={display} />

          <ProgressBar 
            progress={state.progress} 
            onProgressChange={state.setProgress}
            isPaused={!isPlaying}
          />

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
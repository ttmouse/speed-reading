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
            progress={state.currentPosition / Math.max(1, state.chunks.length - 1)}
            onProgressChange={(progress) => state.setCurrentPosition(Math.floor(progress * state.chunks.length))}
            isPaused={!isPlaying}
          />

          <div className="mt-8 space-y-4">
            <textarea
              id="text-input"
              value={text}
              onChange={(e): void => handleTextChange(e.target.value)}
              placeholder="在此粘贴要阅读的文本..."
              className="w-full h-32 p-4 border rounded"
            />

            {/* 分词预览 */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="text-sm font-medium mb-2 text-gray-600">
                分词预览（共 {state.chunks.length} 组）：
              </div>
              <div className="flex flex-wrap gap-2">
                {state.chunks.map((chunk, index) => (
                  <div 
                    key={index}
                    className={`px-2 py-1 rounded text-sm border ${
                      index === state.currentPosition 
                        ? 'bg-gray-900 text-white border-gray-900' 
                        : 'bg-white hover:bg-gray-50'
                    }`}
                    title={`第 ${index + 1} 组`}
                  >
                    {chunk}
                  </div>
                ))}
              </div>
            </div>

            {/* 调试信息 */}
            <div className="text-sm text-gray-500">
              <div>当前位置: {state.currentPosition}</div>
              <div>分词设置: {settings.chunkSize} 字/组, {settings.sentenceBreak ? '启用' : '禁用'}句末分割</div>
            </div>
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
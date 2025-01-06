'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useReader } from '@/app/hooks/useReader';
import { Controls } from './Controls';
import { Display } from './Display/index';
import { ProgressBar } from './ProgressBar';
import { StatsDisplay } from './StatsDisplay';
import { KeyboardShortcuts } from './KeyboardShortcuts';

// 动态导入SettingsPanel，禁用SSR
const SettingsPanel = dynamic(() => import('../SettingsPanel'), {
  ssr: false
});

export default function Reader(): JSX.Element {
  const [mounted, setMounted] = useState(false);
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
    handleKeyDown,
    setCurrentPosition
  } = useReader();

  // 确保组件只在客户端渲染
  useEffect(() => {
    setMounted(true);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // 如果还没有挂载，返回一个基础布局
  if (!mounted) {
    return (
      <div className="flex">
        <div className="flex-1 p-4 pr-[340px]">
          <div className="w-full">
            <div className="text-xl font-bold mb-4">快速阅读</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* 主内容区域 */}
      <div className="flex-1 p-4 pr-[340px]">
        <div className="w-full">
          <Controls settings={settings} onSettingChange={updateSettings} />
          
          <Display settings={settings} state={state} display={display} />

          {settings.showProgress && (
            <ProgressBar 
              progress={state.currentPosition / Math.max(1, state.chunks.length - 1)}
              onProgressChange={(progress) => setCurrentPosition(Math.floor(progress * state.chunks.length))}
              isPaused={!isPlaying}
            />
          )}

          <div className="mt-8 space-y-4">
            <textarea
              id="text-input"
              value={text}
              onChange={(e): void => handleTextChange(e.target.value)}
              placeholder="在此粘贴要阅读的文本..."
              className="w-full h-32 p-4 border rounded"
            />

            {/* 分词预览 */}
            {settings.showChunkPreview && (
              <div className="mt-4">
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
              </div>
            )}

            <KeyboardShortcuts />
          </div>

          <StatsDisplay
            wordsRead={stats.wordsRead}
            currentWpm={stats.currentWpm}
            timeRemaining={stats.timeRemaining}
            showProgress={settings.showProgress}
          />
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
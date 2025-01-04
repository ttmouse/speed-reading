'use client'

import * as React from 'react';
import { useReader } from '@/app/hooks/useReader';
import { SettingsPanel } from '@/app/components/SettingsPanel';
import { ReadingSettings } from '@/app/types';

export default function Reader(): JSX.Element {
  const {
    text,
    speed,
    chunkSize,
    display,
    isPlaying,
    stats,
    settings,
    handleTextChange,
    handleSpeedChange,
    handleChunkSizeChange,
    updateSettings,
    handleKeyDown
  } = useReader({ onSettingsClick: () => setShowSettings(true) });

  const [showSettings, setShowSettings] = React.useState(false);

  // 添加 ESC 键监听
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showSettings) {
        setShowSettings(false);
      }
    };

    document.addEventListener('keydown', handleEsc);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, showSettings]);

  return (
    <div className="reader-container max-w-4xl mx-auto">
      <div className="controls mb-8">
        <div className="flex gap-4 justify-center">
          <div className="setting-item">
            <label htmlFor="speed">速度 (字/分钟):</label>
            <input
              id="speed"
              type="number"
              value={speed}
              onChange={(e): void => handleSpeedChange(Number(e.target.value))}
              min={60}
              max={1000}
              step={30}
              className="px-2 py-1 border rounded w-24"
            />
          </div>
          <div className="setting-item">
            <label htmlFor="chunkSize">每次显示字数:</label>
            <input
              id="chunkSize"
              type="number"
              value={chunkSize}
              onChange={(e): void => handleChunkSizeChange(Number(e.target.value))}
              min={1}
              max={20}
              className="px-2 py-1 border rounded w-20"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div 
          className="text-display w-full h-32 flex items-center justify-center border rounded-lg mb-8"
          style={{
            fontSize: `${settings.fontSize}px`,
            color: settings.fontColor,
            backgroundColor: settings.bgColor,
            textAlign: settings.textAlign as 'left' | 'center' | 'right'
          }}
        >
          {display}
        </div>
      </div>

      <div className="mt-8">
        <textarea
          id="text-input"
          value={text}
          onChange={(e): void => handleTextChange(e.target.value)}
          placeholder="在此粘贴要阅读的文本..."
          className="w-full h-32 p-4 border rounded"
        />
      </div>

      <div className="stats mt-4 flex justify-center gap-8 text-sm text-gray-600">
        <span>已读: {stats.wordsRead} 字</span>
        <span>当前速度: {stats.currentWpm} 字/分钟</span>
        <span>预计剩余时间: {stats.timeRemaining}</span>
      </div>

      <div className="keyboard-shortcuts mt-8 p-4 bg-gray-50 rounded text-sm text-center">
        快捷键：
        <kbd className="mx-1 px-2 py-1 bg-white border rounded shadow-sm">N</kbd> 新文本
        <kbd className="mx-1 px-2 py-1 bg-white border rounded shadow-sm">空格</kbd> 播放/暂停
        <kbd className="mx-1 px-2 py-1 bg-white border rounded shadow-sm">R</kbd> 重新开始
        <kbd className="mx-1 px-2 py-1 bg-white border rounded shadow-sm">↑</kbd> 加速
        <kbd className="mx-1 px-2 py-1 bg-white border rounded shadow-sm">↓</kbd> 减速
        <kbd className="mx-1 px-2 py-1 bg-white border rounded shadow-sm">←</kbd> 减少字数
        <kbd className="mx-1 px-2 py-1 bg-white border rounded shadow-sm">→</kbd> 增加字数
        <kbd className="mx-1 px-2 py-1 bg-white border rounded shadow-sm">S</kbd> 设置
      </div>

      {showSettings && (
        <SettingsPanel
          settings={settings}
          onUpdate={updateSettings}
          onClose={() => setShowSettings(false)}
          visible={showSettings}
        />
      )}
    </div>
  );
} 
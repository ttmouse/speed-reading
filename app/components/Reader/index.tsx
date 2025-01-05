'use client'

import React from 'react';
import { useReader } from '@/app/hooks/useReader';
import { SettingsPanel } from '../SettingsPanel';
import { Display } from './Display';
import { Controls } from './Controls';

// 速度和字数控制组件
function SpeedControls({ speed, chunkSize, onSpeedChange, onChunkSizeChange }: {
  speed: number;
  chunkSize: number;
  onSpeedChange: (speed: number) => void;
  onChunkSizeChange: (size: number) => void;
}) {
  return (
    <div className="flex gap-4 justify-center mb-4">
      <div className="setting-item">
        <label htmlFor="speed">速度 (字/分钟):</label>
        <input
          id="speed"
          type="number"
          value={speed}
          onChange={(e): void => onSpeedChange(Number(e.target.value))}
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
          onChange={(e): void => onChunkSizeChange(Number(e.target.value))}
          min={1}
          max={20}
          className="px-2 py-1 border rounded w-20"
        />
      </div>
    </div>
  );
}

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

  // 包装 updateSettings 函数以适配不同的接口
  const handleSettingChange = React.useCallback(
    (key: keyof typeof settings, value: any) => {
      updateSettings({ [key]: value });
    },
    [updateSettings]
  );

  return (
    <div className="reader-container max-w-4xl mx-auto">
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
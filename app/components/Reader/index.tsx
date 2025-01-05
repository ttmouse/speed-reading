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

      <StatsDisplay
        wordsRead={stats.wordsRead}
        currentWpm={stats.currentWpm}
        timeRemaining={stats.timeRemaining}
      />

      <KeyboardShortcuts />

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
显示的函数不对，还是只有一行系统的分析一下可能的源在哪里？'use client'

import React from 'react';

interface SpeedControlsProps {
  speed: number;
  chunkSize: number;
  onSpeedChange: (speed: number) => void;
  onChunkSizeChange: (size: number) => void;
}

export function SpeedControls({
  speed,
  chunkSize,
  onSpeedChange,
  onChunkSizeChange
}: SpeedControlsProps): JSX.Element {
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
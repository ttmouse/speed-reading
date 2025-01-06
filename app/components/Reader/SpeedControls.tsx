'use client'

import React from 'react';
import { RangeSlider } from '../common/RangeSlider';

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
      <div className="setting-item flex-1">
        <label className="block text-sm font-medium mb-1">
          速度 ({speed} 字/分钟)
        </label>
        <RangeSlider
          min={60}
          max={1000}
          step={30}
          value={speed}
          onChange={onSpeedChange}
        />
      </div>
      <div className="setting-item flex-1">
        <label className="block text-sm font-medium mb-1">
          每次显示字数 ({chunkSize})
        </label>
        <RangeSlider
          min={1}
          max={20}
          value={chunkSize}
          onChange={onChunkSizeChange}
        />
      </div>
    </div>
  );
}
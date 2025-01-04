import React from 'react';

interface ControlsProps {
  speed: number;
  chunkSize: number;
  onSpeedChange: (speed: number) => void;
  onChunkSizeChange: (size: number) => void;
}

export function Controls({
  speed,
  chunkSize,
  onSpeedChange,
  onChunkSizeChange
}: ControlsProps) {
  return (
    <div className="controls mb-8">
      <div className="flex gap-4 justify-center">
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
    </div>
  );
} 
import React from 'react';
import { RangeSlider } from '../common/RangeSlider';

interface ProgressBarProps {
  progress: number;  // 0 到 1 之间的值
  onProgressChange: (progress: number) => void;
  isPaused: boolean;
}

export function ProgressBar({ progress, onProgressChange, isPaused }: ProgressBarProps) {
  // 确保进度值在有效范围内
  const clampedProgress = Math.min(0.999, Math.max(0, progress));

  const handleChange = (value: number) => {
    if (isPaused) {
      onProgressChange(value);
    }
  };

  return (
    <div className="mb-4">
      <RangeSlider
        min={0}
        max={0.999}
        step={0.001}
        value={clampedProgress}
        onChange={handleChange}
      />
    </div>
  );
}   
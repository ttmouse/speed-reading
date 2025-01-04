import React from 'react';
import type { ReadingStats } from '@/app/types';

interface StatsProps {
  stats: ReadingStats;
}

export function Stats({ stats }: StatsProps) {
  return (
    <div className="stats mt-4 flex justify-center gap-8 text-sm text-gray-600">
      <span>已读: {stats.wordsRead} 字</span>
      <span>当前速度: {stats.currentWpm} 字/分钟</span>
      <span>预计剩余时间: {stats.timeRemaining}</span>
    </div>
  );
} 
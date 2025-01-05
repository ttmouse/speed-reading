'use client'

import React from 'react';

interface StatsDisplayProps {
  wordsRead: number;
  currentWpm: number;
  timeRemaining: string;
}

export function StatsDisplay({
  wordsRead,
  currentWpm,
  timeRemaining
}: StatsDisplayProps): JSX.Element {
  return (
    <div className="stats mt-4 flex justify-center gap-8 text-sm text-gray-600">
      <span>已读: {wordsRead} 字</span>
      <span>当前速度: {currentWpm} 字/分钟</span>
      <span>预计剩余时间: {timeRemaining}</span>
    </div>
  );
}
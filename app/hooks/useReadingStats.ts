import { useState, useCallback } from 'react';
import type { ReadingState, ReadingStats, ReadingSettings } from '@/app/types';

interface UseReadingStatsProps {
  state: ReadingState;
  settings: ReadingSettings;
  startTimeRef: React.RefObject<number>;
}

export function useReadingStats({ state, settings, startTimeRef }: UseReadingStatsProps) {
  const [stats, setStats] = useState<ReadingStats>({
    wordsRead: 0,
    currentWpm: 0,
    timeRemaining: '0:00'
  });

  const updateStats = useCallback((): void => {
    const startTime = startTimeRef.current || Date.now();
    const elapsedSeconds = (Date.now() - startTime) / 1000;
    if (elapsedSeconds <= 0) return;
    
    const currentWpm = Math.round((state.currentPosition / elapsedSeconds) * 60);
    const remainingWords = state.chunks.length - state.currentPosition;
    
    // 使用当前速度或设置速度中的较大值来计算
    const effectiveWpm = Math.max(currentWpm || settings.speed, settings.speed);
    
    // 计算剩余时间（分钟）
    const remainingTime = remainingWords / effectiveWpm;
    const totalSeconds = Math.max(0, remainingTime * 60); // 转换为秒并确保不为负
    
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    setStats({
      wordsRead: state.currentPosition,
      currentWpm: currentWpm || 0,
      timeRemaining: `${minutes}:${seconds.toString().padStart(2, '0')}`
    });
  }, [state.currentPosition, state.chunks.length, settings.speed, startTimeRef]);

  return { stats, updateStats };
} 
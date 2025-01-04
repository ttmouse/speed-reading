import React, { useState } from 'react';
import { ReadingStats } from '@/app/types';

// 处理统计相关
export function useReaderStats() {
  const [stats, setStats] = useState<ReadingStats>({
    wordsRead: 0,
    currentWpm: 0,
    timeRemaining: '0:00'
  });
  
  return { stats, setStats };
} 
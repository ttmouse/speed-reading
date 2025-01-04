import React, { useState } from 'react';
import { ReadingState } from '@/app/types';

// 处理基础状态
export function useReaderState(defaultText: string) {
  const [state, setState] = useState<ReadingState>({
    text: defaultText,
    currentPosition: 0,
    isPlaying: false,
    display: '准备开始',
    chunks: []
  });
  
  return { state, setState };
} 
'use client'

import { useState, useCallback, useEffect, useRef } from 'react';
import type { ReadingSettings, ReadingState, ReadingStats, UseReaderReturn } from '@/app/types';
import { 
  DEFAULT_TEXT,
  SPEED_STEP,
  MIN_SPEED,
  MAX_SPEED,
  MIN_CHUNK_SIZE,
  MAX_CHUNK_SIZE 
} from '@/app/constants/reader';

export const DEFAULT_SETTINGS: ReadingSettings = {
  // 基础设置
  chunkSize: 4,
  speed: 300,
  fontSize: 32,
  fontColor: '#000000',
  bgColor: '#FFFFFF',
  textAlign: 'center',
  windowSize: '800x600',
  
  // 阅读模式设置
  readingMode: 'serial',
  
  // Serial 模式设置
  numberOfLines: 1,
  wordsPerLine: 1,
  centerText: true,
  lineSpacing: 1.5,
  
  // Highlight 模式设置
  highlightSize: 3,
  contextLines: 2,
  highlightColor: '#FFD700',
  dimmedTextColor: '#808080',
  
  // 通用设置
  autoProgress: true,
  speedVariability: false,
  sentenceBreak: true,
  pauseAtBreaks: true,
  skipStopwords: false,
  stopwords: ['的', '了', '着', '和', '与', '及', '或'],
  
  // 视觉辅助
  showProgress: true,
  
  // 字体设置
  fontFamily: 'Microsoft YaHei',
  fontWeight: 400,
  letterSpacing: 0,
  lineHeight: 1.5,
  
  // 统计设置
  trackStats: true,
  showInstantWPM: true,
  showAccuracy: false
};

interface UseReaderProps {
  onSettingsClick?: () => void;
}

export function useReader({ onSettingsClick }: UseReaderProps = {}): UseReaderReturn {
  const [settings, setSettings] = useState<ReadingSettings>(DEFAULT_SETTINGS);

  const [state, setState] = useState<ReadingState>({
    text: DEFAULT_TEXT,  // 使用默认文本
    currentPosition: 0,
    isPlaying: false,
    display: '准备开始',
    chunks: []
  });

  const [stats, setStats] = useState<ReadingStats>({
    wordsRead: 0,
    currentWpm: 0,
    timeRemaining: '0:00'
  });

  const timerRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>(0);

  const handleTextChange = useCallback((text: string) => {
    setState(prev => ({ ...prev, text }));
  }, []);

  const handleSpeedChange = useCallback((speed: number) => {
    setSettings(prev => ({ ...prev, speed }));
  }, []);

  const handleChunkSizeChange = useCallback((chunkSize: number) => {
    setSettings(prev => ({ ...prev, chunkSize }));
  }, []);

  const updateStats = useCallback((): void => {
    const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000;
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
  }, [state.currentPosition, state.chunks.length, settings.speed]);

  const splitIntoChunks = useCallback((text: string, size: number) => {
    const chunks: string[] = [];
    const sentences = text.split(/([。！？.!?])/);
    let current = '';

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      for (let char of sentence) {
        if (char.trim() === '') continue;
        if (settings.skipStopwords && settings.stopwords.includes(char)) continue;
        
        current += char;
        if (current.length >= size) {
          chunks.push(current);
          current = '';
        }
      }

      // 处理句末标点
      if (/[。！？.!?]/.test(sentence)) {
        if (current) {
          chunks.push(current + sentence);
          current = '';
        } else {
          chunks[chunks.length - 1] += sentence;
        }

        // 句末停顿
        if (settings.pauseAtBreaks) {
          chunks.push('');  // 添加空块来创造停顿
        }
      }
    }
    if (current) chunks.push(current);
    return chunks;
  }, [settings.skipStopwords, settings.stopwords, settings.pauseAtBreaks]);

  const showNextChunk = useCallback(() => {
    setState(prev => {
      if (prev.currentPosition >= prev.chunks.length) {
        clearInterval(timerRef.current);
        return { ...prev, isPlaying: false, display: '完成' };
      }

      const chunk = prev.chunks[prev.currentPosition];
      return {
        ...prev,
        currentPosition: prev.currentPosition + 1,
        display: chunk
      };
    });
    updateStats();
  }, [updateStats]);

  const startReading = useCallback(() => {
    if (!state.text) return;
    
    const chunks = splitIntoChunks(state.text, settings.chunkSize);
    startTimeRef.current = Date.now();
    setState(prev => ({ 
      ...prev, 
      isPlaying: true,
      chunks,
      currentPosition: 0
    }));
    
    const getInterval = (chunk: string) => {
      let interval = 60000 / settings.speed;
      if (settings.speedVariability) {
        const factor = Math.max(0.5, Math.min(2, chunk.length / settings.chunkSize));
        interval *= factor;
      }
      return interval;
    };

    const initialInterval = getInterval(chunks[0]);
    timerRef.current = setInterval(showNextChunk, initialInterval);
  }, [settings, state.text, splitIntoChunks, updateStats, showNextChunk]);

  const pauseReading = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const resetAll = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setState({
      text: '',
      currentPosition: 0,
      isPlaying: false,
      display: '准备开始',
      chunks: []
    });
    
    setStats({
      wordsRead: 0,
      currentWpm: 0,
      timeRemaining: '0:00'
    });
    
    startTimeRef.current = 0;
  }, []);

  const resetReading = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setState(prev => ({
      ...prev,
      currentPosition: 0,
      isPlaying: false,
      display: '准备开始',
    }));
    
    setStats({
      wordsRead: 0,
      currentWpm: 0,
      timeRemaining: '0:00'
    });
    
    startTimeRef.current = 0;
  }, []);

  const handleSpeedAdjustment = useCallback((delta: number) => {
    const newSpeed = settings.speed + delta;
    if (newSpeed >= MIN_SPEED && newSpeed <= MAX_SPEED) {
      handleSpeedChange(newSpeed);
      updateInterval(newSpeed);
    }
  }, [settings.speed, handleSpeedChange]);

  const handleChunkSizeAdjustment = useCallback((delta: number) => {
    const newSize = settings.chunkSize + delta;
    if (newSize >= MIN_CHUNK_SIZE && newSize <= MAX_CHUNK_SIZE) {
      handleChunkSizeChange(newSize);
      updateChunks(newSize);
    }
  }, [settings.chunkSize, handleChunkSizeChange]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch(e.key.toLowerCase()) {
      case 'n':
        resetAll();
        break;
      case 'r':
        resetReading();
        break;
      case ' ':
        e.preventDefault();
        if (state.isPlaying) {
          pauseReading();
        } else {
          startReading();
        }
        break;
      case 'arrowup':
        e.preventDefault();
        handleSpeedAdjustment(SPEED_STEP);
        break;
      case 'arrowdown':
        e.preventDefault();
        handleSpeedAdjustment(-SPEED_STEP);
        break;
      case 'arrowleft':
        e.preventDefault();
        if (settings.chunkSize > 1) {
          handleChunkSizeChange(settings.chunkSize - 1);
          // 如果正在播放，只重新分割剩余文本
          if (state.isPlaying) {
            const remainingText = state.text.slice(state.currentPosition);
            const newChunks = splitIntoChunks(remainingText, settings.chunkSize - 1);
            setState(prev => ({
              ...prev,
              chunks: [...prev.chunks.slice(0, prev.currentPosition), ...newChunks]
            }));
          }
        }
        break;
      case 'arrowright':
        e.preventDefault();
        if (settings.chunkSize < 20) {
          handleChunkSizeChange(settings.chunkSize + 1);
          // 如果正在播放，只重新分割剩余文本
          if (state.isPlaying) {
            const remainingText = state.text.slice(state.currentPosition);
            const newChunks = splitIntoChunks(remainingText, settings.chunkSize + 1);
            setState(prev => ({
              ...prev,
              chunks: [...prev.chunks.slice(0, prev.currentPosition), ...newChunks]
            }));
          }
        }
        break;
      case 's':
        if (onSettingsClick) {
          onSettingsClick();
        }
        break;
    }
  }, [
    state.isPlaying,
    state.currentPosition,
    state.text,
    settings.speed,
    settings.chunkSize,
    pauseReading,
    resetReading,
    resetAll,
    startReading,
    handleSpeedChange,
    handleChunkSizeChange,
    onSettingsClick,
    splitIntoChunks,
    showNextChunk,
    handleSpeedAdjustment,
    SPEED_STEP
  ]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const updateSettings = useCallback((updates: Partial<ReadingSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const updateInterval = useCallback((newSpeed: number) => {
    if (state.isPlaying && timerRef.current) {
      clearInterval(timerRef.current);
      const interval = 60000 / newSpeed;
      timerRef.current = setInterval(showNextChunk, interval);
    }
  }, [state.isPlaying, showNextChunk]);

  const updateChunks = useCallback((newSize: number) => {
    if (state.isPlaying) {
      const remainingText = state.text.slice(state.currentPosition);
      const newChunks = splitIntoChunks(remainingText, newSize);
      setState(prev => ({
        ...prev,
        chunks: [...prev.chunks.slice(0, prev.currentPosition), ...newChunks]
      }));
    }
  }, [state.isPlaying, state.text, state.currentPosition, splitIntoChunks]);

  return {
    text: state.text,
    speed: settings.speed,
    chunkSize: settings.chunkSize,
    display: state.display,
    isPlaying: state.isPlaying,
    stats,
    settings,
    handleTextChange,
    handleSpeedChange,
    handleChunkSizeChange,
    updateSettings,
    startReading,
    pauseReading,
    resetReading,
    resetAll,
    handleKeyDown
  };
} 
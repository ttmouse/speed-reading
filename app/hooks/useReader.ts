'use client'

import { useState, useCallback, useEffect, useRef } from 'react';
import type { 
  ReadingSettings, 
  ReadingState, 
  ReadingStats, 
  UseReaderReturn, 
  UseReaderProps 
} from '@/app/types';
import { 
  DEFAULT_TEXT,
  SPEED_STEP,
  MIN_SPEED,
  MAX_SPEED,
  MIN_CHUNK_SIZE,
  MAX_CHUNK_SIZE 
} from '@/app/constants/reader';
import { useTextProcessor } from '@/app/hooks/useTextProcessor';
import { useReadingStats } from '@/app/hooks/useReadingStats';
import { useKeyboardControls } from '@/app/hooks/useKeyboardControls';
import { useReadingTimer } from '@/app/hooks/useReadingTimer';
import { splitTextIntoChunks } from '../utils/textProcessor';

import { DEFAULT_SETTINGS } from '../constants/readerSettings';

export function useReader({ onSettingsClick }: UseReaderProps = {}): UseReaderReturn {
  const [settings, setSettings] = useState<ReadingSettings>(DEFAULT_SETTINGS);
  const [state, setState] = useState<ReadingState>({
    text: DEFAULT_TEXT,
    currentPosition: 0,
    isPlaying: false,
    isPaused: false,
    display: '准备开始',
    chunks: [],
    setCurrentPosition: (position: number) => {
      setState(prev => ({
        ...prev,
        currentPosition: position,
        display: prev.chunks[position] || '完成'
      }));
    }
  });

  // 使用拆分后的 hooks
  const { splitIntoChunks } = useTextProcessor(settings);
  const { timerRef, startTimeRef, updateInterval } = useReadingTimer();
  const { stats, updateStats } = useReadingStats({ state, settings, startTimeRef });

  const handleTextChange = useCallback((text: string) => {
    setState(prev => ({ ...prev, text }));
  }, []);

  const handleSpeedChange = useCallback((speed: number) => {
    setSettings(prev => ({ ...prev, speed }));
  }, []);

  const handleChunkSizeChange = useCallback((chunkSize: number) => {
    setSettings(prev => ({ ...prev, chunkSize }));
  }, []);

  const showNextChunk = useCallback(() => {
    setState(prev => {
      if (prev.isPaused || prev.currentPosition >= prev.chunks.length) {
        clearInterval(timerRef.current);
        return { ...prev, isPlaying: false, display: prev.currentPosition >= prev.chunks.length ? '完成' : prev.display };
      }

      const chunk = prev.chunks[prev.currentPosition];
      return {
        ...prev,
        currentPosition: prev.currentPosition + 1,
        display: chunk
      };
    });
    updateStats();
  }, [updateStats, timerRef]);

  const startReading = useCallback(() => {
    if (!state.text) return;
    
    const chunks = state.chunks.length > 0 ? state.chunks : splitIntoChunks(state.text, settings.chunkSize);
    const now = Date.now();
    startTimeRef.current = now;
    setState(prev => ({ 
      ...prev, 
      isPlaying: true,
      isPaused: false,
      chunks,
      currentPosition: prev.chunks.length > 0 ? prev.currentPosition : 0
    }));
    
    const getInterval = (position: number) => {
      let interval = 60000 / settings.speed;

      // 在分页模式下，每页第一行增加停留时间
      if (settings.readingMode === 'highlight' && 
          settings.highlightStyle === 'page' && 
          position % settings.pageSize === 0) {
        interval *= 1.5; // 增加 50% 的停留时间
      }

      // 原有的速度变化逻辑
      if (settings.speedVariability) {
        const chunk = chunks[position] || '';
        const factor = Math.max(0.5, Math.min(2, chunk.length / settings.chunkSize));
        interval *= factor;
      }

      return interval;
    };

    const currentChunk = chunks[state.currentPosition] || chunks[0];
    const initialInterval = getInterval(state.currentPosition);
    timerRef.current = setInterval(showNextChunk, initialInterval);

    // 更新计时器间隔的函数
    const updateTimer = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        const newInterval = getInterval(state.currentPosition);
        timerRef.current = setInterval(showNextChunk, newInterval);
      }
    };

    // 监听位置变化，更新计时器间隔
    const unsubscribe = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };

    return unsubscribe;
  }, [settings, state.text, state.chunks, state.currentPosition, splitIntoChunks, showNextChunk, timerRef, startTimeRef]);

  const pauseReading = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setState(prev => ({ ...prev, isPlaying: false, isPaused: true }));
  }, [timerRef]);

  const resetAll = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setState({
      text: '',
      currentPosition: 0,
      isPlaying: false,
      isPaused: false,
      display: '准备开始',
      chunks: [],
      setCurrentPosition: (position: number) => {
        setState(prev => ({
          ...prev,
          currentPosition: position,
          display: prev.chunks[position] || '完成'
        }));
      }
    });
    
    startTimeRef.current = 0;
  }, [timerRef, startTimeRef]);

  const resetReading = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setState(prev => ({
      ...prev,
      currentPosition: 0,
      isPlaying: false,
      isPaused: false,
      display: '准备开始'
    }));
    
    startTimeRef.current = 0;
  }, [timerRef, startTimeRef]);

  const handleSpeedAdjustment = useCallback((delta: number) => {
    const newSpeed = settings.speed + delta;
    if (newSpeed >= MIN_SPEED && newSpeed <= MAX_SPEED) {
      handleSpeedChange(newSpeed);
      updateInterval(newSpeed, showNextChunk);
    }
  }, [settings.speed, handleSpeedChange, updateInterval, showNextChunk]);

  const handleChunkSizeAdjustment = useCallback((delta: number) => {
    const newSize = settings.chunkSize + delta;
    if (newSize >= MIN_CHUNK_SIZE && newSize <= MAX_CHUNK_SIZE) {
      handleChunkSizeChange(newSize);
      const newChunks = splitIntoChunks(state.text, newSize);
      setState(prev => ({
        ...prev,
        chunks: newChunks,
        display: newChunks[prev.currentPosition] || '完成'
      }));
    }
  }, [settings.chunkSize, handleChunkSizeChange, state.text, splitIntoChunks]);

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

  const updateSettings = useCallback((updates: Partial<ReadingSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const processText = useCallback((text: string) => {
    if (!text) return [];
    return splitTextIntoChunks(text, settings.chunkSize);
  }, [settings.chunkSize]);

  // 使用键盘控制 hook
  const { handleKeyDown } = useKeyboardControls({
    state,
    settings,
    onSpeedAdjust: handleSpeedAdjustment,
    onChunkSizeAdjust: handleChunkSizeAdjustment,
    onStart: startReading,
    onPause: pauseReading,
    onReset: resetReading,
    onResetAll: resetAll,
    onSettingsClick
  });

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerRef]);

  return {
    text: state.text,
    speed: settings.speed,
    chunkSize: settings.chunkSize,
    display: state.display,
    isPlaying: state.isPlaying,
    stats,
    settings,
    state,
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
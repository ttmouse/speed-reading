import { useRef, useCallback } from 'react';

export function useReadingTimer() {
  const timerRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>(0);

  const updateInterval = useCallback((newSpeed: number, showNextChunk: () => void) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      const interval = 60000 / newSpeed;
      timerRef.current = setInterval(showNextChunk, interval);
    }
  }, []);

  return { timerRef, startTimeRef, updateInterval };
} 
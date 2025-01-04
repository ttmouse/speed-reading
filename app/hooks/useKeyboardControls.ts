import { useCallback } from 'react';
import type { ReadingState, ReadingSettings } from '@/app/types';
import { SPEED_STEP } from '@/app/constants/reader';

interface UseKeyboardControlsProps {
  state: ReadingState;
  settings: ReadingSettings;
  onSpeedAdjust: (delta: number) => void;
  onChunkSizeAdjust: (delta: number) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onResetAll: () => void;
  onSettingsClick?: () => void;
}

export function useKeyboardControls({
  state,
  settings,
  onSpeedAdjust,
  onChunkSizeAdjust,
  onStart,
  onPause,
  onReset,
  onResetAll,
  onSettingsClick
}: UseKeyboardControlsProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch(e.key.toLowerCase()) {
      case 'n':
        onResetAll();
        break;
      case 'r':
        onReset();
        break;
      case ' ':
        e.preventDefault();
        if (state.isPlaying) {
          onPause();
        } else {
          onStart();
        }
        break;
      case 'arrowup':
        e.preventDefault();
        onSpeedAdjust(SPEED_STEP);
        break;
      case 'arrowdown':
        e.preventDefault();
        onSpeedAdjust(-SPEED_STEP);
        break;
      case 'arrowleft':
        e.preventDefault();
        onChunkSizeAdjust(-1);
        break;
      case 'arrowright':
        e.preventDefault();
        onChunkSizeAdjust(1);
        break;
      case 's':
        if (onSettingsClick) {
          onSettingsClick();
        }
        break;
    }
  }, [
    state.isPlaying,
    onSpeedAdjust,
    onChunkSizeAdjust,
    onStart,
    onPause,
    onReset,
    onResetAll,
    onSettingsClick
  ]);

  return { handleKeyDown };
} 
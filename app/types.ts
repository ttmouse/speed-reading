export interface UseReaderProps {
  onSettingsClick?: () => void;
}

export interface UseReaderReturn {
  text: string;
  speed: number;
  chunkSize: number;
  display: string;
  isPlaying: boolean;
  stats: ReadingStats;
  settings: ReadingSettings;
  handleTextChange: (text: string) => void;
  handleSpeedChange: (speed: number) => void;
  handleChunkSizeChange: (size: number) => void;
  updateSettings: (updates: Partial<ReadingSettings>) => void;
  startReading: () => void;
  pauseReading: () => void;
  resetReading: () => void;
  resetAll: () => void;
  handleKeyDown: (e: KeyboardEvent) => void;
}

export interface ReadingStats {
  wordsRead: number;
  currentWpm: number;
  timeRemaining: string;
}

export interface ReadingSettings {
  chunkSize: number;
  speed: number;
  fontSize: number;
  fontColor: string;
  bgColor: string;
  textAlign: string;
  windowSize: string;
  readingMode: 'rsvp' | 'scroll' | 'page' | 'focus';
  autoProgress: boolean;
  speedVariability: boolean;
  sentenceBreak: boolean;
  pauseAtBreaks: boolean;
  skipStopwords: boolean;
  stopwords: string[];
  focusPoint: 'left' | 'center' | 'right';
  highlightFocus: boolean;
  showProgress: boolean;
  subvocalizationReminder: boolean;
  regressionControl: boolean;
  eyeMovementGuide: boolean;
  fontFamily: string;
  fontWeight: number;
  letterSpacing: number;
  lineHeight: number;
  showFocusPoint: boolean;
  focusPointColor: string;
  focusPointSize: number;
  previewNextWord: boolean;
  showContext: boolean;
  contextLines: number;
  soundEnabled: boolean;
  soundVolume: number;
  soundType: 'click' | 'beep' | 'none';
  trackStats: boolean;
  showInstantWPM: boolean;
  showAccuracy: boolean;
}

export interface ReadingState {
  text: string;
  currentPosition: number;
  isPlaying: boolean;
  display: string;
  chunks: string[];
} 
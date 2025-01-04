export interface ReadingSettings {
  chunkSize: number;
  speed: number;
  fontSize: number;
  fontColor: string;
  bgColor: string;
  textAlign: string;
  windowSize: string;
  readingMode: 'serial' | 'highlight';
  numberOfLines: number;
  wordsPerLine: number;
  centerText: boolean;
  lineSpacing: number;
  highlightSize: number;
  contextLines: number;
  highlightColor: string;
  dimmedTextColor: string;
  autoProgress: boolean;
  speedVariability: boolean;
  sentenceBreak: boolean;
  pauseAtBreaks: boolean;
  skipStopwords: boolean;
  stopwords: string[];
  showProgress: boolean;
  fontFamily: string;
  fontWeight: number;
  letterSpacing: number;
  lineHeight: number;
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

export interface ReadingStats {
  wordsRead: number;
  currentWpm: number;
  timeRemaining: string;
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
  handleKeyDown: (e: KeyboardEvent) => void;
} 
// 阅读模式类型
export type ReadingMode = 'serial' | 'highlight';

// 基础设置类型
export interface BaseSettings {
  chunkSize: number;
  speed: number;
  fontSize: number;
  fontColor: string;
  bgColor: string;
  textAlign: string;
  windowSize: string;
}

// 串行模式设置
export interface SerialModeSettings {
  numberOfLines: number;
  wordsPerLine: number;
  centerText: boolean;
  lineSpacing: number;
}

// 高亮模式类型
export type HighlightStyle = 'scroll' | 'page';

// 高亮模式设置
export interface HighlightModeSettings {
  contextLines: number;
  highlightColor: string;
  dimmedTextColor: string;
  highlightStyle: HighlightStyle;
  pageSize: number;
  charsPerLine: number;
}

// 通用设置
export interface CommonSettings {
  autoProgress: boolean;
  speedVariability: boolean;
  sentenceBreak: boolean;
  pauseAtBreaks: boolean;
  skipStopwords: boolean;
  stopwords: string[];
  showProgress: boolean;
  focusPoint: 'left' | 'center' | 'right';
  highlightFocus: boolean;
  subvocalizationReminder: boolean;
  regressionControl: boolean;
  eyeMovementGuide: boolean;
}

// 字体设置
export interface FontSettings {
  fontFamily: string;
  fontWeight: number;
  letterSpacing: number;
  lineHeight: number;
}

// 显示设置
export interface DisplaySettings {
  showFocusPoint: boolean;
  focusPointColor: string;
  focusPointSize: number;
  previewNextWord: boolean;
  showContext: boolean;
  contextLines: number;
}

// 声音设置
export interface SoundSettings {
  soundEnabled: boolean;
  soundVolume: number;
  soundType: 'click' | 'beep' | 'none';
}

// 统计设置
export interface StatSettings {
  trackStats: boolean;
  showInstantWPM: boolean;
  showAccuracy: boolean;
}

// 完整设置接口
export interface ReadingSettings extends 
  BaseSettings,
  SerialModeSettings,
  HighlightModeSettings,
  CommonSettings,
  FontSettings,
  DisplaySettings,
  SoundSettings,
  StatSettings {
  readingMode: ReadingMode;
}

// 阅读状态
export interface ReadingState {
  text: string;
  chunks: string[];
  currentPosition: number;
  setCurrentPosition: (position: number) => void;
  isPlaying: boolean;
  isPaused: boolean;
  display: string;
}

// 阅读统计
export interface ReadingStats {
  wordsRead: number;
  currentWpm: number;
  timeRemaining: string;
}

// Hook 返回值类型
export interface UseReaderReturn {
  text: string;
  speed: number;
  chunkSize: number;
  display: string;
  isPlaying: boolean;
  stats: ReadingStats;
  settings: ReadingSettings;
  state: ReadingState;
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

// Hook 参数类型
export interface UseReaderProps {
  onSettingsClick?: () => void;
} 
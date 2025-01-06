import { ThemeMode } from '../constants/themes';

// 新的阅读模式
export type DisplayMode = 'serial' | 'scroll' | 'page';

// 旧的阅读模式（保持向后兼容）
export type ReadingMode = 'serial' | 'highlight';
export type HighlightStyle = 'scroll' | 'page';

// 阅读设置
export interface ReadingSettings {
  // 基础设置
  readingMode: ReadingMode;
  highlightStyle: HighlightStyle;
  displayMode?: DisplayMode;  // 新增：统一的显示模式
  speed: number;
  chunkSize: number;
  
  // 主题设置
  theme: ThemeMode;
  
  // 显示设置
  fontSize: number;
  lineSpacing: number;
  textAreaWidth: number;
  pageSize: number;
  dimmedTextColor: string;
  contextLines: number;
  
  // 分词设置
  sentenceBreak: boolean;
  flexibleRange: number;
  hideEndPunctuation: boolean;
  skipStopwords: boolean;  // 是否跳过停用词
  stopwords: string[];     // 停用词列表
  
  // 速度控制
  speedVariability: boolean;  // 是否启用速度变化
  pauseAtBreaks: boolean;    // 在句末段落末尾停顿
  
  // 显示设置
  showProgress: boolean;
  showChunkPreview: boolean;  // 是否显示分词预览导航
}

// 阅读状态
export interface ReadingState {
  text: string;
  currentPosition: number;
  isPlaying: boolean;
  isPaused: boolean;
  display: string;
  chunks: string[];
  progress: number;
}

// 阅读统计
export interface ReadingStats {
  wordsRead: number;
  currentWpm: number;
  timeRemaining: string;
}

// Hook 参数
export interface UseReaderProps {
  onSettingsClick?: () => void;
}

// Hook 返回值
export interface UseReaderReturn {
  // 状态
  text: string;
  speed: number;
  chunkSize: number;
  display: string;
  isPlaying: boolean;
  stats: ReadingStats;
  settings: ReadingSettings;
  state: ReadingState;
  
  // 方法
  handleTextChange: (text: string) => void;
  handleSpeedChange: (speed: number) => void;
  handleChunkSizeChange: (size: number) => void;
  updateSettings: (updates: Partial<ReadingSettings>) => void;
  startReading: () => void;
  pauseReading: () => void;
  resetReading: () => void;
  resetAll: () => void;
  handleKeyDown: (event: KeyboardEvent) => void;
  setCurrentPosition: (position: number) => void;
}

// 分词选项
export interface ChunkOptions {
  chunkSize: number;
  sentenceBreak: boolean;
  flexibleRange?: number;
  hideEndPunctuation?: boolean;
  readingMode?: ReadingMode;
  highlightStyle?: HighlightStyle;
}

// 分词结果
export interface ChunkResult {
  text: string;
  hasPunctuation: boolean;
  punctuation?: string;
} 
import type { ReadingSettings } from '../types';

export const DEFAULT_SETTINGS: ReadingSettings = {
  // 基础设置
  readingMode: 'highlight',
  highlightStyle: 'page',
  speed: 300,
  chunkSize: 4,
  fontSize: 24,
  fontColor: '#000000',
  bgColor: '#ffffff',
  textAlign: 'left',
  windowSize: '800x600',
  
  // 分页模式设置
  pageSize: 5,           // 默认5行
  lineWidth: 20,         // 默认每行20字
  lineSpacing: 16,       // 默认16px行间距
  blockSpacing: 8,       // 默认8px块间距
  textAreaWidth: 800,    // 默认800px宽度
  
  // 滚动模式设置
  contextLines: 2,
  dimmedTextColor: '#666666',
  
  // 视觉辅助
  focusPoint: 'left',
  highlightFocus: true,
  showProgress: true,
  
  // 高级设置
  speedVariability: false,
  sentenceBreak: true,
  pauseAtBreaks: true,
  skipStopwords: false,
  stopwords: []
};
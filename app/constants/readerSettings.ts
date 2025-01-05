import type { ReadingSettings } from '../types';

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
  readingMode: 'serial' as const,
  
  // Serial 模式设置
  numberOfLines: 1,
  wordsPerLine: 1,
  centerText: true,
  lineSpacing: 1.5,
  
  // Highlight 模式设置
  contextLines: 2,
  highlightColor: '#FFFFFF',
  dimmedTextColor: '#666666',
  highlightStyle: 'scroll',
  pageSize: 5,
  
  // 通用设置
  autoProgress: true,
  speedVariability: false,
  sentenceBreak: true,
  pauseAtBreaks: true,
  skipStopwords: false,
  stopwords: ['的', '了', '着', '和', '与', '及', '或'],
  showProgress: true,
  focusPoint: 'center',
  highlightFocus: false,
  subvocalizationReminder: false,
  regressionControl: false,
  eyeMovementGuide: false,
  
  // 字体设置
  fontFamily: 'LXGWWenKaiGB',
  fontWeight: 400,
  letterSpacing: 0,
  lineHeight: 1.5,
  
  // 显示设置
  showFocusPoint: false,
  focusPointColor: '#FF0000',
  focusPointSize: 4,
  previewNextWord: false,
  showContext: false,
  
  // 声音设置
  soundEnabled: false,
  soundVolume: 50,
  soundType: 'none',
  
  // 统计设置
  trackStats: true,
  showInstantWPM: true,
  showAccuracy: false,
  charsPerLine: 20
};
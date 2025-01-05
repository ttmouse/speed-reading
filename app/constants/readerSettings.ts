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
  windowSize: '800x600',
  
  // 分页模式设置
  pageSize: 5,           // 默认5行
  lineWidth: 20,         // 默认每行20字
  lineSpacing: 16,       // 默认16px行间距
  textAreaWidth: 800,    // 默认800px宽度
  
  // 滚动模式设置
  contextLines: 2,
  dimmedTextColor: '#666666',
  
  // 高级设置
  speedVariability: false,
  sentenceBreak: true,
  pauseAtBreaks: true,
  skipStopwords: false,
  stopwords: [
    "的", "了", "和", "与", "或", "而", "但", "所", "以",
    "之", "于", "则", "却", "并", "着", "让", "向", "往",
    "是", "在", "到", "给", "又", "等", "被", "把", "来",
    "去", "将", "从", "对", "能", "都", "要", "这", "那",
    "你", "我", "他", "她", "它", "们", "个", "为", "才"
  ],
  hideEndPunctuation: false,  // 默认显示末尾标点
  showProgress: true,
  flexibleRange: 1,  // 默认浮动1个字
};
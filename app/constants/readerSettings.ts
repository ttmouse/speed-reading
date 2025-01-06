import { ReadingSettings } from '../types';
import { THEME_MODES, ThemeMode } from './themes';

// 设置分类
export const SETTING_CATEGORIES = {
  SPEED: '速度',
  DISPLAY: '显示',
  TEXT: '文本',
} as const;

// 默认停用词列表
export const DEFAULT_STOPWORDS = [
  "的", "了", "和", "与", "或", "而", "但", "所", "以",
  "之", "于", "则", "却", "并", "着", "让", "向", "往",
  "是", "在", "到", "给", "又", "等", "被", "把", "来",
  "去", "将", "从", "对", "能", "都", "要", "这", "那",
  "你", "我", "他", "她", "它", "们", "个", "为", "才"
];

// 设置项配置
export const SETTING_METADATA = {
  speed: {
    category: SETTING_CATEGORIES.SPEED,
    default: 210
  },
  readingMode: {
    category: SETTING_CATEGORIES.DISPLAY,
    default: 'serial' as const
  },
  highlightStyle: {
    category: SETTING_CATEGORIES.DISPLAY,
    default: 'scroll' as const
  },
  chunkSize: {
    category: SETTING_CATEGORIES.DISPLAY,
    default: 7
  },
  flexibleRange: {
    category: SETTING_CATEGORIES.DISPLAY,
    default: 2
  },
  sentenceBreak: {
    category: SETTING_CATEGORIES.DISPLAY,
    default: true
  },
  hideEndPunctuation: {
    category: SETTING_CATEGORIES.DISPLAY,
    default: false
  },
  skipStopwords: {
    category: SETTING_CATEGORIES.TEXT,
    default: false
  },
  stopwords: {
    category: SETTING_CATEGORIES.TEXT,
    default: DEFAULT_STOPWORDS
  },
  speedVariability: {
    category: SETTING_CATEGORIES.SPEED,
    default: false
  },
  pauseAtBreaks: {
    category: SETTING_CATEGORIES.SPEED,
    default: true
  },
  showProgress: {
    category: SETTING_CATEGORIES.DISPLAY,
    default: true
  },
  showChunkPreview: {
    category: SETTING_CATEGORIES.DISPLAY,
    default: true
  },
  fontSize: {
    category: SETTING_CATEGORIES.DISPLAY,
    default: 16
  },
  lineSpacing: {
    category: SETTING_CATEGORIES.DISPLAY,
    default: 8
  },
  textAreaWidth: {
    category: SETTING_CATEGORIES.DISPLAY,
    default: 600
  },
  pageSize: {
    category: SETTING_CATEGORIES.DISPLAY,
    default: 5
  },
  dimmedTextColor: {
    category: SETTING_CATEGORIES.DISPLAY,
    default: '#9CA3AF'
  },
  contextLines: {
    category: SETTING_CATEGORIES.DISPLAY,
    default: 2
  },
  theme: {
    category: SETTING_CATEGORIES.DISPLAY,
    default: THEME_MODES.LIGHT as ThemeMode
  },
} as const;

// 默认设置
export const DEFAULT_SETTINGS: ReadingSettings = {
  readingMode: SETTING_METADATA.readingMode.default,
  highlightStyle: SETTING_METADATA.highlightStyle.default,
  speed: SETTING_METADATA.speed.default,
  chunkSize: SETTING_METADATA.chunkSize.default,
  flexibleRange: SETTING_METADATA.flexibleRange.default,
  sentenceBreak: SETTING_METADATA.sentenceBreak.default,
  hideEndPunctuation: SETTING_METADATA.hideEndPunctuation.default,
  skipStopwords: SETTING_METADATA.skipStopwords.default,
  stopwords: SETTING_METADATA.stopwords.default,
  speedVariability: SETTING_METADATA.speedVariability.default,
  pauseAtBreaks: SETTING_METADATA.pauseAtBreaks.default,
  showProgress: SETTING_METADATA.showProgress.default,
  showChunkPreview: SETTING_METADATA.showChunkPreview.default,
  fontSize: SETTING_METADATA.fontSize.default,
  lineSpacing: SETTING_METADATA.lineSpacing.default,
  textAreaWidth: SETTING_METADATA.textAreaWidth.default,
  pageSize: SETTING_METADATA.pageSize.default,
  dimmedTextColor: SETTING_METADATA.dimmedTextColor.default,
  contextLines: SETTING_METADATA.contextLines.default,
  theme: SETTING_METADATA.theme.default,
};

type SettingMetadataType = typeof SETTING_METADATA;
type SettingKey = keyof SettingMetadataType;

// 设置验证
export function validateSetting(key: SettingKey, value: any): boolean {
  const config = SETTING_METADATA[key];
  
  if ('min' in config && 'max' in config) {
    const { min, max } = config as { min: number; max: number };
    return value >= min && value <= max;
  }
  
  if ('options' in config) {
    const { options } = config as { options: any[] };
    return options.includes(value);
  }
  
  if (typeof config.default === 'boolean') {
    return typeof value === 'boolean';
  }
  
  return true;
}
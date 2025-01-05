import { ReadingSettings } from '../types';

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
  readingSpeed: {
    category: SETTING_CATEGORIES.SPEED,
    default: 210
  },
  chunkSize: {
    category: SETTING_CATEGORIES.DISPLAY,
    default: 7
  },
  flexibleRange: {
    category: SETTING_CATEGORIES.DISPLAY,
    default: 2
  },
  fontSize: {
    category: SETTING_CATEGORIES.TEXT,
    default: 16
  },
  sentenceBreak: {
    category: SETTING_CATEGORIES.DISPLAY,
    default: true
  },
  hideEndPunctuation: {
    category: SETTING_CATEGORIES.DISPLAY,
    default: false
  },
  showProgress: {
    category: SETTING_CATEGORIES.DISPLAY,
    default: true
  },
  showChunkPreview: {
    category: SETTING_CATEGORIES.DISPLAY,
    default: true
  }
} as const;

// 默认设置
export const DEFAULT_SETTINGS: ReadingSettings = {
  readingSpeed: SETTING_METADATA.readingSpeed.default,
  chunkSize: SETTING_METADATA.chunkSize.default,
  flexibleRange: SETTING_METADATA.flexibleRange.default,
  fontSize: SETTING_METADATA.fontSize.default,
  sentenceBreak: SETTING_METADATA.sentenceBreak.default,
  hideEndPunctuation: SETTING_METADATA.hideEndPunctuation.default,
  showProgress: SETTING_METADATA.showProgress.default,
  showChunkPreview: SETTING_METADATA.showChunkPreview.default,
};

// 设置验证
export function validateSetting(key: keyof ReadingSettings, value: any): boolean {
  const config = SETTING_METADATA[key];
  
  if ('min' in config && 'max' in config) {
    return value >= config.min && value <= config.max;
  }
  
  if ('options' in config) {
    return config.options.includes(value);
  }
  
  if (typeof config.default === 'boolean') {
    return typeof value === 'boolean';
  }
  
  return true;
}
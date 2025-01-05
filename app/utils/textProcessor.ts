export interface TextBlock {
  text: string;
  isPartial: boolean;
  isBreak: boolean;
}

interface TextProcessorOptions {
  chunkSize: number;
  skipStopwords: boolean;
  stopwords: string[];
  speedVariability: boolean;
  pauseAtBreaks: boolean;
}

export function splitTextIntoChunks(text: string, chunkSize: number): string[] {
  const chunks: string[] = [];
  let currentPosition = 0;

  while (currentPosition < text.length) {
    const chunk = text.slice(currentPosition, currentPosition + chunkSize);
    chunks.push(chunk);
    currentPosition += chunkSize;
  }

  return chunks;
}

export class TextProcessor {
  private options: TextProcessorOptions;

  constructor(options: TextProcessorOptions) {
    this.options = options;
  }

  processText(text: string): TextBlock[] {
    const { chunkSize, skipStopwords, stopwords } = this.options;
    const blocks: TextBlock[] = [];
    let currentPosition = 0;

    while (currentPosition < text.length) {
      let blockSize = Math.min(chunkSize, text.length - currentPosition);
      let blockText = text.slice(currentPosition, currentPosition + blockSize);
      
      // 处理停用词
      if (skipStopwords && isStopword(blockText, stopwords)) {
        currentPosition += blockSize;
        continue;
      }
      
      // 检查是否是句末或段落末
      const isBreak = isBreakPoint(text, currentPosition + blockSize - 1);
      
      blocks.push({
        text: blockText,
        isPartial: blockSize < chunkSize,
        isBreak
      });
      
      currentPosition += blockSize;
    }

    return blocks;
  }
}

// 标点符号配置
export const PUNCTUATION_CONFIG = {
  // 句末标点
  SENTENCE_ENDINGS: /[。！？!?.]/,
  // 段落结束
  PARAGRAPH_ENDINGS: /[\n\r]/,
  // 句中标点
  CLAUSE_SEPARATORS: /[，、；：,;]/,
  // 所有标点
  ALL_PUNCTUATION: /[。，、；：？！,.;:?!]/
} as const;

// 分词模式配置
export const CHUNK_MODE_CONFIG = {
  // 需要隐藏标点的模式
  HIDE_PUNCTUATION_MODES: {
    serial: true,
    highlight: {
      scroll: true,
      page: false
    }
  }
} as const;

// 判断是否是句末或段落末
export function isBreakPoint(text: string, position: number): boolean {
  return (
    PUNCTUATION_CONFIG.SENTENCE_ENDINGS.test(text[position]) ||
    PUNCTUATION_CONFIG.PARAGRAPH_ENDINGS.test(text[position])
  );
}

// 判断是否应该隐藏标点
export function shouldHidePunctuation(
  hideEndPunctuation: boolean,
  readingMode: 'serial' | 'highlight',
  highlightStyle?: 'scroll' | 'page'
): boolean {
  if (!hideEndPunctuation) return false;
  
  if (readingMode === 'serial') return true;
  
  if (readingMode === 'highlight' && highlightStyle) {
    return CHUNK_MODE_CONFIG.HIDE_PUNCTUATION_MODES.highlight[highlightStyle];
  }
  
  return false;
}

// 判断是否是停用词
export function isStopword(word: string, stopwords: string[]): boolean {
  return stopwords.includes(word);
}

// 计算速度调整因子
export function getSpeedFactor(
  chunk: string, 
  targetSize: number, 
  isBreak: boolean
): number {
  let factor = 1;
  
  // 根据长度调整速度
  const lengthFactor = chunk.length / targetSize;
  factor *= Math.max(0.5, Math.min(2, lengthFactor));
  
  // 在句末或段落末增加停顿
  if (isBreak) {
    factor *= 1.5;
  }
  
  return factor;
} 
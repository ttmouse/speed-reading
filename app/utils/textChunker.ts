import { PUNCTUATION_CONFIG, shouldHidePunctuation } from './textProcessor';

interface ChunkOptions {
  chunkSize: number;
  sentenceBreak: boolean;  // 在句末段落末开始新词组
  flexibleRange?: number;  // 字数浮动范围，默认为1个字
  hideEndPunctuation?: boolean;  // 是否隐藏末尾标点
  readingMode?: 'serial' | 'highlight';  // 阅读模式
  highlightStyle?: 'scroll' | 'page';  // 高亮模式样式
}

interface ChunkResult {
  text: string;
  hasPunctuation: boolean;
  punctuation?: string;
  shouldSkip?: boolean;  // 新增：标记是否应该跳过当前位置
}

// 语义单位配置
const SEMANTIC_UNITS = {
  // 数量词组
  QUANTITY: /[一二三四五六七八九十百千万亿两几多少]+[个本次张支条个件次批节双对]?/,
  // 时间词组
  TIME: /[今明后昨前后]+[天年月日周时分秒]/,
  // 介词词组
  PREPOSITION: /(在|把|从|向|往|给|对|为|被|让|由|与|和|跟|同|以)/,
  // 助词词组
  AUXILIARY: /(的|地|得|着|过|了|吗|呢|啊|吧|么|哦|呀|啦)/,
  // 连词词组
  CONJUNCTION: /(而且|或者|但是|不过|然后|因此|所以|如果|虽然|即使|无论|只要)/
} as const;

// 检查是否是句末或段落末
function isBreakPoint(text: string, position: number): boolean {
  if (position < 0 || position >= text.length) return false;
  return (
    PUNCTUATION_CONFIG.SENTENCE_ENDINGS.test(text[position]) ||
    PUNCTUATION_CONFIG.PARAGRAPH_ENDINGS.test(text[position])
  );
}

// 处理文本块
function processChunk(chunk: string, punctuation: string | undefined, shouldHide: boolean): string {
  if (!punctuation || !shouldHide) {
    return chunk + (punctuation || '');
  }
  return chunk;
}

// 检查是否是语义单位的开始
function isSemanticUnitStart(text: string, position: number): boolean {
  const remainingText = text.slice(position);
  return Object.values(SEMANTIC_UNITS).some(pattern => pattern.test(remainingText));
}

// 获取语义单位的长度
function getSemanticUnitLength(text: string, position: number): number {
  const remainingText = text.slice(position);
  for (const pattern of Object.values(SEMANTIC_UNITS)) {
    const match = remainingText.match(pattern);
    if (match && match.index === 0) {
      return match[0].length;
    }
  }
  return 0;
}

// 查找最佳切分点
function findBestBreakPoint(
  text: string,
  start: number,
  minSize: number,
  maxSize: number,
  targetSize: number,
  sentenceBreak: boolean
): ChunkResult {
  let bestBreakPoint = start + targetSize;
  let bestDistance = Number.MAX_VALUE;
  let hasPunctuation = false;
  let punctuation: string | undefined;

  // 检查开始位置是否是标点
  if (start > 0 && PUNCTUATION_CONFIG.ALL_PUNCTUATION.test(text[start])) {
    return {
      text: '',
      hasPunctuation: true,
      punctuation: text[start],
      shouldSkip: true
    };
  }

  // 如果启用了句末分词，优先寻找句末或段落末
  if (sentenceBreak) {
    for (let j = start; j <= Math.min(start + maxSize + 1, text.length - 1); j++) {
      if (isBreakPoint(text, j)) {
        if (j - start >= minSize) {
          bestBreakPoint = j;
          hasPunctuation = true;
          punctuation = text[j];
          return {
            text: text.slice(start, bestBreakPoint),
            hasPunctuation,
            punctuation
          };
        }
        continue;
      }
    }
  }

  // 在目标长度范围内寻找最佳切分点
  for (let j = start + minSize; j <= Math.min(start + maxSize, text.length - 1); j++) {
    // 计算当前位置的得分
    let score = Math.abs(j - start - targetSize);  // 基础分数：与目标长度的差距
    
    // 如果当前位置是语义单位的开始，降低其得分（使其更不可能在这里切分）
    if (isSemanticUnitStart(text, j)) {
      score += 5;  // 增加得分，降低在语义单位开始处切分的可能性
    }
    
    // 如果当前位置是标点，且不是句末标点
    if (PUNCTUATION_CONFIG.ALL_PUNCTUATION.test(text[j]) && !isBreakPoint(text, j)) {
      score -= 3;  // 降低得分，增加在标点处切分的可能性
      if (score < bestDistance) {
        bestDistance = score;
        bestBreakPoint = j;
        hasPunctuation = true;
        punctuation = text[j];
      }
    }
    // 如果当前位置是语义单位的结束
    else if (j > start && isSemanticUnitStart(text, j - getSemanticUnitLength(text, j - 1))) {
      score -= 2;  // 降低得分，增加在语义单位结束处切分的可能性
      if (score < bestDistance) {
        bestDistance = score;
        bestBreakPoint = j;
        hasPunctuation = false;
      }
    }
  }

  // 如果没有找到更好的切分点，使用目标长度
  if (bestBreakPoint === start + targetSize) {
    return {
      text: text.slice(start, Math.min(bestBreakPoint, text.length)),
      hasPunctuation: false,
      punctuation: undefined
    };
  }

  return {
    text: text.slice(start, bestBreakPoint),
    hasPunctuation,
    punctuation
  };
}

export function chunkText(text: string, options: ChunkOptions): string[] {
  const { 
    chunkSize, 
    sentenceBreak, 
    flexibleRange = 1, 
    hideEndPunctuation = false,
    readingMode = 'serial',
    highlightStyle = 'scroll'
  } = options;

  const shouldHide = shouldHidePunctuation(hideEndPunctuation, readingMode, highlightStyle);
  const chunks: string[] = [];
  let i = 0;
  let lastChunk = '';  // 用于存储上一个分组

  while (i < text.length) {
    const minSize = chunkSize - flexibleRange;
    const maxSize = chunkSize + flexibleRange;

    // 找到最佳切分点
    const result = findBestBreakPoint(
      text,
      i,
      minSize,
      maxSize,
      chunkSize,
      sentenceBreak
    );

    // 如果需要跳过当前位置
    if (result.shouldSkip) {
      if (lastChunk && result.punctuation) {
        // 将标点添加到上一个分组
        chunks[chunks.length - 1] = lastChunk + (shouldHide ? '' : result.punctuation);
      }
      i += 1;
      continue;
    }

    // 处理文本块
    const processedChunk = processChunk(result.text, result.punctuation, shouldHide);
    chunks.push(processedChunk);
    lastChunk = processedChunk;

    // 移动指针
    i += result.text.length + (result.hasPunctuation ? 1 : 0);
  }

  return chunks;
} 
interface ChunkOptions {
  chunkSize: number;
  sentenceBreak: boolean;
  flexibleRange?: number;  // 字数浮动范围，默认为1个字
  hideEndPunctuation?: boolean;  // 是否隐藏末尾标点
  readingMode?: 'serial' | 'highlight';  // 阅读模式
  highlightStyle?: 'scroll' | 'page';  // 高亮模式样式
}

// 标点符号正则
const PUNCTUATION_REGEX = /[。，、；：？！,.;:?!]/;

export function chunkText(text: string, options: ChunkOptions): string[] {
  const { 
    chunkSize, 
    sentenceBreak, 
    flexibleRange = 1, 
    hideEndPunctuation = false,
    readingMode = 'serial',
    highlightStyle = 'scroll'
  } = options;

  // 在分页模式下不隐藏标点
  const shouldHidePunctuation = hideEndPunctuation && 
    (readingMode === 'serial' || (readingMode === 'highlight' && highlightStyle === 'scroll'));

  const chunks: string[] = [];
  
  let i = 0;
  let pendingPunctuation = '';  // 存储待处理的标点
  
  while (i < text.length) {
    // 计算当前块的目标大小范围
    const minSize = chunkSize - flexibleRange;
    const maxSize = chunkSize + flexibleRange;
    
    // 优先尝试找到最接近目标字数的切分点
    let bestBreakPoint = i + chunkSize; // 默认在目标字数处切分
    let bestDistance = Number.MAX_VALUE;
    let hasPunctuation = false;
    let punctuation = '';
    
    // 在允许范围内寻找最佳切分点
    for (let j = i + minSize; j <= Math.min(i + maxSize, text.length); j++) {
      // 如果找到标点，计算与目标字数的距离
      if (PUNCTUATION_REGEX.test(text[j])) {
        const distance = Math.abs((j - i) - chunkSize); // 不包含标点的距离
        // 如果这个切分点更接近目标字数，更新最佳切分点
        if (distance < bestDistance) {
          bestDistance = distance;
          bestBreakPoint = j;
          hasPunctuation = true;
          punctuation = text[j];
        }
      }
    }
    
    // 如果没找到合适的标点，但当前位置已经超过最小长度
    if (bestBreakPoint === i + chunkSize && i + minSize < text.length) {
      // 向后看一下是否有标点
      for (let j = bestBreakPoint; j < Math.min(bestBreakPoint + 2, text.length); j++) {
        if (PUNCTUATION_REGEX.test(text[j])) {
          bestBreakPoint = j;
          hasPunctuation = true;
          punctuation = text[j];
          break;
        }
      }
    }
    
    // 如果剩余文本长度小于最小长度，直接合并到上一块
    if (text.length - i < minSize && chunks.length > 0) {
      const lastChunk = chunks.pop()!;
      const remainingText = text.slice(i);
      // 检查最后一个字符是否是标点
      const lastChar = remainingText[remainingText.length - 1];
      if (PUNCTUATION_REGEX.test(lastChar)) {
        chunks.push(lastChunk + remainingText.slice(0, -1) + (shouldHidePunctuation ? '' : lastChar));
      } else {
        chunks.push(lastChunk + remainingText);
      }
      break;
    }
    
    // 截取文本块
    let chunk = text.slice(i, bestBreakPoint);
    
    // 处理标点
    if (hasPunctuation) {
      if (!shouldHidePunctuation) {
        chunk += punctuation;
      }
      bestBreakPoint++; // 跳过标点
    }
    
    // 添加之前存储的标点（如果有且需要显示）
    if (pendingPunctuation && !shouldHidePunctuation) {
      chunk = pendingPunctuation + chunk;
    }
    
    chunks.push(chunk);
    
    // 移动指针
    i = bestBreakPoint;
  }
  
  return chunks;
} 
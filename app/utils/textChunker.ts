interface ChunkOptions {
  chunkSize: number;
  sentenceBreak: boolean;
  flexibleRange?: number;  // 字数浮动范围，默认为1个字
}

// 标点符号正则
const PUNCTUATION_REGEX = /[。，、；：？！,.;:?!]/;

export function chunkText(text: string, options: ChunkOptions): string[] {
  const { chunkSize, sentenceBreak, flexibleRange = 1 } = options;
  const chunks: string[] = [];
  
  let i = 0;
  
  while (i < text.length) {
    // 计算当前块的目标大小范围
    const minSize = chunkSize - flexibleRange;
    const maxSize = chunkSize + flexibleRange;
    
    // 优先尝试找到最接近目标字数的切分点
    let bestBreakPoint = i + chunkSize; // 默认在目标字数处切分
    let bestDistance = Number.MAX_VALUE;
    
    // 在允许范围内寻找最佳切分点
    for (let j = i + minSize; j <= Math.min(i + maxSize, text.length); j++) {
      // 如果找到标点，计算与目标字数的距离
      if (PUNCTUATION_REGEX.test(text[j])) {
        const distance = Math.abs((j + 1 - i) - chunkSize);
        // 如果这个切分点更接近目标字数，更新最佳切分点
        if (distance < bestDistance) {
          bestDistance = distance;
          bestBreakPoint = j + 1; // 包含标点符号
        }
      }
    }
    
    // 如果没找到合适的标点，但当前位置已经超过最小长度
    if (bestBreakPoint === i + chunkSize && i + minSize < text.length) {
      // 向后看一下是否有标点
      for (let j = bestBreakPoint; j < Math.min(bestBreakPoint + 2, text.length); j++) {
        if (PUNCTUATION_REGEX.test(text[j])) {
          bestBreakPoint = j + 1;
          break;
        }
      }
    }
    
    // 如果剩余文本长度小于最小长度，直接合并到上一块
    if (text.length - i < minSize && chunks.length > 0) {
      const lastChunk = chunks.pop()!;
      chunks.push(lastChunk + text.slice(i));
      break;
    }
    
    // 截取文本块
    const chunk = text.slice(i, bestBreakPoint);
    chunks.push(chunk);
    
    // 移动指针
    i = bestBreakPoint;
  }
  
  return chunks;
} 
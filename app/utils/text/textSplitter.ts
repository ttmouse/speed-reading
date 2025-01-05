interface SplitOptions {
  skipStopwords?: boolean;
  stopwords?: string[];
}

/**
 * 将文本分割成固定大小的块
 */
export function splitIntoChunks(text: string, chunkSize: number, options: SplitOptions = {}): string[] {
  if (!text) return [];

  const { skipStopwords = false, stopwords = [] } = options;

  // 首先按换行符分割文本，保留换行符
  const lines = text.split(/(\n)/);
  const chunks: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 如果是换行符，直接添加
    if (line === '\n') {
      chunks.push(line);
      continue;
    }
    
    // 如果是空行，跳过
    if (!line.trim()) {
      continue;
    }
    
    // 处理普通文本行
    let currentChunk = '';
    let currentLength = 0;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      currentChunk += char;
      currentLength++;
      
      // 当达到指定长度时
      if (currentLength === chunkSize) {
        // 检查下一个字符是否存在
        const nextChar = line[j + 1];
        if (nextChar) {
          // 如果剩余字符不多（少于 chunkSize 的一半），就合并到当前组
          let remainingLength = 0;
          let k = j + 1;
          while (k < line.length) {
            remainingLength++;
            k++;
          }
          
          if (remainingLength <= chunkSize / 2) {
            // 继续读取剩余字符
            while (j + 1 < line.length) {
              j++;
              currentChunk += line[j];
            }
          }
        }
        
        chunks.push(currentChunk);
        currentChunk = '';
        currentLength = 0;
      }
    }
    
    // 处理行末剩余的文本
    if (currentChunk) {
      chunks.push(currentChunk);
    }
  }

  return chunks;
} 
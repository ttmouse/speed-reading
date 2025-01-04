export function splitTextIntoChunks(text: string, chunkSize: number): string[] {
  if (!text) return [];

  const chunks: string[] = [];
  let currentChunk = '';
  let currentLength = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    currentChunk += char;
    currentLength++;

    // 如果是换行符，直接作为一个组
    if (char === '\n') {
      chunks.push(currentChunk);
      currentChunk = '';
      currentLength = 0;
      continue;
    }

    // 当达到指定长度时
    if (currentLength === chunkSize) {
      // 检查下一个字符是否存在且不是换行符
      const nextChar = text[i + 1];
      if (nextChar && nextChar !== '\n') {
        // 如果剩余字符不多（少于 chunkSize 的一半），就合并到当前组
        let remainingLength = 0;
        let j = i + 1;
        while (j < text.length && text[j] !== '\n') {
          remainingLength++;
          j++;
        }
        
        if (remainingLength <= chunkSize / 2) {
          // 继续读取剩余字符
          while (i + 1 < text.length && text[i + 1] !== '\n') {
            i++;
            currentChunk += text[i];
          }
        }
      }
      
      chunks.push(currentChunk);
      currentChunk = '';
      currentLength = 0;
    }
  }

  // 处理最后剩余的文本
  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
} 
interface TextProcessingOptions {
  skipStopwords: boolean;
  stopwords: string[];
}

/**
 * 将文本按照指定大小分组
 * @param text 要分组的文本
 * @param size 每组的字符数
 * @param options 分组选项
 * @returns 分组后的文本数组
 */
export function splitTextIntoChunks(text: string, size: number, options: TextProcessingOptions): string[] {
  const chunks: string[] = [];
  let current = '';
  let chars = Array.from(text); // 将文本拆分为字符数组
  
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    
    // 跳过空白字符
    if (char.trim() === '') continue;
    
    // 跳过停用词
    if (options.skipStopwords && options.stopwords.includes(char)) continue;
    
    current += char;
    
    // 检查是否需要分组
    if (current.length === size) {
      chunks.push(current);
      current = '';
    }
  }
  
  // 如果还有剩余字符，直接作为最后一组
  if (current) {
    chunks.push(current);
  }
  
  return chunks;
} 
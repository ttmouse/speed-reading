/**
 * 文本格式化工具
 */

interface TextBlock {
  text: string;
  index: number;
  isHighlighted: boolean;
}

/**
 * 将文本块重组为原始格式的文本
 */
export function reconstructText(chunks: string[]): string {
  return chunks.join('');
}

/**
 * 构建字符位置到文本块的映射
 */
export function buildCharacterMap(chunks: string[]): { [charIndex: number]: number } {
  const charPositions: { [key: number]: number } = {};
  let currentCharIndex = 0;

  chunks.forEach((chunk, chunkIndex) => {
    for (let i = 0; i < chunk.length; i++) {
      charPositions[currentCharIndex] = chunkIndex;
      currentCharIndex++;
    }
  });

  return charPositions;
}

/**
 * 计算行在原始文本中的起始位置
 */
export function calculateLineStart(lines: string[], currentLine: number): number {
  return lines
    .slice(0, currentLine)
    .join('\n')
    .length + (currentLine > 0 ? 1 : 0);
}

/**
 * 将文本分割成页
 */
export function splitIntoPages(lines: string[], pageSize: number): string[][] {
  const pages: string[][] = [];
  for (let i = 0; i < lines.length; i += pageSize) {
    const page = lines.slice(i, i + pageSize);
    // 补充空行到指定行数
    while (page.length < pageSize) {
      page.push('');
    }
    pages.push(page);
  }
  return pages;
} 
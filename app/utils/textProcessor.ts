export interface TextBlock {
  text: string;
  isPartial: boolean;  // 是否是不完整块
}

interface TextProcessorOptions {
  chunkSize: number;     // 每块字数
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

  /**
   * 将文本分割成块
   */
  processText(text: string): TextBlock[] {
    const { chunkSize } = this.options;
    const blocks: TextBlock[] = [];
    let currentPosition = 0;

    while (currentPosition < text.length) {
      const blockSize = Math.min(chunkSize, text.length - currentPosition);
      const blockText = text.slice(currentPosition, currentPosition + blockSize);
      blocks.push({
        text: blockText,
        isPartial: blockSize < chunkSize
      });
      currentPosition += blockSize;
    }

    return blocks;
  }
} 
interface TextPosition {
  start: number;
  end: number;
  index: number;
}

interface HighlightInfo {
  text: string;
  isHighlighted: boolean;
  start: number;
  end: number;
}

export interface TextHighlighter {
  // 构建字符位置映射
  buildCharacterMap(chunks: string[]): { [key: number]: number };
  
  // 获取行高亮信息
  getLineHighlights(
    line: string,
    lineStartPosition: number,
    charPositions: { [key: number]: number },
    currentPosition: number
  ): HighlightInfo[];
}

class DefaultTextHighlighter implements TextHighlighter {
  buildCharacterMap(chunks: string[]): { [key: number]: number } {
    let charPositions: { [key: number]: number } = {};
    let currentCharIndex = 0;
    
    chunks.forEach((chunk, chunkIndex) => {
      for (let i = 0; i < chunk.length; i++) {
        charPositions[currentCharIndex] = chunkIndex;
        currentCharIndex++;
      }
    });
    
    return charPositions;
  }

  getLineHighlights(
    line: string,
    lineStartPosition: number,
    charPositions: { [key: number]: number },
    currentPosition: number
  ): HighlightInfo[] {
    return line.split('').map((char, charIdx) => {
      const charGlobalIndex = lineStartPosition + charIdx;
      const chunkIndex = charPositions[charGlobalIndex];
      
      return {
        text: char,
        isHighlighted: chunkIndex !== undefined && chunkIndex <= currentPosition,
        start: charIdx,
        end: charIdx + 1
      };
    });
  }
}

export const textHighlighter = new DefaultTextHighlighter(); 
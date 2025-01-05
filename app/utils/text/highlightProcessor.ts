import { buildCharacterMap, calculateLineStart } from './textFormatter';

interface HighlightInfo {
  isHighlighted: boolean;
  color: string;
}

/**
 * 计算字符的高亮状态
 */
export function getCharacterHighlight(
  char: string,
  charIndex: number,
  charPositions: { [key: number]: number },
  currentPosition: number,
  highlightColor: string,
  dimmedColor: string
): HighlightInfo {
  const chunkIndex = charPositions[charIndex];
  return {
    isHighlighted: chunkIndex !== undefined && chunkIndex <= currentPosition,
    color: chunkIndex !== undefined && chunkIndex <= currentPosition ? highlightColor : dimmedColor
  };
}

/**
 * 处理一行文本的高亮
 */
export function processLineHighlight(
  line: string,
  lineIndex: number,
  startLine: number,
  lines: string[],
  chunks: string[],
  currentPosition: number,
  highlightColor: string,
  dimmedColor: string
): Array<{ char: string; highlight: HighlightInfo }> {
  const charPositions = buildCharacterMap(chunks);
  const lineStartInOriginal = calculateLineStart(lines, startLine + lineIndex);

  return line.split('').map((char, charIdx) => {
    const charGlobalIndex = lineStartInOriginal + charIdx;
    return {
      char,
      highlight: getCharacterHighlight(
        char,
        charGlobalIndex,
        charPositions,
        currentPosition,
        highlightColor,
        dimmedColor
      )
    };
  });
} 
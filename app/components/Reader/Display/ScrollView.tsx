'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ScrollViewProps {
  text: string;
  chunks: string[];
  settings: {
    chunkSize: number;
    fontSize: number;
    lineSpacing: number;
    contextLines: number;
    dimmedTextColor: string;
    fontColor: string;
    hideEndPunctuation: boolean;
  };
  currentPosition: number;
}

// 处理标点符号隐藏
const processDisplay = (text: string, hideEndPunctuation: boolean): string => {
  if (!hideEndPunctuation) return text;
  return text.replace(/[。，、；：？！,.;:?!]$/, '');
};

export function ScrollView({ text, chunks, settings, currentPosition }: ScrollViewProps) {
  const lineHeight = 40;
  const totalLines = 1 + (settings.contextLines * 2);
  const containerHeight = lineHeight * totalLines;

  // 计算当前块的内容和位置
  const currentChunk = chunks[currentPosition] || '';
  const previousChunks = chunks.slice(0, currentPosition).join('');
  const currentChunkStart = previousChunks.length;
  const currentChunkEnd = currentChunkStart + currentChunk.length;

  // 将文本分成行
  const lines = text.split('\n');
  
  // 计算当前行
  let currentLine = 0;
  let accumulatedLength = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const lineLength = lines[i].length + (i > 0 ? 1 : 0); // 加上换行符的长度
    if (accumulatedLength <= currentChunkStart && (accumulatedLength + lineLength) > currentChunkStart) {
      currentLine = i;
      break;
    }
    accumulatedLength += lineLength;
  }

  // 获取上下文行
  const startLine = Math.max(0, currentLine - settings.contextLines);
  const endLine = Math.min(lines.length, currentLine + settings.contextLines + 1);
  const visibleLines = lines.slice(startLine, endLine);

  const getScrollY = (index: number) => {
    return -(index * lineHeight) + (containerHeight / 2) - (lineHeight / 2);
  };

  const containerVariants = {
    animate: {
      y: getScrollY(currentLine - startLine),
      transition: {
        type: "spring",
        stiffness: 200,  // 降低刚度，使动画更平滑
        damping: 25,     // 调整阻尼
        mass: 0.8,       // 添加质量参数
        restDelta: 0.5   // 添加静止阈值
      }
    }
  };

  const itemVariants = {
    animate: (idx: number) => {
      const absoluteLineIdx = startLine + idx;
      const lineStart = lines.slice(0, absoluteLineIdx).join('\n').length + (absoluteLineIdx > 0 ? 1 : 0);
      const lineEnd = lineStart + lines[absoluteLineIdx].length;
      const isCurrentLine = absoluteLineIdx === currentLine;
      const hasHighlight = lineStart < currentChunkEnd && lineEnd > currentChunkStart;

      return {
        opacity: isCurrentLine ? 1 : Math.max(0.3, 1 - Math.abs(idx - (currentLine - startLine)) * 0.2),
        color: hasHighlight ? settings.fontColor : settings.dimmedTextColor,
        scale: isCurrentLine ? 1 : 0.98,
        transition: {
          duration: 0.2,
          ease: "easeOut"
        }
      };
    }
  };

  return (
    <div 
      className="relative w-full overflow-hidden py-4"
      style={{ height: containerHeight }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute left-0 right-0 border-t border-b border-gray-200 opacity-10"
          style={{ 
            top: '50%',
            height: lineHeight,
            transform: 'translateY(-50%)'
          }}
        />
      </div>
      <motion.div
        className="absolute w-full"
        variants={containerVariants}
        animate="animate"
      >
        {visibleLines.map((line, idx) => {
          const absoluteLineIdx = startLine + idx;
          const lineStart = lines.slice(0, absoluteLineIdx).join('\n').length + (absoluteLineIdx > 0 ? 1 : 0);
          const lineEnd = lineStart + line.length;
          const hasHighlight = lineStart < currentChunkEnd && lineEnd > currentChunkStart;
          const highlightStart = Math.max(0, currentChunkStart - lineStart);
          const highlightEnd = Math.min(line.length, currentChunkEnd - lineStart);

          return (
            <motion.div
              key={idx}
              custom={idx}
              variants={itemVariants}
              animate="animate"
              className="flex items-center justify-center"
              style={{
                height: lineHeight,
                fontSize: settings.fontSize,
                lineHeight: `${settings.lineSpacing}em`,
              }}
            >
              {line ? (
                hasHighlight ? (
                  <>
                    <span style={{ color: settings.dimmedTextColor }}>
                      {line.slice(0, highlightStart)}
                    </span>
                    <span style={{ color: settings.fontColor }}>
                      {settings.hideEndPunctuation ? 
                        processDisplay(line.slice(highlightStart, highlightEnd), true) :
                        line.slice(highlightStart, highlightEnd)
                      }
                    </span>
                    <span style={{ color: settings.dimmedTextColor }}>
                      {line.slice(highlightEnd)}
                    </span>
                  </>
                ) : (
                  <span style={{ color: settings.dimmedTextColor }}>
                    {line}
                  </span>
                )
              ) : (
                <span>&nbsp;</span>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
} 
import React from 'react';
import { motion } from 'framer-motion';
import type { ReadingSettings } from '@/app/types';
import { textHighlighter } from '@/app/utils/text/textHighlighter';

interface PageViewProps {
  chunks: string[];
  currentPosition: number;
  dimmedTextColor: string;
  highlightColor: string;
  pageSize?: number;
  settings?: ReadingSettings;
}

export function PageView({
  chunks,
  currentPosition,
  dimmedTextColor,
  highlightColor,
  pageSize = 5,
  settings
}: PageViewProps) {
  if (!chunks || chunks.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <span style={{ color: dimmedTextColor }}>准备开始...</span>
      </div>
    );
  }

  // 1. 首先，将文本重建为原始格式
  const originalText = chunks.join('');
  const lines = originalText.split('\n');
  
  // 2. 计算分页参数
  const actualPageSize = settings?.pageSize || pageSize;
  const totalPages = Math.ceil(lines.length / actualPageSize);
  const currentPage = Math.min(
    Math.floor(currentPosition / chunks.length * totalPages),
    totalPages - 1
  );
  
  // 3. 获取当前页的行
  const startLine = currentPage * actualPageSize;
  const currentPageLines = lines.slice(startLine, startLine + actualPageSize);
  
  // 4. 补充空行到指定行数
  while (currentPageLines.length < actualPageSize) {
    currentPageLines.push('');
  }

  // 5. 构建字符位置映射
  const charPositions = textHighlighter.buildCharacterMap(chunks);

  return (
    <div className="flex flex-col items-start justify-start w-full h-full border rounded-lg overflow-hidden">
      <div className="w-full h-full flex flex-col">
        <motion.div
          className="flex-1 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key={currentPage}
          transition={{ duration: 0.2 }}
        >
          {currentPageLines.map((line, lineIdx) => {
            // 找到这一行文本在原始文本中的起始位置
            const lineStartInOriginal = lines
              .slice(0, startLine + lineIdx)
              .join('\n')
              .length + (startLine + lineIdx > 0 ? 1 : 0);

            // 获取行高亮信息
            const highlights = textHighlighter.getLineHighlights(
              line,
              lineStartInOriginal,
              charPositions,
              currentPosition
            );

            return (
              <div
                key={lineIdx}
                className="flex-1 flex items-center px-4"
                style={{
                  minHeight: '40px',
                  fontFamily: 'LXGWWenKaiGB',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all'
                }}
              >
                {highlights.map((highlight, idx) => (
                  <span
                    key={idx}
                    style={{
                      color: highlight.isHighlighted ? highlightColor : dimmedTextColor,
                      transition: 'color 0.2s ease'
                    }}
                  >
                    {highlight.text}
                  </span>
                ))}
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
} 
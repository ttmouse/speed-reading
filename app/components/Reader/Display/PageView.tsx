'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

interface PageViewProps {
  text: string;
  settings: {
    chunkSize: number;      // 每组字数
    textAreaWidth: number;  // 容器宽度（像素）
    fontSize: number;       // 字体大小
    lineSpacing: number;    // 行间距
    pageSize?: number;      // 每页显示行数
    dimmedTextColor: string; // 未读文本颜色
    fontColor: string;      // 已读文本颜色
  };
  currentPosition: number;
}

const PageViewComponent: React.FC<PageViewProps> = ({
  text,
  settings,
  currentPosition
}) => {
  // 1. 首先将文本分成块
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += settings.chunkSize) {
    chunks.push(text.slice(i, i + settings.chunkSize));
  }

  // 2. 计算当前已读长度
  const readLength = chunks
    .slice(0, currentPosition + 1)
    .reduce((acc, chunk) => acc + chunk.length, 0);

  // 3. 将文本分成行
  const lines = text.split('\n');
  const pageSize = settings.pageSize || 5;

  // 4. 计算当前页
  let currentPage = 0;
  let accumulatedLength = 0;
  let startLine = 0;

  // 遍历行，找到包含当前阅读位置的页
  for (let i = 0; i < lines.length; i += pageSize) {
    const pageLines = lines.slice(i, i + pageSize);
    const pageLength = pageLines.join('\n').length + (pageLines.length > 1 ? pageLines.length - 1 : 0);
    
    if (accumulatedLength + pageLength > readLength) {
      currentPage = Math.floor(i / pageSize);
      startLine = i;
      break;
    }
    accumulatedLength += pageLength;
  }

  // 5. 获取当前页的行
  const currentPageLines = lines.slice(startLine, startLine + pageSize);
  
  // 6. 补充空行到指定行数
  while (currentPageLines.length < pageSize) {
    currentPageLines.push('');
  }

  // 基础容器样式
  const containerStyle = {
    width: `${settings.textAreaWidth}px`,
    margin: '0 auto',
    padding: '20px',
    textAlign: 'justify' as const,
    fontFamily: 'LXGWWenKaiGB'
  };

  return (
    <div className="w-full py-8 flex items-center justify-center">
      <div className="text-container" style={containerStyle}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key={currentPage}
          transition={{ duration: 0.2 }}
        >
          {currentPageLines.map((line, lineIdx) => {
            const absoluteLineIdx = startLine + lineIdx;
            const lineStart = lines.slice(0, absoluteLineIdx).join('\n').length + (absoluteLineIdx > 0 ? 1 : 0);
            const lineEnd = lineStart + line.length;
            
            // 判断这一行是否包含高亮部分
            const hasHighlight = lineStart < readLength && lineEnd > 0;
            
            // 计算行内高亮的范围
            const highlightEnd = Math.min(line.length, readLength - lineStart);

            return (
              <div
                key={lineIdx}
                style={{
                  fontSize: `${settings.fontSize}px`,
                  lineHeight: `${settings.lineSpacing + settings.fontSize}px`,
                  minHeight: `${settings.lineSpacing + settings.fontSize}px`,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all'
                }}
              >
                {line ? (
                  hasHighlight ? (
                    <>
                      <span style={{ color: settings.fontColor }}>
                        {line.slice(0, highlightEnd)}
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
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

// 使用dynamic导入并禁用SSR
export const PageView = dynamic(() => Promise.resolve(PageViewComponent), {
  ssr: false
}); 
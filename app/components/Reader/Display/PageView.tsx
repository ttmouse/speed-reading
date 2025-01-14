'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

interface PageViewProps {
  text: string;
  chunks: string[];
  settings: {
    chunkSize: number;
    textAreaWidth: number;
    fontSize: number;
    lineSpacing: number;
    pageSize: number;
    dimmedTextColor: string;
    fontColor: string;
    hideEndPunctuation: boolean;
    highlightSingleChunk: boolean;
  };
  currentPosition: number;
}

// 处理标点符号隐藏
const processDisplay = (text: string, hideEndPunctuation: boolean): string => {
  if (!hideEndPunctuation) return text;
  return text.replace(/[。，、；：？！,.;:?!]$/, '');
};

function PageViewComponent({ text, chunks, settings, currentPosition }: PageViewProps) {
  // 用于避免重复日志的 refs
  const debugInfoRef = React.useRef<string | null>(null);
  const lineInfoRefs = React.useRef<Record<string, string>>({});

  // 添加设置变更日志
  React.useEffect(() => {
    console.log('Settings changed:', {
      highlightSingleChunk: settings.highlightSingleChunk,
      currentPosition,
      chunksLength: chunks.length
    });
  }, [settings.highlightSingleChunk, currentPosition, chunks.length]);

  // 计算每个分组的起始位置
  const chunkPositions = React.useMemo(() => {
    const positions: number[] = [0];
    let pos = 0;
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      // 跳过空白字符
      if (chunk.trim()) {
        pos += chunk.length;
        positions.push(pos);
      }
    }
    
    return positions;
  }, [chunks]);

  // 计算当前分组的范围
  const { currentChunkStart, currentChunkEnd } = React.useMemo(() => {
    const start = chunkPositions[currentPosition] || 0;
    const end = chunkPositions[currentPosition + 1] || start;
    
    // 添加更详细的调试信息
    const debugInfo = {
      start,
      end,
      currentPosition,
      chunk: chunks[currentPosition],
      chunkLength: chunks[currentPosition]?.length,
      totalChunks: chunks.length,
      positions: chunkPositions,
      highlightSingleChunk: settings.highlightSingleChunk
    };
    
    // 避免重复日志
    const debugString = JSON.stringify(debugInfo);
    if (debugInfoRef.current !== debugString) {
      console.log('Chunk range:', debugInfo);
      debugInfoRef.current = debugString;
    }
    
    return { currentChunkStart: start, currentChunkEnd: end };
  }, [chunkPositions, currentPosition, chunks, settings.highlightSingleChunk]);

  // 将文本分成行
  const lines = React.useMemo(() => {
    // 先按换行符分割
    const rawLines = text.split('\n');
    // 过滤掉空行，并确保每行都有内容
    return rawLines.map(line => line || ' ');
  }, [text]);

  const pageSize = settings.pageSize || 5;

  // 计算每行的起始位置
  const linePositions = React.useMemo(() => {
    const positions: number[] = [0];
    let pos = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // 只计算实际内容的长度
      if (line.trim()) {
        pos += line.trim().length;
      }
      // 每行结束后加入位置标记
      positions.push(pos);
    }
    
    return positions;
  }, [lines]);

  // 计算当前页
  const { currentPage, startLine, currentPageLines } = React.useMemo(() => {
    let page = 0;
    let start = 0;

    // 找到包含当前分组的页
    for (let i = 0; i < lines.length; i += pageSize) {
      const pageEndLine = Math.min(i + pageSize, lines.length);
      const pageStartPos = linePositions[i];
      const pageEndPos = linePositions[pageEndLine];
      
      if (pageStartPos <= currentChunkStart && currentChunkStart < pageEndPos) {
        page = Math.floor(i / pageSize);
        start = i;
        break;
      }
    }

    // 获取当前页的行
    const pageLines = lines.slice(start, start + pageSize);
    
    // 补充空行到指定行数
    while (pageLines.length < pageSize) {
      pageLines.push('');
    }

    return { currentPage: page, startLine: start, currentPageLines: pageLines };
  }, [lines, pageSize, linePositions, currentChunkStart]);

  // 基础容器样式
  const containerStyle = React.useMemo(() => ({
    width: `${settings.textAreaWidth}px`,
    margin: '0 auto',
    padding: '20px',
    textAlign: 'justify' as const,
    fontFamily: 'LXGWWenKaiGB'
  }), [settings.textAreaWidth]);

  // 渲染行
  const renderLine = React.useCallback((line: string, lineIdx: number) => {
    const absoluteLineIdx = startLine + lineIdx;
    const lineStart = linePositions[absoluteLineIdx];
    const lineEnd = linePositions[absoluteLineIdx + 1];

    // 判断这一行是否需要高亮
    let shouldHighlight = false;
    let highlightStart = 0;
    let highlightEnd = line.length;
    let isCurrentChunk = false;

    // 添加调试信息（避免重复）
    const lineInfo = {
      lineIdx,
      absoluteLineIdx,
      lineStart,
      lineEnd,
      currentChunkStart,
      currentChunkEnd,
      lineLength: line.length,
      highlightSingleChunk: settings.highlightSingleChunk
    };

    const lineInfoString = JSON.stringify(lineInfo);
    if (lineInfoRefs.current[lineIdx] !== lineInfoString) {
      console.log('Line rendering:', lineInfo);
      lineInfoRefs.current[lineIdx] = lineInfoString;
    }

    if (settings.highlightSingleChunk) {
      // 仅高亮当前分组
      // 1. 检查是否完全在当前分组内
      const isFullyInCurrentChunk = lineStart >= currentChunkStart && lineEnd <= currentChunkEnd;
      // 2. 检查是否与当前分组有部分重叠
      const isPartiallyInCurrentChunk = 
        (lineStart < currentChunkEnd && lineStart >= currentChunkStart) || 
        (lineEnd > currentChunkStart && lineEnd <= currentChunkEnd);
      
      isCurrentChunk = isFullyInCurrentChunk || isPartiallyInCurrentChunk;
      shouldHighlight = isCurrentChunk;

      if (shouldHighlight) {
        // 计算高亮范围
        if (isFullyInCurrentChunk) {
          // 整行都在当前分组内
          highlightStart = 0;
          highlightEnd = line.length;
        } else {
          // 部分重叠，需要精确计算高亮范围
          highlightStart = Math.max(0, currentChunkStart - lineStart);
          highlightEnd = Math.min(line.length, currentChunkEnd - lineStart);
        }

        // 确保高亮范围有效
        highlightStart = Math.max(0, Math.min(highlightStart, line.length));
        highlightEnd = Math.max(highlightStart, Math.min(highlightEnd, line.length));
      }

      // 添加当前分组高亮调试信息（避免重复）
      const highlightInfo = {
        lineIdx,
        lineStart,
        lineEnd,
        currentChunkStart,
        currentChunkEnd,
        isFullyInCurrentChunk,
        isPartiallyInCurrentChunk,
        isCurrentChunk,
        shouldHighlight,
        highlightStart,
        highlightEnd,
        highlightedText: line.slice(highlightStart, highlightEnd),
        fullLine: line
      };

      const highlightInfoString = JSON.stringify(highlightInfo);
      const highlightKey = `highlight_${lineIdx}`;
      if (lineInfoRefs.current[highlightKey] !== highlightInfoString) {
        console.log('Single chunk highlight:', highlightInfo);
        lineInfoRefs.current[highlightKey] = highlightInfoString;
      }
    } else {
      // 高亮所有已读文字
      const isInReadRange = lineStart < currentChunkEnd;
      shouldHighlight = isInReadRange;
      if (shouldHighlight) {
        highlightStart = 0;
        highlightEnd = Math.min(line.length, currentChunkEnd - lineStart);
      }
    }

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
          shouldHighlight ? (
            <>
              {highlightStart > 0 && (
                <span style={{ 
                  color: settings.dimmedTextColor, 
                  opacity: settings.highlightSingleChunk ? 0.1 : 0.3 
                }}>
                  {line.slice(0, highlightStart)}
                </span>
              )}
              <span style={{ 
                color: settings.fontColor,
                opacity: 1,
                transition: 'all 0.2s ease-out',
                backgroundColor: settings.highlightSingleChunk && isCurrentChunk ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
              }}>
                {settings.hideEndPunctuation ? 
                  processDisplay(line.slice(highlightStart, highlightEnd), true) :
                  line.slice(highlightStart, highlightEnd)
                }
              </span>
              {highlightEnd < line.length && (
                <span style={{ 
                  color: settings.dimmedTextColor, 
                  opacity: settings.highlightSingleChunk ? 0.1 : 0.3 
                }}>
                  {line.slice(highlightEnd)}
                </span>
              )}
            </>
          ) : (
            <span style={{ 
              color: settings.dimmedTextColor, 
              opacity: settings.highlightSingleChunk ? 0.1 : 0.3 
            }}>
              {line}
            </span>
          )
        ) : (
          <span>&nbsp;</span>
        )}
      </div>
    );
  }, [settings, currentChunkStart, currentChunkEnd, linePositions, startLine]);

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
          {currentPageLines.map(renderLine)}
        </motion.div>
      </div>
    </div>
  );
}

// 使用dynamic导入并禁用SSR
export const PageView = dynamic(() => Promise.resolve(PageViewComponent), {
  ssr: false
}); 
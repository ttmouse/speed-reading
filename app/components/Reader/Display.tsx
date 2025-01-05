import React from 'react';
import { motion } from 'framer-motion';
import type { ReadingSettings, ReadingState, HighlightStyle } from '@/app/types';
import { ProgressBar } from './ProgressBar';

interface HighlightDisplayProps {
  chunks: string[];
  currentPosition: number;
  contextLines: number;
  dimmedTextColor: string;
  highlightColor: string;
  highlightStyle: HighlightStyle;
  pageSize?: number;
}

// 滚动式高亮显示
function ScrollHighlight({ 
  chunks, 
  currentPosition, 
  contextLines, 
  dimmedTextColor,
  highlightColor 
}: Omit<HighlightDisplayProps, 'highlightStyle' | 'pageSize'>) {
  const currentChunk = Math.min(currentPosition, chunks.length - 1);
  const lineHeight = 40;
  const totalLines = 1 + (contextLines * 2);
  const containerHeight = lineHeight * totalLines;

  const getScrollY = (index: number) => {
    return -(index * lineHeight) + (containerHeight - lineHeight) / 2;
  };

  const containerVariants = {
    animate: {
      y: getScrollY(currentChunk),
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        mass: 0.8,
        restDelta: 0.5
      }
    }
  };

  const itemVariants = {
    animate: (idx: number) => ({
      opacity: Math.max(0.2, 1 - Math.abs(idx - currentChunk) * 0.25),
      color: idx === currentChunk ? highlightColor : dimmedTextColor,
      transition: {
        duration: 0.15,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative">
      <div 
        className="absolute left-0 right-0 h-[40px] border-t border-b border-gray-200 opacity-10 pointer-events-none"
        style={{ top: "50%", transform: "translateY(-50%)" }}
      />
      <div 
        className="w-full relative overflow-hidden"
        style={{ height: `${containerHeight}px` }}
      >
        <motion.div
          className="flex flex-col items-center w-full absolute left-0"
          variants={containerVariants}
          animate="animate"
        >
          {chunks.map((chunk, idx) => (
            <motion.div
              key={idx}
              className={`text-center py-2 w-full h-[40px] flex items-center justify-center`}
              custom={idx}
              variants={itemVariants}
              animate="animate"
            >
              {chunk}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// 分页式高亮显示
function PageHighlight({
  chunks,
  currentPosition,
  dimmedTextColor,
  highlightColor,
  pageSize = 5,
  settings
}: Omit<HighlightDisplayProps, 'highlightStyle' | 'contextLines'> & { settings?: ReadingSettings }) {
  if (!chunks || chunks.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <span style={{ color: dimmedTextColor }}>准备开始...</span>
      </div>
    );
  }

  // 1. 计算当前页
  const actualPageSize = settings?.pageSize || pageSize;
  const chunkSize = settings?.chunkSize || 3; // 每行显示的分组数
  const chunksPerPage = actualPageSize * chunkSize;
  const currentPage = Math.floor(currentPosition / chunksPerPage);
  
  // 2. 获取当前页的文本块
  const startChunkIndex = currentPage * chunksPerPage;
  const pageChunks = chunks.slice(startChunkIndex, startChunkIndex + chunksPerPage);
  
  // 3. 将文本块分组到行
  const lines: string[][] = [];
  for (let i = 0; i < pageChunks.length; i += chunkSize) {
    lines.push(pageChunks.slice(i, i + chunkSize));
  }
  
  // 4. 补充空行到指定行数
  while (lines.length < actualPageSize) {
    lines.push(Array(chunkSize).fill(''));
  }

  // 5. 计算当前页内的高亮位置
  const currentChunkInPage = currentPosition % chunksPerPage;

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
          {lines.map((lineChunks, lineIdx) => (
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
              {lineChunks.map((chunk, chunkIdx) => {
                const chunkPosition = lineIdx * chunkSize + chunkIdx;
                return (
                  <span
                    key={chunkIdx}
                    className="mx-1"
                    style={{
                      color: chunkPosition <= currentChunkInPage ? highlightColor : dimmedTextColor,
                      transition: 'color 0.2s ease'
                    }}
                  >
                    {chunk}
                  </span>
                );
              })}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function HighlightDisplay(props: HighlightDisplayProps & { settings: ReadingSettings }) {
  if (props.highlightStyle === 'page') {
    return <PageHighlight {...props} />;
  }
  return <ScrollHighlight {...props} />;
}

interface DisplayProps {
  settings: ReadingSettings;
  state: ReadingState;
  display: string;
}

export function Display({ settings, state, display }: DisplayProps) {
  const lineHeight = 40;
  const totalLines = settings.highlightStyle === 'page' 
    ? settings.pageSize || 5
    : 1 + (settings.contextLines * 2);
  const containerHeight = lineHeight * totalLines;

  const handleProgressChange = (progress: number) => {
    const newPosition = Math.floor(progress * state.chunks.length);
    if (state.setCurrentPosition) {
      state.setCurrentPosition(newPosition);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div 
        className="text-display w-full flex flex-col border rounded-lg mb-8 overflow-hidden"
        style={{
          minHeight: `${containerHeight}px`,
          fontSize: `${settings.fontSize}px`,
          color: settings.fontColor,
          backgroundColor: settings.bgColor
        }}
      >
        {settings.readingMode === 'highlight' ? (
          <HighlightDisplay
            chunks={state.chunks}
            currentPosition={state.currentPosition}
            contextLines={settings.contextLines}
            dimmedTextColor={settings.dimmedTextColor}
            highlightColor={settings.fontColor}
            highlightStyle={settings.highlightStyle}
            pageSize={settings.pageSize}
            settings={settings}
          />
        ) : (
          display
        )}
      </div>
      <div className="w-full px-4">
        <ProgressBar 
          progress={state.currentPosition / Math.max(1, state.chunks.length - 1)}
          onProgressChange={handleProgressChange}
          isPaused={state.isPaused}
        />
      </div>
    </div>
  );
} 
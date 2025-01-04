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

  const lineHeight = 40;
  const actualPageSize = settings?.pageSize || pageSize;
  const containerHeight = lineHeight * actualPageSize;

  // 将文本块合并成完整文本，并按换行符分割成行
  const allText = chunks.join('');
  const allLines = allText.split('\n').filter(line => line.trim() !== '');
  
  // 计算当前页
  const totalPages = Math.ceil(allLines.length / actualPageSize);
  const currentPage = Math.floor(currentPosition / chunks.length * totalPages);
  
  // 获取当前页的行范围
  const startLineIndex = currentPage * actualPageSize;
  const endLineIndex = Math.min(startLineIndex + actualPageSize, allLines.length);
  const currentPageLines = allLines.slice(startLineIndex, endLineIndex);
  
  // 计算当前页对应的块范围
  const startChunkIndex = Math.floor(startLineIndex / allLines.length * chunks.length);
  const endChunkIndex = Math.min(Math.ceil(endLineIndex / allLines.length * chunks.length), chunks.length);
  const currentPageChunks = chunks.slice(startChunkIndex, endChunkIndex);
  
  // 计算页内当前位置
  const currentInPagePosition = currentPosition - startChunkIndex;

  // 将当前页的文本块组织成原文格式，并添加高亮效果
  const text = currentPageChunks.map((chunk, idx) => {
    const isHighlighted = idx <= currentInPagePosition;
    return {
      text: chunk,
      highlighted: isHighlighted
    };
  });

  // 将所有文本合并，保持原格式
  const combinedText = text.reduce((acc, curr) => acc + curr.text, '');

  // 创建高亮效果的标记点
  const highlights = text.map((item, idx) => ({
    start: text.slice(0, idx).reduce((acc, curr) => acc + curr.text.length, 0),
    end: text.slice(0, idx + 1).reduce((acc, curr) => acc + curr.text.length, 0),
    highlighted: item.highlighted
  }));

  return (
    <div className="flex flex-col items-start justify-start w-full h-full">
      <div 
        className="w-full relative overflow-hidden"
        style={{
          maxHeight: `${containerHeight}px`,
          overflow: 'hidden'
        }}
      >
        <motion.div
          className="w-full h-full"
          initial={{ y: containerHeight }}
          animate={{ y: 0 }}
          exit={{ y: -containerHeight }}
          key={currentPage}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        >
          <div className="px-4 whitespace-pre-wrap text-left">
            {highlights.map((highlight, idx) => {
              const textPart = combinedText.slice(highlight.start, highlight.end);
              return (
                <span
                  key={idx}
                  style={{
                    color: highlight.highlighted ? highlightColor : dimmedTextColor,
                    transition: 'color 0.2s ease',
                    fontFamily: 'LXGWWenKaiGB'
                  }}
                >
                  {textPart}
                </span>
              );
            })}
          </div>
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
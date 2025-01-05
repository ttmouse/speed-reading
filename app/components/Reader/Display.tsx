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

  // 构建带有位置信息的文本
  const textWithPositions = chunks.reduce((acc, chunk, index) => {
    return {
      text: acc.text + chunk,
      positions: [...acc.positions, {
        start: acc.text.length,
        end: acc.text.length + chunk.length,
        index
      }]
    };
  }, { text: '', positions: [] as Array<{ start: number; end: number; index: number }> });

  // 将文本按行分割，并过滤掉空行
  const allLines = textWithPositions.text.split('\n').filter(line => line.trim());
  
  // 计算分页相关的参数
  const totalPages = Math.ceil(allLines.length / actualPageSize);
  const currentPage = Math.min(
    Math.floor(currentPosition / chunks.length * totalPages),
    totalPages - 1
  );
  const startLine = currentPage * actualPageSize;
  const currentPageLines = allLines.slice(startLine, startLine + actualPageSize);

  // 补充空行到指定行数
  while (currentPageLines.length < actualPageSize) {
    currentPageLines.push('');
  }

  // 为每一行创建高亮信息
  const lineHighlights = currentPageLines.map(line => {
    if (!line) return [];
    
    const lineStart = textWithPositions.text.indexOf(line);
    const lineEnd = lineStart + line.length;
    
    // 找出这一行包含的所有词组
    const lineChunks = textWithPositions.positions.filter(pos => 
      (pos.start >= lineStart && pos.start < lineEnd) || 
      (pos.end > lineStart && pos.end <= lineEnd) ||
      (pos.start <= lineStart && pos.end >= lineEnd)
    );

    // 为每个词组创建高亮信息
    return lineChunks.map(chunk => ({
      text: textWithPositions.text.slice(
        Math.max(chunk.start, lineStart),
        Math.min(chunk.end, lineEnd)
      ),
      isHighlighted: chunk.index <= currentPosition,
      start: Math.max(chunk.start - lineStart, 0),
      end: Math.min(chunk.end - lineStart, line.length)
    }));
  });

  return (
    <div className="flex flex-col items-start justify-start w-full h-full">
      <div 
        className="w-full relative"
        style={{
          height: `${containerHeight}px`
        }}
      >
        <motion.div
          className="w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key={currentPage}
          transition={{
            duration: 0.2
          }}
        >
          <div className="px-4 whitespace-pre-wrap text-left h-full flex flex-col">
            {currentPageLines.map((line, lineIdx) => (
              <div
                key={lineIdx}
                className="flex-1 flex items-center"
                style={{
                  color: dimmedTextColor,
                  fontFamily: 'LXGWWenKaiGB'
                }}
              >
                {line ? (
                  lineHighlights[lineIdx].length === 0 ? (
                    line
                  ) : (
                    <>
                      {line.split('').map((char, charIdx) => {
                        const highlight = lineHighlights[lineIdx].find(h => 
                          charIdx >= h.start && charIdx < h.end
                        );
                        return (
                          <span
                            key={charIdx}
                            style={{
                              color: highlight?.isHighlighted ? highlightColor : dimmedTextColor,
                              transition: 'color 0.2s ease'
                            }}
                          >
                            {char}
                          </span>
                        );
                      })}
                    </>
                  )
                ) : null}
              </div>
            ))}
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
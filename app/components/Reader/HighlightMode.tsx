import React from 'react';
import { ReadingSettings } from 'app/types';
import { motion, AnimatePresence } from 'framer-motion';

interface HighlightModeProps {
  chunks: string[];
  currentIndex: number;
  settings: ReadingSettings;
  isPlaying: boolean;
}

export function HighlightMode({ chunks, currentIndex, settings, isPlaying }: HighlightModeProps) {
  // 默认显示5行，包括高亮行和上下文
  const contextLines = settings.contextLines || 2; // 上下各2行
  const totalLines = contextLines * 2 + 1; // 总共5行
  const start = Math.max(0, currentIndex - contextLines);
  const end = Math.min(chunks.length, currentIndex + contextLines + 1);
  const visibleChunks = chunks.slice(start, end);

  // 计算容器高度，确保显示5行
  const lineHeight = settings.fontSize * settings.lineHeight;
  const containerHeight = lineHeight * totalLines + settings.fontSize * 0.4 * (totalLines - 1);

  return (
    <div 
      className="relative flex flex-col items-center justify-center bg-black"
      style={{ 
        height: `${containerHeight}px`,
        minHeight: `${containerHeight}px`
      }}
    >
      <AnimatePresence mode="popLayout">
        {visibleChunks.map((chunk, idx) => {
          const isHighlighted = idx === currentIndex - start;
          const distance = Math.abs(idx - (currentIndex - start));
          const opacity = isHighlighted ? 1 : Math.max(0.2, 1 - distance * 0.3);

          return (
            <motion.div
              key={`${currentIndex}-${idx}`}
              className={`text-center ${isHighlighted ? 'text-white' : 'text-gray-500'}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity,
                scale: isHighlighted ? 1 : 0.95,
                y: 0
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                duration: 0.3,
                ease: 'easeOut'
              }}
              style={{
                fontSize: `${settings.fontSize}px`,
                lineHeight: `${settings.lineHeight}`,
                fontFamily: settings.fontFamily,
                color: isHighlighted ? settings.highlightColor : settings.dimmedTextColor,
                height: `${lineHeight}px`,
                margin: `${settings.fontSize * 0.2}px 0`
              }}
            >
              {chunk}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
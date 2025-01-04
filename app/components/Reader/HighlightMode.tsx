import React from 'react';
import { ReadingSettings } from '@/app/types';
import { motion, AnimatePresence } from 'framer-motion';

interface HighlightModeProps {
  chunks: string[];
  currentIndex: number;
  settings: ReadingSettings;
  isPlaying: boolean;
}

export function HighlightMode({ chunks, currentIndex, settings, isPlaying }: HighlightModeProps) {
  // 计算需要显示的块范围
  const contextLines = settings.contextLines;
  const start = Math.max(0, currentIndex - contextLines);
  const end = Math.min(chunks.length, currentIndex + contextLines + 1);
  const visibleChunks = chunks.slice(start, end);

  return (
    <div className="relative h-[70vh] flex flex-col items-center justify-center bg-black">
      <AnimatePresence mode="popLayout">
        {visibleChunks.map((chunk, idx) => {
          const isHighlighted = idx === currentIndex - start;
          const distance = Math.abs(idx - (currentIndex - start));
          const opacity = isHighlighted ? 1 : Math.max(0.2, 1 - distance * 0.3);

          return (
            <motion.div
              key={`${currentIndex}-${idx}`}
              className={`text-center py-2 ${isHighlighted ? 'text-white' : 'text-gray-500'}`}
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
                fontSize: settings.fontSize,
                lineHeight: settings.lineHeight,
                fontFamily: settings.fontFamily,
                color: isHighlighted ? settings.highlightColor : settings.dimmedTextColor
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
import React from 'react';
import { motion } from 'framer-motion';
import type { ReadingSettings } from '@/app/types';

interface ScrollViewProps {
  chunks: string[];
  currentPosition: number;
  contextLines: number;
  dimmedTextColor: string;
  highlightColor: string;
  settings?: ReadingSettings;
}

export function ScrollView({ 
  chunks, 
  currentPosition, 
  contextLines, 
  dimmedTextColor,
  highlightColor 
}: ScrollViewProps) {
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
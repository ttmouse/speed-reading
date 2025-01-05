'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ScrollViewProps {
  text: string;
  settings: {
    chunkSize: number;      // 每组字数
    fontSize: number;       // 字体大小
    lineSpacing: number;    // 行间距
    contextLines: number;   // 上下文行数
    dimmedTextColor: string; // 暗色文本颜色
    fontColor: string;      // 高亮文本颜色
  };
  currentPosition: number;
}

export const ScrollView: React.FC<ScrollViewProps> = ({
  text,
  settings,
  currentPosition
}) => {
  const lineHeight = 40;
  const totalLines = 1 + (settings.contextLines * 2);
  const containerHeight = lineHeight * totalLines;

  // 将文本按chunkSize分割成块
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += settings.chunkSize) {
    chunks.push(text.slice(i, i + settings.chunkSize));
  }

  const currentChunk = Math.min(currentPosition, chunks.length - 1);

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
      color: idx === currentChunk ? settings.fontColor : settings.dimmedTextColor,
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
              className="text-center py-2 w-full h-[40px] flex items-center justify-center"
              custom={idx}
              variants={itemVariants}
              animate="animate"
              style={{
                fontSize: `${settings.fontSize}px`
              }}
            >
              {chunk}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}; 
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TextProcessor, TextBlock } from '../../../utils/textProcessor';

interface PageViewProps {
  text: string;
  settings: {
    chunkSize: number;      // 每组字数
    textAreaWidth: number;  // 容器宽度（像素）
    fontSize: number;       // 字体大小
    lineSpacing: number;    // 行间距
    blockSpacing: number;   // 块间距
  };
  currentPosition: number;
}

export const PageView: React.FC<PageViewProps> = ({
  text,
  settings,
  currentPosition
}) => {
  // 初始化文本处理器
  const textProcessor = new TextProcessor({
    chunkSize: settings.chunkSize
  });

  // 处理文本
  const blocks = textProcessor.processText(text);

  return (
    <div 
      className="flex flex-wrap"
      style={{ 
        width: `${settings.textAreaWidth}px`,
        fontSize: `${settings.fontSize}px`,
        gap: `${settings.lineSpacing}px ${settings.blockSpacing}px`,
      }}
    >
      {blocks.map((block: TextBlock, blockIndex: number) => (
        <motion.span
          key={blockIndex}
          className={`inline-block transition-colors duration-200 ${
            block.isPartial ? 'text-gray-500' : ''
          }`}
          style={{
            color: blockIndex <= currentPosition ? '#000' : '#666',
            opacity: blockIndex === currentPosition ? 1 : 0.8
          }}
        >
          {block.text}
        </motion.span>
      ))}
    </div>
  );
}; 